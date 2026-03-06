const pool = require('../db/connection');

// ─────────────────────────────────────────────
// GET /api/countries
// Lightweight list: id, name, iso2, iso3, lat, lng, rank
// ─────────────────────────────────────────────
const getAllCountries = async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        name,
        iso2,
        iso3,
        latitude,
        longitude,
        rank
      FROM countries
      ORDER BY rank ASC NULLS LAST, name ASC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /api/countries/:iso3
// Full country row joined with its military_stats
// ─────────────────────────────────────────────
const getCountryByIso3 = async (req, res, next) => {
  try {
    const iso3 = req.params.iso3.toUpperCase();

    const { rows } = await pool.query(`
      SELECT
        c.id,
        c.name,
        c.iso2,
        c.iso3,
        c.region,
        c.latitude,
        c.longitude,
        c.total_population,
        c.total_land_area_sq_km,
        c.coastline_coverage_km,
        c.rank,

        -- military_stats (all columns)
        ms.active_personnel,
        ms.reserve_personnel,
        ms.paramilitary,
        ms.total_military_manpower,
        ms.tanks,
        ms.armored_fighting_vehicles,
        ms.self_propelled_artillery,
        ms.towed_artillery,
        ms.rocket_projectors,
        ms.total_military_aircraft,
        ms.fighter_aircraft,
        ms.attack_aircraft,
        ms.transport_aircraft,
        ms.trainer_aircraft,
        ms.attack_helicopters,
        ms.total_military_helicopters,
        ms.total_naval_fleet,
        ms.aircraft_carriers,
        ms.submarines,
        ms.destroyers,
        ms.frigates,
        ms.corvettes,
        ms.defense_budget_usd,
        ms.nuclear_weapons
      FROM countries c
      LEFT JOIN military_stats ms ON ms.country_id = c.id
      WHERE c.iso3 = $1
    `, [iso3]);

    if (!rows.length) {
      return res.status(404).json({ error: `Country '${iso3}' not found` });
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /api/countries/:iso3/military
// Military stats for one country + world averages
// ─────────────────────────────────────────────
const MILITARY_NUMERIC_COLS = [
  'active_personnel',
  'reserve_personnel',
  'paramilitary',
  'total_military_manpower',
  'tanks',
  'armored_fighting_vehicles',
  'self_propelled_artillery',
  'towed_artillery',
  'rocket_projectors',
  'total_military_aircraft',
  'fighter_aircraft',
  'attack_aircraft',
  'transport_aircraft',
  'trainer_aircraft',
  'attack_helicopters',
  'total_military_helicopters',
  'total_naval_fleet',
  'aircraft_carriers',
  'submarines',
  'destroyers',
  'frigates',
  'corvettes',
  'defense_budget_usd',
  'nuclear_weapons',
];

const getMilitaryStats = async (req, res, next) => {
  try {
    const iso3 = req.params.iso3.toUpperCase();

    // Resolve country
    const countryResult = await pool.query(
      'SELECT id, name, iso2, iso3 FROM countries WHERE iso3 = $1',
      [iso3]
    );
    if (!countryResult.rows.length) {
      return res.status(404).json({ error: `Country '${iso3}' not found` });
    }
    const country = countryResult.rows[0];

    // Fetch this country's stats
    const statsResult = await pool.query(
      'SELECT * FROM military_stats WHERE country_id = $1',
      [country.id]
    );
    const stats = statsResult.rows[0] || null;

    // Build world-average query dynamically (only numeric cols, exclude zeros from avg)
    const avgSelects = MILITARY_NUMERIC_COLS
      .map(col => `ROUND(AVG(NULLIF(${col}, 0)))::BIGINT AS ${col}`)
      .join(',\n        ');

    const avgResult = await pool.query(`
      SELECT
        ${avgSelects}
      FROM military_stats
    `);
    const worldAverages = avgResult.rows[0] || {};

    res.json({
      country,
      stats,
      worldAverages,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCountries, getCountryByIso3, getMilitaryStats };