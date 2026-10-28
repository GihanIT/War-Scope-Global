// backend/routes/conflictIntensity.js
// GET /api/conflict-intensity/:id — GDELT coverage volume for one conflict (30d)
// Register in server.js:
//   app.use('/api/conflict-intensity', require('./routes/conflictIntensity'));
//
// Uses GDELT timelinevol mode — returns daily coverage % of global news.
// Spike = major escalation event. Cached 3 hours per conflict.
// Rate limit: 1 req per 5.5s — concurrent requests queue, never fire in parallel.

'use strict';

const https  = require('https');
const Router = require('express').Router;
const router = Router();

// ── Per-conflict query keywords ───────────────────────────────────────────────
// Tight enough to avoid noise, broad enough to catch all coverage
const CONFLICT_QUERIES = {
  'ukraine':         '(ukraine OR kyiv OR kharkiv OR donetsk OR zaporizhzhia) (airstrike OR shelling OR offensive OR troops OR killed)',
  'gaza':            '(gaza OR rafah OR hamas OR "khan younis") (airstrike OR attack OR killed OR strike)',
  'iran':            '(iran OR tehran OR irgc) (attack OR strike OR missile OR killed OR military)',
  'lebanon':         '(lebanon OR beirut OR hezbollah) (airstrike OR strike OR attack OR killed)',
  'sudan':           '(sudan OR khartoum OR darfur OR rsf) (attack OR killed OR fighting OR airstrike)',
  'myanmar':         '(myanmar OR tatmadaw OR "shan state" OR karen OR kachin) (attack OR airstrike OR killed OR offensive)',
  'yemen':           '(yemen OR houthi OR sanaa OR hodeidah) (strike OR attack OR killed OR missile)',
  'syria':           '(syria OR damascus OR aleppo OR idlib) (attack OR killed OR airstrike OR offensive)',
  'somalia':         '(somalia OR mogadishu OR "al-shabaab") (attack OR killed OR airstrike)',
  'drc':             '(congo OR drc OR goma OR m23 OR kivu) (attack OR killed OR offensive OR fighting)',
  'mali':            '(mali OR bamako OR jnim OR sahel) (attack OR killed OR ambush OR jihadist)',
  'burkina':         '(burkina OR ouagadougou OR jnim) (attack OR killed OR jihadist)',
  'iraq':            '(iraq OR baghdad OR mosul OR isis) (attack OR killed OR bombing OR airstrike)',
  'afghanistan':     '(afghanistan OR kabul OR taliban OR kandahar) (attack OR killed OR bombing)',
  'pakistan':        '(pakistan OR peshawar OR ttp OR balochistan) (attack OR killed OR military)',
  'haiti':           '(haiti OR "port-au-prince") (gang OR killed OR attack OR kidnapping)',
  'colombia':        '(colombia OR eln OR farc OR bogota) (attack OR killed OR military)',
  'nigeria':         '(nigeria OR "boko haram" OR iswap OR bandits) (attack OR killed OR military)',
};

// ── Global sequential request queue ──────────────────────────────────────────
// All GDELT requests go through this queue — strictly one at a time, 6s apart.
// This prevents any parallel requests regardless of how many cards are open.
const _queue = [];
let   _qRunning = false;

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    _queue.push({ fn, resolve, reject });
    if (!_qRunning) drainQueue();
  });
}

async function drainQueue() {
  if (_qRunning || _queue.length === 0) return;
  _qRunning = true;
  while (_queue.length > 0) {
    const { fn, resolve, reject } = _queue.shift();
    try { resolve(await fn()); }
    catch (e) { reject(e); }
    if (_queue.length > 0) await new Promise(r => setTimeout(r, 6000));
  }
  _qRunning = false;
}

// Remove old simple throttle — replaced by queue above
async function gdeltThrottle() {} // kept for signature compat, no-op now

// ── HTTP fetch ────────────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const body = Buffer.concat(chunks).toString();
        if (res.statusCode === 429) { reject(new Error('GDELT rate limited')); return; }
        if (res.statusCode >= 400) { reject(new Error(`HTTP ${res.statusCode}`)); return; }
        try { resolve(JSON.parse(body)); }
        catch { reject(new Error('JSON parse failed')); }
      });
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

// ── In-memory cache: 3 hours per conflict ────────────────────────────────────
const _cache = {};
const TTL3H  = 3 * 3600000;

function fromCache(key) {
  const c = _cache[key];
  return c && Date.now() - c.t < TTL3H ? c.d : null;
}
function toCache(key, data) {
  _cache[key] = { d: data, t: Date.now() };
  return data;
}

// ── Parse GDELT date "20260219T000000Z" → "Feb 19" ───────────────────────────
function parseGdeltDate(str) {
  if (!str || str.length < 8) return str;
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const y = str.slice(0,4);
  const m = parseInt(str.slice(4,6)) - 1;
  const d = parseInt(str.slice(6,8));
  return `${months[m]} ${d}`;
}

// ── Detect spikes (values > mean + 1.5*stddev) ────────────────────────────────
function detectSpikes(data) {
  if (!data.length) return [];
  const vals  = data.map(d => d.value);
  const mean  = vals.reduce((a,b) => a+b, 0) / vals.length;
  const std   = Math.sqrt(vals.reduce((a,b) => a + (b-mean)**2, 0) / vals.length);
  const thresh = mean + 1.5 * std;
  return data
    .filter(d => d.value > thresh)
    .sort((a,b) => b.value - a.value)
    .slice(0, 5)
    .map(d => ({ date: d.label, value: Math.round(d.value * 100) / 100, raw: d.rawDate }));
}

// ── Fetch timelinevol for one conflict ──────────────────────────────────────
async function fetchIntensity(conflictId, timespan = '30d') {
  const cacheKey = `intensity_${conflictId}_${timespan}`;
  const cached   = fromCache(cacheKey);
  if (cached) return cached === '__error__' ? null : cached;

  const query = CONFLICT_QUERIES[conflictId];
  if (!query) return null;

  return enqueue(async () => {
    // Re-check cache — another queued request may have already fetched this
    const cached2 = fromCache(cacheKey);
    if (cached2) return cached2 === '__error__' ? null : cached2;

    console.log(`[intensity] Fetching GDELT timelinevol for: ${conflictId}`);

    const encoded = encodeURIComponent(`${query} sourcelang:eng`);
    const url     = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encoded}&mode=timelinevol&format=json&timespan=${timespan}`;

    let raw;
    try {
      raw = await fetchJSON(url);
    } catch (e) {
      console.warn(`[intensity] ${conflictId} vol failed: ${e.message}`);
      // Cache the error for 10 min so we don't keep hammering
      _cache[cacheKey] = { d: '__error__', t: Date.now() - TTL3H + 600000 };
      return null;
    }

    const seriesData = raw?.timeline?.[0]?.data ?? [];
    if (!seriesData.length) {
      _cache[cacheKey] = { d: '__error__', t: Date.now() - TTL3H + 600000 };
      return null;
    }

    const data = seriesData.map(d => ({
      rawDate: d.date,
      label:   parseGdeltDate(d.date),
      value:   Math.round(d.value * 10000) / 10000,
    }));

    const values  = data.map(d => d.value);
    const maxVal  = Math.max(...values);
    const minVal  = Math.min(...values);
    const avgVal  = Math.round((values.reduce((a,b) => a+b,0) / values.length) * 10000) / 10000;
    const lastVal = values[values.length - 1];
    const prevVal = values[values.length - 2] ?? lastVal;
    const trend   = lastVal > prevVal * 1.1 ? 'rising' : lastVal < prevVal * 0.9 ? 'falling' : 'stable';
    const spikes  = detectSpikes(data);

    const result = { conflictId, timespan, data, stats: { max: maxVal, min: minVal, avg: avgVal, last: lastVal, trend }, spikes, updatedAt: new Date().toISOString() };
    return toCache(cacheKey, result);
  });
}

// ── Fetch timelinetone for one conflict ──────────────────────────────────────
async function fetchTone(conflictId, timespan = '30d') {
  const cacheKey = `tone_${conflictId}_${timespan}`;
  const cached   = fromCache(cacheKey);
  if (cached) return cached === '__error__' ? null : cached;

  const query = CONFLICT_QUERIES[conflictId];
  if (!query) return null;

  return enqueue(async () => {
    const cached2 = fromCache(cacheKey);
    if (cached2) return cached2 === '__error__' ? null : cached2;

    console.log(`[intensity] Fetching GDELT timelinetone for: ${conflictId}`);

    const encoded = encodeURIComponent(`${query} sourcelang:eng`);
    const url     = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encoded}&mode=timelinetone&format=json&timespan=${timespan}`;

    let raw;
    try {
      raw = await fetchJSON(url);
    } catch (e) {
      console.warn(`[intensity] ${conflictId} tone failed: ${e.message}`);
      _cache[cacheKey] = { d: '__error__', t: Date.now() - TTL3H + 600000 };
      return null;
    }

    const seriesData = raw?.timeline?.[0]?.data ?? [];
    if (!seriesData.length) {
      _cache[cacheKey] = { d: '__error__', t: Date.now() - TTL3H + 600000 };
      return null;
    }

    const data = seriesData.map(d => ({
      rawDate: d.date,
      label:   parseGdeltDate(d.date),
      value:   Math.round(d.value * 10000) / 10000,
    }));

    const values   = data.map(d => d.value);
    const minVal   = Math.min(...values);
    const maxVal   = Math.max(...values);
    const avgVal   = Math.round((values.reduce((a,b) => a+b,0) / values.length) * 10000) / 10000;
    const lastVal  = values[values.length - 1];
    const prevVal  = values[values.length - 2] ?? lastVal;
    const trend    = lastVal < prevVal - 0.3 ? 'escalating' : lastVal > prevVal + 0.3 ? 'deescalating' : 'stable';
    const mean     = avgVal;
    const std      = Math.sqrt(values.reduce((a,b) => a + (b-mean)**2, 0) / values.length);
    const dipThresh = mean - 1.5 * std;
    const dips     = data.filter(d => d.value < dipThresh).sort((a,b) => a.value - b.value).slice(0,5).map(d => ({ date: d.label, value: Math.round(d.value * 100) / 100 }));

    const result = { conflictId, timespan, data, stats: { min: minVal, max: maxVal, avg: avgVal, last: lastVal, trend }, dips, updatedAt: new Date().toISOString() };
    return toCache(cacheKey, result);
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/conflict-intensity/:id?timespan=30d
router.get('/:id', async (req, res) => {
  const id       = req.params.id.toLowerCase().replace(/[^a-z]/g, '');
  const timespan = ['7d','14d','30d','60d','90d'].includes(req.query.timespan)
    ? req.query.timespan : '30d';

  if (!CONFLICT_QUERIES[id]) {
    return res.status(404).json({ error: `No query defined for conflict: ${id}` });
  }

  try {
    const data = await fetchIntensity(id, timespan);
    if (!data) return res.json({ conflictId: id, data: [], stats: null, spikes: [] });
    res.set('Cache-Control', 'public, max-age=10800');
    res.json(data);
  } catch (e) {
    console.error(`[intensity] ${id}:`, e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/conflict-intensity/:id/tone?timespan=30d
router.get('/:id/tone', async (req, res) => {
  const id       = req.params.id.toLowerCase().replace(/[^a-z]/g, '');
  const timespan = ['7d','14d','30d','60d','90d'].includes(req.query.timespan)
    ? req.query.timespan : '30d';

  if (!CONFLICT_QUERIES[id]) {
    return res.status(404).json({ error: `No query defined for conflict: ${id}` });
  }

  try {
    const data = await fetchTone(id, timespan);
    if (!data) return res.json({ conflictId: id, data: [], stats: null, dips: [] });
    res.set('Cache-Control', 'public, max-age=10800');
    res.json(data);
  } catch (e) {
    console.error(`[intensity/tone] ${id}:`, e.message);
    res.status(500).json({ error: e.message });
  }
});

// GET /api/conflict-intensity/list  — what conflicts are available
router.get('/', (req, res) => {
  res.json({ available: Object.keys(CONFLICT_QUERIES) });
});

module.exports = router;