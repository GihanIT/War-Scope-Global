import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO from '../seo/SEO.jsx';


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Barlow+Condensed:wght@300;400;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
.ab-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.ab-hero{position:relative;padding:72px 40px 56px;border-bottom:1px solid #161b2e;overflow:hidden;}
.ab-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,212,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.025) 1px,transparent 1px);background-size:48px 48px;}
.ab-hero::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 100% 60% at 50% 0%,rgba(0,212,255,0.06) 0%,transparent 70%);pointer-events:none;}
.ab-hero-inner{position:relative;z-index:2;max-width:1200px;margin:0 auto;}
.ab-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#00d4ff;text-transform:uppercase;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);border-radius:3px;padding:4px 12px;margin-bottom:24px;}
.ab-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(52px,8vw,100px);letter-spacing:-0.03em;line-height:0.88;color:#e8eaf0;margin-bottom:24px;}
.ab-title em{color:#00d4ff;font-style:normal;}
.ab-lead{font-size:17px;color:#8892a4;max-width:600px;line-height:1.8;margin-bottom:40px;}
.ab-stats{display:flex;gap:0;border:1px solid rgba(0,212,255,0.15);border-radius:8px;overflow:hidden;max-width:600px;background:rgba(6,8,16,0.8);}
.ab-stat{flex:1;padding:16px 20px;text-align:center;border-right:1px solid rgba(0,212,255,0.1);}
.ab-stat:last-child{border-right:none;}
.ab-stat-val{display:block;font-family:'IBM Plex Mono',monospace;font-size:22px;font-weight:600;color:#00d4ff;}
.ab-stat-label{display:block;font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:0.14em;color:#3a4155;text-transform:uppercase;margin-top:3px;}
.ab-body{max-width:1200px;margin:0 auto;padding:56px 40px 72px;}
.ab-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:56px;}
.ab-card{background:rgba(8,10,18,0.6);border:1px solid #161b2e;border-radius:10px;padding:28px;transition:border-color 200ms;}
.ab-card:hover{border-color:rgba(0,212,255,0.2);}
.ab-card-icon{font-size:28px;margin-bottom:14px;}
.ab-card-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:20px;color:#e8eaf0;margin-bottom:10px;}
.ab-card-text{font-size:14px;color:#8892a4;line-height:1.8;}
.ab-section{margin-bottom:52px;}
.ab-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:28px;color:#e8eaf0;margin-bottom:20px;letter-spacing:0.01em;}
.ab-h2 em{color:#00d4ff;font-style:normal;}
.ab-p{font-size:15px;color:#8892a4;line-height:1.85;margin-bottom:14px;}
.ab-feature-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;margin:20px 0;}
.ab-feature{display:flex;gap:12px;align-items:flex-start;padding:16px;background:rgba(8,10,18,0.6);border:1px solid #161b2e;border-radius:8px;}
.ab-feature-icon{font-size:20px;flex-shrink:0;}
.ab-feature-body{}
.ab-feature-title{font-size:14px;font-weight:600;color:#e8eaf0;margin-bottom:4px;}
.ab-feature-desc{font-size:12px;color:#8892a4;line-height:1.6;}
.ab-timeline-strip{display:flex;flex-direction:column;gap:0;border-left:2px solid #161b2e;padding-left:24px;margin:20px 0;}
.ab-timeline-item{position:relative;padding:12px 0 12px;}
.ab-timeline-item::before{content:'';position:absolute;left:-30px;top:18px;width:10px;height:10px;border-radius:50%;background:#00d4ff;box-shadow:0 0 8px #00d4ff;}
.ab-timeline-year{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#00d4ff;letter-spacing:0.1em;margin-bottom:4px;}
.ab-timeline-text{font-size:14px;color:#8892a4;line-height:1.6;}
@media(max-width:768px){.ab-hero{padding:40px 20px 36px;}.ab-body{padding:32px 20px 48px;}.ab-grid{grid-template-columns:1fr;}.ab-stats{flex-wrap:wrap;}.ab-stat{min-width:50%;}}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

const FEATURES = [
  { icon:'🌍', title:'Interactive Globe', desc:'3D globe with live conflict arcs, nuclear state markers, and alliance overlays.' },
  { icon:'📋', title:'Conflict Timeline', desc:'Every UCDP-recorded conflict since 1946, searchable and filterable by region and type.' },
  { icon:'⚛️', title:'Nuclear Intelligence', desc:'Warhead counts, delivery systems, blast radius models for all 9 nuclear states.' },
  { icon:'🚫', title:'Sanctions Tracker', desc:'UN, US, EU and UK sanctions regimes with legal basis and status for 14+ countries.' },
  { icon:'⚔️', title:'Arms Trade Flow', desc:'SIPRI-sourced arms transfers across Cold War, post-Cold War, and modern eras.' },
  { icon:'📡', title:'Incident Feed', desc:'GDELT-powered live incident map with 5 incident categories updated every 15 minutes.' },
  { icon:'🤝', title:'Alliance Map', desc:'8 major military alliances highlighted on the globe — NATO, CSTO, SCO, AUKUS and more.' },
  { icon:'📰', title:'Conflict Blog', desc:'In-depth analysis and briefings on active conflicts and geopolitical developments.' },
];

export default function About() {
  injectCSS('ab-css', CSS);
  return (
    <div className="ab-page">
      <SEO
        title="About WarScope — Global Military Intelligence Platform"
        description="WarScope aggregates open-source military data to provide conflict visualization, power comparison tools, and intelligence briefings for researchers and analysts."
        canonical="/about"
      />
      
      <Navbar />

      <div className="ab-hero">
        <div className="ab-hero-inner">
          <div className="ab-eyebrow">
            <span style={{width:6,height:6,borderRadius:'50%',background:'#00d4ff',display:'inline-block',boxShadow:'0 0 6px #00d4ff'}}/>
            About WarScope
          </div>
          <h1 className="ab-title">GLOBAL CONFLICT<br/><em>INTELLIGENCE</em><br/>FOR EVERYONE</h1>
          <p className="ab-lead">WarScope makes the world's conflict data accessible, visual, and understandable — drawing from the most authoritative open-source databases on the planet.</p>
          <div className="ab-stats">
            {[
              {val:'171', label:'Countries Tracked'},
              {val:'500+', label:'Conflicts Mapped'},
              {val:'9', label:'Nuclear States'},
              {val:'15min', label:'Update Cadence'},
            ].map(s => (
              <div key={s.label} className="ab-stat">
                <span className="ab-stat-val">{s.val}</span>
                <span className="ab-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdBanner />

      <div className="ab-body">

        <div className="ab-section">
          <h2 className="ab-h2">What is <em>WarScope</em>?</h2>
          <p className="ab-p">WarScope is an open-access conflict intelligence platform that aggregates, visualises, and contextualises global armed conflict data. Built for researchers, journalists, students, policy analysts, and curious citizens, WarScope transforms dense academic datasets into interactive, intuitive visual tools.</p>
          <p className="ab-p">We believe that understanding the world's conflicts — their history, their actors, their geography, and their consequences — is essential for informed global citizenship. By making this data free and visual, we aim to make conflict intelligence accessible to anyone with an internet connection.</p>
        </div>

        <div className="ab-section">
          <h2 className="ab-h2">Platform <em>Features</em></h2>
          <div className="ab-feature-list">
            {FEATURES.map(f => (
              <div key={f.title} className="ab-feature">
                <div className="ab-feature-icon">{f.icon}</div>
                <div className="ab-feature-body">
                  <div className="ab-feature-title">{f.title}</div>
                  <div className="ab-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ab-section">
          <h2 className="ab-h2">Our <em>Principles</em></h2>
          <div className="ab-grid">
            {[
              { icon:'🎯', title:'Political Neutrality', text:'We present data as recorded by authoritative academic and governmental sources without editorial bias. We do not take sides in any conflict and our visualisations reflect source data, not political opinion.' },
              { icon:'🔓', title:'Open Access', text:'WarScope is free to use for everyone. We believe conflict data — much of it funded by public institutions — should be publicly accessible without paywalls or registration barriers.' },
              { icon:'📐', title:'Methodological Transparency', text:'We document exactly where our data comes from, how it is processed, and what its limitations are. Our Methodology and Data Sources pages provide full attribution.' },
              { icon:'🛡️', title:'Responsible Use', text:'We are committed to ensuring WarScope is used for education and awareness, not harm. Our Terms of Use explicitly prohibit operational military use of our platform.' },
            ].map(c => (
              <div key={c.title} className="ab-card">
                <div className="ab-card-icon">{c.icon}</div>
                <div className="ab-card-title">{c.title}</div>
                <div className="ab-card-text">{c.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="ab-section">
          <h2 className="ab-h2">Who Uses <em>WarScope</em>?</h2>
          <p className="ab-p">WarScope is designed for anyone who wants to understand global conflict — without needing access to expensive intelligence platforms or specialised academic databases.</p>
          <div className="ab-feature-list">
            {[
              {icon:'🎓', title:'Students & Researchers', desc:'Visualise UCDP data for dissertations, papers, and geopolitical research.'},
              {icon:'📰', title:'Journalists', desc:'Quick visual context for breaking news about conflicts, sanctions, and military activity.'},
              {icon:'🏛️', title:'Policy Analysts', desc:'Overview of sanctions regimes, alliance structures, and arms transfer patterns.'},
              {icon:'🌐', title:'Curious Citizens', desc:'Understand what is happening in the world with clear, visual, and sourced information.'},
            ].map(f => (
              <div key={f.title} className="ab-feature">
                <div className="ab-feature-icon">{f.icon}</div>
                <div className="ab-feature-body">
                  <div className="ab-feature-title">{f.title}</div>
                  <div className="ab-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}