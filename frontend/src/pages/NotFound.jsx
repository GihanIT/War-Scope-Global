import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0f' }}>
      <Navbar />
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        height:         'calc(100dvh - 60px)',
        textAlign:      'center',
        padding:        24,
        fontFamily:     "'Barlow', system-ui, sans-serif",
        userSelect:     'none',
      }}>
        {/* Grid background */}
        <div style={{
          position:   'fixed',
          inset:      0,
          background: 'repeating-linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), repeating-linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex:     0,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      96,
            fontWeight:    700,
            color:         '#ff3b3b',
            lineHeight:    1,
            marginBottom:  8,
            textShadow:    '0 0 40px rgba(255,59,59,0.3)',
            letterSpacing: '-0.04em',
          }}>
            404
          </div>
          <div style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      11,
            letterSpacing: '0.2em',
            color:         '#ff3b3b',
            opacity:       0.6,
            textTransform: 'uppercase',
            marginBottom:  24,
          }}>
            Target Not Found
          </div>
          <h2 style={{
            fontSize:    22,
            fontWeight:  600,
            color:       '#e8eaf0',
            marginBottom: 10,
            letterSpacing: '-0.01em',
          }}>
            Signal Lost
          </h2>
          <p style={{
            color:       '#8892a4',
            fontSize:    14,
            maxWidth:    340,
            lineHeight:  1.6,
            marginBottom: 36,
          }}>
            This sector doesn't appear on any known map.
            The coordinates you requested are outside our intelligence coverage.
          </p>
          <Link to="/" style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            8,
            background:     'rgba(0,212,255,0.08)',
            border:         '1px solid rgba(0,212,255,0.25)',
            borderRadius:   6,
            padding:        '10px 22px',
            color:          '#00d4ff',
            textDecoration: 'none',
            fontFamily:     "'IBM Plex Mono', monospace",
            fontSize:       12,
            letterSpacing:  '0.1em',
            textTransform:  'uppercase',
            transition:     'background 160ms, border-color 160ms',
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,212,255,0.14)';
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.45)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)';
            }}
          >
            ← Return to Globe
          </Link>
        </div>
      </div>
    </div>
  );
}