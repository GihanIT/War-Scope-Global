#!/usr/bin/env node
/**
 * Seed script: loads data/conflicts.json into the database
 * Usage: node scripts/seed.js
 */
require('dotenv').config({ path: '../backend/.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

async function seed() {
  const raw = fs.readFileSync(path.join(__dirname, '../data/conflicts.json'), 'utf-8');
  const conflicts = JSON.parse(raw);

  console.log(`Seeding ${conflicts.length} conflicts...`);

  for (const c of conflicts) {
    await pool.query(
      `INSERT INTO conflicts
         (name, description, status, intensity, start_date, latitude, longitude,
          region, casualties_estimate, displaced_persons, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT DO NOTHING`,
      [
        c.name, c.description, c.status, c.intensity,
        c.start_date, c.latitude, c.longitude,
        c.region, c.casualties_estimate, c.displaced_persons,
        c.tags,
      ]
    );
    console.log(`  ✓ ${c.name}`);
  }

  console.log('Seed complete.');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
