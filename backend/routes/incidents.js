// backend/routes/incidents.js
const express = require('express');
const router  = express.Router();
const { getLiveIncidents } = require('../controllers/incidentController');

router.get('/live', getLiveIncidents);

module.exports = router;