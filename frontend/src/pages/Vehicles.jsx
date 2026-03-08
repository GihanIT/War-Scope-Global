import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { VEHICLES, CATEGORIES, COUNTRIES } from '../data/vehicles-data.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getIso2 = (countryName) => {
  const map = {
    'USA': 'us', 'United States': 'us',
    'Russia': 'ru', 'Russian Federation': 'ru',
    'China': 'cn', 'PRC': 'cn',
    'UK': 'gb', 'United Kingdom': 'gb',
    'France': 'fr', 'Germany': 'de',
    'Israel': 'il', 'India': 'in',
    'Turkey': 'tr', 'South Korea': 'kr',
    'Japan': 'jp', 'Italy': 'it',
    'Ukraine': 'ua', 'Iran': 'ir', 'North Korea': 'kp',
  };
  return map[countryName] || 'un';
};

const getCatImage = (catName) => {
  const str = (catName || '').toLowerCase();
  if (str.includes('air'))                                                    return 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=400&q=80';
  if (str.includes('armor') || str.includes('tank') || str.includes('land')) return 'https://images.unsplash.com/photo-1632292220916-c92a7c062c3f?auto=format&fit=crop&w=400&q=80';
  if (str.includes('sea')   || str.includes('nav'))                           return 'https://images.unsplash.com/photo-1590458632646-0b1a01798319?auto=format&fit=crop&w=400&q=80';
  if (str.includes('missil') || str.includes('artillery') || str.includes('defense') || str.includes('strategic')) return 'https://images.unsplash.com/photo-1612044810777-6ea71d604b34?auto=format&fit=crop&w=400&q=80';
  return 'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=400&q=80';
};

function hexToRgb(hex) {
  if (!hex) return '255,255,255';
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r}, ${g}, ${b}`;
}

const STATUS_STYLE = {
  'Active':      { color:'#00ff88', border:'rgba(0,255,136,0.4)',  bg:'rgba(0,255,136,0.1)'  },
  'Reserve':     { color:'#ffaa00', border:'rgba(255,170,0,0.4)',  bg:'rgba(255,170,0,0.1)'  },
  'Retired':     { color:'#8892a4', border:'rgba(136,146,164,0.4)',bg:'rgba(136,146,164,0.1)'},
  'Development': { color:'#00d4ff', border:'rgba(0,212,255,0.4)',  bg:'rgba(0,212,255,0.1)'  },
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Search:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Shield:      () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Users:       () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Globe:       () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Check:       () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  --vl-bg:      #050508;
  --vl-panel:   rgba(10, 12, 20, 0.85);
  --vl-border:  rgba(0, 212, 255, 0.15);
  --vl-accent:  #00d4ff;
  --vl-text:    #e8eaf0;
  --vl-muted:   #8892a4;
  --vl-dim:     #4a5568;
}

.vl-page-wrapper {
  min-height: 100dvh; background: var(--vl-bg); color: var(--vl-text);
  font-family: 'Barlow', sans-serif; position: relative; overflow-x: hidden;
}
.vl-page-wrapper::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(0,212,255,.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,212,255,.03) 1px, transparent 1px);
  background-size: 40px 40px;
}
.vl-content-layer { position: relative; z-index: 1; }

/* ── Hero ── */
.vl-hero {
  position: relative; padding: 64px 24px; border-bottom: 1px solid rgba(0,212,255,.2);
  background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(0,212,255,.1) 0%, transparent 70%);
  display: flex; flex-direction: column; align-items: center; text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
}
.vl-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
  letter-spacing: .18em; color: var(--vl-accent); text-transform: uppercase;
  background: rgba(0,212,255,.1); border: 1px solid rgba(0,212,255,.3);
  border-radius: 4px; padding: 6px 16px; margin-bottom: 24px;
  box-shadow: 0 0 15px rgba(0,212,255,.15);
}
.vl-title {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
  font-size: clamp(48px,8vw,88px); letter-spacing: -.01em; line-height: 1;
  color: var(--vl-text); margin-bottom: 24px; text-shadow: 0 4px 20px rgba(0,0,0,.8);
}
.vl-title em { color: var(--vl-accent); font-style: normal; text-shadow: 0 0 24px rgba(0,212,255,.4); }
.vl-hero-stats {
  display: flex; gap: 0; border: 1px solid rgba(0,212,255,.2);
  border-radius: 8px; width: 100%; max-width: 800px; overflow: hidden;
  background: rgba(10,12,20,.85); backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
}
.vl-hstat { flex: 1; padding: 20px 16px; text-align: center; border-right: 1px solid rgba(0,212,255,.15); }
.vl-hstat:last-child { border-right: none; }
.vl-hstat-val { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 28px; font-weight: 600; color: var(--vl-accent); text-shadow: 0 0 12px rgba(0,212,255,.3); margin-bottom: 6px; }
.vl-hstat-label { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: .15em; color: var(--vl-muted); text-transform: uppercase; }

/* ── Sticky filters — NO overflow:hidden (clips portal menus) ── */
.vl-filters {
  background: rgba(10,12,20,.92); border-bottom: 1px solid var(--vl-border);
  padding: 14px 40px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
  position: sticky; top: 60px; z-index: 30; backdrop-filter: blur(12px);
}
.vl-filter-group { display: flex; gap: 10px; align-items: center; }
.vl-filter-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: .15em; color: var(--vl-dim); text-transform: uppercase; white-space: nowrap;
}

/* ── Tactical Dropdown (cyan variant) ── */
.tac-dd-vl { position: relative; min-width: 200px; }

.tac-dd-vl-trigger {
  width: 100%;
  background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.1);
  color: var(--vl-muted); font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  padding: 9px 12px; border-radius: 4px; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  transition: border-color 150ms, background 150ms, color 150ms;
  text-transform: uppercase; letter-spacing: .1em; user-select: none;
}
.tac-dd-vl-trigger:hover { border-color: rgba(0,212,255,.4); background: rgba(0,212,255,.05); color: var(--vl-text); }
.tac-dd-vl-trigger[aria-expanded="true"] { border-color: var(--vl-accent); background: rgba(0,212,255,.08); color: var(--vl-accent); }

.tac-dd-vl-label { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; overflow: hidden; }
.tac-dd-vl-label-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tac-dd-vl-icon { display: flex; flex-shrink: 0; opacity: .6; transition: transform 200ms ease, opacity 200ms; }
.tac-dd-vl-trigger[aria-expanded="true"] .tac-dd-vl-icon { transform: rotate(180deg); opacity: 1; }

/* Portal menu */
.tac-dd-vl-menu {
  position: fixed;
  background: #060810; border: 1px solid rgba(0,212,255,.25);
  border-radius: 6px; z-index: 9999;
  max-height: 300px; overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0,0,0,.9), 0 0 0 1px rgba(0,212,255,.05);
  scrollbar-width: thin; scrollbar-color: rgba(0,212,255,.3) transparent;
  animation: vlDdFade 120ms ease;
}
@keyframes vlDdFade {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}
.tac-dd-vl-item {
  padding: 10px 14px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
  color: var(--vl-muted); cursor: pointer;
  transition: background 120ms, color 120ms, padding-left 120ms;
  text-transform: uppercase; letter-spacing: .1em;
  border-bottom: 1px solid rgba(255,255,255,.04);
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.tac-dd-vl-item:last-child { border-bottom: none; }
.tac-dd-vl-item:hover { background: rgba(0,212,255,.07); color: var(--vl-text); padding-left: 18px; }
.tac-dd-vl-item.active { background: rgba(0,212,255,.12); color: var(--vl-accent); border-left: 2px solid var(--vl-accent); padding-left: 12px; }
.tac-dd-vl-item-inner { display: flex; align-items: center; gap: 8px; }

/* ── Search ── */
.vl-search-wrap { position: relative; margin-left: auto; }
.vl-search {
  background: rgba(5,5,8,.8); border: 1px solid rgba(0,212,255,.2);
  border-radius: 6px; padding: 9px 16px 9px 36px; color: var(--vl-text);
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none;
  width: 240px; transition: border-color 200ms, box-shadow 200ms, width 200ms;
  box-shadow: inset 0 0 10px rgba(0,0,0,.5);
}
.vl-search::placeholder { color: var(--vl-dim); letter-spacing: .05em; }
.vl-search:focus { border-color: var(--vl-accent); box-shadow: 0 0 12px rgba(0,212,255,.25); width: 280px; }
.vl-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--vl-accent); pointer-events: none; opacity: .8; }
.vl-result-count { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: var(--vl-muted); white-space: nowrap; }

/* ── Main ── */
.vl-main { max-width: 1400px; margin: 0 auto; padding: 40px 48px 80px; }

.vl-section-head {
  display: flex; align-items: center; gap: 16px; margin-bottom: 24px; margin-top: 48px;
  padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,.1);
}
.vl-section-head:first-child { margin-top: 0; }
.vl-section-icon { width: 48px; height: 32px; border-radius: 4px; overflow: hidden; border: 1px solid var(--sec-color); opacity: .9; }
.vl-section-icon img { width: 100%; height: 100%; object-fit: cover; }
.vl-section-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 28px; color: var(--vl-text); letter-spacing: .02em; text-transform: uppercase; }
.vl-section-count { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: var(--sec-color); margin-left: auto; letter-spacing: .1em; background: rgba(255,255,255,.05); padding: 4px 12px; border-radius: 4px; }

.vl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap: 24px; margin-bottom: 16px; }

/* ── Card ── */
.vl-card {
  background: var(--vl-panel); border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px; overflow: hidden; transition: border-color 200ms, transform 200ms, box-shadow 200ms;
  text-decoration: none; display: flex; flex-direction: column; position: relative;
  backdrop-filter: blur(8px);
}
.vl-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--cat-color); opacity: .9; z-index: 5; }
.vl-card:hover { border-color: rgba(0,212,255,.4); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,.5); }

.vl-card-img { height: 180px; display: flex; align-items: center; justify-content: center; border-bottom: 1px solid rgba(255,255,255,.05); position: relative; overflow: hidden; }
.vl-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 400ms ease; }
.vl-card:hover .vl-card-img img { transform: scale(1.05); }
.vl-card-img-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,5,8,1) 0%, rgba(5,5,8,0) 100%); pointer-events: none; }
.vl-card-status {
  position: absolute; top: 12px; right: 12px;
  font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
  letter-spacing: .1em; padding: 4px 10px; border-radius: 4px; border: 1px solid;
  text-transform: uppercase; z-index: 2; box-shadow: 0 4px 12px rgba(0,0,0,.5);
  backdrop-filter: blur(4px);
}
.vl-card-body { padding: 20px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
.vl-card-country { display: flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: var(--vl-accent); letter-spacing: .1em; text-transform: uppercase; }
.vl-card-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 24px; color: var(--vl-text); line-height: 1.1; letter-spacing: .01em; }
.vl-card-desig { font-size: 14px; color: var(--vl-muted); line-height: 1.5; margin-top: 2px; }
.vl-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,.1); }
.vl-card-year  { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: var(--vl-dim); display: flex; align-items: center; gap: 6px; }
.vl-card-crew  { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: var(--vl-dim); display: flex; align-items: center; gap: 6px; }

.vl-empty { padding: 100px 24px; text-align: center; background: rgba(0,212,255,.02); border: 1px dashed rgba(0,212,255,.3); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 600; color: var(--vl-muted); letter-spacing: .15em; line-height: 2; text-transform: uppercase; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .vl-hero { padding: 48px 24px 32px; }
  .vl-main { padding: 32px 24px 64px; }
}
@media (max-width: 768px) {
  .vl-filters { padding: 14px 20px; gap: 12px; flex-direction: column; align-items: stretch; }
  .vl-filter-group { flex-direction: column; align-items: stretch; }
  .tac-dd-vl { width: 100%; min-width: 0; }
  .vl-search-wrap { width: 100%; margin-left: 0; }
  .vl-search { width: 100% !important; }
  .vl-hero-stats { flex-wrap: wrap; }
  .vl-hstat { min-width: 50%; border-bottom: 1px solid rgba(0,212,255,.1); }
  .vl-grid { grid-template-columns: 1fr; }
  .vl-main { padding: 24px 16px 48px; }
}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

// ─── Portal Tactical Dropdown ─────────────────────────────────────────────────
function TacticalDropdown({ label, options, value, onChange }) {
  const [isOpen,  setIsOpen]  = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);
  const portalId   = useRef(`tac-dd-vl-${Math.random().toString(36).slice(2)}`);

  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  const open   = useCallback(() => { updatePos(); setIsOpen(true);  }, [updatePos]);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => (isOpen ? close() : open()), [isOpen, open, close]);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (document.getElementById(portalId.current)?.contains(e.target)) return;
      close();
    };
    const onKey    = (e) => { if (e.key === 'Escape') close(); };
    const onScroll = ()  => updatePos();

    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown',   onKey);
    window.addEventListener('scroll',      onScroll, true);
    window.addEventListener('resize',      updatePos);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown',   onKey);
      window.removeEventListener('scroll',      onScroll, true);
      window.removeEventListener('resize',      updatePos);
    };
  }, [isOpen, close, updatePos]);

  const selectedOpt = options.find(o => o.value === value);

  const menu = isOpen ? createPortal(
    <div
      id={portalId.current}
      className="tac-dd-vl-menu"
      style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
    >
      {/* "All" reset option */}
      <div
        className={`tac-dd-vl-item ${value == null ? 'active' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); onChange(null); close(); }}
      >
        <span className="tac-dd-vl-item-inner">{label}</span>
        {value == null && <Icons.Check />}
      </div>

      {options.map(opt => (
        <div
          key={opt.value}
          className={`tac-dd-vl-item ${value === opt.value ? 'active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); close(); }}
        >
          <span className="tac-dd-vl-item-inner">
            {opt.icon && <span aria-hidden="true">{opt.icon}</span>}
            {opt.label}
          </span>
          {value === opt.value && <Icons.Check />}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className="tac-dd-vl">
      <button
        ref={triggerRef}
        className="tac-dd-vl-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggle}
        type="button"
      >
        <span className="tac-dd-vl-label">
          {selectedOpt ? (
            <>
              {selectedOpt.icon && <span aria-hidden="true">{selectedOpt.icon}</span>}
              <span className="tac-dd-vl-label-text">{selectedOpt.label}</span>
            </>
          ) : (
            <span className="tac-dd-vl-label-text">{label}</span>
          )}
        </span>
        <span className="tac-dd-vl-icon" aria-hidden="true"><Icons.ChevronDown /></span>
      </button>
      {menu}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Vehicles() {
  injectCSS('vl-css', CSS);

  const [country,  setCountry]  = useState(null);
  const [category, setCategory] = useState(null);
  const [search,   setSearch]   = useState('');

  const filtered = useMemo(() => {
    let d = VEHICLES;
    if (country)  d = d.filter(v => v.country  === country);
    if (category) d = d.filter(v => v.category === category);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.designation.toLowerCase().includes(q) ||
        v.country.toLowerCase().includes(q)
      );
    }
    return d;
  }, [country, category, search]);

  const grouped = useMemo(() => {
    const g = {};
    filtered.forEach(v => { if (!g[v.category]) g[v.category] = []; g[v.category].push(v); });
    return g;
  }, [filtered]);

  const countryCounts = useMemo(() => {
    const c = {};
    VEHICLES.forEach(v => { c[v.country] = (c[v.country] ?? 0) + 1; });
    return c;
  }, []);

  // Dropdown option arrays
  const countryOptions = Object.keys(COUNTRIES).map(name => ({
    value: name,
    label: `${name} [${countryCounts[name] ?? 0}]`,
    icon: (
      <img
        src={`https://flagcdn.com/w40/${getIso2(name)}.png`}
        alt={name}
        style={{ width: 20, height: 14, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}
      />
    ),
  }));

  const categoryOptions = Object.entries(CATEGORIES).map(([k, v]) => ({
    value: k,
    label: v.label,
  }));

  return (
    <div className="vl-page-wrapper">
      <div className="vl-content-layer">
        <Navbar />

        {/* Hero */}
        <div className="vl-hero">
          <div className="vl-eyebrow"><Icons.Shield /> HARDWARE &amp; SYSTEMS DB</div>
          <h1 className="vl-title">MILITARY<br /><em>VEHICLE INTEL</em></h1>
          <div className="vl-hero-stats">
            {[
              { val: VEHICLES.length,                                    label: 'LOGGED VEHICLES'   },
              { val: Object.keys(COUNTRIES).length,                      label: 'NATIONS'           },
              { val: Object.keys(CATEGORIES).length,                     label: 'CLASSES'           },
              { val: VEHICLES.filter(v => v.status === 'Active').length, label: 'ACTIVE DEPLOYMENT' },
            ].map(s => (
              <div key={s.label} className="vl-hstat">
                <span className="vl-hstat-val">{s.val}</span>
                <span className="vl-hstat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '32px 0 0', display: 'flex', justifyContent: 'center' }}>
            <AdBanner id="ad-vehicles-top" size="728x90" />
          </div>
        )}

        {/* Filters */}
        <div className="vl-filters">
          <div className="vl-filter-group">
            <span className="vl-filter-label">NATION:</span>
            <TacticalDropdown
              label="ALL NATIONS"
              options={countryOptions}
              value={country}
              onChange={setCountry}
            />
          </div>

          <div className="vl-filter-group">
            <span className="vl-filter-label">ASSET CLASS:</span>
            <TacticalDropdown
              label="ALL CLASSES"
              options={categoryOptions}
              value={category}
              onChange={setCategory}
            />
          </div>

          <div className="vl-search-wrap">
            <span className="vl-search-icon"><Icons.Search /></span>
            <input
              className="vl-search"
              placeholder="> QUERY PLATFORM..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <span className="vl-result-count">[{filtered.length} MATCHES]</span>
        </div>

        {/* Main grid */}
        <div className="vl-main">
          {filtered.length === 0 ? (
            <div className="vl-empty">[ ERR: NO HARDWARE MATCHES CURRENT PARAMETERS ]<br />ADJUST SEARCH OR FILTERS</div>
          ) : (
            Object.entries(CATEGORIES).map(([catKey, catCfg]) => {
              const vehicles = grouped[catKey];
              if (!vehicles?.length) return null;
              const catImg = getCatImage(catCfg.label);

              return (
                <div key={catKey}>
                  <div className="vl-section-head" style={{ '--sec-color': catCfg.color || '#00d4ff' }}>
                    <div className="vl-section-icon">
                      <img
                        src={catImg}
                        alt={catCfg.label}
                        style={{ filter: `sepia(1) hue-rotate(${catCfg.label.includes('Air') ? 180 : catCfg.label.includes('Armor') ? 320 : 0}deg) saturate(3) brightness(0.7)` }}
                      />
                    </div>
                    <span className="vl-section-title">{catCfg.label}</span>
                    <span className="vl-section-count">{vehicles.length} PLATFORMS</span>
                  </div>

                  <div className="vl-grid">
                    {vehicles.map(v => {
                      const st       = STATUS_STYLE[v.status] ?? STATUS_STYLE.Active;
                      const thumbUrl = v.image || getCatImage(v.category);

                      return (
                        <Link key={v.id} to={`/vehicles/${v.id}`} className="vl-card" style={{ '--cat-color': catCfg.color || '#00d4ff' }}>
                          <div className="vl-card-img">
                            <img src={thumbUrl} alt={v.name} loading="lazy" />
                            <div className="vl-card-img-overlay" />
                            <div className="vl-card-status" style={{ color: st.color, borderColor: st.border, background: st.bg }}>
                              {v.status}
                            </div>
                          </div>

                          <div className="vl-card-body">
                            <div className="vl-card-country">
                              <img
                                src={`https://flagcdn.com/w40/${getIso2(v.country)}.png`}
                                alt={v.country}
                                style={{ width: 16, height: 11, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(255,255,255,0.2)' }}
                              />
                              {v.country}
                            </div>
                            <div className="vl-card-name">{v.name.toUpperCase()}</div>
                            <div className="vl-card-desig">{v.designation}</div>
                            <div className="vl-card-footer">
                              <span className="vl-card-year">{v.year ? `LOG: ${v.year}` : 'LOG: CLASSIFIED'}</span>
                              <span className="vl-card-crew">
                                <Icons.Users /> {v.crew === 0 ? 'UNMANNED' : v.crew ? `CREW: ${v.crew}` : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })
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