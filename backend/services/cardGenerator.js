'use strict';

const sharp = require('sharp');
const https = require('https');

// Increased height to 800 to prevent overlapping elements
const W = 1200;
const H = 800; 

const CYAN  = '#00d4ff';
const CYAN_GLOW = 'rgba(0, 212, 255, 0.4)';
const RED   = '#ff3b3b';
const RED_GLOW = 'rgba(255, 59, 59, 0.4)';
const WHITE = '#ffffff';
const DIM   = '#8c9ab8';
const DARK  = '#0a0d17'; // Slightly softer dark background

const STATS = [
  { key: 'active_personnel',        label: 'PERSONNEL',   format: 'number' },
  { key: 'tanks',                   label: 'TANKS',       format: 'number' },
  { key: 'total_military_aircraft', label: 'AIRCRAFT',    format: 'number' },
  { key: 'fighter_aircraft',        label: 'FIGHTERS',    format: 'number' },
  { key: 'attack_helicopters',      label: 'HELICOPTERS', format: 'number' },
  { key: 'total_naval_fleet',       label: 'NAVAL',       format: 'number' },
  { key: 'defense_budget_usd',      label: 'BUDGET',      format: 'budget'  },
  { key: 'nuclear_weapons',         label: 'NUCLEAR',     format: 'nuclear' },
];

function fmt(v, format) {
  const n = Number(v) || 0;
  if (format === 'budget') {
    if (!n) return '—';
    if (n >= 1e12) return '$' + (n/1e12).toFixed(1) + 'T';
    if (n >= 1e9)  return '$' + (n/1e9).toFixed(1)  + 'B';
    if (n >= 1e6)  return '$' + (n/1e6).toFixed(0)  + 'M';
    return '$' + (n/1e3).toFixed(0) + 'K';
  }
  if (format === 'nuclear') return n > 0 ? n.toLocaleString() : 'NONE';
  if (n === 0) return '0';
  if (n >= 1e6)  return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3)  return (n/1e3).toFixed(0) + 'K';
  return n.toLocaleString();
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fetchFlag(iso2) {
  if (!iso2) return Promise.resolve(null);
  return new Promise(resolve => {
    https.get('https://flagcdn.com/w160/' + iso2.toLowerCase() + '.png', res => {
      if (res.statusCode !== 200) { res.resume(); resolve(null); return; }
      const c = []; res.on('data', d => c.push(d));
      res.on('end', () => resolve(Buffer.concat(c).toString('base64')));
      res.on('error', () => resolve(null));
    }).on('error', () => resolve(null));
  });
}

function buildSVG({ countryA, countryB, statsA, statsB, flagA64, flagB64 }) {
  const nA = esc((countryA.name || 'Country A').toUpperCase());
  const nB = esc((countryB.name || 'Country B').toUpperCase());
  const rA = countryA.rank ? `RANK #${countryA.rank}` : '';
  const rB = countryB.rank ? `RANK #${countryB.rank}` : '';

  const fontSize = (name) => name.length > 14 ? 26 : name.length > 10 ? 30 : 36;
  const fsA = fontSize(nA), fsB = fontSize(nB);

  // Win tally
  let wA = 0, wB = 0;
  STATS.forEach(s => {
    const a = Number(statsA[s.key]) || 0, b = Number(statsB[s.key]) || 0;
    if (a > b) wA++; else if (b > a) wB++;
  });
  const tied = wA === wB;
  const wColor = tied ? '#a0afc8' : (wA > wB ? CYAN : RED);
  const wLabel = tied ? 'EVENLY MATCHED' : `${wA > wB ? nA : nB} — TACTICAL EDGE`;

  const MID = W / 2;
  const FW = 108, FH = 72;

  const flagAsvg = flagA64
    ? `<image clip-path="url(#cA)" x="60" y="50" width="${FW}" height="${FH}" href="data:image/png;base64,${flagA64}" preserveAspectRatio="xMidYMid slice"/>
       <rect x="60" y="50" width="${FW}" height="${FH}" rx="8" fill="none" stroke="${CYAN}" stroke-width="2" stroke-opacity="0.8"/>`
    : `<rect x="60" y="50" width="${FW}" height="${FH}" rx="8" fill="#0e1420" stroke="${CYAN}" stroke-width="2" stroke-opacity="0.5"/>`;

  const flagBsvg = flagB64
    ? `<image clip-path="url(#cB)" x="${W - 60 - FW}" y="50" width="${FW}" height="${FH}" href="data:image/png;base64,${flagB64}" preserveAspectRatio="xMidYMid slice"/>
       <rect x="${W - 60 - FW}" y="50" width="${FW}" height="${FH}" rx="8" fill="none" stroke="${RED}" stroke-width="2" stroke-opacity="0.8"/>`
    : `<rect x="${W - 60 - FW}" y="50" width="${FW}" height="${FH}" rx="8" fill="#0e1420" stroke="${RED}" stroke-width="2" stroke-opacity="0.5"/>`;

  // Top Progress Bars for overall wins
  const total = Math.max(wA + wB, 1);
  const barW  = 260;
  const barAW = Math.round((wA / total) * barW);
  const barBW = Math.round((wB / total) * barW);

  // Layout Constants for Stats
  const ROW_TOP  = 410; // Moved down significantly to fix overlaps
  const ROW_H    = 42;  // Increased row height for breathing room
  const ROW_PAD_X= 40;
  const LABEL_X  = MID;
  const BAR_GAP  = 90;  // Space from center text to start of bar
  const BAR_MAX  = 200; // Max width of stat bars
  const TEXT_GAP = 20;  // Space from end of bar to the number text

  let rows = '';
  STATS.forEach((stat, i) => {
    const y = ROW_TOP + i * ROW_H;
    const vA = Number(statsA[stat.key]) || 0;
    const vB = Number(statsB[stat.key]) || 0;
    const mx = Math.max(vA, vB, 1);
    
    // Highlight colors based on who won the stat
    const cA = vA > vB ? CYAN : DIM;
    const cB = vB > vA ? RED  : DIM;
    const opacityA = vA > vB ? '1' : '0.4';
    const opacityB = vB > vA ? '1' : '0.4';

    const textA = esc(fmt(statsA[stat.key], stat.format));
    const textB = esc(fmt(statsB[stat.key], stat.format));

    // Alternating row backgrounds
    if (i % 2 === 0) {
        rows += `<rect x="${ROW_PAD_X}" y="${y}" width="${W - ROW_PAD_X*2}" height="${ROW_H}" fill="rgba(255,255,255,0.02)" rx="6"/>`;
    }

    // Math for bars growing outwards from the center
    const bA = Math.round((vA/mx) * BAR_MAX);
    const bB = Math.round((vB/mx) * BAR_MAX);
    const barY = y + ROW_H/2 - 3;
    const barH = 6;

    // --- LEFT SIDE (Country A) ---
    // Bar Track
    rows += `<rect x="${MID - BAR_GAP - BAR_MAX}" y="${barY}" width="${BAR_MAX}" height="${barH}" rx="3" fill="rgba(0,212,255,0.05)"/>`;
    // Bar Fill (Grows Left)
    if (bA > 0) {
        rows += `<rect x="${MID - BAR_GAP - bA}" y="${barY}" width="${bA}" height="${barH}" rx="3" fill="url(#gradCyan)" opacity="${opacityA}"/>`;
    }
    // Text Value (Outside the bar)
    rows += `<text x="${MID - BAR_GAP - BAR_MAX - TEXT_GAP}" y="${y + ROW_H/2 + 6}" text-anchor="end" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="${cA}">${textA}</text>`;

    // --- CENTER LABEL ---
    rows += `<text x="${LABEL_X}" y="${y + ROW_H/2 + 4}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="${DIM}" letter-spacing="2">${stat.label}</text>`;

    // --- RIGHT SIDE (Country B) ---
    // Bar Track
    rows += `<rect x="${MID + BAR_GAP}" y="${barY}" width="${BAR_MAX}" height="${barH}" rx="3" fill="rgba(255,59,59,0.05)"/>`;
    // Bar Fill (Grows Right)
    if (bB > 0) {
        rows += `<rect x="${MID + BAR_GAP}" y="${barY}" width="${bB}" height="${barH}" rx="3" fill="url(#gradRed)" opacity="${opacityB}"/>`;
    }
    // Text Value (Outside the bar)
    rows += `<text x="${MID + BAR_GAP + BAR_MAX + TEXT_GAP}" y="${y + ROW_H/2 + 6}" text-anchor="start" font-family="system-ui, sans-serif" font-size="20" font-weight="800" fill="${cB}">${textB}</text>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="cA"><rect x="60" y="50" width="${FW}" height="${FH}" rx="8"/></clipPath>
    <clipPath id="cB"><rect x="${W-60-FW}" y="50" width="${FW}" height="${FH}" rx="8"/></clipPath>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0L0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" stroke-width="1"/>
    </pattern>
    <linearGradient id="gradCyan" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stop-color="${CYAN}" />
        <stop offset="100%" stop-color="#0055ff" />
    </linearGradient>
    <linearGradient id="gradRed" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${RED}" />
        <stop offset="100%" stop-color="#ff0055" />
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${DARK}"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  
  <rect x="0" y="0" width="${MID}" height="${H}" fill="url(#gradCyan)" opacity="0.02"/>
  <rect x="${MID}" y="0" width="${MID}" height="${H}" fill="url(#gradRed)" opacity="0.02"/>

  <rect x="0" y="0" width="${MID}" height="6" fill="url(#gradCyan)"/>
  <rect x="${MID}" y="0" width="${MID}" height="6" fill="url(#gradRed)"/>

  ${flagAsvg}
  <text x="${60+FW+24}" y="${50 + fsA * 0.85}" font-family="system-ui, sans-serif" font-size="${fsA}" font-weight="900" fill="${WHITE}" letter-spacing="1">${nA}</text>
  <text x="${60+FW+24}" y="${50 + fsA * 0.85 + 24}" font-family="monospace" font-size="13" fill="${CYAN}" letter-spacing="3">${rA}</text>

  <text x="${60}" y="220" font-family="system-ui, sans-serif" font-size="80" font-weight="900" fill="${CYAN}">${wA}</text>
  <text x="${120}" y="185" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="rgba(0,212,255,0.6)" letter-spacing="2">SECTORS</text>
  <text x="${120}" y="205" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="rgba(0,212,255,0.6)" letter-spacing="2">WON</text>
  <rect x="${60}" y="240" width="${barW}" height="6" rx="3" fill="rgba(255,255,255,0.05)"/>
  <rect x="${60}" y="240" width="${barAW}" height="6" rx="3" fill="url(#gradCyan)"/>

  <line x1="${MID}" y1="0" x2="${MID}" y2="280" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <rect x="${MID-40}" y="100" width="80" height="50" rx="25" fill="#131826" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <text x="${MID}" y="132" text-anchor="middle" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="${WHITE}" letter-spacing="1">VS</text>

  ${flagBsvg}
  <text x="${W-60-FW-24}" y="${50 + fsB * 0.85}" text-anchor="end" font-family="system-ui, sans-serif" font-size="${fsB}" font-weight="900" fill="${WHITE}" letter-spacing="1">${nB}</text>
  <text x="${W-60-FW-24}" y="${50 + fsB * 0.85 + 24}" text-anchor="end" font-family="monospace" font-size="13" fill="${RED}" letter-spacing="3">${rB}</text>

  <text x="${W-60}" y="220" text-anchor="end" font-family="system-ui, sans-serif" font-size="80" font-weight="900" fill="${RED}">${wB}</text>
  <text x="${W-120}" y="185" text-anchor="end" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="rgba(255,59,59,0.6)" letter-spacing="2">SECTORS</text>
  <text x="${W-120}" y="205" text-anchor="end" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="rgba(255,59,59,0.6)" letter-spacing="2">WON</text>
  <rect x="${W-60-barW}" y="240" width="${barW}" height="6" rx="3" fill="rgba(255,255,255,0.05)"/>
  <rect x="${W-60-barBW}" y="240" width="${barBW}" height="6" rx="3" fill="url(#gradRed)"/>

  <rect x="0" y="290" width="${W}" height="50" fill="#111622"/>
  <rect x="0" y="290" width="8" height="50" fill="${wColor}"/>
  <text x="30" y="320" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="${DIM}" letter-spacing="3">ASSESSMENT:</text>
  <text x="160" y="322" font-family="system-ui, sans-serif" font-size="22" font-weight="900" fill="${WHITE}" letter-spacing="1">${esc(wLabel)}</text>

  <text x="${MID - BAR_GAP - BAR_MAX/2}" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="${CYAN}" letter-spacing="3">${nA}</text>
  <text x="${MID}" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="${DIM}" letter-spacing="3">METRIC</text>
  <text x="${MID + BAR_GAP + BAR_MAX/2}" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="${RED}" letter-spacing="3">${nB}</text>
  <line x1="${ROW_PAD_X}" y1="395" x2="${W - ROW_PAD_X}" y2="395" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>

  ${rows}

  <rect x="0" y="${H-40}" width="${W}" height="40" fill="#05070a"/>
  <line x1="0" y1="${H-40}" x2="${W}" y2="${H-40}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
  <text x="40" y="${H-15}" font-family="monospace" font-size="12" font-weight="bold" fill="${DIM}" letter-spacing="2">WARSCOPEGLOBAL.COM</text>
  <text x="${W-40}" y="${H-15}" text-anchor="end" font-family="monospace" font-size="12" fill="${DIM}" letter-spacing="1">REAL-TIME MILITARY INTELLIGENCE</text>

  </svg>`;
}

async function generateCompareCard({ countryA, countryB, statsA, statsB }) {
  const [flagA64, flagB64] = await Promise.all([
    fetchFlag(countryA.iso2),
    fetchFlag(countryB.iso2),
  ]);
  const svg = buildSVG({ countryA, countryB, statsA, statsB, flagA64, flagB64 });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 7 }).toBuffer();
}

module.exports = { generateCompareCard };