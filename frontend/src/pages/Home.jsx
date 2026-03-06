import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlobeView    from '../globe/GlobeView.jsx';
import CountryPanel from '../components/CountryPanel.jsx';
import Navbar       from '../components/Navbar.jsx';

// ─── CSS injected once ────────────────────────────────────────────────────────
const HOME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Barlow:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #0a0a0f;
    --bg-panel:    #0f1117;
    --border:      #1e2433;
    --accent:      #00d4ff;
    --accent-dim:  rgba(0,212,255,0.12);
    --danger:      #ff3b3b;
    --nuclear:     #ffaa00;
    --text-1:      #e8eaf0;
    --text-2:      #8892a4;
  }

  html, body, #root {
    height: 100%;
    background: var(--bg);
    color: var(--text-1);
    font-family: 'Barlow', system-ui, sans-serif;
  }

  @keyframes home-fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes overlay-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.18); }
    50%      { box-shadow: 0 0 0 8px rgba(0,212,255,0); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  .home-panel-slide {
    animation: home-fade-in 300ms ease both;
  }

  /* Mobile: panel slides up from bottom */
  @media (max-width: 768px) {
    .country-panel-mobile {
      position: fixed !important;
      bottom: 0 !important;
      right: 0 !important;
      left: 0 !important;
      top: auto !important;
      width: 100vw !important;
      height: 55vh !important;
      border-left: none !important;
      border-top: 1px solid var(--border) !important;
      animation: mobile-slide-up 300ms ease forwards !important;
    }
    @keyframes mobile-slide-up {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

function shapeArcs(conflicts) {
  return conflicts
    .filter(c => c.startLat != null && c.startLng != null
              && c.endLat   != null && c.endLng   != null)
    .map(c => ({
      startLat:      parseFloat(c.startLat),
      startLng:      parseFloat(c.startLng),
      endLat:        parseFloat(c.endLat),
      endLng:        parseFloat(c.endLng),
      intensity_level: c.intensity_level ?? 1,
      conflict_name: c.conflict_name ?? c.location ?? 'Unknown',
      is_active:     c.is_active ?? false,
    }));
}

async function fetchConflictsForCountry(iso3) {
  const r = await fetch(`${API}/api/conflicts/${iso3}`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function fetchCountryLatLng(iso3) {
  const r = await fetch(`${API}/api/countries/${iso3}`);
  if (!r.ok) return null;
  const d = await r.json();
  return { lat: parseFloat(d.latitude), lng: parseFloat(d.longitude), name: d.name };
}

// ─── Live conflict ticker ─────────────────────────────────────────────────────
const TICKER_ITEMS = [
  'MONITOR ACTIVE · Ukraine conflict zone · INT-2',
  'ALERT · Sudan RSF offensive ongoing · INT-2',
  'TRACKING · Myanmar resistance operations · INT-1',
  'NUCLEAR STATUS · 9 states armed · EST. 12,849 warheads',
  'WARSCOPE · Real-time conflict intelligence',
];

function Ticker() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % TICKER_ITEMS.length);
        setVisible(true);
      }, 300);
    }, 4000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div style={{
      fontFamily:    "'IBM Plex Mono', monospace",
      fontSize:      10,
      letterSpacing: '0.14em',
      color:         visible ? 'var(--accent)' : 'transparent',
      transition:    'color 280ms ease',
      display:       'flex',
      alignItems:    'center',
      gap:           10,
      overflow:      'hidden',
      whiteSpace:    'nowrap',
    }}>
      <span style={{
        display:      'inline-block',
        width:          6,
        height:         6,
        borderRadius: '50%',
        background:   'var(--danger)',
        boxShadow:    '0 0 6px var(--danger)',
        flexShrink:   0,
        animation:    'overlay-pulse 2s infinite',
      }} />
      {TICKER_ITEMS[idx]}
    </div>
  );
}

// ─── Top ad banner ────────────────────────────────────────────────────────────
function AdBanner() {
  return (
    <div
      id="ad-top-banner"
      style={{
        height:         '90px',
        background:     '#0f1117',
        borderBottom:   '1px solid #1e2433',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        color:          '#8892a4',
        fontSize:       '12px',
        flexShrink:     0,
        fontFamily:     "'IBM Plex Mono', monospace",
        letterSpacing:  '0.06em',
        position:       'relative',
        overflow:       'hidden',
      }}
    >
      {/* scanline effect on ad container */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,212,255,0.015) 3px, rgba(0,212,255,0.015) 4px)',
        pointerEvents: 'none',
      }} />
      Ad 728×90
    </div>
  );
}

// ─── Globe hint overlay ───────────────────────────────────────────────────────
function GlobeOverlay({ visible, isMobile }) {
  return (
    <div style={{
      position:      'absolute',
      top:           '50%',
      left:          '50%',
      transform:     'translate(-50%, -50%)',
      textAlign:     'center',
      pointerEvents: 'none',
      zIndex:        10,
      transition:    'opacity 600ms ease',
      opacity:       visible ? 1 : 0,
    }}>
      <div style={{
        background:    'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)',
        border:        '1px solid rgba(0,212,255,0.2)',
        borderRadius:  8,
        padding:       '14px 22px',
        display:       'inline-flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           8,
        animation:     visible ? 'overlay-pulse 3s ease infinite' : 'none',
      }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>🌍</span>
        <span style={{
          color:         'var(--accent)',
          fontSize:      isMobile ? 13 : 16,
          fontWeight:    600,
          letterSpacing: '0.02em',
        }}>
          {isMobile ? 'Tap any country' : 'Click any country to explore military data'}
        </span>
        <span style={{
          color:         'var(--text-2)',
          fontSize:      10,
          fontFamily:    "'IBM Plex Mono', monospace",
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          {isMobile ? 'WARSCOPE INTEL' : '9 nuclear states · 171 countries · live arcs'}
        </span>
      </div>
    </div>
  );
}

// ─── Stats strip ─────────────────────────────────────────────────────────────
function StatsStrip({ conflictCount, isActive }) {
  return (
    <div style={{
      position:       'absolute',
      bottom:         12,
      left:           '50%',
      transform:      'translateX(-50%)',
      display:        'flex',
      gap:            24,
      background:     'rgba(10,12,20,0.72)',
      backdropFilter: 'blur(8px)',
      border:         '1px solid var(--border)',
      borderRadius:   6,
      padding:        '8px 20px',
      pointerEvents:  'none',
      zIndex:         5,
      opacity:        isActive ? 0 : 0.85,
      transition:     'opacity 400ms ease',
    }}>
      {[
        { label: 'COUNTRIES',  value: '171' },
        { label: 'CONFLICTS',  value: conflictCount > 0 ? String(conflictCount) : '—' },
        { label: 'NUCLEAR',    value: '9' },
        { label: 'STATUS',     value: 'LIVE' },
      ].map(({ label, value }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      14,
            fontWeight:    600,
            color:         label === 'STATUS' ? 'var(--danger)' : 'var(--accent)',
          }}>
            {value}
          </div>
          <div style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      8,
            letterSpacing: '0.14em',
            color:         'var(--text-2)',
            marginTop:     2,
          }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  injectCSS('home-styles', HOME_CSS);

  const globeRef             = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [conflictArcs,    setConflictArcs]    = useState([]);
  const [showPanel,       setShowPanel]       = useState(false);
  const [showOverlay,     setShowOverlay]     = useState(true);
  const [totalConflicts,  setTotalConflicts]  = useState(0);
  const [isMobile,        setIsMobile]        = useState(window.innerWidth <= 768);

  // ── Responsive detection ──────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Fetch total conflict count for stats strip ────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/conflicts?active=true&limit=1000`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setTotalConflicts(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, []);

  // ── Country click handler ─────────────────────────────────────────────────
  const handleCountryClick = useCallback(async (iso3, iso2, name, lat, lng) => {
    if (!iso3 || iso3 === '-99') return;

    setSelectedCountry({ iso3, iso2, name, lat, lng });
    setShowPanel(true);
    setShowOverlay(false);

    // Update URL param
    setSearchParams({ countries: iso3 }, { replace: true });

    // Fly camera to country
    if (globeRef.current && lat != null && lng != null) {
      globeRef.current.pointOfView({ lat, lng, altitude: 2.2 }, 900);
    }

    // Fetch arcs for this country
    try {
      const data = await fetchConflictsForCountry(iso3);
      setConflictArcs(shapeArcs(Array.isArray(data) ? data : []));
    } catch (_) {
      setConflictArcs([]);
    }
  }, [setSearchParams]);

  // ── Handle close ──────────────────────────────────────────────────────────
  const handleClose = useCallback(() => {
    setShowPanel(false);
    setSelectedCountry(null);
    setConflictArcs([]);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // ── URL param: ?countries=CHN,RUS ────────────────────────────────────────
  useEffect(() => {
    const param = searchParams.get('countries');
    if (!param) return;

    const iso3List = param
      .split(',')
      .map(s => s.trim().toUpperCase())
      .filter(Boolean);

    if (!iso3List.length) return;

    const primary = iso3List[0];

    // Fetch primary country and auto-open panel
    fetchCountryLatLng(primary).then(geo => {
      if (!geo) return;
      handleCountryClick(primary, null, geo.name, geo.lat, geo.lng);
    }).catch(() => {});

    // If 2+ countries: draw a manual arc between them
    if (iso3List.length >= 2) {
      Promise.all(iso3List.map(fetchCountryLatLng))
        .then(geos => {
          const valid = geos.filter(Boolean);
          if (valid.length < 2) return;
          const manualArcs = [];
          for (let i = 0; i < valid.length - 1; i++) {
            manualArcs.push({
              startLat:      valid[i].lat,
              startLng:      valid[i].lng,
              endLat:        valid[i + 1].lat,
              endLng:        valid[i + 1].lng,
              intensity_level: 2,
              conflict_name: `${iso3List[i]} ↔ ${iso3List[i + 1]}`,
              is_active:     true,
            });
          }
          setConflictArcs(prev => [...manualArcs, ...prev]);
        })
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  // ── Layout math ──────────────────────────────────────────────────────────
  // The main content area fills whatever's left after navbar + ad
  // We use dvh-safe heights via calc() with CSS.
  const mainStyle = {
    flex:      1,
    display:   'flex',
    flexDirection: 'row',
    overflow:  'hidden',
    position:  'relative',
    minHeight: 0,
  };

  const globeWrapStyle = {
    flex:     1,
    position: 'relative',
    minWidth: 0,
    background: '#0a0a0f',
  };

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100dvh',
      background:    '#0a0a0f',
      overflow:      'hidden',
    }}>

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Top AdSense banner ───────────────────────────────────────── */}
      <AdBanner />

      {/* ── Ticker bar ───────────────────────────────────────────────── */}
      <div style={{
        height:        32,
        background:    '#0a0c14',
        borderBottom:  '1px solid var(--border)',
        display:       'flex',
        alignItems:    'center',
        padding:       '0 16px',
        justifyContent:'space-between',
        flexShrink:    0,
        gap:           16,
        overflow:      'hidden',
      }}>
        <Ticker />
        <div style={{
          fontFamily:    "'IBM Plex Mono', monospace",
          fontSize:      9,
          color:         'var(--text-2)',
          letterSpacing: '0.1em',
          whiteSpace:    'nowrap',
          flexShrink:    0,
        }}>
          {new Date().toUTCString().replace(/ GMT$/, ' UTC')}
        </div>
      </div>

      {/* ── Main content row ─────────────────────────────────────────── */}
      <div style={mainStyle}>

        {/* Globe wrapper */}
        <div style={globeWrapStyle}>
          <GlobeView
            ref={globeRef}
            onCountryClick={handleCountryClick}
            conflictArcs={conflictArcs}
            highlightCountries={selectedCountry ? [selectedCountry.iso3] : []}
            autoRotate={!showPanel}
          />

          {/* Globe hint overlay */}
          <GlobeOverlay visible={showOverlay} isMobile={isMobile} />

          {/* Bottom stats strip */}
          <StatsStrip conflictCount={totalConflicts} isActive={showPanel} />

          {/* Selected country label badge */}
          {selectedCountry && (
            <div style={{
              position:    'absolute',
              top:         12,
              left:        12,
              background:  'rgba(10,12,20,0.82)',
              backdropFilter: 'blur(6px)',
              border:      '1px solid rgba(0,212,255,0.3)',
              borderRadius: 5,
              padding:     '6px 12px',
              display:     'flex',
              alignItems:  'center',
              gap:         8,
              animation:   'home-fade-in 250ms ease both',
              zIndex:      6,
              pointerEvents: 'none',
            }}>
              <div style={{
                width:        6,
                height:       6,
                borderRadius: '50%',
                background:   'var(--accent)',
                boxShadow:    '0 0 8px var(--accent)',
              }} />
              <span style={{
                fontFamily:    "'IBM Plex Mono', monospace",
                fontSize:      11,
                color:         'var(--accent)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                {selectedCountry.iso3} · {selectedCountry.name}
              </span>
            </div>
          )}

          {/* Arc count badge when arcs are showing */}
          {conflictArcs.length > 0 && (
            <div style={{
              position:    'absolute',
              top:         12,
              right:       showPanel && !isMobile ? 396 : 12,
              background:  'rgba(255,59,59,0.12)',
              border:      '1px solid rgba(255,59,59,0.3)',
              borderRadius: 5,
              padding:     '5px 10px',
              fontFamily:  "'IBM Plex Mono', monospace",
              fontSize:    10,
              color:       'var(--danger)',
              letterSpacing: '0.1em',
              animation:   'home-fade-in 300ms ease both',
              transition:  'right 300ms ease',
              zIndex:      6,
              pointerEvents: 'none',
            }}>
              ⬤ {conflictArcs.filter(a => a.is_active).length} ACTIVE ARCS
            </div>
          )}
        </div>

        {/* Country Panel — desktop sidebar, mobile bottom sheet */}
        {showPanel && selectedCountry && (
          <div
            className={`home-panel-slide ${isMobile ? 'country-panel-mobile' : ''}`}
            style={isMobile ? {} : {
              width:      380,
              flexShrink: 0,
              position:   'relative',
              overflow:   'hidden',
            }}
          >
            <CountryPanel
              iso3={selectedCountry.iso3}
              iso2={selectedCountry.iso2}
              countryName={selectedCountry.name}
              onClose={handleClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
