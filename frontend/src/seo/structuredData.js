// src/seo/structuredData.js
// JSON-LD structured data helpers.
// Usage: import { websiteSchema, articleSchema } from '../seo/structuredData';
// Then inside <SEO>: <script type="application/ld+json">{JSON.stringify(websiteSchema())}</script>

const BASE_URL  = 'https://warscopeglobal.com';
const SITE_NAME = 'WarScope';

// ── Homepage / Global ──────────────────────────────────────────────────────────
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: BASE_URL,
    description: 'Real-time global conflict visualization, military power rankings, arms trade data, and intelligence briefings.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/compare?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

// ── Organization (use on homepage alongside websiteSchema) ────────────────────
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/favicon.svg`,
    sameAs: [], // add Twitter/LinkedIn URLs here if you have them
  };
}

// ── Blog Article ──────────────────────────────────────────────────────────────
// post = { title, description, slug, date, author, image, category }
export function articleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/favicon.svg` },
    },
    image: post.image || `${BASE_URL}/og-default.jpg`,
    articleSection: post.category || 'Military Intelligence',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${post.slug}` },
  };
}

// ── Military Vehicle / Equipment ──────────────────────────────────────────────
// vehicle = { id, name, category, country, description }
// ── Military Vehicle / Equipment ──────────────────────────────────────────────
export function vehicleSchema(vehicle) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemPage',
    name: vehicle.name,
    description: vehicle.description || `${vehicle.name} military ${vehicle.category} specifications and data.`,
    url: `${BASE_URL}/vehicles/${vehicle.id}`,
    about: {
      '@type': 'Thing',
      name: vehicle.name,
      description: vehicle.description || `${vehicle.name} military ${vehicle.category} specifications and data.`,
    },
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
}
// ── Military Unit ─────────────────────────────────────────────────────────────
// unit = { id, name, country, description }
export function unitSchema(unit) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: unit.name,
    description: unit.description || `${unit.name} military unit profile and order of battle.`,
    url: `${BASE_URL}/units/${unit.id}`,
    parentOrganization: {
      '@type': 'Organization',
      name: unit.country || 'Unknown',
    },
  };
}

// ── Dataset (for data-heavy pages like Nuclear, Sanctions, Arms Trade) ────────
export function datasetSchema({ name, description, url, keywords }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url: `${BASE_URL}${url}`,
    keywords,
    creator: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: BASE_URL,
    },
    license: `${BASE_URL}/terms`,
  };
}

// ── BreadcrumbList ────────────────────────────────────────────────────────────
// items = [{ name: 'Home', url: '/' }, { name: 'Vehicles', url: '/vehicles' }, ...]
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${BASE_URL}${item.url}`,
    })),
  };
}