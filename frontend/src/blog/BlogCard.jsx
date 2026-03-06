// src/blog/BlogCard.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS = {
  Comparison: '#00d4ff',
  Nuclear:    '#ffaa00',
  Analysis:   '#00ff88',
  Rankings:   '#ff3b3b',
};

const CATEGORY_BG = {
  Comparison: 'rgba(0,212,255,0.1)',
  Nuclear:    'rgba(255,170,0,0.1)',
  Analysis:   'rgba(0,255,136,0.1)',
  Rankings:   'rgba(255,59,59,0.1)',
};

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'short',
    day:   'numeric',
  });
}

export default function BlogCard({ post, style = {} }) {
  const [hovered, setHovered]   = useState(false);
  const [imgError, setImgError] = useState(false);

  const accentColor = CATEGORY_COLORS[post.category] ?? '#00d4ff';
  const accentBg    = CATEGORY_BG[post.category]     ?? 'rgba(0,212,255,0.1)';

  return (
    <Link
      to={`/blog/${post.slug}`}
      style={{
        display:        'flex',
        flexDirection:  'column',
        background:     '#0f1117',
        border:         `1px solid ${hovered ? accentColor : '#1e2433'}`,
        borderRadius:   8,
        overflow:       'hidden',
        textDecoration: 'none',
        transition:     'border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease',
        boxShadow:      hovered
          ? `0 0 20px ${accentColor}1a, 0 4px 24px rgba(0,0,0,0.4)`
          : '0 2px 8px rgba(0,0,0,0.3)',
        transform:      hovered ? 'translateY(-2px)' : 'translateY(0)',
        cursor:         'pointer',
        ...style,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Cover image */}
      <div style={{
        height:     180,
        background: '#0a0c14',
        overflow:   'hidden',
        flexShrink: 0,
        position:   'relative',
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
              transition: 'transform 400ms ease',
              transform:  hovered ? 'scale(1.04)' : 'scale(1)',
              filter:     'brightness(0.75) saturate(0.8)',
            }}
          />
        ) : (
          // Placeholder with grid pattern
          <div style={{
            width:    '100%',
            height:   '100%',
            background: `
              repeating-linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
              repeating-linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '28px 28px',
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontSize: 36, opacity: 0.25 }}>⚔️</span>
          </div>
        )}

        {/* Category badge over image */}
        <div style={{
          position:     'absolute',
          top:          12,
          left:         12,
          background:   accentBg,
          border:       `1px solid ${accentColor}44`,
          borderRadius: 4,
          padding:      '3px 9px',
          fontFamily:   "'IBM Plex Mono', monospace",
          fontSize:     9,
          fontWeight:   500,
          color:        accentColor,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(4px)',
        }}>
          {post.category}
        </div>

        {/* Gradient overlay bottom of image */}
        <div style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     60,
          background: 'linear-gradient(transparent, #0f1117)',
        }} />
      </div>

      {/* Card body */}
      <div style={{
        flex:       1,
        display:    'flex',
        flexDirection: 'column',
        padding:    '16px 18px 18px',
        gap:        8,
      }}>
        {/* Title */}
        <h2 style={{
          margin:        0,
          fontSize:      15,
          fontWeight:    700,
          color:         '#e8eaf0',
          lineHeight:    1.4,
          fontFamily:    "'Barlow', system-ui, sans-serif",
          letterSpacing: '-0.01em',
          // 2-line clamp
          display:            '-webkit-box',
          WebkitLineClamp:    2,
          WebkitBoxOrient:    'vertical',
          overflow:           'hidden',
          textOverflow:       'ellipsis',
        }}>
          {post.title}
        </h2>

        {/* Excerpt */}
        <p style={{
          margin:      0,
          fontSize:    13,
          color:       '#8892a4',
          lineHeight:  1.55,
          fontFamily:  "'Barlow', system-ui, sans-serif",
          // 2-line clamp
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
          marginTop:      4,
          paddingTop:     12,
          borderTop:      '1px solid rgba(30,36,51,0.8)',
        }}>
          <div style={{
            display:    'flex',
            gap:        10,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize:   11,
            color:      '#4a5568',
          }}>
            <span>{formatDate(post.date)}</span>
            {post.readTime && (
              <>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{post.readTime}</span>
              </>
            )}
          </div>
          <span style={{
            fontSize:      13,
            fontWeight:    600,
            color:         accentColor,
            fontFamily:    "'Barlow', system-ui, sans-serif",
            letterSpacing: '0.01em',
            transition:    'gap 150ms',
            display:       'flex',
            alignItems:    'center',
            gap:           hovered ? 6 : 4,
          }}>
            Read Brief →
          </span>
        </div>
      </div>
    </Link>
  );
}