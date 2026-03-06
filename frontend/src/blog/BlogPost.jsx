// src/blog/BlogPost.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet }      from 'react-helmet';
import ReactMarkdown   from 'react-markdown';
import { getPost, getRelated } from './blog-data.js';
import Navbar          from '../components/Navbar.jsx';
import AdBanner        from '../components/AdBanner.jsx';
import BlogCard        from './BlogCard.jsx';

// ─── Constants ────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const CATEGORY_COLORS = {
  Comparison: '#00d4ff',
  Nuclear:    '#ffaa00',
  Analysis:   '#00ff88',
  Rankings:   '#ff3b3b',
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const POST_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Barlow:wght@300;400;600;700&display=swap');

  .wp-prose h2 {
    color: #00d4ff;
    font-size: 20px;
    font-weight: 700;
    font-family: 'Barlow', system-ui, sans-serif;
    margin-top: 36px;
    margin-bottom: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid #1e2433;
    letter-spacing: -0.01em;
  }
  .wp-prose h3 {
    color: #e8eaf0;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Barlow', system-ui, sans-serif;
    margin-top: 28px;
    margin-bottom: 10px;
  }
  .wp-prose h4 {
    color: #8892a4;
    font-size: 13px;
    font-weight: 600;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 20px;
    margin-bottom: 8px;
  }
  .wp-prose p {
    color: #8892a4;
    font-size: 15px;
    line-height: 1.85;
    margin-bottom: 18px;
    font-family: 'Barlow', system-ui, sans-serif;
  }
  .wp-prose strong { color: #e8eaf0; font-weight: 600; }
  .wp-prose em     { color: #a0a8bc; font-style: italic; }
  .wp-prose a {
    color: #00d4ff;
    text-decoration: none;
    border-bottom: 1px solid rgba(0,212,255,0.3);
    transition: border-color 150ms, color 150ms;
  }
  .wp-prose a:hover { color: #66e2ff; border-bottom-color: rgba(0,212,255,0.7); }
  .wp-prose ul, .wp-prose ol {
    color: #8892a4;
    font-size: 15px;
    line-height: 1.8;
    padding-left: 20px;
    margin-bottom: 18px;
    font-family: 'Barlow', system-ui, sans-serif;
  }
  .wp-prose li          { margin-bottom: 5px; }
  .wp-prose li strong   { color: #e8eaf0; }
  .wp-prose blockquote {
    border-left: 3px solid #00d4ff;
    margin: 24px 0;
    padding: 14px 20px;
    background: rgba(0,212,255,0.04);
    border-radius: 0 6px 6px 0;
  }
  .wp-prose blockquote p { color: #a0a8bc; font-style: italic; margin-bottom: 0; }
  .wp-prose code {
    background: #0a0c14;
    border: 1px solid #1e2433;
    border-radius: 3px;
    padding: 1px 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 12px;
    color: #00ff88;
  }
  .wp-prose pre {
    background: #0a0c14;
    border: 1px solid #1e2433;
    border-radius: 6px;
    padding: 18px;
    overflow-x: auto;
    margin-bottom: 20px;
  }
  .wp-prose pre code { background: transparent; border: none; padding: 0; font-size: 13px; }
  .wp-prose table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
    font-size: 13px;
    font-family: 'Barlow', system-ui, sans-serif;
  }
  .wp-prose th {
    background: #0f1117;
    color: #00d4ff;
    padding: 12px 14px;
    border: 1px solid #1e2433;
    font-weight: 600;
    text-align: left;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .wp-prose td {
    color: #8892a4;
    padding: 10px 14px;
    border: 1px solid #1e2433;
    vertical-align: top;
    line-height: 1.5;
  }
  .wp-prose tr:nth-child(even) td { background: rgba(255,255,255,0.015); }
  .wp-prose hr { border: none; border-top: 1px solid #1e2433; margin: 32px 0; }

  .wp-breadcrumb a {
    color: #8892a4;
    text-decoration: none;
    transition: color 150ms;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.06em;
  }
  .wp-breadcrumb a:hover { color: #00d4ff; }
  .wp-breadcrumb .sep {
    color: #2a3555;
    margin: 0 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
  }
  .wp-breadcrumb .current {
    color: #4a5568;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
  }

  .wp-tag {
    display: inline-block;
    border: 1px solid #1e2433;
    color: #8892a4;
    border-radius: 20px;
    padding: 4px 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.08em;
    transition: border-color 150ms, color 150ms;
    cursor: default;
  }
  .wp-tag:hover { border-color: #00d4ff; color: #00d4ff; }

  .wp-globe-cta {
    display: block;
    width: 100%;
    background: #00d4ff;
    color: #0a0a0f;
    border: none;
    border-radius: 8px;
    padding: 16px;
    font-size: 16px;
    font-weight: 700;
    font-family: 'Barlow', system-ui, sans-serif;
    cursor: pointer;
    transition: background 160ms, transform 160ms, box-shadow 160ms;
    text-align: center;
    letter-spacing: -0.01em;
  }
  .wp-globe-cta:hover {
    background: #33ddff;
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(0,212,255,0.25);
  }
  .wp-globe-cta:active { transform: translateY(0); }

  .wp-related-card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 14px;
    background: #0a0c14;
    border: 1px solid #1e2433;
    border-radius: 6px;
    text-decoration: none;
    transition: border-color 160ms, background 160ms;
  }
  .wp-related-card:hover {
    border-color: #00d4ff;
    background: rgba(0,212,255,0.03);
  }

  .wp-progress {
    position: fixed;
    top: 60px;
    left: 0;
    height: 2px;
    background: linear-gradient(90deg, #00d4ff, #00ff88);
    z-index: 200;
    transition: width 80ms linear;
    pointer-events: none;
  }

  @keyframes wp-fade-up {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .wp-fade-up { animation: wp-fade-up 350ms ease both; }

  /* Sidebar scrollbar */
  .wp-sidebar::-webkit-scrollbar       { width: 3px; }
  .wp-sidebar::-webkit-scrollbar-track { background: transparent; }
  .wp-sidebar::-webkit-scrollbar-thumb { background: #1e2433; border-radius: 2px; }

  @media (max-width: 900px) {
    .wp-layout  { flex-direction: column !important; }
    .wp-sidebar { position: static !important; width: 100% !important; max-height: none !important; }
    .wp-bottom-grid { grid-template-columns: 1fr !important; }
  }
  @media (max-width: 600px) {
    .wp-bottom-grid { grid-template-columns: 1fr !important; }
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

// ─── Reading progress bar ─────────────────────────────────────────────────────
function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const top = el.scrollTop || document.body.scrollTop;
      const h = el.scrollHeight - el.clientHeight;
      setPct(h > 0 ? Math.min(100, (top / h) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return <div className="wp-progress" style={{ width: `${pct}%` }} />;
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb({ category, title }) {
  const short = title?.length > 30 ? title.slice(0, 30) + '…' : title;
  return (
    <nav className="wp-breadcrumb" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
      <Link to="/">Home</Link>
      <span className="sep">/</span>
      <Link to="/blog">Blog</Link>
      <span className="sep">/</span>
      <Link to="/blog">{category}</Link>
      <span className="sep">/</span>
      <span className="current">{short}</span>
    </nav>
  );
}

// ─── Markdown with injected inline ads ───────────────────────────────────────
function ContentWithAds({ content }) {
  const chunks = useMemo(() => {
    if (!content) return [];
    const paragraphs = content.split(/\n{2,}/);
    const out = [];
    let adCount = 0;
    paragraphs.forEach((text, i) => {
      out.push({ type: 'md', text, key: `md-${i}` });
      if ((i + 1) % 3 === 0 && i < paragraphs.length - 1) {
        adCount++;
        out.push({ type: 'ad', id: `ad-inline-${adCount}`, key: `ad-${adCount}` });
      }
    });
    return out;
  }, [content]);

  return (
    <div className="wp-prose">
      {chunks.map(chunk =>
        chunk.type === 'ad' ? (
          <div key={chunk.key} style={{ margin: '28px 0' }}>
            <AdBanner id={chunk.id} size="300x250" style={{ margin: '0 auto' }} />
          </div>
        ) : (
          <ReactMarkdown key={chunk.key}>{chunk.text}</ReactMarkdown>
        )
      )}
    </div>
  );
}

// ─── Top countries sidebar widget ────────────────────────────────────────────
function TopCountriesWidget() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch(`${API}/api/countries`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setCountries(
          [...data]
            .filter(c => c.rank)
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 5)
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: '#0a0c14', border: '1px solid #1e2433', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #1e2433',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.16em',
        color: '#00d4ff',
        textTransform: 'uppercase',
        opacity: 0.8,
      }}>
        Top Military Powers
      </div>
      <div style={{ padding: '8px 0' }}>
        {loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} style={{ height: 36, margin: '4px 12px', background: '#1e2433', borderRadius: 4, opacity: 0.5 }} />
            ))
          : countries.map((c, i) => (
              <Link
                key={c.iso3}
                to={`/?countries=${c.iso3}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 16px', textDecoration: 'none',
                  transition: 'background 150ms',
                  borderBottom: i < countries.length - 1 ? '1px solid rgba(30,36,51,0.5)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#2a3555', width: 16, textAlign: 'right', flexShrink: 0 }}>
                  {c.rank}
                </span>
                {c.iso2 && (
                  <img
                    src={`https://flagcdn.com/w40/${c.iso2.toLowerCase()}.png`}
                    alt={c.name}
                    style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
                <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 13, color: '#e8eaf0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name}
                </span>
                <span style={{ color: '#2a3555', fontSize: 11 }}>→</span>
              </Link>
            ))
        }
      </div>
    </div>
  );
}

// ─── Compact sidebar related card ────────────────────────────────────────────
function SidebarCard({ post }) {
  const accent = CATEGORY_COLORS[post.category] ?? '#00d4ff';
  return (
    <Link to={`/blog/${post.slug}`} className="wp-related-card">
      <div style={{ marginBottom: 4 }}>
        <span style={{
          background: `${accent}18`, border: `1px solid ${accent}44`,
          borderRadius: 3, padding: '2px 7px',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 8,
          color: accent, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          {post.category}
        </span>
      </div>
      <div style={{
        fontFamily: "'Barlow', system-ui, sans-serif",
        fontSize: 13, fontWeight: 600, color: '#e8eaf0', lineHeight: 1.35,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {post.title}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#4a5568', marginTop: 2 }}>
        {post.readTime}
      </div>
    </Link>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function BlogPost() {
  injectCSS('blog-post-css', POST_CSS);

  const { slug } = useParams();
  const navigate = useNavigate();

  const post    = useMemo(() => getPost(slug),       [slug]);
  const related = useMemo(() => getRelated(slug, 3), [slug]);

  useEffect(() => {
    if (!post) navigate('/blog', { replace: true });
  }, [post, navigate]);

  if (!post) return null;

  const accent       = CATEGORY_COLORS[post.category] ?? '#00d4ff';
  const countryLabel = Array.isArray(post.countries) && post.countries.length > 0
    ? post.countries.join(', ') : null;

  const jsonLd = JSON.stringify({
    '@context':    'https://schema.org',
    '@type':       'Article',
    headline:      post.title,
    datePublished: post.date,
    image:         post.coverImage,
    author:        { '@type': 'Organization', name: 'WarScope Intelligence' },
    publisher:     { '@type': 'Organization', name: 'WarScope' },
  });

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0f' }}>
      <Helmet>
        <title>{post.metaTitle || `${post.title} | WarScope`}</title>
        <meta name="description"        content={post.metaDescription || post.excerpt} />
        <meta property="og:title"       content={post.metaTitle || post.title} />
        <meta property="og:description" content={post.metaDescription || post.excerpt} />
        <meta property="og:image"       content={post.coverImage || ''} />
        <meta property="og:type"        content="article" />
        <link rel="canonical"           href={`https://warscope.com/blog/${post.slug}`} />
        <script type="application/ld+json">{jsonLd}</script>
      </Helmet>

      <ReadingProgress />
      <Navbar />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(16px,3vw,32px)' }}>

        {/* ── Two-column layout ─────────────────────────────────────── */}
        <div className="wp-layout wp-fade-up" style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

          {/* ══ LEFT (65%) ════════════════════════════════════════════ */}
          <div style={{ flex: '0 0 65%', minWidth: 0 }}>

            {/* Breadcrumb */}
            <Breadcrumb category={post.category} title={post.title} />

            {/* Header */}
            <header style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 14 }}>
                <span style={{
                  background: `${accent}18`, border: `1px solid ${accent}44`,
                  borderRadius: 5, padding: '4px 12px',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                  color: accent, letterSpacing: '0.14em', textTransform: 'uppercase',
                }}>
                  {post.category}
                </span>
              </div>

              <h1 style={{
                margin: 0,
                fontSize: 'clamp(22px, 3vw, 34px)',
                fontWeight: 700, color: '#e8eaf0',
                lineHeight: 1.2, letterSpacing: '-0.02em',
                fontFamily: "'Barlow', system-ui, sans-serif",
                marginBottom: 16,
              }}>
                {post.title}
              </h1>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8892a4',
                marginBottom: 20,
              }}>
                {post.author && <><span style={{ color: '#4a5568' }}>✍</span><span>{post.author}</span><span style={{ color: '#2a3555' }}>·</span></>}
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span style={{ color: '#2a3555' }}>·</span>
                <span>{post.readTime}</span>
              </div>

              {post.coverImage && (
                <div style={{ height: 350, borderRadius: 8, overflow: 'hidden', border: '1px solid #1e2433', background: '#0a0c14' }}>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.85) saturate(0.85)' }}
                    onError={e => { e.target.parentElement.style.display = 'none'; }}
                  />
                </div>
              )}
            </header>

            {/* Ad after header */}
            <div style={{ margin: '24px 0' }}>
              <AdBanner id="ad-post-top" size="728x90" />
            </div>

            {/* Globe CTA */}
            {countryLabel && (
              <div style={{ margin: '24px 0' }}>
                <button
                  className="wp-globe-cta"
                  onClick={() => navigate(`/?countries=${post.countries.join(',')}`)}
                >
                  🌍 Explore {countryLabel} on the Globe →
                </button>
              </div>
            )}

            {/* Article body */}
            <ContentWithAds content={post.content} />

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1e2433' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: '0.16em', color: '#4a5568', textTransform: 'uppercase', marginBottom: 12 }}>
                  Tags
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {post.tags.map(tag => <span key={tag} className="wp-tag">{tag}</span>)}
                </div>
              </div>
            )}

            {/* Bottom ad */}
            <div style={{ margin: '36px 0 0' }}>
              <AdBanner id="ad-post-bottom" size="728x90" />
            </div>
          </div>

          {/* ══ RIGHT SIDEBAR (35%) ════════════════════════════════════ */}
          <div
            className="wp-sidebar"
            style={{
              flex: '0 0 35%', position: 'sticky', top: 80,
              maxHeight: 'calc(100vh - 100px)', overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: 24,
            }}
          >
            {/* Related briefs */}
            <div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                letterSpacing: '0.18em', color: '#00d4ff', opacity: 0.7,
                textTransform: 'uppercase', marginBottom: 14,
                paddingBottom: 8, borderBottom: '1px solid rgba(0,212,255,0.12)',
              }}>
                Related Briefs
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {related.map(r => <SidebarCard key={r.slug} post={r} />)}
              </div>
            </div>

            {/* Sidebar ad */}
            <AdBanner id="ad-sidebar" size="300x250" />

            {/* Top powers widget */}
            <TopCountriesWidget />
          </div>
        </div>

        {/* ── Bottom: More Intelligence ──────────────────────────────── */}
        {related.length > 0 && (
          <div style={{ marginTop: 64, paddingTop: 40, borderTop: '1px solid #1e2433' }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
              letterSpacing: '0.18em', color: '#00d4ff', opacity: 0.65,
              textTransform: 'uppercase', marginBottom: 24,
            }}>
              More Intelligence
            </div>
            <div
              className="wp-bottom-grid"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}
            >
              {related.map((r, i) => (
                <div key={r.slug} className="wp-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <BlogCard post={r} />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}