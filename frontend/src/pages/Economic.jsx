// src/pages/Economic.jsx
import { useState, useEffect, useRef, useMemo } from 'react';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO      from '../seo/SEO.jsx';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Cell,
  PieChart, Pie, Legend
} from 'recharts';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Barlow:wght@400;600;700;800;900&display=swap');

:root {
  --cyan: #00d4ff;
  --red: #ff3b3b;
  --gold: #f0b429;
  --green: #00e676;
  --dim: #8892a4;
  --border: rgba(255,255,255,0.06);
  --border-cyan: rgba(0,212,255,0.2);
  --bg: #030407;
  --panel: rgba(8, 10, 16, 0.85);
  --panel-hover: rgba(12, 16, 24, 0.95);
}

/* Custom Scrollbar for Dashboard feel */
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.5); }

.eco-page { min-height: 100dvh; background: var(--bg); position: relative; overflow-x: hidden; font-family: 'IBM Plex Mono', monospace; color: #e8eaf0; }
.eco-page::before {
  content: ''; position: fixed; inset: 0;
  background-image: linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px);
  background-size: 32px 32px; pointer-events: none; z-index: 0;
}

.eco-wrap { position: relative; z-index: 1; max-width: 1560px; margin: 0 auto; padding: 0 clamp(12px, 2vw, 24px) 60px; }
.eco-hdr { padding: 32px 0 24px; }
.eco-h1 { font-family: 'Barlow', system-ui, sans-serif; font-size: clamp(28px, 4vw, 42px); font-weight: 900; color: #ffffff; line-height: 1.1; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 0.02em; }
.eco-h1 span { color: var(--cyan); text-shadow: 0 0 20px rgba(0,212,255,0.3); }

/* Global Top Stats */
.eco-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }
.eco-sc { background: var(--panel); border: 1px solid var(--border); border-top: 2px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 16px; backdrop-filter: blur(12px); box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
.eco-sc-lbl { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; color: var(--dim); text-transform: uppercase; margin-bottom: 8px; }
.eco-sc-val { font-family: 'Barlow', system-ui, sans-serif; font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1; }

/* Dashboard Grid Layout */
.eco-dash-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; align-items: start; }
.eco-panel { background: var(--panel); border: 1px solid var(--border); border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; backdrop-filter: blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
.eco-panel-hdr { padding: 12px 16px; border-bottom: 1px solid var(--border); font-size: 11px; font-weight: 700; color: var(--cyan); letter-spacing: 0.15em; text-transform: uppercase; background: rgba(0,212,255,0.03); display: flex; justify-content: space-between; align-items: center; }

/* Map Specifics */
.eco-map-leg { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-top: 1px solid var(--border); flex-wrap: wrap; background: rgba(0,0,0,0.4); }
.eco-leg-bar { height: 4px; width: 120px; border-radius: 2px; background: linear-gradient(90deg, #ff3b3b, #ff9800, #f0b429, #69f0ae, #00e676); }

/* Rankings Table */
.eco-tbar { padding: 12px 16px; border-bottom: 1px solid var(--border); background: rgba(0,0,0,0.2); display: flex; gap: 10px; align-items: center; }
.eco-search { flex: 1; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 4px; padding: 8px 12px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #fff; outline: none; transition: border-color 200ms; }
.eco-search:focus { border-color: var(--cyan); }
.eco-table-wrap { max-height: 500px; overflow-y: auto; }
.eco-th { display: grid; grid-template-columns: 40px 1fr 100px 90px 100px 80px; padding: 10px 16px; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(8px); }
.eco-th span { font-size: 9px; font-weight: 600; letter-spacing: 0.15em; color: var(--dim); text-transform: uppercase; }
.eco-tr { display: grid; grid-template-columns: 40px 1fr 100px 90px 100px 80px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.02); cursor: pointer; transition: background 150ms; align-items: center; }
.eco-tr:hover { background: rgba(255,255,255,0.04); }
.eco-tr.sel { background: rgba(0,212,255,0.08); border-left: 2px solid var(--cyan); padding-left: 14px; }

/* Detail Panel */
.eco-dflag { width: 56px; height: 38px; object-fit: cover; border-radius: 3px; border: 1px solid rgba(255,255,255,0.15); flex-shrink: 0; }
.eco-dname { font-family: 'Barlow', sans-serif; font-size: 28px; font-weight: 800; color: #fff; line-height: 1; }
.eco-dsn { font-family: 'Barlow', sans-serif; font-size: 42px; font-weight: 900; line-height: 1; }
.eco-mg { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 16px 0; }
.eco-mc { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.04); border-radius: 4px; padding: 12px; }

/* Utilities & Animations */
.b-DOMINANT { background: rgba(0,230,118,0.15); color: #00e676; }
.b-STRONG { background: rgba(105,240,174,0.15); color: #69f0ae; }
.b-MODERATE { background: rgba(240,180,41,0.15); color: #f0b429; }
.b-WEAK { background: rgba(255,152,0,0.15); color: #ff9800; }
.b-FRAGILE { background: rgba(255,59,59,0.15); color: #ff3b3b; }
.eco-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.1em; padding: 3px 6px; border-radius: 3px; text-transform: uppercase; }

.eco-load { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 20px; gap: 16px; border: 1px dashed var(--border); border-radius: 6px; }
.eco-spin { width: 36px; height: 36px; border: 2px solid rgba(0,212,255,0.1); border-top-color: var(--cyan); border-radius: 50%; animation: spin 800ms linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fup { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
.fup { animation: fup 500ms cubic-bezier(0.16, 1, 0.3, 1) both; }

/* Leaflet Overrides */
.eco-lft-tip .leaflet-tooltip { background: rgba(10,12,20,0.95)!important; border: 1px solid var(--border-cyan)!important; border-radius: 6px!important; padding: 12px!important; box-shadow: 0 8px 32px rgba(0,0,0,0.8)!important; font-family: 'IBM Plex Mono', monospace!important; }
.leaflet-control-zoom a { background: rgba(10,12,20,0.9)!important; color: var(--cyan)!important; border-color: var(--border)!important; }
.leaflet-control-attribution { background: rgba(0,0,0,0.6)!important; color: rgba(160,175,200,0.4)!important; font-size: 9px!important; }

@media(max-width: 1100px) { 
  .eco-dash-layout { grid-template-columns: 1fr; } 
  .eco-mg { grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); }
}
@media(max-width: 768px) {
  .eco-th, .eco-tr { grid-template-columns: 30px 1fr 80px 70px; padding: 12px; }
  .eco-th span:nth-child(5), .eco-tr > *:nth-child(5),
  .eco-th span:nth-child(6), .eco-tr > *:nth-child(6) { display: none; }
}
`;

// ── Helpers ────────────────────────────────────────────────────────────────────
const TIER_COLOR = { DOMINANT:'#00e676', STRONG:'#69f0ae', MODERATE:'#f0b429', WEAK:'#ff9800', FRAGILE:'#ff3b3b' };
const tc = t => TIER_COLOR[t] ?? '#4a5568';
const fmtGDP = v => !v ? '—' : v>=1e12 ? '$'+(v/1e12).toFixed(2)+'T' : v>=1e9 ? '$'+(v/1e9).toFixed(1)+'B' : '$'+(v/1e6).toFixed(0)+'M';
const fmtPct = v => v==null ? '—' : v.toFixed(1)+'%';

function injectCSS(id,css){ if(document.getElementById(id))return; const e=document.createElement('style');e.id=id;e.textContent=css;document.head.appendChild(e); }

const ISO2 = {USA:'us',RUS:'ru',CHN:'cn',IND:'in',BRA:'br',GBR:'gb',FRA:'fr',DEU:'de',JPN:'jp',KOR:'kr',AUS:'au',CAN:'ca',SAU:'sa',IRN:'ir',TUR:'tr',ISR:'il',PAK:'pk',IDN:'id',MEX:'mx',ARG:'ar',NGA:'ng',ZAF:'za',EGY:'eg',IRQ:'iq',SYR:'sy',UKR:'ua',POL:'pl',SWE:'se',NOR:'no',FIN:'fi',ESP:'es',ITA:'it',NLD:'nl',BEL:'be',CHE:'ch',AUT:'at',GRC:'gr',PRT:'pt',CZE:'cz',HUN:'hu',ROU:'ro',BGR:'bg',SRB:'rs',HRV:'hr',SVK:'sk',SVN:'si',LTU:'lt',LVA:'lv',EST:'ee',BLR:'by',KAZ:'kz',VNM:'vn',THA:'th',MYS:'my',PHL:'ph',SGP:'sg',MMR:'mm',BGD:'bd',LKA:'lk',NPL:'np',PRK:'kp',MNG:'mn',NZL:'nz',CHL:'cl',COL:'co',PER:'pe',VEN:'ve',ECU:'ec',BOL:'bo',PRY:'py',URY:'uy',PAN:'pa',CRI:'cr',GTM:'gt',HND:'hn',SLV:'sv',NIC:'ni',CUB:'cu',DOM:'do',HTI:'ht',MAR:'ma',DZA:'dz',TUN:'tn',LBY:'ly',SDN:'sd',ETH:'et',KEN:'ke',TZA:'tz',UGA:'ug',MOZ:'mz',ZMB:'zm',ZWE:'zw',BWA:'bw',NAM:'na',AGO:'ao',CMR:'cm',SEN:'sn',GHA:'gh',CIV:'ci',JOR:'jo',LBN:'lb',OMN:'om',YEM:'ye',KWT:'kw',BHR:'bh',QAT:'qa',ARE:'ae',AZE:'az',ARM:'am',GEO:'ge',ALB:'al',MKD:'mk',BIH:'ba',MNE:'me',LUX:'lu',MLT:'mt',CYP:'cy',ISL:'is',IRL:'ie',DNK:'dk',UZB:'uz',TKM:'tm',KGZ:'kg',TJK:'tj',AFG:'af',KHM:'kh',LAO:'la',TCD:'td',NER:'ne',MLI:'ml',BFA:'bf',GIN:'gn',LBR:'lr',SLE:'sl',GMB:'gm',TGO:'tg',BEN:'bj',GAB:'ga',COG:'cg',COD:'cd',CAF:'cf',SOM:'so',DJI:'dj',ERI:'er',RWA:'rw',BDI:'bi'};
const i2 = iso3 => ISO2[iso3] ?? iso3.toLowerCase().slice(0,2);
const N2I = {4:'AFG',8:'ALB',12:'DZA',24:'AGO',32:'ARG',36:'AUS',40:'AUT',50:'BGD',56:'BEL',64:'BTN',68:'BOL',76:'BRA',100:'BGR',116:'KHM',120:'CMR',124:'CAN',140:'CAF',152:'CHL',156:'CHN',170:'COL',180:'COD',188:'CRI',191:'HRV',192:'CUB',196:'CYP',203:'CZE',208:'DNK',218:'ECU',818:'EGY',222:'SLV',232:'ERI',231:'ETH',246:'FIN',250:'FRA',266:'GAB',276:'DEU',288:'GHA',300:'GRC',320:'GTM',324:'GIN',332:'HTI',340:'HND',348:'HUN',356:'IND',360:'IDN',364:'IRN',368:'IRQ',372:'IRL',376:'ISR',380:'ITA',388:'JAM',392:'JPN',400:'JOR',398:'KAZ',404:'KEN',408:'PRK',410:'KOR',414:'KWT',418:'LAO',422:'LBN',430:'LBR',434:'LBY',440:'LTU',442:'LUX',458:'MYS',484:'MEX',496:'MNG',504:'MAR',508:'MOZ',516:'NAM',524:'NPL',528:'NLD',554:'NZL',558:'NIC',566:'NGA',578:'NOR',586:'PAK',591:'PAN',598:'PNG',600:'PRY',604:'PER',608:'PHL',616:'POL',620:'PRT',634:'QAT',642:'ROU',643:'RUS',682:'SAU',686:'SEN',694:'SLE',706:'SOM',710:'ZAF',724:'ESP',729:'SDN',752:'SWE',756:'CHE',760:'SYR',762:'TJK',764:'THA',768:'TGO',788:'TUN',792:'TUR',800:'UGA',804:'UKR',784:'ARE',826:'GBR',840:'USA',858:'URY',860:'UZB',862:'VEN',704:'VNM',887:'YEM',894:'ZMB',716:'ZWE',51:'ARM',31:'AZE',112:'BLR',70:'BIH',854:'BFA',108:'BDI',104:'MMR',466:'MLI',499:'MNE',562:'NER',688:'SRB',703:'SVK',705:'SVN',233:'EST',428:'LVA',807:'MKD',417:'KGZ',795:'TKM',262:'DJI'};

// ── Leaflet Loader ─────────────────────────────────────────────────────────────
let _L=null, _css=false;
async function loadLeaflet(){
  if(_L)return _L;
  if(!_css){const l=document.createElement('link');l.rel='stylesheet';l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(l);_css=true;}
  return new Promise((res,rej)=>{
    if(window.L){_L=window.L;res(_L);return;}
    const s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    s.onload=()=>{_L=window.L;res(_L);};s.onerror=rej;document.head.appendChild(s);
  });
}
async function loadWorldGeo(){
  if(window._wgeo)return window._wgeo;
  await new Promise((res,rej)=>{
    if(window.topojson){res();return;}
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js';
    s.onload=res;s.onerror=rej;document.head.appendChild(s);
  });
  const r=await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json');
  const t=await r.json();
  const g=window.topojson.feature(t,t.objects.countries);
  window._wgeo=g;return g;
}

// ── Dashboard Components ───────────────────────────────────────────────────────

function WorldMapView({countries,onSelect}){
  const ref=useRef(null), inst=useRef(null);
  const [ready,setReady]=useState(false), [err,setErr]=useState(null);
  const sm=useMemo(()=>{const m={};countries.forEach(c=>{m[c.iso3]=c;});return m;},[countries]);

  useEffect(()=>{
    if(!ref.current||inst.current||!countries.length)return;
    let live=true;
    Promise.all([loadLeaflet(),loadWorldGeo()]).then(([L,geo])=>{
      if(!live||!ref.current||inst.current)return;
      const map=L.map(ref.current,{center:[20,15],zoom:2,minZoom:1,maxZoom:6,scrollWheelZoom:false,worldCopyJump:true});
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',{attribution:'',subdomains:'abcd',maxZoom:6}).addTo(map);
      L.geoJSON(geo,{
        style:(f)=>{
          const iso3=N2I[parseInt(f.id,10)]; const c=iso3?sm[iso3]:null;
          return{fillColor:c?tc(c.tier):'rgba(255,255,255,0.02)',fillOpacity:c?0.8:0.1,color:'rgba(0,212,255,0.1)',weight:0.5};
        },
        onEachFeature:(f,layer)=>{
          const iso3=N2I[parseInt(f.id,10)]; const c=iso3?sm[iso3]:null;
          layer.on({
            mouseover(e){
              e.target.setStyle({fillOpacity:1,weight:1.5,color:'#00d4ff'});
              if(!c)return;
              const col=tc(c.tier);
              layer.bindTooltip(`<div style="min-width:140px"><div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:4px">${iso3}</div><div style="font-size:24px;font-family:'Barlow';font-weight:800;color:${col}">${c.score}<span style="font-size:10px;color:rgba(255,255,255,0.4)">/100</span></div><div style="font-size:10px;color:rgba(255,255,255,0.6);margin-top:4px">${c.tier} · #${c.rank}</div></div>`,
                {sticky:true,className:'eco-lft-tip',opacity:1,offset:[14,0]}).openTooltip();
            },
            mouseout(e){
              e.target.setStyle({fillOpacity:c?0.8:0.1,weight:0.5,color:'rgba(0,212,255,0.1)'});
              layer.closeTooltip();
            },
            click(){if(c)onSelect(c);}
          });
        }
      }).addTo(map);
      inst.current=map;if(live)setReady(true);
    }).catch(e=>{if(live)setErr(e.message);});
    return()=>{live=false;if(inst.current){inst.current.remove();inst.current=null;}};
  },[countries,sm]);

  return(
    <div className="eco-panel fup">
      <div className="eco-panel-hdr">GLOBAL POWER PROJECTION</div>
      <div style={{position:'relative'}}>
        {!ready&&!err&&<div style={{position:'absolute',inset:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:1000,background:'rgba(10,12,20,0.9)'}}><div className="eco-spin"/></div>}
        <div ref={ref} style={{width:'100%',height:'420px',background:'#050508'}}/>
      </div>
      <div className="eco-map-leg">
        <span style={{fontSize:9,color:'var(--dim)'}}>FRAGILE</span><div className="eco-leg-bar"/><span style={{fontSize:9,color:'var(--dim)'}}>DOMINANT</span>
      </div>
    </div>
  );
}

function TierPieChart({ countries }) {
  const data = useMemo(() => {
    const counts = { DOMINANT: 0, STRONG: 0, MODERATE: 0, WEAK: 0, FRAGILE: 0 };
    countries.forEach(c => { if(counts[c.tier] !== undefined) counts[c.tier]++; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [countries]);

  return (
    <div className="eco-panel fup" style={{ animationDelay: '50ms' }}>
      <div className="eco-panel-hdr">TIER DISTRIBUTION</div>
      <div style={{ height: '240px', padding: '10px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={tc(entry.name)} />)}
            </Pie>
            <RechartsTooltip 
              contentStyle={{ background: 'rgba(10,12,20,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px' }}
              itemStyle={{ color: '#fff', fontWeight: 600 }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '9px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--dim)' }}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function DetailPanel({ c }) {
  if (!c) return (
    <div className="eco-panel fup" style={{ minHeight: '300px', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontSize: 11, color: 'var(--dim)', letterSpacing: '0.1em' }}>SELECT A COUNTRY</div>
    </div>
  );

  const col=tc(c.tier);
  const rd=[
    {metric:'GDP',      value:Math.min(Math.max(c.metrics.gdp?(Math.log10(c.metrics.gdp)-9)/(13.5-9)*100:30,0),100)},
    {metric:'DEFENSE',  value:Math.min((c.metrics.defense??0)/6*100,100)},
    {metric:'LOW DEBT', value:Math.max(100-(c.metrics.debt??60),0)},
    {metric:'STABILITY',value:Math.max(100-Math.abs(c.metrics.inflation??5)*3,0)},
    {metric:'ENERGY',   value:Math.min(c.metrics.energyExp??0,100)},
    {metric:'TRADE',    value:Math.min((c.metrics.trade??40)/200*100,100)},
  ];
  
  return(
    <div className="eco-panel fup" style={{ borderColor: col }}>
      <div className="eco-panel-hdr" style={{ background: `${col}15`, color: col }}>COUNTRY PROFILE</div>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <img className="eco-dflag" src={`https://flagcdn.com/w80/${i2(c.iso3)}.png`} onError={e=>{e.target.style.display='none';}} alt=""/>
          <div style={{ flex: 1 }}>
            <div className="eco-dname">{c.iso3}</div>
            <div style={{ fontSize: 10, color: 'var(--dim)', marginTop: 4 }}>RANK #{c.rank}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="eco-dsn" style={{ color: col }}>{c.score}</div>
            <div className={`eco-badge b-${c.tier}`} style={{ marginTop: 4 }}>{c.tier}</div>
          </div>
        </div>
        
        <div className="eco-mg">
          <div className="eco-mc">
            <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>GDP (USD)</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{fmtGDP(c.metrics.gdp)}</div>
          </div>
          <div className="eco-mc">
            <div style={{ fontSize: 9, color: 'var(--dim)', marginBottom: 4 }}>DEFENSE %</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{fmtPct(c.metrics.defense)}</div>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: '10px 0', border: '1px solid rgba(255,255,255,0.02)' }}>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={rd} margin={{top:5,right:10,bottom:5,left:10}}>
              <PolarGrid stroke="rgba(255,255,255,0.05)"/>
              <PolarAngleAxis dataKey="metric" tick={{fill:'#8892a4',fontSize:8,fontFamily:'IBM Plex Mono,monospace'}}/>
              <PolarRadiusAxis domain={[0,100]} tick={false} axisLine={false}/>
              <Radar dataKey="value" stroke={col} fill={col} fillOpacity={0.2} strokeWidth={2}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function RankingsPanel({ countries, selected, onSelect }) {
  const [q,setQ]=useState('');
  const filtered=useMemo(()=>countries.filter(c=>(!q||c.iso3.includes(q.toUpperCase()))),[countries,q]);
  const rk=r=>r===1?'g':r===2?'s':r===3?'b':'';

  return (
    <div className="eco-panel fup" style={{ animationDelay: '100ms' }}>
      <div className="eco-panel-hdr">
        LIVE INDEX RANKINGS
        <input className="eco-search" style={{ maxWidth: '140px', padding: '4px 8px', fontSize: '10px', marginLeft: 'auto' }} placeholder="SEARCH ISO3..." value={q} onChange={e=>setQ(e.target.value)}/>
      </div>
      <div className="eco-table-wrap">
        <div className="eco-th"><span>RANK</span><span>NATION</span><span>SCORE</span><span>TIER</span><span>GDP</span><span>DEF%</span></div>
        {filtered.map((c,i)=>{
          const col=tc(c.tier);
          return(
            <div key={c.iso3} className={`eco-tr${selected?.iso3===c.iso3?' sel':''}`} onClick={()=>onSelect(c)}>
              <div className={`eco-rnk ${rk(c.rank)}`}>#{c.rank}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <img style={{ width: 20, height: 14, borderRadius: 2 }} src={`https://flagcdn.com/w20/${i2(c.iso3)}.png`} onError={e=>{e.target.style.display='none';}} alt=""/>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#fff' }}>{c.iso3}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontFamily: 'Barlow', fontWeight: 800, color: col }}>{c.score}</span>
              </div>
              <div><span className={`eco-badge b-${c.tier}`}>{c.tier}</span></div>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>{fmtGDP(c.metrics.gdp)}</div>
              <div style={{ fontSize: 11, color: 'var(--dim)' }}>{fmtPct(c.metrics.defense)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function Economic(){
  injectCSS('eco-css',CSS);
  const [data,setData]=useState([]), [loading,setLoading]=useState(true), [error,setError]=useState(null);
  const [selected,setSelected]=useState(null);

  useEffect(()=>{
    fetch(`${API}/api/economic/index`)
      .then(r=>r.ok?r.json():Promise.reject('API error'))
      .then(d=>{
        const sorted = d.countries ?? [];
        setData(sorted);
        if(sorted.length > 0) setSelected(sorted[0]); // Auto-select top rank
        setLoading(false);
      })
      .catch(e=>{setError(String(e));setLoading(false);});
  },[]);

  const stats=useMemo(()=>{
    if(!data.length)return null;
    return{total:data.length,dominant:data.filter(c=>c.tier==='DOMINANT').length,sanctioned:data.filter(c=>c.sanctioned).length,avg:Math.round(data.reduce((s,c)=>s+c.score,0)/data.length),top:data[0]};
  },[data]);

  return(
    <div className="eco-page">
      <SEO title="Economic Dashboard | WarScope" description="Real-time Economic War Index Dashboard" canonical="/economic"/>
      <div className="eco-wrap">
        <Navbar/>
        
        {/* Header & Global Stats */}
        <div className="eco-hdr fup">
          <div className="eco-h1">Economic <span>War Index</span></div>
          {stats && (
            <div className="eco-strip">
              <div className="eco-sc">
                <div className="eco-sc-lbl">Top Power</div>
                <div className="eco-sc-val" style={{ color: 'var(--cyan)' }}>{stats.top?.iso3}</div>
              </div>
              <div className="eco-sc">
                <div className="eco-sc-lbl">Dominant</div>
                <div className="eco-sc-val" style={{ color: 'var(--green)' }}>{stats.dominant}</div>
              </div>
              <div className="eco-sc">
                <div className="eco-sc-lbl">Global Avg</div>
                <div className="eco-sc-val" style={{ color: '#fff' }}>{stats.avg}</div>
              </div>
              <div className="eco-sc">
                <div className="eco-sc-lbl">Nations</div>
                <div className="eco-sc-val" style={{ color: 'var(--dim)' }}>{stats.total}</div>
              </div>
            </div>
          )}
        </div>

        {/* Top Ad */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <AdBanner id="ad-eco-top" size="728x90" />
        </div>

        {loading&&<div className="eco-load"><div className="eco-spin"/><div style={{fontSize:11,color:'var(--cyan)',letterSpacing:'0.2em'}}>INITIALIZING DASHBOARD...</div></div>}
        {error&&<div className="eco-load"><div style={{color:'var(--red)',fontSize:14,fontWeight:700}}>⚠ CONNECTION FAILED</div><div style={{fontSize:12,color:'var(--dim)'}}>{error}</div></div>}

        {!loading&&!error&&data.length>0&&(
          <div className="eco-dash-layout">
            {/* LEFT COLUMN: Map & Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <WorldMapView countries={data} onSelect={setSelected}/>
              <RankingsPanel countries={data} selected={selected} onSelect={setSelected}/>
            </div>

            {/* RIGHT COLUMN: Pie Chart, Detail Panel, Sidebar Ad */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TierPieChart countries={data} />
              <DetailPanel c={selected} />
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                <AdBanner id="ad-eco-sidebar" size="300x250" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Ad */}
        {!loading && !error && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
             <AdBanner id="ad-eco-bot" size="728x90" />
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}