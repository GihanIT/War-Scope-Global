import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO from '../seo/SEO.jsx';


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600&display=swap');
.ds-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.ds-hero{position:relative;padding:56px 40px 44px;border-bottom:1px solid #161b2e;overflow:hidden;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,212,255,0.05) 0%,transparent 70%);}
.ds-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px);background-size:48px 48px;}
.ds-hero-inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;}
.ds-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#00d4ff;text-transform:uppercase;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);border-radius:3px;padding:4px 12px;margin-bottom:20px;}
.ds-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,6vw,76px);letter-spacing:-0.02em;line-height:0.92;color:#e8eaf0;margin-bottom:16px;}
.ds-title em{color:#00d4ff;font-style:normal;}
.ds-sub{font-size:15px;color:#8892a4;max-width:560px;line-height:1.7;margin-top:12px;}
.ds-body{max-width:1200px;margin:0 auto;padding:48px 40px 72px;}
.ds-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:20px;margin-bottom:48px;}
.ds-card{background:rgba(8,10,18,0.7);border:1px solid #161b2e;border-radius:10px;padding:24px;transition:border-color 200ms;display:flex;flex-direction:column;gap:12px;}
.ds-card:hover{border-color:rgba(0,212,255,0.2);}
.ds-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;}
.ds-card-name{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:18px;color:#e8eaf0;line-height:1.2;}
.ds-card-badge{font-family:'IBM Plex Mono',monospace;font-size:9px;padding:3px 8px;border-radius:3px;letter-spacing:0.08em;text-transform:uppercase;white-space:nowrap;flex-shrink:0;}
.ds-card-org{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#3a4155;letter-spacing:0.06em;}
.ds-card-desc{font-size:13px;color:#8892a4;line-height:1.7;}
.ds-card-meta{display:flex;gap:12px;flex-wrap:wrap;}
.ds-meta-item{display:flex;flex-direction:column;gap:2px;}
.ds-meta-label{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#3a4155;letter-spacing:0.12em;text-transform:uppercase;}
.ds-meta-val{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#8892a4;}
.ds-card-link{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#00d4ff;text-decoration:none;letter-spacing:0.06em;margin-top:auto;}
.ds-card-link:hover{text-decoration:underline;}
.ds-section{margin-bottom:48px;}
.ds-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:24px;color:#e8eaf0;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #161b2e;}
.ds-h2 span{color:#00d4ff;}
.ds-p{font-size:15px;color:#8892a4;line-height:1.85;margin-bottom:12px;}
.ds-table{width:100%;border-collapse:collapse;margin:16px 0;}
.ds-table th{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.12em;color:#3a4155;text-transform:uppercase;padding:8px 14px;border-bottom:1px solid #161b2e;text-align:left;}
.ds-table td{font-size:13px;color:#8892a4;padding:10px 14px;border-bottom:1px solid rgba(22,27,46,0.5);vertical-align:top;line-height:1.6;}
.ds-table tr:last-child td{border-bottom:none;}
.ds-table td:first-child{color:#e8eaf0;font-weight:500;}
@media(max-width:768px){.ds-hero{padding:36px 20px 28px;}.ds-body{padding:32px 20px 48px;}.ds-grid{grid-template-columns:1fr;}}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

const SOURCES = [
  {
    name: 'UCDP Conflict Dataset',
    org: 'Uppsala Conflict Data Program — Uppsala University',
    badge: 'Conflict Data', badgeColor: '#ff3b3b',
    desc: 'The world\'s primary source for data on organised violence since 1946. Used for the Timeline page, providing conflict episodes, actors, intensity levels, and episode end dates for 500+ conflicts.',
    coverage: '1946 – 2023', update: 'Annual', format: 'CSV / API',
    url: 'https://ucdp.uu.se',
    usedFor: 'Conflict Timeline',
  },
  {
    name: 'GDELT Project',
    org: 'Global Database of Events, Language & Tone',
    badge: 'Live Feed', badgeColor: '#00d4ff',
    desc: 'Real-time global news event database monitoring broadcast, print, and online news in 100+ languages. Used for live conflict arc detection and the incident feed, updating every 15 minutes.',
    coverage: '1979 – Present', update: 'Every 15 min', format: 'JSON API',
    url: 'https://www.gdeltproject.org',
    usedFor: 'Globe Arcs · Incident Feed',
  },
  {
    name: 'SIPRI Arms Transfers Database',
    org: 'Stockholm International Peace Research Institute',
    badge: 'Arms Trade', badgeColor: '#ff6b00',
    desc: 'Comprehensive data on international transfers of major conventional weapons. Used for the Arms Trade Flow globe layer, covering Cold War to present. TIV (Trend Indicator Value) methodology.',
    coverage: '1950 – 2023', update: 'Annual', format: 'Manual / Reports',
    url: 'https://www.sipri.org/databases/armstransfers',
    usedFor: 'Arms Trade Flow',
  },
  {
    name: 'OFAC SDN List',
    org: 'Office of Foreign Assets Control — US Treasury',
    badge: 'Sanctions', badgeColor: '#c62828',
    desc: 'Official US sanctions list including SDN (Specially Designated Nationals), sectoral sanctions, and country-specific restrictions. Used for the Sanctions Tracker page.',
    coverage: 'Current', update: 'Ongoing', format: 'XML / PDF',
    url: 'https://ofac.treasury.gov',
    usedFor: 'Sanctions Tracker',
  },
  {
    name: 'EU Consolidated Sanctions List',
    org: 'European Union External Action',
    badge: 'Sanctions', badgeColor: '#1565c0',
    desc: 'EU financial sanctions, asset freezes, and travel bans across all EU regulations and decisions. Includes Russia, Belarus, Iran, Myanmar, Syria, and other regimes.',
    coverage: 'Current', update: 'Ongoing', format: 'XML / CSV',
    url: 'https://data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions',
    usedFor: 'Sanctions Tracker',
  },
  {
    name: 'UN Security Council Sanctions',
    org: 'United Nations',
    badge: 'Sanctions', badgeColor: '#1a6ed8',
    desc: 'UN-mandated sanctions regimes including arms embargoes, travel bans, and asset freezes on North Korea, Iran, Sudan, Somalia, Mali, and others.',
    coverage: 'Current', update: 'As adopted', format: 'PDF / Web',
    url: 'https://www.un.org/securitycouncil/sanctions/information',
    usedFor: 'Sanctions Tracker',
  },
  {
    name: 'FAS Nuclear Notebook',
    org: 'Federation of American Scientists',
    badge: 'Nuclear', badgeColor: '#ffaa00',
    desc: 'Authoritative estimates of global nuclear warhead stockpiles, deployment status, and delivery systems for all 9 nuclear-armed states. Published in the Bulletin of Atomic Scientists.',
    coverage: 'Current estimates', update: 'Annual', format: 'Reports',
    url: 'https://fas.org/initiative/status-world-nuclear-forces/',
    usedFor: 'Nuclear Intelligence',
  },
  {
    name: 'SIPRI Nuclear Forces Data',
    org: 'Stockholm International Peace Research Institute',
    badge: 'Nuclear', badgeColor: '#ffaa00',
    desc: 'Annual nuclear forces data published in the SIPRI Yearbook. Warhead inventories, operational status, and delivery vehicle specifications.',
    coverage: 'Current estimates', update: 'Annual', format: 'Reports',
    url: 'https://www.sipri.org/research/armament-and-disarmament/nuclear-disarmament-arms-control-and-non-proliferation/nuclear-weapons',
    usedFor: 'Nuclear Intelligence',
  },
  {
    name: 'CartoDB / OpenStreetMap',
    org: 'CARTO & OpenStreetMap Contributors',
    badge: 'Map Tiles', badgeColor: '#2e7d32',
    desc: 'Dark Matter tile set used as the base map for the Incident Feed 2D map. OpenStreetMap data underlies the geographic features.',
    coverage: 'Global', update: 'Continuous', format: 'Tile API',
    url: 'https://carto.com/basemaps/',
    usedFor: 'Incident Feed Map',
  },
  {
    name: 'Natural Earth',
    org: 'Natural Earth / nvkelso',
    badge: 'Geodata', badgeColor: '#2e7d32',
    desc: 'GeoJSON country polygons used to render the 3D globe. Admin-0 110m resolution country boundaries with ISO codes for country identification.',
    coverage: 'Global', update: 'Periodic', format: 'GeoJSON',
    url: 'https://www.naturalearthdata.com',
    usedFor: '3D Globe',
  },
];

export default function DataSources() {
  injectCSS('ds-css', CSS);
  return (
    <div className="ds-page">
      <SEO
        title="Data Sources — Military Intelligence References"
        description="WarScope data sources: SIPRI, IISS Military Balance, GDELT, Global Firepower, ACLED, open-source military databases, and government publications."
        canonical="/data-sources"
      />
      <Navbar />
      <div className="ds-hero">
        <div className="ds-hero-inner">
          <div className="ds-eyebrow">📊 Transparency</div>
          <h1 className="ds-title">DATA<br/><em>SOURCES</em></h1>
          <p className="ds-sub">Every dataset powering WarScope — with full attribution, coverage details, and direct links to primary sources.</p>
        </div>
      </div>

      <AdBanner />

      <div className="ds-body">

        <div className="ds-section">
          <h2 className="ds-h2"><span>Primary</span> Data Sources</h2>
          <p className="ds-p">WarScope is built entirely on open, publicly available datasets from leading academic institutions, intergovernmental organisations, and research bodies. We do not collect or generate original intelligence data.</p>
        </div>

        <div className="ds-grid">
          {SOURCES.map(s => (
            <div key={s.name} className="ds-card">
              <div className="ds-card-top">
                <div>
                  <div className="ds-card-name">{s.name}</div>
                  <div className="ds-card-org">{s.org}</div>
                </div>
                <span
                  className="ds-card-badge"
                  style={{ color:s.badgeColor, borderColor:`${s.badgeColor}44`, background:`${s.badgeColor}14`, border:'1px solid' }}
                >{s.badge}</span>
              </div>
              <div className="ds-card-desc">{s.desc}</div>
              <div className="ds-card-meta">
                <div className="ds-meta-item">
                  <div className="ds-meta-label">Coverage</div>
                  <div className="ds-meta-val">{s.coverage}</div>
                </div>
                <div className="ds-meta-item">
                  <div className="ds-meta-label">Updates</div>
                  <div className="ds-meta-val">{s.update}</div>
                </div>
                <div className="ds-meta-item">
                  <div className="ds-meta-label">Used For</div>
                  <div className="ds-meta-val">{s.usedFor}</div>
                </div>
              </div>
              <a href={s.url} target="_blank" rel="noopener" className="ds-card-link">↗ Visit Source</a>
            </div>
          ))}
        </div>

        <div className="ds-section">
          <h2 className="ds-h2"><span>Data</span> Licensing</h2>
          <table className="ds-table">
            <thead><tr><th>Source</th><th>License</th><th>Commercial Use</th></tr></thead>
            <tbody>
              {[
                ['UCDP', 'CC BY 4.0', 'Permitted with attribution'],
                ['GDELT', 'Open / Public Domain', 'Permitted'],
                ['SIPRI', 'Free for non-commercial research', 'Attribution required'],
                ['OFAC', 'US Government / Public Domain', 'Permitted'],
                ['UN Sanctions', 'UN Terms of Use', 'Permitted with attribution'],
                ['FAS Nuclear Notebook', 'Open access', 'Permitted with attribution'],
                ['Natural Earth', 'Public Domain', 'Permitted'],
                ['CartoDB Tiles', 'CC BY 3.0', 'Permitted with attribution'],
              ].map(([src, lic, com]) => (
                <tr key={src}><td>{src}</td><td>{lic}</td><td>{com}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}