const { Router } = require('express');
const {
  getAllConflicts,
  getConflictsByIso3,
} = require('../controllers/conflictsController');

const router = Router();

// GET /api/conflicts
// Optional query params: ?active=true&region=Europe&source=ucdp&limit=100
router.get('/', getAllConflicts);

// GET /api/conflicts/:iso3
router.get('/:iso3', getConflictsByIso3);

module.exports = router;