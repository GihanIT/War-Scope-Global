import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import GlobeView    from '../globe/GlobeView.jsx';
import CountryPanel from '../components/CountryPanel.jsx';
import Navbar       from '../components/Navbar.jsx';
import AdBanner     from '../components/AdBanner.jsx';
import AlliancePanel from '../components/AlliancePanel.jsx';
import { ALLIANCES } from '../data/alliance-data.js';

// ─── CSS injected once ────────────────────────────────────────────────────────
const HOME_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Barlow:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:          #050508;
    --bg-panel:    rgba(15, 17, 23, 0.85);
    --border:      #1e2433;
    --accent:      #00d4ff;
    --accent-dim:  rgba(0,212,255,0.12);
    --danger:      #ff3b3b;
    --nuclear:     #ffaa00;
    --text-1:      #e8eaf0;
    --text-2:      #8892a4;
    --grid-color:  rgba(0, 212, 255, 0.04);
  }

  html, body, #root {
    min-height: 100vh;
    background-color: var(--bg);
    color: var(--text-1);
    font-family: 'Barlow', system-ui, sans-serif;
    font-size: 16px;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(var(--grid-color) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
    z-index: 0;
    pointer-events: none;
  }

  body::after {
    content: "";
    position: fixed;
    inset: 0;
    background: radial-gradient(circle at center, transparent 30%, rgba(5,5,8,0.85) 100%);
    z-index: 1;
    pointer-events: none;
  }

  #root::after {
    content: "";
    position: fixed;
    inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0, 212, 255, 0.02) 51%, transparent 51%);
    background-size: 100% 6px;
    z-index: 2;
    pointer-events: none;
    animation: scanline-scroll 10s linear infinite;
  }

  @keyframes scanline-scroll {
    0%   { background-position: 0 0; }
    100% { background-position: 0 100vh; }
  }

  .cp-skeleton { border-radius: 4px; }

  [style*="font-family: monospace"],
  [style*="fontFamily: monospace"],
  [style*="IBM Plex Mono"] {
    font-size: max(var(--mono-size, 13px), 13px);
  }

  :root {
    --fs-xs:   12px;
    --fs-sm:   14px;
    --fs-md:   15px;
    --fs-lg:   17px;
    --fs-xl:   20px;
  }

  @keyframes home-fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes overlay-pulse {
    0%,100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.18); }
    50%      { box-shadow: 0 0 0 8px rgba(0,212,255,0); }
  }

  .home-panel-slide {
    animation: home-fade-in 300ms ease both;
    backdrop-filter: blur(12px);
  }

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

// Shape arcs returned by /api/conflicts/:iso3 (already has startLat/endLat)
function shapeArcs(conflicts) {
  return conflicts
    .filter(c => c.startLat != null && c.startLng != null
              && c.endLat   != null && c.endLng   != null)
    .map(c => ({
      startLat:        parseFloat(c.startLat),
      startLng:        parseFloat(c.startLng),
      endLat:          parseFloat(c.endLat),
      endLng:          parseFloat(c.endLng),
      intensity_level: c.intensity_level ?? 1,
      conflict_name:   c.conflict_name ?? c.location ?? 'Unknown',
      is_active:       c.is_active ?? false,
      arc_type:        c.arc_type ?? 'state-vs-nonstate',
    }));
}

// Shape flat DB conflict rows into arcs using countryMap for coordinates
function shapeGlobalArcs(conflicts, countryMap) {
  const arcs = [];

  conflicts.forEach(c => {
    if (!c.actor1_iso3) return;
    const a1 = countryMap[c.actor1_iso3];
    if (!a1) return;

    const startLat = parseFloat(a1.latitude);
    const startLng = parseFloat(a1.longitude);
    if (isNaN(startLat) || isNaN(startLng)) return;

    let endLat, endLng, arcType;

    if (c.actor2_iso3 && c.actor2_iso3 !== c.actor1_iso3) {
      const a2 = countryMap[c.actor2_iso3];
      if (!a2) return;
      endLat  = parseFloat(a2.latitude);
      endLng  = parseFloat(a2.longitude);
      arcType = 'state-vs-state';
    } else if (c.latitude != null && c.longitude != null) {
      endLat  = parseFloat(c.latitude);
      endLng  = parseFloat(c.longitude);
      arcType = 'state-vs-nonstate';
    } else {
      return;
    }

    if (isNaN(endLat) || isNaN(endLng)) return;

    arcs.push({
      startLat,
      startLng,
      endLat,
      endLng,
      intensity_level: c.intensity_level ?? 1,
      conflict_name:   c.location ?? 'Unknown',
      is_active:       c.is_active ?? false,
      arc_type:        arcType,
    });
  });

  return arcs;
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
      fontSize:      13,
      letterSpacing: '0.1em',
      color:         visible ? 'var(--accent)' : 'transparent',
      transition:    'color 280ms ease',
      display:       'flex',
      alignItems:    'center',
      gap:           10,
      overflow:      'hidden',
      whiteSpace:    'nowrap',
      zIndex:        10,
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
        background:    'rgba(5,5,8,0.6)',
        backdropFilter: 'blur(8px)',
        border:        '1px solid rgba(0,212,255,0.2)',
        borderRadius:  8,
        padding:       '14px 22px',
        display:       'inline-flex',
        flexDirection: 'column',
        alignItems:    'center',
        gap:           8,
        animation:     visible ? 'overlay-pulse 3s ease infinite' : 'none',
        boxShadow:     '0 4px 24px rgba(0,0,0,0.5)',
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
          fontSize:      12,
          fontFamily:    "'IBM Plex Mono', monospace",
          letterSpacing: '0.1em',
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
      background:     'rgba(5,5,8,0.72)',
      backdropFilter: 'blur(12px)',
      border:         '1px solid var(--border)',
      borderTop:      '1px solid rgba(0,212,255,0.15)',
      borderRadius:   6,
      padding:        '8px 20px',
      pointerEvents:  'none',
      zIndex:         5,
      opacity:        isActive ? 0 : 0.9,
      transition:     'opacity 400ms ease',
      boxShadow:      '0 8px 32px rgba(0,0,0,0.5)',
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
            fontSize:      17,
            fontWeight:    600,
            color:         label === 'STATUS' ? 'var(--danger)' : 'var(--accent)',
            textShadow:    `0 0 8px ${label === 'STATUS' ? 'rgba(255,59,59,0.5)' : 'rgba(0,212,255,0.3)'}`,
          }}>
            {value}
          </div>
          <div style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      11,
            letterSpacing: '0.1em',
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

  const globeRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [conflictArcs,    setConflictArcs]    = useState([]);
  const [showPanel,       setShowPanel]       = useState(false);
  const [showOverlay,     setShowOverlay]     = useState(true);
  const [totalConflicts,  setTotalConflicts]  = useState(0);
  const [isMobile,        setIsMobile]        = useState(window.innerWidth <= 768);
  const [allianceOpen,    setAllianceOpen]    = useState(false);
  const [activeAlliance,  setActiveAlliance]  = useState(null);

  // Keep global arcs ref so panel-close can restore world view
  const globalArcsRef = useRef([]);

  // ── Responsive ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Load live arcs on mount, refresh every 15 min ──────────────────────────
  useEffect(() => {
    const load = async () => {
      // ── 1. Try GDELT live feed ────────────────────────────────────────────
      try {
        const liveRes = await fetch(`${API}/api/conflicts/live`);
        if (liveRes.ok) {
          const data = await liveRes.json();
          const arcs = Array.isArray(data.arcs) ? data.arcs : [];
          console.log(`[arcs] GDELT live: ${arcs.length} arcs`);
          globalArcsRef.current = arcs;
          setConflictArcs(arcs);
          setTotalConflicts(arcs.length);
          return; // success — skip fallback
        }
      } catch (err) {
        console.warn('[arcs] GDELT live failed, trying DB fallback:', err.message);
      }

      // ── 2. Fallback: shape arcs from our own DB ───────────────────────────
      try {
        const [cRes, cfRes] = await Promise.all([
          fetch(`${API}/api/countries`),
          fetch(`${API}/api/conflicts?active=true&limit=1000`),
        ]);
        if (!cRes.ok || !cfRes.ok) throw new Error('DB fetch failed');

        const [countries, conflicts] = await Promise.all([
          cRes.json(),
          cfRes.json(),
        ]);

        const countryMap = {};
        (Array.isArray(countries) ? countries : []).forEach(c => {
          if (c.iso3) countryMap[c.iso3] = c;
        });

        const all  = Array.isArray(conflicts) ? conflicts : [];
        const arcs = shapeGlobalArcs(all, countryMap);
        console.log(`[arcs] DB fallback: ${arcs.length} arcs from ${all.length} conflicts`);

        globalArcsRef.current = arcs;
        setConflictArcs(arcs);
        setTotalConflicts(all.length);
      } catch (err) {
        console.error('[arcs] all sources failed:', err);
      }
    };

    load();

    // Refresh every 15 minutes — GDELT updates on same cadence
    const interval = setInterval(load, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ── Country click ───────────────────────────────────────────────────────────
  const handleCountryClick = useCallback(async (iso3, iso2, name, lat, lng) => {
    if (!iso3 || iso3 === '-99') return;

    setSelectedCountry({ iso3, iso2, name, lat, lng });
    setShowPanel(true);
    setShowOverlay(false);
    setSearchParams({ countries: iso3 }, { replace: true });

    if (globeRef.current && lat != null && lng != null) {
      globeRef.current.pointOfView({ lat, lng, altitude: 2.2 }, 900);
    }

    // Show country-specific arcs while panel is open
    try {
      const data = await fetchConflictsForCountry(iso3);
      const arcs = shapeArcs(Array.isArray(data) ? data : []);
      // If country has no specific arcs, keep showing global arcs
      setConflictArcs(arcs.length > 0 ? arcs : globalArcsRef.current);
    } catch (_) {
      setConflictArcs(globalArcsRef.current);
    }
  }, [setSearchParams]);

  // ── Close panel — restore global arcs ──────────────────────────────────────
  const handleClose = useCallback(() => {
    setShowPanel(false);
    setSelectedCountry(null);
    setConflictArcs(globalArcsRef.current);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  // ── URL params: ?countries=USA or ?countries=USA,RUS ───────────────────────
  useEffect(() => {
    const param = searchParams.get('countries');
    if (!param) return;

    const iso3List = param.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
    if (!iso3List.length) return;

    const primary = iso3List[0];
    fetchCountryLatLng(primary).then(geo => {
      if (!geo) return;
      handleCountryClick(primary, null, geo.name, geo.lat, geo.lng);
    }).catch(() => {});

    if (iso3List.length >= 2) {
      Promise.all(iso3List.map(fetchCountryLatLng))
        .then(geos => {
          const valid = geos.filter(Boolean);
          if (valid.length < 2) return;
          const manualArcs = [];
          for (let i = 0; i < valid.length - 1; i++) {
            manualArcs.push({
              startLat:        valid[i].lat,
              startLng:        valid[i].lng,
              endLat:          valid[i + 1].lat,
              endLng:          valid[i + 1].lng,
              intensity_level: 2,
              conflict_name:   `${iso3List[i]} ↔ ${iso3List[i + 1]}`,
              is_active:       true,
              arc_type:        'state-vs-state',
            });
          }
          setConflictArcs(prev => [...manualArcs, ...prev]);
        })
        .catch(() => {});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mainStyle = {
    flex:          1,
    display:       'flex',
    flexDirection: 'row',
    overflow:      'hidden',
    position:      'relative',
    minHeight:     0,
    zIndex:        5,
  };

  const globeWrapStyle = {
    flex:       1,
    position:   'relative',
    minWidth:   0,
    background: 'transparent',
  };

  // Alliance layer data
  const allianceData    = activeAlliance ? ALLIANCES.find(a => a.id === activeAlliance) : null;
  const allianceMembers = allianceData?.members ?? [];
  const allianceColor   = allianceData?.color   ?? null;
  const handleAllianceToggle = (id) => setActiveAlliance(prev => prev === id ? null : id);

  return (
    <div style={{
      display:       'flex',
      flexDirection: 'column',
      height:        '100dvh',
      background:    'transparent',
      overflow:      'hidden',
    }}>

      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <div style={{ zIndex: 10, position: 'relative' }}>
        <Navbar />
      </div>

      {/* ── Ticker bar ───────────────────────────────────────────────── */}
      <div style={{
        height:         32,
        background:     'rgba(5, 5, 8, 0.8)',
        backdropFilter: 'blur(8px)',
        borderBottom:   '1px solid rgba(0,212,255,0.15)',
        display:        'flex',
        alignItems:     'center',
        padding:        '0 16px',
        justifyContent: 'space-between',
        flexShrink:     0,
        gap:            16,
        overflow:       'hidden',
        zIndex:         10,
        position:       'relative',
        boxShadow:      '0 4px 12px rgba(0,0,0,0.3)',
      }}>
        <Ticker />
        <div style={{
          fontFamily:    "'IBM Plex Mono', monospace",
          fontSize:      12,
          color:         'var(--text-2)',
          letterSpacing: '0.08em',
          whiteSpace:    'nowrap',
          flexShrink:    0,
        }}>
          {new Date().toUTCString().replace(/ GMT$/, ' UTC')}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div style={mainStyle}>

        <div style={globeWrapStyle}>
          <GlobeView
            ref={globeRef}
            onCountryClick={handleCountryClick}
            conflictArcs={conflictArcs}
            highlightCountries={selectedCountry ? [selectedCountry.iso3] : []}
            autoRotate={!showPanel}
            allianceMembers={allianceMembers}
            allianceColor={allianceColor}
          />

          <GlobeOverlay visible={showOverlay} isMobile={isMobile} />

          {/* ── Alliance toggle button ──────────────────────────────── */}
          <button
            onClick={() => setAllianceOpen(o => !o)}
            style={{
              position: 'absolute', bottom: isMobile ? 80 : 60, left: 16, zIndex: 20,
              background: allianceOpen ? 'rgba(0,212,255,0.15)' : 'rgba(5,5,8,0.82)',
              backdropFilter: 'blur(12px)',
              border: `1px solid ${allianceOpen ? 'rgba(0,212,255,0.5)' : 'rgba(0,212,255,0.2)'}`,
              borderRadius: 8, padding: '8px 14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'IBM Plex Mono, monospace', fontSize: 11,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: allianceOpen ? '#00d4ff' : '#8892a4',
              transition: 'all 200ms',
              boxShadow: allianceOpen ? '0 0 12px rgba(0,212,255,0.2)' : 'none',
            }}
          >
            <span>🤝</span>
            ALLIANCES
            {activeAlliance && (
              <span style={{
                background: allianceColor, borderRadius: 3,
                width: 8, height: 8, display: 'inline-block',
                boxShadow: `0 0 6px ${allianceColor}`,
              }} />
            )}
          </button>

          {/* ── Alliance panel ──────────────────────────────────────── */}
          {allianceOpen && (
            <AlliancePanel
              activeAllianceId={activeAlliance}
              onToggle={handleAllianceToggle}
              onClose={() => setAllianceOpen(false)}
            />
          )}

          <StatsStrip conflictCount={totalConflicts} isActive={showPanel} />

          {/* Selected country badge */}
          {selectedCountry && (
            <div style={{
              position:       'absolute',
              top:            16,
              left:           16,
              background:     'rgba(5,5,8,0.85)',
              backdropFilter: 'blur(12px)',
              border:         '1px solid rgba(0,212,255,0.4)',
              borderRadius:   6,
              padding:        '8px 14px',
              display:        'flex',
              alignItems:     'center',
              gap:            10,
              animation:      'home-fade-in 250ms ease both',
              zIndex:         6,
              pointerEvents:  'none',
              boxShadow:      '0 4px 16px rgba(0,0,0,0.4), 0 0 10px rgba(0,212,255,0.1)',
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)',
              }} />
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 14,
                fontWeight: 600, color: 'var(--text-1)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {selectedCountry.iso3}{' '}
                <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>|</span>{' '}
                {selectedCountry.name}
              </span>
            </div>
          )}

          {/* Active arcs badge */}
          {conflictArcs.length > 0 && (
            <div style={{
              position:       'absolute',
              top:            16,
              right:          showPanel && !isMobile ? 396 : 16,
              background:     'rgba(255,59,59,0.15)',
              backdropFilter: 'blur(8px)',
              border:         '1px solid rgba(255,59,59,0.4)',
              borderRadius:   6,
              padding:        '8px 14px',
              fontFamily:     "'IBM Plex Mono', monospace",
              fontSize:       13,
              fontWeight:     600,
              color:          '#ff8080',
              letterSpacing:  '0.1em',
              animation:      'home-fade-in 300ms ease both',
              transition:     'right 300ms ease',
              zIndex:         6,
              pointerEvents:  'none',
              boxShadow:      '0 4px 16px rgba(0,0,0,0.4), 0 0 10px rgba(255,59,59,0.2)',
            }}>
              <span style={{ color: 'var(--danger)', marginRight: 6, animation: 'overlay-pulse 2s infinite' }}>⬤</span>
              {conflictArcs.filter(a => a.is_active).length} ACTIVE
              <span style={{ color: 'var(--text-2)', fontSize: 11, marginLeft: 6, fontWeight: 400 }}>
                / {conflictArcs.filter(a => !a.is_active).length} QUIET
              </span>
            </div>
          )}
        </div>

        {/* Country Panel */}
        {showPanel && selectedCountry && (
          <div
            className={`home-panel-slide ${isMobile ? 'country-panel-mobile' : ''}`}
            style={isMobile ? {} : {
              width:      380,
              flexShrink: 0,
              position:   'relative',
              overflow:   'hidden',
              background: 'var(--bg-panel)',
              borderLeft: '1px solid rgba(0,212,255,0.15)',
              boxShadow:  '-10px 0 30px rgba(0,0,0,0.5)',
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