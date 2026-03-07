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
    --bg:          #050508;
    --bg-panel:    rgba(15, 17, 23, 0.85);
    --border:      #1e2433;
    --accent:      #00d4ff;
    --danger:      #ff3b3b;
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

// Shape arcs returned by /api/conflicts/:iso3
function shapeArcs(conflicts) {
  return conflicts
    .filter(c => c.startLat != null && c.startLng != null && c.endLat != null && c.endLng != null)
    .map(c => {
      let sLat = parseFloat(c.startLat);
      let sLng = parseFloat(c.startLng);
      let eLat = parseFloat(c.endLat);
      let eLng = parseFloat(c.endLng);

      // Offset 0-distance arcs for internal historical conflicts
      if (sLat === eLat && sLng === eLng) {
        eLat += 0.5; 
        eLng += 0.5;
      }

      return {
        startLat:        sLat,
        startLng:        sLng,
        endLat:          eLat,
        endLng:          eLng,
        intensity_level: c.intensity_level ?? 1,
        conflict_name:   c.conflict_name ?? c.location ?? 'Unknown',
        is_active:       c.is_active ?? false,
        arc_type:        c.arc_type ?? 'state-vs-nonstate',
      };
    });
}

function shapeGlobalArcs(conflicts, countryMap) {
  const arcs = [];
  conflicts.forEach(c => {
    let sLat = parseFloat(c.latitude);
    let sLng = parseFloat(c.longitude);

    if (isNaN(sLat) || isNaN(sLng)) {
      const a1 = countryMap[c.actor1_iso3];
      if (a1 && a1.latitude != null) {
        sLat = parseFloat(a1.latitude);
        sLng = parseFloat(a1.longitude);
      } else {
        return; 
      }
    }

    let eLat = sLat;
    let eLng = sLng;
    let arcType = 'state-vs-nonstate';

    if (c.actor2_iso3 && c.actor2_iso3 !== c.actor1_iso3) {
      const a2 = countryMap[c.actor2_iso3];
      if (a2 && a2.latitude != null) {
        eLat = parseFloat(a2.latitude);
        eLng = parseFloat(a2.longitude);
        arcType = 'state-vs-state';
      }
    }

    if (sLat === eLat && sLng === eLng) {
      eLat += 0.5;
      eLng += 0.5;
    }

    arcs.push({
      startLat: sLat, startLng: sLng, endLat: eLat, endLng: eLng,
      intensity_level: c.intensity_level ?? 1,
      conflict_name: c.location || c.actor1 || 'Unknown Conflict',
      is_active: c.is_active ?? false,
      arc_type: arcType,
    });
  });
  return arcs;
}

async function fetchCountryLatLng(iso3) {
  const r = await fetch(`${API}/api/countries/${iso3}`);
  if (!r.ok) return null;
  const d = await r.json();
  return { lat: parseFloat(d.latitude), lng: parseFloat(d.longitude), name: d.name };
}

// ─── Ticker & Overlays ────────────────────────────────────────────────────────
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
    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, letterSpacing: '0.1em', color: visible ? 'var(--accent)' : 'transparent', transition: 'color 280ms ease', display: 'flex', alignItems: 'center', gap: 10, overflow: 'hidden', whiteSpace: 'nowrap', zIndex: 10 }}>
      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--danger)', boxShadow: '0 0 6px var(--danger)', flexShrink: 0, animation: 'overlay-pulse 2s infinite' }} />
      {TICKER_ITEMS[idx]}
    </div>
  );
}

function GlobeOverlay({ visible, isMobile }) {
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none', zIndex: 10, transition: 'opacity 600ms ease', opacity: visible ? 1 : 0 }}>
      <div style={{ background: 'rgba(5,5,8,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 8, padding: '14px 22px', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, animation: visible ? 'overlay-pulse 3s ease infinite' : 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
        <span style={{ fontSize: 28, lineHeight: 1 }}>🌍</span>
        <span style={{ color: 'var(--accent)', fontSize: isMobile ? 13 : 16, fontWeight: 600, letterSpacing: '0.02em' }}>
          {isMobile ? 'Tap any country' : 'Click any country to explore military data'}
        </span>
        <span style={{ color: 'var(--text-2)', fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {isMobile ? 'WARSCOPE INTEL' : '9 nuclear states · 171 countries · live arcs'}
        </span>
      </div>
    </div>
  );
}

function StatsStrip({ conflictCount, isActive, showGlobal }) {
  return (
    <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 24, background: 'rgba(5,5,8,0.72)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderTop: '1px solid rgba(0,212,255,0.15)', borderRadius: 6, padding: '8px 20px', pointerEvents: 'none', zIndex: 5, opacity: isActive ? 0 : 0.9, transition: 'opacity 400ms ease', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      {[
        { label: 'COUNTRIES',  value: '171', color: 'var(--accent)' },
        { label: 'CONFLICTS',  value: conflictCount > 0 ? String(conflictCount) : '—', color: 'var(--accent)' },
        { label: 'NUCLEAR',    value: '9', color: 'var(--accent)' },
        { label: 'STATUS',     value: showGlobal ? 'GLOBAL LIVE' : 'LOCAL SECURE', color: showGlobal ? 'var(--danger)' : 'var(--accent)' },
      ].map(({ label, value, color }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 17, fontWeight: 600, color: color, textShadow: `0 0 8px ${color === 'var(--danger)' ? 'rgba(255,59,59,0.5)' : 'rgba(0,212,255,0.3)'}` }}>
            {value}
          </div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-2)', marginTop: 2 }}>
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
  const [showPanel,       setShowPanel]       = useState(false);
  const [showOverlay,     setShowOverlay]     = useState(true);
  const [isMobile,        setIsMobile]        = useState(window.innerWidth <= 768);

  const [globalArcs,      setGlobalArcs]      = useState([]);
  const [countryArcs,     setCountryArcs]     = useState([]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Fetch strictly Global Live data
  const fetchGlobalLive = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/conflicts/live`);
      if (res.ok) {
        const data = await res.json();
        setGlobalArcs(data.arcs || []);
      } else {
        // Fallback to our DB active only if GDELT fails
        const [cRes, cfRes] = await Promise.all([
          fetch(`${API}/api/countries`),
          fetch(`${API}/api/conflicts?active=true&limit=500`)
        ]);
        const countries = await cRes.json();
        const conflicts = await cfRes.json();
        const countryMap = {};
        countries.forEach(c => { if (c.iso3) countryMap[c.iso3] = c; });
        setGlobalArcs(shapeGlobalArcs(conflicts, countryMap));
      }
    } catch (err) {
      console.error('[arcs] Global fetch failed:', err);
    }
  }, []);

  useEffect(() => {
    fetchGlobalLive();
    const interval = setInterval(fetchGlobalLive, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchGlobalLive]);

  // Fetch Country specific data (Active + Historical)
  useEffect(() => {
    if (!selectedCountry) {
      setCountryArcs([]);
      return;
    }
    const fetchCountry = async () => {
      try {
        const res = await fetch(`${API}/api/conflicts/${selectedCountry.iso3}`);
        const data = await res.json();
        setCountryArcs(shapeArcs(data));
      } catch (err) {
        console.error('[arcs] Country fetch failed:', err);
      }
    };
    fetchCountry();
  }, [selectedCountry]);

  // View Switcher: Show Country specific arcs (Active & Historical) when clicked, otherwise show Global Live
  const visibleArcs = selectedCountry ? countryArcs : globalArcs;

  const handleCountryClick = useCallback(async (iso3, iso2, name, lat, lng) => {
    if (!iso3 || iso3 === '-99') return;
    setSelectedCountry({ iso3, iso2, name, lat, lng });
    setShowPanel(true);
    setShowOverlay(false);
    setSearchParams({ countries: iso3 }, { replace: true });

    if (globeRef.current && lat != null && lng != null) {
      globeRef.current.pointOfView({ lat, lng, altitude: 2.2 }, 900);
    }
  }, [setSearchParams]);

  const handleClose = useCallback(() => {
    setShowPanel(false);
    setSelectedCountry(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: 'transparent', overflow: 'hidden' }}>

      <div style={{ zIndex: 10, position: 'relative' }}>
        <Navbar />
      </div>

      <div style={{ height: 32, background: 'rgba(5, 5, 8, 0.8)', backdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(0,212,255,0.15)', display: 'flex', alignItems: 'center', padding: '0 16px', justifyContent: 'space-between', flexShrink: 0, gap: 16, overflow: 'hidden', zIndex: 10, position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
        <Ticker />
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: 'var(--text-2)', letterSpacing: '0.08em', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {new Date().toUTCString().replace(/ GMT$/, ' UTC')}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden', position: 'relative', minHeight: 0, zIndex: 5 }}>
        <div style={{ flex: 1, position: 'relative', minWidth: 0, background: 'transparent' }}>
          
          <GlobeView
            ref={globeRef}
            onCountryClick={handleCountryClick}
            conflictArcs={visibleArcs}
            highlightCountries={selectedCountry ? [selectedCountry.iso3] : []}
            autoRotate={!showPanel}
          />

          <GlobeOverlay visible={showOverlay} isMobile={isMobile} />
          
          <StatsStrip 
            conflictCount={visibleArcs.length} 
            isActive={showPanel} 
            showGlobal={!selectedCountry}
          />

          {selectedCountry && (
            <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(0,212,255,0.4)', borderRadius: 6, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 10, animation: 'home-fade-in 250ms ease both', zIndex: 6, pointerEvents: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 10px rgba(0,212,255,0.1)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)' }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, fontWeight: 600, color: 'var(--text-1)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {selectedCountry.iso3} <span style={{ color: 'var(--text-2)', fontWeight: 400 }}>|</span> {selectedCountry.name}
              </span>
            </div>
          )}

          {visibleArcs.length > 0 && (
            <div style={{ position: 'absolute', top: 16, right: showPanel && !isMobile ? 396 : 16, background: 'rgba(255,59,59,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,59,59,0.4)', borderRadius: 6, padding: '8px 14px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, color: '#ff8080', letterSpacing: '0.1em', animation: 'home-fade-in 300ms ease both', transition: 'right 300ms ease', zIndex: 6, pointerEvents: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.4), 0 0 10px rgba(255,59,59,0.2)' }}>
              <span style={{ color: 'var(--danger)', marginRight: 6, animation: 'overlay-pulse 2s infinite' }}>⬤</span>
              {visibleArcs.filter(a => a.is_active).length} ACTIVE
              {selectedCountry && (
                <span style={{ color: 'var(--text-2)', fontSize: 11, marginLeft: 6, fontWeight: 400 }}>
                  / {visibleArcs.filter(a => !a.is_active).length} ARCHIVED
                </span>
              )}
            </div>
          )}
        </div>

        {showPanel && selectedCountry && (
          <div className={`home-panel-slide ${isMobile ? 'country-panel-mobile' : ''}`} style={isMobile ? {} : { width: 380, flexShrink: 0, position: 'relative', overflow: 'hidden', background: 'var(--bg-panel)', borderLeft: '1px solid rgba(0,212,255,0.15)', boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}>
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