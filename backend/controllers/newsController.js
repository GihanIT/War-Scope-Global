const axios     = require('axios');
const NodeCache = require('node-cache');

// 5-minute TTL, check for expired keys every 60 s
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const GDELT_BASE = 'https://api.gdeltproject.org/api/v2/doc/doc';

// ─────────────────────────────────────────────
// Normalise a raw GDELT article into a clean
// object we want to return to the client
// ─────────────────────────────────────────────
const normaliseArticle = (article) => ({
  title:    article.title    || null,
  url:      article.url      || null,
  source:   article.domain   || article.sourcecountry || null,
  seendate: article.seendate || null,
  language: article.language || null,
  tone:     article.tone     != null ? parseFloat(article.tone) : null,
});

// ─────────────────────────────────────────────
// GET /api/news/:country
// Fetch from GDELT, English military news only
// ─────────────────────────────────────────────
const getNewsByCountry = async (req, res, next) => {
  try {
    const country = req.params.country.trim();
    if (!country) {
      return res.status(400).json({ error: 'Country name is required' });
    }

    // Optional query params to override defaults
    const maxrecords = Math.min(parseInt(req.query.maxrecords || '10', 10), 50);
    const cacheKey   = `gdelt:${country.toLowerCase()}:${maxrecords}`;

    // ── Cache hit ──────────────────────────────
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      return res.json({ source: 'cache', articles: cached });
    }

    // ── GDELT fetch ────────────────────────────
    // sourcelang:eng  → English sources only
    // OR keywords     → restrict to military / conflict / war topics
    // sort=DateDesc   → newest articles first
    const queryStr = `"${country}" (military OR army OR war OR conflict OR troops OR weapons OR defense OR NATO) sourcelang:eng`;
    const query    = encodeURIComponent(queryStr);
    const gdeltUrl = `${GDELT_BASE}?query=${query}&mode=artlist&maxrecords=${maxrecords}&format=json&sort=DateDesc`;

    let gdeltData;
    try {
      const response = await axios.get(gdeltUrl, {
        timeout: 8000,
        headers: { 'Accept': 'application/json' },
      });
      gdeltData = response.data;
    } catch (fetchErr) {
      // GDELT is occasionally unavailable — return a clean error rather than 500
      console.error(`[news] GDELT fetch failed for '${country}':`, fetchErr.message);
      return res.status(502).json({
        error:   'Failed to fetch news from GDELT',
        details: fetchErr.message,
      });
    }

    // GDELT returns { articles: [...] } or an empty object / HTML on error
    if (!gdeltData || typeof gdeltData !== 'object' || !Array.isArray(gdeltData.articles)) {
      return res.status(502).json({ error: 'Unexpected response format from GDELT' });
    }

    // Secondary filter: drop any non-English articles that slipped through
    const articles = gdeltData.articles
      .filter(a => !a.language || a.language.toLowerCase() === 'english')
      .map(normaliseArticle);

    // Store in cache then respond
    cache.set(cacheKey, articles);

    res.json({ source: 'live', articles });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /api/news/cache/stats  (debug helper)
// Returns current node-cache stats
// ─────────────────────────────────────────────
const getCacheStats = (_req, res) => {
  res.json(cache.getStats());
};

module.exports = { getNewsByCountry, getCacheStats };