const { Router } = require('express');
const {
  getNewsByCountry,
  getCacheStats,
} = require('../controllers/newsController');

const router = Router();

// GET /api/news/cache/stats  ← must be before /:country
router.get('/cache/stats', getCacheStats);

// GET /api/news/:country
// Optional query param: ?maxrecords=10
router.get('/:country', getNewsByCountry);

module.exports = router;