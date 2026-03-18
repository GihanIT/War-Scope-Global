// src/pages/Compare.jsx

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar   from '../components/Navbar.jsx';
import AdBanner from '../components/AdBanner.jsx';
import Footer   from '../components/Footer.jsx';
import SEO      from '../seo/SEO.jsx';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Personnel:  () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Shield:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Target:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Plane:      () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 1.5L14.5 9 6.3 7.2C5.8 7 5.4 7.2 5.2 7.6L4 10l6 4-4 4-2.8-.9L2 14l3.5 3.5c.4.4.4 1 0 1.4L4.1 20.3c-.4.4-1 .4-1.4 0L1.3 18.9c-.4-.4-.4-1 0-1.4l3.5-3.5 1.1-1.2.9 2.8-4-4-2.4 1.2c-.4.2-.6.6-.5 1.1l1.8 8.2z"/></svg>,
  Fighter:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>,
  Helicopter: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  Anchor:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>,
  Dollar:     () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Nuclear:    () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .11 1.89l1.8 2.6a4.8 4.8 0 0 0 .8-1.5z"/><path d="M15 19.4a1.65 1.65 0 0 0 1.89.11l2.6 1.8a4.8 4.8 0 0 0-1.5.8z"/><path d="M12 21a1.65 1.65 0 0 0-1.65-1.65H8.5a4.8 4.8 0 0 0 0 3h1.85A1.65 1.65 0 0 0 12 21z"/><path d="M4.6 15a1.65 1.65 0 0 1-.11 1.89l-1.8 2.6a4.8 4.8 0 0 1-.8-1.5z"/><path d="M9 19.4a1.65 1.65 0 0 1-1.89.11l-2.6 1.8a4.8 4.8 0 0 1 1.5.8z"/><path d="M12 3a1.65 1.65 0 0 1 1.65 1.65h1.85a4.8 4.8 0 0 1 0-3h-1.85A1.65 1.65 0 0 1 12 3z"/><path d="M15 4.6a1.65 1.65 0 0 1-1.89-.11l-2.6-1.8a4.8 4.8 0 0 1 1.5-.8z"/><path d="M19.4 9a1.65 1.65 0 0 1-.11-1.89l1.8-2.6a4.8 4.8 0 0 1 .8 1.5z"/><path d="M4.6 9a1.65 1.65 0 0 0 .11-1.89l-1.8-2.6a4.8 4.8 0 0 0-.8 1.5z"/><path d="M9 4.6a1.65 1.65 0 0 0 1.89-.11l2.6-1.8a4.8 4.8 0 0 0-1.5-.8z"/></svg>,
  Copy:       () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>,
  Reset:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>,
  Download:   () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Twitter:    () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.732-8.836L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Reddit:     () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>,
  WhatsApp:   () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>,
  Crosshair:  () => <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.4)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>,
};

// ─── Config ───────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const STATS = [
  { key: 'active_personnel',        label: 'Active Personnel',   Icon: Icons.Personnel,  format: 'number' },
  { key: 'reserve_personnel',       label: 'Reserve Personnel',  Icon: Icons.Shield,     format: 'number' },
  { key: 'tanks',                   label: 'Armored Vehicles',   Icon: Icons.Target,     format: 'number' },
  { key: 'total_military_aircraft', label: 'Total Aircraft',     Icon: Icons.Plane,      format: 'number' },
  { key: 'fighter_aircraft',        label: 'Fighter Aircraft',   Icon: Icons.Fighter,    format: 'number' },
  { key: 'attack_helicopters',      label: 'Attack Helicopters', Icon: Icons.Helicopter, format: 'number' },
  { key: 'total_naval_fleet',       label: 'Naval Fleet',        Icon: Icons.Anchor,     format: 'number' },
  { key: 'defense_budget_usd',      label: 'Defense Budget',     Icon: Icons.Dollar,     format: 'budget'  },
  { key: 'nuclear_weapons',         label: 'Nuclear Warheads',   Icon: Icons.Nuclear,    format: 'nuclear' },
];

// ─── CSS Updates ─────────────────────────────────────────────────────────────
const COMPARE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow:wght@300;400;600;700;800;900&display=swap');

  .cmp-page-wrapper {
    min-height: 100dvh;
    background-color: #050508;
    position: relative;
    overflow-x: hidden;
  }
  .cmp-page-wrapper::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0, 212, 255, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
    z-index: 0;
    pointer-events: none;
  }
  .cmp-content { position: relative; z-index: 1; }

  /* New Layout Container for Sidebar Ads */
  .cmp-layout-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    gap: 32px;
    max-width: 1480px; 
    margin: 0 auto;
    padding: clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px);
  }
  
  .cmp-main-column {
    flex: 1;
    max-width: 1060px;
    min-width: 0;
  }

  .cmp-sidebar-ad {
    width: 160px;
    flex-shrink: 0;
    display: none;
    position: sticky;
    top: 100px; /* Adjust based on navbar height */
  }

  @media (min-width: 1280px) {
    .cmp-sidebar-ad { display: block; }
  }

  /* Selectors */
  .cmp-select {
    width: 100%;
    background: rgba(10, 12, 20, 0.85);
    color: #e8eaf0;
    border-radius: 4px;
    padding: 12px 40px 12px 16px;
    font-size: 14px;
    font-family: 'IBM Plex Mono', monospace;
    letter-spacing: 0.05em;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    outline: none;
    transition: all 200ms ease;
    backdrop-filter: blur(12px);
  }
  .cmp-select option { background: #0f1117; color: #e8eaf0; }
  .cmp-select-a { border: 1px solid rgba(0,212,255,0.4); }
  .cmp-select-a:focus { border-color: #00d4ff; box-shadow: 0 0 15px rgba(0,212,255,0.2); }
  .cmp-select-b { border: 1px solid rgba(255,59,59,0.4); }
  .cmp-select-b:focus { border-color: #ff3b3b; box-shadow: 0 0 15px rgba(255,59,59,0.2); }

  /* Enhanced Stat Rows */
  .cmp-bar-track {
    width: 100%; height: 6px;
    background: rgba(255,255,255,0.03);
    border-radius: 3px; overflow: hidden; margin-top: 8px;
  }
  .cmp-bar-fill {
    height: 100%; border-radius: 3px;
    transition: width 700ms cubic-bezier(0.16,1,0.3,1);
  }

  .cmp-stat-row {
    display: flex; align-items: center; gap: 24px;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255,255,255,0.03);
    transition: background 150ms ease;
  }
  .cmp-stat-row:hover { background: rgba(255,255,255,0.02); }
  .cmp-stat-row:last-child { border-bottom: none; }

  /* Buttons & Interactions */
  .cmp-action-btn {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 10px; border-radius: 4px; padding: 14px 24px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em;
    cursor: pointer; transition: all 200ms ease;
    white-space: nowrap; border: none;
  }
  .cmp-action-btn:active { transform: scale(0.98); }

  /* Share menu */
  .cmp-share-menu {
    position: absolute; bottom: calc(100% + 8px); left: 0;
    background: rgba(10, 12, 20, 0.95);
    border: 1px solid rgba(0,212,255,0.25);
    border-radius: 6px; overflow: hidden;
    min-width: 200px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
    backdrop-filter: blur(16px);
    z-index: 100;
  }
  .cmp-share-item {
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    cursor: pointer; color: #8892a4;
    transition: background 150ms, color 150ms;
    border: none; background: transparent; width: 100%; text-align: left;
  }
  .cmp-share-item:hover { background: rgba(0,212,255,0.08); color: #e8eaf0; }
  .cmp-share-item + .cmp-share-item { border-top: 1px solid rgba(255,255,255,0.05); }

  .cmp-skeleton {
    background: linear-gradient(90deg, rgba(30,36,51,0.3) 25%, rgba(0,212,255,0.05) 50%, rgba(30,36,51,0.3) 75%);
    background-size: 200% 100%;
    animation: cmp-shimmer 2s linear infinite; border-radius: 2px;
  }
  @keyframes cmp-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  @keyframes cmp-fade-up { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .cmp-fade-up { animation: cmp-fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes cmp-bounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  .cmp-copied-anim { animation: cmp-bounce 300ms ease; border-color: #00ff88 !important; color: #00ff88 !important; box-shadow: 0 0 15px rgba(0,255,136,0.2) !important; }

  @media (max-width: 768px) {
    .cmp-selector-row  { flex-direction: column !important; }
    .cmp-vs-wrap       { margin: 0 auto !important; padding-top: 10px !important; padding-bottom: 10px !important; }
    .cmp-stat-row      { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
    .cmp-stat-center   { order: -1; flex-direction: row !important; gap: 8px !important; justify-content: flex-start !important; padding: 0 !important; }
    .cmp-stat-side-b   { flex-direction: row-reverse !important; text-align: left !important; }
    .cmp-header-grid   { grid-template-columns: 1fr !important; }
    .cmp-actions-row   { flex-direction: column !important; width: 100%; }
    .cmp-actions-row button, .cmp-actions-row > div { width: 100% !important; max-width: 100% !important; }
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id; el.textContent = css;
  document.head.appendChild(el);
}

// ─── Format helpers ───────────────────────────────────────────────────────────
function formatBudget(v) {
  const n = Number(v);
  if (!n) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`;
  return `$${(n / 1e3).toFixed(0)}K`;
}
function fmtVal(v, format) {
  const n = Number(v) || 0;
  if (format === 'budget')  return { text: formatBudget(v), isEmpty: !n };
  if (format === 'nuclear') return { text: n > 0 ? n.toLocaleString() : 'NONE DETECTED', isEmpty: n === 0 };
  return { text: n > 0 ? n.toLocaleString() : '0', isEmpty: n === 0 };
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────
function SkeletonRows() {
  return (
    <div>
      {STATS.map((_, i) => (
        <div key={i} className="cmp-stat-row" style={{ gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div className="cmp-skeleton" style={{ height: 18, width: '60%', marginLeft: 'auto', marginBottom: 10 }} />
            <div className="cmp-skeleton" style={{ height: 6 }} />
          </div>
          <div style={{ width: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div className="cmp-skeleton" style={{ height: 20, width: 20, borderRadius: '50%' }} />
            <div className="cmp-skeleton" style={{ height: 10, width: 80 }} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="cmp-skeleton" style={{ height: 18, width: '55%', marginBottom: 10 }} />
            <div className="cmp-skeleton" style={{ height: 6 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Country selector card ────────────────────────────────────────
function SelectorCard({ side, countries, iso, setIso, countryData }) {
  const isA = side === 'a';
  const accent = isA ? '#00d4ff' : '#ff3b3b';
  const label  = isA ? 'TARGET ALPHA' : 'TARGET BRAVO';
  return (
    <div style={{ flex: 1, minWidth: 0, width: '100%' }}>
      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', color: accent, textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, boxShadow: `0 0 8px ${accent}` }} />
        {label}
      </div>
      <div style={{ position: 'relative' }}>
        <select className={`cmp-select cmp-select-${side}`} value={iso} onChange={e => setIso(e.target.value)}>
          <option value="">[ SELECT PARAMETER ]</option>
          {countries.map(c => <option key={c.iso3} value={c.iso3}>{c.name}</option>)}
        </select>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.8 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {iso && countryData?.country && (
        <div className="cmp-fade-up" style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
          {countryData.country.iso2 && (
            <img src={`https://flagcdn.com/w40/${countryData.country.iso2.toLowerCase()}.png`} alt={countryData.country.name} style={{ height: 20, borderRadius: 2, border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }} onError={e => { e.target.style.display = 'none'; }} />
          )}
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500, color: '#e8eaf0' }}>{countryData.country.name}</span>
          {countryData.country.rank && (
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: accent, background: `${accent}15`, padding: '2px 6px', borderRadius: 3, border: `1px solid ${accent}44` }}>GFP #{countryData.country.rank}</span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Country header card ─────────────────────────────────────────
function CountryHeaderCard({ data, side }) {
  const accent  = side === 'a' ? '#00d4ff' : '#ff3b3b';
  const country = data?.country ?? {};
  return (
    <div style={{ background: 'rgba(10, 12, 20, 0.7)', backdropFilter: 'blur(16px)', border: `1px solid ${accent}44`, borderTop: `3px solid ${accent}`, borderRadius: 6, padding: '20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      {country.iso2 && <img src={`https://flagcdn.com/w80/${country.iso2.toLowerCase()}.png`} alt={country.name} style={{ width: 64, height: 44, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }} onError={e => { e.target.style.display = 'none'; }} />}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 20, fontWeight: 700, color: '#e8eaf0', letterSpacing: '0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{country.name ?? '—'}</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 6, alignItems: 'center' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: accent, letterSpacing: '0.1em' }}>{country.iso3}</span>
          {country.rank && <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: '#8892a4', letterSpacing: '0.05em' }}>RANK: #{country.rank}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Upgraded Stat row ─────────────────────────────────────────────────────
function StatRow({ stat, valA, valB, animDelay }) {
  const nA = Number(valA) || 0;
  const nB = Number(valB) || 0;
  const max = Math.max(nA, nB, 1);
  const pA = Math.round((nA / max) * 100);
  const pB = Math.round((nB / max) * 100);
  const aWins = nA > nB, bWins = nB > nA, tied = nA === nB && nA > 0;
  
  // Upgraded Colors & Gradients
  const colorA = (aWins || tied) ? '#00d4ff' : '#8c9ab8';
  const colorB = (bWins || tied) ? '#ff3b3b' : '#8c9ab8';
  const bgA = (aWins || tied) ? 'linear-gradient(90deg, #00d4ff, #0055ff)' : '#8c9ab866';
  const bgB = (bWins || tied) ? 'linear-gradient(90deg, #ff3b3b, #ff0055)' : '#8c9ab866';

  const fA = fmtVal(valA, stat.format);
  const fB = fmtVal(valB, stat.format);
  const Icon = stat.Icon;
  return (
    <div className="cmp-stat-row cmp-fade-up" style={{ animationDelay: `${animDelay}ms` }}>
      <div style={{ flex: 1, minWidth: 0, textAlign: 'right' }}>
        <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 22, fontWeight: 800, color: fA.isEmpty && stat.format === 'nuclear' ? '#8892a4' : colorA, lineHeight: 1.2, textShadow: aWins ? `0 0 16px rgba(0,212,255,0.4)` : 'none', opacity: (!aWins && !tied) ? 0.6 : 1 }}>{fA.text}</div>
        <div className="cmp-bar-track"><div className="cmp-bar-fill" style={{ width: `${pA}%`, background: bgA, marginLeft: 'auto', boxShadow: aWins ? `0 0 12px rgba(0,212,255,0.6)` : 'none', float: 'right' }} /></div>
      </div>
      <div className="cmp-stat-center" style={{ width: 140, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '0 8px' }}>
        <span style={{ color: '#8892a4', opacity: 0.8, display: 'flex' }}><Icon /></span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, color: '#8892a4', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>{stat.label}</span>
      </div>
      <div className="cmp-stat-side-b" style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 22, fontWeight: 800, color: fB.isEmpty && stat.format === 'nuclear' ? '#8892a4' : colorB, lineHeight: 1.2, textShadow: bWins ? `0 0 16px rgba(255,59,59,0.4)` : 'none', opacity: (!bWins && !tied) ? 0.6 : 1 }}>{fB.text}</div>
        <div className="cmp-bar-track"><div className="cmp-bar-fill" style={{ width: `${pB}%`, background: bgB, boxShadow: bWins ? `0 0 12px rgba(255,59,59,0.6)` : 'none' }} /></div>
      </div>
    </div>
  );
}

// ─── Winner banner ────────────────────────────────────────────────
function WinnerBanner({ dataA, dataB }) {
  const sA = dataA?.stats ?? {}, sB = dataB?.stats ?? {};
  let wA = 0, wB = 0;
  STATS.forEach(s => { const a = Number(sA[s.key]) || 0, b = Number(sB[s.key]) || 0; if (a > b) wA++; else if (b > a) wB++; });
  const tied = wA === wB, winner = tied ? null : (wA > wB ? dataA?.country : dataB?.country);
  const winnerColor = tied ? '#a0afc8' : (wA > wB ? '#00d4ff' : '#ff3b3b');
  
  return (
    <div className="cmp-fade-up" style={{ background: `linear-gradient(90deg, ${winnerColor}15 0%, rgba(10,12,20,0.8) 100%)`, backdropFilter: 'blur(12px)', border: `1px solid ${winnerColor}33`, borderLeft: `4px solid ${winnerColor}`, borderRadius: 6, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24, boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 0 20px ${winnerColor}0a` }}>
      <div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', color: winnerColor, textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 4, height: 4, background: winnerColor, borderRadius: '50%', boxShadow: `0 0 8px ${winnerColor}` }} />
          {tied ? 'Combat Assessment' : 'Tactical Advantage'}
        </div>
        <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 26, fontWeight: 800, color: '#e8eaf0', letterSpacing: '0.02em', textShadow: `0 0 15px ${winnerColor}44` }}>
          {tied ? 'EVENLY MATCHED' : winner?.name.toUpperCase()}
        </div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', color: '#8892a4', textTransform: 'uppercase', marginBottom: 8 }}>Sector Superiority</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 32, fontWeight: 900, color: '#00d4ff', textShadow: '0 0 12px rgba(0,212,255,0.4)' }}>{wA}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, color: 'rgba(255,255,255,0.2)' }}>/</span>
          <span style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 32, fontWeight: 900, color: '#ff3b3b', textShadow: '0 0 12px rgba(255,59,59,0.4)' }}>{wB}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Compare page ─────────────────────────────────────────────────────────────
export default function Compare() {
  injectCSS('compare-page-css', COMPARE_CSS);

  const navigate          = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [countries,    setCountries]    = useState([]);
  const [isoA,         setIsoA]         = useState('');
  const [isoB,         setIsoB]         = useState('');
  const [dataA,        setDataA]        = useState(null);
  const [dataB,        setDataB]        = useState(null);
  const [loadingA,     setLoadingA]     = useState(false);
  const [loadingB,     setLoadingB]     = useState(false);
  const [copied,       setCopied]       = useState(false);
  const [shareOpen,    setShareOpen]    = useState(false);
  const [downloading,  setDownloading]  = useState(false);
  const copyBtnRef                      = useRef(null);
  const shareMenuRef                    = useRef(null);

  useEffect(() => {
    if (!shareOpen) return;
    const handler = (e) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target)) setShareOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [shareOpen]);

  useEffect(() => {
    fetch(`${API}/api/countries`)
      .then(r => r.ok ? r.json() : [])
      .then(list => {
        setCountries([...list].sort((a, b) => a.name.localeCompare(b.name)));
        const pa = searchParams.get('a'), pb = searchParams.get('b'), pc = searchParams.get('countries');
        if (pa) setIsoA(pa.toUpperCase());
        if (pb) setIsoB(pb.toUpperCase());
        if (!pa && !pb && pc) {
          const [x, y] = pc.split(',').map(s => s.trim().toUpperCase());
          if (x) setIsoA(x);
          if (y) setIsoB(y);
        }
      })
      .catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!isoA) { setDataA(null); return; }
    setLoadingA(true);
    fetch(`${API}/api/countries/${isoA}/military`)
      .then(r => r.ok ? r.json() : null)
      .then(setDataA).catch(() => setDataA(null))
      .finally(() => setLoadingA(false));
  }, [isoA]);

  useEffect(() => {
    if (!isoB) { setDataB(null); return; }
    setLoadingB(true);
    fetch(`${API}/api/countries/${isoB}/military`)
      .then(r => r.ok ? r.json() : null)
      .then(setDataB).catch(() => setDataB(null))
      .finally(() => setLoadingB(false));
  }, [isoB]);

  useEffect(() => {
    const p = {};
    if (isoA) p.a = isoA;
    if (isoB) p.b = isoB;
    setSearchParams(p, { replace: true });
  }, [isoA, isoB, setSearchParams]);

  // ── Share URLs & Web Share API ─────────────────────────────────────────────
  const shareUrl = `${window.location.origin}/compare?a=${isoA}&b=${isoB}`;
  const shareText = dataA && dataB
    ? `${dataA.country?.name} vs ${dataB.country?.name} — Military power comparison on WarScope`
    : 'Military power comparison on WarScope';

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'WarScope Intelligence',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // Ex: User cancelled the share sheet, do nothing.
      }
    } else {
      // Fallback for browsers without Web Share API
      setShareOpen(o => !o);
    }
  };

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopied(true);
        setShareOpen(false);
        copyBtnRef.current?.classList.add('cmp-copied-anim');
        setTimeout(() => {
          setCopied(false);
          copyBtnRef.current?.classList.remove('cmp-copied-anim');
        }, 2000);
      })
      .catch(() => { window.prompt('Copy this URL:', shareUrl); });
  }, [shareUrl]);

  const handleShareTwitter = useCallback(() => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    setShareOpen(false);
  }, [shareText, shareUrl]);

  const handleShareReddit = useCallback(() => {
    window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, '_blank');
    setShareOpen(false);
  }, [shareText, shareUrl]);

  const handleShareWhatsApp = useCallback(() => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    setShareOpen(false);
  }, [shareText, shareUrl]);

  // ── Download card ──────────────────────────────────────────────────────────
  const handleDownloadCard = useCallback(async () => {
    if (!isoA || !isoB || downloading) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API}/api/card/compare/${isoA}/${isoB}.png`);
      if (!res.ok) throw new Error('Card generation failed');
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `warscope-${isoA}-vs-${isoB}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Card generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [isoA, isoB, downloading]);

  const bothSelected = !!(isoA && isoB);
  const bothLoaded   = !!(dataA && dataB && !loadingA && !loadingB);
  const isLoading    = loadingA || loadingB;
  const sA           = dataA?.stats ?? {};
  const sB           = dataB?.stats ?? {};

  const ogImageUrl = bothSelected
    ? `${window.location.origin}/api/card/compare/${isoA}/${isoB}.png`
    : undefined;

  const seoTitle = bothLoaded
    ? `${dataA.country?.name ?? isoA} vs ${dataB.country?.name ?? isoB} Military Comparison | WarScope`
    : 'Compare Military Power | WarScope';
  const seoDesc = bothLoaded
    ? `Compare ${dataA.country?.name} vs ${dataB.country?.name}: active personnel, tanks, aircraft, naval fleet, nuclear warheads, and defense budget. Live military intelligence.`
    : 'Compare military capabilities side-by-side: personnel, aircraft, naval fleet, defense budget, tanks, and nuclear warheads. Data for 170+ countries.';

  return (
    <div className="cmp-page-wrapper">
      <SEO
        title={seoTitle}
        description={seoDesc}
        canonical={bothSelected ? `/compare?a=${isoA}&b=${isoB}` : '/compare'}
        ogImage={ogImageUrl}
      />
      <div className="cmp-content">
        <Navbar />

        {/* ── Main Layout with Sidebar Ads ── */}
        <div className="cmp-layout-container">
          
          {/* Left Ad Sidebar */}
          <div className="cmp-sidebar-ad left-ad">
            <AdBanner size="160x600" id="ad-sidebar-left-1" />
            <AdBanner size="160x600" id="ad-sidebar-left-2" />
          </div>

          {/* Central Main Column */}
          <div className="cmp-main-column">

            {/* Page header */}
            <div className="cmp-fade-up" style={{ marginBottom: 40 }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', color: '#00d4ff', opacity: 0.8, textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icons.Target /> INTELLIGENCE ANALYSIS
              </div>
              <h1 style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#e8eaf0', letterSpacing: '0.01em', lineHeight: 1.1, margin: 0, marginBottom: 12 }}>
                Strategic Power <span style={{ color: '#00d4ff', textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>Comparison</span>
              </h1>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 14, color: '#8892a4', margin: 0, letterSpacing: '0.02em', maxWidth: 600 }}>
                Analyze state military capabilities side-by-side across 9 primary tactical metrics. Select targets below to initiate.
              </p>
            </div>

            {/* Selector row */}
            <div className="cmp-fade-up cmp-selector-row" style={{ display: 'flex', alignItems: 'flex-start', gap: 24, marginBottom: 32, animationDelay: '60ms' }}>
              <SelectorCard side="a" countries={countries} iso={isoA} setIso={setIsoA} countryData={dataA} />
              <div className="cmp-vs-wrap" style={{ flexShrink: 0, paddingTop: 32, margin: '0 8px' }}>
                <div style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontSize: 26, fontWeight: 800, color: '#ff3b3b', lineHeight: 1, textShadow: '0 0 15px rgba(255,59,59,0.5)', letterSpacing: '0.1em', userSelect: 'none' }}>VS</div>
              </div>
              <SelectorCard side="b" countries={countries} iso={isoB} setIso={setIsoB} countryData={dataB} />
            </div>

            <AdBanner id="ad-compare-top" size="728x90" />

            {/* Empty state */}
            {!bothSelected && (
              <div className="cmp-fade-up" style={{ marginTop: 40, background: 'rgba(0, 212, 255, 0.02)', border: '1px dashed rgba(0, 212, 255, 0.3)', borderRadius: 6, padding: 'clamp(40px,8vw,80px) 24px', textAlign: 'center', animationDelay: '100ms', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}><Icons.Crosshair /></div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 16, fontWeight: 600, color: '#e8eaf0', marginBottom: 12, letterSpacing: '0.1em' }}>[ AWAITING TARGET PARAMETERS ]</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: '#8892a4', letterSpacing: '0.08em', maxWidth: 360, margin: '0 auto' }}>
                  {!isoA && !isoB ? 'Input two nation states to generate comparison matrix.' : !isoB ? 'Target Alpha locked. Awaiting Target Bravo.' : 'Target Bravo locked. Awaiting Target Alpha.'}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 32 }}>
                  {[['USA','RUS'],['CHN','USA'],['IND','PAK'],['ISR','IRN']].map(([a, b]) => (
                    <button key={`${a}-${b}`} onClick={() => { setIsoA(a); setIsoB(b); }}
                      style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: 4, padding: '8px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500, color: '#00d4ff', cursor: 'pointer', letterSpacing: '0.1em', transition: 'all 200ms ease' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.15)'; e.currentTarget.style.boxShadow = '0 0 12px rgba(0,212,255,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,212,255,0.05)'; e.currentTarget.style.boxShadow = 'none'; }}>
                      {a} / {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Table */}
            {bothSelected && (
              <div style={{ marginTop: 32 }}>
                {bothLoaded && (
                  <div className="cmp-fade-up cmp-header-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <CountryHeaderCard data={dataA} side="a" />
                    <CountryHeaderCard data={dataB} side="b" />
                  </div>
                )}
                {bothLoaded && <WinnerBanner dataA={dataA} dataB={dataB} />}

                <div style={{ background: '#0a0d17', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden', marginBottom: 32, boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 24px', background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{ flex: 1, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, color: '#00d4ff', textAlign: 'right', letterSpacing: '0.1em' }}>{dataA?.country?.name.toUpperCase() ?? isoA}</div>
                    <div style={{ width: 140, textAlign: 'center', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, color: '#8892a4', letterSpacing: '0.15em', textTransform: 'uppercase' }}>METRIC</div>
                    <div style={{ flex: 1, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, fontWeight: 600, color: '#ff3b3b', letterSpacing: '0.1em' }}>{dataB?.country?.name.toUpperCase() ?? isoB}</div>
                  </div>
                  {isLoading
                    ? <SkeletonRows />
                    : STATS.map((stat, i) => <StatRow key={stat.key} stat={stat} valA={sA[stat.key]} valB={sB[stat.key]} animDelay={i * 45} />)
                  }
                </div>

                {/* ── Action buttons ── */}
                {bothLoaded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    
                    <div className="cmp-actions-row" style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
                      {/* Download card */}
                      <button className="cmp-action-btn" onClick={handleDownloadCard} disabled={downloading}
                        style={{ background: downloading ? 'rgba(0,212,255,0.05)' : 'linear-gradient(90deg, #00d4ff, #0088ff)', color: downloading ? '#8892a4' : '#050508', border: downloading ? '1px solid rgba(0,212,255,0.3)' : 'none', flex: '1 1 auto', maxWidth: 280, cursor: downloading ? 'wait' : 'pointer', boxShadow: downloading ? 'none' : '0 4px 16px rgba(0,212,255,0.3)' }}>
                        <Icons.Download />
                        {downloading ? 'GENERATING...' : 'DOWNLOAD CARD'}
                      </button>

                      {/* Web Share API Button */}
                      <div style={{ position: 'relative', flex: '1 1 auto', maxWidth: 260 }} ref={shareMenuRef}>
                        <button ref={copyBtnRef} className="cmp-action-btn"
                          onClick={handleNativeShare}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: copied ? '#00ff88' : '#e8eaf0', border: `1px solid ${copied ? '#00ff88' : 'rgba(255,255,255,0.1)'}` }}>
                          {copied ? '✓ COPIED' : <><Icons.Copy /> SHARE MATRIX</>}
                        </button>
                        
                        {/* Fallback Share Menu */}
                        {shareOpen && (
                          <div className="cmp-share-menu">
                            <button className="cmp-share-item" onClick={handleCopyLink}>
                              <Icons.Copy /> Copy link
                            </button>
                            <button className="cmp-share-item" onClick={handleShareTwitter}>
                              <Icons.Twitter /> Share on X / Twitter
                            </button>
                            <button className="cmp-share-item" onClick={handleShareReddit}>
                              <Icons.Reddit /> Share on Reddit
                            </button>
                            <button className="cmp-share-item" onClick={handleShareWhatsApp}>
                              <Icons.WhatsApp /> Share on WhatsApp
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Reset */}
                      <button className="cmp-action-btn" onClick={() => { setIsoA(''); setIsoB(''); setShareOpen(false); }}
                        style={{ background: 'transparent', color: '#8892a4', border: '1px solid rgba(255,255,255,0.1)', flex: '0 0 auto' }}
                        onMouseEnter={e => { e.currentTarget.style.color = '#ff3b3b'; e.currentTarget.style.borderColor = 'rgba(255,59,59,0.3)'; e.currentTarget.style.background = 'rgba(255,59,59,0.05)'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#8892a4'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'transparent'; }}>
                        <Icons.Reset /> RESET
                      </button>
                    </div>

                    {/* Bottom Ad placement below action buttons */}
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <AdBanner id="ad-compare-bottom" size="728x90" />
                    </div>

                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Ad Sidebar */}
          <div className="cmp-sidebar-ad right-ad">
            <AdBanner size="160x600" id="ad-sidebar-right-1" />
            <AdBanner size="160x600" id="ad-sidebar-right-2" />
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}