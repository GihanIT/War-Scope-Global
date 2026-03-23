require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const countriesRouter = require('./routes/countries');
const conflictsRouter = require('./routes/conflicts');
const newsRouter      = require('./routes/news');
const incidentsRouter = require('./routes/incidents');
const cardRoute = require('./routes/cardRoute');
const economicRoute = require('./routes/economicRoute');
const warImpact = require('./routes/warImpact');
const conflictIntensity = require('./routes/conflictIntensity');
const mail = require('./routes/mail');


const app  = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// ─────────────────────────────────────────────
// Global middleware
// ─────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logger — logs method, path and response status code
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms     = Date.now() - start;
    const ts     = new Date().toISOString();
    const status = res.statusCode;
    const color  = status >= 500 ? '\x1b[31m'    // red
                 : status >= 400 ? '\x1b[33m'    // yellow
                 : status >= 300 ? '\x1b[36m'    // cyan
                 :                 '\x1b[32m';   // green
    const reset  = '\x1b[0m';
    console.log(`[${ts}] ${req.method} ${req.originalUrl} ${color}${status}${reset} ${ms}ms`);
  });
  next();
});

// ─────────────────────────────────────────────
// Health check
// ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    timestamp: new Date().toISOString(),
    service:   'warscope-api',
  });
});

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/countries', countriesRouter);
app.use('/api/conflicts', conflictsRouter);
app.use('/api/news',      newsRouter);
app.use('/api/incidents', incidentsRouter);  
app.use('/api/card', cardRoute);
app.use('/api/economic', economicRoute);
app.use('/api/war-impact', warImpact);
app.use('/api/conflict-intensity', conflictIntensity);
app.use('/api/mail', mail);

// ─────────────────────────────────────────────
// 404 — unknown route
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─────────────────────────────────────────────
// Global error handler
// ─────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error:   err.message || 'Internal server error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// ─────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`\n🌍  WarScope API running on http://localhost:${PORT}`);
  console.log(`     Health : http://localhost:${PORT}/health`);
  console.log(`     Routes : /api/countries  /api/conflicts  /api/news\n`);
});

// ─────────────────────────────────────────────
// Graceful shutdown (SIGTERM / SIGINT)
// ─────────────────────────────────────────────
const pool = require('./db/connection');

function shutdown(signal) {
  console.log(`\n[shutdown] ${signal} received — closing server…`);
  server.close(async () => {
    console.log('[shutdown] HTTP server closed');
    try {
      await pool.end();
      console.log('[shutdown] DB pool closed');
    } catch (err) {
      console.error('[shutdown] DB pool close error:', err.message);
    }
    process.exit(0);
  });

  // Force-exit if graceful close takes too long
  setTimeout(() => {
    console.error('[shutdown] Forced exit after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));

module.exports = app;