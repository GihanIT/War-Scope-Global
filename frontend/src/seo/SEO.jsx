// src/seo/SEO.jsx
// Drop-in SEO component — wrap every page with this.
// Uses react-helmet-async (already in your package.json + HelmetProvider in main.jsx).

import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'WarScope';
const BASE_URL  = 'https://warscopeglobal.com';
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`; // create a 1200×630 og image and put in /public

export default function SEO({
  title,           // Page-specific title (will be appended with " | WarScope")
  description,     // 120–160 chars
  canonical,       // e.g. "/nuclear" — base URL prepended automatically
  image,           // og:image — defaults to DEFAULT_IMAGE
  type = 'website',// og:type — 'article' for blog posts
  noindex = false, // true for legal/utility pages
  children,        // for extra <meta> tags or JSON-LD
}) {
  const fullTitle    = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Global Military Intelligence`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : null;
  const ogImage      = image || DEFAULT_IMAGE;

  return (
    <Helmet>
      {/* ── Core ── */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* ── Open Graph (Facebook, WhatsApp, LinkedIn) ── */}
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:type"        content={type} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={ogImage} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* Any page-specific extras passed as children (e.g. JSON-LD scripts) */}
      {children}
    </Helmet>
  );
}