import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600&display=swap');
.mth-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.mth-hero{position:relative;padding:56px 40px 44px;border-bottom:1px solid #161b2e;overflow:hidden;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,212,255,0.05) 0%,transparent 70%);}
.mth-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px);background-size:48px 48px;}
.mth-hero-inner{position:relative;z-index:2;max-width:900px;}
.mth-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#00d4ff;text-transform:uppercase;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);border-radius:3px;padding:4px 12px;margin-bottom:20px;}
.mth-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,6vw,76px);letter-spacing:-0.02em;line-height:0.92;color:#e8eaf0;margin-bottom:16px;}
.mth-title em{color:#00d4ff;font-style:normal;}
.mth-sub{font-size:15px;color:#8892a4;max-width:560px;line-height:1.7;margin-top:12px;}
.mth-body{max-width:900px;margin:0 auto;padding:48px 40px 72px;}
.mth-section{margin-bottom:52px;}
.mth-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:24px;color:#e8eaf0;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid #161b2e;}
.mth-h2 em{color:#00d4ff;font-style:normal;}
.mth-h3{font-family:'Barlow Condensed',sans-serif;font-weight:600;font-size:17px;color:#c8d0e0;margin:20px 0 8px;}
.mth-p{font-size:15px;color:#8892a4;line-height:1.85;margin-bottom:12px;}
.mth-ul{list-style:none;margin:10px 0 14px;}
.mth-ul li{font-size:14px;color:#8892a4;line-height:1.75;padding:4px 0 4px 20px;position:relative;}
.mth-ul li::before{content:'›';position:absolute;left:0;color:#00d4ff;font-weight:700;}
.mth-box{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.12);border-left:3px solid #00d4ff;border-radius:6px;padding:16px 20px;margin:16px 0;}
.mth-box p{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8892a4;line-height:1.8;}
.mth-box p strong{color:#00d4ff;}
.mth-flow{display:flex;flex-direction:column;gap:0;margin:20px 0;}
.mth-flow-step{display:flex;gap:16px;align-items:flex-start;padding:16px 0;border-bottom:1px solid rgba(22,27,46,0.5);}
.mth-flow-step:last-child{border-bottom:none;}
.mth-flow-num{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#00d4ff;letter-spacing:0.1em;flex-shrink:0;width:32px;padding-top:2px;}
.mth-flow-content{}
.mth-flow-title{font-size:15px;font-weight:600;color:#e8eaf0;margin-bottom:4px;}
.mth-flow-desc{font-size:13px;color:#8892a4;line-height:1.7;}
.mth-table{width:100%;border-collapse:collapse;margin:16px 0;}
.mth-table th{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.12em;color:#3a4155;text-transform:uppercase;padding:8px 14px;border-bottom:1px solid #161b2e;text-align:left;}
.mth-table td{font-size:13px;color:#8892a4;padding:10px 14px;border-bottom:1px solid rgba(22,27,46,0.5);vertical-align:top;line-height:1.6;}
.mth-table tr:last-child td{border-bottom:none;}
.mth-table td:first-child{color:#e8eaf0;font-weight:500;white-space:nowrap;}
@media(max-width:768px){.mth-hero{padding:36px 20px 28px;}.mth-body{padding:32px 20px 48px;}}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

export default function Methodology() {
  injectCSS('mth-css', CSS);
  return (
    <div className="mth-page">
      <Navbar />
      <div className="mth-hero">
        <div className="mth-hero-inner">
          <div className="mth-eyebrow">🔬 Transparency</div>
          <h1 className="mth-title">METHODOLOGY &<br/><em>HOW IT WORKS</em></h1>
          <p className="mth-sub">How WarScope collects, processes, and visualises global conflict data — explained transparently.</p>
        </div>
      </div>

      <AdBanner />

      <div className="mth-body">

        <div className="mth-section">
          <h2 className="mth-h2">Overview</h2>
          <p className="mth-p">WarScope is a data aggregation and visualisation platform. We do not generate original intelligence. Instead, we fetch, process, and visualise data from established open-source databases using automated pipelines and curated datasets.</p>
          <p className="mth-p">All data processing is performed on our backend servers. The frontend receives pre-processed, structured data and renders it using interactive visualisation libraries (Three.js for the 3D globe, Leaflet for 2D maps, and React for all UI components).</p>
        </div>

        <div className="mth-section">
          <h2 className="mth-h2">Live Conflict <em>Arc Detection</em></h2>
          <p className="mth-p">The 3D globe displays animated arcs representing active and monitored conflicts. Here is how we determine which conflicts are active:</p>
          <div className="mth-flow">
            {[
              { num:'01', title:'Curated Conflict List', desc:'We maintain a list of 55 curated conflicts, each with associated keyword arrays (e.g. ["ukraine", "kyiv", "kharkiv", "donetsk"]). This list is reviewed and updated manually.' },
              { num:'02', title:'GDELT Article Fetch', desc:'Every 15 minutes, we query the GDELT Document API for 250 recent English-language articles matching broad conflict-related terms (airstrike, military offensive, rebel attack, etc.).' },
              { num:'03', title:'Keyword Matching', desc:'We scan all fetched article titles and URLs against each conflict\'s keyword array. A conflict is marked "active" if any of its keywords appear in the GDELT coverage.' },
              { num:'04', title:'Arc Rendering', desc:'Active conflicts render as animated shooting-star arcs (red for state-vs-state, gold for insurgencies). Inactive conflicts are removed from the payload entirely.' },
              { num:'05', title:'Caching', desc:'Results are cached for 15 minutes to match GDELT\'s update cadence and reduce API load. Cache is invalidated automatically on expiry.' },
            ].map(s => (
              <div key={s.num} className="mth-flow-step">
                <div className="mth-flow-num">{s.num}</div>
                <div className="mth-flow-content">
                  <div className="mth-flow-title">{s.title}</div>
                  <div className="mth-flow-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mth-box"><p><strong>Limitation:</strong> GDELT coverage is biased toward English-language media and conflicts receiving international press attention. Conflicts with limited media coverage may appear inactive even when fighting continues.</p></div>
        </div>

        <div className="mth-section">
          <h2 className="mth-h2">Conflict <em>Timeline</em></h2>
          <p className="mth-p">The Timeline page is built from a static dataset generated from the UCDP Conflict Dataset CSV at build time.</p>
          <h3 className="mth-h3">UCDP Data Processing</h3>
          <ul className="mth-ul">
            <li>We parse the UCDP CSV (tab-delimited) and group rows by <code style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12,color:'#00d4ff'}}>conflict_id</code>, since each conflict appears once per active year.</li>
            <li>We derive <code style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12,color:'#00d4ff'}}>startYear</code>, <code style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12,color:'#00d4ff'}}>lastYear</code>, duration, peak intensity, and episode count from the grouped rows.</li>
            <li>A conflict is classified as "active" if its last recorded year is 2020 or later and the final episode did not end with a confirmed ceasefire/resolution.</li>
            <li>The output is written as a static <code style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12,color:'#00d4ff'}}>timeline-data.js</code> file loaded at build time — no runtime API calls needed.</li>
          </ul>
          <table className="mth-table">
            <thead><tr><th>UCDP Field</th><th>WarScope Field</th><th>Notes</th></tr></thead>
            <tbody>
              {[
                ['conflict_id', 'id', 'Primary key, groups year-rows'],
                ['location', 'location', 'Country/region of conflict'],
                ['side_a / side_b', 'sideA / sideB', 'Primary parties'],
                ['intensity_level', 'peakIntensity', '1=Minor, 2=War (25+ battle deaths)'],
                ['type_of_conflict', 'conflictType', '1=Extra-systemic, 2=Inter-state, 3=Internal, 4=Internationalised'],
                ['ep_end / ep_end_date', 'episodeEnd / endDate', 'Episode termination marker'],
                ['start_date2', 'startDate', 'Specific episode start date'],
              ].map(([a,b,c]) => <tr key={a}><td>{a}</td><td>{b}</td><td>{c}</td></tr>)}
            </tbody>
          </table>
        </div>

        <div className="mth-section">
          <h2 className="mth-h2">Incident <em>Feed</em></h2>
          <p className="mth-p">The Incident Feed uses GDELT's Document API with 5 targeted queries, one per incident type.</p>
          <ul className="mth-ul">
            <li><strong>Battle:</strong> Queries for airstrike, ground offensive, troops killed, military clash, shelling, bombardment, ambush.</li>
            <li><strong>Explosion:</strong> Queries for drone strike, missile strike, car bomb, IED attack, suicide bomb.</li>
            <li><strong>Protest:</strong> Queries for protest, riot, demonstration, civil unrest, tear gas.</li>
            <li><strong>Civilian violence:</strong> Queries for civilians killed, massacre, atrocity, civilian casualties, population displacement.</li>
            <li><strong>Strategic:</strong> Queries for ceasefire, peace talks, military buildup, troops deployed, weapons shipment.</li>
          </ul>
          <p className="mth-p">Each article is matched against a 60-entry location index (keyword arrays mapped to lat/lng coordinates). If no keyword matches, we fall back to GDELT's <code style={{fontFamily:'IBM Plex Mono,monospace',fontSize:12,color:'#00d4ff'}}>sourcecountry</code> field (2-letter ISO code) mapped to national capital coordinates.</p>
          <div className="mth-box"><p><strong>Jitter:</strong> We add ±1.25° random offset to coordinates to prevent dot overlap and avoid false precision. Incident locations are approximate — they represent the approximate country or region, not a specific address.</p></div>
        </div>

        <div className="mth-section">
          <h2 className="mth-h2">Nuclear <em>Data</em></h2>
          <p className="mth-p">Nuclear warhead counts and weapon system specifications are hardcoded from publicly available estimates published by FAS and SIPRI as of 2024. These are estimates — actual figures are classified by all nuclear states.</p>
          <p className="mth-p">Blast radius models use standard overpressure calculations: fireball radius, 20psi heavy blast zone, 5psi moderate blast zone, thermal radiation radius, and lethal radiation zone. These are educational models, not precision targeting data.</p>
        </div>

        <div className="mth-section">
          <h2 className="mth-h2">Sanctions & <em>Arms Trade</em></h2>
          <p className="mth-p">Sanctions data is manually curated from official OFAC, EU, UK OFSI, and UN Security Council sources. Each entry includes the specific legal basis (regulation or executive order number) and current status (active, partial, expired).</p>
          <p className="mth-p">Arms trade data uses SIPRI's Trend Indicator Value (TIV) methodology. TIV is a measure of the military capability transferred, not the financial value of the contract. It allows for comparison across different weapon types and time periods.</p>
        </div>

        <div className="mth-section">
          <h2 className="mth-h2">Known <em>Limitations</em></h2>
          <ul className="mth-ul">
            <li>GDELT has English-language bias — non-English media coverage is underrepresented</li>
            <li>Conflict arc coordinates use country centroids, not precise engagement locations</li>
            <li>UCDP data has a 1-year lag — the most recent year may be incomplete</li>
            <li>Nuclear estimates are inherently uncertain — figures represent publicly available best estimates</li>
            <li>Sanctions data requires manual maintenance and may lag behind rapid policy changes</li>
            <li>GDELT incident geolocation is approximate — coordinates represent region, not precise location</li>
          </ul>
        </div>

      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}