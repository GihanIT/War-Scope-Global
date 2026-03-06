import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
  useMemo
} from 'react';
import Globe from 'react-globe.gl';

// ─── Constants ────────────────────────────────────────────────────────────────
const GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

const NUCLEAR_STATES = [
  { iso3: 'USA', lat: 37.09,  lng: -95.71 },
  { iso3: 'RUS', lat: 61.52,  lng: 105.32 },
  { iso3: 'CHN', lat: 35.86,  lng: 104.20 },
  { iso3: 'FRA', lat: 46.23,  lng:   2.21 },
  { iso3: 'GBR', lat: 55.38,  lng:  -3.44 },
  { iso3: 'PAK', lat: 30.38,  lng:  69.35 },
  { iso3: 'IND', lat: 20.59,  lng:  78.96 },
  { iso3: 'PRK', lat: 40.34,  lng: 127.51 },
  { iso3: 'ISR', lat: 31.05,  lng:  34.85 },
];

const NUCLEAR_PULSE = [0.45, 0.65];

// ─── Upgraded Tactical Color Palette ──────────────────────────────────────────
const C = {
  bg:          'rgba(0,0,0,0)', // Deeper space background
  fill:        'rgba(26,32,53,0.4)', // More translucent to let satellite map show
  stroke:      'rgba(0,212,255,0.2)', // Cyan tactical borders
  hover:       'rgba(0,212,255,0.3)',
  selected:    'rgba(0,212,255,0.5)',
  arcActive:   '#ff3b3b',
  arcOld:      'rgba(255,59,59,0.1)',
  nuclear:     '#ffaa00',
  atmosphere:  '#00d4ff', // Cyan atmosphere glow
};

// ─── GlobeView ────────────────────────────────────────────────────────────────
const GlobeView = forwardRef(function GlobeView(
  {
    onCountryClick,
    conflictArcs       = [],
    highlightCountries = [],
    autoRotate         = true,
  },
  ref
) {
  const globeEl       = useRef(null);
  const wrapRef       = useRef(null);
  const hoveredRef    = useRef(null);
  const selectedRef   = useRef(null);
  const rotatingRef   = useRef(autoRotate);
  const resumeTimer   = useRef(null);
  const rafRef        = useRef(null);
  const pulseTimer    = useRef(null);
  const pulseIdx      = useRef(0);

  const [countries, setCountries] = useState([]);
  const [size,      setSize]      = useState({ w: window.innerWidth, h: window.innerHeight });
  const [pulseR,    setPulseR]    = useState(NUCLEAR_PULSE[0]);

  useImperativeHandle(ref, () => ({
    pointOfView: (...args) => globeEl.current?.pointOfView(...args),
    getInstance: ()       => globeEl.current,
  }));

  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(r => r.json())
      .then(d => setCountries(d.features))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!wrapRef.current) return;
      const { offsetWidth: w, offsetHeight: h } = wrapRef.current;
      if (w > 0 && h > 0) setSize({ w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    rotatingRef.current = autoRotate;
    const tick = () => {
      if (rotatingRef.current && globeEl.current) {
        const pov = globeEl.current.pointOfView();
        globeEl.current.pointOfView({ ...pov, lng: pov.lng - 0.08 }); // Slightly slower, more cinematic spin
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoRotate]);

  useEffect(() => {
    pulseTimer.current = setInterval(() => {
      pulseIdx.current = (pulseIdx.current + 1) % 2;
      setPulseR(NUCLEAR_PULSE[pulseIdx.current]);
    }, 900);
    return () => clearInterval(pulseTimer.current);
  }, []);

  const stopRotation = useCallback(() => {
    rotatingRef.current = false;
    clearTimeout(resumeTimer.current);
    if (autoRotate) {
      resumeTimer.current = setTimeout(() => {
        rotatingRef.current = true;
      }, 4000);
    }
  }, [autoRotate]);

  const getColor = useCallback((feat) => {
    const iso3 = feat?.properties?.ISO_A3;
    if (iso3 && iso3 === selectedRef.current)  return C.selected;
    if (iso3 && iso3 === hoveredRef.current)   return C.hover;
    if (highlightCountries.includes(iso3))     return C.hover;
    return C.fill;
  }, [highlightCountries]);

  const handleHover = useCallback((feat) => {
    hoveredRef.current = feat?.properties?.ISO_A3 ?? null;
    if (wrapRef.current) {
      wrapRef.current.style.cursor = feat ? 'pointer' : 'default';
    }
  }, []);

  const handleClick = useCallback((feat) => {
    if (!feat) return;
    stopRotation();
    const { ISO_A3, ISO_A2, NAME, LABEL_X, LABEL_Y } = feat.properties;
    selectedRef.current = ISO_A3;
    onCountryClick?.(
      ISO_A3 ?? null,
      ISO_A2 ?? null,
      NAME   ?? null,
      LABEL_Y != null ? parseFloat(LABEL_Y) : null,
      LABEL_X != null ? parseFloat(LABEL_X) : null,
    );
  }, [onCountryClick, stopRotation]);

  // ── 1. Shooting Star Gradients ───────────────────────────────────────────────
  const arcColor = useCallback((arc) => {
    if (!arc.is_active) return C.arcOld;
    // Two elements create a directional gradient: [Start Color, End Color]
    return arc.arc_type === 'state-vs-state' 
      ? ['rgba(255,59,59,0.05)', '#ff3b3b'] 
      : ['rgba(255,170,0,0.05)', '#ffaa00'];
  }, []);

  const arcAlt     = useCallback((arc) =>  arc.is_active ? 0.35 : 0.15, []); // Higher arcs for visibility
  const arcStroke  = useCallback((arc) => {
    if (!arc.is_active) return 0.2;
    const base = (arc.intensity_level ?? 1) * 0.6 + 0.4;
    return arc.arc_type === 'state-vs-state' ? base + 0.5 : base; // Thicker lines
  }, []);
  
  // ── 2. Comet Dashes ──────────────────────────────────────────────────────────
  const arcDash    = useCallback((arc) =>  arc.is_active ? 0.4 : 0, []); // Longer trail
  const arcGap     = useCallback((arc) =>  arc.is_active ? 0.1 : 0, []); 
  const arcAnimate = useCallback((arc) => {
    if (!arc.is_active) return 0;
    return arc.arc_type === 'state-vs-state' ? 2000 : 3500;
  }, []);

  // ── 3. Radar Target Rings for Impact Zones ───────────────────────────────────
  // We extract the exact destinations of active conflicts to spawn rings
  const targetRings = useMemo(() => {
    return conflictArcs
      .filter(a => a.is_active && a.endLat != null && a.endLng != null)
      .map(a => ({
        lat: a.endLat,
        lng: a.endLng,
        color: a.arc_type === 'state-vs-state' ? '#ff3b3b' : '#ffaa00',
        maxR: a.arc_type === 'state-vs-state' ? 4 : 2, // Bigger rings for state vs state
        propSpeed: a.arc_type === 'state-vs-state' ? 2 : 1
      }));
  }, [conflictArcs]);

  const polyLabel = useCallback((feat) =>
    `<div style="font-family:monospace;font-size:12px;background:rgba(5,5,8,0.95);
     border:1px solid rgba(0,212,255,0.4);padding:6px 12px;border-radius:4px;
     color:#e8eaf0;letter-spacing:0.1em;pointer-events:none;box-shadow: 0 0 10px rgba(0,212,255,0.2)">
     ${feat.properties.NAME ?? feat.properties.ISO_A3 ?? ''}</div>`, []);

  const arcLabel = useCallback((arc) => {
    if (!arc.conflict_name) return '';
    const borderColor = arc.arc_type === 'state-vs-state'
      ? 'rgba(255,59,59,0.7)' : 'rgba(255,170,0,0.7)';
    const textColor = arc.arc_type === 'state-vs-state' ? '#ff8080' : '#ffcc80';
    return `<div style="font-family:monospace;font-size:11px;
      background:rgba(10,10,20,0.95);border:1px solid ${borderColor};
      padding:6px 10px;border-radius:4px;color:${textColor};letter-spacing:0.05em;
      max-width:200px;line-height:1.4;box-shadow: 0 0 10px ${borderColor}">
      <strong>${arc.conflict_name}</strong>
      ${arc.arc_type === 'state-vs-state' ? '<br><span style="opacity:0.7;font-size:10px">State vs State</span>' : ''}
    </div>`;
  }, []);

  const pointLabel = useCallback((d) =>
    `<div style="font-family:monospace;font-size:11px;background:rgba(10,10,20,0.95);
     border:1px solid rgba(255,170,0,0.6);padding:6px 10px;border-radius:4px;
     color:#ffaa00;letter-spacing:0.08em;box-shadow: 0 0 10px rgba(255,170,0,0.3)">
     ⚛ ${d.iso3} · Nuclear</div>`, []);

  const ready = countries.length > 0 && size.w > 0 && size.h > 0;

  return (
    <div
      ref={wrapRef}
      style={{ position: 'relative', width: '100%', height: '100%', background: C.bg, overflow: 'hidden' }}
      onMouseDown={stopRotation}
      onTouchStart={stopRotation}
      onWheel={stopRotation}
    >
      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 16, zIndex: 5, pointerEvents: 'none',
        }}>
          <div style={{
            width: 44, height: 44,
            border: '2px solid rgba(0,212,255,0.1)',
            borderTop: '2px solid #00d4ff',
            borderRadius: '50%',
            animation: 'globe-spin 0.9s linear infinite',
            boxShadow: '0 0 15px rgba(0,212,255,0.3)'
          }} />
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#00d4ff', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Initializing Intel
          </span>
          <style>{`@keyframes globe-spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {ready && (
        <Globe
          ref={globeEl}
          width={size.w}
          height={size.h}
          
          // ── Texture Base ──────────────────────────────────────────────
          backgroundColor={C.bg}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

          // ── Atmosphere ───────────────────────────────────────────────
          showAtmosphere
          atmosphereColor={C.atmosphere}
          atmosphereAltitude={0.18} // Thicker, more prominent glow
          
          showGraticules={false}
          
          // ── Country Overlays ─────────────────────────────────────────
          polygonsData={countries}
          polygonAltitude={0.006} // Floats just above the satellite texture
          polygonCapColor={getColor}
          polygonSideColor={() => 'rgba(0,0,0,0)'} // Hide sides to keep it flat & tactical
          polygonStrokeColor={() => C.stroke}
          polygonLabel={polyLabel}
          onPolygonHover={handleHover}
          onPolygonClick={handleClick}
          
          // ── Arcs ─────────────────────────────────────────────────────
          arcsData={conflictArcs}
          arcStartLat={d => d.startLat}
          arcStartLng={d => d.startLng}
          arcEndLat={d   => d.endLat}
          arcEndLng={d   => d.endLng}
          arcColor={arcColor}
          arcAltitude={arcAlt}
          arcStroke={arcStroke}
          arcDashLength={arcDash}
          arcDashGap={arcGap}
          arcDashInitialGap={() => Math.random()} // Randomize start times so they don't sync
          arcDashAnimateTime={arcAnimate}
          arcLabel={arcLabel}

          // ── Impact Rings ─────────────────────────────────────────────
          ringsData={targetRings}
          ringLat={d => d.lat}
          ringLng={d => d.lng}
          ringColor={d => d.color}
          ringMaxRadius={d => d.maxR}
          ringPropagationSpeed={d => d.propSpeed}
          ringRepeatPeriod={800} // Pulse fast

          // ── Nuclear Markers ──────────────────────────────────────────
          pointsData={NUCLEAR_STATES}
          pointLat={d    => d.lat}
          pointLng={d    => d.lng}
          pointColor={() => C.nuclear}
          pointAltitude={() => 0.01}
          pointRadius={() => pulseR}
          pointsMerge={false}
          pointLabel={pointLabel}
        />
      )}
    </div>
  );
});

export default GlobeView;