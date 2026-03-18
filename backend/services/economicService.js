// backend/services/economicService.js
// Fetches all 6 economic metrics from World Bank API
// 24-hour in-memory cache — one fetch serves all users

'use strict';

const https = require('https');

// ── World Bank indicator codes ──────────────────────────────────────────────
const INDICATORS = {
  gdp:        'NY.GDP.MKTP.CD',      // GDP (current USD)
  gdpGrowth:  'NY.GDP.MKTP.KD.ZG',  // GDP growth (annual %)
  defense:    'MS.MIL.XPND.GD.ZS',  // Military expenditure (% of GDP)
  debt:       'GC.DOD.TOTL.GD.ZS',  // Central govt debt (% of GDP)
  inflation:  'FP.CPI.TOTL.ZG',     // Inflation, consumer prices (annual %)
  energyExp:  'TX.VAL.FUEL.ZS.UN',  // Fuel exports (% of merchandise exports)
  trade:      'NE.TRD.GNFS.ZS',     // Trade (% of GDP)
};

// Sanctions list — curated ISO3 codes under major sanction regimes
const SANCTIONED = new Set([
  'RUS','IRN','PRK','SYR','CUB','VEN','BLR','MMR',
  'SDN','ZWE','LBY','SOM','YEM','CAF','COD','GNB',
  'HTI','IRQ','MLI','NIC',
]);

// ── Cache ────────────────────────────────────────────────────────────────────
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

// ── HTTP helper ──────────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error('HTTP ' + res.statusCode + ' for ' + url));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        try { resolve(JSON.parse(Buffer.concat(chunks).toString())); }
        catch (e) { reject(e); }
      });
      res.on('error', reject);
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

// ── Fetch one World Bank indicator for all countries ─────────────────────────
async function fetchIndicator(code) {
  // World Bank returns paginated results — fetch up to 300 countries at once
  const url = `https://api.worldbank.org/v2/country/all/indicator/${code}?format=json&mrv=5&per_page=300&gapfill=Y`;
  const data = await fetchJSON(url);
  // data[0] = metadata, data[1] = array of records
  const records = Array.isArray(data) && data[1] ? data[1] : [];

  // Collapse to map: iso3 → most recent non-null value
  const map = {};
  for (const r of records) {
    if (!r.country || !r.countryiso3code || r.value === null) continue;
    const iso3 = r.countryiso3code;
    if (!map[iso3]) map[iso3] = r.value; // mrv=5 returns newest first
  }
  return map;
}

// ── Score helpers ─────────────────────────────────────────────────────────────
function clamp(v, min, max) { return Math.min(Math.max(v, min), max); }

function normalize(value, min, max, invert = false) {
  if (value === null || value === undefined) return 50; // world average fallback
  const clamped = clamp(value, min, max);
  const score = ((clamped - min) / (max - min)) * 100;
  return invert ? 100 - score : score;
}

// ── Calculate Economic War Index score (0–100) ────────────────────────────────
function calcScore(d) {
  // GDP size: log scale $10B–$30T → 0–100
  const gdpScore = d.gdp
    ? normalize(Math.log10(Math.max(d.gdp, 1e9)), Math.log10(1e10), Math.log10(3e13))
    : 30;

  // GDP growth: -5% to +10% → 0–100
  const growthScore = normalize(d.gdpGrowth, -5, 10);

  // Defense % GDP: 0–6% → 0–100 (more = higher war capacity)
  const defenseScore = normalize(d.defense, 0, 6);

  // Debt: 0–150% → 0–100, inverted (less debt = better)
  const debtScore = normalize(d.debt, 0, 150, true);

  // Inflation: 0–30% → 0–100, inverted (lower = better)
  const inflationScore = normalize(d.inflation, -2, 30, true);

  // Energy exports: 0–100% of exports → 0–100
  const energyScore = normalize(d.energyExp, 0, 100);

  // Trade: 20–200% of GDP → 0–100
  const tradeScore = normalize(d.trade, 20, 200);

  // Sanctions penalty
  const sanctionPenalty = d.sanctioned ? 15 : 0;

  const raw = (
    gdpScore     * 0.22 +
    growthScore  * 0.12 +
    defenseScore * 0.22 +
    debtScore    * 0.12 +
    inflationScore * 0.12 +
    energyScore  * 0.12 +
    tradeScore   * 0.08
  ) - sanctionPenalty;

  return Math.round(clamp(raw, 0, 100));
}

function scoreTier(score) {
  if (score >= 75) return 'DOMINANT';
  if (score >= 60) return 'STRONG';
  if (score >= 45) return 'MODERATE';
  if (score >= 30) return 'WEAK';
  return 'FRAGILE';
}

// ── Main fetch + score function ───────────────────────────────────────────────
async function getEconomicIndex() {
  // Serve from cache if fresh
  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    return cache;
  }

  console.log('[economic] Fetching World Bank data...');

  // Fetch all indicators in parallel
  const [gdpMap, growthMap, defenseMap, debtMap, inflationMap, energyMap, tradeMap] =
    await Promise.all([
      fetchIndicator(INDICATORS.gdp),
      fetchIndicator(INDICATORS.gdpGrowth),
      fetchIndicator(INDICATORS.defense),
      fetchIndicator(INDICATORS.debt),
      fetchIndicator(INDICATORS.inflation),
      fetchIndicator(INDICATORS.energyExp),
      fetchIndicator(INDICATORS.trade),
    ]);

  // Build union of all country ISO3 codes
  const allIso3 = new Set([
    ...Object.keys(gdpMap),
    ...Object.keys(growthMap),
    ...Object.keys(defenseMap),
  ]);

  // World Bank includes aggregates (e.g. 'WLD', 'EUU') — filter to real countries
  // Real country ISO3 codes are 3 letters, no numbers, and WB uses specific ones
  const SKIP = new Set(['WLD','HIC','LMC','UMC','LIC','EUU','ECS','LCN','SAS',
    'SSF','EAP','NAC','MEA','ARB','CSS','EMU','FCS','HPC','IBD','IBT','IDA',
    'IDB','IDX','LAC','MIC','MNA','OED','OSS','PRE','PSS','PST','SSA','SST',
    'TEA','TEC','TLA','TMN','TSA','TSS','ZQA','INX','LDC','LMY','NOC','OEC']);

  const countries = [];

  for (const iso3 of allIso3) {
    if (iso3.length !== 3 || SKIP.has(iso3) || /\d/.test(iso3)) continue;

    const d = {
      iso3,
      gdp:        gdpMap[iso3]      ?? null,
      gdpGrowth:  growthMap[iso3]   ?? null,
      defense:    defenseMap[iso3]  ?? null,
      debt:       debtMap[iso3]     ?? null,
      inflation:  inflationMap[iso3] ?? null,
      energyExp:  energyMap[iso3]   ?? null,
      trade:      tradeMap[iso3]    ?? null,
      sanctioned: SANCTIONED.has(iso3),
    };

    const score = calcScore(d);
    const tier  = scoreTier(score);

    countries.push({
      iso3,
      score,
      tier,
      sanctioned: d.sanctioned,
      metrics: {
        gdp:       d.gdp,
        gdpGrowth: d.gdpGrowth,
        defense:   d.defense,
        debt:      d.debt,
        inflation: d.inflation,
        energyExp: d.energyExp,
        trade:     d.trade,
      },
    });
  }

  // Sort by score descending, assign rank
  countries.sort((a, b) => b.score - a.score);
  countries.forEach((c, i) => { c.rank = i + 1; });

  console.log(`[economic] Scored ${countries.length} countries. Cache set.`);

  cache = countries;
  cacheTime = Date.now();
  return countries;
}

// Single country lookup
async function getCountryEconomic(iso3) {
  const all = await getEconomicIndex();
  return all.find(c => c.iso3 === iso3.toUpperCase()) ?? null;
}

// Force cache refresh
function clearCache() {
  cache = null;
  cacheTime = 0;
}

module.exports = { getEconomicIndex, getCountryEconomic, clearCache };