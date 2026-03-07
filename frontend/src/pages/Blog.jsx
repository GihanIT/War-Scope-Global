// src/pages/Blog.jsx
import { useState, useMemo } from 'react';
import { Helmet }   from 'react-helmet';
import { Link }     from 'react-router-dom';
import Navbar       from '../components/Navbar.jsx';
import AdBanner     from '../components/AdBanner.jsx';
import BlogCard     from '../blog/BlogCard.jsx';
import BLOG_POSTS, { CATEGORIES } from '../data/blog-data.js';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Radar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="12" x2="12" y2="2"/></svg>,
  Database: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
  Crosshair: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>,
  Tag: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  ChevronRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
};

// ─── CSS injected once ────────────────────────────────────────────────────────
const BLOG_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow:wght@300;400;600;700;900&display=swap');

  .blog-page-wrapper {
    min-height: 100dvh;
    background-color: #050508;
    position: relative;
    overflow-x: hidden;
  }

  /* Tactical Grid Background */
  .blog-page-wrapper::before {
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

  .blog-content {
    position: relative;
    z-index: 1;
  }

  .blog-cat-btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 200ms ease;
    white-space: nowrap;
    outline: none;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .blog-cat-btn.inactive {
    background: rgba(10, 12, 20, 0.6);
    color: #8892a4;
    border: 1px solid rgba(0, 212, 255, 0.15);
    backdrop-filter: blur(8px);
  }
  .blog-cat-btn.inactive:hover {
    border-color: #00d4ff;
    color: #e8eaf0;
    background: rgba(0, 212, 255, 0.05);
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.15);
  }
  .blog-cat-btn.active {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
    border: 1px solid #00d4ff;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.25);
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.5);
  }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  }
  @media (max-width: 900px) {
    .blog-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 560px) {
    .blog-grid { grid-template-columns: 1fr; }
  }

  @keyframes blog-card-in {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .blog-card-anim {
    animation: blog-card-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  @keyframes blog-hero-in {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .blog-hero-anim { animation: blog-hero-in 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }
  
  @keyframes pulse-live {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(255,59,59,0.4); }
    50% { opacity: 0.6; box-shadow: 0 0 2px rgba(255,59,59,0.1); }
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

// ─── Featured hero card ───────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Comparison: '#00d4ff', // Cyan
  Nuclear:    '#ffaa00', // Amber
  Analysis:   '#00ff88', // Green
  Rankings:   '#ff3b3b', // Red
};

function FeaturedCard({ post }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const accent = CATEGORY_COLORS[post.category] ?? '#00d4ff';

  return (
    <Link
      to={`/blog/${post.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:        'block',
        textDecoration: 'none',
        position:       'relative',
        borderRadius:   6,
        overflow:       'hidden',
        border:         `1px solid ${hovered ? accent : 'rgba(0, 212, 255, 0.2)'}`,
        boxShadow:      hovered ? `0 8px 32px ${accent}33` : '0 8px 32px rgba(0,0,0,0.6)',
        transition:     'all 300ms ease',
        background:     'rgba(10, 12, 20, 0.8)',
        marginBottom:   0,
      }}
    >
      {/* Background image */}
      <div style={{ height: 360, position: 'relative', overflow: 'hidden' }}>
        {post.coverImage && !imgError ? (
          <img
            src={post.coverImage}
            alt={post.title}
            onError={() => setImgError(true)}
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              display:    'block',
              // The filter line has been removed to eliminate the dark vintage look
              transform:  hovered ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 500ms ease',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'repeating-linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), repeating-linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        )}


        {/* Tactical Scanline Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 212, 255, 0.05) 51%, transparent 51%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
        }}/>

        {/* Content overlay */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to top, rgba(5,5,8,0.85) 0%, transparent 35%)',
          display:    'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:    '32px 40px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{
              background:   `${accent}15`,
              border:       `1px solid ${accent}55`,
              borderRadius: 3,
              padding:      '4px 10px',
              fontFamily:   "'IBM Plex Mono', monospace",
              fontSize:     10,
              fontWeight:   600,
              color:        accent,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              display:      'flex',
              alignItems:   'center',
              gap:          6,
            }}>
              <Icons.Tag /> {post.category}
            </span>
            <span style={{
              background:   'rgba(255,59,59,0.1)',
              border:       '1px solid rgba(255,59,59,0.4)',
              borderRadius: 3,
              padding:      '4px 10px',
              fontFamily:   "'IBM Plex Mono', monospace",
              fontSize:     10,
              fontWeight:   600,
              color:        '#ff8080',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              animation:    'pulse-live 2s infinite',
            }}>
              PRIORITY INTEL
            </span>
          </div>
          <h2 style={{
            margin:        0,
            fontSize:      'clamp(22px, 3vw, 32px)',
            fontWeight:    700,
            color:         '#e8eaf0',
            lineHeight:    1.2,
            letterSpacing: '-0.01em',
            fontFamily:    "'Barlow', system-ui, sans-serif",
            marginBottom:  12,
            maxWidth:      700,
            textShadow:    '0 4px 12px rgba(0,0,0,0.8)',
          }}>
            {post.title}
          </h2>
          <p style={{
            margin:     0,
            fontSize:   15,
            color:      '#8892a4',
            lineHeight: 1.6,
            maxWidth:   600,
            marginBottom: 20,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {post.excerpt}
          </p>
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        16,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize:   11,
            color:      '#4a5568',
            letterSpacing: '0.05em',
          }}>
            <span>LOG: {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}</span>
            <span style={{ opacity: 0.4 }}>|</span>
            <span>T-MINUS: {post.readTime.toUpperCase()}</span>
            <span style={{ 
              marginLeft: 'auto', 
              color: accent, 
              fontWeight: 600, 
              fontSize: 12, 
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              textTransform: 'uppercase',
            }}>
              Decrypt Brief <Icons.ChevronRight />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Post count badge ─────────────────────────────────────────────────────────
function CountBadge({ count, category }) {
  return (
    <span style={{
      display:        'inline-flex',
      alignItems:     'center',
      justifyContent: 'center',
      minWidth:       22,
      height:         20,
      background:     'rgba(0, 0, 0, 0.3)',
      border:         '1px solid rgba(0,212,255,0.3)',
      borderRadius:   4,
      fontFamily:     "'IBM Plex Mono', monospace",
      fontSize:       10,
      fontWeight:     600,
      color:          '#00d4ff',
      padding:        '0 6px',
    }}>
      {count}
    </span>
  );
}

// ─── Blog page ────────────────────────────────────────────────────────────────
export default function Blog() {
  injectCSS('blog-page-css', BLOG_CSS);

  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  const featured = BLOG_POSTS.filter(p => p.featured);
  const gridPosts = activeCategory === 'All'
    ? filtered.filter(p => !p.featured)
    : filtered;

  // Build grid items with inline ads every 3 cards
  const gridItems = [];
  let adRowCount  = 0;
  gridPosts.forEach((post, i) => {
    gridItems.push({ type: 'card', post, index: i });
    if ((i + 1) % 3 === 0 && i !== gridPosts.length - 1) {
      adRowCount++;
      gridItems.push({ type: 'ad', id: `ad-blog-row-${adRowCount}` });
    }
  });

  const catCounts = useMemo(() => {
    const counts = { All: BLOG_POSTS.length };
    CATEGORIES.slice(1).forEach(cat => {
      counts[cat] = BLOG_POSTS.filter(p => p.category === cat).length;
    });
    return counts;
  }, []);

  return (
    <div className="blog-page-wrapper">
      <Helmet>
        <title>Intelligence Briefings | WarScope</title>
        <meta
          name="description"
          content="In-depth military analysis, country comparisons, nuclear rankings and global conflict intelligence from the WarScope research team."
        />
        <meta property="og:title" content="Intelligence Briefings | WarScope" />
        <meta property="og:description" content="Military analysis, comparisons, nuclear rankings and global power data." />
      </Helmet>

      <div className="blog-content">
        <Navbar />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(5,5,8,0.9) 0%, rgba(10,12,20,0.9) 100%)',
          backdropFilter: 'blur(12px)',
          padding:    'clamp(48px,6vw,80px) clamp(24px,5vw,64px) clamp(40px,4vw,64px)',
          position:   'relative',
          borderBottom: '1px solid rgba(0, 212, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}>
          {/* Vignette */}
          <div style={{
            position:   'absolute',
            inset:      0,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          <div className="blog-hero-anim" style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           10,
              marginBottom:  20,
              fontFamily:    "'IBM Plex Mono', monospace",
              fontSize:      11,
              fontWeight:    600,
              letterSpacing: '0.2em',
              color:         '#00d4ff',
              textTransform: 'uppercase',
              border:        '1px solid rgba(0, 212, 255, 0.2)',
              background:    'rgba(0, 212, 255, 0.05)',
              padding:       '6px 16px',
              borderRadius:  4,
            }}>
              <Icons.Radar /> WARSCOPE RESEARCH DIV.
            </div>

            <h1 style={{
              margin:        0,
              fontSize:      'clamp(32px, 5vw, 56px)',
              fontWeight:    800,
              color:         '#e8eaf0',
              letterSpacing: '-0.02em',
              lineHeight:    1.1,
              fontFamily:    "'Barlow', system-ui, sans-serif",
              marginBottom:  16,
              textShadow:    '0 0 20px rgba(0, 212, 255, 0.2)',
            }}>
              Intelligence <span style={{ color: '#00d4ff' }}>Briefings</span>
            </h1>

            <p style={{
              margin:      '0 auto',
              fontSize:    'clamp(15px, 2vw, 18px)',
              color:       '#8892a4',
              letterSpacing: '0.02em',
              fontFamily:  "'Barlow', system-ui, sans-serif",
              maxWidth:    540,
              lineHeight:  1.5,
            }}>
              Access classified military analysis, global power comparisons, and real-time conflict assessments.
            </p>

            {/* Stat pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
              {[
                { label: 'ARCHIVED BRIEFS', value: BLOG_POSTS.length, icon: <Icons.Database /> },
                { label: 'MONITORED STATES', value: '40+', icon: <Icons.Crosshair /> },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{
                  background:   'rgba(10, 12, 20, 0.8)',
                  border:       '1px solid rgba(0,212,255,0.2)',
                  borderRadius: 4,
                  padding:      '10px 20px',
                  fontFamily:   "'IBM Plex Mono', monospace",
                  fontSize:     11,
                  color:        '#8892a4',
                  letterSpacing: '0.1em',
                  display:      'flex',
                  alignItems:   'center',
                  gap:          12,
                }}>
                  <span style={{ color: '#00d4ff', opacity: 0.8 }}>{icon}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2 }}>
                    <span style={{ fontWeight: 700, fontSize: 16, color: '#e8eaf0', lineHeight: 1 }}>{value}</span>
                    <span style={{ fontSize: 9 }}>{label}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Top ad ────────────────────────────────────────────────────── */}
        <div style={{ padding: '40px 48px 0', maxWidth: 1200, margin: '0 auto' }}>
          <AdBanner id="ad-blog-top" size="728x90" />
        </div>

        {/* ── Featured posts (All view only) ────────────────────────────── */}
        {activeCategory === 'All' && featured.length > 0 && (
          <div style={{ padding: '48px 48px 0', maxWidth: 1200, margin: '0 auto' }}>
            <div style={{
              fontFamily:    "'IBM Plex Mono', monospace",
              fontSize:      11,
              fontWeight:    600,
              letterSpacing: '0.2em',
              color:         '#00d4ff',
              textTransform: 'uppercase',
              marginBottom:  20,
              display:       'flex',
              alignItems:    'center',
              gap:           10,
              borderBottom:  '1px solid rgba(0, 212, 255, 0.15)',
              paddingBottom: 8,
            }}>
              <div style={{ width: 6, height: 6, background: '#00d4ff', borderRadius: '50%', boxShadow: '0 0 8px #00d4ff' }} />
              PRIORITY DIRECTIVES
            </div>
            <div style={{
              display:             'grid',
              gridTemplateColumns: featured.length > 1 ? '1fr 1fr' : '1fr',
              gap:                 24,
            }}
              className="blog-grid"
              data-featured="true"
            >
              {featured.map((post, i) => (
                <div
                  key={post.slug}
                  className="blog-card-anim"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <FeaturedCard post={post} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Category filter ───────────────────────────────────────────── */}
        <div style={{
          padding:    '48px 48px 0',
          maxWidth:   1200,
          margin:     '0 auto',
        }}>
          <div style={{
            display:    'flex',
            alignItems: 'center',
            gap:        12,
            flexWrap:   'wrap',
            background: 'rgba(10, 12, 20, 0.6)',
            padding:    '16px',
            borderRadius: 6,
            border:     '1px solid rgba(30, 36, 51, 0.5)',
            backdropFilter: 'blur(12px)',
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`blog-cat-btn ${activeCategory === cat ? 'active' : 'inactive'}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                <CountBadge count={catCounts[cat]} category={cat} />
              </button>
            ))}
            <div style={{
              marginLeft:  'auto',
              fontFamily:  "'IBM Plex Mono', monospace",
              fontSize:    11,
              color:       '#00d4ff',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity:     0.8,
            }}>
              [ {filtered.length} RECORDS FOUND ]
            </div>
          </div>
        </div>

        {/* ── Posts grid ───────────────────────────────────────────────── */}
        <div style={{ padding: '32px 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
          {gridPosts.length === 0 ? (
            <div style={{
              textAlign:    'center',
              padding:      '80px 0',
              background:   'rgba(0, 212, 255, 0.02)',
              border:       '1px dashed rgba(0, 212, 255, 0.2)',
              borderRadius: 6,
              color:        '#8892a4',
              fontFamily:   "'IBM Plex Mono', monospace",
              fontSize:     12,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              [ ERR: NO DECLASSIFIED FILES IN THIS SECTOR ]
            </div>
          ) : (
            <div className="blog-grid">
              {gridItems.map((item, idx) => {
                if (item.type === 'ad') {
                  return (
                    <div
                      key={item.id}
                      style={{ 
                        gridColumn: '1 / -1', 
                        margin: '16px 0',
                        background: 'rgba(0, 212, 255, 0.02)',
                        border: '1px dashed rgba(0, 212, 255, 0.2)',
                        borderRadius: 6,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: 110,
                      }}
                    >
                      <AdBanner id={item.id} size="728x90" />
                    </div>
                  );
                }
                return (
                  <div
                    key={item.post.slug}
                    className="blog-card-anim"
                    style={{ animationDelay: `${(item.index % 3) * 100}ms` }}
                  >
                    <BlogCard post={item.post} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}