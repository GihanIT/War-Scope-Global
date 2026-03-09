import { useParams, Link } from 'react-router-dom';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { VEHICLES, CATEGORIES, COUNTRIES } from '../data/vehicles-data.js';
import SEO from '../seo/SEO.jsx';
import { vehicleSchema, breadcrumbSchema } from '../seo/structuredData.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getIso2 = (countryName) => {
  const map = {
    'USA': 'us', 'United States': 'us', 'Russia': 'ru', 'Russian Federation': 'ru',
    'China': 'cn', 'PRC': 'cn', 'UK': 'gb', 'United Kingdom': 'gb',
    'France': 'fr', 'Germany': 'de', 'Israel': 'il', 'India': 'in',
    'Turkey': 'tr', 'South Korea': 'kr', 'Japan': 'jp', 'Italy': 'it',
    'Ukraine': 'ua', 'Iran': 'ir', 'North Korea': 'kp'
  };
  return map[countryName] || 'un';
};

const getCatImage = (catName) => {
  const str = (catName || '').toLowerCase();
  if (str.includes('air')) return 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=600&q=80';
  if (str.includes('armor') || str.includes('tank') || str.includes('land')) return 'https://images.unsplash.com/photo-1632292220916-c92a7c062c3f?auto=format&fit=crop&w=600&q=80';
  if (str.includes('sea') || str.includes('nav')) return 'https://images.unsplash.com/photo-1590458632646-0b1a01798319?auto=format&fit=crop&w=600&q=80';
  if (str.includes('missil') || str.includes('artillery') || str.includes('defense') || str.includes('strategic')) return 'https://images.unsplash.com/photo-1612044810777-6ea71d604b34?auto=format&fit=crop&w=600&q=80';
  return 'https://images.unsplash.com/photo-1508614999368-9260051292e5?auto=format&fit=crop&w=600&q=80';
};

// ─── Tactical SVGs ────────────────────────────────────────────────────────────
const Icons = {
  ChevronLeft: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  Clipboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>,
  Ruler: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.3 15.3l-7.6-7.6a2 2 0 0 0-2.8 0l-1.4 1.4a2 2 0 0 0 0 2.8l7.6 7.6a2 2 0 0 0 2.8 0l1.4-1.4a2 2 0 0 0 0-2.8z"/><path d="M14.5 18.5l-4.2-4.2"/><path d="M10.5 22.5l-4.2-4.2"/><path d="M6.5 18.5l-4.2-4.2"/></svg>,
  Crosshair: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>,
  Cpu: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>,
  Shield: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Globe: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Wrench: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>,
  FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  --vd-bg:      #050508;
  --vd-panel:   rgba(10, 12, 20, 0.85);
  --vd-border:  rgba(0, 212, 255, 0.15);
  --vd-accent:  #00d4ff;
  --vd-text:    #e8eaf0;
  --vd-muted:   #8892a4;
  --vd-dim:     #4a5568;
}

.vd-page-wrapper {
  min-height: 100dvh;
  background: var(--vd-bg);
  color: var(--vd-text);
  font-family: 'Barlow', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Tactical Grid */
.vd-page-wrapper::before {
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

.vd-content-layer { position: relative; z-index: 1; }

/* ── Hero ── */
.vd-hero {
  position: relative; padding: 48px 40px 56px; border-bottom: 1px solid var(--vd-border);
  background: radial-gradient(ellipse 80% 100% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 80%);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.vd-hero-inner { position: relative; z-index: 2; max-width: 1400px; margin: 0 auto; }

.vd-back {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--vd-accent); text-decoration: none;
  text-transform: uppercase; margin-bottom: 32px; transition: all 200ms ease;
  background: rgba(0,212,255,0.05); padding: 6px 12px; border-radius: 4px;
  border: 1px solid rgba(0,212,255,0.2);
}
.vd-back:hover { background: rgba(0,212,255,0.15); box-shadow: 0 0 12px rgba(0,212,255,0.2); color: #fff; }

.vd-hero-grid { display: grid; grid-template-columns: 1fr 440px; gap: 64px; align-items: center; }

.vd-meta-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.vd-country-badge {
  display: flex; align-items: center; gap: 8px;
  font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600;
  letter-spacing: 0.1em; color: var(--vd-text); text-transform: uppercase;
}
.vd-cat-badge {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  padding: 4px 12px; border-radius: 4px; border: 1px solid;
  letter-spacing: 0.1em; text-transform: uppercase;
}
.vd-status-badge {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  padding: 4px 12px; border-radius: 4px; border: 1px solid;
  letter-spacing: 0.1em; text-transform: uppercase;
}

.vd-name {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
  font-size: clamp(48px, 6vw, 80px); letter-spacing: -0.01em; line-height: 1;
  color: var(--vd-text); margin-bottom: 8px; text-shadow: 0 4px 16px rgba(0,0,0,0.8);
}
.vd-desig { font-size: 20px; color: var(--vd-muted); margin-bottom: 32px; font-weight: 500; }

.vd-quick-stats {
  display: flex; gap: 0; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; overflow: hidden; background: rgba(0,0,0,0.4); max-width: 600px;
  backdrop-filter: blur(8px);
}
.vd-qstat { flex: 1; padding: 16px; text-align: center; border-right: 1px solid rgba(255,255,255,0.1); }
.vd-qstat:last-child { border-right: none; }
.vd-qstat-val { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 18px; font-weight: 600; color: var(--vd-accent); margin-bottom: 4px; }
.vd-qstat-label { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.1em; color: var(--vd-muted); text-transform: uppercase; }

/* Image Box */
.vd-img-box {
  border: 1px solid var(--cat-border); border-radius: 8px; overflow: hidden;
  height: 280px; display: flex; align-items: center; justify-content: center;
  position: relative; box-shadow: 0 8px 32px rgba(0,0,0,0.6);
}
.vd-img-box img { width: 100%; height: 100%; object-fit: cover; }
.vd-img-overlay {
  position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(to top, rgba(5,5,8,0.9) 0%, rgba(5,5,8,0) 100%);
}
.vd-img-caption {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--vd-muted);
  text-align: right; margin-top: 12px; letter-spacing: 0.1em; text-transform: uppercase;
}

/* ── Body ── */
.vd-body { max-width: 1400px; margin: 0 auto; padding: 48px 40px 80px; }
.vd-layout { display: grid; grid-template-columns: 1fr 380px; gap: 48px; align-items: start; }

/* Sections */
.vd-section { margin-bottom: 48px; }
.vd-section-title {
  font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 24px;
  color: var(--vd-text); margin-bottom: 20px; padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 12px;
  text-transform: uppercase; letter-spacing: 0.02em;
}
.vd-section-title span { color: var(--vd-accent); display: flex; }
.vd-p { font-size: 16px; color: #cdd6f4; line-height: 1.8; margin-bottom: 16px; background: rgba(0,0,0,0.2); padding: 20px; border-left: 3px solid var(--vd-accent); border-radius: 4px; }

/* Specs table */
.vd-specs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.vd-spec-item {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 6px; padding: 16px; display: flex; flex-direction: column; gap: 6px;
}
.vd-spec-label { font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; letter-spacing: 0.15em; color: var(--vd-dim); text-transform: uppercase; }
.vd-spec-val { font-size: 16px; color: var(--vd-text); font-weight: 500; }

/* Armament list */
.vd-armament-list { display: flex; flex-direction: column; gap: 10px; }
.vd-armament-item {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  background: rgba(255,59,59,0.05); border: 1px solid rgba(255,59,59,0.2);
  border-radius: 6px; font-size: 15px; font-weight: 500; color: #e8eaf0;
}
.vd-armament-item::before {
  content: ''; width: 6px; height: 6px; border-radius: 50%;
  background: #ff3b3b; box-shadow: 0 0 8px #ff3b3b; flex-shrink: 0;
}

/* Tech tags */
.vd-tech-grid { display: flex; flex-direction: column; gap: 10px; }
.vd-tech-item {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  background: rgba(0,212,255,0.05); border: 1px solid rgba(0,212,255,0.2);
  border-radius: 6px; font-size: 15px; font-weight: 500; color: #e8eaf0;
}
.vd-tech-item::before {
  content: ''; width: 4px; height: 12px; background: #00d4ff; flex-shrink: 0;
}

/* Operators */
.vd-operators { display: flex; flex-wrap: wrap; gap: 12px; }
.vd-operator-tag {
  display: flex; align-items: center; gap: 8px; padding: 8px 16px;
  background: var(--vd-panel); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 4px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; color: var(--vd-text);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
.vd-operator-tag img { width: 20px; height: 14px; object-fit: cover; border-radius: 2px; border: 1px solid rgba(255,255,255,0.2); }

/* Variants */
.vd-variants { display: flex; flex-direction: column; gap: 8px; }
.vd-variant {
  padding: 12px 16px; background: rgba(0,0,0,0.3); border: 1px dashed rgba(255,255,255,0.15);
  border-radius: 6px; font-size: 14px; color: var(--vd-muted);
}

/* Sidebar cards */
.vd-sidebar { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px; }
.vd-info-card {
  background: var(--vd-panel); border: 1px solid var(--vd-border);
  border-radius: 8px; padding: 24px; backdrop-filter: blur(12px); box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.vd-info-card-title {
  font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
  letter-spacing: 0.15em; color: var(--vd-accent); text-transform: uppercase;
  margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid var(--vd-border);
}
.vd-info-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); gap: 16px; }
.vd-info-row:last-child { border-bottom: none; padding-bottom: 0; }
.vd-info-key { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--vd-muted); text-transform: uppercase; letter-spacing: 0.05em; }
.vd-info-val { font-size: 14px; color: var(--vd-text); font-weight: 600; text-align: right; }

/* Related */
.vd-related-grid { display: flex; flex-direction: column; gap: 12px; }
.vd-related-card {
  display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05); border-radius: 6px; padding: 12px;
  text-decoration: none; transition: all 200ms ease;
}
.vd-related-card:hover { border-color: rgba(0,212,255,0.4); background: rgba(0,212,255,0.05); transform: translateX(4px); }
.vd-related-img { width: 48px; height: 32px; border-radius: 3px; object-fit: cover; opacity: 0.8; }
.vd-related-info { flex: 1; min-width: 0; }
.vd-related-name { font-size: 14px; font-weight: 600; color: var(--vd-text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.vd-related-ctry { font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--vd-muted); letter-spacing: 0.1em; text-transform: uppercase; }

/* 404 */
.vd-404 { padding: 120px 24px; text-align: center; }
.vd-404-code { font-family: 'IBM Plex Mono', monospace; font-size: 100px; font-weight: 700; color: rgba(255,59,59,0.2); letter-spacing: -0.05em; line-height: 1; margin-bottom: 24px; }
.vd-404-text { font-family: 'Barlow Condensed', sans-serif; font-size: 32px; font-weight: 600; color: var(--vd-text); margin-bottom: 32px; text-transform: uppercase; }

@media(max-width:1024px) {
  .vd-hero-grid { grid-template-columns: 1fr; gap: 40px; }
  .vd-layout { grid-template-columns: 1fr; }
  .vd-sidebar { position: static; }
}
@media(max-width:768px) {
  .vd-hero { padding: 32px 24px; }
  .vd-body { padding: 32px 24px 64px; }
  .vd-quick-stats { flex-wrap: wrap; }
  .vd-qstat { min-width: 50%; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .vd-img-box { height: 200px; }
}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

const STATUS_STYLE = {
  'Active':      { color:'#00ff88', border:'rgba(0,255,136,0.4)', bg:'rgba(0,255,136,0.1)' },
  'Reserve':     { color:'#ffaa00', border:'rgba(255,170,0,0.4)',  bg:'rgba(255,170,0,0.1)' },
  'Retired':     { color:'#8892a4', border:'rgba(136,146,164,0.4)',bg:'rgba(136,146,164,0.1)' },
  'Development': { color:'#00d4ff', border:'rgba(0,212,255,0.4)',  bg:'rgba(0,212,255,0.1)' },
};

export default function VehicleDetail() {
  injectCSS('vd-css', CSS);
  const { id } = useParams();
  const vehicle = VEHICLES.find(v => v.id === id);

  if (!vehicle) return (
    <div className="vd-page-wrapper">
      <Navbar />
      <div className="vd-404">
        <div className="vd-404-code">404</div>
        <div className="vd-404-text">[ ASSET RECORD NOT FOUND ]</div>
        <Link to="/vehicles" style={{fontFamily:'IBM Plex Mono,monospace',fontSize:13, fontWeight:600, color:'#00d4ff',letterSpacing:'0.15em', textDecoration:'none', border:'1px solid rgba(0,212,255,0.3)', padding:'12px 24px', borderRadius:'4px', background:'rgba(0,212,255,0.05)'}}>
          <Icons.ChevronLeft /> RETURN TO DATABASE
        </Link>
      </div>
      <Footer />
    </div>
  );

  const cat    = CATEGORIES[vehicle.category];
  const ctry   = COUNTRIES[vehicle.country];
  const st     = STATUS_STYLE[vehicle.status] ?? STATUS_STYLE.Active;
  const specs  = vehicle.specs ?? {};
  
  const heroImgUrl = vehicle.image ? vehicle.image : getCatImage(cat?.label);

  const related = VEHICLES
    .filter(v => v.id !== vehicle.id && (v.country === vehicle.country || v.category === vehicle.category))
    .slice(0, 4);

  return (
    <div className="vd-page-wrapper">
      <SEO
            title={`${vehicle.name} — Specifications & Data`}
            description={`${vehicle.name}: full technical specifications, origin, operators, and combat history. ${vehicle.category} from ${vehicle.country}.`}
            canonical={`/vehicles/${vehicle.id}`}
          >
            <script type="application/ld+json">{JSON.stringify(vehicleSchema(vehicle))}</script>
            <script type="application/ld+json">{JSON.stringify(breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Vehicles', url: '/vehicles' },
              { name: vehicle.name, url: `/vehicles/${vehicle.id}` },
            ]))}</script>
          </SEO>
      <div className="vd-content-layer">
        <Navbar />

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <div className="vd-hero">
          <div className="vd-hero-inner">
            <Link to="/vehicles" className="vd-back"><Icons.ChevronLeft /> ASSET DATABASE</Link>
            <div className="vd-hero-grid">
              <div className="vd-hero-left">
                <div className="vd-meta-row">
                  <div className="vd-country-badge">
                    <img src={`https://flagcdn.com/w40/${getIso2(vehicle.country)}.png`} alt={vehicle.country} style={{ width: 24, height: 16, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(255,255,255,0.2)' }} />
                    {vehicle.country}
                  </div>
                  <div
                    className="vd-cat-badge"
                    style={{color:cat?.color,borderColor:`${cat?.color}55`,background:`${cat?.color}15`}}
                  >{cat?.label}</div>
                  <div
                    className="vd-status-badge"
                    style={{color:st.color,borderColor:st.border,background:st.bg}}
                  >{vehicle.status}</div>
                </div>
                
                <div className="vd-name">{vehicle.name.toUpperCase()}</div>
                <div className="vd-desig">{vehicle.designation}</div>
                
                <div className="vd-quick-stats">
                  {[
                    { val: vehicle.year ?? '—',          label: 'ENTERED SERVICE' },
                    { val: vehicle.crew === 0 ? 'UAV' : (vehicle.crew ?? '—'), label: 'CREW COMPLEMENT' },
                    { val: vehicle.unitCost ?? '—',      label: 'EST. UNIT COST' },
                    { val: vehicle.totalBuilt ?? '—',    label: 'TOTAL PRODUCED' },
                  ].map(s => (
                    <div key={s.label} className="vd-qstat">
                      <span className="vd-qstat-val">{s.val}</span>
                      <span className="vd-qstat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="vd-img-box" style={{ '--cat-border': cat?.color ? `${cat.color}66` : 'rgba(0,212,255,0.3)' }}>
                  <img src={heroImgUrl} alt={vehicle.name} style={{ filter: vehicle.image ? 'none' : `sepia(1) hue-rotate(${cat?.label.includes('Air') ? 180 : cat?.label.includes('Armor') ? 320 : 0}deg) saturate(3) brightness(0.6)` }} />
                  <div className="vd-img-overlay" />
                </div>
                <div className="vd-img-caption">
                  {vehicle.origin ? `ORIGIN: ${vehicle.origin}` : ''}{vehicle.year ? ` | INTRO: ${vehicle.year}` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '40px 0 0', display: 'flex', justifyContent: 'center' }}>
            <AdBanner id="ad-vehicledetail-top" size="728x90" />
          </div>
        )}

        {/* ── Body ─────────────────────────────────────────────────── */}
        <div className="vd-body">
          <div className="vd-layout">

            {/* Main column */}
            <div className="vd-main-col">

              {/* Overview */}
              <div className="vd-section">
                <div className="vd-section-title"><span><Icons.Clipboard /></span> TACTICAL OVERVIEW</div>
                <div className="vd-p">{vehicle.description}</div>
              </div>

              {/* Specifications */}
              {Object.keys(specs).length > 0 && (
                <div className="vd-section">
                  <div className="vd-section-title"><span><Icons.Ruler /></span> HARDWARE SPECIFICATIONS</div>
                  <div className="vd-specs-grid">
                    {[
                      ['Operating Weight',  specs.weight],
                      ['Length overall',    specs.length],
                      ['Width / Beam',      specs.width],
                      ['Height / Draft',    specs.height],
                      ['Maximum Speed',     specs.speed],
                      ['Operational Range', specs.range],
                      ['Service Ceiling',   specs.ceiling],
                      ['Propulsion',        specs.thrust || specs.engine],
                      ['Displacement',      specs.displacement],
                      ['Payload Capacity',  specs.payload],
                      ['Armor Protection',  specs.armor],
                    ].filter(([,v]) => v).map(([label, val]) => (
                      <div key={label} className="vd-spec-item">
                        <div className="vd-spec-label">{label}</div>
                        <div className="vd-spec-val">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Armament */}
              {specs.armament?.length > 0 && (
                <div className="vd-section">
                  <div className="vd-section-title"><span style={{ color: '#ff3b3b' }}><Icons.Crosshair /></span> WEAPONS SYSTEMS</div>
                  <div className="vd-armament-list">
                    {specs.armament.map((a, i) => (
                      <div key={i} className="vd-armament-item">{a}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Technology */}
              {vehicle.technology?.length > 0 && (
                <div className="vd-section">
                  <div className="vd-section-title"><span><Icons.Cpu /></span> ONBOARD TECHNOLOGIES</div>
                  <div className="vd-tech-grid">
                    {vehicle.technology.map((t, i) => (
                      <div key={i} className="vd-tech-item">{t}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Combat history */}
              {vehicle.combatHistory && (
                <div className="vd-section">
                  <div className="vd-section-title"><span><Icons.Shield /></span> COMBAT DEPLOYMENT</div>
                  <div className="vd-p">{vehicle.combatHistory}</div>
                </div>
              )}

              {/* Operators */}
              {vehicle.operators?.length > 0 && (
                <div className="vd-section">
                  <div className="vd-section-title"><span><Icons.Globe /></span> GLOBAL OPERATORS</div>
                  <div className="vd-operators">
                    {vehicle.operators.map(op => {
                      return (
                        <div key={op} className="vd-operator-tag">
                          <img src={`https://flagcdn.com/w40/${getIso2(op)}.png`} alt={op} />
                          {op.toUpperCase()}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Variants */}
              {vehicle.variants?.length > 0 && (
                <div className="vd-section">
                  <div className="vd-section-title"><span><Icons.Wrench /></span> KNOWN VARIANTS</div>
                  <div className="vd-variants">
                    {vehicle.variants.map((v, i) => (
                      <div key={i} className="vd-variant">{v}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {vehicle.notes && (
                <div className="vd-section">
                  <div className="vd-section-title"><span><Icons.FileText /></span> INTELLIGENCE NOTES</div>
                  <div className="vd-p">{vehicle.notes}</div>
                </div>
              )}

            </div>

            {/* Sidebar */}
            <div className="vd-sidebar">

              {/* Quick info */}
              <div className="vd-info-card">
                <div className="vd-info-card-title">SYSTEM CLASSIFICATION</div>
                {[
                  ['Nation',         `${vehicle.country}`],
                  ['Class',          `${cat?.label}`],
                  ['Status',         vehicle.status],
                  ['Introduced',     vehicle.year],
                  ['Origin',         vehicle.origin],
                  ['Crew',           vehicle.crew === 0 ? 'Unmanned' : vehicle.crew],
                  ['Est. Cost',      vehicle.unitCost],
                  ['Production',     vehicle.totalBuilt],
                ].filter(([,v]) => v !== null && v !== undefined).map(([k, v]) => (
                  <div key={k} className="vd-info-row">
                    <span className="vd-info-key">{k}</span>
                    <span className="vd-info-val">{v}</span>
                  </div>
                ))}
              </div>

              {/* Related vehicles */}
              {related.length > 0 && (
                <div className="vd-info-card">
                  <div className="vd-info-card-title">RELATED ASSETS</div>
                  <div className="vd-related-grid">
                    {related.map(v => {
                      const rcat = CATEGORIES[v.category];
                      const thumb = v.image ? v.image : getCatImage(rcat?.label);
                      return (
                        <Link key={v.id} to={`/vehicles/${v.id}`} className="vd-related-card">
                          <img src={thumb} alt={v.name} className="vd-related-img" style={{ filter: v.image ? 'none' : 'grayscale(1)' }} />
                          <div className="vd-related-info">
                            <div className="vd-related-name">{v.name.toUpperCase()}</div>
                            <div className="vd-related-ctry">{v.country}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {import.meta.env.VITE_SHOW_ADS !== 'false' && (
                <div style={{ background: 'rgba(0, 212, 255, 0.02)', border: '1px dashed rgba(0, 212, 255, 0.2)', borderRadius: 8, padding: '16px 0', display: 'flex', justifyContent: 'center' }}>
                  <AdBanner id="ad-vehicledetail-sidebar" size="300x250" />
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