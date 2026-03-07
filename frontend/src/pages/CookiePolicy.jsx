import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600&display=swap');
.ck-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.ck-hero{position:relative;padding:56px 40px 44px;border-bottom:1px solid #161b2e;overflow:hidden;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,212,255,0.05) 0%,transparent 70%);}
.ck-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px);background-size:48px 48px;}
.ck-hero-inner{position:relative;z-index:2;max-width:860px;}
.ck-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#00d4ff;text-transform:uppercase;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);border-radius:3px;padding:4px 12px;margin-bottom:20px;}
.ck-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,6vw,76px);letter-spacing:-0.02em;line-height:0.92;color:#e8eaf0;margin-bottom:16px;}
.ck-title em{color:#00d4ff;font-style:normal;}
.ck-updated{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#3a4155;letter-spacing:0.1em;}
.ck-body{max-width:860px;margin:0 auto;padding:48px 40px 72px;}
.ck-section{margin-bottom:44px;}
.ck-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;color:#e8eaf0;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #161b2e;}
.ck-h2 span{color:#00d4ff;}
.ck-p{font-size:15px;color:#8892a4;line-height:1.85;margin-bottom:12px;}
.ck-p a{color:#00d4ff;text-decoration:none;}
.ck-ul{list-style:none;margin:10px 0 12px;}
.ck-ul li{font-size:15px;color:#8892a4;line-height:1.75;padding:4px 0 4px 20px;position:relative;}
.ck-ul li::before{content:'›';position:absolute;left:0;color:#00d4ff;font-weight:700;}
.ck-box{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.12);border-left:3px solid #00d4ff;border-radius:6px;padding:16px 20px;margin:16px 0;}
.ck-box p{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#8892a4;line-height:1.8;}
.ck-box p strong{color:#00d4ff;}
.ck-table{width:100%;border-collapse:collapse;margin:16px 0;}
.ck-table th{font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.12em;color:#3a4155;text-transform:uppercase;padding:8px 14px;border-bottom:1px solid #161b2e;text-align:left;}
.ck-table td{font-size:13px;color:#8892a4;padding:10px 14px;border-bottom:1px solid rgba(22,27,46,0.5);vertical-align:top;line-height:1.6;}
.ck-table tr:last-child td{border-bottom:none;}
.ck-table td:first-child{color:#e8eaf0;font-weight:500;white-space:nowrap;}
@media(max-width:768px){.ck-hero{padding:36px 20px 28px;}.ck-body{padding:32px 20px 48px;}.ck-table{font-size:12px;}}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

export default function CookiePolicy() {
  injectCSS('ck-css', CSS);
  return (
    <div className="ck-page">
      <Navbar />
      <div className="ck-hero">
        <div className="ck-hero-inner">
          <div className="ck-eyebrow">🍪 Legal Document</div>
          <h1 className="ck-title">COOKIE<br/><em>POLICY</em></h1>
          <div className="ck-updated">Last updated: March 2025 · Applies to all WarScope pages</div>
        </div>
      </div>

      <AdBanner />

      <div className="ck-body">

        <div className="ck-box">
          <p><strong>Summary:</strong> WarScope uses essential cookies to function and advertising cookies via Google AdSense to serve relevant ads. We do not use cookies to track you across other websites for non-advertising purposes. You can manage cookies through your browser settings.</p>
        </div>

        <div className="ck-section">
          <h2 className="ck-h2"><span>01.</span> What Are Cookies?</h2>
          <p className="ck-p">Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work, remember your preferences, and provide information to site owners.</p>
          <p className="ck-p">Cookies cannot carry viruses or install malware on your device. The information they hold is used to identify your browser or device, not you personally.</p>
        </div>

        <div className="ck-section">
          <h2 className="ck-h2"><span>02.</span> Cookies We Use</h2>
          <table className="ck-table">
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Type</th>
                <th>Purpose</th>
                <th>Duration</th>
                <th>Provider</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['_ga', 'Analytics', 'Distinguishes unique users (Google Analytics)', '2 years', 'Google'],
                ['_ga_*', 'Analytics', 'Maintains session state (Google Analytics)', '2 years', 'Google'],
                ['__gads', 'Advertising', 'Google AdSense ad delivery and fraud prevention', '13 months', 'Google'],
                ['__gpi', 'Advertising', 'Google Publisher Infrastructure — ad personalisation', '1 year', 'Google'],
                ['DSID', 'Advertising', 'Tracks signed-in Google user ad preferences', '2 weeks', 'Google'],
                ['IDE', 'Advertising', 'DoubleClick — tracks ad clicks and conversions', '13 months', 'Google'],
                ['NID', 'Functional', 'Google preferences and sign-in state', '6 months', 'Google'],
                ['AID', 'Advertising', 'Links activity across Google-signed-in devices', 'Persistent', 'Google'],
              ].map(([name, type, purpose, dur, prov]) => (
                <tr key={name}>
                  <td><code style={{fontFamily:'IBM Plex Mono,monospace', fontSize:11, color:'#00d4ff'}}>{name}</code></td>
                  <td>{type}</td>
                  <td>{purpose}</td>
                  <td>{dur}</td>
                  <td>{prov}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ck-section">
          <h2 className="ck-h2"><span>03.</span> Cookie Categories</h2>

          <h3 style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:600,fontSize:17,color:'#c8d0e0',margin:'16px 0 8px'}}>Essential Cookies</h3>
          <p className="ck-p">These cookies are strictly necessary for the website to function. They cannot be disabled as they are required to deliver the core service. They do not store personally identifiable information.</p>

          <h3 style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:600,fontSize:17,color:'#c8d0e0',margin:'16px 0 8px'}}>Analytics Cookies</h3>
          <p className="ck-p">We use Google Analytics to understand how visitors interact with WarScope — which pages are most visited, how long users stay, and where they come from. This data is aggregated and anonymised. We use it solely to improve the platform.</p>

          <h3 style={{fontFamily:'Barlow Condensed,sans-serif',fontWeight:600,fontSize:17,color:'#c8d0e0',margin:'16px 0 8px'}}>Advertising Cookies (Google AdSense)</h3>
          <p className="ck-p">WarScope displays advertisements served by Google AdSense. Google uses cookies to serve ads based on your prior visits to WarScope and other websites. These cookies allow Google to show you more relevant ads across the web.</p>
          <p className="ck-p">You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ad Settings</a> or by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener">aboutads.info</a>.</p>
        </div>

        <div className="ck-section">
          <h2 className="ck-h2"><span>04.</span> Third-Party Cookies</h2>
          <p className="ck-p">Some cookies are placed by third-party services that appear on our pages. These include:</p>
          <ul className="ck-ul">
            <li><strong>Google AdSense</strong> — advertising cookies (see above)</li>
            <li><strong>CartoDB / OpenStreetMap</strong> — map tile servers on the Incident Feed page may set session cookies for tile caching</li>
            <li><strong>Google Fonts</strong> — font delivery may result in minimal logging by Google's CDN</li>
          </ul>
          <p className="ck-p">We do not control third-party cookies. Please refer to the respective third-party privacy policies for more information.</p>
        </div>

        <div className="ck-section">
          <h2 className="ck-h2"><span>05.</span> Managing Cookies</h2>
          <p className="ck-p">You can control and manage cookies in several ways:</p>
          <ul className="ck-ul">
            <li><strong>Browser settings:</strong> All modern browsers allow you to refuse, delete, or manage cookies. See your browser's help documentation for instructions.</li>
            <li><strong>Google Ad Settings:</strong> Visit <a href="https://www.google.com/settings/ads">google.com/settings/ads</a> to opt out of personalised Google ads.</li>
            <li><strong>Your Online Choices:</strong> Visit <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener">youronlinechoices.com</a> to manage advertising cookies from multiple companies.</li>
            <li><strong>NAI Opt-Out:</strong> Visit <a href="https://optout.networkadvertising.org" target="_blank" rel="noopener">optout.networkadvertising.org</a> for the Network Advertising Initiative opt-out tool.</li>
          </ul>
          <div className="ck-box">
            <p><strong>Note:</strong> Disabling cookies will not stop ads from appearing on WarScope — it will make the ads you see less relevant to your interests. Essential cookies cannot be disabled as they are required for the site to function.</p>
          </div>
        </div>

        <div className="ck-section">
          <h2 className="ck-h2"><span>06.</span> Do Not Track</h2>
          <p className="ck-p">Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want your browsing activity tracked. WarScope currently does not respond to DNT signals, as there is no industry-wide standard for how they should be interpreted. We continue to monitor developments in this area.</p>
        </div>

        <div className="ck-section">
          <h2 className="ck-h2"><span>07.</span> Updates to This Policy</h2>
          <p className="ck-p">We may update this Cookie Policy from time to time as our use of cookies changes or as legal requirements evolve. The updated policy will be posted on this page with a revised date. We encourage you to review this page periodically.</p>
        </div>

        <div className="ck-section">
          <h2 className="ck-h2"><span>08.</span> Contact</h2>
          <p className="ck-p">If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@warscopeglobal.com">privacy@warscopeglobal.com</a>.</p>
        </div>

      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}