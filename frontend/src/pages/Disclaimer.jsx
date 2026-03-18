import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO from '../seo/SEO.jsx';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600&display=swap');
.lg-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.lg-hero{position:relative;padding:56px 40px 44px;border-bottom:1px solid #161b2e;overflow:hidden;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(255,170,0,0.04) 0%,transparent 70%);}
.lg-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,170,0,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,170,0,0.015) 1px,transparent 1px);background-size:48px 48px;}
.lg-hero-inner{position:relative;z-index:2;max-width:860px;}
.lg-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#ffaa00;text-transform:uppercase;background:rgba(255,170,0,0.07);border:1px solid rgba(255,170,0,0.25);border-radius:3px;padding:4px 12px;margin-bottom:20px;}
.lg-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,6vw,76px);letter-spacing:-0.02em;line-height:0.92;color:#e8eaf0;margin-bottom:16px;}
.lg-title em{color:#ffaa00;font-style:normal;}
.lg-updated{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#3a4155;letter-spacing:0.1em;}
.lg-body{max-width:860px;margin:0 auto;padding:48px 40px 72px;}
.lg-section{margin-bottom:44px;}
.lg-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;color:#e8eaf0;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #161b2e;}
.lg-h2 span{color:#ffaa00;}
.lg-p{font-size:15px;color:#8892a4;line-height:1.85;margin-bottom:12px;}
.lg-ul{list-style:none;margin:10px 0 12px;}
.lg-ul li{font-size:15px;color:#8892a4;line-height:1.75;padding:4px 0 4px 20px;position:relative;}
.lg-ul li::before{content:'›';position:absolute;left:0;color:#ffaa00;font-weight:700;}
.lg-warn{background:rgba(255,170,0,0.05);border:1px solid rgba(255,170,0,0.2);border-left:3px solid #ffaa00;border-radius:6px;padding:20px 24px;margin:16px 0;}
.lg-warn p{font-family:'IBM Plex Mono',monospace;font-size:13px;color:#c8a060;line-height:1.85;}
.lg-warn p strong{color:#ffaa00;}
.lg-box{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.12);border-left:3px solid #00d4ff;border-radius:6px;padding:16px 20px;margin:16px 0;}
.lg-box p{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8892a4;line-height:1.8;}
.lg-box p strong{color:#00d4ff;}
@media(max-width:768px){.lg-hero{padding:36px 20px 28px;}.lg-body{padding:32px 20px 48px;}}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

export default function Disclaimer() {
  injectCSS('lg-css-disc', CSS);
  return (
    <div className="lg-page">
      <SEO title="Disclaimer" description="WarScope disclaimer." canonical="/disclaimer" noindex={true} />
      <Navbar />
      <div className="lg-hero">
        <div className="lg-hero-inner">
          <div className="lg-eyebrow">⚠ Important Notice</div>
          <h1 className="lg-title">DISCLAIMER &<br/><em>LIMITATIONS</em></h1>
          <div className="lg-updated">Last updated: March 2025</div>
        </div>
      </div>

      <AdBanner />

      <div className="lg-body">

        <div className="lg-warn">
          <p><strong>Critical Notice:</strong> WarScope aggregates publicly available conflict data for informational and educational purposes only. It is NOT a source of operational intelligence and must never be used for military planning, targeting decisions, or any operational activity in conflict zones. Always verify information with authoritative primary sources.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>01.</span> Informational Purpose Only</h2>
          <p className="lg-p">All content on WarScope — including conflict maps, incident feeds, timelines, nuclear data, sanctions information, and arms trade visualisations — is provided solely for informational, educational, and research purposes.</p>
          <p className="lg-p">Nothing on this Platform constitutes professional military analysis, intelligence assessment, legal advice, or policy recommendation. WarScope is not affiliated with any government, military organisation, intelligence agency, or international body.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>02.</span> Data Accuracy & Limitations</h2>
          <p className="lg-p">The data displayed on WarScope is sourced from third-party open databases and news aggregators. We make no representation as to the accuracy, completeness, currency, or reliability of this data. Known limitations include:</p>
          <ul className="lg-ul">
            <li><strong>Delay:</strong> GDELT data updates every 15 minutes. Other datasets may have weekly, monthly, or annual update cycles.</li>
            <li><strong>Coverage gaps:</strong> Conflicts in areas with limited media access or internet connectivity may be underrepresented.</li>
            <li><strong>Classification bias:</strong> Conflict classification (intensity, type, actors) reflects the methodology of source databases, which may differ from other authoritative sources.</li>
            <li><strong>Geolocation:</strong> Incident coordinates are approximated and may not reflect precise event locations.</li>
            <li><strong>Historical data:</strong> Records from earlier decades may be incomplete or subject to retrospective revision by source datasets.</li>
          </ul>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>03.</span> Not Operational Intelligence</h2>
          <div className="lg-warn">
            <p><strong>Explicit Warning:</strong> WarScope data must never be used as operational military intelligence. The Platform is not designed, tested, or approved for use in active conflict zones, military operations, targeting decisions, or any situation where data accuracy is a matter of safety or legal consequence.</p>
          </div>
          <p className="lg-p">Users who require accurate, real-time conflict intelligence for operational purposes must consult authorised government intelligence services, official UN/NATO/AU briefings, or accredited professional conflict monitoring organisations.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>04.</span> Nuclear & Weapons Data</h2>
          <p className="lg-p">Nuclear warhead counts, delivery system specifications, and weapons capabilities data displayed on WarScope are derived from publicly available estimates published by organisations such as the Federation of American Scientists (FAS), the Stockholm International Peace Research Institute (SIPRI), and the Arms Control Association.</p>
          <p className="lg-p">These figures are <strong style={{color:'#e8eaf0'}}>estimates only</strong>. Actual stockpile sizes are classified by all nuclear states. Blast radius models and yield data are provided for educational context and should not be treated as precise technical specifications.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>05.</span> Sanctions & Legal Data</h2>
          <p className="lg-p">Sanctions information on WarScope is provided for awareness and research purposes only. It does not constitute legal advice. Sanctions regimes change frequently and the information displayed may not reflect the most current status.</p>
          <p className="lg-p">Anyone seeking to comply with sanctions obligations must consult official government sources including OFAC (US), the EU Consolidated List, UK OFSI, and the UN Security Council consolidated list, as well as qualified legal counsel.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>06.</span> No Endorsement</h2>
          <p className="lg-p">The display of information about conflicts, actors, governments, or organisations on WarScope does not constitute endorsement, support, or condemnation of any party to any conflict. WarScope is a politically neutral platform committed to presenting publicly available data without editorial bias.</p>
          <p className="lg-p">Naming of armed groups, governments, or individuals reflects terminology used in the source databases and does not imply any legal status or political judgment.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>07.</span> Automated Feeds & External Links</h2>
          <p className="lg-p">WarScope utilizes automated APIs (such as the GDELT Project) to aggregate external news headlines and event data. We do not manually curate, edit, or endorse the content of these third-party news feeds. The inclusion of an automated headline or link does not imply endorsement of the linked site, its publisher, or its content.</p>
          <p className="lg-p">If you encounter an automated headline or external link that violates our commitment to educational and analytical integrity (e.g., explicitly graphic, dangerous, or derogatory third-party content), please report it to our moderation team immediately for review and removal.</p>
        </div>

        <div className="lg-box">
          <p><strong>Questions about this disclaimer or reporting content?</strong> Contact us at <a href="mailto:contact@warscopeglobal.com" style={{color:'#00d4ff'}}>contact@warscopeglobal.com</a></p>
        </div>
      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}