// src/pages/Contact.jsx
import { Link } from 'react-router-dom';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO      from '../seo/SEO.jsx';

const EMAIL      = 'info.warscope@gmail.com';
const REPO       = 'https://github.com/GihanIT/War-Scope-Global';
const ISSUES_NEW = `${REPO}/issues/new`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Barlow+Condensed:wght@300;400;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
.ct-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.ct-page *{box-sizing:border-box;}
.ct-page a:focus-visible{outline:2px solid #00d4ff;outline-offset:3px;border-radius:4px;}
.ct-hero{position:relative;padding:56px 40px 44px;border-bottom:1px solid #161b2e;overflow:hidden;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,212,255,0.05) 0%,transparent 70%);}
.ct-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px);background-size:48px 48px;}
.ct-hero-inner{position:relative;z-index:2;max-width:900px;}
.ct-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#00d4ff;text-transform:uppercase;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);border-radius:3px;padding:4px 12px;margin-bottom:20px;}
.ct-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,6vw,76px);letter-spacing:-0.02em;line-height:0.92;color:#e8eaf0;margin:0 0 16px;}
.ct-title em{color:#00d4ff;font-style:normal;}
.ct-sub{font-size:15px;color:#8892a4;max-width:560px;line-height:1.7;margin:12px 0 0;}
.ct-body{max-width:960px;margin:0 auto;padding:48px 40px 72px;}
.ct-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;color:#e8eaf0;margin:0 0 20px;padding-bottom:10px;border-bottom:1px solid #161b2e;}
.ct-h2 span{color:#00d4ff;}
.ct-section{margin-bottom:48px;}
.ct-notice{background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.22);border-left:3px solid #00d4ff;border-radius:0 10px 10px 0;padding:22px 26px;margin-bottom:40px;}
.ct-notice-title{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:24px;color:#e8eaf0;margin:0 0 8px;}
.ct-notice-text{font-size:15px;color:#a9b3c4;line-height:1.7;margin:0;max-width:70ch;}
.ct-notice-text a{color:#00d4ff;font-family:'IBM Plex Mono',monospace;font-size:13px;text-decoration:none;}
.ct-notice-text a:hover{text-decoration:underline;}
.ct-channels{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.ct-channel{background:rgba(8,10,18,0.7);border:1px solid #161b2e;border-radius:12px;padding:26px;display:flex;flex-direction:column;gap:10px;}
.ct-channel-icon{font-size:24px;}
.ct-channel-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;color:#e8eaf0;margin:0;}
.ct-channel-text{font-size:14px;color:#8892a4;line-height:1.7;margin:0;}
.ct-channel-addr{font-family:'IBM Plex Mono',monospace;font-size:13px;color:#e8eaf0;word-break:break-all;}
.ct-btn{display:inline-flex;align-items:center;align-self:flex-start;margin-top:auto;border-radius:6px;padding:12px 22px;font-family:'IBM Plex Mono',monospace;font-size:12px;font-weight:600;text-decoration:none;transition:background 200ms,box-shadow 200ms;}
.ct-btn-primary{background:rgba(0,212,255,0.12);border:1px solid rgba(0,212,255,0.4);color:#00d4ff;}
.ct-btn-primary:hover{background:rgba(0,212,255,0.2);box-shadow:0 0 16px rgba(0,212,255,0.15);}
.ct-btn-ghost{background:transparent;border:1px solid rgba(255,255,255,0.18);color:#e8eaf0;}
.ct-btn-ghost:hover{background:rgba(255,255,255,0.06);}
.ct-topics{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;}
.ct-topic{background:rgba(8,10,18,0.7);border:1px solid #161b2e;border-radius:10px;padding:20px 22px;}
.ct-topic-icon{font-size:20px;margin-bottom:8px;}
.ct-topic-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:18px;color:#e8eaf0;margin-bottom:6px;}
.ct-topic-text{font-size:13px;color:#8892a4;line-height:1.7;margin:0 0 10px;}
.ct-topic-link{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#00d4ff;text-decoration:none;}
.ct-topic-link:hover{text-decoration:underline;}
.ct-response{background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.12);border-radius:10px;padding:20px 24px;font-size:14px;color:#8892a4;line-height:1.7;}
.ct-response strong{color:#e8eaf0;}
.ct-contribute{margin-top:20px;background:rgba(99,102,241,0.06);border:1px solid rgba(99,102,241,0.2);border-radius:10px;padding:22px 24px;}
.ct-contribute-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:20px;color:#e8eaf0;margin-bottom:6px;}
.ct-contribute-text{font-size:14px;color:#8892a4;line-height:1.7;margin:0 0 10px;}
.ct-contribute a{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#a5b4fc;text-decoration:none;}
.ct-contribute a:hover{text-decoration:underline;}
@media(max-width:768px){.ct-hero{padding:36px 20px 28px;}.ct-body{padding:32px 20px 48px;}.ct-channels{grid-template-columns:1fr;}}
`;

const TOPICS = [
  { icon:'🚩', title:'Data issues',       text:'Inaccurate figures, missing conflicts or incorrect information. Include the page, what is wrong and a source if you have one.', kind:'issue', label:'Open a GitHub issue', title_prefix:'Data issue: ' },
  { icon:'🐞', title:'Bug reports',       text:'Something broken on the site? Tell us the page, your browser and what you expected to happen.', kind:'issue', label:'Open a GitHub issue', title_prefix:'Bug: ' },
  { icon:'⚖️', title:'Legal & privacy',   text:'Privacy requests, GDPR data rights, terms questions and content removal requests.', kind:'email', label:EMAIL, subject:'Legal / privacy request' },
  { icon:'📰', title:'Press & media',     text:'Interview requests, media enquiries and permission to use WarScope data.', kind:'email', label:EMAIL, subject:'Press enquiry' },
  { icon:'🤝', title:'Partnerships',      text:'Collaboration, research or data partnership proposals.', kind:'email', label:EMAIL, subject:'Partnership enquiry' },
  { icon:'✉️', title:'General questions', text:'Feedback and anything that does not fit above.', kind:'email', label:EMAIL, subject:'General enquiry' },
];

function injectCSS(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

export default function Contact() {
  injectCSS('ct-css', CSS);

  return (
    <div className="ct-page">
      <SEO
        title="Contact WarScope"
        description="Report a data issue or bug on WarScope by opening a GitHub issue, or email the team for press, legal and partnership enquiries."
        canonical="/contact"
      />
      <Navbar />

      <div className="ct-hero">
        <div className="ct-hero-inner">
          <div className="ct-eyebrow">✉ Get in Touch</div>
          <h1 className="ct-title">CONTACT<br/><em>WARSCOPE</em></h1>
          <p className="ct-sub">Questions, data issues, press enquiries or partnership requests. Choose the channel below that fits best.</p>
        </div>
      </div>

      <AdBanner />

      <div className="ct-body">

        <div className="ct-notice" role="note">
          <h2 className="ct-notice-title">Found a problem?</h2>
          <p className="ct-notice-text">
            If you have any issues, contact us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or <a href={ISSUES_NEW} target="_blank" rel="noopener noreferrer">post a GitHub issue</a>.
          </p>
        </div>

        <section className="ct-section" aria-labelledby="ct-channels">
          <h2 className="ct-h2" id="ct-channels"><span>Two</span> Ways to Reach Us</h2>
          <div className="ct-channels">
            <div className="ct-channel">
              <div className="ct-channel-icon">✉️</div>
              <h3 className="ct-channel-title">Email</h3>
              <p className="ct-channel-text">Best for private matters: legal and privacy requests, press, partnerships and general questions.</p>
              <div className="ct-channel-addr">{EMAIL}</div>
              <a className="ct-btn ct-btn-primary" href={`mailto:${EMAIL}`}>Send an email</a>
            </div>
            <div className="ct-channel">
              <div className="ct-channel-icon">🐙</div>
              <h3 className="ct-channel-title">GitHub issue</h3>
              <p className="ct-channel-text">Best for data corrections and bugs. Issues are public, so others can see the status and add sources. A free GitHub account is required.</p>
              <div className="ct-channel-addr">github.com/GihanIT/War-Scope-Global</div>
              <a className="ct-btn ct-btn-primary" href={ISSUES_NEW} target="_blank" rel="noopener noreferrer">Post an issue</a>
            </div>
          </div>
        </section>

        <section className="ct-section" aria-labelledby="ct-topics">
          <h2 className="ct-h2" id="ct-topics"><span>What</span> Should I Use?</h2>
          <div className="ct-topics">
            {TOPICS.map(t => {
              const href = t.kind === 'issue'
                ? `${ISSUES_NEW}?title=${encodeURIComponent(t.title_prefix)}`
                : `mailto:${EMAIL}?subject=${encodeURIComponent(t.subject)}`;
              return (
                <div key={t.title} className="ct-topic">
                  <div className="ct-topic-icon">{t.icon}</div>
                  <div className="ct-topic-title">{t.title}</div>
                  <p className="ct-topic-text">{t.text}</p>
                  <a
                    className="ct-topic-link"
                    href={href}
                    {...(t.kind === 'issue' ? { target:'_blank', rel:'noopener noreferrer' } : {})}
                  >
                    {t.label}
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        <section className="ct-section">
          <div className="ct-response">
            We aim to respond within <strong>2–3 business days</strong>. Please do not send classified, leaked or personal information about military personnel.
          </div>

          <div className="ct-contribute">
            <div className="ct-contribute-title">Want to contribute data?</div>
            <p className="ct-contribute-text">
              Know your country&apos;s military forces, equipment or conflict history? Add it to the open database with a pull request.
            </p>
            <Link to="/contribute">Read the contribution guide</Link>
          </div>
        </section>

      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}