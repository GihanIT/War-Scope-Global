// backend/controllers/conflictController.js
const pool = require('../db/connection');

// ─────────────────────────────────────────────
// GET /api/conflicts
// All conflicts ordered by intensity DESC
// ─────────────────────────────────────────────
const getAllConflicts = async (req, res, next) => {
  try {
    // Optional query filters
    const { active, region, source, limit = 500 } = req.query;

    const conditions = [];
    const params     = [];

    if (active !== undefined) {
      params.push(active === 'true');
      conditions.push(`cf.is_active = $${params.length}`);
    }
    if (region) {
      params.push(region);
      conditions.push(`cf.region ILIKE $${params.length}`);
    }
    if (source) {
      params.push(source);
      conditions.push(`cf.source = $${params.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(Math.min(parseInt(limit, 10) || 500, 2000));
    const limitClause = `LIMIT $${params.length}`;

    const { rows } = await pool.query(`
      SELECT
        cf.id,
        cf.conflict_id,
        cf.location,
        cf.actor1,
        cf.actor2,
        cf.actor1_iso3,
        cf.actor2_iso3,
        cf.conflict_type,
        cf.intensity_level,
        cf.start_year,
        cf.last_active_year,
        cf.is_active,
        cf.region,
        cf.description,
        cf.latitude,
        cf.longitude,
        cf.source
      FROM conflicts cf
      ${where}
      ORDER BY
        cf.intensity_level DESC NULLS LAST,
        cf.is_active        DESC,
        cf.start_year       DESC NULLS LAST
      ${limitClause}
    `, params);

    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────
// GET /api/conflicts/:iso3
// Conflicts involving a country, returned as
// arc-ready GeoJSON objects for globe.gl
// ─────────────────────────────────────────────
const getConflictsByIso3 = async (req, res, next) => {
  try {
    const iso3 = req.params.iso3.toUpperCase();

    // Verify the country exists
    const countryCheck = await pool.query(
      'SELECT id, name FROM countries WHERE iso3 = $1',
      [iso3]
    );
    if (!countryCheck.rows.length) {
      return res.status(404).json({ error: `Country '${iso3}' not found` });
    }

    // Fetch conflicts + both actor lat/lng in one query
    const { rows } = await pool.query(`
      SELECT
        cf.id,
        cf.location         AS conflict_name,
        cf.actor1,
        cf.actor2,
        cf.actor1_iso3,
        cf.actor2_iso3,
        cf.intensity_level,
        cf.conflict_type,
        cf.is_active,
        cf.start_year,
        cf.last_active_year,
        cf.description,
        cf.source,

        -- ── FIXED FALLBACK LOGIC ──
        -- Actor 1 coordinates (fallback to conflict location)
        COALESCE(c1.latitude,  cf.latitude)  AS start_lat,
        COALESCE(c1.longitude, cf.longitude) AS start_lng,

        -- Actor 2 coordinates (fallback to conflict location, then to country 1 center)
        COALESCE(c2.latitude,  cf.latitude, c1.latitude)  AS end_lat,
        COALESCE(c2.longitude, cf.longitude, c1.longitude) AS end_lng,

        -- Friendly country names
        c1.name AS actor1_country_name,
        c2.name AS actor2_country_name
      FROM conflicts cf
      LEFT JOIN countries c1 ON c1.iso3 = cf.actor1_iso3
      LEFT JOIN countries c2 ON c2.iso3 = cf.actor2_iso3
      WHERE
        cf.actor1_iso3 = $1
        OR cf.actor2_iso3 = $1
      ORDER BY
        cf.is_active        DESC,
        cf.intensity_level  DESC NULLS LAST,
        cf.start_year       DESC NULLS LAST
    `, [iso3]);

    // Shape into arc-ready format for globe.gl
    const arcs = rows.map(row => ({
      id:               row.id,
      conflict_name:    row.conflict_name,
      actor1:           row.actor1,
      actor2:           row.actor2,
      actor1_iso3:      row.actor1_iso3,
      actor2_iso3:      row.actor2_iso3,
      actor1_country:   row.actor1_country_name,
      actor2_country:   row.actor2_country_name,
      startLat:         row.start_lat   !== null ? parseFloat(row.start_lat)  : null,
      startLng:         row.start_lng   !== null ? parseFloat(row.start_lng)  : null,
      endLat:           row.end_lat     !== null ? parseFloat(row.end_lat)    : null,
      endLng:           row.end_lng     !== null ? parseFloat(row.end_lng)    : null,
      intensity_level:  row.intensity_level,
      conflict_type:    row.conflict_type,
      is_active:        row.is_active,
      start_year:       row.start_year,
      last_active_year: row.last_active_year,
      description:      row.description,
      source:           row.source,
    }));

    res.json(arcs);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllConflicts, getConflictsByIso3 };