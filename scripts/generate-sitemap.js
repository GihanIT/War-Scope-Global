// scripts/generate-sitemap.js
// Generates a complete sitemap including all static pages + dynamic URLs
// Usage: node scripts/generate-sitemap.js
// Output: frontend/public/sitemap.xml  (replaces the static one — no manual merging needed)

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL  = 'https://warscopeglobal.com';
const today     = new Date().toISOString().split('T')[0];

// ── Static pages ─────────────────────────────────────────────────────────────
// Add / remove entries here whenever you add a new page to src/pages/
const STATIC_PAGES = [
  { path: '/',              changefreq: 'daily',   priority: '1.0' },
  { path: '/blog',          changefreq: 'daily',   priority: '0.9' },
  { path: '/nuclear',       changefreq: 'weekly',  priority: '0.9' },
  { path: '/timeline',      changefreq: 'weekly',  priority: '0.8' },
  { path: '/arms-trade',    changefreq: 'weekly',  priority: '0.8' },
  { path: '/sanctions',     changefreq: 'weekly',  priority: '0.8' },
  { path: '/compare',       changefreq: 'weekly',  priority: '0.8' },
  { path: '/units',         changefreq: 'weekly',  priority: '0.8' },
  { path: '/vehicles',      changefreq: 'weekly',  priority: '0.8' },
  { path: '/incidents',     changefreq: 'daily',   priority: '0.8' },
  { path: '/economic',      changefreq: 'weekly',  priority: '0.7' },
  { path: '/about',         changefreq: 'monthly', priority: '0.6' },
  { path: '/contact',       changefreq: 'monthly', priority: '0.5' },
  { path: '/methodology',   changefreq: 'monthly', priority: '0.5' },
  { path: '/data-sources',  changefreq: 'monthly', priority: '0.5' },
  { path: '/disclaimer',    changefreq: 'monthly', priority: '0.4' },
  { path: '/privacy-policy',changefreq: 'monthly', priority: '0.4' },
  { path: '/terms',         changefreq: 'monthly', priority: '0.4' },
  { path: '/cookie-policy', changefreq: 'monthly', priority: '0.4' },
];

// ── Load dynamic data files ───────────────────────────────────────────────────
let vehicleIds = [];
let unitIds    = [];
let blogSlugs  = [];

try {
  const vehiclesRaw = readFileSync(resolve(__dirname, '../frontend/src/data/vehicles-data.js'), 'utf8');
  vehicleIds = [...vehiclesRaw.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log(`✔ Found ${vehicleIds.length} vehicles`);
} catch (e) {
  console.warn('⚠ Could not read vehicles-data.js:', e.message);
}

try {
  const unitsRaw = readFileSync(resolve(__dirname, '../frontend/src/data/army-units-db.js'), 'utf8');
  unitIds = [...unitsRaw.matchAll(/id:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log(`✔ Found ${unitIds.length} units`);
} catch (e) {
  console.warn('⚠ Could not read army-units-db.js:', e.message);
}

try {
  const blogRaw = readFileSync(resolve(__dirname, '../frontend/src/data/blog-data.js'), 'utf8');
  blogSlugs = [...blogRaw.matchAll(/slug:\s*['"]([^'"]+)['"]/g)].map(m => m[1]);
  console.log(`✔ Found ${blogSlugs.length} blog posts`);
} catch (e) {
  console.warn('⚠ Could not read blog-data.js:', e.message);
}

// ── Build URL entries ─────────────────────────────────────────────────────────
function urlEntry({ loc, changefreq, priority }) {
  return `
  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const staticEntries = STATIC_PAGES.map(p =>
  urlEntry({ loc: `${BASE_URL}${p.path}`, changefreq: p.changefreq, priority: p.priority })
).join('');

const vehicleEntries = vehicleIds.map(id =>
  urlEntry({ loc: `${BASE_URL}/vehicles/${id}`, changefreq: 'monthly', priority: '0.7' })
).join('');

const unitEntries = unitIds.map(id =>
  urlEntry({ loc: `${BASE_URL}/units/${id}`, changefreq: 'monthly', priority: '0.7' })
).join('');

const blogEntries = blogSlugs.map(slug =>
  urlEntry({ loc: `${BASE_URL}/blog/${slug}`, changefreq: 'monthly', priority: '0.8' })
).join('');

// ── Assemble XML ──────────────────────────────────────────────────────────────
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- AUTO-GENERATED — do not edit manually. Run: node scripts/generate-sitemap.js -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${vehicleEntries}
${unitEntries}
${blogEntries}
</urlset>`;

// Write directly to public/ so it's always up to date before & after builds
const outPath = resolve(__dirname, '../frontend/public/sitemap.xml');
writeFileSync(outPath, xml);

const total = STATIC_PAGES.length + vehicleIds.length + unitIds.length + blogSlugs.length;
console.log(`\n✅ Sitemap written to: ${outPath}`);
console.log(`   Static pages : ${STATIC_PAGES.length}`);
console.log(`   Vehicles     : ${vehicleIds.length}`);
console.log(`   Units        : ${unitIds.length}`);
console.log(`   Blog posts   : ${blogSlugs.length}`);
console.log(`   Total URLs   : ${total}`);