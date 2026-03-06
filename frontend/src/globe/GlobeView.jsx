import {
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';

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

// Pulsing amber: alternate between two radii for glow effect
const NUCLEAR_PULSE_RADII = [0.5, 0.65];

const COLORS = {
  background:      '#0a0a0f',
  countryFill:     '#1a2035',
  countryStroke:   '#2a3555',
  hoverFill:       'rgba(0,212,255,0.15)',
  selectedFill:    'rgba(0,212,255,0.30)',
  arcActive:       '#ff3b3b',
  arcHistorical:   '#ff3b3b44',
  nuclear:         '#ffaa00',
  nuclearGlow:     'rgba(255,170,0,0.35)',
  atmosphere:      'rgba(0,150,255,0.15)',
};

const ROTATE_SPEED   = 0.12;   // deg/frame
const RESUME_DELAY   = 3000;   // ms after last interaction

// ─── Component ────────────────────────────────────────────────────────────────

const GlobeView = forwardRef(function GlobeView(
  {
    onCountryClick,
    conflictArcs   = [],
    highlightCountries = [],
    autoRotate     = true,
  },
  ref
) {
  const mountRef      = useRef(null);
  const globeRef      = useRef(null);
  const hoveredRef    = useRef(null);
  const selectedRef   = useRef(null);
  const rotatingRef   = useRef(autoRotate);
  const resumeTimer   = useRef(null);
  const rafRef        = useRef(null);
  const pulseTimer    = useRef(null);
  const pulseIndexRef = useRef(0);

  // Expose globe instance to parent via ref
  useImperativeHandle(ref, () => ({
    pointOfView: (...args) => globeRef.current?.pointOfView(...args),
    getInstance: ()       => globeRef.current,
  }));

  // ── Country colour resolver ─────────────────────────────────────────────────
  const getCountryColor = useCallback((feature) => {
    const iso3 = feature?.properties?.ISO_A3;
    if (iso3 && iso3 === selectedRef.current)  return COLORS.selectedFill;
    if (iso3 && iso3 === hoveredRef.current)   return COLORS.hoverFill;
    if (highlightCountries.includes(iso3))     return COLORS.hoverFill;
    return COLORS.countryFill;
  }, [highlightCountries]);

  // ── Interaction helpers ─────────────────────────────────────────────────────
  const stopRotation = useCallback(() => {
    rotatingRef.current = false;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    if (autoRotate) {
      resumeTimer.current = setTimeout(() => {
        rotatingRef.current = true;
      }, RESUME_DELAY);
    }
  }, [autoRotate]);

  // ── Arc colour / style helpers ──────────────────────────────────────────────
  const arcColor = (arc) =>
    arc.is_active ? COLORS.arcActive : COLORS.arcHistorical;

  const arcAltitude = (arc) => (arc.is_active ? 0.3 : 0.2);

  const arcStroke = (arc) =>
    arc.is_active
      ? (arc.intensity_level ?? 1) * 0.5 + 0.5
      : 0.3;

  const arcDashLength = (arc) => (arc.is_active ? 0.02 : undefined);
  const arcGapLength  = (arc) => (arc.is_active ? 0.01 : undefined);

  // ── Main init ───────────────────────────────────────────────────────────────
  useEffect(() => {
    let destroyed = false;

    const init = async () => {
      // Dynamic import so Vite/webpack can split the heavy bundle
      const GlobeGL   = (await import('globe.gl')).default;
      const geoResp   = await fetch(GEOJSON_URL);
      const geoJSON   = await geoResp.json();

      if (destroyed || !mountRef.current) return;

      const el = mountRef.current;

      // ── Instantiate ───────────────────────────────────────────────────────
      const globe = GlobeGL()(el)
        // sizing
        .width(el.clientWidth)
        .height(el.clientHeight)

        // appearance
        .backgroundColor(COLORS.background)
        .showAtmosphere(true)
        .atmosphereColor(COLORS.atmosphere)
        .atmosphereAltitude(0.12)
        .showGraticules(false)

        // ── Polygons (countries) ────────────────────────────────────────────
        .polygonsData(geoJSON.features)
        .polygonAltitude(0.006)
        .polygonCapColor(getCountryColor)
        .polygonSideColor(() => 'rgba(30,45,80,0.6)')
        .polygonStrokeColor(() => COLORS.countryStroke)
        .polygonLabel((feat) => `
          <div style="
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            background: rgba(10,10,20,0.92);
            border: 1px solid rgba(0,212,255,0.3);
            padding: 6px 10px;
            border-radius: 3px;
            color: #cdd6f4;
            letter-spacing: 0.08em;
            pointer-events: none;
          ">
            ${feat.properties.NAME ?? feat.properties.ISO_A3 ?? ''}
          </div>
        `)
        .onPolygonHover((feat) => {
          hoveredRef.current = feat?.properties?.ISO_A3 ?? null;
          el.style.cursor    = feat ? 'pointer' : 'default';
          globe.polygonCapColor(getCountryColor);
        })
        .onPolygonClick((feat) => {
          if (!feat) return;
          stopRotation();
          const { ISO_A3, ISO_A2, NAME, LABEL_X, LABEL_Y } = feat.properties;
          selectedRef.current = ISO_A3;
          globe.polygonCapColor(getCountryColor);
          if (onCountryClick) {
            onCountryClick(
              ISO_A3 ?? null,
              ISO_A2 ?? null,
              NAME   ?? null,
              LABEL_Y != null ? parseFloat(LABEL_Y) : null,
              LABEL_X != null ? parseFloat(LABEL_X) : null
            );
          }
        })

        // ── Arcs (conflicts) ────────────────────────────────────────────────
        .arcsData(conflictArcs)
        .arcStartLat((d) => d.startLat)
        .arcStartLng((d) => d.startLng)
        .arcEndLat((d)   => d.endLat)
        .arcEndLng((d)   => d.endLng)
        .arcColor(arcColor)
        .arcAltitude(arcAltitude)
        .arcStroke(arcStroke)
        .arcDashLength(arcDashLength)
        .arcDashGap(arcGapLength)
        .arcDashAnimateTime((arc) => (arc.is_active ? 2000 : 0))
        .arcLabel((arc) => arc.conflict_name
          ? `<div style="
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              background: rgba(10,10,20,0.92);
              border: 1px solid rgba(255,59,59,0.4);
              padding: 5px 9px;
              border-radius: 3px;
              color: #ff8080;
              letter-spacing: 0.06em;
            ">${arc.conflict_name}</div>`
          : ''
        )

        // ── Nuclear markers ─────────────────────────────────────────────────
        .pointsData(NUCLEAR_STATES)
        .pointLat((d)    => d.lat)
        .pointLng((d)    => d.lng)
        .pointColor(()   => COLORS.nuclear)
        .pointAltitude(() => 0.01)
        .pointRadius(() => NUCLEAR_PULSE_RADII[0])
        .pointsMerge(false)
        .pointLabel((d)  => `
          <div style="
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            background: rgba(10,10,20,0.92);
            border: 1px solid rgba(255,170,0,0.5);
            padding: 5px 9px;
            border-radius: 3px;
            color: #ffaa00;
            letter-spacing: 0.06em;
          ">⚛ ${d.iso3} · Nuclear</div>
        `);

      globeRef.current = globe;

      // ── Stars ─────────────────────────────────────────────────────────────
      // globe.gl exposes the Three.js scene — add star particles directly
      try {
        const THREE = (await import('three')).default ?? (await import('three'));
        const scene = globe.scene();
        if (scene) {
          const starGeo = new THREE.BufferGeometry();
          const starCount = 6000;
          const positions = new Float32Array(starCount * 3);
          for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 2000;
          }
          starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          const starMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size:  0.7,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
          });
          scene.add(new THREE.Points(starGeo, starMat));
        }
      } catch (_) {
        // Stars are cosmetic — silently skip if THREE unavailable
      }

      // ── Nuclear pulse animation ───────────────────────────────────────────
      pulseTimer.current = setInterval(() => {
        pulseIndexRef.current = (pulseIndexRef.current + 1) % 2;
        const r = NUCLEAR_PULSE_RADII[pulseIndexRef.current];
        globe.pointRadius(() => r);
      }, 800);

      // ── Auto-rotate loop ──────────────────────────────────────────────────
      const tick = () => {
        if (rotatingRef.current && globeRef.current) {
          const pov = globe.pointOfView();
          globe.pointOfView({ ...pov, lng: pov.lng - ROTATE_SPEED });
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);

      // ── Interaction: stop rotation on mousedown / touchstart ─────────────
      el.addEventListener('mousedown',  stopRotation, { passive: true });
      el.addEventListener('touchstart', stopRotation, { passive: true });
      el.addEventListener('wheel',      stopRotation, { passive: true });
    };

    init().catch(console.error);

    // ── Resize handler ──────────────────────────────────────────────────────
    const onResize = () => {
      if (globeRef.current && mountRef.current) {
        globeRef.current
          .width(mountRef.current.clientWidth)
          .height(mountRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafRef.current);
      clearTimeout(resumeTimer.current);
      clearInterval(pulseTimer.current);
      window.removeEventListener('resize', onResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('mousedown',  stopRotation);
        mountRef.current.removeEventListener('touchstart', stopRotation);
        mountRef.current.removeEventListener('wheel',      stopRotation);
      }
      // globe.gl doesn't expose a .destroy() — clearing the DOM node is enough
      if (globeRef.current) {
        try { globeRef.current.pauseAnimation?.(); } catch (_) {}
        globeRef.current = null;
      }
    };
  }, []); // intentionally empty — globe is init-once

  // ── Sync: arcs ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.arcsData(conflictArcs);
  }, [conflictArcs]);

  // ── Sync: highlight countries ───────────────────────────────────────────────
  useEffect(() => {
    if (!globeRef.current) return;
    globeRef.current.polygonCapColor(getCountryColor);
  }, [highlightCountries, getCountryColor]);

  // ── Sync: autoRotate prop ───────────────────────────────────────────────────
  useEffect(() => {
    rotatingRef.current = autoRotate;
  }, [autoRotate]);

  return (
    <div
      ref={mountRef}
      style={{
        width:    '100%',
        height:   '100%',
        overflow: 'hidden',
        background: COLORS.background,
        // Subtle scan-line overlay for the military-intel aesthetic
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,212,255,0.012) 2px,
            rgba(0,212,255,0.012) 4px
          )
        `,
      }}
    />
  );
});

export default GlobeView;
