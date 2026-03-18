// backend/routes/cardRoute.js
// Mount in your main Express app:
//   const cardRoute = require('./routes/cardRoute');
//   app.use('/api/card', cardRoute);
//
// Serves: GET /api/card/compare/:isoA/:isoB.png

'use strict';

const { Router }             = require('express');
const path                   = require('path');
const fs                     = require('fs');
const { generateCompareCard }    = require('../services/cardGenerator');
const { getMilitaryStatsRaw }    = require('../controllers/countriesController');

const router = Router();

// ─── Filesystem cache (1 hour) ────────────────────────────────────────────────
const CACHE_DIR    = path.join('/tmp', 'warscope-cards');
const CACHE_TTL_MS = 60 * 60 * 1000;

if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

function cachePath(isoA, isoB) {
  return path.join(CACHE_DIR, `${isoA}_${isoB}.png`);
}

function isCacheValid(filePath) {
  try {
    const stat = fs.statSync(filePath);
    return (Date.now() - stat.mtimeMs) < CACHE_TTL_MS;
  } catch {
    return false;
  }
}

// ─── In-flight deduplication ──────────────────────────────────────────────────
const inFlight = new Map();

// ─── Route ────────────────────────────────────────────────────────────────────
// GET /api/card/compare/USA/RUS.png
router.get('/compare/:isoA/:isoBpng', async (req, res) => {
  try {
    const { isoA, isoBpng } = req.params;
    const isoB = isoBpng.replace(/\.png$/i, '');

    if (!isoA || !isoB || isoA.length > 4 || isoB.length > 4) {
      return res.status(400).json({ error: 'Invalid ISO codes' });
    }

    const keyA      = isoA.toUpperCase();
    const keyB      = isoB.toUpperCase();
    const cacheKey  = `${keyA}_${keyB}`;
    const cacheFile = cachePath(keyA, keyB);

    // Serve from disk cache if fresh
    if (isCacheValid(cacheFile)) {
      res.set('Content-Type',  'image/png');
      res.set('Cache-Control', 'public, max-age=3600');
      res.set('X-Cache',       'HIT');
      return res.sendFile(cacheFile);
    }

    // Deduplicate concurrent requests for the same pair
    if (inFlight.has(cacheKey)) {
      const buf = await inFlight.get(cacheKey);
      res.set('Content-Type',  'image/png');
      res.set('Cache-Control', 'public, max-age=3600');
      res.set('X-Cache',       'DEDUP');
      return res.end(buf);
    }

    const promise = (async () => {
      const [dataA, dataB] = await Promise.all([
        getMilitaryStatsRaw(keyA),
        getMilitaryStatsRaw(keyB),
      ]);

      if (!dataA || !dataB) {
        throw new Error(`Country not found: ${!dataA ? keyA : keyB}`);
      }

      const buf = await generateCompareCard({
        countryA: dataA.country,
        countryB: dataB.country,
        statsA:   dataA.stats,
        statsB:   dataB.stats,
      });

      fs.writeFileSync(cacheFile, buf);
      return buf;
    })();

    inFlight.set(cacheKey, promise);
    promise.finally(() => inFlight.delete(cacheKey));

    const buf = await promise;

    res.set('Content-Type',  'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('X-Cache',       'MISS');
    res.end(buf);

  } catch (err) {
    console.error('[cardRoute]', err.message);
    res.status(500).json({ error: 'Failed to generate card' });
  }
});

module.exports = router;