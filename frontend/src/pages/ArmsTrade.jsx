import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { ARMS_TRANSFERS, ARMS_ERAS, ARMS_CATEGORIES } from '../data/arms-trade-data.js';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Map: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  Chart: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  List: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Cargo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><path d="M2 15h20v4H2z"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
};

// ─── Real Image Mapping ───────────────────────────────────────────────────────
// Replaces emojis with actual photographic thumbnails tinted tactically
const getCatImage = (catLabel) => {
  const str = (catLabel || '').toLowerCase();
  if (str.includes('air')) return 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=200&q=80';
  if (str.includes('armor') || str.includes('tank')) return 'https://images.unsplash.com/photo-1632292220916-c92a7c062c3f?auto=format&fit=crop&w=200&q=80';
  if (str.includes('nav') || str.includes('ship')) return 'https://images.unsplash.com/photo-1590458632646-0b1a01798319?auto=format&fit=crop&w=200&q=80';
  if (str.includes('missil') || str.includes('artillery') || str.includes('defense')) return 'https://images.unsplash.com/photo-1612044810777-6ea71d604b34?auto=format&fit=crop&w=200&q=80';
  return 'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=200&q=80'; 
};

// ─── Map Helper: Bezier Arcs ──────────────────────────────────────────────────
// Turns straight lines into sweeping ballistic arcs on the map
function getBezierPoints(lat1, lng1, lat2, lng2) {
  const pts = [];
  const offsetX = (lng2 - lng1) * 0.15;
  const offsetY = Math.abs(lat2 - lat1) * 0.3;
  const midLat = (lat1 + lat2) / 2 + offsetY;
  const midLng = (lng1 + lng2) / 2 + offsetX;

  for (let t = 0; t <= 1; t += 0.05) {
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2;
    pts.push([lat, lng]);
  }
  return pts;
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  --at-bg:      #050508;
  --at-panel:   rgba(10, 12, 20, 0.85);
  --at-border:  rgba(0, 212, 255, 0.15);
  --at-accent:  #00d4ff;
  --at-text:    #e8eaf0;
  --at-muted:   #8892a4;
  --at-dim:     #4a5568;
}

.at-page-wrapper {
  min-height: 100dvh;
  background: var(--at-bg);
  color: var(--at-text);
  font-family: 'Barlow', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Tactical Grid Background */
.at-page-wrapper::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  background-position: center center;
  z-index: 0;
  pointer-events: none;
}

.at-content-layer { position: relative; z-index: 1; }

/* ── Hero ── */
.at-hero {
  position: relative; padding: 64px 24px; border-bottom: 1px solid rgba(0,212,255,0.2);
  background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(0,212,255,0.1) 0%, transparent 70%);
  display: flex; flex-direction: column; align-items: center; text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.at-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
  letter-spacing: 0.18em; color: var(--at-accent); text-transform: uppercase;
  background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3);
  border-radius: 4px; padding: 6px 16px; margin-bottom: 24px;
  box-shadow: 0 0 15px rgba(0,212,255,0.15);
}
.at-title {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
  font-size: clamp(48px, 8vw, 88px); letter-spacing: -0.01em; line-height: 1;
  color: var(--at-text); margin-bottom: 24px; text-shadow: 0 4px 20px rgba(0,0,0,0.8);
}
.at-title span { color: var(--at-accent); text-shadow: 0 0 24px rgba(0,212,255,0.4); }

.at-hero-stats {
  display: flex; gap: 0; border: 1px solid rgba(0,212,255,0.2);
  border-radius: 8px; width: 100%; max-width: 800px; overflow: hidden;
  background: rgba(10,12,20,0.85); backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.at-hstat { flex: 1; padding: 20px 16px; text-align: center; border-right: 1px solid rgba(0,212,255,0.15); }
.at-hstat:last-child { border-right: none; }
.at-hstat-val {
  display: block; font-family: 'IBM Plex Mono', monospace; font-size: 28px;
  font-weight: 600; color: var(--at-accent); text-shadow: 0 0 12px rgba(0,212,255,0.3);
  margin-bottom: 6px;
}
.at-hstat-label {
  display: block; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--at-muted); text-transform: uppercase;
}

/* ── Filter bar ── */
.at-filters {
  background: rgba(10, 12, 20, 0.7); border-bottom: 1px solid var(--at-border);
  padding: 16px 40px; display: flex; gap: 24px; align-items: center; flex-wrap: wrap;
  position: sticky; top: 60px; z-index: 30; backdrop-filter: blur(12px);
}
.at-filter-group { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.at-filter-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--at-dim); text-transform: uppercase; white-space: nowrap;
}
.at-pill {
  padding: 6px 14px; border-radius: 4px; cursor: pointer;
  border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03);
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
  color: var(--at-muted); letter-spacing: 0.08em; transition: all 200ms ease; white-space: nowrap; text-transform: uppercase;
  display: flex; align-items: center; gap: 6px;
}
.at-pill:hover { border-color: rgba(255,255,255,0.25); color: var(--at-text); background: rgba(255,255,255,0.08); }
.at-pill.active { color: #fff; box-shadow: 0 0 15px rgba(var(--rgb), 0.3); }

.at-search-wrap { position: relative; }
.at-search {
  background: rgba(5,5,8,0.8); border: 1px solid rgba(0,212,255,0.2);
  border-radius: 6px; padding: 10px 16px 10px 36px; color: var(--at-text);
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none;
  width: 240px; transition: all 200ms ease; box-shadow: inset 0 0 10px rgba(0,0,0,0.5);
}
.at-search:focus { border-color: var(--at-accent); box-shadow: 0 0 12px rgba(0,212,255,0.3); width: 280px; }
.at-search::placeholder { color: var(--at-dim); letter-spacing: 0.05em; }
.at-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--at-accent); pointer-events: none; opacity: 0.8; }

/* ── Tab bar ── */
.at-tabs {
  display: flex; gap: 8px; border-bottom: 1px solid var(--at-border);
  background: rgba(5,5,8,0.8); padding: 12px 40px; backdrop-filter: blur(8px);
}
.at-tab {
  padding: 10px 24px; cursor: pointer; font-family: 'IBM Plex Mono', monospace;
  font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--at-muted); border: 1px solid transparent; border-radius: 4px;
  background: transparent; transition: all 200ms ease; display: flex; align-items: center; gap: 8px;
}
.at-tab:hover { color: var(--at-text); background: rgba(255,255,255,0.05); }
.at-tab.active {
  color: var(--at-accent); background: rgba(0,212,255,0.1);
  border-color: rgba(0,212,255,0.3); box-shadow: 0 0 12px rgba(0,212,255,0.15);
}

/* ── Main layout ── */
.at-main { max-width: 1400px; margin: 0 auto; padding: 40px 48px 80px; }

/* ── Map view ── */
.at-map-wrap {
  height: 600px; border: 1px solid rgba(0,212,255,0.3); border-radius: 8px;
  overflow: hidden; position: relative; margin-bottom: 32px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6); background: #050508;
}
#at-leaflet { width: 100%; height: 100%; }
.at-map-legend {
  position: absolute; bottom: 24px; left: 24px; z-index: 1000; /* Increased to stay above Leaflet */
  background: rgba(5,7,12,0.9); border: 1px solid rgba(0,212,255,0.2);
  border-radius: 6px; padding: 16px 20px; display: flex; flex-direction: column; gap: 10px;
  backdrop-filter: blur(8px); box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}
.at-legend-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; color: var(--at-accent); text-transform: uppercase; margin-bottom: 4px; }
.at-legend-item { display: flex; align-items: center; gap: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--at-muted); }
.at-legend-line { height: 3px; width: 28px; border-radius: 2px; }

/* New Hint Text */
.at-map-hint {
  position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 1000; pointer-events: none; /* Let clicks pass through to the map */
  background: rgba(5, 7, 12, 0.85); border: 1px dashed rgba(0, 212, 255, 0.3);
  padding: 8px 16px; border-radius: 4px; backdrop-filter: blur(8px);
  font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
  letter-spacing: 0.15em; color: #00d4ff; text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}
.at-legend-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; color: var(--at-accent); text-transform: uppercase; margin-bottom: 4px; }
.at-legend-item { display: flex; align-items: center; gap: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--at-muted); }
.at-legend-line { height: 3px; width: 28px; border-radius: 2px; }

/* ── Charts view ── */
.at-charts-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(500px, 1fr)); gap: 32px; margin-bottom: 32px; }
.at-chart-card {
  background: rgba(10,12,20,0.7); border: 1px solid rgba(0,212,255,0.15);
  border-radius: 8px; padding: 32px; backdrop-filter: blur(8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.at-chart-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 24px; color: var(--at-text); margin-bottom: 6px; letter-spacing: 0.02em; }
.at-chart-sub { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--at-dim); letter-spacing: 0.1em; margin-bottom: 24px; text-transform: uppercase; }
.at-bar-row { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
.at-bar-label { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500; color: var(--at-muted); width: 100px; flex-shrink: 0; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.at-bar-track { flex: 1; height: 28px; background: rgba(0,0,0,0.4); border-radius: 4px; overflow: hidden; position: relative; border: 1px solid rgba(255,255,255,0.05); }
.at-bar-fill { height: 100%; border-radius: 3px; transition: width 800ms cubic-bezier(0.16, 1, 0.3, 1); display: flex; align-items: center; padding-left: 10px; min-width: 40px; box-shadow: inset 0 0 10px rgba(255,255,255,0.2); }
.at-bar-val { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: #fff; white-space: nowrap; text-shadow: 0 0 4px rgba(0,0,0,0.8); }

.at-cat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.at-cat-item {
  background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px; padding: 16px; display: flex; gap: 16px; align-items: center;
  position: relative; overflow: hidden;
}
.at-cat-img-bg {
  position: absolute; inset: 0; opacity: 0.15; background-size: cover; background-position: center; mix-blend-mode: luminosity; transition: opacity 200ms;
}
.at-cat-item:hover .at-cat-img-bg { opacity: 0.3; }
.at-cat-info { position: relative; z-index: 2; }
.at-cat-name { font-size: 16px; font-weight: 600; color: var(--at-text); margin-bottom: 4px; letter-spacing: 0.02em; }
.at-cat-count { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--at-accent); font-weight: 500; letter-spacing: 0.05em; }

/* ── Transfer cards ── */
.at-cards-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding: 0 8px; }
.at-cards-count { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; color: var(--at-muted); letter-spacing: 0.1em; text-transform: uppercase; }
.at-sort-select {
  background: rgba(10,12,20,0.8); border: 1px solid rgba(0,212,255,0.3);
  border-radius: 4px; padding: 8px 16px; color: var(--at-text);
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; outline: none; cursor: pointer;
}

.at-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 24px; }
.at-card {
  background: rgba(10,12,20,0.75); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; cursor: pointer; transition: all 200ms ease;
  position: relative; overflow: hidden; display: flex; flex-direction: column;
  backdrop-filter: blur(8px);
}
.at-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--card-color); opacity: 0.9; z-index: 5; }
.at-card:hover { border-color: rgba(0,212,255,0.4); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
.at-card.expanded { border-color: rgba(0,212,255,0.5); background: rgba(10,12,20,0.95); }

.at-card-inner { display: flex; gap: 16px; padding: 20px; position: relative; z-index: 2; }
.at-card-thumb {
  width: 80px; height: 80px; border-radius: 4px; object-fit: cover; flex-shrink: 0;
  border: 1px solid rgba(255,255,255,0.1);
}
.at-card-content { flex: 1; min-width: 0; }
.at-card-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px; }
.at-card-route { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 22px; color: var(--at-text); line-height: 1.1; }
.at-card-route span { color: var(--card-color); margin: 0 6px; }
.at-card-tiv { font-family: 'IBM Plex Mono', monospace; font-size: 15px; font-weight: 600; color: var(--at-accent); white-space: nowrap; text-shadow: 0 0 10px rgba(0,212,255,0.3); }
.at-card-label { font-size: 15px; color: var(--at-muted); line-height: 1.4; margin-bottom: 12px; font-weight: 500; }
.at-card-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.at-card-badge {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
  padding: 4px 10px; border-radius: 3px; letter-spacing: 0.1em;
  border: 1px solid; text-transform: uppercase; white-space: nowrap;
}
.at-card-year { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: var(--at-dim); }

.at-card-desc {
  padding: 20px; border-top: 1px dashed rgba(255,255,255,0.1);
  font-size: 15px; color: #cdd6f4; line-height: 1.7; background: rgba(0,0,0,0.4);
}
.at-card-expand {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
  color: var(--at-accent); padding: 12px 20px; cursor: pointer; letter-spacing: 0.15em;
  text-transform: uppercase; border-top: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background 200ms ease;
}
.at-card-expand:hover { background: rgba(0,212,255,0.05); }

/* ── Loading/empty ── */
.at-empty { padding: 80px 24px; text-align: center; background: rgba(0,212,255,0.02); border: 1px dashed rgba(0,212,255,0.2); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; color: var(--at-muted); letter-spacing: 0.15em; line-height: 2; text-transform: uppercase; }

/* ── Popup ── */
.if-popup {
  font-family: 'Barlow', sans-serif !important;
  background: rgba(5, 7, 12, 0.95) !important;
  border: 1px solid rgba(0,212,255,0.4) !important;
  border-radius: 6px !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.8), 0 0 20px rgba(0,212,255,0.1) !important;
  color: #e8eaf0 !important;
  min-width: 260px !important;
  backdrop-filter: blur(8px) !important;
}
.if-popup .leaflet-popup-content-wrapper { background: transparent !important; box-shadow: none !important; border: none !important; padding: 0 !important; }
.if-popup .leaflet-popup-tip-container { display: none !important; }
.if-popup .leaflet-popup-content { margin: 0 !important; }

.at-popup-inner { padding: 16px; }
.at-popup-route { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 20px; color: #e8eaf0; margin-bottom: 8px; letter-spacing: 0.02em; }
.at-popup-label { font-size: 14px; color: #8892a4; line-height: 1.5; margin-bottom: 12px; font-weight: 500; }
.at-popup-meta { display: flex; gap: 8px; flex-wrap: wrap; }
.at-popup-tag {
  font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
  color: #00d4ff; letter-spacing: 0.1em; background: rgba(0,212,255,0.1);
  padding: 4px 8px; border-radius: 3px; border: 1px solid rgba(0,212,255,0.2);
}

/* ── Responsive ── */
@media(max-width:1024px){
  .at-charts-grid { grid-template-columns: 1fr; }
  .at-hero { padding: 48px 24px 32px; }
  .at-main { padding: 32px 24px 64px; }
}
@media(max-width:768px){
  .at-filters { padding: 16px 24px; gap: 16px; }
  .at-tabs { padding: 0 24px; overflow-x: auto; }
  .at-map-wrap { height: 400px; }
  .at-cards-grid { grid-template-columns: 1fr; }
  .at-search-wrap { width: 100%; }
  .at-search { width: 100%; }
  .at-search:focus { width: 100%; }
  .at-hero-stats { flex-wrap: wrap; }
  .at-hstat { min-width: 50%; border-bottom: 1px solid rgba(0,212,255,0.1); }
  .at-card-inner { flex-direction: column; }
  .at-card-thumb { width: 100%; height: 160px; }
}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

// ── Leaflet loader ──────────────────────────────────────────────────────────
let _L = null;
async function loadLeaflet() {
  if (_L) return _L;
  if (!document.getElementById('lf-css')) {
    const l = document.createElement('link'); l.id='lf-css';
    l.rel='stylesheet'; l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(l);
  }
  if (!window.L) {
    await new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  _L = window.L; return _L;
}

// ── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}B` : `$${n}M`;
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r}, ${g}, ${b}`;
};

// ── Map Tab ──────────────────────────────────────────────────────────────────
function MapTab({ transfers }) {
  const mapRef    = useRef(null);
  const lfMap     = useRef(null);
  const layersRef = useRef([]);

  useEffect(() => {
    let mounted = true;
    loadLeaflet().then(Lf => {
      if (!mounted || !mapRef.current || lfMap.current) return;
      const map = Lf.map(mapRef.current, { center:[20,10], zoom:2, minZoom:2, zoomControl:false });
      Lf.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:'© OpenStreetMap © CARTO', subdomains:'abcd', maxZoom:20,
      }).addTo(map);
      Lf.control.zoom({ position:'bottomright' }).addTo(map);
      lfMap.current = map;
    });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!lfMap.current || !window.L) return;
    const Lf = window.L;
    layersRef.current.forEach(l => lfMap.current.removeLayer(l));
    layersRef.current = [];

    transfers.forEach(t => {
      const era    = ARMS_ERAS[t.era];
      const color  = era?.color ?? '#888';
      const weight = Math.max(1.5, Math.min(6, t.tiv / 1500));

      // Ballistic curve calculation
      const curvePoints = getBezierPoints(t.fromLat, t.fromLng, t.toLat, t.toLng);
      const line = Lf.polyline(curvePoints, { color, weight, opacity:0.65, smoothFactor:1 });

      const popup = `
        <div class="at-popup-inner">
          <div class="at-popup-route">${t.from} <span style="color:${color};margin:0 4px">→</span> ${t.to}</div>
          <div class="at-popup-label">${t.label}</div>
          <div class="at-popup-meta">
            <span class="at-popup-tag">TIV: ${fmt(t.tiv)}</span>
            <span class="at-popup-tag">${t.year}</span>
            <span class="at-popup-tag">${ARMS_CATEGORIES[t.cat]?.label ?? t.cat}</span>
          </div>
        </div>`;

      line.bindPopup(popup, { className:'if-popup', maxWidth:320 });
      line.addTo(lfMap.current);
      layersRef.current.push(line);

      // Destination marker
      const dot = Lf.circleMarker([t.toLat, t.toLng], {
        radius:5, fillColor:color, color:'#fff', weight:1, opacity:0.8, fillOpacity:0.9,
      });
      dot.addTo(lfMap.current);
      layersRef.current.push(dot);
    });
  }, [transfers]);

  return (
    <div className="at-map-wrap">
      <div id="at-leaflet" ref={mapRef} />
      
      <div className="at-map-legend">
        <div className="at-legend-title">TEMPORAL ERA</div>
        {Object.entries(ARMS_ERAS).map(([k,v]) => (
          <div key={k} className="at-legend-item">
            <div className="at-legend-line" style={{background:v.color, boxShadow:`0 0 6px ${v.color}`}} />
            {v.label} ({v.years})
          </div>
        ))}
      </div>

      {/* New Instruction Text */}
      <div className="at-map-hint">
        [ CLICK FILTERS TO RENDER TRADE LINES ]
      </div>
      
    </div>
  );
}

// ── Charts Tab ───────────────────────────────────────────────────────────────
function ChartsTab({ transfers }) {
  const exporters = useMemo(() => {
    const m = {};
    transfers.forEach(t => { m[t.from] = (m[t.from] ?? 0) + t.tiv; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]).slice(0,10);
  }, [transfers]);

  const importers = useMemo(() => {
    const m = {};
    transfers.forEach(t => { m[t.to] = (m[t.to] ?? 0) + t.tiv; });
    return Object.entries(m).sort((a,b) => b[1]-a[1]).slice(0,10);
  }, [transfers]);

  const catStats = useMemo(() => {
    const m = {};
    transfers.forEach(t => { m[t.cat] = (m[t.cat] ?? 0) + 1; });
    return m;
  }, [transfers]);

  const maxEx = exporters[0]?.[1] ?? 1;
  const maxIm = importers[0]?.[1] ?? 1;

  return (
    <>
      <div className="at-charts-grid">
        {/* Top Exporters */}
        <div className="at-chart-card">
          <div className="at-chart-title">PRIMARY SUPPLIERS</div>
          <div className="at-chart-sub">BY TOTAL TIV VALUE (SIPRI METHODOLOGY)</div>
          {exporters.map(([country, tiv], i) => (
            <div key={country} className="at-bar-row">
              <div className="at-bar-label" title={country}>{country.toUpperCase()}</div>
              <div className="at-bar-track">
                <div
                  className="at-bar-fill"
                  style={{
                    width:`${(tiv/maxEx)*100}%`,
                    background:`linear-gradient(90deg, rgba(0,212,255,${0.9-i*0.07}), rgba(0,212,255,${0.4-i*0.03}))`,
                  }}
                >
                  <span className="at-bar-val">{fmt(tiv)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Top Importers */}
        <div className="at-chart-card">
          <div className="at-chart-title">PRIMARY ACQUIRERS</div>
          <div className="at-chart-sub">BY TOTAL TIV VALUE (SIPRI METHODOLOGY)</div>
          {importers.map(([country, tiv], i) => (
            <div key={country} className="at-bar-row">
              <div className="at-bar-label" title={country}>{country.toUpperCase()}</div>
              <div className="at-bar-track">
                <div
                  className="at-bar-fill"
                  style={{
                    width:`${(tiv/maxIm)*100}%`,
                    background:`linear-gradient(90deg, rgba(255,59,59,${0.9-i*0.07}), rgba(255,59,59,${0.4-i*0.03}))`,
                  }}
                >
                  <span className="at-bar-val">{fmt(tiv)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="at-chart-card">
          <div className="at-chart-title">BY ASSET CLASSIFICATION</div>
          <div className="at-chart-sub">RECORDED TRANSFER COUNT</div>
          <div className="at-cat-grid">
            {Object.entries(ARMS_CATEGORIES).map(([k, v]) => {
              const bgImg = getCatImage(v.label);
              const rgb = hexToRgb(v.color);
              return (
                <div key={k} className="at-cat-item" style={{ borderColor: `rgba(${rgb},0.3)` }}>
                  <div className="at-cat-img-bg" style={{ backgroundImage: `url(${bgImg})` }} />
                  <div className="at-cat-info">
                    <div className="at-cat-name" style={{ color: v.color }}>{v.label.toUpperCase()}</div>
                    <div className="at-cat-count">{catStats[k] ?? 0} LOGS</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Era Breakdown */}
        <div className="at-chart-card">
          <div className="at-chart-title">BY TEMPORAL ERA</div>
          <div className="at-chart-sub">TOTAL TIV VALUE OVER TIME</div>
          {Object.entries(ARMS_ERAS).map(([k, v]) => {
            const tiv = transfers.filter(t => t.era === k).reduce((a,t) => a+t.tiv, 0);
            const total = transfers.reduce((a,t) => a+t.tiv, 0) || 1;
            return (
              <div key={k} className="at-bar-row">
                <div className="at-bar-label">{v.label.toUpperCase()}</div>
                <div className="at-bar-track">
                  <div
                    className="at-bar-fill"
                    style={{ width:`${(tiv/total)*100}%`, background:v.color }}
                  >
                    <span className="at-bar-val">{fmt(tiv)}</span>
                  </div>
                </div>
              </div>
            );
          })}
          <div style={{marginTop:24}}>
            {Object.entries(ARMS_ERAS).map(([k,v]) => {
              const count = transfers.filter(t => t.era === k).length;
              return (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px dashed rgba(255,255,255,0.1)',fontFamily:'IBM Plex Mono,monospace',fontSize:12, fontWeight:500}}>
                  <span style={{color:v.color}}>{v.label.toUpperCase()} ({v.years})</span>
                  <span style={{color:'#8892a4'}}>{count} LOGS</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Transfer Card ────────────────────────────────────────────────────────────
function TransferCard({ t }) {
  const [open, setOpen] = useState(false);
  const era = ARMS_ERAS[t.era];
  const cat = ARMS_CATEGORIES[t.cat];
  const thumbUrl = getCatImage(cat?.label);

  return (
    <div
      className={`at-card ${open ? 'expanded' : ''}`}
      onClick={() => setOpen(o => !o)}
      style={{ '--card-color': era?.color ?? '#888' }}
    >
      <div className="at-card-inner">
        <img 
          src={thumbUrl} 
          alt={cat?.label ?? 'Asset'} 
          className="at-card-thumb" 
          style={{ filter: `sepia(1) hue-rotate(${cat?.label.includes('Air') ? 180 : cat?.label.includes('Armor') ? 320 : 0}deg) saturate(3) brightness(0.6)` }}
        />
        <div className="at-card-content">
          <div className="at-card-top">
            <div className="at-card-route">
              {t.from.toUpperCase()} <span>→</span> {t.to.toUpperCase()}
            </div>
            <div className="at-card-tiv">{fmt(t.tiv)}</div>
          </div>
          <div className="at-card-label">{t.label}</div>
          <div className="at-card-meta">
            <span
              className="at-card-badge"
              style={{ color:era?.color, borderColor:`${era?.color}55`, background:`${era?.color}15` }}
            >{era?.label ?? t.era}</span>
            <span
              className="at-card-badge"
              style={{ color:cat?.color ?? '#888', borderColor:`${cat?.color ?? '#888'}55`, background:`${cat?.color ?? '#888'}15` }}
            >{cat?.label.toUpperCase() ?? t.cat.toUpperCase()}</span>
            <span className="at-card-year">LOG: {t.year}</span>
          </div>
        </div>
      </div>
      
      {open && (
        <div className="at-card-desc">{t.description}</div>
      )}
      <div className="at-card-expand">
        {open ? <><Icons.ChevronUp /> CLOSE MANIFEST</> : <><Icons.ChevronDown /> EXPAND MANIFEST</>}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ArmsTrade() {
  injectCSS('at-css', CSS);

  const [tab,     setTab]     = useState('map');    // map | charts | transfers
  const [era,     setEra]     = useState(null);
  const [cat,     setCat]     = useState(null);
  const [search,  setSearch]  = useState('');
  const [sort,    setSort]    = useState('tiv');

  const filtered = useMemo(() => {
    let data = ARMS_TRANSFERS;
    if (era)    data = data.filter(t => t.era === era);
    if (cat)    data = data.filter(t => t.cat === cat);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(t =>
        t.from.toLowerCase().includes(q) ||
        t.to.toLowerCase().includes(q) ||
        t.label.toLowerCase().includes(q)
      );
    }
    if (sort === 'tiv')  data = [...data].sort((a,b) => b.tiv - a.tiv);
    if (sort === 'year') data = [...data].sort((a,b) => b.year - a.year);
    if (sort === 'year-asc') data = [...data].sort((a,b) => a.year - b.year);
    return data;
  }, [era, cat, search, sort]);

  const totalTIV   = useMemo(() => ARMS_TRANSFERS.reduce((a,t) => a+t.tiv, 0), []);
  const filteredTIV= useMemo(() => filtered.reduce((a,t) => a+t.tiv, 0), [filtered]);
  const exporters  = useMemo(() => new Set(ARMS_TRANSFERS.map(t => t.from)).size, []);
  const importers  = useMemo(() => new Set(ARMS_TRANSFERS.map(t => t.to)).size, []);

  return (
    <div className="at-page-wrapper">
      <div className="at-content-layer">
        <Navbar />

        {/* ── Hero ── */}
        <div className="at-hero">
          <div className="at-hero-inner">
            <div className="at-eyebrow"><Icons.Cargo /> SIPRI TRANSFER DATABASE</div>
            <h1 className="at-title">GLOBAL ARMS<br/>LOGISTICS FLOW</h1>
            <div className="at-hero-stats">
              {[
                { val: ARMS_TRANSFERS.length, label:'LOGGED TRANSFERS' },
                { val: exporters,             label:'SUPPLIER STATES' },
                { val: importers,             label:'ACQUIRING STATES' },
                { val: fmt(totalTIV),         label:'TOTAL ESTIMATED TIV' },
              ].map(s => (
                <div key={s.label} className="at-hstat">
                  <span className="at-hstat-val">{s.val}</span>
                  <span className="at-hstat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '32px 0 0', display: 'flex', justifyContent: 'center' }}>
            <AdBanner id="ad-arms-top" size="728x90" />
          </div>
        )}

        {/* ── Filter bar ── */}
        <div className="at-filters">
          <div className="at-filter-group">
            <span className="at-filter-label">TEMPORAL ERA:</span>
            <button className={`at-pill ${!era ? 'active' : ''}`}
              style={!era ? {borderColor:'rgba(0,212,255,0.4)',background:'rgba(0,212,255,0.15)',color:'#00d4ff'} : {}}
              onClick={() => setEra(null)}>ALL ERAS</button>
            {Object.entries(ARMS_ERAS).map(([k,v]) => {
              const rgb = hexToRgb(v.color);
              return (
                <button key={k}
                  className={`at-pill ${era===k ? 'active' : ''}`}
                  style={era===k ? {'--rgb': rgb, borderColor:`${v.color}66`,background:`${v.color}22`,color:v.color} : {}}
                  onClick={() => setEra(era===k ? null : k)}
                >{v.label}</button>
              );
            })}
          </div>
          
          <div className="at-filter-group">
            <span className="at-filter-label">ASSET CLASS:</span>
            {Object.entries(ARMS_CATEGORIES).map(([k,v]) => {
              const rgb = hexToRgb(v.color);
              return (
                <button key={k}
                  className={`at-pill ${cat===k ? 'active' : ''}`}
                  style={cat===k ? {'--rgb': rgb, borderColor:`${v.color}66`,background:`${v.color}22`,color:v.color} : {}}
                  onClick={() => setCat(cat===k ? null : k)}
                >{v.label}</button>
              );
            })}
          </div>

          <div className="at-search-wrap" style={{ marginLeft: 'auto' }}>
            <span className="at-search-icon"><Icons.Search /></span>
            <input
              className="at-search"
              placeholder="> QUERY STATE..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <span style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11, fontWeight: 600, color:'#8892a4'}}>
            [{filtered.length} LOGS · {fmt(filteredTIV)} TIV]
          </span>
        </div>

        {/* ── Tabs ── */}
        <div className="at-tabs">
          {[
            { id:'map',       label:'🗺 GEO VISUALIZATION', Icon: Icons.Map },
            { id:'charts',    label:'📊 DATA MATRICES',     Icon: Icons.Chart },
            { id:'transfers', label:'📋 MANIFEST LOGS',     Icon: Icons.List },
          ].map(t => (
            <button key={t.id} className={`at-tab ${tab===t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}>
              <t.Icon /> {t.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        <div className="at-main">

          {tab === 'map' && <MapTab transfers={filtered} />}

          {tab === 'charts' && <ChartsTab transfers={filtered} />}

          {tab === 'transfers' && (
            <>
              <div className="at-cards-header">
                <div className="at-cards-count">{filtered.length} MANIFESTS FOUND</div>
                <select className="at-sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="tiv">SORT: HIGHEST TIV VALUE</option>
                  <option value="year">SORT: LATEST ACQUISITIONS</option>
                  <option value="year-asc">SORT: HISTORICAL ACQUISITIONS</option>
                </select>
              </div>
              {filtered.length === 0
                ? <div className="at-empty">[ ERR: NO LOGISTICS MATCH CURRENT PARAMETERS ]<br/>ADJUST TEMPORAL OR ASSET FILTERS</div>
                : <div className="at-cards-grid">
                    {filtered.map(t => <TransferCard key={t.id} t={t} />)}
                  </div>
              }
            </>
          )}

        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '0 0 40px', display: 'flex', justifyContent: 'center' }}>
            <AdBanner position="bottom" size="728x90" />
          </div>
        )}
        <Footer />
      </div>
    </div>
  );
}