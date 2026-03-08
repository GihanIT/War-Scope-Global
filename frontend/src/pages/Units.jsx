import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { UNITS, BRANCHES, COUNTRIES } from '../data/army-units-db.js';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const Icons = {
  Search:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  List:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Tree:        () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3h4v4h-4zM2 17h4v4H2zM18 17h4v4h-4zM12 7v5M12 12H4v5M12 12h8v5"/></svg>,
  Users:       () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Shield:      () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Target:      () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Check:       () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  --un-bg:          #0a0b0d;
  --un-panel:       rgba(18, 20, 23, 0.85);
  --un-border:      rgba(255, 170, 0, 0.2);
  --un-accent:      #ffaa00;
  --un-accent-dim:  rgba(255, 170, 0, 0.1);
  --un-text:        #e2e4e9;
  --un-muted:       #8b949e;
  --un-dim:         #565d66;
}

/* ── Page shell ── */
.un-page { min-height: 100dvh; background: var(--un-bg); color: var(--un-text); font-family: 'Barlow', sans-serif; position: relative; }
.un-page::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image:
    linear-gradient(rgba(255,170,0,.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,170,0,.02) 1px, transparent 1px);
  background-size: 40px 40px;
}
.un-content { position: relative; z-index: 1; }

/* ── Hero ── */
.un-hero {
  padding: 64px 24px; border-bottom: 1px solid var(--un-border);
  background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(255,170,0,.06) 0%, transparent 70%);
  display: flex; flex-direction: column; align-items: center; text-align: center;
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
}
.un-eyebrow {
  display: inline-flex; align-items: center; gap: 10px;
  font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
  letter-spacing: .18em; color: var(--un-accent); text-transform: uppercase;
  background: var(--un-accent-dim); border: 1px solid rgba(255,170,0,.3);
  border-radius: 4px; padding: 6px 16px; margin-bottom: 24px;
  box-shadow: 0 0 15px rgba(255,170,0,.1);
}
.un-title {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
  font-size: clamp(40px,7vw,80px); letter-spacing: -.01em; line-height: 1;
  color: var(--un-text); margin-bottom: 24px;
  text-shadow: 0 4px 20px rgba(0,0,0,.8); text-transform: uppercase;
}
.un-title span { color: var(--un-accent); text-shadow: 0 0 24px rgba(255,170,0,.3); }

/* ── Sticky filter bar ── */
/* NOTE: NO overflow:hidden here — that's what was clipping the dropdowns */
.un-filters {
  background: rgba(14,16,18,.92);
  border-bottom: 1px solid var(--un-border);
  padding: 14px 40px;
  display: flex; gap: 20px; align-items: center; flex-wrap: wrap;
  position: sticky; top: 60px;
  z-index: 30;                   /* filters bar sits at 30 */
  backdrop-filter: blur(12px);
}
.un-filter-group { display: flex; gap: 10px; align-items: center; }
.un-filter-label {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: .15em; color: var(--un-dim); text-transform: uppercase; white-space: nowrap;
}

/* ── Tactical Dropdown ── */
.tac-dd { position: relative; min-width: 200px; }

.tac-dd-trigger {
  width: 100%;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.1);
  color: var(--un-muted);
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  padding: 9px 12px; border-radius: 4px; cursor: pointer;
  display: flex; justify-content: space-between; align-items: center; gap: 8px;
  transition: border-color 150ms, background 150ms, color 150ms;
  text-transform: uppercase; letter-spacing: .1em;
  user-select: none;
}
.tac-dd-trigger:hover {
  border-color: rgba(255,170,0,.4);
  background: rgba(255,170,0,.05);
  color: var(--un-text);
}
.tac-dd-trigger[aria-expanded="true"] {
  border-color: var(--un-accent);
  background: rgba(255,170,0,.08);
  color: var(--un-accent);
}

.tac-dd-label { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; overflow: hidden; }
.tac-dd-label-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.tac-dd-icon {
  display: flex; flex-shrink: 0;
  opacity: .6;
  transition: transform 200ms ease, opacity 200ms;
}
.tac-dd-trigger[aria-expanded="true"] .tac-dd-icon {
  transform: rotate(180deg);
  opacity: 1;
}

/* ── Portal menu — rendered into <body>, never clipped ── */
.tac-dd-menu {
  position: fixed;          /* fixed so sticky parent can't clip it */
  background: #0e1014;
  border: 1px solid var(--un-border);
  border-radius: 6px;
  z-index: 9999;            /* always on top */
  max-height: 280px;
  overflow-y: auto;
  box-shadow: 0 12px 40px rgba(0,0,0,.85), 0 0 0 1px rgba(255,170,0,.05);
  scrollbar-width: thin;
  scrollbar-color: rgba(255,170,0,.3) transparent;
  animation: ddFadeIn 120ms ease;
}
@keyframes ddFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.tac-dd-item {
  padding: 10px 14px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500;
  color: var(--un-muted); cursor: pointer;
  transition: background 120ms, color 120ms, padding-left 120ms;
  text-transform: uppercase; letter-spacing: .1em;
  border-bottom: 1px solid rgba(255,255,255,.04);
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.tac-dd-item:last-child { border-bottom: none; }
.tac-dd-item:hover { background: rgba(255,170,0,.07); color: var(--un-text); padding-left: 18px; }
.tac-dd-item.active {
  background: rgba(255,170,0,.12);
  color: var(--un-accent);
  border-left: 2px solid var(--un-accent);
  padding-left: 12px;
}
.tac-dd-item-inner { display: flex; align-items: center; gap: 8px; }

/* ── Search ── */
.un-search-wrap { position: relative; margin-left: auto; }
.un-search {
  background: rgba(0,0,0,.4); border: 1px solid var(--un-border);
  border-radius: 6px; padding: 9px 16px 9px 36px;
  color: var(--un-text); font-family: 'IBM Plex Mono', monospace; font-size: 13px;
  outline: none; width: 240px; transition: border-color 200ms, box-shadow 200ms, width 200ms;
}
.un-search::placeholder { color: var(--un-dim); }
.un-search:focus { border-color: var(--un-accent); box-shadow: 0 0 12px rgba(255,170,0,.18); width: 280px; }
.un-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--un-accent); pointer-events: none; opacity: .8; }

/* ── View toggles ── */
.un-view-toggles {
  display: flex; gap: 8px;
  background: rgba(14,16,18,.6); padding: 10px 40px;
  border-bottom: 1px dashed rgba(255,170,0,.1); backdrop-filter: blur(8px);
}
.un-view-btn {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 20px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: .1em; color: var(--un-muted);
  background: transparent; border: 1px solid transparent;
  border-radius: 4px; cursor: pointer;
  transition: background 200ms, border-color 200ms, color 200ms, box-shadow 200ms;
  text-transform: uppercase;
}
.un-view-btn.active {
  background: rgba(255,170,0,.08); border-color: rgba(255,170,0,.3);
  color: var(--un-accent); box-shadow: 0 0 12px rgba(255,170,0,.15);
}

/* ── Main container ── */
.un-main { max-width: 1400px; margin: 0 auto; padding: 40px 48px 80px; }

/* ── Grid ── */
.un-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px,1fr)); gap: 24px; }
.un-card {
  background: var(--un-panel); border: 1px solid rgba(255,255,255,.05);
  border-radius: 8px; display: flex; flex-direction: column;
  text-decoration: none; transition: border-color 200ms, transform 200ms, box-shadow 200ms;
  position: relative; overflow: hidden; backdrop-filter: blur(8px);
}
.un-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--b-color); opacity: .9; z-index: 5; }
.un-card:hover { border-color: rgba(255,170,0,.3); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,.5); }

.un-card-img { height: 160px; position: relative; border-bottom: 1px solid rgba(255,255,255,.05); overflow: hidden; }
.un-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 400ms ease, filter 400ms ease; filter: sepia(.8) hue-rotate(30deg) saturate(2) brightness(.6); }
.un-card:hover .un-card-img img { transform: scale(1.05); filter: sepia(.5) hue-rotate(30deg) saturate(1.5) brightness(.8); }
.un-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(18,20,23,1) 0%, rgba(18,20,23,0) 100%); pointer-events: none; }

.un-card-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
.un-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.un-card-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 22px; color: var(--un-text); line-height: 1.1; margin-bottom: 4px; letter-spacing: .01em; }
.un-card-native { font-size: 13px; color: var(--un-muted); font-style: italic; }

.un-card-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.un-card-badge { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 3px; letter-spacing: .1em; border: 1px solid; text-transform: uppercase; }

.un-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,.1); font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--un-dim); font-weight: 600; }

/* ── Tree ── */
.un-tree-container { background: var(--un-panel); border: 1px solid rgba(255,255,255,.05); border-radius: 8px; padding: 32px; backdrop-filter: blur(8px); box-shadow: 0 8px 32px rgba(0,0,0,.5); }
.un-tree-node { position: relative; padding-left: 24px; margin-bottom: 8px; }
.un-tree-node::before { content: ''; position: absolute; left: 0; top: 18px; bottom: -8px; width: 1px; border-left: 1px dashed rgba(255,255,255,.2); }
.un-tree-node:last-child::before { display: none; }
.un-tree-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(0,0,0,.4); border: 1px solid rgba(255,255,255,.05); border-radius: 6px; text-decoration: none; transition: border-color 150ms, background 150ms, transform 150ms; position: relative; }
.un-tree-item::after { content: ''; position: absolute; left: -24px; top: 50%; width: 24px; height: 1px; border-top: 1px dashed rgba(255,255,255,.2); }
.un-tree-item:hover { border-color: rgba(255,170,0,.3); background: rgba(255,170,0,.05); transform: translateX(4px); }
.un-tree-name { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 16px; color: var(--un-text); text-transform: uppercase; letter-spacing: .02em; }
.un-tree-branch { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 3px; border: 1px solid; letter-spacing: .1em; text-transform: uppercase; margin-left: auto; }

/* ── Empty state ── */
.un-empty { padding: 80px 24px; text-align: center; background: rgba(255,170,0,.02); border: 1px dashed rgba(255,170,0,.3); border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; font-weight: 600; color: var(--un-muted); letter-spacing: .15em; }

/* ── Responsive ── */
@media (max-width: 1024px) {
  .un-hero { padding: 48px 24px; }
  .un-main { padding: 32px 24px 64px; }
}
@media (max-width: 768px) {
  .un-filters { padding: 14px 20px; gap: 12px; flex-direction: column; align-items: stretch; }
  .un-filter-group { flex-direction: column; align-items: stretch; }
  .tac-dd { width: 100%; min-width: 0; }
  .un-search-wrap { width: 100%; margin-left: 0; }
  .un-search { width: 100% !important; }
  .un-view-toggles { padding: 10px 20px; }
  .un-grid { grid-template-columns: 1fr; }
  .un-main { padding: 24px 16px 48px; }
}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

// ─── Portal Tactical Dropdown ─────────────────────────────────────────────────
// Renders the menu via a React portal directly into <body> so that:
//  • position:sticky on the filter bar never creates a clipping context
//  • z-index battles between layers are avoided entirely
//  • The dropdown always appears above every other element on the page
function TacticalDropdown({ label, options, value, onChange }) {
  const [isOpen, setIsOpen]   = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef(null);

  // Recompute menu position each time it opens (or on scroll/resize while open)
  const updatePos = useCallback(() => {
    if (!triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    setMenuPos({ top: r.bottom + 4, left: r.left, width: r.width });
  }, []);

  const open = useCallback(() => {
    updatePos();
    setIsOpen(true);
  }, [updatePos]);

  const close = useCallback(() => setIsOpen(false), []);

  const toggle = useCallback(() => (isOpen ? close() : open()), [isOpen, open, close]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e) => {
      if (triggerRef.current && triggerRef.current.contains(e.target)) return;
      // check if click is inside the portal menu
      const menu = document.getElementById('tac-dd-portal-menu');
      if (menu && menu.contains(e.target)) return;
      close();
    };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onScroll = () => { updatePos(); };

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
      id="tac-dd-portal-menu"
      className="tac-dd-menu"
      style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
    >
      {/* "All" option */}
      <div
        className={`tac-dd-item ${value === '' ? 'active' : ''}`}
        onMouseDown={(e) => { e.preventDefault(); onChange(''); close(); }}
      >
        <span className="tac-dd-item-inner">{label}</span>
        {value === '' && <Icons.Check />}
      </div>

      {options.map(opt => (
        <div
          key={opt.value}
          className={`tac-dd-item ${value === opt.value ? 'active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onChange(opt.value); close(); }}
        >
          <span className="tac-dd-item-inner">
            {opt.icon && <span>{opt.icon}</span>}
            {opt.label}
          </span>
          {value === opt.value && <Icons.Check />}
        </div>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className="tac-dd">
      <button
        ref={triggerRef}
        className="tac-dd-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggle}
        type="button"
      >
        <span className="tac-dd-label">
          {selectedOpt ? (
            <>
              {selectedOpt.icon && <span aria-hidden="true">{selectedOpt.icon}</span>}
              <span className="tac-dd-label-text">{selectedOpt.label}</span>
            </>
          ) : (
            <span className="tac-dd-label-text">{label}</span>
          )}
        </span>
        <span className="tac-dd-icon" aria-hidden="true"><Icons.ChevronDown /></span>
      </button>
      {menu}
    </div>
  );
}

// ─── Tree Node ────────────────────────────────────────────────────────────────
function UnitTreeNode({ unit, allUnits }) {
  const children = allUnits.filter(u => u.parentId === unit.id);
  const br = BRANCHES[unit.branch] || BRANCHES.army;
  return (
    <div className="un-tree-node">
      <Link to={`/units/${unit.id}`} className="un-tree-item">
        <div style={{ color: br.color, display: 'flex' }}><Icons.Target /></div>
        <div className="un-tree-name">{unit.name}</div>
        <div className="un-tree-branch" style={{ color: br.color, borderColor: `${br.color}55`, background: `${br.color}15` }}>{br.label}</div>
      </Link>
      {children.length > 0 && (
        <div style={{ paddingLeft: 12, marginTop: 8 }}>
          {children.map(child => <UnitTreeNode key={child.id} unit={child} allUnits={allUnits} />)}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UnitsDir() {
  injectCSS('un-css', CSS);

  const [country, setCountry] = useState('');
  const [branch,  setBranch]  = useState('');
  const [search,  setSearch]  = useState('');
  const [view,    setView]    = useState('grid');

  const filtered = useMemo(() => {
    let d = UNITS;
    if (country) d = d.filter(u => u.country === country);
    if (branch)  d = d.filter(u => u.branch  === branch);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q)
      );
    }
    return d;
  }, [country, branch, search]);

  // Root nodes: units whose parent is not in the current filtered set
  const rootNodes = useMemo(() =>
    filtered.filter(u => !u.parentId || !filtered.find(p => p.id === u.parentId)),
    [filtered]
  );

  const countryOptions = Object.keys(COUNTRIES).map(name => ({
    value: name,
    label: name.toUpperCase(),
    icon:  COUNTRIES[name].flag,
  }));

  const branchOptions = Object.entries(BRANCHES).map(([k, v]) => ({
    value: k,
    label: v.label.toUpperCase(),
  }));

  return (
    <div className="un-page">
      <div className="un-content">
        <Navbar />

        {/* Hero */}
        <div className="un-hero">
          <div className="un-eyebrow"><Icons.Shield /> GLOBAL ORBAT DATABASE</div>
          <h1 className="un-title">COMMAND &amp; CONTROL<br /><span>UNIT DIRECTORY</span></h1>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '32px 0 0', display: 'flex', justifyContent: 'center' }}>
            <AdBanner id="ad-units-top" size="728x90" />
          </div>
        )}

        {/* Filters */}
        <div className="un-filters">
          <div className="un-filter-group">
            <span className="un-filter-label">NATION:</span>
            <TacticalDropdown
              label="ALL NATIONS"
              options={countryOptions}
              value={country}
              onChange={setCountry}
            />
          </div>

          <div className="un-filter-group">
            <span className="un-filter-label">BRANCH:</span>
            <TacticalDropdown
              label="ALL BRANCHES"
              options={branchOptions}
              value={branch}
              onChange={setBranch}
            />
          </div>

          <div className="un-search-wrap">
            <span className="un-search-icon"><Icons.Search /></span>
            <input
              className="un-search"
              placeholder="> QUERY UNIT..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* View toggles */}
        <div className="un-view-toggles">
          <button className={`un-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
            <Icons.List /> DOSSIER GRID
          </button>
          <button className={`un-view-btn ${view === 'tree' ? 'active' : ''}`} onClick={() => setView('tree')}>
            <Icons.Tree /> HIERARCHY TREE
          </button>
        </div>

        {/* Content */}
        <div className="un-main">
          {filtered.length === 0 ? (
            <div className="un-empty">[ ERR: NO UNITS MATCH PARAMETERS ]</div>
          ) : view === 'grid' ? (
            <div className="un-grid">
              {filtered.map(u => {
                const br  = BRANCHES[u.branch] || BRANCHES.army;
                const img = u.image || 'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=600&q=80';
                return (
                  <Link key={u.id} to={`/units/${u.id}`} className="un-card" style={{ '--b-color': br.color }}>
                    <div className="un-card-img">
                      <img src={img} alt={u.name} loading="lazy" />
                      <div className="un-card-overlay" />
                    </div>
                    <div className="un-card-body">
                      <div className="un-card-top">
                        <div>
                          <div className="un-card-name">{u.name.toUpperCase()}</div>
                          {u.nativeName && <div className="un-card-native">{u.nativeName}</div>}
                        </div>
                      </div>
                      <div className="un-card-meta">
                        <span className="un-card-badge" style={{ borderColor: 'rgba(255,255,255,.1)', color: 'var(--un-muted)' }}>
                          {COUNTRIES[u.country]?.flag} {u.country}
                        </span>
                        <span className="un-card-badge" style={{ color: br.color, borderColor: `${br.color}55`, background: `${br.color}15` }}>
                          {br.label}
                        </span>
                        <span className="un-card-badge" style={{
                          color:        u.status === 'Active' ? '#00ff88' : '#8892a4',
                          borderColor:  u.status === 'Active' ? 'rgba(0,255,136,.3)' : 'rgba(255,255,255,.1)',
                        }}>
                          {u.status}
                        </span>
                      </div>
                      <div className="un-card-footer">
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Icons.Users /> {u.strength}</span>
                        <span>EST. {u.founded}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="un-tree-container">
              {rootNodes.map(root => <UnitTreeNode key={root.id} unit={root} allUnits={filtered} />)}
            </div>
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