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

// ─── Upgraded Tactical Color Palette ──────────────────────────────────────────
const C = {
  bg:          'rgba(0,0,0,0)',       // Deeper space background
  fill:        'rgba(26,32,53,0.4)',  // Translucent to let satellite map show
  stroke:      'rgba(0,212,255,0.2)', // Cyan tactical borders
  hover:       'rgba(0,212,255,0.4)', // Brighter cyan for hover via WebGL
  selected:    'rgba(0,212,255,0.5)',
  arcActive:   '#ff3b3b',
  arcOld:      'rgba(255,59,59,0.1)',
  nuclear:     '#ffaa00',
  atmosphere:  '#00d4ff',             // Cyan atmosphere glow
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
  const globeEl     = useRef(null);
  const wrapRef     = useRef(null);
  const selectedRef = useRef(null);
  const resumeTimer = useRef(null);

  const [countries, setCountries] = useState([]);
  const [size,      setSize]      = useState({ w: window.innerWidth, h: window.innerHeight });

  useImperativeHandle(ref, () => ({
    pointOfView: (...args) => globeEl.current?.pointOfView(...args),
    getInstance: ()       => globeEl.current,
  }));

  // Fetch GeoJSON map data
  useEffect(() => {
    fetch(GEOJSON_URL)
      .then(r => r.json())
      .then(d => setCountries(d.features))
      .catch(console.error);
  }, []);

  // Handle responsive resizing
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

  // ── OPTIMIZATION 1: Native WebGL Auto-Rotation ──
  useEffect(() => {
    if (globeEl.current) {
      const controls = globeEl.current.controls();
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 0.6; // Smooth, cinematic speed natively on the GPU
    }
  }, [autoRotate]);

  const stopRotation = useCallback(() => {
    if (!globeEl.current) return;
    const controls = globeEl.current.controls();
    controls.autoRotate = false;
    
    clearTimeout(resumeTimer.current);
    if (autoRotate) {
      resumeTimer.current = setTimeout(() => {
        controls.autoRotate = true;
      }, 4000);
    }
  }, [autoRotate]);

  // ── OPTIMIZATION 2: Removed hover tracking from React State ──
  const getCapColor = useCallback((feat) => {
    const iso3 = feat?.properties?.ISO_A3;
    if (iso3 && iso3 === selectedRef.current)  return C.selected;
    if (highlightCountries.includes(iso3))     return C.selected;
    return C.fill;
  }, [highlightCountries]);

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
    return arc.arc_type === 'state-vs-state' 
      ? ['rgba(255,59,59,0.05)', '#ff3b3b'] 
      : ['rgba(255,170,0,0.05)', '#ffaa00'];
  }, []);

  const arcAlt     = useCallback((arc) =>  arc.is_active ? 0.35 : 0.15, []); 
  const arcStroke  = useCallback((arc) => {
    if (!arc.is_active) return 0.2;
    const base = (arc.intensity_level ?? 1) * 0.6 + 0.4;
    return arc.arc_type === 'state-vs-state' ? base + 0.5 : base; 
  }, []);
  
  // ── 2. Comet Dashes ──────────────────────────────────────────────────────────
  const arcDash    = useCallback((arc) =>  arc.is_active ? 0.4 : 0, []); 
  const arcGap     = useCallback((arc) =>  arc.is_active ? 0.1 : 0, []); 
  const arcAnimate = useCallback((arc) => {
    if (!arc.is_active) return 0; // Kills CPU animation logic for massive historical datasets
    return arc.arc_type === 'state-vs-state' ? 2000 : 3500;
  }, []);

  // ── 3. Radar Target Rings for Impact Zones ───────────────────────────────────
  const targetRings = useMemo(() => {
    return conflictArcs
      .filter(a => a.is_active && a.endLat != null && a.endLng != null)
      .map(a => ({
        lat: a.endLat,
        lng: a.endLng,
        color: a.arc_type === 'state-vs-state' ? '#ff3b3b' : '#ffaa00',
        maxR: a.arc_type === 'state-vs-state' ? 4 : 2, 
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
          atmosphereAltitude={0.18} 
          
          showGraticules={false}
          
          // ── Country Overlays ─────────────────────────────────────────
          polygonsData={countries}
          polygonAltitude={0.006} 
          polygonCapColor={getCapColor}
          polygonSideColor={() => 'rgba(0,0,0,0)'} 
          polygonStrokeColor={() => C.stroke}
          polygonHoverColor={() => C.hover} // WebGL native hover state (Zero CPU lag)
          polygonLabel={polyLabel}
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
          arcDashInitialGap={() => Math.random()} 
          arcDashAnimateTime={arcAnimate}
          arcsTransitionDuration={0} // Instantly load large historical datasets without calculating transition morphs
          arcLabel={arcLabel}

          // ── Impact Rings ─────────────────────────────────────────────
          ringsData={targetRings}
          ringLat={d => d.lat}
          ringLng={d => d.lng}
          ringColor={d => d.color}
          ringMaxRadius={d => d.maxR}
          ringPropagationSpeed={d => d.propSpeed}
          ringRepeatPeriod={800} 

          // ── Nuclear Markers ──────────────────────────────────────────
          // Replaced CPU interval logic with a static tactical radius
          pointsData={NUCLEAR_STATES}
          pointLat={d    => d.lat}
          pointLng={d    => d.lng}
          pointColor={() => C.nuclear}
          pointAltitude={() => 0.01}
          pointRadius={() => 0.55} 
          pointsMerge={false}
          pointLabel={pointLabel}
        />
      )}
    </div>
  );
});

export default GlobeView;