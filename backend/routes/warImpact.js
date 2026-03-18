// backend/routes/warImpact.js
'use strict';

const { Router } = require('express');
const svc = require('../services/warImpactService');
const router = Router();

router.get('/conflicts', (req, res) => {
  try {
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(svc.getConflicts());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/conflict/:id', async (req, res) => {
  try {
    const data = await svc.getConflictDetail(req.params.id);
    if (!data) return res.status(404).json({ error: 'Conflict not found' });
    // Disable HTTP cache here if compiling, so polling hits fresh status
    if (data.commodities && data.commodities._status === 'fetching') {
      res.set('Cache-Control', 'no-store');
    } else {
      res.set('Cache-Control', 'public, max-age=1800');
    }
    res.json(data);
  } catch (e) {
    console.error('[warImpact route]', e.message);
    res.status(500).json({ error: e.message });
  }
});

router.get('/commodities', async (req, res) => {
  try {
    const data = await svc.getCommodities();
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/currencies', async (req, res) => {
  try {
    const data = await svc.getCurrencies();
    res.set('Cache-Control', 'public, max-age=3600');
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/debug/commodities', async (req, res) => {
  try {
    const data = await svc.getCommodities();
    if (data._status === 'fetching') {
      return res.json({ ok: true, message: 'Currently fetching in background (~75s)' });
    }
    const summary = {};
    for (const [k, v] of Object.entries(data)) {
      summary[k] = { count: v.length, first: v[0], last: v[v.length - 1] };
    }
    res.json({ ok: true, summary, raw: data });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/cache/clear', (req, res) => {
  svc.clearCache();
  res.json({ ok: true, message: 'Cache cleared. Reload the page after ~75s.' });
});

module.exports = router;