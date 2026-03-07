import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=Barlow+Condensed:wght@300;400;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
.ct-page{min-height:100vh;background:#04040a;color:#e8eaf0;font-family:'Barlow',sans-serif;}
.ct-hero{position:relative;padding:56px 40px 44px;border-bottom:1px solid #161b2e;overflow:hidden;background:radial-gradient(ellipse 80% 40% at 50% 0%,rgba(0,212,255,0.05) 0%,transparent 70%);}
.ct-hero::before{content:'';position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,212,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,0.02) 1px,transparent 1px);background-size:48px 48px;}
.ct-hero-inner{position:relative;z-index:2;max-width:900px;}
.ct-eyebrow{display:inline-flex;align-items:center;gap:8px;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#00d4ff;text-transform:uppercase;background:rgba(0,212,255,0.07);border:1px solid rgba(0,212,255,0.2);border-radius:3px;padding:4px 12px;margin-bottom:20px;}
.ct-title{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,6vw,76px);letter-spacing:-0.02em;line-height:0.92;color:#e8eaf0;margin-bottom:16px;}
.ct-title em{color:#00d4ff;font-style:normal;}
.ct-sub{font-size:15px;color:#8892a4;max-width:500px;line-height:1.7;margin-top:12px;}
.ct-body{max-width:960px;margin:0 auto;padding:48px 40px 72px;display:grid;grid-template-columns:1fr 1fr;gap:48px;}
.ct-form-wrap{}
.ct-info-wrap{display:flex;flex-direction:column;gap:20px;}
.ct-h2{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;color:#e8eaf0;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #161b2e;}
.ct-h2 span{color:#00d4ff;}
.ct-field{margin-bottom:18px;}
.ct-label{display:block;font-family:'IBM Plex Mono',monospace;font-size:10px;letter-spacing:0.14em;color:#8892a4;text-transform:uppercase;margin-bottom:7px;}
.ct-input{width:100%;background:rgba(8,10,18,0.8);border:1px solid #161b2e;border-radius:6px;padding:11px 14px;color:#e8eaf0;font-family:'Barlow',sans-serif;font-size:14px;outline:none;transition:border-color 180ms;}
.ct-input:focus{border-color:rgba(0,212,255,0.4);}
.ct-input::placeholder{color:#3a4155;}
.ct-select{width:100%;background:rgba(8,10,18,0.8);border:1px solid #161b2e;border-radius:6px;padding:11px 14px;color:#e8eaf0;font-family:'Barlow',sans-serif;font-size:14px;outline:none;appearance:none;transition:border-color 180ms;cursor:pointer;}
.ct-select:focus{border-color:rgba(0,212,255,0.4);}
.ct-textarea{width:100%;background:rgba(8,10,18,0.8);border:1px solid #161b2e;border-radius:6px;padding:11px 14px;color:#e8eaf0;font-family:'Barlow',sans-serif;font-size:14px;outline:none;resize:vertical;min-height:140px;transition:border-color 180ms;line-height:1.6;}
.ct-textarea:focus{border-color:rgba(0,212,255,0.4);}
.ct-textarea::placeholder{color:#3a4155;}
.ct-submit{width:100%;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.35);border-radius:6px;padding:13px 24px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:0.14em;color:#00d4ff;text-transform:uppercase;transition:all 200ms;margin-top:4px;}
.ct-submit:hover:not(:disabled){background:rgba(0,212,255,0.18);box-shadow:0 0 16px rgba(0,212,255,0.15);}
.ct-submit:disabled{opacity:0.5;cursor:not-allowed;}
.ct-success{background:rgba(0,230,118,0.07);border:1px solid rgba(0,230,118,0.25);border-radius:8px;padding:24px;text-align:center;animation:ct-fade 300ms ease;}
.ct-success-icon{font-size:32px;margin-bottom:12px;}
.ct-success-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:22px;color:#00e676;margin-bottom:8px;}
.ct-success-text{font-size:14px;color:#8892a4;line-height:1.7;}
.ct-error{background:rgba(255,59,59,0.07);border:1px solid rgba(255,59,59,0.25);border-radius:6px;padding:12px 16px;margin-top:12px;font-family:'IBM Plex Mono',monospace;font-size:11px;color:#ff8080;letter-spacing:0.06em;}
@keyframes ct-fade{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
.ct-info-card{background:rgba(8,10,18,0.7);border:1px solid #161b2e;border-radius:10px;padding:22px 24px;}
.ct-info-card-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:17px;color:#e8eaf0;margin-bottom:6px;}
.ct-info-card-text{font-size:13px;color:#8892a4;line-height:1.7;}
.ct-info-card-link{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#00d4ff;text-decoration:none;letter-spacing:0.06em;display:inline-block;margin-top:8px;}
.ct-info-card-link:hover{text-decoration:underline;}
.ct-char-count{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#3a4155;text-align:right;margin-top:4px;}
@media(max-width:768px){.ct-hero{padding:36px 20px 28px;}.ct-body{grid-template-columns:1fr;padding:32px 20px 48px;gap:32px;}.ct-info-wrap{order:-1;}}
`;

const SUBJECTS = [
  'General Enquiry',
  'Data Accuracy Issue',
  'Content Removal Request',
  'Press / Media Enquiry',
  'Partnership / Collaboration',
  'Privacy / Data Request',
  'Bug Report',
  'Other',
];

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

export default function Contact() {
  injectCSS('ct-css', CSS);

  const [form, setForm]       = useState({ name:'', email:'', subject:'General Enquiry', message:'' });
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error
  const [errMsg, setErrMsg]   = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrMsg('Please fill in all required fields.'); return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setErrMsg('Please enter a valid email address.'); return;
    }
    if (form.message.trim().length < 20) {
      setErrMsg('Message must be at least 20 characters.'); return;
    }

    setStatus('sending'); setErrMsg('');

    // Use mailto as the send mechanism — opens default mail client
    // For a real form submission, replace with fetch() to your backend
    const mailtoLink = `mailto:contact@warscopeglobal.com`
      + `?subject=${encodeURIComponent(`[WarScope] ${form.subject} — from ${form.name}`)}`
      + `&body=${encodeURIComponent(
          `Name: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\nMessage:\n${form.message}`
        )}`;

    try {
      window.location.href = mailtoLink;
      // Show success after short delay
      setTimeout(() => setStatus('success'), 800);
    } catch {
      setStatus('error');
      setErrMsg('Failed to open mail client. Please email us directly at contact@warscopeglobal.com');
    }
  };

  return (
    <div className="ct-page">
      <Navbar />

      <div className="ct-hero">
        <div className="ct-hero-inner">
          <div className="ct-eyebrow">✉ Get in Touch</div>
          <h1 className="ct-title">CONTACT<br/><em>WARSCOPE</em></h1>
          <p className="ct-sub">Questions, data issues, press enquiries, or partnership requests — we read every message.</p>
        </div>
      </div>

      <AdBanner />

      <div className="ct-body">

        {/* ── Contact form ─────────────────────────────────────────── */}
        <div className="ct-form-wrap">
          <h2 className="ct-h2"><span>Send</span> a Message</h2>

          {status === 'success' ? (
            <div className="ct-success">
              <div className="ct-success-icon">✓</div>
              <div className="ct-success-title">Message Sent</div>
              <div className="ct-success-text">
                Your mail client should have opened with the message pre-filled.<br/>
                We aim to respond within 2–3 business days.<br/><br/>
                Or email us directly at<br/>
                <a href="mailto:contact@warscopeglobal.com" style={{color:'#00d4ff',fontFamily:'IBM Plex Mono,monospace',fontSize:12}}>contact@warscopeglobal.com</a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
                <div className="ct-field">
                  <label className="ct-label">Name *</label>
                  <input
                    className="ct-input"
                    type="text"
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    maxLength={80}
                  />
                </div>
                <div className="ct-field">
                  <label className="ct-label">Email *</label>
                  <input
                    className="ct-input"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    maxLength={120}
                  />
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label">Subject</label>
                <select
                  className="ct-select"
                  value={form.subject}
                  onChange={e => update('subject', e.target.value)}
                >
                  {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div className="ct-field">
                <label className="ct-label">Message * <span style={{color:'#3a4155',fontWeight:400}}>(min 20 chars)</span></label>
                <textarea
                  className="ct-textarea"
                  placeholder="Describe your enquiry in detail..."
                  value={form.message}
                  onChange={e => update('message', e.target.value)}
                  maxLength={2000}
                />
                <div className="ct-char-count">{form.message.length} / 2000</div>
              </div>

              {errMsg && <div className="ct-error">⚠ {errMsg}</div>}

              <button
                type="submit"
                className="ct-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? '⟳ Opening Mail Client...' : '↗ Send Message'}
              </button>

              <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'#3a4155',marginTop:12,letterSpacing:'0.06em',lineHeight:1.7}}>
                This will open your default mail client with the message pre-filled.<br/>
                Alternatively, email us directly at <a href="mailto:contact@warscopeglobal.com" style={{color:'#00d4ff'}}>contact@warscopeglobal.com</a>
              </div>

            </form>
          )}
        </div>

        {/* ── Info sidebar ─────────────────────────────────────────── */}
        <div className="ct-info-wrap">
          <h2 className="ct-h2"><span>Contact</span> Info</h2>

          {[
            {
              icon: '✉',
              title: 'General Enquiries',
              text: 'For general questions, feedback, and all other enquiries.',
              link: 'contact@warscopeglobal.com',
              href: 'mailto:contact@warscopeglobal.com',
            },
            {
              icon: '⚖',
              title: 'Legal & Privacy',
              text: 'Privacy requests, GDPR data rights, terms questions, and legal matters.',
              link: 'privacy@warscopeglobal.com',
              href: 'mailto:privacy@warscopeglobal.com',
            },
            {
              icon: '📰',
              title: 'Press & Media',
              text: 'Interview requests, media kits, and press enquiries.',
              link: 'contact@warscopeglobal.com',
              href: 'mailto:contact@warscopeglobal.com',
            },
            {
              icon: '🚩',
              title: 'Data Issues',
              text: 'Report inaccurate data, missing conflicts, or incorrect information.',
              link: 'contact@warscopeglobal.com',
              href: 'mailto:contact@warscopeglobal.com',
            },
          ].map(card => (
            <div key={card.title} className="ct-info-card">
              <div style={{fontSize:20, marginBottom:8}}>{card.icon}</div>
              <div className="ct-info-card-title">{card.title}</div>
              <div className="ct-info-card-text">{card.text}</div>
              <a href={card.href} className="ct-info-card-link">↗ {card.link}</a>
            </div>
          ))}

          <div className="ct-info-card" style={{background:'rgba(0,212,255,0.04)',borderColor:'rgba(0,212,255,0.12)'}}>
            <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,letterSpacing:'0.12em',color:'#3a4155',textTransform:'uppercase',marginBottom:8}}>Response Time</div>
            <div className="ct-info-card-text">We aim to respond to all enquiries within <strong style={{color:'#e8eaf0'}}>2–3 business days</strong>. For urgent data accuracy issues, we aim to respond within 24 hours.</div>
          </div>

        </div>
      </div>

      <AdBanner />
      <Footer />
    </div>
  );
}