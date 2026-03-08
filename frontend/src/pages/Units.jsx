import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { UNITS, BRANCHES, COUNTRIES } from '../data/army-units-db.js';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  List: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  Tree: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3h4v4h-4zM2 17h4v4H2zM18 17h4v4h-4zM12 7v5M12 12H4v5M12 12h8v5"/></svg>,
  Users: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Shield: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Target: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  /* TACTICAL AMBER THEME */
  --un-bg:      #0a0b0d;
  --un-panel:   rgba(18, 20, 23, 0.85);
  --un-border:  rgba(255, 170, 0, 0.2);
  --un-accent:  #ffaa00;
  --un-accent-dim: rgba(255, 170, 0, 0.1);
  --un-text:    #e2e4e9;
  --un-muted:   #8b949e;
  --un-dim:     #565d66;
}

.un-page { min-height: 100dvh; background: var(--un-bg); color: var(--un-text); font-family: 'Barlow', sans-serif; position: relative; }
.un-page::before {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-image: linear-gradient(rgba(255, 170, 0, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 170, 0, 0.02) 1px, transparent 1px);
  background-size: 40px 40px; background-position: center center;
}
.un-content { position: relative; z-index: 1; }

/* Hero */
.un-hero { 
  padding: 64px 24px; border-bottom: 1px solid var(--un-border); 
  background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(255,170,0,0.06) 0%, transparent 70%); 
  display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.5); 
}
.un-eyebrow { 
  display: inline-flex; align-items: center; gap: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.18em; 
  color: var(--un-accent); text-transform: uppercase; background: var(--un-accent-dim); border: 1px solid rgba(255,170,0,0.3); border-radius: 4px; padding: 6px 16px; margin-bottom: 24px; 
  box-shadow: 0 0 15px rgba(255,170,0,0.1);
}
.un-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: clamp(40px, 7vw, 80px); letter-spacing: -0.01em; line-height: 1; color: var(--un-text); margin-bottom: 24px; text-shadow: 0 4px 20px rgba(0,0,0,0.8); text-transform: uppercase; }
.un-title span { color: var(--un-accent); text-shadow: 0 0 24px rgba(255,170,0,0.3); }

/* Filters */
.un-filters { background: rgba(14, 16, 18, 0.8); border-bottom: 1px solid var(--un-border); padding: 16px 40px; display: flex; gap: 24px; align-items: center; flex-wrap: wrap; position: sticky; top: 60px; z-index: 30; backdrop-filter: blur(12px); }
.un-filter-group { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.un-filter-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; color: var(--un-dim); text-transform: uppercase; }
.un-pill { padding: 6px 14px; border-radius: 4px; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500; color: var(--un-muted); letter-spacing: 0.08em; transition: all 200ms ease; text-transform: uppercase; }
.un-pill:hover { border-color: rgba(255,255,255,0.2); color: var(--un-text); background: rgba(255,255,255,0.05); }
.un-pill.active { color: #050508; background: var(--un-accent); border-color: var(--un-accent); font-weight: 600; box-shadow: 0 0 15px rgba(255,170,0,0.3); }
.un-search-wrap { position: relative; margin-left: auto; }
.un-search { background: rgba(0,0,0,0.4); border: 1px solid var(--un-border); border-radius: 6px; padding: 10px 16px 10px 36px; color: var(--un-text); font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none; width: 240px; transition: all 200ms ease; }
.un-search:focus { border-color: var(--un-accent); box-shadow: 0 0 12px rgba(255,170,0,0.2); width: 280px; }
.un-search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--un-accent); pointer-events: none; opacity: 0.8; }

/* View Toggles */
.un-view-toggles { display: flex; gap: 8px; background: rgba(14,16,18,0.6); padding: 12px 40px; border-bottom: 1px dashed rgba(255,170,0,0.1); backdrop-filter: blur(8px); }
.un-view-btn { display: flex; align-items: center; gap: 8px; padding: 8px 20px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: var(--un-muted); background: transparent; border: 1px solid transparent; border-radius: 4px; cursor: pointer; transition: all 200ms ease; text-transform: uppercase; }
.un-view-btn.active { background: rgba(255,170,0,0.08); border-color: rgba(255,170,0,0.3); color: var(--un-accent); box-shadow: 0 0 12px rgba(255,170,0,0.15); }

/* Main */
.un-main { max-width: 1400px; margin: 0 auto; padding: 40px 48px 80px; }

/* Grid View */
.un-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
.un-card { background: var(--un-panel); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; display: flex; flex-direction: column; text-decoration: none; transition: all 200ms ease; position: relative; overflow: hidden; backdrop-filter: blur(8px); }
.un-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: var(--b-color); opacity: 0.9; z-index: 5; }
.un-card:hover { border-color: rgba(255,170,0,0.3); transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.5); }

.un-card-img { height: 160px; position: relative; border-bottom: 1px solid rgba(255,255,255,0.05); overflow: hidden; }
.un-card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 400ms ease; filter: sepia(0.8) hue-rotate(30deg) saturate(2) brightness(0.6); }
.un-card:hover .un-card-img img { transform: scale(1.05); filter: sepia(0.5) hue-rotate(30deg) saturate(1.5) brightness(0.8); }
.un-card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(18,20,23,1) 0%, rgba(18,20,23,0) 100%); pointer-events: none; }

.un-card-body { padding: 20px; display: flex; flex-direction: column; flex: 1; }
.un-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.un-card-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 800; font-size: 22px; color: var(--un-text); line-height: 1.1; margin-bottom: 4px; letter-spacing: 0.01em; }
.un-card-native { font-size: 13px; color: var(--un-muted); font-style: italic; }
.un-card-icon { color: var(--b-color); opacity: 0.8; }

.un-card-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.un-card-badge { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; padding: 4px 10px; border-radius: 3px; letter-spacing: 0.1em; border: 1px solid; text-transform: uppercase; }

.un-card-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.1); font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--un-dim); font-weight: 600; }

/* Tree View */
.un-tree-container { background: var(--un-panel); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 32px; backdrop-filter: blur(8px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
.un-tree-node { position: relative; padding-left: 24px; margin-bottom: 8px; }
.un-tree-node::before { content: ''; position: absolute; left: 0; top: 18px; bottom: -8px; width: 1px; border-left: 1px dashed rgba(255,255,255,0.2); }
.un-tree-node:last-child::before { display: none; }
.un-tree-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; text-decoration: none; transition: all 150ms ease; position: relative; }
.un-tree-item::after { content: ''; position: absolute; left: -24px; top: 50%; width: 24px; height: 1px; border-top: 1px dashed rgba(255,255,255,0.2); }
.un-tree-item:hover { border-color: rgba(255,170,0,0.3); background: rgba(255,170,0,0.05); transform: translateX(4px); }
.un-tree-name { font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 16px; color: var(--un-text); text-transform: uppercase; letter-spacing: 0.02em; }
.un-tree-branch { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 3px; border: 1px solid; letter-spacing: 0.1em; text-transform: uppercase; margin-left: auto; }

@media(max-width:1024px) { .un-hero { padding: 48px 24px; } .un-main { padding: 32px 24px 64px; } }
@media(max-width:768px) {
  .un-filters { padding: 16px 24px; gap: 16px; flex-direction: column; align-items: flex-start; }
  .un-search-wrap { width: 100%; margin-left: 0; } .un-search { width: 100%; } .un-search:focus { width: 100%; }
  .un-view-toggles { padding: 12px 24px; }
  .un-grid { grid-template-columns: 1fr; }
}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r}, ${g}, ${b}`;
}

// ─── Tree Recursive Component ─────────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UnitsDir() {
  injectCSS('un-css', CSS);

  const [country, setCountry] = useState(null);
  const [branch, setBranch]   = useState(null);
  const [search, setSearch]   = useState('');
  const [view, setView]       = useState('grid'); // 'grid' | 'tree'

  const filtered = useMemo(() => {
    let d = UNITS;
    if (country) d = d.filter(u => u.country === country);
    if (branch)  d = d.filter(u => u.branch === branch);
    if (search) {
      const q = search.toLowerCase();
      d = d.filter(u => u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q));
    }
    return d;
  }, [country, branch, search]);

  const rootNodes = useMemo(() => {
    return filtered.filter(u => !u.parentId || !filtered.find(p => p.id === u.parentId));
  }, [filtered]);

  return (
    <div className="un-page">
      <div className="un-content">
        <Navbar />

        <div className="un-hero">
          <div className="un-eyebrow"><Icons.Shield /> GLOBAL ORBAT DATABASE</div>
          <h1 className="un-title">COMMAND & CONTROL<br/><span>UNIT DIRECTORY</span></h1>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '32px 0 0', display: 'flex', justifyContent: 'center' }}>
            <AdBanner id="ad-units-top" size="728x90" />
          </div>
        )}

        <div className="un-filters">
          <div className="un-filter-group">
            <span className="un-filter-label">NATION:</span>
            <button className={`un-pill ${!country ? 'active' : ''}`} onClick={() => setCountry(null)}>ALL</button>
            {Object.entries(COUNTRIES).map(([name]) => (
              <button key={name} className={`un-pill ${country===name ? 'active' : ''}`} onClick={() => setCountry(country===name ? null : name)}>
                {name}
              </button>
            ))}
          </div>
          
          <div className="un-filter-group">
            <span className="un-filter-label">BRANCH:</span>
            {Object.entries(BRANCHES).map(([k, v]) => {
              return (
                <button key={k} className={`un-pill ${branch===k ? 'active' : ''}`} onClick={() => setBranch(branch===k ? null : k)}>
                  {v.label}
                </button>
              );
            })}
          </div>

          <div className="un-search-wrap">
            <span className="un-search-icon"><Icons.Search /></span>
            <input className="un-search" placeholder="> QUERY UNIT..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="un-view-toggles">
          <button className={`un-view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}><Icons.List /> DOSSIER GRID</button>
          <button className={`un-view-btn ${view === 'tree' ? 'active' : ''}`} onClick={() => setView('tree')}><Icons.Tree /> HIERARCHY TREE</button>
        </div>

        <div className="un-main">
          {filtered.length === 0 ? (
            <div style={{ padding: '80px 24px', textAlign: 'center', background: 'rgba(255,170,0,0.02)', border: '1px dashed rgba(255,170,0,0.3)', borderRadius: 8, fontFamily: 'IBM Plex Mono', fontSize: 14, fontWeight: 600, color: 'var(--un-muted)', letterSpacing: '0.15em' }}>[ ERR: NO UNITS MATCH PARAMETERS ]</div>
          ) : view === 'grid' ? (
            <div className="un-grid">
              {filtered.map(u => {
                const br = BRANCHES[u.branch] || BRANCHES.army;
                const img = u.image || 'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=600&q=80';
                return (
                  <Link key={u.id} to={`/units/${u.id}`} className="un-card" style={{ '--b-color': br.color }}>
                    <div className="un-card-img">
                      <img src={img} alt={u.name} />
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
                        <span className="un-card-badge" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--un-muted)' }}>{COUNTRIES[u.country]?.flag} {u.country}</span>
                        <span className="un-card-badge" style={{ color: br.color, borderColor: `${br.color}55`, background: `${br.color}15` }}>{br.label}</span>
                        <span className="un-card-badge" style={{ color: u.status==='Active' ? '#00ff88' : '#8892a4', borderColor: u.status==='Active' ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)' }}>{u.status}</span>
                      </div>
                      <div className="un-card-footer">
                        <span style={{ display:'flex', alignItems:'center', gap:6 }}><Icons.Users /> {u.strength}</span>
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