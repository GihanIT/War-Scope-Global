import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import { SANCTIONED_COUNTRIES, ISSUERS, SANCTION_TYPES } from '../data/sanctions-data.js';

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@300;400;600;700;800&family=Barlow:wght@300;400;600&display=swap');

  .snc-page { min-height:100vh; background:#050508; color:#e8eaf0; font-family:'Barlow',sans-serif; }

  .snc-hero {
    position:relative; padding:60px 40px 40px; text-align:center; overflow:hidden;
    background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(198,40,40,0.07) 0%, transparent 70%);
    border-bottom:1px solid rgba(198,40,40,0.15);
  }
  .snc-hero::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background-image: linear-gradient(rgba(198,40,40,0.025) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(198,40,40,0.025) 1px, transparent 1px);
    background-size:40px 40px;
  }
  .snc-hero-badge {
    display:inline-flex; align-items:center; gap:8px;
    background:rgba(198,40,40,0.1); border:1px solid rgba(198,40,40,0.3);
    border-radius:4px; padding:5px 14px; margin-bottom:20px;
    font-family:'IBM Plex Mono',monospace; font-size:11px;
    letter-spacing:0.14em; color:#ff8080; text-transform:uppercase;
  }
  .snc-title {
    font-family:'Barlow Condensed',sans-serif; font-weight:800;
    font-size:clamp(38px,6vw,72px); letter-spacing:-0.02em;
    color:#e8eaf0; line-height:1; margin-bottom:12px;
  }
  .snc-title span { color:#c62828; }
  .snc-sub { font-size:15px; color:#8892a4; max-width:520px; margin:0 auto 32px; line-height:1.6; }

  .snc-global-stats {
    display:flex; justify-content:center; gap:0;
    border:1px solid rgba(198,40,40,0.2); border-radius:8px;
    overflow:hidden; max-width:600px; margin:0 auto;
    background:rgba(10,10,20,0.8); backdrop-filter:blur(12px);
  }
  .snc-gstat { flex:1; padding:16px 20px; text-align:center; border-right:1px solid rgba(198,40,40,0.15); }
  .snc-gstat:last-child { border-right:none; }
  .snc-gstat-val { font-family:'IBM Plex Mono',monospace; font-size:24px; font-weight:600; color:#c62828; display:block; }
  .snc-gstat-label { font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.12em; color:#8892a4; text-transform:uppercase; margin-top:3px; }

  .snc-controls {
    max-width:1400px; margin:0 auto; padding:24px 32px 0;
    display:flex; flex-wrap:wrap; gap:12px; align-items:center;
  }
  .snc-search-wrap { position:relative; flex:1; min-width:200px; max-width:320px; }
  .snc-search {
    width:100%; background:rgba(10,10,20,0.8); border:1px solid #1e2433;
    border-radius:6px; padding:10px 12px 10px 36px; color:#e8eaf0;
    font-family:'IBM Plex Mono',monospace; font-size:13px; outline:none;
    transition:border-color 180ms;
  }
  .snc-search:focus { border-color:rgba(198,40,40,0.4); }
  .snc-search::placeholder { color:#4a5568; }
  .snc-search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#8892a4; pointer-events:none; }

  .snc-filter-group { display:flex; gap:6px; flex-wrap:wrap; }
  .snc-filter-btn {
    background:rgba(10,10,20,0.8); border:1px solid #1e2433; border-radius:5px;
    padding:7px 12px; cursor:pointer; font-family:'IBM Plex Mono',monospace;
    font-size:11px; letter-spacing:0.08em; color:#8892a4; text-transform:uppercase;
    transition:all 160ms; white-space:nowrap;
  }
  .snc-filter-btn:hover { border-color:#1e2433; color:#e8eaf0; background:rgba(255,255,255,0.04); }
  .snc-filter-btn.active { color:#fff; border-color:var(--fc); background:rgba(var(--fcr),0.12); box-shadow:0 0 8px rgba(var(--fcr),0.15); }

  .snc-layout { max-width:1400px; margin:0 auto; padding:24px 32px 48px; display:flex; gap:24px; }

  .snc-list { flex:1; min-width:0; display:flex; flex-direction:column; gap:12px; }

  .snc-empty {
    text-align:center; padding:60px 20px;
    font-family:'IBM Plex Mono',monospace; font-size:13px; color:#8892a4;
    border:1px solid #1e2433; border-radius:8px; letter-spacing:0.1em;
  }

  .snc-country-card {
    border:1px solid #1e2433; border-radius:10px; overflow:hidden;
    background:rgba(10,10,20,0.6); transition:border-color 180ms; cursor:pointer;
  }
  .snc-country-card:hover { border-color:rgba(198,40,40,0.25); }
  .snc-country-card.open { border-color:rgba(198,40,40,0.4); }

  .snc-card-header { display:flex; align-items:center; gap:14px; padding:16px 20px; }
  .snc-card-flag { font-size:28px; flex-shrink:0; }
  .snc-card-main { flex:1; min-width:0; }
  .snc-card-name { font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:700; color:#e8eaf0; }
  .snc-card-summary { font-size:13px; color:#8892a4; margin-top:3px; line-height:1.5; }
  .snc-card-badges { display:flex; flex-wrap:wrap; gap:5px; margin-top:8px; }

  .snc-severity {
    font-family:'IBM Plex Mono',monospace; font-size:10px; padding:3px 8px;
    border-radius:3px; letter-spacing:0.1em; text-transform:uppercase; flex-shrink:0;
    font-weight:600;
  }
  .snc-severity.critical { background:rgba(198,40,40,0.15); border:1px solid rgba(198,40,40,0.4); color:#ff6060; }
  .snc-severity.high     { background:rgba(230,81,0,0.12);  border:1px solid rgba(230,81,0,0.3);  color:#ff9040; }
  .snc-severity.medium   { background:rgba(106,27,154,0.12);border:1px solid rgba(106,27,154,0.3);color:#ce93d8; }
  .snc-severity.low      { background:rgba(46,125,50,0.12); border:1px solid rgba(46,125,50,0.3); color:#81c784; }

  .snc-type-badge {
    font-family:'IBM Plex Mono',monospace; font-size:10px; padding:3px 8px;
    border-radius:3px; letter-spacing:0.06em; border:1px solid rgba(255,255,255,0.1);
    background:rgba(255,255,255,0.05); color:#8892a4;
  }
  .snc-issuer-dot {
    display:inline-flex; align-items:center; gap:5px;
    font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8892a4;
    padding:3px 8px; border-radius:3px; border:1px solid rgba(255,255,255,0.08);
    background:rgba(255,255,255,0.04);
  }
  .snc-count-badge {
    font-family:'IBM Plex Mono',monospace; font-size:11px;
    padding:4px 10px; border-radius:4px;
    background:rgba(198,40,40,0.1); border:1px solid rgba(198,40,40,0.25);
    color:#ff8080; flex-shrink:0;
  }

  .snc-sanctions-list { border-top:1px solid #1e2433; }
  .snc-sanction-row {
    padding:16px 20px; border-bottom:1px solid rgba(30,36,51,0.6);
    display:flex; gap:16px; align-items:flex-start;
    transition:background 160ms;
  }
  .snc-sanction-row:last-child { border-bottom:none; }
  .snc-sanction-row:hover { background:rgba(255,255,255,0.02); }

  .snc-sanction-icon { font-size:20px; flex-shrink:0; margin-top:2px; }
  .snc-sanction-body { flex:1; min-width:0; }
  .snc-sanction-title { font-size:15px; font-weight:600; color:#e8eaf0; margin-bottom:4px; }
  .snc-sanction-desc { font-size:13px; color:#8892a4; line-height:1.6; margin-bottom:8px; }
  .snc-sanction-meta { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
  .snc-sanction-date {
    font-family:'IBM Plex Mono',monospace; font-size:10px; color:#8892a4;
    letter-spacing:0.08em;
  }
  .snc-legal {
    font-family:'IBM Plex Mono',monospace; font-size:10px; color:#4a5568;
    letter-spacing:0.06em; border-left:2px solid #1e2433; padding-left:8px;
    font-style:italic;
  }
  .snc-status {
    font-family:'IBM Plex Mono',monospace; font-size:10px; padding:2px 7px;
    border-radius:3px; letter-spacing:0.08em; text-transform:uppercase;
  }
  .snc-status.active  { background:rgba(198,40,40,0.12); border:1px solid rgba(198,40,40,0.3); color:#ff6060; }
  .snc-status.partial { background:rgba(230,81,0,0.12);  border:1px solid rgba(230,81,0,0.3);  color:#ff9040; }
  .snc-status.expired { background:rgba(100,100,100,0.1);border:1px solid rgba(100,100,100,0.2);color:#8892a4; }

  .snc-issuer-pill {
    display:inline-flex; align-items:center; gap:5px;
    font-family:'IBM Plex Mono',monospace; font-size:10px;
    padding:3px 8px; border-radius:12px; letter-spacing:0.08em;
    border:1px solid; flex-shrink:0;
  }

  .snc-sidebar { width:240px; flex-shrink:0; }
  .snc-sidebar-card {
    background:rgba(10,10,20,0.8); border:1px solid #1e2433;
    border-radius:8px; padding:16px; margin-bottom:16px;
  }
  .snc-sidebar-title {
    font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.14em;
    color:#8892a4; text-transform:uppercase; margin-bottom:12px;
    padding-bottom:8px; border-bottom:1px solid #1e2433;
  }
  .snc-sidebar-row {
    display:flex; justify-content:space-between; align-items:center;
    padding:6px 0; border-bottom:1px solid rgba(30,36,51,0.4);
  }
  .snc-sidebar-row:last-child { border-bottom:none; }
  .snc-sidebar-label { font-size:12px; color:#8892a4; }
  .snc-sidebar-val { font-family:'IBM Plex Mono',monospace; font-size:12px; color:#e8eaf0; }
  .snc-sidebar-val.red { color:#ff6060; }

  @keyframes snc-fade { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .snc-animate { animation:snc-fade 300ms ease both; }
  @keyframes snc-pulse { 0%,100%{opacity:1;}50%{opacity:0.4;} }
  .snc-pulse { animation:snc-pulse 2s infinite; }

  @media (max-width:900px) {
    .snc-layout { flex-direction:column; padding:16px; }
    .snc-sidebar { width:100%; }
    .snc-controls { padding:16px 16px 0; }
    .snc-hero { padding:40px 20px 28px; }
    .snc-global-stats { max-width:100%; }
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
      <div className="snc-sanction-icon">{stype?.icon ?? '📋'}</div>
      <div className="snc-sanction-body">
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
          <div className="snc-sanction-title">{sanction.title}</div>
          <span className={`snc-status ${sanction.status}`}>{sanction.status}</span>
        </div>
        <div className="snc-sanction-desc">{sanction.description}</div>
        <div className="snc-sanction-meta">
          {issuer && (
            <span
              className="snc-issuer-pill"
              style={{ borderColor:`rgba(${hexToRgb(issuer.color)},0.4)`, color:issuer.color, background:`rgba(${hexToRgb(issuer.color)},0.08)` }}
            >
              {issuer.flag} {issuer.name}
            </span>
          )}
          {stype && (
            <span style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:10, color:stype.color, letterSpacing:'0.08em' }}>
              {stype.label}
            </span>
          )}
          <span className="snc-sanction-date">
            Imposed: {sanction.imposed}
            {sanction.expanded ? ` · Expanded: ${sanction.expanded}` : ''}
            {sanction.expired  ? ` · Expired: ${sanction.expired}`   : ''}
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
        <div className="snc-card-flag">{country.flag}</div>
        <div className="snc-card-main">
          <div className="snc-card-name">{country.name}</div>
          <div className="snc-card-summary">{country.summary}</div>
          <div className="snc-card-badges">
            {issuersPresent.map(id => {
              const iss = ISSUERS.find(i => i.id === id);
              return iss ? (
                <span key={id} className="snc-issuer-dot">
                  <span style={{ width:6, height:6, borderRadius:'50%', background:iss.color, display:'inline-block' }} />
                  {iss.id}
                </span>
              ) : null;
            })}
            {typesPresent.map(id => {
              const t = SANCTION_TYPES.find(s => s.id === id);
              return t ? <span key={id} className="snc-type-badge">{t.icon} {t.label}</span> : null;
            })}
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
          <span className={`snc-severity ${country.severity}`}>{country.severity}</span>
          <span className="snc-count-badge">{filteredSanctions.length} sanction{filteredSanctions.length!==1?'s':''}</span>
          <span style={{ color:'#8892a4', fontSize:18 }}>{open ? '▲' : '▼'}</span>
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

  const [search,       setSearch]       = useState('');
  const [activeIssuer, setActiveIssuer] = useState(null);
  const [activeType,   setActiveType]   = useState(null);

  const filtered = useMemo(() => {
    return SANCTIONED_COUNTRIES
      .filter(c => {
        if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
        // Must have at least one sanction matching filters
        const matching = c.sanctions.filter(s => {
          if (activeIssuer && s.issuer !== activeIssuer) return false;
          if (activeType   && s.type   !== activeType)   return false;
          return true;
        });
        return matching.length > 0;
      })
      .sort((a, b) => (SEVERITY_ORDER[a.severity] ?? 9) - (SEVERITY_ORDER[b.severity] ?? 9));
  }, [search, activeIssuer, activeType]);

  // Sidebar stats
  const totalSanctions = SANCTIONED_COUNTRIES.reduce((n, c) => n + c.sanctions.length, 0);
  const bySeverity = { critical:0, high:0, medium:0, low:0 };
  SANCTIONED_COUNTRIES.forEach(c => { bySeverity[c.severity] = (bySeverity[c.severity]||0)+1; });
  const byIssuer = {};
  SANCTIONED_COUNTRIES.forEach(c => c.sanctions.forEach(s => { byIssuer[s.issuer]=(byIssuer[s.issuer]||0)+1; }));
  const byType = {};
  SANCTIONED_COUNTRIES.forEach(c => c.sanctions.forEach(s => { byType[s.type]=(byType[s.type]||0)+1; }));

  return (
    <div className="snc-page">
      <style>{CSS}</style>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="snc-hero">
        <div style={{ position:'relative', zIndex:2 }}>
          <div className="snc-hero-badge">
            <span className="snc-pulse">⬤</span>
            Sanctions Intelligence · Updated 2024
          </div>
          <h1 className="snc-title">GLOBAL<br/><span>SANCTIONS</span><br/>TRACKER</h1>
          <p className="snc-sub">
            Comprehensive database of UN, US, EU, and UK sanctions regimes — arms embargoes, financial restrictions, travel bans, trade controls, and energy sanctions.
          </p>
          <div className="snc-global-stats">
            {[
              { val: SANCTIONED_COUNTRIES.length, label: 'Countries' },
              { val: totalSanctions, label: 'Sanctions' },
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
          <svg className="snc-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            className="snc-search"
            placeholder="> SEARCH COUNTRY..."
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
                {iss.flag} {iss.id}
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
                {t.icon} {t.label}
              </button>
            );
          })}
        </div>

        {/* Clear */}
        {(activeIssuer || activeType || search) && (
          <button
            className="snc-filter-btn"
            onClick={() => { setActiveIssuer(null); setActiveType(null); setSearch(''); }}
            style={{ borderColor:'rgba(198,40,40,0.3)', color:'#ff8080' }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── Main layout ───────────────────────────────────────────────── */}
      <div className="snc-layout">

        {/* Country list */}
        <div className="snc-list">
          {filtered.length === 0
            ? <div className="snc-empty">NO SANCTIONS MATCH CURRENT FILTERS</div>
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
            <div className="snc-sidebar-title">By Severity</div>
            {Object.entries(bySeverity).map(([sev, count]) => (
              <div key={sev} className="snc-sidebar-row">
                <span className={`snc-severity ${sev}`} style={{ fontSize:9 }}>{sev}</span>
                <span className="snc-sidebar-val red">{count}</span>
              </div>
            ))}
          </div>

          <div className="snc-sidebar-card">
            <div className="snc-sidebar-title">By Issuer</div>
            {ISSUERS.map(iss => (
              <div key={iss.id} className="snc-sidebar-row">
                <span className="snc-sidebar-label">{iss.flag} {iss.name}</span>
                <span className="snc-sidebar-val">{byIssuer[iss.id] ?? 0}</span>
              </div>
            ))}
          </div>

          <div className="snc-sidebar-card">
            <div className="snc-sidebar-title">By Type</div>
            {SANCTION_TYPES.map(t => (
              <div key={t.id} className="snc-sidebar-row">
                <span className="snc-sidebar-label">{t.icon} {t.label}</span>
                <span className="snc-sidebar-val">{byType[t.id] ?? 0}</span>
              </div>
            ))}
          </div>

          <div className="snc-sidebar-card" style={{ fontSize:11, color:'#4a5568', lineHeight:1.7, fontFamily:'IBM Plex Mono,monospace', letterSpacing:'0.06em' }}>
            <div className="snc-sidebar-title">Sources</div>
            UN Security Council<br/>
            OFAC SDN List (US)<br/>
            EU Consolidated List<br/>
            UK OFSI Register<br/>
            Arms Control Association<br/>
            <div style={{ marginTop:8, color:'#3a4050' }}>Data as of 2024</div>
          </div>
        </div>
      </div>
    </div>
  );
}