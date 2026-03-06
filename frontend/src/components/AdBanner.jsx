// src/components/AdBanner.jsx
import { useEffect, useRef } from 'react';

// ─── Size map ─────────────────────────────────────────────────────────────────
const SIZE_MAP = {
  '728x90':  { width: '728px', height: '90px'  },
  '300x250': { width: '300px', height: '250px' },
  '320x50':  { width: '100%',  height: '50px'  },
};

// ─── Feature flags ────────────────────────────────────────────────────────────
// VITE_SHOW_ADS=false  → ads completely hidden (no space taken)
// VITE_SHOW_ADS=true   → show placeholder in dev, real AdSense in production
const SHOW_ADS = import.meta.env.VITE_SHOW_ADS === 'true';
const IS_DEV   = import.meta.env.DEV === true;

// ─── Dev placeholder ──────────────────────────────────────────────────────────
function AdPlaceholder({ size, id, dimensions }) {
  return (
    <div
      id={id}
      style={{
        width:          dimensions.width,
        height:         dimensions.height,
        background:     '#0f1117',
        border:         '1px dashed #1e2433',
        borderRadius:   4,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
        position:       'relative',
        overflow:       'hidden',
      }}
    >
      <div style={{
        position:       'absolute',
        inset:          0,
        background:     'repeating-linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), repeating-linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        pointerEvents:  'none',
      }} />
      <span style={{
        fontFamily:    "'IBM Plex Mono', monospace",
        fontSize:      12,
        color:         '#8892a4',
        letterSpacing: '0.06em',
        position:      'relative',
        zIndex:        1,
      }}>
        Ad {size}
      </span>
    </div>
  );
}

// ─── Production AdSense unit ──────────────────────────────────────────────────
function AdSenseUnit({ id }) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current || !insRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.warn('[AdBanner] adsbygoogle.push() failed:', err);
    }
  }, []);

  return (
    <ins
      ref={insRef}
      id={id}
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-XXXXXXXXXX"
      data-ad-slot="XXXXXXXXXX"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}

// ─── AdBanner ─────────────────────────────────────────────────────────────────
export default function AdBanner({ id, size = '728x90', style: extraStyle = {} }) {
  // When ads are disabled, render nothing — no space, no border, no layout shift
  if (!SHOW_ADS) return null;

  const dimensions = SIZE_MAP[size] ?? SIZE_MAP['728x90'];

  return (
    <div style={{
      margin:   '16px auto',
      maxWidth: '100%',
      overflow: 'hidden',
      width:    dimensions.width,
      ...extraStyle,
    }}>
      {IS_DEV
        ? <AdPlaceholder id={id} size={size} dimensions={dimensions} />
        : <AdSenseUnit   id={id} />
      }
    </div>
  );
}