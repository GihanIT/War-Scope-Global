import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import AdBanner from '../components/AdBanner.jsx';
import { SANCTIONED_COUNTRIES, ISSUERS, SANCTION_TYPES } from '../data/sanctions-data.js';
import Footer from '../components/Footer.jsx';
import SEO from '../seo/SEO.jsx';
import { datasetSchema } from '../seo/structuredData.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Maps ISO-3 codes to ISO-2 codes for the FlagCDN image API
const getIso2 = (iso3) => {
  const map = { 
  USA: 'us', RUS: 'ru', CHN: 'cn', FRA: 'fr', GBR: 'gb', 
  PAK: 'pk', IND: 'in', PRK: 'kp', ISR: 'il', IRN: 'ir', 
  SYR: 'sy', CUB: 'cu', VEN: 've', BLR: 'by', MMR: 'mm',
  SDN: 'sd', AFG: 'af', YEM: 'ye', SOM: 'so', LBY: 'ly',
  COD: 'cd'
};
  return map[iso3] || iso3.substring(0, 2).toLowerCase();
};

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ChevronDown: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  Alert: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  FileText: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  Shield: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Target: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap');

  .snc-page-wrapper { 
    min-height: 100dvh; 
    background: #050508; 
    color: #e8eaf0; 
    font-family: 'Barlow', sans-serif; 
    position: relative;
  }

  /* Tactical Grid Background */
  .snc-page-wrapper::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(198, 40, 40, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198, 40, 40, 0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
    z-index: 0;
    pointer-events: none;
  }

  .snc-content-layer {
    position: relative;
    z-index: 1;
  }

  .snc-hero {
    position: relative; 
    padding: 64px 24px; 
    text-align: center; 
    overflow: hidden;
    background: radial-gradient(ellipse 80% 80% at 50% 0%, rgba(198,40,40,0.12) 0%, transparent 70%);
    border-bottom: 1px solid rgba(198,40,40,0.2);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  
  .snc-hero-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(198,40,40,0.1); border: 1px solid rgba(198,40,40,0.4);
    border-radius: 4px; padding: 8px 16px; margin-bottom: 24px;
    font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
    letter-spacing: 0.15em; color: #ff8080; text-transform: uppercase;
    box-shadow: 0 0 15px rgba(198,40,40,0.2);
  }
  
  .snc-title {
    font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
    font-size: clamp(48px, 8vw, 88px); letter-spacing: -0.01em;
    color: #e8eaf0; line-height: 1; margin-bottom: 20px;
    text-shadow: 0 4px 20px rgba(0,0,0,0.8);
  }
  .snc-title span { color: #c62828; text-shadow: 0 0 24px rgba(198,40,40,0.5); }
  
  .snc-sub { 
    font-size: 18px; color: #8892a4; max-width: 640px; margin: 0 auto 40px; 
    line-height: 1.6; 
  }

  .snc-global-stats {
    display: flex; justify-content: center; gap: 0;
    border: 1px solid rgba(198,40,40,0.3); border-radius: 8px;
    overflow: hidden; max-width: 700px; margin: 0 auto;
    background: rgba(10,12,20,0.85); backdrop-filter: blur(16px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.6);
  }
  .snc-gstat { flex: 1; padding: 20px 16px; text-align: center; border-right: 1px solid rgba(198,40,40,0.2); }
  .snc-gstat:last-child { border-right: none; }
  .snc-gstat-val { 
    font-family: 'IBM Plex Mono', monospace; font-size: 32px; font-weight: 600; 
    color: #ff6060; display: block; margin-bottom: 6px;
    text-shadow: 0 0 12px rgba(198,40,40,0.5);
  }
  .snc-gstat-label { 
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600;
    letter-spacing: 0.15em; color: #8892a4; text-transform: uppercase; 
  }

  .snc-controls {
    max-width: 1400px; margin: 0 auto; padding: 32px 48px 0;
    display: flex; flex-wrap: wrap; gap: 16px; align-items: center;
  }
  
  .snc-search-wrap { position: relative; flex: 1; min-width: 240px; max-width: 360px; }
  .snc-search {
    width: 100%; background: rgba(10,12,20,0.8); border: 1px solid rgba(198,40,40,0.3);
    border-radius: 6px; padding: 12px 16px 12px 40px; color: #e8eaf0;
    font-family: 'IBM Plex Mono', monospace; font-size: 13px; outline: none;
    transition: all 200ms ease; backdrop-filter: blur(12px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
  }
  .snc-search:focus { border-color: #ff6060; box-shadow: 0 0 15px rgba(198,40,40,0.3); }
  .snc-search::placeholder { color: #4a5568; letter-spacing: 0.05em; }
  .snc-search-icon { 
    position: absolute; left: 14px; top: 50%; transform: translateY(-50%); 
    color: #ff6060; pointer-events: none; opacity: 0.8;
  }

  .snc-filter-group { display: flex; gap: 8px; flex-wrap: wrap; }
  .snc-filter-btn {
    background: rgba(10,12,20,0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 4px;
    padding: 8px 14px; cursor: pointer; font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; font-weight: 600; letter-spacing: 0.1em; color: #8892a4; text-transform: uppercase;
    transition: all 200ms ease; white-space: nowrap;
    display: flex; align-items: center; gap: 6px;
  }
  .snc-filter-btn:hover { border-color: rgba(255,255,255,0.3); color: #e8eaf0; background: rgba(255,255,255,0.05); }
  .snc-filter-btn.active { 
    color: #fff; border-color: var(--fc); background: rgba(var(--fcr),0.15); 
    box-shadow: 0 0 12px rgba(var(--fcr),0.3); 
  }

  .snc-layout { max-width: 1400px; margin: 0 auto; padding: 32px 48px 80px; display: flex; gap: 32px; align-items: flex-start; }

  .snc-list { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 16px; }

  .snc-empty {
    text-align: center; padding: 80px 24px;
    background: rgba(198,40,40,0.02); border: 1px dashed rgba(198,40,40,0.3); 
    border-radius: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 14px; 
    font-weight: 600; color: #8892a4; letter-spacing: 0.15em; text-transform: uppercase;
  }

  .snc-country-card {
    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden;
    background: rgba(10,12,20,0.75); transition: all 200ms ease; cursor: pointer;
    backdrop-filter: blur(12px);
  }
  .snc-country-card:hover { border-color: rgba(198,40,40,0.4); box-shadow: 0 4px 24px rgba(0,0,0,0.5); transform: translateY(-2px); }
  .snc-country-card.open { border-color: rgba(198,40,40,0.6); background: rgba(10,12,20,0.95); }

  .snc-card-header { display: flex; align-items: center; gap: 20px; padding: 20px 24px; }
  .snc-card-flag { flex-shrink: 0; display: flex; align-items: center; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
  .snc-card-main { flex: 1; min-width: 0; }
  .snc-card-name { font-family: 'Barlow Condensed', sans-serif; font-size: 28px; font-weight: 700; color: #e8eaf0; letter-spacing: 0.01em; margin-bottom: 2px; }
  .snc-card-summary { font-size: 15px; color: #8892a4; margin-top: 4px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .snc-card-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }

  .snc-severity {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; padding: 4px 10px;
    border-radius: 4px; letter-spacing: 0.1em; text-transform: uppercase; flex-shrink: 0;
    font-weight: 600; display: flex; align-items: center; gap: 6px;
  }
  .snc-severity.critical { background: rgba(198,40,40,0.15); border: 1px solid rgba(198,40,40,0.5); color: #ff6060; box-shadow: 0 0 10px rgba(198,40,40,0.2); }
  .snc-severity.high     { background: rgba(230,81,0,0.12);  border: 1px solid rgba(230,81,0,0.4);  color: #ff9040; }
  .snc-severity.medium   { background: rgba(106,27,154,0.12);border: 1px solid rgba(106,27,154,0.4);color: #ce93d8; }
  .snc-severity.low      { background: rgba(46,125,50,0.12); border: 1px solid rgba(46,125,50,0.4); color: #81c784; }

  .snc-type-badge {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; padding: 3px 8px;
    border-radius: 4px; letter-spacing: 0.06em; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.05); color: #8892a4; display: flex; align-items: center; gap: 4px;
  }
  .snc-issuer-dot {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; color: #e8eaf0;
    padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.05);
  }
  .snc-count-badge {
    font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600;
    padding: 6px 12px; border-radius: 4px;
    background: rgba(198,40,40,0.1); border: 1px solid rgba(198,40,40,0.3);
    color: #ff8080; flex-shrink: 0;
  }

  .snc-sanctions-list { border-top: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3); }
  .snc-sanction-row {
    padding: 20px 24px; border-bottom: 1px dashed rgba(255,255,255,0.1);
    display: flex; gap: 20px; align-items: flex-start;
    transition: background 200ms ease;
  }
  .snc-sanction-row:last-child { border-bottom: none; }
  .snc-sanction-row:hover { background: rgba(255,255,255,0.02); }

  .snc-sanction-icon { color: rgba(255,255,255,0.4); flex-shrink: 0; margin-top: 2px; }
  .snc-sanction-body { flex: 1; min-width: 0; }
  .snc-sanction-title { font-size: 16px; font-weight: 600; color: #e8eaf0; margin-bottom: 6px; }
  .snc-sanction-desc { font-size: 14px; color: #8892a4; line-height: 1.6; margin-bottom: 12px; }
  .snc-sanction-meta { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
  
  .snc-sanction-date {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #8892a4;
    letter-spacing: 0.08em;
  }
  .snc-legal {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #4a5568;
    letter-spacing: 0.06em; border-left: 2px solid #1e2433; padding-left: 10px;
    font-style: italic; text-transform: uppercase;
  }
  
  .snc-status {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600; padding: 3px 8px;
    border-radius: 4px; letter-spacing: 0.1em; text-transform: uppercase;
  }
  .snc-status.active  { background: rgba(198,40,40,0.15); border: 1px solid rgba(198,40,40,0.4); color: #ff6060; }
  .snc-status.partial { background: rgba(230,81,0,0.15);  border: 1px solid rgba(230,81,0,0.4);  color: #ff9040; }
  .snc-status.expired { background: rgba(100,100,100,0.1);border: 1px solid rgba(100,100,100,0.3);color: #8892a4; }

  .snc-issuer-pill {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
    padding: 4px 10px; border-radius: 12px; letter-spacing: 0.1em;
    border: 1px solid; flex-shrink: 0; text-transform: uppercase;
  }

  .snc-sidebar { width: 320px; flex-shrink: 0; position: sticky; top: 80px; }
  .snc-sidebar-card {
    background: rgba(10,12,20,0.8); border: 1px solid rgba(198,40,40,0.2);
    border-radius: 8px; padding: 20px; margin-bottom: 20px;
    backdrop-filter: blur(12px); box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  }
  .snc-sidebar-title {
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.15em;
    color: #ff8080; text-transform: uppercase; margin-bottom: 16px;
    padding-bottom: 12px; border-bottom: 1px solid rgba(198,40,40,0.2);
    display: flex; align-items: center; gap: 8px;
  }
  .snc-sidebar-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0; border-bottom: 1px solid rgba(30,36,51,0.5);
  }
  .snc-sidebar-row:last-child { border-bottom: none; padding-bottom: 0; }
  .snc-sidebar-label { font-size: 14px; color: #8892a4; font-weight: 500; display: flex; align-items: center; gap: 8px; }
  .snc-sidebar-val { font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600; color: #e8eaf0; }
  .snc-sidebar-val.red { color: #ff6060; }

  @keyframes snc-fade { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
  .snc-animate { animation: snc-fade 400ms cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes snc-pulse { 0%,100%{opacity:1; box-shadow: 0 0 12px rgba(198,40,40,0.5);} 50%{opacity:0.5; box-shadow: 0 0 4px rgba(198,40,40,0.2);} }
  .snc-pulse { animation: snc-pulse 2s infinite; border-radius: 50%; }

  @media (max-width: 1024px) {
    .snc-layout { flex-direction: column; padding: 24px 24px 64px; }
    .snc-sidebar { width: 100%; position: static; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .snc-controls { padding: 24px 24px 0; }
  }

  @media (max-width: 768px) {
    .snc-sidebar { grid-template-columns: 1fr; }
    .snc-hero { padding: 48px 20px 32px; }
    .snc-global-stats { flex-direction: column; border-radius: 8px; }
    .snc-gstat { border-right: none; border-bottom: 1px solid rgba(198,40,40,0.2); padding: 16px; }
    .snc-search-wrap { max-width: 100%; }
    .snc-card-header { flex-direction: column; align-items: stretch; gap: 16px; }
    .snc-card-flag { align-self: flex-start; }
    .snc-sanction-row { flex-direction: column; gap: 12px; }
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

const SEVERITY_ORDER = { critical:0, high:1, medium:2, low:3 };

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

// ─── Sanction row ─────────────────────────────────────────────────────────────
function SanctionRow({ sanction }) {
  const issuer = ISSUERS.find(i => i.id === sanction.issuer);
  const stype  = SANCTION_TYPES.find(t => t.id === sanction.type);

  return (
    <div className="snc-sanction-row">
      <div className="snc-sanction-icon">
        <Icons.FileText />
      </div>
      <div className="snc-sanction-body">
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, flexWrap:'wrap' }}>
          <div className="snc-sanction-title">{sanction.title}</div>
          <span className={`snc-status ${sanction.status}`}>{sanction.status}</span>
        </div>
        <div className="snc-sanction-desc">{sanction.description}</div>
        <div className="snc-sanction-meta">
          {issuer && (
            <span
              className="snc-issuer-pill"
              style={{ borderColor:`rgba(${hexToRgb(issuer.color)},0.4)`, color:issuer.color, background:`rgba(${hexToRgb(issuer.color)},0.1)` }}
            >
              {issuer.name}
            </span>
          )}
          {stype && (
            <span style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:11, fontWeight: 600, color:stype.color, letterSpacing:'0.1em', textTransform: 'uppercase' }}>
              {stype.label}
            </span>
          )}
          <span className="snc-sanction-date">
            IMPOSED: {sanction.imposed}
            {sanction.expanded ? ` | EXPANDED: ${sanction.expanded}` : ''}
            {sanction.expired  ? ` | EXPIRED: ${sanction.expired}`   : ''}
          </span>
          <span className="snc-legal">{sanction.legalBasis}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Country card ─────────────────────────────────────────────────────────────
function CountryCard({ country, activeIssuer, activeType }) {
  const [open, setOpen] = useState(false);

  const filteredSanctions = useMemo(() => {
    return country.sanctions.filter(s => {
      if (activeIssuer && s.issuer !== activeIssuer) return false;
      if (activeType  && s.type   !== activeType)   return false;
      return true;
    });
  }, [country.sanctions, activeIssuer, activeType]);

  if (filteredSanctions.length === 0) return null;

  const issuersPresent = [...new Set(filteredSanctions.map(s => s.issuer))];
  const typesPresent   = [...new Set(filteredSanctions.map(s => s.type))];

  return (
    <div className={`snc-country-card snc-animate ${open ? 'open' : ''}`}>
      <div className="snc-card-header" onClick={() => setOpen(o => !o)}>
        <div className="snc-card-flag">
          <img 
            src={`https://flagcdn.com/w80/${getIso2(country.iso3)}.png`} 
            alt={country.name} 
            style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4, border: '1px solid rgba(255,255,255,0.15)' }} 
          />
        </div>
        <div className="snc-card-main">
          <div className="snc-card-name">{country.name.toUpperCase()}</div>
          <div className="snc-card-summary">{country.summary}</div>
          <div className="snc-card-badges">
            {issuersPresent.map(id => {
              const iss = ISSUERS.find(i => i.id === id);
              return iss ? (
                <span key={id} className="snc-issuer-dot">
                  <span style={{ width:8, height:8, borderRadius:'50%', background:iss.color, display:'inline-block', boxShadow: `0 0 8px ${iss.color}` }} />
                  {iss.id}
                </span>
              ) : null;
            })}
            {typesPresent.map(id => {
              const t = SANCTION_TYPES.find(s => s.id === id);
              return t ? <span key={id} className="snc-type-badge"><Icons.Target /> {t.label}</span> : null;
            })}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:10, flexShrink:0 }}>
          <span className={`snc-severity ${country.severity}`}>
            {country.severity === 'critical' && <Icons.Alert />} {country.severity}
          </span>
          <span className="snc-count-badge">{filteredSanctions.length} ACTIVE DIRECTIVE{filteredSanctions.length!==1?'S':''}</span>
          <span style={{ color:'var(--tl-accent)', marginTop: 4, transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <Icons.ChevronDown />
          </span>
        </div>
      </div>

      {open && (
        <div className="snc-sanctions-list snc-animate">
          {filteredSanctions.map(s => <SanctionRow key={s.id} sanction={s} />)}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Sanctions() {
  injectCSS('sanctions-css', CSS);

  const [search,        setSearch]        = useState('');
  const [activeIssuer,  setActiveIssuer]  = useState(null);
  const [activeType,    setActiveType]    = useState(null);

  const filtered = useMemo(() => {
    return SANCTIONED_COUNTRIES
      .filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        const matching = c.sanctions.filter(s => {
          if (activeIssuer && s.issuer !== activeIssuer) return false;
          if (activeType   && s.type   !== activeType)   return false;
          return true;
        });
        return matching.length > 0;
      })
      .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9));
  }, [search, activeIssuer, activeType]);

  const totalSanctions = SANCTIONED_COUNTRIES.reduce((n, c) => n + c.sanctions.length, 0);
  const bySeverity = { critical:0, high:0, medium:0, low:0 };
  SANCTIONED_COUNTRIES.forEach(c => { bySeverity[c.severity] = (bySeverity[c.severity]||0)+1; });
  const byIssuer = {};
  SANCTIONED_COUNTRIES.forEach(c => c.sanctions.forEach(s => { byIssuer[s.issuer]=(byIssuer[s.issuer]||0)+1; }));
  const byType = {};
  SANCTIONED_COUNTRIES.forEach(c => c.sanctions.forEach(s => { byType[s.type]=(byType[s.type]||0)+1; }));

  return (
    <div className="snc-page-wrapper">
      <SEO
        title="Global Military & Economic Sanctions Tracker"
        description="Track active international sanctions against countries. Filter by issuer (USA, EU, UN), sanction type, and target country. Updated data from OFAC, EU, and UN Security Council."
        canonical="/sanctions"
      >
        <script type="application/ld+json">{JSON.stringify(datasetSchema({
          name: 'International Sanctions Database',
          description: 'Active military and economic sanctions by country, issuer and type.',
          url: '/sanctions',
          keywords: ['sanctions', 'OFAC', 'EU sanctions', 'UN sanctions', 'economic sanctions'],
        }))}</script>
      </SEO>
      <div className="snc-content-layer">
        <Navbar />
        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ display: 'flex', justifyContent: 'center', background: '#050508' }}>
            <AdBanner position="top" />
          </div>
        )}

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <div className="snc-hero">
          <div style={{ position:'relative', zIndex:2 }}>
            <div className="snc-hero-badge">
              <span className="snc-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff3b3b' }} />
              Sanctions Intelligence · LIVE DB
            </div>
            <h1 className="snc-title">GLOBAL<br/><span>SANCTIONS</span><br/>TRACKER</h1>
            <p className="snc-sub">
              Comprehensive database of UN, US, EU, and UK sanctions regimes — arms embargoes, financial restrictions, travel bans, trade controls, and energy sanctions.
            </p>
            <div className="snc-global-stats">
              {[
                { val: SANCTIONED_COUNTRIES.length, label: 'Nations' },
                { val: totalSanctions, label: 'Directives' },
                { val: ISSUERS.length, label: 'Issuers' },
                { val: bySeverity.critical, label: 'Critical' },
              ].map(s => (
                <div key={s.label} className="snc-gstat">
                  <span className="snc-gstat-val">{s.val}</span>
                  <span className="snc-gstat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Filters ──────────────────────────────────────────────────────── */}
        <div className="snc-controls">
          {/* Search */}
          <div className="snc-search-wrap">
            <span className="snc-search-icon"><Icons.Search /></span>
            <input
              className="snc-search"
              placeholder="> TARGET NATION..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Issuer filters */}
          <div className="snc-filter-group">
            {ISSUERS.map(iss => {
              const rgb = hexToRgb(iss.color);
              const isActive = activeIssuer === iss.id;
              return (
                <button
                  key={iss.id}
                  className={`snc-filter-btn ${isActive ? 'active' : ''}`}
                  style={{ '--fc': iss.color, '--fcr': rgb }}
                  onClick={() => setActiveIssuer(isActive ? null : iss.id)}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isActive ? '#fff' : iss.color }} /> {iss.id}
                </button>
              );
            })}
          </div>

          {/* Type filters */}
          <div className="snc-filter-group">
            {SANCTION_TYPES.map(t => {
              const rgb = hexToRgb(t.color);
              const isActive = activeType === t.id;
              return (
                <button
                  key={t.id}
                  className={`snc-filter-btn ${isActive ? 'active' : ''}`}
                  style={{ '--fc': t.color, '--fcr': rgb }}
                  onClick={() => setActiveType(isActive ? null : t.id)}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Clear */}
          {(activeIssuer || activeType || search) && (
            <button
              className="snc-filter-btn"
              onClick={() => { setActiveIssuer(null); setActiveType(null); setSearch(''); }}
              style={{ borderColor:'rgba(198,40,40,0.4)', color:'#ff8080', background: 'rgba(198,40,40,0.1)' }}
            >
              ✕ RESET
            </button>
          )}
        </div>

        {/* ── Main layout ───────────────────────────────────────────────── */}
        <div className="snc-layout">

          {/* Country list */}
          <div className="snc-list">
            {filtered.length === 0
              ? <div className="snc-empty">[ ERR: NO SANCTIONS MATCH CURRENT PARAMETERS ]</div>
              : filtered.map(c => (
                  <CountryCard
                    key={c.iso3}
                    country={c}
                    activeIssuer={activeIssuer}
                    activeType={activeType}
                  />
                ))
            }
          </div>

          {/* Sidebar stats */}
          <div className="snc-sidebar">
            <div className="snc-sidebar-card">
              <div className="snc-sidebar-title"><Icons.Alert /> BY SEVERITY LEVEL</div>
              {Object.entries(bySeverity).map(([sev, count]) => (
                <div key={sev} className="snc-sidebar-row">
                  <span className={`snc-severity ${sev}`} style={{ fontSize:10 }}>{sev}</span>
                  <span className="snc-sidebar-val red">{count}</span>
                </div>
              ))}
            </div>

            <div className="snc-sidebar-card">
              <div className="snc-sidebar-title"><Icons.Target /> BY ISSUING AUTHORITY</div>
              {ISSUERS.map(iss => (
                <div key={iss.id} className="snc-sidebar-row">
                  <span className="snc-sidebar-label">{iss.name}</span>
                  <span className="snc-sidebar-val">{byIssuer[iss.id] ?? 0}</span>
                </div>
              ))}
            </div>

            {import.meta.env.VITE_SHOW_ADS !== 'false' && (
              <div style={{ marginBottom: 20, background: 'rgba(198, 40, 40, 0.02)', border: '1px dashed rgba(198, 40, 40, 0.2)', borderRadius: 8, padding: '16px 0', display: 'flex', justifyContent: 'center' }}>
                <AdBanner id="ad-sanctions-sidebar" size="300x250" />
              </div>
            )}

            <div className="snc-sidebar-card" style={{ fontSize:12, color:'#8892a4', lineHeight:1.8, fontFamily:'IBM Plex Mono,monospace', letterSpacing:'0.05em' }}>
              <div className="snc-sidebar-title"><Icons.Shield /> INTELLIGENCE SOURCES</div>
              UN Security Council<br/>
              OFAC SDN List (US)<br/>
              EU Consolidated List<br/>
              UK OFSI Register<br/>
              Arms Control Association<br/>
              <div style={{ marginTop:12, color:'#4a5568', fontSize: 10, letterSpacing: '0.1em' }}>[ LAST SYNC: 2024 ]</div>
            </div>
          </div>
        </div>

        {import.meta.env.VITE_SHOW_ADS !== 'false' && (
          <div style={{ padding: '0 0 40px', display: 'flex', justifyContent: 'center' }}>
            <AdBanner position="bottom" size="728x90" />
          </div>
        )}
      </div>
        <Footer />
    </div>
  );
}