const { Router } = require('express');
const {
  getAllCountries,
  getCountryByIso3,
  getMilitaryStats,
} = require('../controllers/countriesController');

const router = Router();

// GET /api/countries
router.get('/', getAllCountries);

// GET /api/countries/:iso3/military   ← must be BEFORE /:iso3
router.get('/:iso3/military', getMilitaryStats);

// GET /api/countries/:iso3
router.get('/:iso3', getCountryByIso3);

module.exports = router;