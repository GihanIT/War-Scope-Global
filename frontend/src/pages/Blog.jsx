// src/pages/Blog.jsx
import { useState, useMemo } from 'react';
import { Helmet }   from 'react-helmet';
import Navbar       from '../components/Navbar.jsx';
import AdBanner     from '../components/AdBanner.jsx';
import BlogCard     from '../blog/BlogCard.jsx';
import BLOG_POSTS, { CATEGORIES } from '../blog/blog-data.js';

// ─── CSS injected once ────────────────────────────────────────────────────────
const BLOG_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Barlow:wght@300;400;600;700&display=swap');

  .blog-cat-btn {
    padding: 7px 16px;
    border-radius: 5px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 160ms ease;
    white-space: nowrap;
    outline: none;
  }
  .blog-cat-btn.inactive {
    background: transparent;
    color: #8892a4;
    border: 1px solid #1e2433;
  }
  .blog-cat-btn.inactive:hover {
    border-color: #00d4ff;
    color: #e8eaf0;
    background: rgba(0,212,255,0.05);
  }
  .blog-cat-btn.active {
    background: #00d4ff;
    color: #0a0a0f;
    border: 1px solid transparent;
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
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .blog-card-anim {
    animation: blog-card-in 300ms ease both;
  }

  @keyframes blog-hero-in {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .blog-hero-anim { animation: blog-hero-in 400ms ease both; }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

// ─── Featured hero card ───────────────────────────────────────────────────────
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Comparison: '#00d4ff',
  Nuclear:    '#ffaa00',
  Analysis:   '#00ff88',
  Rankings:   '#ff3b3b',
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
        borderRadius:   10,
        overflow:       'hidden',
        border:         `1px solid ${hovered ? accent : '#1e2433'}`,
        boxShadow:      hovered ? `0 0 30px ${accent}22` : '0 4px 20px rgba(0,0,0,0.4)',
        transition:     'border-color 200ms, box-shadow 200ms',
        background:     '#0f1117',
        marginBottom:   0,
      }}
    >
      {/* Background image */}
      <div style={{ height: 340, position: 'relative', overflow: 'hidden' }}>
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
              filter:     'brightness(0.45) saturate(0.7)',
              transform:  hovered ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 500ms ease',
            }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'repeating-linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), repeating-linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
        )}

        {/* Content overlay */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to top, #0f1117 35%, transparent 80%)',
          display:    'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:    '28px 32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{
              background:   `${accent}18`,
              border:       `1px solid ${accent}55`,
              borderRadius: 4,
              padding:      '3px 10px',
              fontFamily:   "'IBM Plex Mono', monospace",
              fontSize:     9,
              color:        accent,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}>
              {post.category}
            </span>
            <span style={{
              background:   'rgba(255,59,59,0.15)',
              border:       '1px solid rgba(255,59,59,0.3)',
              borderRadius: 4,
              padding:      '3px 10px',
              fontFamily:   "'IBM Plex Mono', monospace",
              fontSize:     9,
              color:        '#ff3b3b',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}>
              Featured
            </span>
          </div>
          <h2 style={{
            margin:        0,
            fontSize:      'clamp(18px, 2.5vw, 26px)',
            fontWeight:    700,
            color:         '#e8eaf0',
            lineHeight:    1.25,
            letterSpacing: '-0.02em',
            fontFamily:    "'Barlow', system-ui, sans-serif",
            marginBottom:  10,
            maxWidth:      600,
          }}>
            {post.title}
          </h2>
          <p style={{
            margin:     0,
            fontSize:   14,
            color:      '#8892a4',
            lineHeight: 1.5,
            maxWidth:   520,
            marginBottom: 16,
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
          }}>
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{post.readTime}</span>
            <span style={{ marginLeft: 'auto', color: accent, fontWeight: 600, fontSize: 13, letterSpacing: '0.02em' }}>
              Read Brief →
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
      display:      'inline-flex',
      alignItems:   'center',
      justifyContent: 'center',
      minWidth:     20,
      height:       18,
      background:   'rgba(0,212,255,0.1)',
      border:       '1px solid rgba(0,212,255,0.2)',
      borderRadius: 10,
      fontFamily:   "'IBM Plex Mono', monospace",
      fontSize:     9,
      color:        '#00d4ff',
      padding:      '0 5px',
      marginLeft:   6,
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
  const regularPosts = filtered.filter(p => !p.featured || activeCategory !== 'All');
  // When showing All, separate featured from grid; otherwise show all filtered in grid
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
    <div style={{ minHeight: '100dvh', background: '#0a0a0f' }}>
      <Helmet>
        <title>Military Intelligence Blog | WarScope</title>
        <meta
          name="description"
          content="In-depth military analysis, country comparisons, nuclear rankings and global conflict intelligence from the WarScope research team."
        />
        <meta property="og:title" content="Military Intelligence Blog | WarScope" />
        <meta property="og:description" content="Military analysis, comparisons, nuclear rankings and global power data." />
      </Helmet>

      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0f1117 100%)',
        padding:    'clamp(40px,6vw,80px) clamp(20px,5vw,60px) clamp(32px,4vw,56px)',
        position:   'relative',
        overflow:   'hidden',
        borderBottom: '1px solid #1e2433',
      }}>
        {/* Grid texture */}
        <div style={{
          position:       'absolute',
          inset:          0,
          backgroundImage: 'repeating-linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),repeating-linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents:  'none',
        }} />
        {/* Vignette */}
        <div style={{
          position:   'absolute',
          inset:      0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,212,255,0.04) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="blog-hero-anim" style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display:       'inline-flex',
            alignItems:    'center',
            gap:           8,
            marginBottom:  16,
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      10,
            letterSpacing: '0.2em',
            color:         '#00d4ff',
            opacity:       0.7,
            textTransform: 'uppercase',
          }}>
            <span style={{
              width:        6,
              height:       6,
              borderRadius: '50%',
              background:   '#ff3b3b',
              boxShadow:    '0 0 6px #ff3b3b',
              display:      'inline-block',
            }} />
            WarScope Research Division
          </div>

          <h1 style={{
            margin:        0,
            fontSize:      'clamp(28px, 5vw, 52px)',
            fontWeight:    700,
            color:         '#e8eaf0',
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
            fontFamily:    "'Barlow', system-ui, sans-serif",
            marginBottom:  16,
          }}>
            Intelligence Briefings
          </h1>

          <p style={{
            margin:      '0 auto',
            fontSize:    'clamp(14px, 2vw, 17px)',
            color:       '#8892a4',
            letterSpacing: '0.01em',
            fontFamily:  "'Barlow', system-ui, sans-serif",
            maxWidth:    480,
          }}>
            Military Analysis&nbsp;•&nbsp;Comparisons&nbsp;•&nbsp;Global Power Data
          </p>

          {/* Stat pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            {[
              { label: 'Briefings', value: BLOG_POSTS.length },
              { label: 'Countries Covered', value: '40+' },
              { label: 'Categories', value: CATEGORIES.length - 1 },
            ].map(({ label, value }) => (
              <div key={label} style={{
                background:   'rgba(0,212,255,0.06)',
                border:       '1px solid rgba(0,212,255,0.15)',
                borderRadius: 6,
                padding:      '8px 18px',
                fontFamily:   "'IBM Plex Mono', monospace",
                fontSize:     11,
                color:        '#00d4ff',
                letterSpacing: '0.08em',
              }}>
                <span style={{ fontWeight: 700, fontSize: 16 }}>{value}</span>
                <span style={{ opacity: 0.6, marginLeft: 8 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Top ad ────────────────────────────────────────────────────── */}
      <div style={{ padding: '32px 40px 0', maxWidth: 1200, margin: '0 auto' }}>
        <AdBanner id="ad-blog-top" size="728x90" />
      </div>

      {/* ── Featured posts (All view only) ────────────────────────────── */}
      {activeCategory === 'All' && featured.length > 0 && (
        <div style={{ padding: '40px 40px 0', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      10,
            letterSpacing: '0.18em',
            color:         '#00d4ff',
            opacity:       0.65,
            textTransform: 'uppercase',
            marginBottom:  16,
          }}>
            Featured
          </div>
          <div style={{
            display:               'grid',
            gridTemplateColumns:   featured.length > 1 ? '1fr 1fr' : '1fr',
            gap:                   20,
          }}
            className="blog-grid"
            // Override to 2 cols for featured only
            data-featured="true"
          >
            {featured.map((post, i) => (
              <div
                key={post.slug}
                className="blog-card-anim"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <FeaturedCard post={post} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Category filter ───────────────────────────────────────────── */}
      <div style={{
        padding:    '32px 40px 0',
        maxWidth:   1200,
        margin:     '0 auto',
      }}>
        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        8,
          flexWrap:   'wrap',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`blog-cat-btn ${activeCategory === cat ? 'active' : 'inactive'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              {activeCategory !== cat && (
                <CountBadge count={catCounts[cat]} category={cat} />
              )}
            </button>
          ))}
          <div style={{
            marginLeft:  'auto',
            fontFamily:  "'IBM Plex Mono', monospace",
            fontSize:    10,
            color:       '#4a5568',
            letterSpacing: '0.08em',
          }}>
            {filtered.length} brief{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* ── Posts grid ───────────────────────────────────────────────── */}
      <div style={{ padding: '32px 40px 64px', maxWidth: 1200, margin: '0 auto' }}>
        {gridPosts.length === 0 ? (
          <div style={{
            textAlign:    'center',
            padding:      '64px 0',
            color:        '#4a5568',
            fontFamily:   "'IBM Plex Mono', monospace",
            fontSize:     12,
            letterSpacing: '0.08em',
          }}>
            No briefings in this category yet.
          </div>
        ) : (
          <div className="blog-grid">
            {gridItems.map((item, idx) => {
              if (item.type === 'ad') {
                return (
                  <div
                    key={item.id}
                    style={{ gridColumn: '1 / -1', margin: '8px 0' }}
                  >
                    <AdBanner id={item.id} size="728x90" />
                  </div>
                );
              }
              return (
                <div
                  key={item.post.slug}
                  className="blog-card-anim"
                  style={{ animationDelay: `${(item.index % 3) * 80}ms` }}
                >
                  <BlogCard post={item.post} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}