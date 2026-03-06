require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432', 10),
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'warscope',
  max:                 10,
  idleTimeoutMillis:   30_000,
  connectionTimeoutMillis: 3_000,
});

pool.on('connect', () => {
  console.log('[db] PostgreSQL client connected');
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err.message);
});

module.exports = pool;