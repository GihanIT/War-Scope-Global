// src/blog/BlogPost.jsx
import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactMarkdown   from 'react-markdown';
import { getPost, getRelated } from '../data/blog-data.js';
import Navbar          from '../components/Navbar.jsx';
import AdBanner        from '../components/AdBanner.jsx';
import BlogCard        from './BlogCard.jsx';
import SEO from '../seo/SEO.jsx';
import { articleSchema } from '../seo/structuredData.js';


// ─── Constants ────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const CATEGORY_COLORS = {
  Comparison: '#00d4ff', // Cyan
  Nuclear:    '#ffaa00', // Amber
  Analysis:   '#00ff88', // Green
  Rankings:   '#ff3b3b', // Red
};

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  ChevronRight: () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Terminal: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  Clock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Globe: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Target: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
};

// ─── CSS ─────────────────────────────────────────────────────────────────────
const POST_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow:wght@300;400;600;700;900&display=swap');

  .wp-page-wrapper {
    min-height: 100dvh;
    background-color: #050508;
    position: relative;
    overflow-x: hidden;
  }

  /* Tactical Grid Background */
  .wp-page-wrapper::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
    z-index: 0;
    pointer-events: none;
  }

  .wp-content {
    position: relative;
    z-index: 1;
  }

  .wp-prose h2 {
    color: #e8eaf0;
    font-size: 22px;
    font-weight: 700;
    font-family: 'Barlow', system-ui, sans-serif;
    margin-top: 40px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 212, 255, 0.2);
    letter-spacing: -0.01em;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .wp-prose h2::before {
    content: "■";
    color: #00d4ff;
    font-size: 14px;
  }
  
  .wp-prose h3 {
    color: #e8eaf0;
    font-size: 18px;
    font-weight: 600;
    font-family: 'Barlow', system-ui, sans-serif;
    margin-top: 32px;
    margin-bottom: 12px;
  }
  
  .wp-prose h4 {
    color: #00d4ff;
    font-size: 13px;
    font-weight: 600;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-top: 24px;
    margin-bottom: 10px;
    opacity: 0.9;
  }
  
  .wp-prose p {
    color: #8892a4;
    font-size: 16px;
    line-height: 1.8;
    margin-bottom: 20px;
    font-family: 'Barlow', system-ui, sans-serif;
  }
  
  .wp-prose strong { color: #e8eaf0; font-weight: 600; }
  .wp-prose em     { color: #a0a8bc; font-style: italic; }
  
  .wp-prose a {
    color: #00d4ff;
    text-decoration: none;
    border-bottom: 1px solid rgba(0,212,255,0.3);
    transition: all 150ms ease;
  }
  .wp-prose a:hover { 
    color: #fff; 
    background: rgba(0,212,255,0.1); 
    border-bottom-color: #00d4ff; 
  }
  
  .wp-prose ul, .wp-prose ol {
    color: #cdd4e0;      /* Match paragraph brightness */
    font-size: 17px;     /* Match paragraph size */
    line-height: 1.8;
    padding-left: 20px;
    margin-bottom: 24px;
    font-family: 'Barlow', system-ui, sans-serif;
  }
  .wp-prose li          { margin-bottom: 8px; }
  .wp-prose li::marker  { color: #00d4ff; }
  .wp-prose li strong   { color: #e8eaf0; }
  
  .wp-prose blockquote {
    border-left: 3px solid #ff3b3b;
    margin: 28px 0;
    padding: 16px 24px;
    background: linear-gradient(90deg, rgba(255,59,59,0.08) 0%, transparent 100%);
    border-radius: 0 4px 4px 0;
  }
  .wp-prose blockquote p { 
    color: #e8eaf0; 
    font-family: 'IBM Plex Mono', monospace; 
    font-size: 13px; 
    margin-bottom: 0; 
    line-height: 1.6;
  }
  
  .wp-prose code {
    background: rgba(0, 212, 255, 0.08);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 3px;
    padding: 2px 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    color: #00d4ff;
  }
  
  .wp-prose pre {
    background: rgba(5, 5, 8, 0.8);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 6px;
    padding: 20px;
    overflow-x: auto;
    margin-bottom: 24px;
    /* Removed: box-shadow: inset 0 0 20px rgba(0,0,0,0.5); */
  }
  .wp-prose pre code { background: transparent; border: none; padding: 0; font-size: 13px; color: #00ff88; }
  
  .wp-prose table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 28px;
    font-size: 14px;
    font-family: 'Barlow', system-ui, sans-serif;
  }
  .wp-prose th {
    background: rgba(0, 212, 255, 0.05);
    color: #00d4ff;
    padding: 14px 16px;
    border: 1px solid rgba(0, 212, 255, 0.2);
    font-weight: 600;
    text-align: left;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .wp-prose td {
    color: #cdd4e0;      /* Brightened to match body text */
    padding: 12px 16px;
    border: 1px solid rgba(30, 36, 51, 0.5);
    vertical-align: top;
    line-height: 1.5;
  }
  .wp-prose tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
  .wp-prose hr { border: none; border-top: 1px dashed rgba(0, 212, 255, 0.2); margin: 40px 0; }

  .wp-breadcrumb a {
    color: #8892a4;
    text-decoration: none;
    transition: color 150ms ease;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .wp-breadcrumb a:hover { color: #00d4ff; text-shadow: 0 0 8px rgba(0,212,255,0.4); }
  .wp-breadcrumb .sep {
    color: rgba(0, 212, 255, 0.3);
    margin: 0 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
  }
  .wp-breadcrumb .current {
    color: #00d4ff;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .wp-tag {
    display: inline-block;
    border: 1px solid rgba(0, 212, 255, 0.3);
    background: rgba(0, 212, 255, 0.05);
    color: #00d4ff;
    border-radius: 4px;
    padding: 6px 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    transition: all 200ms ease;
    cursor: default;
  }
  .wp-tag:hover { background: rgba(0, 212, 255, 0.15); box-shadow: 0 0 12px rgba(0,212,255,0.2); }

  .wp-globe-cta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    width: 100%;
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
    border: 1px solid #00d4ff;
    border-radius: 6px;
    padding: 16px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 200ms ease;
  }
  .wp-globe-cta:hover {
    background: #00d4ff;
    color: #050508;
    box-shadow: 0 0 20px rgba(0,212,255,0.4);
  }
  .wp-globe-cta:active { transform: scale(0.98); }

  .wp-related-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    background: rgba(10, 12, 20, 0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(30, 36, 51, 0.8);
    border-radius: 6px;
    text-decoration: none;
    transition: all 200ms ease;
  }
  .wp-related-card:hover {
    border-color: rgba(0, 212, 255, 0.4);
    background: rgba(0, 212, 255, 0.05);
    box-shadow: 0 4px 16px rgba(0,0,0,0.5);
    transform: translateY(-2px);
  }

  .wp-progress {
    position: fixed;
    bottom: 0;         /* Changed from top: 60px */
    left: 0;
    height: 4px;       /* Slightly thicker for better bottom visibility */
    background: linear-gradient(90deg, #00d4ff, #00ff88);
    z-index: 9999;     /* Ensure it sits above all other elements */
    transition: width 100ms ease-out;
    pointer-events: none;
    box-shadow: 0 -2px 10px rgba(0, 212, 255, 0.4); /* Flipped shadow upwards */
  }

  @keyframes wp-fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .wp-fade-up { animation: wp-fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both; }

  /* Sidebar scrollbar */
  .wp-sidebar::-webkit-scrollbar       { width: 4px; }
  .wp-sidebar::-webkit-scrollbar-track { background: transparent; }
  .wp-sidebar::-webkit-scrollbar-thumb { background: rgba(0, 212, 255, 0.2); border-radius: 2px; }
  .wp-sidebar::-webkit-scrollbar-thumb:hover { background: #00d4ff; }

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
  const short = title?.length > 35 ? title.slice(0, 35) + '…' : title;
  return (
    <nav className="wp-breadcrumb" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
      <Link to="/">HOME</Link>
      <span className="sep"><Icons.ChevronRight /></span>
      <Link to="/blog">INTEL</Link>
      <span className="sep"><Icons.ChevronRight /></span>
      <Link to="/blog">{category}</Link>
      <span className="sep"><Icons.ChevronRight /></span>
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
      // Added the environment check here:
      if ((i + 1) % 4 === 0 && i < paragraphs.length - 1 && import.meta.env.VITE_SHOW_ADS !== 'false') {
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
          <div key={chunk.key} style={{ 
            margin: '32px 0', 
            background: 'rgba(0, 212, 255, 0.02)', 
            border: '1px dashed rgba(0, 212, 255, 0.2)',
            padding: '16px 0',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <AdBanner id={chunk.id} size="300x250" />
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
    <div style={{ background: 'rgba(10, 12, 20, 0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0, 212, 255, 0.15)', borderRadius: 6, overflow: 'hidden' }}>
      <div style={{
        padding: '16px',
        background: 'rgba(0, 212, 255, 0.05)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.15)',
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: '#00d4ff',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <Icons.Target /> GLOBAL POWER INDEX
      </div>
      <div style={{ padding: '8px 0' }}>
        {loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} style={{ height: 40, margin: '8px 16px', background: 'rgba(30, 36, 51, 0.5)', borderRadius: 4, animation: 'pulse-live 2s infinite' }} />
            ))
          : countries.map((c, i) => (
              <Link
                key={c.iso3}
                to={`/?countries=${c.iso3}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', textDecoration: 'none',
                  transition: 'background 200ms ease',
                  borderBottom: i < countries.length - 1 ? '1px solid rgba(30,36,51,0.5)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, color: '#00d4ff', width: 20, textAlign: 'right', flexShrink: 0 }}>
                  {c.rank}
                </span>
                {c.iso2 && (
                  <img
                    src={`https://flagcdn.com/w40/${c.iso2.toLowerCase()}.png`}
                    alt={c.name}
                    style={{ width: 28, height: 18, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
                <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 14, fontWeight: 500, color: '#e8eaf0', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name}
                </span>
                <span style={{ color: 'rgba(0, 212, 255, 0.5)', fontSize: 12 }}><Icons.ChevronRight /></span>
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
      <div style={{ marginBottom: 6 }}>
        <span style={{
          background: `${accent}15`, border: `1px solid ${accent}55`,
          borderRadius: 3, padding: '2px 8px',
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600,
          color: accent, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          {post.category}
        </span>
      </div>
      <div style={{
        fontFamily: "'Barlow', system-ui, sans-serif",
        fontSize: 14, fontWeight: 600, color: '#e8eaf0', lineHeight: 1.4,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {post.title}
      </div>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8892a4', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icons.Clock /> {post.readTime}
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
    <div className="wp-page-wrapper">
      <SEO
            title={post.title}
            description={post.excerpt || post.description}
            canonical={`/blog/${post.slug}`}
            image={post.image}
            type="article"
          >
            <script type="application/ld+json">{JSON.stringify(articleSchema({
              title: post.title,
              description: post.excerpt || post.description,
              slug: post.slug,
              date: post.date,
              image: post.image,
              category: post.category,
            }))}</script>
          </SEO>
      <ReadingProgress />  
      <div className="wp-content">
        <Navbar />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(24px,4vw,40px)' }}>

          {/* ── Two-column layout ─────────────────────────────────────── */}
          <div className="wp-layout wp-fade-up" style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>

            {/* ══ LEFT (65%) ════════════════════════════════════════════ */}
            <div style={{ flex: '0 0 65%', minWidth: 0 }}>

              <Breadcrumb category={post.category} title={post.title} />

              {/* Header */}
              <header style={{ marginBottom: 32 }}>
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    background: `${accent}15`, border: `1px solid ${accent}55`,
                    borderRadius: 4, padding: '6px 14px',
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
                    color: accent, letterSpacing: '0.15em', textTransform: 'uppercase',
                  }}>
                    {post.category}
                  </span>
                </div>

                <h1 style={{
                  margin: 0,
                  fontSize: 'clamp(26px, 4vw, 42px)',
                  fontWeight: 800, color: '#e8eaf0',
                  lineHeight: 1.15, letterSpacing: '-0.02em',
                  fontFamily: "'Barlow', system-ui, sans-serif",
                  marginBottom: 20,
                  textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                }}>
                  {post.title}
                </h1>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: '#8892a4',
                  marginBottom: 24, padding: '12px 16px', background: 'rgba(0, 212, 255, 0.05)',
                  border: '1px solid rgba(0, 212, 255, 0.15)', borderRadius: 6,
                }}>
                  {post.author && <><span style={{ color: '#00d4ff', display: 'flex', alignItems: 'center', gap: 6 }}><Icons.Terminal /> {post.author}</span><span style={{ color: 'rgba(0,212,255,0.3)' }}>|</span></>}
                  <span>LOG: {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</span>
                  <span style={{ color: 'rgba(0,212,255,0.3)' }}>|</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icons.Clock /> {post.readTime.toUpperCase()}</span>
                </div>

                {post.coverImage && (
                  <div style={{ position: 'relative', height: 400, borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(0, 212, 255, 0.2)', background: '#050508', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.parentElement.style.display = 'none'; }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 212, 255, 0.05) 51%, transparent 51%)',
                      backgroundSize: '100% 4px',
                      pointerEvents: 'none',
                    }}/>
                  </div>
                )}
              </header>

              {/* Ad after header */}
              <div style={{ margin: '32px 0' }}>
                <AdBanner id="ad-post-top" size="728x90" />
              </div>

              {/* Globe CTA */}
              {countryLabel && (
                <div style={{ margin: '32px 0' }}>
                  <button
                    className="wp-globe-cta"
                    onClick={() => navigate(`/?countries=${post.countries.join(',')}`)}
                  >
                    <Icons.Globe /> INITIATE MAP VISUALIZATION: {countryLabel}
                  </button>
                </div>
              )}

              {/* Article body */}
              <ContentWithAds content={post.content} />

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid rgba(30, 36, 51, 0.8)' }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#00d4ff', textTransform: 'uppercase', marginBottom: 16 }}>
                    CLASSIFICATION TAGS
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {post.tags.map(tag => <span key={tag} className="wp-tag">{tag}</span>)}
                  </div>
                </div>
              )}

              {/* Bottom ad */}
              <div style={{ margin: '48px 0 0' }}>
                <AdBanner id="ad-post-bottom" size="728x90" />
              </div>
            </div>

            {/* ══ RIGHT SIDEBAR (35%) ════════════════════════════════════ */}
            <div
              className="wp-sidebar"
              style={{
                flex: '0 0 35%', position: 'sticky', top: 100,
                maxHeight: 'calc(100vh - 120px)', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: 32,
                paddingRight: 8,
              }}
            >
              {/* Related briefs */}
              <div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.15em', color: '#00d4ff',
                  textTransform: 'uppercase', marginBottom: 16,
                  paddingBottom: 10, borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
                  display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <div style={{ width: 4, height: 4, background: '#00d4ff', borderRadius: '50%', boxShadow: '0 0 8px #00d4ff' }} />
                  RELATED INTEL
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {related.map(r => <SidebarCard key={r.slug} post={r} />)}
                </div>
              </div>

              {/* Sidebar ad */}
              <div style={{ background: 'rgba(0, 212, 255, 0.02)', border: '1px dashed rgba(0, 212, 255, 0.2)', borderRadius: 6, padding: '16px 0', display: 'flex', justifyContent: 'center' }}>
                <AdBanner id="ad-sidebar" size="300x250" />
              </div>

              {/* Top powers widget */}
              <TopCountriesWidget />
            </div>
          </div>

          {/* ── Bottom: More Intelligence ──────────────────────────────── */}
          {related.length > 0 && (
            <div style={{ marginTop: 80, paddingTop: 48, borderTop: '1px dashed rgba(0, 212, 255, 0.2)' }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 600,
                letterSpacing: '0.15em', color: '#00d4ff',
                textTransform: 'uppercase', marginBottom: 32,
                textAlign: 'center',
              }}>
                [ ACCESS MORE DECLASSIFIED FILES ]
              </div>
              <div
                className="wp-bottom-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}
              >
                {related.map((r, i) => (
                  <div key={r.slug} className="wp-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                    <BlogCard post={r} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}