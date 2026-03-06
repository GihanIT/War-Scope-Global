// src/pages/Compare.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navbar   from '../components/Navbar.jsx';
import AdBanner from '../components/AdBanner.jsx';

// ─── Config ───────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const STATS = [
  { key: 'active_personnel',        label: 'Active Personnel',   emoji: '👥', format: 'number' },
  { key: 'reserve_personnel',       label: 'Reserve Personnel',  emoji: '🪖', format: 'number' },
  { key: 'tanks',                   label: 'Tanks',              emoji: '🚗', format: 'number' },
  { key: 'total_military_aircraft', label: 'Total Aircraft',     emoji: '✈️',  format: 'number' },
  { key: 'fighter_aircraft',        label: 'Fighter Aircraft',   emoji: '⚔️',  format: 'number' },
  { key: 'attack_helicopters',      label: 'Attack Helicopters', emoji: '🚁', format: 'number' },
  { key: 'total_naval_fleet',       label: 'Naval Fleet',        emoji: '🚢', format: 'number' },
  { key: 'defense_budget_usd',      label: 'Defense Budget',     emoji: '💰', format: 'budget' },
  { key: 'nuclear_weapons',         label: 'Nuclear Weapons',    emoji: '☢️',  format: 'nuclear' },
];

// ─── CSS ──────────────────────────────────────────────────────────────────────
const COMPARE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Barlow:wght@300;400;600;700;900&display=swap');

  .cmp-select {
    width: 100%;
    background: #0f1117;
    color: #e8eaf0;
    border-radius: 8px;
    padding: 12px 40px 12px 16px;
    font-size: 14px;
    font-family: 'Barlow', system-ui, sans-serif;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    outline: none;
    transition: border-color 160ms, box-shadow 160ms;
  }
  .cmp-select:focus { box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
  .cmp-select option { background: #0f1117; color: #e8eaf0; }
  .cmp-select-a { border: 2px solid #00d4ff; }
  .cmp-select-a:focus { border-color: #33ddff; }
  .cmp-select-b { border: 2px solid #ff3b3b; }
  .cmp-select-b:focus { border-color: #ff6b6b; }

  .cmp-bar-track {
    width: 100%;
    height: 5px;
    background: rgba(255,255,255,0.06);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 6px;
  }
  .cmp-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 700ms cubic-bezier(0.16,1,0.3,1);
  }

  .cmp-stat-row {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 14px 20px;
    border-bottom: 1px solid rgba(30,36,51,0.5);
    transition: background 120ms;
  }
  .cmp-stat-row:hover { background: rgba(255,255,255,0.02); }
  .cmp-stat-row:last-child { border-bottom: none; }

  .cmp-action-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 7px;
    padding: 12px 22px;
    font-family: 'Barlow', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 150ms, box-shadow 150ms, background 150ms, color 150ms, border-color 150ms;
    letter-spacing: -0.01em;
    white-space: nowrap;
    border: none;
  }
  .cmp-action-btn:hover  { transform: translateY(-1px); }
  .cmp-action-btn:active { transform: translateY(0); }

  .cmp-skeleton {
    background: linear-gradient(90deg, #1a2030 25%, #232c3d 50%, #1a2030 75%);
    background-size: 200% 100%;
    animation: cmp-shimmer 1.5s ease-in-out infinite;
    border-radius: 4px;
  }
  @keyframes cmp-shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  @keyframes cmp-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .cmp-fade-up { animation: cmp-fade-up 350ms ease both; }

  @keyframes cmp-bar-grow {
    from { transform: scaleX(0); transform-origin: left; }
    to   { transform: scaleX(1); transform-origin: left; }
  }

  @keyframes cmp-bounce {
    0%,100% { transform: scale(1); }
    40%     { transform: scale(1.12); }
  }
  .cmp-copied-anim { animation: cmp-bounce 300ms ease; }

  /* ── Responsive ─────────────────────────── */
  @media (max-width: 768px) {
    .cmp-selector-row  { flex-direction: column !important; }
    .cmp-vs-wrap       { margin: 0 auto !important; }
    .cmp-stat-row      { flex-direction: column !important; align-items: stretch !important; gap: 8px !important; }
    .cmp-stat-center   { order: -1; flex-direction: row !important; gap: 8px !important; justify-content: flex-start !important; padding: 0 !important; }
    .cmp-stat-side-b   { flex-direction: row-reverse !important; text-align: left !important; }
    .cmp-header-grid   { grid-template-columns: 1fr !important; }
    .cmp-actions-row   { flex-direction: column !important; }
    .cmp-actions-row button { width: 100% !important; }
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

// ─── Format helpers ───────────────────────────────────────────────────────────
function formatBudget(v) {
  const n = Number(v);
  if (!n) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(0)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`;
  return `$${(n / 1e3).toFixed(0)}K`;
}

function fmtVal(v, format) {
  const n = Number(v) || 0;
  if (format === 'budget')  return { text: formatBudget(v), isEmpty: !n };
  if (format === 'nuclear') return { text: n > 0 ? n.toLocaleString() : 'None', isEmpty: n === 0 };
  return { text: n > 0 ? n.toLocaleString() : '0', isEmpty: n === 0 };
}

// ─── Skeleton placeholder rows ────────────────────────────────────────────────
function SkeletonRows() {
  return (
    <div>
      {STATS.map((_, i) => (
        <div key={i} className="cmp-stat-row" style={{ gap: 20 }}>
          <div style={{ flex: 1 }}>
            <div className="cmp-skeleton" style={{ height: 14, width: '60%', marginLeft: 'auto', marginBottom: 6 }} />
            <div className="cmp-skeleton" style={{ height: 5 }} />
          </div>
          <div style={{ width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div className="cmp-skeleton" style={{ height: 18, width: 18, borderRadius: '50%' }} />
            <div className="cmp-skeleton" style={{ height: 8, width: 70 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="cmp-skeleton" style={{ height: 14, width: '55%', marginBottom: 6 }} />
            <div className="cmp-skeleton" style={{ height: 5 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Country selector card ────────────────────────────────────────────────────
function SelectorCard({ side, countries, iso, setIso, countryData }) {
  const isA    = side === 'a';
  const accent = isA ? '#00d4ff' : '#ff3b3b';
  const label  = isA ? 'Country A' : 'Country B';

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{
        fontFamily:    "'IBM Plex Mono', monospace",
        fontSize:      9,
        letterSpacing: '0.18em',
        color:         accent,
        textTransform: 'uppercase',
        marginBottom:  8,
        opacity:       0.85,
      }}>
        {label}
      </div>

      {/* Dropdown wrapper */}
      <div style={{ position: 'relative' }}>
        <select
          className={`cmp-select cmp-select-${side}`}
          value={iso}
          onChange={e => setIso(e.target.value)}
        >
          <option value="">— Select country —</option>
          {countries.map(c => (
            <option key={c.iso3} value={c.iso3}>{c.name}</option>
          ))}
        </select>
        <svg
          width="14" height="14" viewBox="0 0 24 24"
          fill="none" stroke="#4a5568" strokeWidth="2.5"
          style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>

      {/* Flag + name preview */}
      {iso && countryData?.country && (
        <div className="cmp-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
          {countryData.country.iso2 && (
            <img
              src={`https://flagcdn.com/w40/${countryData.country.iso2.toLowerCase()}.png`}
              alt={countryData.country.name}
              style={{ height: 18, borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          )}
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: accent }}>
            {countryData.country.name}
          </span>
          {countryData.country.rank && (
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#4a5568' }}>
              GFP #{countryData.country.rank}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Country header card (full) ───────────────────────────────────────────────
function CountryHeaderCard({ data, side }) {
  const accent  = side === 'a' ? '#00d4ff' : '#ff3b3b';
  const country = data?.country ?? {};

  return (
    <div style={{
      background:   '#0f1117',
      border:       `1px solid ${accent}33`,
      borderTop:    `3px solid ${accent}`,
      borderRadius: 8,
      padding:      '18px 20px',
      display:      'flex',
      alignItems:   'center',
      gap:          14,
    }}>
      {country.iso2 && (
        <img
          src={`https://flagcdn.com/w80/${country.iso2.toLowerCase()}.png`}
          alt={country.name}
          style={{ width: 56, height: 38, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)', flexShrink: 0 }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      )}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 17, fontWeight: 700, color: '#e8eaf0', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {country.name ?? '—'}
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 3, alignItems: 'center' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: accent, opacity: 0.8 }}>
            {country.iso3}
          </span>
          {country.rank && (
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#4a5568' }}>
              GFP #{country.rank}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Individual stat comparison row ──────────────────────────────────────────
function StatRow({ stat, valA, valB, animDelay }) {
  const nA  = Number(valA) || 0;
  const nB  = Number(valB) || 0;
  const max = Math.max(nA, nB, 1);
  const pA  = Math.round((nA / max) * 100);
  const pB  = Math.round((nB / max) * 100);

  // Winner coloring
  const aWins  = nA > nB;
  const bWins  = nB > nA;
  const tied   = nA === nB && nA > 0;

  const colorA = (aWins || tied) ? '#00d4ff' : '#ff3b3b';
  const colorB = (bWins || tied) ? '#ff3b3b' : '#ff3b3b44';
  const dimB   = !bWins && !tied;

  const fA = fmtVal(valA, stat.format);
  const fB = fmtVal(valB, stat.format);

  return (
    <div
      className="cmp-stat-row cmp-fade-up"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Side A */}
      <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize:   15,
          fontWeight: 700,
          color:      fA.isEmpty && stat.format === 'nuclear' ? '#8892a4' : colorA,
          lineHeight: 1.2,
          textShadow: aWins ? `0 0 12px ${colorA}55` : 'none',
        }}>
          {fA.text}
        </div>
        <div className="cmp-bar-track">
          <div
            className="cmp-bar-fill"
            style={{
              width:      `${pA}%`,
              background: colorA,
              marginLeft: 'auto',
              boxShadow:  aWins ? `0 0 6px ${colorA}88` : 'none',
              float:      'right',
            }}
          />
        </div>
      </div>

      {/* Center */}
      <div
        className="cmp-stat-center"
        style={{
          width:          100,
          flexShrink:     0,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          gap:            4,
          padding:        '0 4px',
        }}
      >
        <span style={{ fontSize: 18, lineHeight: 1 }}>{stat.emoji}</span>
        <span style={{
          fontFamily:    "'IBM Plex Mono', monospace",
          fontSize:      9,
          color:         '#4a5568',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textAlign:     'center',
          lineHeight:    1.3,
        }}>
          {stat.label}
        </span>
      </div>

      {/* Side B */}
      <div className="cmp-stat-side-b" style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize:   15,
          fontWeight: 700,
          color:      fB.isEmpty && stat.format === 'nuclear' ? '#8892a4' : (dimB ? '#ff3b3b44' : '#ff3b3b'),
          lineHeight: 1.2,
          textShadow: bWins ? '0 0 12px rgba(255,59,59,0.4)' : 'none',
        }}>
          {fB.text}
        </div>
        <div className="cmp-bar-track">
          <div
            className="cmp-bar-fill"
            style={{
              width:      `${pB}%`,
              background: dimB ? 'rgba(255,59,59,0.2)' : '#ff3b3b',
              boxShadow:  bWins ? '0 0 6px rgba(255,59,59,0.6)' : 'none',
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Winner banner ────────────────────────────────────────────────────────────
function WinnerBanner({ dataA, dataB }) {
  const sA = dataA?.stats ?? {};
  const sB = dataB?.stats ?? {};
  let wA = 0, wB = 0;
  STATS.forEach(s => {
    const a = Number(sA[s.key]) || 0;
    const b = Number(sB[s.key]) || 0;
    if (a > b) wA++;
    else if (b > a) wB++;
  });

  const tied        = wA === wB;
  const winner      = tied ? null : (wA > wB ? dataA?.country : dataB?.country);
  const winnerColor = tied ? '#00d4ff' : (wA > wB ? '#00d4ff' : '#ff3b3b');

  return (
    <div className="cmp-fade-up" style={{
      background:   `${winnerColor}0d`,
      border:       `1px solid ${winnerColor}2a`,
      borderLeft:   `4px solid ${winnerColor}`,
      borderRadius: 8,
      padding:      '16px 20px',
      display:      'flex',
      alignItems:   'center',
      justifyContent: 'space-between',
      gap:          16,
      flexWrap:     'wrap',
      marginBottom: 16,
    }}>
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: winnerColor, opacity: 0.7, textTransform: 'uppercase', marginBottom: 5 }}>
          {tied ? 'Result' : 'Overall Leader'}
        </div>
        <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 22, fontWeight: 800, color: '#e8eaf0', letterSpacing: '-0.02em' }}>
          {tied ? 'Evenly Matched' : winner?.name}
        </div>
        <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 13, color: '#8892a4', marginTop: 2 }}>
          {STATS.length} categories compared
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.14em', color: '#4a5568', textTransform: 'uppercase', marginBottom: 5 }}>
          Category Wins
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 28, fontWeight: 900, color: '#00d4ff', letterSpacing: '-0.03em' }}>{wA}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#2a3555' }}>—</span>
          <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 28, fontWeight: 900, color: '#ff3b3b', letterSpacing: '-0.03em' }}>{wB}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Compare page ─────────────────────────────────────────────────────────────
export default function Compare() {
  injectCSS('compare-page-css', COMPARE_CSS);

  const navigate                        = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [countries, setCountries] = useState([]);
  const [isoA,      setIsoA]      = useState('');
  const [isoB,      setIsoB]      = useState('');
  const [dataA,     setDataA]     = useState(null);
  const [dataB,     setDataB]     = useState(null);
  const [loadingA,  setLoadingA]  = useState(false);
  const [loadingB,  setLoadingB]  = useState(false);
  const [copied,    setCopied]    = useState(false);
  const copyBtnRef                = useRef(null);

  // ── Load country list + read URL params ─────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/countries`)
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        setCountries([...list].sort((a, b) => a.name.localeCompare(b.name)));

        // Pre-select from ?a=USA&b=RUS or ?countries=USA,RUS
        const pa = searchParams.get('a');
        const pb = searchParams.get('b');
        const pc = searchParams.get('countries');
        if (pa) setIsoA(pa.toUpperCase());
        if (pb) setIsoB(pb.toUpperCase());
        if (!pa && !pb && pc) {
          const [x, y] = pc.split(',').map(s => s.trim().toUpperCase());
          if (x) setIsoA(x);
          if (y) setIsoB(y);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line

  // ── Fetch military A ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isoA) { setDataA(null); return; }
    setLoadingA(true);
    fetch(`${API}/api/countries/${isoA}/military`)
      .then(r => r.ok ? r.json() : null)
      .then(setDataA).catch(() => setDataA(null))
      .finally(() => setLoadingA(false));
  }, [isoA]);

  // ── Fetch military B ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isoB) { setDataB(null); return; }
    setLoadingB(true);
    fetch(`${API}/api/countries/${isoB}/military`)
      .then(r => r.ok ? r.json() : null)
      .then(setDataB).catch(() => setDataB(null))
      .finally(() => setLoadingB(false));
  }, [isoB]);

  // ── Sync URL ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const p = {};
    if (isoA) p.a = isoA;
    if (isoB) p.b = isoB;
    setSearchParams(p, { replace: true });
  }, [isoA, isoB, setSearchParams]);

  // ── Share ──────────────────────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    const url = `${window.location.origin}/compare?a=${isoA}&b=${isoB}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        copyBtnRef.current?.classList.add('cmp-copied-anim');
        setTimeout(() => {
          setCopied(false);
          copyBtnRef.current?.classList.remove('cmp-copied-anim');
        }, 2000);
      })
      .catch(() => { window.prompt('Copy this URL:', url); });
  }, [isoA, isoB]);

  const bothSelected = !!(isoA && isoB);
  const bothLoaded   = !!(dataA && dataB && !loadingA && !loadingB);
  const isLoading    = loadingA || loadingB;
  const sA           = dataA?.stats ?? {};
  const sB           = dataB?.stats ?? {};

  const pageTitle = bothLoaded
    ? `${dataA.country?.name ?? isoA} vs ${dataB.country?.name ?? isoB} | WarScope`
    : 'Compare Military Power | WarScope';

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0f' }}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Compare military strength of any two countries — personnel, armor, air power, naval assets, defense budgets and nuclear arsenals side by side." />
        {bothLoaded && <link rel="canonical" href={`https://warscope.com/compare?a=${isoA}&b=${isoB}`} />}
      </Helmet>

      <Navbar />

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,32px)' }}>

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="cmp-fade-up" style={{ marginBottom: 40, position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: '-32px -40px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.05) 0%, transparent 60%)',
            pointerEvents: 'none', zIndex: 0,
          }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: '#00d4ff', opacity: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>
              Intelligence Analysis
            </div>
            <h1 style={{
              fontFamily: "'Barlow', system-ui, sans-serif",
              fontSize:   'clamp(26px, 5vw, 48px)',
              fontWeight: 900,
              color:      '#e8eaf0',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin:     0,
              marginBottom: 10,
            }}>
              Military Power<br />
              <span style={{ color: '#00d4ff' }}>Comparison</span>
            </h1>
            <p style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 15, color: '#8892a4', margin: 0 }}>
              Select two nations to compare armed forces head-to-head across 9 key metrics
            </p>
          </div>
        </div>

        {/* ── Selector row ─────────────────────────────────────────────── */}
        <div
          className="cmp-fade-up cmp-selector-row"
          style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 24, animationDelay: '60ms' }}
        >
          <SelectorCard side="a" countries={countries} iso={isoA} setIso={setIsoA} countryData={dataA} />

          {/* VS */}
          <div className="cmp-vs-wrap" style={{ flexShrink: 0, paddingTop: 28, margin: '0 4px' }}>
            <div style={{
              fontFamily: "'Barlow', system-ui, sans-serif",
              fontSize:   32,
              fontWeight: 900,
              color:      '#ff3b3b',
              lineHeight: 1,
              textShadow: '0 0 24px rgba(255,59,59,0.4)',
              letterSpacing: '-0.04em',
              userSelect: 'none',
            }}>
              VS
            </div>
          </div>

          <SelectorCard side="b" countries={countries} iso={isoB} setIso={setIsoB} countryData={dataB} />
        </div>

        {/* ── Ad banner ────────────────────────────────────────────────── */}
        <AdBanner id="ad-compare" size="728x90" />

        {/* ── Empty state ──────────────────────────────────────────────── */}
        {!bothSelected && (
          <div className="cmp-fade-up" style={{
            marginTop:    32,
            border:       '1px dashed #1e2433',
            borderRadius: 10,
            padding:      'clamp(40px,8vw,80px) 24px',
            textAlign:    'center',
            animationDelay: '100ms',
          }}>
            {/* Decorative grid */}
            <div style={{
              position:   'relative',
              display:    'inline-block',
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 48, lineHeight: 1, opacity: 0.25 }}>⚖️</div>
            </div>
            <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 18, fontWeight: 600, color: '#e8eaf0', marginBottom: 8 }}>
              Choose Your Nations
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#4a5568', letterSpacing: '0.06em', maxWidth: 320, margin: '0 auto' }}>
              {!isoA && !isoB ? 'Select two countries above to begin'
               : !isoB       ? 'Now select Country B'
               : 'Now select Country A'}
            </div>

            {/* Quick-select suggestions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
              {[['USA','RUS'],['CHN','USA'],['IND','PAK'],['USA','CHN']].map(([a, b]) => (
                <button
                  key={`${a}-${b}`}
                  onClick={() => { setIsoA(a); setIsoB(b); }}
                  style={{
                    background:   'rgba(0,212,255,0.05)',
                    border:       '1px solid rgba(0,212,255,0.15)',
                    borderRadius: 6,
                    padding:      '7px 14px',
                    fontFamily:   "'IBM Plex Mono', monospace",
                    fontSize:     11,
                    color:        '#00d4ff',
                    cursor:       'pointer',
                    letterSpacing: '0.08em',
                    transition:   'background 150ms',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.05)'}
                >
                  {a} vs {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────────── */}
        {bothSelected && (
          <div style={{ marginTop: 32 }}>

            {/* Country header cards */}
            {bothLoaded && (
              <div
                className="cmp-fade-up cmp-header-grid"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}
              >
                <CountryHeaderCard data={dataA} side="a" />
                <CountryHeaderCard data={dataB} side="b" />
              </div>
            )}

            {/* Winner banner */}
            {bothLoaded && <WinnerBanner dataA={dataA} dataB={dataB} />}

            {/* Stats table */}
            <div style={{
              background:   '#0f1117',
              border:       '1px solid #1e2433',
              borderRadius: 10,
              overflow:     'hidden',
              marginBottom: 24,
            }}>
              {/* Header row */}
              <div style={{
                display:      'flex',
                alignItems:   'center',
                gap:          20,
                padding:      '12px 20px',
                background:   'rgba(255,255,255,0.025)',
                borderBottom: '1px solid #1e2433',
              }}>
                <div style={{ flex: 1, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#00d4ff', textAlign: 'right', letterSpacing: '0.06em' }}>
                  {dataA?.country?.name ?? isoA}
                </div>
                <div style={{ width: 100, textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: '#2a3555', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Metric
                </div>
                <div style={{ flex: 1, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#ff3b3b', letterSpacing: '0.06em' }}>
                  {dataB?.country?.name ?? isoB}
                </div>
              </div>

              {isLoading
                ? <SkeletonRows />
                : STATS.map((stat, i) => (
                    <StatRow
                      key={stat.key}
                      stat={stat}
                      valA={sA[stat.key]}
                      valB={sB[stat.key]}
                      animDelay={i * 45}
                    />
                  ))
              }
            </div>

            {/* Action buttons */}
            {bothLoaded && (
              <div className="cmp-actions-row" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  className="cmp-action-btn"
                  onClick={() => navigate(`/?countries=${isoA},${isoB}`)}
                  style={{ background: '#00d4ff', color: '#0a0a0f', boxShadow: '0 4px 16px rgba(0,212,255,0.22)', flex: '1 1 auto', maxWidth: 240 }}
                >
                  🌍 View on Globe
                </button>
                <button
                  ref={copyBtnRef}
                  className="cmp-action-btn"
                  onClick={handleShare}
                  style={{
                    background:  'transparent',
                    color:       copied ? '#00ff88' : '#e8eaf0',
                    border:      `1px solid ${copied ? 'rgba(0,255,136,0.4)' : '#1e2433'}`,
                    flex:        '1 1 auto',
                    maxWidth:    240,
                  }}
                >
                  {copied ? '✓ Copied!' : '📋 Share Comparison'}
                </button>
                <button
                  className="cmp-action-btn"
                  onClick={() => { setIsoA(''); setIsoB(''); }}
                  style={{ background: 'transparent', color: '#8892a4', border: '1px solid #1e2433', flex: '0 0 auto' }}
                >
                  ↺ Reset
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}