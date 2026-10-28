// backend/routes/economicRoute.js
// Register in server.js:
//   app.use('/api/economic', require('./routes/economicRoute'));

'use strict';

const { Router } = require('express');
const { getEconomicIndex, getCountryEconomic, clearCache } = require('../services/economicService');

const router = Router();

// GET /api/economic/index
// Returns full scored + ranked country list
router.get('/index', async (req, res) => {
  try {
    const data = await getEconomicIndex();
    res.set('Cache-Control', 'public, max-age=3600');
    res.json({ count: data.length, updatedAt: new Date().toISOString(), countries: data });
  } catch (err) {
    console.error('[economicRoute] /index error:', err.message);
    res.status(500).json({ error: 'Failed to fetch economic index' });
  }
});

// GET /api/economic/:iso3
// Returns single country economic data
router.get('/:iso3', async (req, res) => {
  try {
    const data = await getCountryEconomic(req.params.iso3);
    if (!data) return res.status(404).json({ error: 'Country not found' });
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(data);
  } catch (err) {
    console.error('[economicRoute] /:iso3 error:', err.message);
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
});

// POST /api/economic/refresh  (admin use — force cache clear)
router.post('/refresh', (req, res) => {
  clearCache();
  res.json({ ok: true, message: 'Cache cleared. Next request will re-fetch.' });
});

module.exports = router;