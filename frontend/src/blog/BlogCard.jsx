// src/blog/BlogCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Tag: () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  ChevronRight: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  IntelFile: () => <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
};

const CATEGORY_COLORS = {
  Comparison: '#00d4ff', // Cyan
  Nuclear:    '#ffaa00', // Amber
  Analysis:   '#00ff88', // Green
  Rankings:   '#ff3b3b', // Red
};

const CATEGORY_BG = {
  Comparison: 'rgba(0,212,255,0.15)',
  Nuclear:    'rgba(255,170,0,0.15)',
  Analysis:   'rgba(0,255,136,0.15)',
  Rankings:   'rgba(255,59,59,0.15)',
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  }).toUpperCase();
}

export default function BlogCard({ post, style = {} }) {
  const [hovered, setHovered]   = useState(false);
  const [imgError, setImgError] = useState(false);

  const accentColor = CATEGORY_COLORS[post.category] ?? '#00d4ff';
  const accentBg    = CATEGORY_BG[post.category]     ?? 'rgba(0,212,255,0.15)';

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{
        display:        'flex',
        flexDirection:  'column',
        background:     'rgba(10, 12, 20, 0.65)',
        backdropFilter: 'blur(12px)',
        border:         `1px solid ${hovered ? accentColor : 'rgba(30, 36, 51, 0.8)'}`,
        borderRadius:   6,
        overflow:       'hidden',
        textDecoration: 'none',
        transition:     'all 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow:      hovered
          ? `0 8px 24px ${accentColor}22, 0 4px 12px rgba(0,0,0,0.5)`
          : '0 4px 12px rgba(0,0,0,0.3)',
        transform:      hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor:         'pointer',
        height:         '100%',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover image container */}
      <div style={{
        height:     180,
        background: '#050508',
        overflow:   'hidden',
        flexShrink: 0,
        position:   'relative',
        borderBottom: `1px solid ${hovered ? `${accentColor}44` : 'rgba(30,36,51,0.5)'}`,
        transition: 'border-color 300ms ease',
      }}>
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
              transition: 'transform 500ms ease, filter 500ms ease',
              transform:  hovered ? 'scale(1.04)' : 'scale(1)',
              filter:     'none', /* explicitly forces 100% brightness at all times */
              /*filter:     hovered ? 'brightness(0.6) saturate(0.9)' : 'brightness(0.4) saturate(0.7)',*/
            }}
          />
        ) : (
          // Tactical Placeholder with grid and SVG
          <div style={{
            width:    '100%',
            height:   '100%',
            background: `
              repeating-linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
              repeating-linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'center',
            color: accentColor,
          }}>
            <Icons.IntelFile />
          </div>
        )}

        {/* Tactical Scanline Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(0, 212, 255, 0.04) 51%, transparent 51%)',
          backgroundSize: '100% 4px',
          pointerEvents: 'none',
        }}/>

        {/* Category badge over image */}
        <div style={{
          position:     'absolute',
          top:          12,
          left:         12,
          background:   accentBg,
          border:       `1px solid ${accentColor}55`,
          borderRadius: 3,
          padding:      '4px 8px',
          fontFamily:   "'IBM Plex Mono', monospace",
          fontSize:     9,
          fontWeight:   600,
          color:        accentColor,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(4px)',
          display:      'flex',
          alignItems:   'center',
          gap:          6,
        }}>
          <Icons.Tag /> {post.category}
        </div>

        {/* Gradient overlay bottom of image */}
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     40,
          background: 'linear-gradient(transparent, rgba(10,12,20,0.8))',
        }} />
      </div>

      {/* Card body */}
      <div style={{
        flex:           1,
        display:        'flex',
        flexDirection:  'column',
        padding:        '20px',
        gap:            10,
      }}>
        {/* Title */}
        <h2 style={{
          margin:        0,
          fontSize:      16,
          fontWeight:    700,
          color:         hovered ? '#ffffff' : '#e8eaf0',
          lineHeight:    1.4,
          fontFamily:    "'Barlow', system-ui, sans-serif",
          letterSpacing: '-0.01em',
          display:            '-webkit-box',
          WebkitLineClamp:    2,
          WebkitBoxOrient:    'vertical',
          overflow:           'hidden',
          textOverflow:       'ellipsis',
          transition:    'color 200ms ease',
        }}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p style={{
          margin:      0,
          fontSize:    13,
          color:       '#8892a4',
          lineHeight:  1.6,
          fontFamily:  "'Barlow', system-ui, sans-serif",
          display:            '-webkit-box',
          WebkitLineClamp:    2,
          WebkitBoxOrient:    'vertical',
          overflow:           'hidden',
          textOverflow:       'ellipsis',
          flex:        1,
        }}>
          {post.excerpt}
        </p>

        {/* Footer */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          marginTop:      8,
          paddingTop:     14,
          borderTop:      '1px solid rgba(30,36,51,0.6)',
        }}>
          <div style={{
            display:    'flex',
            gap:        10,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize:   10,
            color:      '#4a5568',
            letterSpacing: '0.05em',
          }}>
            <span>LOG: {formatDate(post.date)}</span>
            {post.readTime && (
              <>
                <span style={{ opacity: 0.4 }}>|</span>
                <span>T-MINUS: {post.readTime.toUpperCase()}</span>
              </>
            )}
          </div>
          <span style={{
            fontSize:      10,
            fontWeight:    600,
            color:         accentColor,
            fontFamily:    "'IBM Plex Mono', monospace",
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition:    'all 200ms ease',
            display:       'flex',
            alignItems:    'center',
            gap:           hovered ? 6 : 4,
            textShadow:    hovered ? `0 0 8px ${accentColor}66` : 'none',
          }}>
            DECRYPT <Icons.ChevronRight />
          </span>
        </div>
      </div>
    </Link>
  );
}