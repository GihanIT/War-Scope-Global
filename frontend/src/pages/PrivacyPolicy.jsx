import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO from '../seo/SEO.jsx';


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
*.lg-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.lg-hero{position:relative;padding:56px 40px 44px;border-bottom:1px solid #161b2e;overflow:hidden;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,212,255,0.05) 0%,transparent 70%);}
.lg-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px);background-size:48px 48px;}
.lg-hero-inner{position:relative;z-index:2;max-width:860px;}
.lg-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#00d4ff;text-transform:uppercase;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);border-radius:3px;padding:4px 12px;margin-bottom:20px;}
.lg-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,6vw,76px);letter-spacing:-0.02em;line-height:0.92;color:#e8eaf0;margin-bottom:16px;}
.lg-title em{color:#00d4ff;font-style:normal;}
.lg-updated{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#3a4155;letter-spacing:0.1em;}
.lg-body{max-width:860px;margin:0 auto;padding:48px 40px 72px;}
.lg-section{margin-bottom:44px;}
.lg-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;color:#e8eaf0;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #161b2e;letter-spacing:0.02em;}
.lg-h2 span{color:#00d4ff;}
.lg-p{font-size:15px;color:#8892a4;line-height:1.85;margin-bottom:12px;}
.lg-p a{color:#00d4ff;text-decoration:none;}
.lg-ul{list-style:none;margin:10px 0 12px;}
.lg-ul li{font-size:15px;color:#8892a4;line-height:1.75;padding:4px 0 4px 20px;position:relative;}
.lg-ul li::before{content:'›';position:absolute;left:0;color:#00d4ff;font-weight:700;}
.lg-box{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.12);border-left:3px solid #00d4ff;border-radius:6px;padding:16px 20px;margin:16px 0;}
.lg-box p{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8892a4;line-height:1.8;letter-spacing:0.02em;}
.lg-box p strong{color:#00d4ff;}
.lg-table{width:100%;border-collapse:collapse;margin:16px 0;}
.lg-table th{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.12em;color:#3a4155;text-transform:uppercase;padding:8px 14px;border-bottom:1px solid #161b2e;text-align:left;}
.lg-table td{font-size:13px;color:#8892a4;padding:10px 14px;border-bottom:1px solid rgba(22,27,46,0.5);vertical-align:top;line-height:1.6;}
.lg-table tr:last-child td{border-bottom:none;}
.lg-table td:first-child{color:#e8eaf0;font-weight:500;white-space:nowrap;}
@media(max-width:768px){.lg-hero{padding:36px 20px 28px;}.lg-body{padding:32px 20px 48px;}}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

export default function PrivacyPolicy() {
  injectCSS('lg-css', CSS);
  return (
    <div className="lg-page">
      <SEO title="Privacy Policy" description="WarScope privacy policy." canonical="/privacy-policy" noindex={true} />
      <Navbar />
      <div className="lg-hero">
        <div className="lg-hero-inner">
          <div className="lg-eyebrow">⚖ Legal Document</div>
          <h1 className="lg-title">PRIVACY<br/><em>POLICY</em></h1>
          <div className="lg-updated">Last updated: March 2025 · Effective immediately</div>
        </div>
      </div>

      <AdBanner />

      <div className="lg-body">

        <div className="lg-box"><p><strong>Summary:</strong> WarScope collects minimal data. We use Google AdSense for advertising, which may use cookies. We do not sell your personal data. We do not require account registration.</p></div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>01.</span> Who We Are</h2>
          <p className="lg-p">WarScope ("we", "us", "our") is a global conflict intelligence platform that aggregates publicly available data from open-source databases including UCDP, GDELT, SIPRI, OFAC, and UN Security Council records. This Privacy Policy explains how we collect, use, and protect your information when you visit warscope.app.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>02.</span> Information We Collect</h2>
          <p className="lg-p">We collect minimal personal information. The categories of data we may collect include:</p>
          <ul className="lg-ul">
            <li><strong>Usage Data:</strong> Pages visited, time spent, browser type, device type, and referring URL — collected automatically via standard web server logs.</li>
            <li><strong>Cookies:</strong> Small text files placed on your device by us or our advertising partners (Google AdSense). See Section 5 for details.</li>
            <li><strong>IP Address:</strong> Your IP address may be logged for security and analytics purposes. We do not use it to identify you personally.</li>
          </ul>
          <p className="lg-p">We do <strong style={{color:'#e8eaf0'}}>not</strong> collect names, email addresses, or any registration information as WarScope does not require account creation.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>03.</span> How We Use Your Data</h2>
          <table className="lg-table">
            <thead><tr><th>Purpose</th><th>Legal Basis</th><th>Data Used</th></tr></thead>
            <tbody>
              <tr><td>Serve the website</td><td>Legitimate interest</td><td>IP address, browser info</td></tr>
              <tr><td>Analytics & improvement</td><td>Legitimate interest</td><td>Usage data, page views</td></tr>
              <tr><td>Display advertisements</td><td>Consent (cookie banner)</td><td>Cookies, device identifiers</td></tr>
              <tr><td>Security & fraud prevention</td><td>Legitimate interest</td><td>IP address, logs</td></tr>
            </tbody>
          </table>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>04.</span> Third-Party Services & Google AdSense</h2>
          <p className="lg-p">We use third-party services to support and monetize our platform. Most notably, we use Google AdSense to publish advertisements. To comply with Google's publisher policies, please be aware of the following:</p>
          <ul className="lg-ul">
            <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet.</li>
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</li>
            <li>Alternatively, users can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="http://www.aboutads.info" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</li>
          </ul>
          <p className="lg-p" style={{ marginTop: '16px' }}>Other third-party services include the GDELT Project (for fetching publicly available news event data) and CartoDB / OpenStreetMap (for rendering map tiles). No personal identifiable information is shared by us with these secondary services.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>05.</span> Cookies & Tracking Technologies</h2>
          <p className="lg-p">We use the following types of cookies to operate and monetize WarScope:</p>
          <table className="lg-table">
            <thead><tr><th>Type</th><th>Purpose</th><th>Duration</th></tr></thead>
            <tbody>
              <tr><td>Essential</td><td>Required for the site to function and load securely.</td><td>Session</td></tr>
              <tr><td>Analytics</td><td>Understanding how visitors navigate our intelligence feeds.</td><td>Up to 2 years</td></tr>
              <tr><td>Advertising</td><td>Google AdSense and DoubleClick cookies for ad delivery.</td><td>Up to 2 years</td></tr>
            </tbody>
          </table>
          <p className="lg-p"><strong>Consent:</strong> By using this site, you consent to the placement of these cookies. You can control or delete cookies through your browser settings at any time. Disabling advertising cookies will not remove ads from the site, but it will make them non-personalized.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>06.</span> Data Retention</h2>
          <p className="lg-p">Server logs are retained for a maximum of 90 days for security purposes and then permanently deleted. We do not store any personal profile data as we do not have user accounts.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>07.</span> Your Rights</h2>
          <p className="lg-p">Depending on your location, you may have the following rights regarding your data:</p>
          <ul className="lg-ul">
            <li>Right to access the personal data we hold about you</li>
            <li>Right to deletion ("right to be forgotten")</li>
            <li>Right to object to processing for advertising purposes</li>
            <li>Right to data portability</li>
            <li>Right to opt out of personalised advertising (via Google Ad Settings)</li>
          </ul>
          <p className="lg-p">To exercise any of these rights, contact us at <a href="mailto:contact@warscopeglobal.com">contact@warscopeglobal.com</a>.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>08.</span> Children's Privacy</h2>
          <p className="lg-p">WarScope is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us immediately.</p>
        </div>

        <div className="lg-section">
          <h2 className="lg-h2"><span>09.</span> Changes to This Policy</h2>
          <p className="lg-p">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of the platform after changes constitutes acceptance of the updated policy.</p>
        </div>

      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}