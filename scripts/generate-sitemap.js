// scripts/generate-sitemap.js
// Run after build: node scripts/generate-sitemap.js
// Reads your data files and appends dynamic URLs (/vehicles/:id, /units/:id, /blog/:slug)
// to the sitemap. Merge output into public/sitemap.xml.
//
// Usage: node scripts/generate-sitemap.js > dist/sitemap-dynamic.xml
// Then combine with the static sitemap.xml manually or automate with a concat step.

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL  = 'https://warscopeglobal.com';
const today     = new Date().toISOString().split('T')[0];

// ── Load data files ──────────────────────────────────────────────────────────
// These imports read your actual data arrays to extract IDs/slugs.
// Adjust paths if your data files move.

let vehicleIds = [];
let unitIds    = [];
let blogSlugs  = [];

try {
  // Vehicles
  const vehiclesRaw = readFileSync(resolve(__dirname, '../frontend/src/data/vehicles-data.js'), 'utf8');
  const vehicleMatches = vehiclesRaw.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  vehicleIds = [...vehicleMatches].map(m => m[1]);
  console.error(`Found ${vehicleIds.length} vehicles`);
} catch (e) {
  console.error('Could not read vehicles-data.js:', e.message);
}

try {
  // Units
  const unitsRaw = readFileSync(resolve(__dirname, '../frontend/src/data/army-units-db.js'), 'utf8');
  const unitMatches = unitsRaw.matchAll(/id:\s*['"]([^'"]+)['"]/g);
  unitIds = [...unitMatches].map(m => m[1]);
  console.error(`Found ${unitIds.length} units`);
} catch (e) {
  console.error('Could not read army-units-db.js:', e.message);
}

try {
  // Blog posts
  const blogRaw = readFileSync(resolve(__dirname, '../frontend/src/data/blog-data.js'), 'utf8');
  const slugMatches = blogRaw.matchAll(/slug:\s*['"]([^'"]+)['"]/g);
  blogSlugs = [...slugMatches].map(m => m[1]);
  console.error(`Found ${blogSlugs.length} blog posts`);
} catch (e) {
  console.error('Could not read blog-data.js:', e.message);
}

// ── Build XML ────────────────────────────────────────────────────────────────
const vehicleUrls = vehicleIds.map(id => `
  <url>
    <loc>${BASE_URL}/vehicles/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

const unitUrls = unitIds.map(id => `
  <url>
    <loc>${BASE_URL}/units/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

const blogUrls = blogSlugs.map(slug => `
  <url>
    <loc>${BASE_URL}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- AUTO-GENERATED — do not edit manually. Run: node scripts/generate-sitemap.js -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${vehicleUrls}
${unitUrls}
${blogUrls}
</urlset>`;

// Write to dist (Vite build output)
const outPath = resolve(__dirname, '../frontend/dist/sitemap-dynamic.xml');
writeFileSync(outPath, xml);
console.error(`\nWrote dynamic sitemap to: ${outPath}`);
console.error(`Total URLs: ${vehicleIds.length + unitIds.length + blogSlugs.length}`);
console.log(xml); // also stdout for piping