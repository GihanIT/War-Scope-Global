import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Navbar   from '../components/Navbar.jsx';
import AdBanner from '../components/AdBanner.jsx';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Battle: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>,
  Explosion: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  Protest: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Civilian: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Strategic: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>,
  Location: () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  ExternalLink: () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
  Refresh: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
};

// ─── SVG Strings for Leaflet HTML Popups ──────────────────────────────────────
const SVG_STRINGS = {
  battle: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
  explosion: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  protest: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  civilian: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  strategic: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>`
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap');

:root {
  --if-bg:     #050508;
  --if-panel:  rgba(10, 12, 20, 0.85);
  --if-border: rgba(0, 212, 255, 0.15);
  --if-accent: #00d4ff;
  --if-text:   #e8eaf0;
  --if-muted:  #8892a4;
  --if-dim:    #4a5568;
}

.if-page { 
  display: flex; 
  flex-direction: column; 
  height: 100dvh; 
  background: var(--if-bg); 
  color: var(--if-text); 
  font-family: 'Barlow', sans-serif; 
  overflow: hidden; 
  position: relative;
}

/* Tactical Grid Background */
.if-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center center;
  z-index: 0;
  pointer-events: none;
}

.if-topbar {
  display: flex; align-items: center; gap: 16px; padding: 12px 24px;
  background: rgba(5, 5, 8, 0.95); border-bottom: 1px solid var(--if-border);
  flex-shrink: 0; flex-wrap: wrap; z-index: 20; position: relative;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  backdrop-filter: blur(12px);
}
.if-title {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
  font-size: 22px; letter-spacing: 0.05em; color: var(--if-text);
  white-space: nowrap; text-transform: uppercase;
}
.if-title span { color: var(--if-accent); text-shadow: 0 0 10px rgba(0,212,255,0.4); }
.if-live-dot {
  width: 8px; height: 8px; border-radius: 50%; background: #ff3b3b;
  box-shadow: 0 0 10px #ff3b3b; flex-shrink: 0;
  animation: if-pulse 2s infinite;
}
@keyframes if-pulse { 0%,100%{opacity:1;transform:scale(1);box-shadow:0 0 10px #ff3b3b;}50%{opacity:0.4;transform:scale(0.85);box-shadow:0 0 2px #ff3b3b;} }

.if-status {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
  color: var(--if-muted); letter-spacing: 0.1em; white-space: nowrap;
}
.if-refresh-btn {
  display: flex; align-items: center; gap: 6px;
  background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3);
  border-radius: 4px; padding: 6px 14px; cursor: pointer;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: 0.1em; color: var(--if-accent); text-transform: uppercase;
  transition: all 200ms ease; white-space: nowrap; margin-left: auto;
}
.if-refresh-btn:hover:not(:disabled) { background: rgba(0,212,255,0.2); box-shadow: 0 0 12px rgba(0,212,255,0.2); }
.if-refresh-btn:disabled { opacity: 0.5; cursor: not-allowed; border-color: var(--if-dim); color: var(--if-dim); }

/* type filter pills */
.if-filters { 
  display: flex; gap: 8px; flex-wrap: wrap; align-items: center; 
  padding: 12px 24px; background: rgba(10, 12, 20, 0.7); 
  border-bottom: 1px solid var(--if-border); flex-shrink: 0; z-index: 10; 
  backdrop-filter: blur(8px);
}
.if-filter-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px; border-radius: 4px; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
  color: var(--if-muted); letter-spacing: 0.08em; transition: all 200ms ease; white-space: nowrap; text-transform: uppercase;
}
.if-filter-pill:hover { border-color: rgba(255,255,255,0.2); color: var(--if-text); background: rgba(255,255,255,0.08); }
.if-filter-pill.active { color: #fff; box-shadow: 0 0 15px rgba(var(--rgb), 0.2); }
.if-filter-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

/* main split */
.if-body { display: flex; flex: 1; min-height: 0; overflow: hidden; position: relative; z-index: 1; }

/* ── Map ── */
.if-map-wrap { flex: 1; position: relative; min-width: 0; }
#if-leaflet-map { width: 100%; height: 100%; background: #050508; }

/* ── Sidebar ── */
.if-sidebar {
  width: 380px; flex-shrink: 0; display: flex; flex-direction: column;
  background: var(--if-panel); border-left: 1px solid var(--if-border);
  overflow: hidden; backdrop-filter: blur(16px);
  box-shadow: -8px 0 32px rgba(0,0,0,0.5);
}
.if-sidebar-head {
  padding: 16px 24px; border-bottom: 1px solid var(--if-border); flex-shrink: 0;
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(0, 212, 255, 0.03);
}
.if-sidebar-title {
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--if-accent); text-transform: uppercase;
  display: flex; align-items: center; gap: 8px;
}
.if-sidebar-count {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  color: var(--if-text); background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 4px;
}
.if-feed { flex: 1; overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.2) transparent; }
.if-feed::-webkit-scrollbar { width: 4px; }
.if-feed::-webkit-scrollbar-thumb { background: rgba(0, 212, 255, 0.2); border-radius: 2px; }

.if-incident-card {
  padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05);
  cursor: pointer; transition: all 200ms ease; display: flex; gap: 14px; align-items: flex-start;
  position: relative;
}
.if-incident-card:hover { background: rgba(255,255,255,0.03); }
.if-incident-card.selected { background: rgba(0,212,255,0.08); border-left: 3px solid var(--if-accent); padding-left: 21px; }
.if-incident-card.selected::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 212, 255, 0.05) 51%, transparent 51%);
  background-size: 100% 4px; pointer-events: none;
}
.if-inc-icon { flex-shrink: 0; margin-top: 2px; opacity: 0.9; }
.if-inc-body { flex: 1; min-width: 0; position: relative; z-index: 2; }
.if-inc-title {
  font-size: 15px; color: var(--if-text); line-height: 1.5;
  margin-bottom: 8px; font-weight: 500;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.if-inc-meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px; }
.if-inc-country {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
  color: var(--if-muted); white-space: nowrap; display: flex; align-items: center; gap: 4px;
}
.if-inc-badge {
  font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 600;
  padding: 3px 8px; border-radius: 3px; letter-spacing: 0.1em;
  border: 1px solid; text-transform: uppercase; white-space: nowrap;
}
.if-inc-date {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px;
  color: var(--if-dim); white-space: nowrap; margin-left: auto;
}
.if-inc-source {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px;
  color: var(--if-dim); display: flex; align-items: center; gap: 6px;
  transition: color 200ms ease;
}
.if-inc-source:hover { color: var(--if-accent); }

/* ── Popup ── */
.if-popup {
  font-family: 'Barlow', sans-serif !important;
  background: rgba(5, 7, 12, 0.95) !important;
  border: 1px solid rgba(0,212,255,0.4) !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(0,212,255,0.1) !important;
  color: #e8eaf0 !important;
  min-width: 260px !important;
  max-width: 320px !important;
  backdrop-filter: blur(8px) !important;
}
.if-popup .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; border: none !important; padding: 0 !important; }
.if-popup .leaflet-popup-tip-container { display: none !important; }
.if-popup .leaflet-popup-content { margin: 0 !important; }

/* ── Stats bar ── */
.if-stats {
  display: flex; gap: 0; border-top: 1px solid var(--if-border);
  background: rgba(0, 0, 0, 0.4); flex-shrink: 0;
}
.if-stat { flex: 1; padding: 16px 8px; text-align: center; border-right: 1px solid rgba(255,255,255,0.05); }
.if-stat:last-child { border-right: none; }
.if-stat-val { font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600; text-shadow: 0 0 10px currentColor; }
.if-stat-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--if-muted); text-transform: uppercase; margin-top: 4px; }

/* ── Loading ── */
.if-loading {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px; z-index: 100;
  background: rgba(5, 5, 8, 0.85); backdrop-filter: blur(8px);
}
.if-spinner { 
  width: 44px; height: 44px; 
  border: 2px solid rgba(0,212,255,0.1); border-top: 2px solid #00d4ff; 
  border-radius: 50%; animation: if-spin 0.9s linear infinite; 
  box-shadow: 0 0 15px rgba(0,212,255,0.4); 
}
@keyframes if-spin { to { transform: rotate(360deg); } }
.if-loading-text { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: #00d4ff; letter-spacing: 0.2em; text-transform: uppercase; }

/* ── No data ── */
.if-no-data { padding: 60px 20px; text-align: center; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--if-muted); letter-spacing: 0.15em; line-height: 2; text-transform: uppercase; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .if-body { flex-direction: column; }
  .if-sidebar { width: 100%; height: 400px; border-left: none; border-top: 1px solid var(--if-border); }
  .if-map-wrap { flex: 1; min-height: 300px; }
  .if-title { font-size: 18px; }
}
`;

// ─── Incident type config ─────────────────────────────────────────────────────
const TYPES = {
  battle:    { label:'Battle',     color:'#ff3b3b', Icon: Icons.Battle    },
  explosion: { label:'Explosion',  color:'#ffaa00', Icon: Icons.Explosion },
  protest:   { label:'Protest',    color:'#00d4ff', Icon: Icons.Protest   },
  civilian:  { label:'Civilians',  color:'#c084fc', Icon: Icons.Civilian  },
  strategic: { label:'Strategic',  color:'#00ff88', Icon: Icons.Strategic },
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r}, ${g}, ${b}`;
}

function formatDate(str) {
  if (!str) return '';
  try {
    const s = str.length === 15 ? str.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3') : str;
    return new Date(s).toLocaleDateString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }).toUpperCase();
  } catch { return str.slice(0,10); }
}

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

// ─── Leaflet loader (dynamic import to avoid SSR issues) ─────────────────────
let L = null;
let leafletCSS = false;

async function loadLeaflet() {
  if (L) return L;
  if (!leafletCSS) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    leafletCSS = true;
  }
  await new Promise((res, rej) => {
    if (window.L) { L = window.L; return res(); }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => { L = window.L; res(); };
    script.onerror = rej;
    document.head.appendChild(script);
  });
  return L;
}

// ─── Map component ────────────────────────────────────────────────────────────
function IncidentMap({ incidents, selected, onSelect, typeFilters }) {
  const mapRef      = useRef(null);
  const leafletMap  = useRef(null);
  const markersRef  = useRef([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadLeaflet().then((Lf) => {
      if (!mounted || !mapRef.current || leafletMap.current) return;

      const map = Lf.map(mapRef.current, {
        center:      [20, 15],
        zoom:        2,
        minZoom:     2,
        maxZoom:     10,
        zoomControl: false,
      });

      Lf.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(map);

      Lf.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMap.current = map;
      setReady(true);
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!ready || !leafletMap.current || !L) return;
    const map = leafletMap.current;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    // CRITICAL BUG FIX: Filter out items with missing or invalid coordinates!
    const visible = incidents.filter(inc => {
      const hasType = typeFilters.size === 0 || typeFilters.has(inc.type);
      const hasCoords = inc.lat != null && inc.lng != null && !isNaN(inc.lat) && !isNaN(inc.lng);
      return hasType && hasCoords;
    });

    visible.forEach(inc => {
      const cfg  = TYPES[inc.type] ?? TYPES.battle;
      const isSelected = selected?.id === inc.id;
      const radius = inc.intensity === 3 ? 8 : inc.intensity === 2 ? 6 : 4;
      const opacity = isSelected ? 1 : 0.8;

      const marker = L.circleMarker([inc.lat, inc.lng], {
        radius:      isSelected ? radius + 3 : radius,
        fillColor:   cfg.color,
        color:       isSelected ? '#fff' : cfg.color,
        weight:      isSelected ? 2 : 1,
        opacity:     opacity,
        fillOpacity: isSelected ? 0.9 : 0.5,
      });

      const popupHTML = `
        <div style="padding:16px; font-family: 'Barlow', sans-serif;">
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">
            <span style="color:${cfg.color}; display: flex; align-items: center;">${SVG_STRINGS[inc.type] || SVG_STRINGS.battle}</span>
            <span style="font-family: 'IBM Plex Mono', monospace; font-size:11px; font-weight:600; color:${cfg.color}; letter-spacing:0.1em; text-transform:uppercase;">${cfg.label}</span>
          </div>
          <div style="font-size:14px; color:#e8eaf0; line-height:1.5; margin-bottom:12px; font-weight:500;">${inc.title}</div>
          <div style="font-family: 'IBM Plex Mono', monospace; font-size:10px; color:#8892a4; margin-bottom:6px; display: flex; align-items: center; gap: 4px;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${inc.country.toUpperCase()}${inc.region ? ' | ' + inc.region.toUpperCase() : ''}
          </div>
          ${inc.date ? `<div style="font-family: 'IBM Plex Mono', monospace; font-size:10px; color:#4a5568; margin-bottom:12px;">LOG: ${formatDate(inc.date)}</div>` : ''}
          ${inc.url 
            ? `<a href="${inc.url}" target="_blank" rel="noopener" style="font-family: 'IBM Plex Mono', monospace; font-size:10px; color:#00d4ff; text-decoration:none; letter-spacing:0.08em; display: flex; align-items: center; gap: 4px; background: rgba(0,212,255,0.1); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(0,212,255,0.2);">SOURCE LINK <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></a>` 
            : `<span style="font-family: 'IBM Plex Mono', monospace; font-size:10px; color:#4a5568;">SRC: ${inc.source.toUpperCase()}</span>`}
        </div>`;

      marker.bindPopup(popupHTML, { className:'if-popup', maxWidth:320 });
      marker.on('click', () => onSelect(inc));
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [incidents, selected, typeFilters, ready, onSelect]);

  useEffect(() => {
    if (!ready || !leafletMap.current || !selected) return;
    if (selected.lat == null || selected.lng == null) return;
    
    leafletMap.current.setView([selected.lat, selected.lng], Math.max(leafletMap.current.getZoom(), 5), { animate: true });
    
    const marker = markersRef.current.find((_, i) => {
      const visible = incidents.filter(inc => {
        const hasType = typeFilters.size === 0 || typeFilters.has(inc.type);
        const hasCoords = inc.lat != null && inc.lng != null && !isNaN(inc.lat) && !isNaN(inc.lng);
        return hasType && hasCoords;
      });
      return visible[i]?.id === selected.id;
    });
    
    if (marker) marker.openPopup();
  }, [selected, ready, incidents, typeFilters]);

  return (
    <div className="if-map-wrap" style={{ position:'relative' }}>
      <div id="if-leaflet-map" ref={mapRef} style={{ width:'100%', height:'100%' }} />
      {!ready && (
        <div className="if-loading">
          <div className="if-spinner" />
          <div className="if-loading-text">INITIALIZING GLOBAL GRID</div>
        </div>
      )}
    </div>
  );
}

// ─── Incident card in sidebar ─────────────────────────────────────────────────
function IncidentCard({ inc, selected, onSelect }) {
  const cfg = TYPES[inc.type] ?? TYPES.battle;
  const TypeIcon = cfg.Icon;
  
  return (
    <div
      className={`if-incident-card ${selected?.id === inc.id ? 'selected' : ''}`}
      onClick={() => onSelect(inc)}
    >
      <div className="if-inc-icon" style={{ color: cfg.color }}><TypeIcon /></div>
      <div className="if-inc-body">
        <div className="if-inc-title">{inc.title}</div>
        <div className="if-inc-meta">
          <span className="if-inc-country"><Icons.Location /> {inc.country.toUpperCase()}</span>
          <span
            className="if-inc-badge"
            style={{ color:cfg.color, borderColor:`${cfg.color}44`, background:`${cfg.color}12` }}
          >
            {cfg.label}
          </span>
          {inc.intensity === 3 && (
            <span className="if-inc-badge" style={{ color:'#ff3b3b', borderColor:'rgba(255,59,59,0.4)', background:'rgba(255,59,59,0.1)' }}>HIGH IMPACT</span>
          )}
          <span className="if-inc-date">{formatDate(inc.date)}</span>
        </div>
        {inc.url
          ? <a href={inc.url} target="_blank" rel="noopener" className="if-inc-source" style={{ color:'#00d4ff', textDecoration:'none' }} onClick={e => e.stopPropagation()}><Icons.ExternalLink /> {inc.source.toUpperCase()}</a>
          : <div className="if-inc-source">SRC: {inc.source.toUpperCase()}</div>
        }
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function IncidentFeed() {
  injectCSS('incident-css', CSS);

  const [incidents,   setIncidents]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [updatedAt,   setUpdatedAt]   = useState(null);
  const [selected,    setSelected]    = useState(null);
  const [typeFilters, setTypeFilters] = useState(new Set());
  const [refreshing,  setRefreshing]  = useState(false);

  const fetchIncidents = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const r = await fetch(`${API}/api/incidents/live`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setIncidents(Array.isArray(data.incidents) ? data.incidents : []);
      setUpdatedAt(data.updatedAt ?? null);
    } catch (err) {
      setError(err.message);
      setIncidents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
    const iv = setInterval(() => fetchIncidents(true), 15 * 60 * 1000);
    return () => clearInterval(iv);
  }, [fetchIncidents]);

  const toggleFilter = (type) => {
    setTypeFilters(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const visibleIncidents = useMemo(() =>
    incidents.filter(inc => typeFilters.size === 0 || typeFilters.has(inc.type)),
    [incidents, typeFilters]
  );

  const stats = useMemo(() => {
    const s = { total:0, battle:0, explosion:0, protest:0, civilian:0, strategic:0 };
    incidents.forEach(i => { s.total++; if (s[i.type] !== undefined) s[i.type]++; });
    return s;
  }, [incidents]);

  return (
    <div className="if-page">
      <Navbar />

      {/* ── Top control bar ───────────────────────────────────────────────── */}
      <div className="if-topbar">
        <div className="if-live-dot" />
        <div className="if-title">LIVE INCIDENT <span>FEED</span></div>
        <div className="if-status">
          {updatedAt
            ? `SYS_SYNC: ${formatDate(updatedAt)}`
            : loading ? 'ESTABLISHING LINK...' : 'DATA: GDELT | T-MINUS 15M'
          }
        </div>
        <button
          className="if-refresh-btn"
          disabled={refreshing || loading}
          onClick={() => fetchIncidents(true)}
        >
          <Icons.Refresh /> {refreshing ? 'REFRESHING SECURE FEED...' : 'FORCE REFRESH'}
        </button>
      </div>

      {/* ── Type filter pills ─────────────────────────────────────────────── */}
      <div className="if-filters">
        <span style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:11, fontWeight:600, color:'var(--if-dim)', letterSpacing:'0.15em', textTransform:'uppercase', marginRight:12 }}>PARAMETERS:</span>
        {Object.entries(TYPES).map(([type, cfg]) => {
          const isActive = typeFilters.has(type);
          const count    = stats[type] ?? 0;
          const TypeIcon = cfg.Icon;
          return (
            <button
              key={type}
              className={`if-filter-pill ${isActive ? 'active' : ''}`}
              style={isActive ? { '--rgb': hexToRgb(cfg.color), borderColor:`${cfg.color}66`, background:`${cfg.color}22`, color:cfg.color } : {}}
              onClick={() => toggleFilter(type)}
            >
              <div className="if-filter-dot" style={{ background:cfg.color, opacity: isActive ? 1 : 0.4, boxShadow: isActive ? `0 0 8px ${cfg.color}` : 'none' }} />
              <span style={{ opacity: isActive ? 1 : 0.6, display: 'flex' }}><TypeIcon /></span> {cfg.label}
              <span style={{ opacity:0.6, marginLeft:4, fontWeight: 400 }}>[{count}]</span>
            </button>
          );
        })}
        {typeFilters.size > 0 && (
          <button
            className="if-filter-pill"
            onClick={() => setTypeFilters(new Set())}
            style={{ borderColor:'rgba(255,59,59,0.3)', color:'#ff8080', background: 'rgba(255,59,59,0.1)', marginLeft: 8 }}
          >✕ CLEAR</button>
        )}
      </div>

      {/* ── Main body ─────────────────────────────────────────────────────── */}
      <div className="if-body">

        {/* Map */}
        {loading
          ? (
            <div className="if-map-wrap" style={{ position:'relative' }}>
              <div className="if-loading">
                <div className="if-spinner" />
                <div className="if-loading-text">RETRIEVING ENCRYPTED EVENT LOGS</div>
              </div>
            </div>
          )
          : error
          ? (
            <div className="if-map-wrap" style={{ display:'flex', alignItems:'center', justifyContent:'center', background: 'rgba(0,0,0,0.5)' }}>
              <div className="if-no-data" style={{ border: '1px dashed rgba(255,59,59,0.3)', background: 'rgba(255,59,59,0.05)', color: '#ff8080' }}>
                <div style={{ fontSize:32, marginBottom:16 }}><Icons.Explosion /></div>
                [ COMM LINK FAILURE ]<br/>{error}<br/>
                <button className="if-refresh-btn" style={{ marginTop:24, margin: '24px auto 0' }} onClick={() => fetchIncidents()}>REINITIALIZE LINK</button>
              </div>
            </div>
          )
          : (
            <IncidentMap
              incidents={incidents}
              selected={selected}
              onSelect={setSelected}
              typeFilters={typeFilters}
            />
          )
        }

        {/* Sidebar feed */}
        <div className="if-sidebar">
          <div className="if-sidebar-head">
            <span className="if-sidebar-title">INCIDENT LOGS</span>
            <span className="if-sidebar-count">{visibleIncidents.length} DETECTED</span>
          </div>

          <div className="if-feed">
            {loading && (
              <div className="if-no-data">
                <div className="if-spinner" style={{ margin:'40px auto 20px' }} />
                SCANNING...
              </div>
            )}
            {!loading && visibleIncidents.length === 0 && (
              <div className="if-no-data" style={{ paddingTop: 80 }}>
                [ NO EVENTS MATCHING<br/>CURRENT PARAMETERS ]
              </div>
            )}
            {!loading && visibleIncidents.map(inc => (
              <IncidentCard
                key={inc.id}
                inc={inc}
                selected={selected}
                onSelect={setSelected}
              />
            ))}
          </div>

          {/* AdBanner Placement inside Sidebar */}
          {import.meta.env.VITE_SHOW_ADS !== 'false' && (
            <div style={{ background: 'rgba(0,212,255,0.02)', borderTop: '1px solid rgba(0,212,255,0.1)', padding: '16px 0', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
              <AdBanner id="ad-incident-sidebar" size="300x250" />
            </div>
          )}

          {/* Stats bar */}
          <div className="if-stats">
            {[
              { label:'TOTAL',     val: stats.total,     color:'var(--if-accent)' },
              { label:'BATTLES',   val: stats.battle,    color:'#ff3b3b' },
              { label:'BLASTS',    val: stats.explosion, color:'#ffaa00' },
              { label:'PROTESTS',  val: stats.protest,   color:'#00d4ff' },
            ].map(s => (
              <div key={s.label} className="if-stat">
                <div className="if-stat-val" style={{ color:s.color }}>{s.val}</div>
                <div className="if-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}