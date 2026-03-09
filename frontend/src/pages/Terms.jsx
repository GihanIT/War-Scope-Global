import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO from '../seo/SEO.jsx';


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600&display=swap');
.lg-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.lg-hero{position:relative;padding:56px 40px 44px;border-bottom:1px solid #161b2e;overflow:hidden;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,212,255,0.05) 0%,transparent 70%);}
.lg-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px);background-size:48px 48px;}
.lg-hero-inner{position:relative;z-index:2;max-width:860px;}
.lg-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#00d4ff;text-transform:uppercase;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);border-radius:3px;padding:4px 12px;margin-bottom:20px;}
.lg-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,6vw,76px);letter-spacing:-0.02em;line-height:0.92;color:#e8eaf0;margin-bottom:16px;}
.lg-title em{color:#00d4ff;font-style:normal;}
.lg-updated{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#3a4155;letter-spacing:0.1em;}
.lg-body{max-width:860px;margin:0 auto;padding:48px 40px 72px;}
.lg-section{margin-bottom:44px;}
.lg-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;color:#e8eaf0;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #161b2e;}
.lg-h2 span{color:#00d4ff;}
.lg-p{font-size:15px;color:#8892a4;line-height:1.85;margin-bottom:12px;}
.lg-p a{color:#00d4ff;text-decoration:none;}
.lg-ul{list-style:none;margin:10px 0 12px;}
.lg-ul li{font-size:15px;color:#8892a4;line-height:1.75;padding:4px 0 4px 20px;position:relative;}
.lg-ul li::before{content:'›';position:absolute;left:0;color:#00d4ff;font-weight:700;}
.lg-warn{background:rgba(255,170,0,0.05);border:1px solid rgba(255,170,0,0.2);border-left:3px solid #ffaa00;border-radius:6px;padding:16px 20px;margin:16px 0;}
.lg-warn p{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8892a4;line-height:1.8;}
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

export default function Terms() {
  injectCSS('lg-css-terms', CSS);
  return (
    <div className="lg-page">
      <SEO title="Terms of Service" description="WarScope terms of service." canonical="/terms" noindex={true} />
      <Navbar />
      <div className="lg-hero">
        <div className="lg-hero-inner">
          <div className="lg-eyebrow">⚖ Legal Document</div>
          <h1 className="lg-title">TERMS OF<br/><em>USE</em></h1>
          <div className="lg-updated">Last updated: March 2025 · By using WarScope you agree to these terms</div>
        </div>
      </div>

      <AdBanner />

      <div className="lg-body">

        <div className="lg-warn"><p><strong>Important:</strong> Please read these Terms of Use carefully before using WarScope. By accessing or using the platform, you agree to be bound by these terms.</p></div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>01.</span> Acceptance of Terms</h2>
          <p className="lg-p">By accessing and using WarScope ("the Platform", "the Service"), you accept and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please discontinue use of the Platform immediately.</p>
          <p className="lg-p">These terms apply to all visitors, users, and others who access or use WarScope.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>02.</span> Description of Service</h2>
          <p className="lg-p">WarScope is a publicly accessible conflict intelligence and monitoring platform that aggregates and visualises data from open-source, publicly available databases including:</p>
          <ul className="lg-ul">
            <li>Uppsala Conflict Data Program (UCDP)</li>
            <li>GDELT Project (Global Database of Events, Language and Tone)</li>
            <li>Stockholm International Peace Research Institute (SIPRI)</li>
            <li>UN Security Council sanctions lists</li>
            <li>OFAC Specially Designated Nationals (SDN) List</li>
            <li>Other publicly available governmental and institutional sources</li>
          </ul>
          <p className="lg-p">The Platform provides visualisations, timelines, incident feeds, and analytical tools based on this publicly available data.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>03.</span> Permitted Use</h2>
          <p className="lg-p">You may use WarScope for the following purposes:</p>
          <ul className="lg-ul">
            <li>Personal, educational, and research purposes</li>
            <li>Journalistic reporting and media analysis</li>
            <li>Academic research and study</li>
            <li>Policy analysis and advocacy</li>
            <li>Non-commercial information gathering</li>
          </ul>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>04.</span> Prohibited Use</h2>
          <p className="lg-p">You may not use WarScope for:</p>
          <ul className="lg-ul">
            <li>Any unlawful purpose or in violation of any applicable laws or regulations</li>
            <li>Operational military planning, targeting, or intelligence gathering</li>
            <li>Facilitating, planning, or promoting violence or terrorism</li>
            <li>Systematic scraping, crawling, or automated data extraction without permission</li>
            <li>Reproducing or redistributing our content commercially without written consent</li>
            <li>Attempting to compromise the security or integrity of the Platform</li>
            <li>Any purpose that could bring WarScope into disrepute</li>
          </ul>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>05.</span> Intellectual Property</h2>
          <p className="lg-p">The WarScope platform, including its design, code, visualisations, and original content, is owned by WarScope and protected by applicable intellectual property laws.</p>
          <p className="lg-p">Data displayed on the Platform is sourced from third-party open databases and remains subject to those sources' respective licenses and terms. Attribution is provided throughout the Platform and on our Data Sources page.</p>
          <p className="lg-p">You may not copy, reproduce, distribute, or create derivative works from our Platform without express written permission, except as permitted by applicable fair use or educational exemptions.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>06.</span> Disclaimer of Warranties</h2>
          <div className="lg-warn"><p><strong>No Warranty:</strong> WarScope is provided "as is" and "as available" without any warranties of any kind, either express or implied, including but not limited to accuracy, completeness, reliability, or fitness for a particular purpose.</p></div>
          <p className="lg-p">We do not warrant that the Platform will be uninterrupted, error-free, or that defects will be corrected. Data displayed may be incomplete, delayed, or inaccurate. Always verify information with primary sources before relying on it.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>07.</span> Limitation of Liability</h2>
          <p className="lg-p">To the maximum extent permitted by applicable law, WarScope and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Platform or its data.</p>
          <p className="lg-p">Our total liability for any claims arising from your use of the Platform shall not exceed the amount you paid to use the Platform in the 12 months preceding the claim (which is zero, as WarScope is a free service).</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>08.</span> Third-Party Links & Advertising</h2>
          <p className="lg-p">WarScope displays third-party advertisements served by Google AdSense. We do not control the content of these advertisements and are not responsible for any third-party sites you may visit through them.</p>
          <p className="lg-p">The Platform may also link to external news sources and databases. These links are provided for informational purposes. We are not responsible for the content or privacy practices of external sites.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>09.</span> Modifications to Terms</h2>
          <p className="lg-p">We reserve the right to modify these Terms of Use at any time. Changes will be posted on this page with an updated date. Continued use of the Platform after changes constitutes your acceptance of the revised terms.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>10.</span> Governing Law</h2>
          <p className="lg-p">These Terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.</p>
        </div>

        <div className="lg-box"><p><strong>Questions?</strong> If you have questions about these Terms, contact us at <a href="mailto:legal@warscope.app" style={{color:'#00d4ff'}}>legal@warscope.app</a></p></div>

      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}