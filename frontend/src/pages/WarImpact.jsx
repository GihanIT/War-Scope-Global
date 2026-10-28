// src/pages/WarImpact.jsx
import { useState, useEffect, useMemo } from 'react';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO      from '../seo/SEO.jsx';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, AreaChart, Area, CartesianGrid,
} from 'recharts';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@400;600;700;900&display=swap');
:root{--c:#00d4ff;--r:#ff3b3b;--g:#00e676;--y:#f0b429;--o:#ff9800;--pu:#a78bfa;--dim:rgba(160,175,200,0.75);--bd:rgba(0,212,255,0.15);--bg:#05070f;--card:rgba(8,12,24,0.75)}
*{box-sizing:border-box;margin:0;padding:0}
.wi{min-height:100dvh;background:var(--bg);font-family:'IBM Plex Mono',monospace;position:relative;overflow-x:hidden;color:#e2e8f0}
.wi::before{content:'';position:fixed;inset:0;background-image:linear-gradient(rgba(0,212,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.03) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;z-index:0}
.wi-wrap{position:relative;z-index:1;max-width:1440px;margin:0 auto;padding:0 clamp(16px,4vw,40px) 80px}

/* Header */
.wi-hdr{padding:40px 0 32px}
.wi-eye{font-size:11px;font-weight:600;letter-spacing:.25em;color:var(--c);text-transform:uppercase;margin-bottom:16px;display:flex;align-items:center;gap:10px}
.wi-dot{width:8px;height:8px;border-radius:50%;background:var(--r);box-shadow:0 0 12px var(--r);animation:blink 1.5s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1;box-shadow:0 0 12px var(--r)}50%{opacity:.4;box-shadow:0 0 4px var(--r)}}
.wi-h1{font-family:'Barlow Condensed',sans-serif;font-size:clamp(40px,7vw,72px);font-weight:900;color:#ffffff;line-height:1.05;text-transform:uppercase;letter-spacing:.02em;margin-bottom:16px}
.wi-h1 em{color:var(--r);font-style:normal;text-shadow:0 0 40px rgba(255,59,59,0.3)}
.wi-sub{font-size:13px;color:var(--dim);letter-spacing:.03em;max-width:720px;line-height:1.8}

/* 2-COLUMN LAYOUT */
.wi-layout{display:grid;grid-template-columns:300px 1fr;gap:32px;align-items:start}
.wi-sidebar{display:flex;flex-direction:column;gap:24px;position:sticky;top:32px;height:max-content}
.wi-main{min-width:0;display:flex;flex-direction:column;gap:24px}

/* Ad Wrappers */
.wi-ad-center{display:flex;justify-content:center;width:100%;overflow:hidden}
.wi-mobile-ad{display:none}
.wi-desktop-ad{display:flex}

/* Compact Sidebar Conflict List */
.wi-sidebar-title{font-size:10px;font-weight:700;letter-spacing:.2em;color:var(--dim);text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:10px;margin-bottom:-10px}
.wi-list-card{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.05);border-radius:8px;padding:12px 14px;cursor:pointer;transition:all 200ms;position:relative;overflow:hidden;display:flex;flex-direction:column;gap:6px}
.wi-list-card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent);opacity:0.3;transition:opacity 200ms}
.wi-list-card:hover{background:rgba(255,255,255,0.03);border-color:rgba(255,255,255,0.15)}
.wi-list-card.active{background:rgba(12,18,34,0.9);border-color:var(--accent);box-shadow:0 4px 20px rgba(0,0,0,0.4)}
.wi-list-card.active::before{opacity:1;box-shadow:0 0 10px var(--accent)}
.wi-lc-head{display:flex;align-items:center;justify-content:space-between}
.wi-lc-name{font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:#fff;letter-spacing:.02em;text-transform:uppercase}
.wi-lc-region{font-size:10px;color:var(--dim);letter-spacing:.05em}
.wi-lc-tags{display:flex;gap:4px;flex-wrap:wrap;margin-top:2px}
.wi-lc-tag{font-size:8px;font-weight:700;padding:2px 5px;border-radius:3px;text-transform:uppercase;background:rgba(255,255,255,0.05);color:var(--dim)}
.wi-lc-tag.active-tag{background:var(--accent);color:#000;box-shadow:0 0 8px var(--accent)}

/* Common Box Panel */
.wi-box{background:var(--card);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:24px;backdrop-filter:blur(16px);box-shadow:0 8px 32px rgba(0,0,0,0.2)}
.wi-box-title{font-size:12px;font-weight:600;letter-spacing:.15em;color:var(--dim);text-transform:uppercase;margin-bottom:20px;display:flex;align-items:center;gap:8px}

/* Enhanced Swipeable Tabs */
.wi-tabs{display:flex;gap:8px;background:rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:8px;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;box-shadow:inset 0 4px 20px rgba(0,0,0,0.5)}
.wi-tabs::-webkit-scrollbar{display:none}
.wi-tab{flex:1;min-width:max-content;padding:14px 24px;border-radius:8px;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;border:none;cursor:pointer;transition:all 200ms;color:var(--dim);background:transparent;white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:8px}
.wi-tab.on{background:rgba(0,212,255,0.15);color:#fff;box-shadow:0 0 15px rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3)}
.wi-tab:hover:not(.on){color:#f0f4ff;background:rgba(255,255,255,0.05)}

/* Panel Grids */
.wi-comm-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px;padding:16px 20px;background:rgba(0,0,0,0.3);border-radius:10px;border:1px solid rgba(255,255,255,0.05)}
.wi-comm-grid{display:grid;grid-template-columns:1fr 300px;gap:24px}
.wi-ccy-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:16px}
.wi-ccy-card{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:18px 20px;transition:transform 200ms}
.wi-ccy-card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,0.15)}
.wi-ccy-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
.wi-ccy-iso{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:.04em}
.wi-ccy-code{font-size:11px;color:var(--dim);letter-spacing:.1em}
.wi-ccy-change{font-size:22px;font-weight:700}
.wi-ccy-change.worse{color:var(--r)}
.wi-ccy-change.better{color:var(--g)}
.wi-ccy-detail{font-size:11px;color:var(--dim);line-height:1.7}
.wi-ccy-bar{height:6px;border-radius:3px;background:rgba(255,255,255,0.08);margin-top:14px;overflow:hidden}
.wi-ccy-fill{height:100%;border-radius:3px;box-shadow:0 0 10px currentColor}
.wi-econ-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.wi-econ-card{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:24px}
.wi-ref-grid, .wi-exp-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.wi-exp-list{display:flex;flex-direction:column;gap:8px}
.wi-exp-row{display:flex;align-items:center;gap:12px;padding:10px 14px;background:rgba(255,255,255,0.03);border-radius:8px;border:1px solid rgba(255,255,255,0.04);transition:background 200ms}
.wi-exp-row:hover{background:rgba(255,255,255,0.06)}
.wi-exp-flag{width:28px;height:18px;object-fit:cover;border-radius:3px;flex-shrink:0}
.wi-exp-iso{font-size:13px;font-weight:600;color:#ffffff;min-width:38px}
.wi-exp-level{font-size:10px;font-weight:700;letter-spacing:.1em;padding:3px 8px;border-radius:4px;margin-left:auto;white-space:nowrap}
.exp-high{background:rgba(255,59,59,0.15);color:var(--r);border:1px solid rgba(255,59,59,0.3)}
.exp-med{background:rgba(240,180,41,0.15);color:var(--y);border:1px solid rgba(240,180,41,0.3)}

/* Loading */
.wi-load{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:100px 20px;gap:16px}
.wi-spin{width:40px;height:40px;border:3px solid rgba(0,212,255,0.1);border-top-color:var(--c);border-radius:50%;animation:spin 800ms linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.wi-lt{font-size:12px;font-weight:600;color:#fff;letter-spacing:.15em}

@keyframes fup{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
.fup{animation:fup 400ms cubic-bezier(.16,1,.3,1) both}

/* Custom tooltip */
.wi-tip{background:rgba(8,12,24,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:12px 16px;font-family:'IBM Plex Mono',monospace;font-size:12px;color:#fff;box-shadow:0 8px 32px rgba(0,0,0,0.5);backdrop-filter:blur(8px)}
.wi-tip-label{font-size:10px;color:var(--dim);letter-spacing:.1em;margin-bottom:8px;text-transform:uppercase}

/* Specific Tag Colors */
.tag-oil{color:#ff9800} .tag-gas{color:var(--c)} .tag-wheat{color:var(--y)} .tag-corn{color:#84cc16} .tag-copper{color:var(--pu)}

/* Responsive Overrides */
@media(max-width:1100px){
  .wi-layout { grid-template-columns: 260px 1fr; }
}
@media(max-width:960px){
  .wi-layout { grid-template-columns: 1fr; }
  .wi-sidebar { position: static; flex-direction: row; flex-wrap: wrap; align-items: stretch; }
  .wi-sidebar-title { width: 100%; }
  .wi-conflict-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; width: 100%; }
  .wi-econ-grid, .wi-ref-grid, .wi-exp-grid {grid-template-columns:1fr}
  .wi-comm-grid {grid-template-columns:1fr}
  .wi-desktop-ad, .wi-ad-160 { display: none !important; }
  .wi-mobile-ad { display: flex; justify-content: center; width: 100%; }
}
@media(max-width:600px){
  .wi-hdr {padding: 32px 0 24px}
  .wi-box {padding: 16px}
  .wi-comm-stats {grid-template-columns: 1fr}
  .wi-tab { flex: 1; padding: 12px 14px; font-size: 10px; }
}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const e = document.createElement('style'); e.id = id; e.textContent = css; document.head.appendChild(e);
}

const i2 = iso3 => {
  const m = {USA:'us',RUS:'ru',CHN:'cn',IND:'in',BRA:'br',GBR:'gb',FRA:'fr',DEU:'de',JPN:'jp',KOR:'kr',AUS:'au',CAN:'ca',SAU:'sa',IRN:'ir',TUR:'tr',ISR:'il',PAK:'pk',IDN:'id',MEX:'mx',ARG:'ar',NGA:'ng',ZAF:'za',EGY:'eg',IRQ:'iq',SYR:'sy',UKR:'ua',POL:'pl',SWE:'se',NOR:'no',FIN:'fi',ESP:'es',ITA:'it',NLD:'nl',BEL:'be',CHE:'ch',AUT:'at',GRC:'gr',PRT:'pt',CZE:'cz',HUN:'hu',ROU:'ro',BGR:'bg',SRB:'rs',HRV:'hr',SVK:'sk',SVN:'si',LTU:'lt',LVA:'lv',EST:'ee',BLR:'by',KAZ:'kz',VNM:'vn',THA:'th',MYS:'my',PHL:'ph',SGP:'sg',MMR:'mm',BGD:'bd',LKA:'lk',NPL:'np',PRK:'kp',MNG:'mn',NZL:'nz',CHL:'cl',COL:'co',PER:'pe',VEN:'ve',ECU:'ec',BOL:'bo',PRY:'py',URY:'uy',PAN:'pa',CRI:'cr',GTM:'gt',HND:'hn',SLV:'sv',NIC:'ni',CUB:'cu',DOM:'do',HTI:'ht',MAR:'ma',DZA:'dz',TUN:'tn',LBY:'ly',SDN:'sd',ETH:'et',KEN:'ke',TZA:'tz',UGA:'ug',MOZ:'mz',ZMB:'zm',ZWE:'zw',BWA:'bw',NAM:'na',AGO:'ao',CMR:'cm',SEN:'sn',GHA:'gh',CIV:'ci',JOR:'jo',LBN:'lb',OMN:'om',YEM:'ye',KWT:'kw',BHR:'bh',QAT:'qa',ARE:'ae',AZE:'az',ARM:'am',GEO:'ge',ALB:'al',MKD:'mk',BIH:'ba',MNE:'me',LUX:'lu',MLT:'mt',CYP:'cy',ISL:'is',IRL:'ie',DNK:'dk',UZB:'uz',TKM:'tm',KGZ:'kg',TJK:'tj',AFG:'af',KHM:'kh',LAO:'la',TCD:'td',NER:'ne',MLI:'ml',BFA:'bf',GIN:'gn',LBR:'lr',SLE:'sl',GMB:'gm',TGO:'tg',BEN:'bj',GAB:'ga',COG:'cg',COD:'cd',CAF:'cf',SOM:'so',DJI:'dj',ERI:'er',RWA:'rw',BDI:'bi',PSE:'ps',SSD:'ss',MRT:'mr',GNB:'gw'};
  return m[iso3] ?? iso3.toLowerCase().slice(0,2);
};

const fmt = (v, d=1) => v == null ? '—' : parseFloat(v).toFixed(d);
const fmtBig = v => !v ? '—' : v>=1e6 ? (v/1e6).toFixed(1)+'M' : v>=1e3 ? (v/1e3).toFixed(0)+'K' : v;
const fmtUSD = v => !v ? '—' : v>=1e12?'$'+(v/1e12).toFixed(1)+'T':v>=1e9?'$'+(v/1e9).toFixed(1)+'B':'$'+(v/1e6).toFixed(0)+'M';

function WiTooltip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="wi-tip">
      <div className="wi-tip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color, fontSize: 13, fontWeight: 600, marginTop: 4 }}>
          {p.name}: {fmt(p.value)}{unit ?? ''}
        </div>
      ))}
    </div>
  );
}

const COMM_META = {
  oil:        { label:'Crude Oil (WTI)',  unit:'$/barrel', color:'#ff9800', fn:'WTI' },
  gas:        { label:'Natural Gas',      unit:'$/mmbtu',  color:'#00d4ff', fn:'NATURAL_GAS' },
  wheat:      { label:'Wheat',            unit:'$/bushel', color:'#f0b429', fn:'WHEAT' },
  corn:       { label:'Corn / Maize',     unit:'$/bushel', color:'#84cc16', fn:'CORN' },
  fertilizer: { label:'Copper',           unit:'$/lb',     color:'#a78bfa', fn:'COPPER' },
};

function CommodityPanel({ commodities, conflictId, startYear }) {
  const [active, setActive] = useState('oil');

  if (commodities && commodities._status === 'fetching') {
    return (
      <div className="wi-box">
        <div className="wi-box-title">Global Commodity Price Shocks</div>
        <div className="wi-load">
          <div className="wi-spin"/>
          <div className="wi-lt">COMPILING LIVE FUTURES DATA...</div>
          <div style={{ fontSize: 11, color: 'var(--dim)', marginTop: 4 }}>Securing connection to Yahoo Finance market feeds. Updates automatically.</div>
        </div>
      </div>
    );
  }

  const meta = COMM_META[active];
  const data = commodities?.[active] ?? [];

  if (data.length === 0) {
    return (
      <div className="wi-box">
        <div className="wi-box-title">Global Commodity Price Shocks</div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
          {Object.entries(COMM_META).map(([k, m]) => (
            <button key={k} onClick={() => setActive(k)}
              style={{ padding:'8px 16px', borderRadius:8, border:`1px solid ${active===k ? m.color : 'rgba(255,255,255,0.1)'}`, background: active===k ? `${m.color}22` : 'rgba(0,0,0,0.2)', color: active===k ? '#fff' : 'var(--dim)', cursor:'pointer', fontFamily:'IBM Plex Mono,monospace', fontSize:11, fontWeight:600, letterSpacing:'.08em', transition:'all 200ms' }}>
              {m.label}
            </button>
          ))}
        </div>
        <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--dim)', fontSize: 13, background:'rgba(0,0,0,0.2)', borderRadius:8, border:'1px dashed rgba(255,255,255,0.1)' }}>
          Data currently unavailable for {meta.label}. The market feed may be temporarily restricted.
        </div>
      </div>
    );
  }

  const recent = data.slice(-3);
  const pieData = recent.map(d => ({ name: String(d.year), value: Math.round(d.value * 10) / 10 }));
  const lineData = data.map(d => ({ year: String(d.year), value: Math.round(d.value * 10) / 10 }));

  const latest = data[data.length - 1];
  const prewar = data.find(d => d.year === startYear - 1);
  const pct = prewar && latest ? ((latest.value - prewar.value) / prewar.value * 100).toFixed(1) : null;

  return (
    <div className="wi-box fup">
      <div className="wi-box-title">Global Commodity Price Shocks</div>

      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {Object.entries(COMM_META).map(([k, m]) => (
          <button key={k} onClick={() => setActive(k)}
            style={{ padding:'8px 16px', borderRadius:8, border:`1px solid ${active===k ? m.color : 'rgba(255,255,255,0.1)'}`, background: active===k ? `${m.color}22` : 'rgba(0,0,0,0.2)', color: active===k ? '#fff' : 'var(--dim)', cursor:'pointer', fontFamily:'IBM Plex Mono,monospace', fontSize:11, fontWeight:600, letterSpacing:'.08em', transition:'all 200ms', boxShadow: active===k ? `0 0 15px ${m.color}33` : 'none' }}>
            {m.label}
          </button>
        ))}
      </div>

      {latest && (
        <div className="wi-comm-stats">
          <div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.2em', color:'var(--dim)', marginBottom:6 }}>LATEST LIVE PRICE</div>
            <div style={{ fontSize:32, fontWeight:700, color: meta.color, display:'flex', alignItems:'baseline', gap:6 }}>
              {fmt(latest.value, 1)}<span style={{ fontSize:13, color:'var(--dim)', fontWeight:500 }}>{meta.unit}</span>
            </div>
            <div style={{ fontSize:11, color:'var(--dim)', marginTop:4, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{display:'inline-block', width:6, height:6, borderRadius:'50%', background:'var(--g)', boxShadow:'0 0 8px var(--g)'}}></span>
              {latest.year} Active Market
            </div>
          </div>
          {pct !== null && (
            <div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.2em', color:'var(--dim)', marginBottom:6 }}>WAR IMPACT (CHANGE)</div>
              <div style={{ fontSize:32, fontWeight:700, color: parseFloat(pct) > 0 ? 'var(--r)' : 'var(--g)' }}>
                {parseFloat(pct) > 0 ? '+' : ''}{pct}%
              </div>
              <div style={{ fontSize:11, color:'var(--dim)', marginTop:4 }}>{prewar.year} → Current</div>
            </div>
          )}
          {prewar && (
            <div>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.2em', color:'var(--dim)', marginBottom:6 }}>PRE-WAR PRICE ({prewar.year})</div>
              <div style={{ fontSize:32, fontWeight:700, color:'#ffffff' }}>{fmt(prewar.value, 1)}</div>
              <div style={{ fontSize:11, color:'var(--dim)', marginTop:4 }}>{meta.unit}</div>
            </div>
          )}
        </div>
      )}

      <div className="wi-comm-grid">
        <div>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:16 }}>PRICE HISTORY (2015–PRESENT)</div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={lineData} margin={{ left:0, right:8, top:8, bottom:0 }}>
              <defs>
                <linearGradient id={`grad_${active}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={meta.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={meta.color} stopOpacity={0.01}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="year" tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} dy={10}/>
              <YAxis tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} width={50} dx={-10}/>
              <Tooltip content={<WiTooltip unit={' '+meta.unit}/>}/>
              {startYear && <ReferenceLine x={String(startYear)} stroke="var(--r)" strokeWidth={2} strokeDasharray="4 4" label={{ value:'WAR START', fill:'var(--r)', fontSize:10, fontFamily:'IBM Plex Mono,monospace', position:'insideTopLeft', dy:-10 }}/>}
              <Area type="monotone" dataKey="value" name={meta.label} stroke={meta.color} strokeWidth={3} fill={`url(#grad_${active})`} dot={{r:3, fill:meta.color, strokeWidth:0}} activeDot={{ r:6, fill:'#fff', stroke:meta.color, strokeWidth:2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {pieData.length > 0 && (
          <div>
            <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:16 }}>LAST 3 YEARS COMPARISON</div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={55}
                  paddingAngle={4} label={({ name, value }) => `${name}: ${fmt(value)}`}
                  labelLine={{ stroke: 'rgba(255,255,255,0.1)' }}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={[meta.color, `${meta.color}99`, `${meta.color}55`][i]} style={{outline:'none'}}/>
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${fmt(v)} ${meta.unit}`, meta.label]}
                  contentStyle={{ background:'rgba(8,12,24,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, fontFamily:'IBM Plex Mono,monospace', fontSize:12, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

function CurrencyPanel({ currencies, conflictCountries }) {
  const relevant = useMemo(() => {
    if (!currencies) return [];
    return Object.entries(currencies)
      .map(([iso3, d]) => ({ iso3, ...d }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  }, [currencies]);

  const barData = relevant.slice(0, 12).map(c => ({
    iso3: c.iso3,
    change: Math.round(c.change * 10) / 10,
    currency: c.currency,
  }));

  return (
    <div className="wi-box fup">
      <div className="wi-box-title">War Currency Depreciation vs USD — Pre-War Baseline</div>
      <div style={{ marginBottom:32, paddingBottom:32, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:16 }}>% DEPRECIATION SINCE 2021 BASELINE (POSITIVE = WORSE)</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} layout="vertical" margin={{ left:48, right:48, top:0, bottom:0 }}>
            <XAxis type="number" tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} tickFormatter={v => v+'%'}/>
            <YAxis type="category" dataKey="iso3" width={44} tick={{ fill:'rgba(160,175,200,0.8)', fontSize:11, fontFamily:'IBM Plex Mono,monospace', fontWeight:600 }} axisLine={false} tickLine={false}/>
            <ReferenceLine x={0} stroke="rgba(255,255,255,0.2)"/>
            <Tooltip content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload;
              return <div className="wi-tip"><div className="wi-tip-label">{d.iso3} ({d.currency})</div><div style={{ color: d.change > 0 ? 'var(--r)' : 'var(--g)', fontSize:16, fontWeight:700 }}>{d.change > 0 ? '+' : ''}{d.change}% vs USD</div></div>;
            }} cursor={{fill:'rgba(255,255,255,0.02)'}}/>
            <Bar dataKey="change" radius={[0,6,6,0]} maxBarSize={16}>
              {barData.map(d => <Cell key={d.iso3} fill={d.change > 100 ? '#ff3b3b' : d.change > 50 ? '#ff9800' : d.change > 0 ? '#f0b429' : '#00e676'}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="wi-ccy-grid">
        {relevant.map(c => {
          const isConflict = conflictCountries?.includes(c.iso3);
          const pct = Math.min(Math.abs(c.change) / 200 * 100, 100);
          return (
            <div key={c.iso3} className="wi-ccy-card" style={{ borderColor: isConflict ? 'rgba(255,59,59,0.4)' : undefined, boxShadow: isConflict ? 'inset 0 0 20px rgba(255,59,59,0.05)' : 'none' }}>
              <div className="wi-ccy-head">
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <img src={`https://flagcdn.com/w40/${i2(c.iso3)}.png`} style={{ width:24, height:16, objectFit:'cover', borderRadius:3 }} onError={e=>{e.target.style.display='none';}} alt=""/>
                    <span className="wi-ccy-iso">{c.iso3}</span>
                    {isConflict && <span style={{ fontSize:9, fontWeight:700, color:'#fff', background:'var(--r)', padding:'2px 6px', borderRadius:4, letterSpacing:'.1em' }}>WAR</span>}
                  </div>
                  <div className="wi-ccy-code" style={{marginTop:4}}>{c.currency}/USD</div>
                </div>
                <div className={`wi-ccy-change ${c.worse ? 'worse' : 'better'}`}>
                  {c.worse ? '+' : ''}{fmt(c.change, 1)}%
                </div>
              </div>
              <div className="wi-ccy-detail">
                <div style={{display:'flex', justifyContent:'space-between'}}><span>2021 baseline:</span> <span style={{color:'#fff'}}>{c.baseline}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', marginTop:4}}><span>Current rate:</span> <span style={{color:'#fff', fontWeight:600}}>{c.current}</span></div>
              </div>
              <div className="wi-ccy-bar">
                <div className="wi-ccy-fill" style={{ width: pct+'%', background: c.worse ? (c.change > 100 ? 'var(--r)' : 'var(--o)') : 'var(--g)', color: c.worse ? (c.change > 100 ? 'var(--r)' : 'var(--o)') : 'var(--g)' }}/>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EconPanel({ econData, conflict }) {
  const COLORS = ['#00d4ff','#ff3b3b','#f0b429','#00e676'];

  if (!econData || !conflict) return <div style={{ padding:40, textAlign:'center', color:'var(--dim)', fontSize:13 }}>No economic data available for this region.</div>;

  const countryEntries = Object.entries(econData);

  function buildChart(key) {
    const allYears = new Set();
    countryEntries.forEach(([, d]) => d[key]?.forEach(r => allYears.add(r.year)));
    const years = [...allYears].sort();
    return years.map(y => {
      const row = { year: String(y) };
      countryEntries.forEach(([iso3, d]) => {
        const found = d[key]?.find(r => r.year === y);
        if (found) row[iso3] = Math.round(found.value * 10) / 10;
      });
      return row;
    });
  }

  const gdpGrowthData  = buildChart('growth');
  const inflationData  = buildChart('inflation');
  const gdpAbsData     = buildChart('gdp');

  const gdpChart = gdpAbsData.map(r => {
    const row = { year: r.year };
    countryEntries.forEach(([iso3]) => { if (r[iso3] != null) row[iso3] = Math.round(r[iso3] / 1e9); });
    return row;
  });

  const unempData = buildChart('unemployment');

  return (
    <div className="fup">
      <div className="wi-econ-grid">
        <div className="wi-econ-card">
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:16 }}>GDP GROWTH RATE (%)</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={gdpGrowthData} margin={{ left:0, right:8, top:8, bottom:0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="year" tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} dy={10}/>
              <YAxis tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} width={42} tickFormatter={v => v+'%'} dx={-10}/>
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)"/>
              {conflict.startYear && <ReferenceLine x={String(conflict.startYear)} stroke="var(--r)" strokeWidth={2} strokeDasharray="4 4" label={{ value:'WAR', fill:'var(--r)', fontSize:10, position:'insideTopLeft' }}/>}
              <Tooltip content={<WiTooltip unit="%"/>}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'IBM Plex Mono,monospace', paddingTop:12 }} iconType="circle"/>
              {countryEntries.map(([iso3], i) => (
                <Line key={iso3} type="monotone" dataKey={iso3} name={iso3} stroke={COLORS[i%COLORS.length]} strokeWidth={3} dot={{r:3, strokeWidth:0}} activeDot={{ r:6, strokeWidth:0 }}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="wi-econ-card">
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:16 }}>INFLATION RATE (%)</div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={inflationData} margin={{ left:0, right:8, top:8, bottom:0 }}>
              <defs>
                {countryEntries.map(([iso3], i) => (
                  <linearGradient key={iso3} id={`inf_${iso3}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={COLORS[i%COLORS.length]} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={COLORS[i%COLORS.length]} stopOpacity={0.01}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="year" tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} dy={10}/>
              <YAxis tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} width={42} tickFormatter={v => v+'%'} dx={-10}/>
              {conflict.startYear && <ReferenceLine x={String(conflict.startYear)} stroke="var(--r)" strokeWidth={2} strokeDasharray="4 4" label={{ value:'WAR', fill:'var(--r)', fontSize:10, position:'insideTopLeft' }}/>}
              <Tooltip content={<WiTooltip unit="%"/>}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'IBM Plex Mono,monospace', paddingTop:12 }} iconType="circle"/>
              {countryEntries.map(([iso3], i) => (
                <Area key={iso3} type="monotone" dataKey={iso3} name={iso3} stroke={COLORS[i%COLORS.length]} strokeWidth={3} fill={`url(#inf_${iso3})`} dot={{r:3, strokeWidth:0}} activeDot={{r:6, strokeWidth:0}}/>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="wi-econ-card">
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:16 }}>GDP SIZE (USD BILLIONS)</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={gdpChart} margin={{ left:0, right:8, top:8, bottom:0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="year" tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} dy={10}/>
              <YAxis tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} width={52} dx={-10}/>
              {conflict.startYear && <ReferenceLine x={String(conflict.startYear)} stroke="var(--r)" strokeWidth={2} strokeDasharray="4 4"/>}
              <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return <div className="wi-tip"><div className="wi-tip-label">{label}</div>{payload.map((p,i) => <div key={i} style={{ color:p.color, fontSize:13, fontWeight:600, marginTop:4 }}>{p.name}: {fmtUSD(p.value * 1e9)}</div>)}</div>;
              }} cursor={{fill:'rgba(255,255,255,0.02)'}}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'IBM Plex Mono,monospace', paddingTop:12 }} iconType="circle"/>
              {countryEntries.map(([iso3], i) => (
                <Bar key={iso3} dataKey={iso3} name={iso3} fill={COLORS[i%COLORS.length]} radius={[4,4,0,0]} maxBarSize={30}/>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="wi-econ-card">
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:16 }}>UNEMPLOYMENT RATE (%)</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={unempData} margin={{ left:0, right:8, top:8, bottom:0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false}/>
              <XAxis dataKey="year" tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} dy={10}/>
              <YAxis tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} width={40} tickFormatter={v => v+'%'} dx={-10}/>
              {conflict.startYear && <ReferenceLine x={String(conflict.startYear)} stroke="var(--r)" strokeWidth={2} strokeDasharray="4 4" label={{ value:'WAR', fill:'var(--r)', fontSize:10, position:'insideTopLeft' }}/>}
              <Tooltip content={<WiTooltip unit="%"/>}/>
              <Legend wrapperStyle={{ fontSize:11, fontFamily:'IBM Plex Mono,monospace', paddingTop:12 }} iconType="circle"/>
              {countryEntries.map(([iso3], i) => (
                <Line key={iso3} type="monotone" dataKey={iso3} name={iso3} stroke={COLORS[i%COLORS.length]} strokeWidth={3} dot={{r:3, strokeWidth:0}} activeDot={{r:6, strokeWidth:0}}/>
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function RefugeePanel({ refugees }) {
  if (!refugees) return <div className="wi-box" style={{ padding:60, textAlign:'center', color:'var(--dim)', fontSize:13 }}>No refugee data available for this conflict zone.</div>;

  const pieData = [
    { name: 'Internally Displaced', value: refugees.internal },
    { name: 'Refugees Abroad',      value: refugees.abroad ?? (refugees.total - refugees.internal) },
  ];
  const PCOLORS = ['#ff3b3b','#f0b429'];
  const totalCost = Math.round(refugees.total * (refugees.costPerPerson ?? 5000));

  return (
    <div className="wi-ref-grid fup">
      <div className="wi-box">
        <div className="wi-box-title">DISPLACEMENT BREAKDOWN</div>
        <div style={{ display:'flex', gap:32, alignItems:'center', flexWrap:'wrap' }}>
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={4}>
                {pieData.map((_, i) => <Cell key={i} fill={PCOLORS[i]} style={{outline:'none'}}/>)}
              </Pie>
              <Tooltip formatter={v => fmtBig(v)} contentStyle={{ background:'rgba(8,12,24,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, fontFamily:'IBM Plex Mono,monospace', fontSize:12, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ flex:1 }}>
            {pieData.map((d, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                <span style={{ width:12, height:12, borderRadius:3, background:PCOLORS[i], display:'inline-block', flexShrink:0, boxShadow:`0 0 10px ${PCOLORS[i]}88` }}/>
                <div>
                  <div style={{ fontSize:11, color:'var(--dim)', letterSpacing:'.08em', textTransform:'uppercase' }}>{d.name}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:'#ffffff' }}>{fmtBig(d.value)}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:6 }}>TOTAL DISPLACED</div>
              <div style={{ fontSize:32, fontWeight:700, color:'var(--r)' }}>{fmtBig(refugees.total)}</div>
            </div>
            <div style={{ marginTop:16 }}>
              <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)', marginBottom:6 }}>EST. HUMANITARIAN COST</div>
              <div style={{ fontSize:24, fontWeight:700, color:'var(--y)' }}>{fmtUSD(totalCost)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="wi-box">
        <div className="wi-box-title">TOP HOST COUNTRIES</div>
        {refugees.hosts?.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={refugees.hosts.map(h => ({ name: h.name, count: h.count, iso3: h.iso3 }))}
              layout="vertical" margin={{ left:80, right:20, top:0, bottom:0 }}>
              <XAxis type="number" tick={{ fill:'rgba(160,175,200,0.6)', fontSize:11, fontFamily:'IBM Plex Mono,monospace' }} axisLine={false} tickLine={false} tickFormatter={v => fmtBig(v)}/>
              <YAxis type="category" dataKey="name" width={78} tick={{ fill:'rgba(160,175,200,0.8)', fontSize:11, fontFamily:'IBM Plex Mono,monospace', fontWeight:600 }} axisLine={false} tickLine={false}/>
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const d = payload[0].payload;
                return <div className="wi-tip"><div className="wi-tip-label">{d.name}</div><div style={{ fontSize:16, fontWeight:700, color:'#f0b429' }}>{fmtBig(d.count)} displaced persons</div></div>;
              }} cursor={{fill:'rgba(255,255,255,0.03)'}}/>
              <Bar dataKey="count" fill="#f0b429" radius={[0,6,6,0]} maxBarSize={16}/>
            </BarChart>
          </ResponsiveContainer>
        ) : <div style={{ color:'var(--dim)', fontSize:12 }}>No host country data documented.</div>}
      </div>
    </div>
  );
}

function ExposurePanel({ exposure, reason }) {
  if (!exposure) return null;
  return (
    <div className="wi-exp-grid fup">
      <div className="wi-box">
        <div className="wi-box-title">HIGH EXPOSURE COUNTRIES</div>
        <div style={{ fontSize:12, color:'var(--r)', marginBottom:20, lineHeight:1.6, padding:'12px 16px', background:'rgba(255,59,59,0.1)', borderRadius:8, border:'1px solid rgba(255,59,59,0.2)' }}>
          {reason}
        </div>
        <div className="wi-exp-list">
          {exposure.high?.map(iso3 => (
            <div key={iso3} className="wi-exp-row">
              <img className="wi-exp-flag" src={`https://flagcdn.com/w40/${i2(iso3)}.png`} onError={e=>{e.target.style.display='none';}} alt=""/>
              <span className="wi-exp-iso">{iso3}</span>
              <span className="wi-exp-level exp-high">HIGH RISK</span>
            </div>
          ))}
        </div>
      </div>
      <div className="wi-box">
        <div className="wi-box-title">MODERATE EXPOSURE COUNTRIES</div>
        <div className="wi-exp-list">
          {exposure.med?.map(iso3 => (
            <div key={iso3} className="wi-exp-row">
              <img className="wi-exp-flag" src={`https://flagcdn.com/w40/${i2(iso3)}.png`} onError={e=>{e.target.style.display='none';}} alt=""/>
              <span className="wi-exp-iso">{iso3}</span>
              <span className="wi-exp-level exp-med">MODERATE</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WarImpact() {
  injectCSS('wi-css', CSS);

  const [conflicts,    setConflicts]    = useState([]);
  const [selected,     setSelected]     = useState(null);
  const [detail,       setDetail]       = useState(null);
  const [loadingList,  setLoadingList]  = useState(true);
  const [loadingDetail,setLoadingDetail]= useState(false);
  const [tab,          setTab]          = useState('commodities');

  useEffect(() => {
    fetch(`${API}/api/war-impact/conflicts`)
      .then(r => r.json())
      .then(d => { setConflicts(d); if (d[0]) setSelected(d[0].id); setLoadingList(false); })
      .catch(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    let timer;

    setLoadingDetail(true);
    setDetail(null);

    const loadData = () => {
      fetch(`${API}/api/war-impact/conflict/${selected}`)
        .then(r => r.json())
        .then(d => {
          if (!active) return;
          setDetail(d);
          setLoadingDetail(false);

          if (d?.commodities?._status === 'fetching') {
            timer = setTimeout(loadData, 5000);
          }
        })
        .catch(e => {
          console.error(e);
          if (active) setLoadingDetail(false);
        });
    };

    loadData();

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selected]);

  const activeConflict = conflicts.find(c => c.id === selected);

  return (
    <div className="wi">
      <SEO title="War Economic Impact | WarScope" description="How active conflicts ripple through global economies — tracking real-time commodity price shocks, currency collapse, refugee economic burden, and international trade exposure." canonical="/war-impact"/>
      
      <Navbar/>

      <div className="wi-wrap">
        <div className="wi-hdr fup">
          <div className="wi-eye"><span className="wi-dot"/>LIVE ECONOMIC INTELLIGENCE</div>
          <h1 className="wi-h1">War <em>Economic</em> Impact</h1>
          <p className="wi-sub">How active conflicts ripple through global economies — tracking real-time commodity price shocks, currency collapse, refugee economic burden, and international trade exposure.</p>
        </div>

        {/* Mobile-Only Top Ad */}
        <div className="wi-ad-center wi-mobile-ad" style={{marginBottom: 24}}>
          <AdBanner size="320x50" id="ad-mobile-top" />
        </div>

        <div className="wi-layout">
          {/* ======================= LEFT COLUMN (SIDEBAR) ======================= */}
          <div className="wi-sidebar">
            <div className="wi-sidebar-title">ACTIVE CONFLICT SELECTION</div>
            
            {loadingList ? (
              <div className="wi-load" style={{padding: '40px 0'}}><div className="wi-spin"/></div>
            ) : (
              <div className="wi-conflict-list fup">
                {conflicts.map(c => (
                  <div key={c.id} className={`wi-list-card${selected===c.id?' active':''}`}
                    style={{ '--accent': c.color }}
                    onClick={() => setSelected(c.id)}>
                    <div className="wi-lc-head">
                      <div className="wi-lc-name">{c.name}</div>
                      <div style={{display:'flex', gap:4}}>
                        {c.flags?.map(f => <img key={f} className="wi-ccard-flag" src={`https://flagcdn.com/w40/${f}.png`} onError={e=>{e.target.style.display='none';}} alt=""/>)}
                      </div>
                    </div>
                    <div className="wi-lc-region">{c.region} · Since {c.startYear}</div>
                    <div className="wi-lc-tags">
                      {c.commodityShocks?.map(s => <span key={s} className={`wi-lc-tag ${selected===c.id ? 'active-tag' : ''}`}>{s}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sidebar Ads */}
            <div className="wi-ad-center wi-desktop-ad" style={{marginTop: 16}}>
              <AdBanner size="300x250" id="ad-sidebar-top" />
            </div>
            
            
          </div>

          {/* ======================= RIGHT COLUMN (MAIN) ======================= */}
          <div className="wi-main">
            
            {/* Desktop-Only Top Main Ad */}
            <div className="wi-ad-center wi-desktop-ad" style={{marginBottom: 8}}>
              <AdBanner size="728x90" id="ad-top-desktop" />
            </div>

            {loadingDetail && (
              <div className="wi-load fup">
                <div className="wi-spin"/>
                <div className="wi-lt">LOADING {activeConflict?.name?.toUpperCase()} DATA...</div>
                <div style={{ fontSize:11, color:'var(--dim)' }}>Establishing connection to global market APIs</div>
              </div>
            )}

            {detail && !loadingDetail && (
              <div className="fup" style={{display:'flex', flexDirection:'column', gap:24}}>
                
                {/* Conflict Header Strip */}
                <div style={{ background:'var(--card)', border:`1px solid ${activeConflict?.color ?? 'var(--bd)'}55`, borderRadius:12, padding:'24px 28px', backdropFilter:'blur(16px)', display:'flex', gap:32, flexWrap:'wrap', alignItems:'center', boxShadow:`0 0 30px ${activeConflict?.color}11` }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:'Barlow Condensed,sans-serif', fontSize:28, fontWeight:700, color:'#ffffff', letterSpacing:'.04em', textTransform:'uppercase' }}>{activeConflict?.name}</div>
                    <div style={{ fontSize:12, color:'var(--dim)', marginTop:6, lineHeight:1.6 }}>{activeConflict?.region} · Started {activeConflict?.startDate} · {activeConflict?.description}</div>
                  </div>
                  {detail.conflict.refugees && (
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.15em', color:'var(--dim)' }}>TOTAL DISPLACED</div>
                      <div style={{ fontSize:36, fontWeight:700, color:'var(--r)' }}>{fmtBig(detail.conflict.refugees.total)}</div>
                    </div>
                  )}
                </div>

                {/* Highly Prominent Scrollable Tabs */}
                <div className="wi-tabs">
                  {[
                    ['commodities','📈 Commodity Shocks'],
                    ['currency',   '💱 Currency Collapse'],
                    ['economic',   '📉 Before vs After'],
                    ['refugees',   '🏕 Refugee Burden'],
                    ['exposure',   '🌍 Trade Exposure'],
                  ].map(([v, l]) => (
                    <button key={v} className={`wi-tab${tab===v?' on':''}`} onClick={() => setTab(v)}>{l}</button>
                  ))}
                </div>

            

                {/* Panel Content Area */}
                <div style={{ minHeight: 400 }}>
                  {tab === 'commodities' && <CommodityPanel commodities={detail.commodities} conflictId={selected} startYear={activeConflict?.startYear}/>}
                  {tab === 'currency'    && <CurrencyPanel  currencies={detail.currencies}   conflictCountries={activeConflict?.countries}/>}
                  {tab === 'economic'    && <EconPanel      econData={detail.econData}        conflict={activeConflict}/>}
                  {tab === 'refugees'    && <RefugeePanel   refugees={detail.conflict.refugees}/>}
                  {tab === 'exposure'    && <ExposurePanel  exposure={detail.conflict.exposure} reason={detail.conflict.exposure?.reason}/>}
                </div>

                {/* Bottom Native Ad inside Content Flow */}
                <div className="wi-ad-center" style={{marginTop: 16}}>
                   <AdBanner size="native" id="ad-native-bottom" />
                </div>

              </div>
            )}
          </div>
        </div>

        {/* Global Footer Notes */}
        <div style={{ background:'rgba(0,0,0,0.5)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:12, padding:'20px 24px', marginTop:48, fontSize:11, color:'var(--dim)', lineHeight:1.8, backdropFilter:'blur(16px)' }}>
          <div style={{ fontSize:10, fontWeight:600, letterSpacing:'.2em', color:'var(--c)', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
            <span style={{width:4, height:4, borderRadius:'50%', background:'var(--c)'}}></span> API TELEMETRY SOURCES
          </div>
          Commodity pricing is fetched securely from <strong>Yahoo Finance Live Futures</strong> APIs. Currency exchange volatility tracking provided by <strong>Open Exchange Rates API</strong> (refreshed every 6 hours). Macroeconomic indicators (GDP, Inflation, Unemployment) sourced from <strong>World Bank Open Data</strong> (24-hour cache). Humanitarian refugee data maps utilizing <strong>UNHCR Global Trends</strong> estimates.
        </div>
      </div>
      <Footer/>
    </div>
  );
}