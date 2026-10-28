// src/components/AdBanner.jsx
import { useEffect, useRef } from 'react';

// ─── Adsterra placement config ────────────────────────────────────────────────
const ADSTERRA_PLACEMENTS = {
  '728x90':  { key: '7bbe508a1ba0d1eb3d4b62190674990f', width: 728,  height: 90,  domain: 'highperformanceformat.com' },
  '300x250': { key: 'c71539c82a41428c78495be944cc2763', width: 300,  height: 250, domain: 'highperformanceformat.com' },
  '320x50':  { key: 'a8ef5df2df7fc00a6e6c25911e677a18', width: 320,  height: 50,  domain: 'highperformanceformat.com' },
  '160x600': { key: 'e6b68663e611a43d963707ee464948e0', width: 160,  height: 600, domain: 'highperformanceformat.com' },
  '160x300': { key: '3d08551d72acb1ec60684be533924953', width: 160,  height: 300, domain: 'highperformanceformat.com' },
  '468x60':  { key: '461bc67086c9a9a5ba51cac966890d58', width: 468,  height: 60,  domain: 'highperformanceformat.com' },
  'native':  { key: '3b2721d167fee0d41cf64de932d20123', width: null, height: null, domain: 'effectivegatecpm.com', scriptId: 'pl28934550' },
};

// ─── Size map ─────────────────────────────────────────────────────────────────
const SIZE_MAP = {
  '728x90':  { width: '728px', height: '90px'  },
  '300x250': { width: '300px', height: '250px' },
  '320x50':  { width: '100%',  height: '50px'  },
  '160x600': { width: '160px', height: '600px' },
  '160x300': { width: '160px', height: '300px' },
  '468x60':  { width: '468px', height: '60px'  },
  'native':  { width: '100%',  height: 'auto'  },
};

// ─── Feature flags ────────────────────────────────────────────────────────────
const SHOW_ADS = import.meta.env.VITE_SHOW_ADS === 'true';
const IS_DEV   = import.meta.env.DEV === true;

// ─── Dev placeholder ──────────────────────────────────────────────────────────
function AdPlaceholder({ size, id, dimensions }) {
  return (
    <div
      id={id}
      style={{
        width:          dimensions.width,
        height:         dimensions.height === 'auto' ? '120px' : dimensions.height,
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

// ─── Adsterra Banner — isolated iframe approach ───────────────────────────────
function AdsterraBanner({ size, uid }) {
  const iframeRef = useRef(null);
  const placement = ADSTERRA_PLACEMENTS[size];

  useEffect(() => {
    if (!iframeRef.current || !placement?.key) return;

    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; }
    body { overflow: hidden; background: transparent; }
  </style>
</head>
<body>
  <script>
    atOptions = {
      'key':    '${placement.key}',
      'format': 'iframe',
      'height': ${placement.height},
      'width':  ${placement.width},
      'params': {}
    };
  <\/script>
  <script src="https://www.${placement.domain}/${placement.key}/invoke.js"><\/script>
</body>
</html>`;

    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(html);
      doc.close();
    }
  }, [size, uid]);

  return (
    <iframe
      ref={iframeRef}
      scrolling="no"
      frameBorder="0"
      style={{
        width:      placement?.width  ? `${placement.width}px`  : '100%',
        height:     placement?.height ? `${placement.height}px` : '60px',
        border:     'none',
        display:    'block',
        background: 'transparent',
      }}
      title={`ad-${size}`}
    />
  );
}

// ─── Adsterra Native Banner ───────────────────────────────────────────────────
function AdsterraNative({ uid }) {
  const containerRef = useRef(null);
  const loaded = useRef(false);
  const placement = ADSTERRA_PLACEMENTS['native'];

  useEffect(() => {
    if (loaded.current || !containerRef.current || !placement?.key) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = `https://${placement.scriptId}.${placement.domain}/${placement.key}/invoke.js`;

    const container = document.createElement('div');
    container.id = `container-${placement.key}-${uid}`;

    containerRef.current.appendChild(script);
    containerRef.current.appendChild(container);

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
      loaded.current = false;
    };
  }, [uid]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', minHeight: '90px', background: 'transparent' }}
    />
  );
}

// ─── AdBanner ─────────────────────────────────────────────────────────────────
export default function AdBanner({ id, size = '728x90', style: extraStyle = {} }) {
  if (!SHOW_ADS) return null;

  const dimensions = SIZE_MAP[size] ?? SIZE_MAP['728x90'];

  const renderAd = () => {
    if (IS_DEV) {
      return <AdPlaceholder id={id} size={size} dimensions={dimensions} />;
    }
    if (size === 'native') return <AdsterraNative uid={id} />;
    return <AdsterraBanner size={size} uid={id} />;
  };

  return (
    <div style={{
      margin:   '16px auto',
      maxWidth: '100%',
      overflow: 'hidden',
      width:    dimensions.width,
      ...extraStyle,
    }}>
      {renderAd()}
    </div>
  );
}