import { useParams, Link } from 'react-router-dom';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { UNITS, BRANCHES, COUNTRIES } from '../data/army-units-db.js';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const Icons = {
  ChevronLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Clipboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  Network: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M12 8v3"/></svg>,
  Crosshair: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>,
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  /* TACTICAL AMBER THEME */
  --ud-bg:      #0a0b0d;
  --ud-panel:   rgba(18, 20, 23, 0.85);
  --ud-border:  rgba(255, 170, 0, 0.2);
  --ud-accent:  #ffaa00;
  --ud-text:    #e2e4e9;
  --ud-muted:   #8b949e;
  --ud-dim:     #565d66;
}

.ud-page-wrapper { 
  min-height: 100dvh; 
  background: var(--ud-bg); 
  color: var(--ud-text); 
  font-family: 'Barlow', sans-serif; 
  position: relative; 
  overflow-x: hidden; 
}

/* Tactical Grid */
.ud-page-wrapper::before { 
  content: ""; position: fixed; inset: 0; 
  background-image: linear-gradient(rgba(255, 170, 0, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 170, 0, 0.02) 1px, transparent 1px); 
  background-size: 40px 40px; background-position: center center; 
  z-index: 0; pointer-events: none; 
}
.ud-content-layer { position: relative; z-index: 1; }

/* ── Hero ── */
.ud-hero { 
  position: relative; padding: 48px 40px 56px; border-bottom: 1px solid var(--ud-border); 
  display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.5); 
  min-height: 400px; justify-content: flex-end;
}
.ud-hero-bg { position: absolute; inset: 0; z-index: 0; }
.ud-hero-bg img { 
  width: 100%; height: 100%; object-fit: cover; 
  filter: sepia(0.6) hue-rotate(15deg) saturate(1.8) brightness(0.35); 
}
.ud-hero-overlay { 
  position: absolute; inset: 0; 
  background: linear-gradient(to right, rgba(10,11,13,0.95) 0%, rgba(10,11,13,0.8) 40%, rgba(10,11,13,0.2) 100%); 
  z-index: 1; 
}

.ud-hero-inner { position: relative; z-index: 2; max-width: 1400px; margin: 0 auto; width: 100%; }

.ud-back { 
  display: inline-flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; 
  font-size: 11px; font-weight: 600; letter-spacing: 0.15em; color: var(--ud-accent); 
  text-decoration: none; text-transform: uppercase; margin-bottom: 40px; transition: all 200ms ease; 
  background: rgba(255,170,0,0.08); padding: 8px 16px; border-radius: 4px; border: 1px solid rgba(255,170,0,0.3); 
}
.ud-back:hover { background: rgba(255,170,0,0.2); box-shadow: 0 0 12px rgba(255,170,0,0.2); color: #fff; }

.ud-meta-row { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; flex-wrap: wrap; }
.ud-country-badge { display: flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; color: var(--ud-text); text-transform: uppercase; background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(4px); }
.ud-badge { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; padding: 6px 12px; border-radius: 4px; border: 1px solid; letter-spacing: 0.1em; text-transform: uppercase; backdrop-filter: blur(4px); }

.ud-name { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: clamp(48px, 6vw, 88px); letter-spacing: -0.01em; line-height: 1; color: #fff; margin-bottom: 12px; text-shadow: 0 4px 16px rgba(0,0,0,0.8); text-transform: uppercase; }
.ud-motto { font-size: 20px; color: #c8ced6; font-style: italic; font-weight: 500; letter-spacing: 0.02em; border-left: 3px solid var(--ud-accent); padding-left: 16px; }

/* ── Body ── */
.ud-body { max-width: 1400px; margin: 0 auto; padding: 48px 40px 80px; }
.ud-layout { display: grid; grid-template-columns: 1fr 400px; gap: 64px; align-items: start; }

/* Sections */
.ud-section { margin-bottom: 48px; }
.ud-section-title { 
  font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 24px; 
  color: var(--ud-text); margin-bottom: 20px; padding-bottom: 12px; 
  border-bottom: 1px solid rgba(255,170,0,0.15); display: flex; align-items: center; gap: 12px; 
  text-transform: uppercase; letter-spacing: 0.02em; 
}
.ud-section-title span { color: var(--ud-accent); display: flex; }
.ud-p { font-size: 16px; color: #cdd6f4; line-height: 1.8; background: var(--ud-panel); padding: 24px; border-left: 4px solid var(--b-color); border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); }

/* Orbat / Chain of command */
.ud-orbat-box { background: var(--ud-panel); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.ud-orbat-label { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; color: var(--ud-dim); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 16px; }
.ud-orbat-link { 
  display: inline-flex; align-items: center; gap: 10px; padding: 16px 20px; 
  background: rgba(255,170,0,0.05); border: 1px solid rgba(255,170,0,0.2); 
  border-radius: 6px; font-family: 'Barlow', sans-serif; font-size: 16px; font-weight: 600; 
  color: #e8eaf0; text-decoration: none; transition: all 200ms ease; 
}
.ud-orbat-link:hover { background: rgba(255,170,0,0.15); border-color: var(--ud-accent); transform: translateX(4px); box-shadow: 0 4px 12px rgba(255,170,0,0.1); }
.ud-sub-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

/* History */
.ud-list { display: flex; flex-direction: column; gap: 12px; }
.ud-list-item { display: flex; align-items: center; gap: 16px; padding: 16px 20px; background: rgba(255,59,59,0.05); border: 1px solid rgba(255,59,59,0.2); border-radius: 6px; font-size: 15px; font-weight: 500; color: #e8eaf0; }
.ud-list-item::before { content: ''; width: 8px; height: 8px; background: #ff3b3b; border-radius: 50%; box-shadow: 0 0 10px #ff3b3b; flex-shrink: 0; }

/* Sidebar */
.ud-sidebar { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px; }
.ud-info-card { background: var(--ud-panel); border: 1px solid var(--ud-border); border-radius: 8px; padding: 28px 24px; backdrop-filter: blur(16px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
.ud-info-card-title { font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; letter-spacing: 0.15em; color: var(--ud-accent); text-transform: uppercase; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid var(--ud-border); display: flex; align-items: center; gap: 8px; }
.ud-info-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 16px; }
.ud-info-row:last-child { border-bottom: none; padding-bottom: 0; }
.ud-info-key { font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 500; color: var(--ud-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.ud-info-val { font-size: 15px; color: var(--ud-text); font-weight: 600; text-align: right; }

@media(max-width:1024px) { .ud-layout { grid-template-columns: 1fr; } .ud-sidebar { position: static; } }
@media(max-width:768px) { .ud-hero { padding: 32px 24px 48px; } .ud-body { padding: 32px 24px 64px; } .ud-sub-grid { grid-template-columns: 1fr; } .ud-name { font-size: 36px; } }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

export default function UnitDetail() {
  injectCSS('ud-css', CSS);
  const { id } = useParams();
  
  const unit = UNITS.find(u => u.id === id);

  if (!unit) return (
    <div className="ud-page-wrapper">
      <Navbar />
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <div style={{ fontFamily:'IBM Plex Mono', fontSize: 100, fontWeight: 700, color: 'rgba(255,170,0,0.2)', margin: '0 auto 24px' }}>404</div>
        <div style={{ fontFamily:'Barlow Condensed', fontSize: 32, fontWeight: 600, color: '#e8eaf0', margin: '0 auto 32px' }}>[ DOSSIER COMPROMISED OR MISSING ]</div>
        <Link to="/units" style={{fontFamily:'IBM Plex Mono',fontSize:13, fontWeight:600, color:'#ffaa00',letterSpacing:'0.15em', textDecoration:'none', border:'1px solid rgba(255,170,0,0.3)', padding:'12px 24px', borderRadius:'4px', background:'rgba(255,170,0,0.05)'}}>
          <Icons.ChevronLeft /> RETURN TO ORBAT DIRECTORY
        </Link>
      </div>
      <Footer />
    </div>
  );

  const br = BRANCHES[unit.branch] || BRANCHES.army;
  const ctry = COUNTRIES[unit.country];
  
  const parentUnit = unit.parentId ? UNITS.find(u => u.id === unit.parentId) : null;
  const subUnits = UNITS.filter(u => u.parentId === unit.id);
  const bgImg = unit.image || 'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=1400&q=80';

  return (
    <div className="ud-page-wrapper" style={{ '--b-color': br.color }}>
      <div className="ud-content-layer">
        <Navbar />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="ud-hero">
          <div className="ud-hero-bg">
            <img src={bgImg} alt={unit.name} />
          </div>
          <div className="ud-hero-overlay" />
          
          <div className="ud-hero-inner">
            <Link to="/units" className="ud-back"><Icons.ChevronLeft /> BACK TO DIRECTORY</Link>
            
            <div className="ud-meta-row">
              <div className="ud-country-badge">
                <span style={{ fontSize: 18 }}>{ctry?.flag}</span> {unit.country}
              </div>
              <div className="ud-badge" style={{ color: br.color, borderColor: `${br.color}55`, background: `${br.color}15` }}>{br.label}</div>
              <div className="ud-badge" style={{ color: unit.status==='Active' ? '#00ff88' : '#8892a4', borderColor: unit.status==='Active' ? 'rgba(0,255,136,0.4)' : 'rgba(255,255,255,0.2)' }}>{unit.status}</div>
            </div>
            
            <div className="ud-name">{unit.name}</div>
            {unit.motto && <div className="ud-motto">"{unit.motto}"</div>}
          </div>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '40px 0 0', display: 'flex', justifyContent: 'center' }}>
            <AdBanner id="ad-unitdetail-top" size="728x90" />
          </div>
        )}

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="ud-body">
          <div className="ud-layout">

            {/* Main column */}
            <div className="ud-main-col">

              <div className="ud-section">
                <div className="ud-section-title"><span><Icons.Clipboard /></span> STRATEGIC OVERVIEW</div>
                <div className="ud-p">{unit.description}</div>
              </div>

              <div className="ud-section">
                <div className="ud-section-title"><span><Icons.Network /></span> CHAIN OF COMMAND</div>
                <div className="ud-orbat-box">
                  {parentUnit && (
                    <div style={{ marginBottom: 32 }}>
                      <div className="ud-orbat-label">REPORTS TO (SUPERIOR COMMAND)</div>
                      <Link to={`/units/${parentUnit.id}`} className="ud-orbat-link">⬆ {parentUnit.name.toUpperCase()}</Link>
                    </div>
                  )}
                  {subUnits.length > 0 && (
                    <div>
                      <div className="ud-orbat-label">SUBORDINATE ELEMENTS</div>
                      <div className="ud-sub-grid">
                        {subUnits.map(sub => (
                          <Link key={sub.id} to={`/units/${sub.id}`} className="ud-orbat-link" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.1)', color: '#8892a4' }}>
                            ⬇ {sub.name.toUpperCase()}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  {!parentUnit && subUnits.length === 0 && (
                    <div style={{ color: 'var(--ud-dim)', fontStyle: 'italic', fontSize: 14, fontFamily: 'IBM Plex Mono' }}>[ NO STRUCTURAL LINKS RECORDED IN DATABASE ]</div>
                  )}
                </div>
              </div>

              {unit.combatHistory?.length > 0 && (
                <div className="ud-section">
                  <div className="ud-section-title"><span style={{ color: '#ff3b3b' }}><Icons.Crosshair /></span> COMBAT DEPLOYMENTS</div>
                  <div className="ud-list">
                    {unit.combatHistory.map((a, i) => (
                      <div key={i} className="ud-list-item">{a.toUpperCase()}</div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="ud-sidebar">
              <div className="ud-info-card">
                <div className="ud-info-card-title"><Icons.Clipboard /> UNIT DOSSIER LOG</div>
                {[
                  ['Nation',         `${unit.country}`],
                  ['Branch',         `${br.label}`],
                  ['Status',         unit.status],
                  ['Est. Formed',    unit.founded],
                  ['Est. Strength',  unit.strength],
                  ['Native ID',      unit.nativeName],
                ].filter(([,v]) => v !== null && v !== undefined).map(([k, v]) => (
                  <div key={k} className="ud-info-row">
                    <span className="ud-info-key">{k}</span>
                    <span className="ud-info-val">{v}</span>
                  </div>
                ))}
                
                {unit.bases?.length > 0 && (
                  <div style={{ marginTop: 24 }}>
                    <div className="ud-info-key" style={{ marginBottom: 12, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>KNOWN GARRISONS</div>
                    {unit.bases.map((b, i) => (
                      <div key={i} style={{ fontSize: 14, color: 'var(--ud-text)', marginBottom: 8, fontWeight: 500 }}>📍 {b}</div>
                    ))}
                  </div>
                )}
              </div>

              {import.meta.env.VITE_SHOW_ADS !== 'false' && (
                <div style={{ background: 'rgba(255, 170, 0, 0.02)', border: '1px dashed rgba(255, 170, 0, 0.2)', borderRadius: 8, padding: '16px 0', display: 'flex', justifyContent: 'center' }}>
                  <AdBanner id="ad-unitdetail-sidebar" size="300x250" />
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}