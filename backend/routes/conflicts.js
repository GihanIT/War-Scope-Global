const { Router } = require('express');
const {
  getAllConflicts,
  getConflictsByIso3,
} = require('../controllers/conflictsController');
const { getLiveConflicts } = require('../controllers/gdeltController');

const router = Router();

// GET /api/conflicts/live  ← GDELT real-time feed (must be before /:iso3)
router.get('/live', getLiveConflicts);

// GET /api/conflicts
router.get('/', getAllConflicts);

// GET /api/conflicts/:iso3
router.get('/:iso3', getConflictsByIso3);

module.exports = router;