// src/pages/Contribute.jsx
// Add to App.jsx: import Contribute from './pages/Contribute.jsx';
//                 <Route path="/contribute" element={<Contribute />} />

import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SEO    from '../seo/SEO.jsx';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

const DATASETS = [
  { id:'army-units',  label:'⚔️ Army Units & Military Personnel',  covered:54,  total:195, priority:'high',   desc:'Troop numbers, branch structure, major unit names, headquarters' },
  { id:'vehicles',    label:'🛡️ Military Vehicles & Equipment',    covered:25,  total:195, priority:'high',   desc:'Tanks, aircraft, warships, missiles — specs and quantities' },
  { id:'sanctions',   label:'🚫 Sanctions & Arms Embargoes',       covered:19,  total:195, priority:'medium', desc:'Active sanctions against your country — arms embargoes, financial, trade' },
  { id:'arms-trade',  label:'🚀 Arms Transfers & Deals',           covered:40,  total:195, priority:'medium', desc:'Weapons purchased or sold by your country — supplier, type, year' },
  { id:'timeline',    label:'📜 Conflict History & Timeline',      covered:120, total:195, priority:'medium', desc:'Wars and conflicts involving your country — parties, dates, intensity' },
  { id:'other',       label:'📋 Other / Correction to Existing Data',covered:0,  total:0,   priority:'low',    desc:'Corrections, missing info, or anything that does not fit above' },
];

const EXPERTISE_OPTIONS = [
  'Military historian / researcher',
  'Active or former military personnel',
  'Defence journalist / analyst',
  'Academic / student',
  'Government / policy worker',
  'Interested civilian with knowledge of my country',
  'Other',
];

const SOURCE_OPTIONS = [
  'Government defence ministry website',
  'SIPRI (sipri.org)',
  'IISS Military Balance',
  'UCDP Conflict Data (ucdp.uu.se)',
  'FAS Nuclear Notebook',
  'CIA World Factbook',
  'Wikipedia (with cited sources)',
  'News article / press release',
  'Personal knowledge / direct experience',
  'Other',
];

const PRIORITY_COLORS = {
  high:   { text:'#ff3b3b', bg:'rgba(255,59,59,0.1)', border:'rgba(255,59,59,0.3)', label:'HIGH PRIORITY' },
  medium: { text:'#f0b429', bg:'rgba(240,180,41,0.1)', border:'rgba(240,180,41,0.3)', label:'MEDIUM PRIORITY' },
  low:    { text:'#00e676', bg:'rgba(0,230,118,0.1)', border:'rgba(0,230,118,0.3)', label:'LOW PRIORITY' },
};

// ── SECURITY: Frontend Sanitization ──────────────────────────────────────────
// Strips dangerous HTML tags before sending payload. 
// NOTE: Backend must ALSO sanitize data before saving to DB.
const sanitizeInput = (str) => {
  if (!str) return '';
  return str
    .replace(/<script[^>]*?>.*?<\/script>/gi, '') // Remove scripts
    .replace(/<[\/\!]*?[^<>]*?>/gi, '')          // Remove HTML tags
    .trim();
};

const validateEmail = (email) => {
  if (!email) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  --bg: #03050a;
  --panel: rgba(12, 16, 28, 0.85);
  --border: rgba(0, 212, 255, 0.15);
  --border-hover: rgba(0, 212, 255, 0.4);
  --accent: #00d4ff;
  --accent-dim: rgba(0, 212, 255, 0.1);
  --text: #f0f4ff;
  --muted: #94a3b8;
  --dim: #475569;
  --error: #ff3b3b;
  --success: #00e676;
}

.cv { min-height:100dvh; background:var(--bg); color:var(--text); font-family:'Barlow',sans-serif; overflow-x:hidden; position:relative; }
.cv::before { content:''; position:fixed; inset:0; background-image:radial-gradient(circle at 50% 0%, rgba(0,212,255,0.05) 0%, transparent 70%), linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px); background-size:100% 100%, 40px 40px, 40px 40px; pointer-events:none; z-index:0; }
.cv-wrap { max-width:960px; margin:0 auto; padding:0 clamp(16px,4vw,40px) 100px; position:relative; z-index:1; }

/* Hero */
.cv-hero { padding:60px 0 40px; text-align:center; }
.cv-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(0,230,118,0.1); border:1px solid rgba(0,230,118,0.3); border-radius:999px; padding:6px 18px; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600; letter-spacing:.15em; color:var(--success); margin-bottom:20px; text-transform:uppercase; box-shadow: 0 0 15px rgba(0,230,118,0.1); }
.cv-hero-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:clamp(44px,8vw,82px); line-height:1; letter-spacing:.02em; margin-bottom:16px; text-transform: uppercase; }
.cv-hero-title em { color:var(--accent); font-style:normal; text-shadow: 0 0 20px rgba(0,212,255,0.4); }
.cv-hero-sub { font-size:17px; color:var(--muted); max-width:680px; margin:0 auto 32px; line-height:1.6; }

/* Section Headers */
.cv-sec { font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600; letter-spacing:.2em; color:var(--accent); text-transform:uppercase; margin-bottom:24px; display:flex; align-items:center; gap:16px; }
.cv-sec::after { content:''; flex:1; height:1px; background:var(--border); }

/* Dataset Grid */
.cv-cov-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px; margin-bottom:60px; }
.cv-cov-item { background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:20px; backdrop-filter:blur(12px); cursor:pointer; transition:all 200ms cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
.cv-cov-item:hover { border-color:var(--border-hover); transform:translateY(-2px); box-shadow: 0 8px 25px rgba(0,212,255,0.1); }
.cv-cov-item.selected { border-color:var(--accent); background:var(--accent-dim); box-shadow: 0 0 0 1px var(--accent), 0 8px 25px rgba(0,212,255,0.2); }
.cv-cov-label { font-size:15px; font-weight:600; color:var(--text); margin-bottom:6px; line-height: 1.3; }
.cv-cov-desc { font-size:12px; color:var(--muted); margin-bottom:12px; line-height:1.5; min-height: 36px; }
.cv-cov-bar { height:4px; background:rgba(255,255,255,0.05); border-radius:2px; overflow:hidden; margin-bottom:8px; }
.cv-cov-fill { height:100%; border-radius:2px; transition:width 500ms ease; }
.cv-cov-meta { display:flex; justify-content:space-between; align-items: center; }
.cv-priority { font-size:9px; font-family:'IBM Plex Mono',monospace; font-weight:700; letter-spacing:.1em; text-transform:uppercase; padding: 4px 8px; border-radius: 4px; }

/* Steps */
.cv-steps { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:16px; margin-bottom:60px; }
.cv-step { background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:24px; backdrop-filter:blur(12px); position:relative; overflow:hidden; }
.cv-step-num { position:absolute; top:-10px; right:10px; font-family:'Barlow Condensed',sans-serif; font-size:80px; font-weight:900; color:rgba(255,255,255,0.03); line-height:1; pointer-events: none; }
.cv-step-icon { font-size:28px; margin-bottom:12px; }
.cv-step-title { font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:700; color:var(--text); margin-bottom:8px; text-transform: uppercase; letter-spacing: .02em; }
.cv-step-desc { font-size:14px; color:var(--muted); line-height:1.6; }

/* Form Elements */
.cv-form-wrap { background:var(--panel); border:1px solid var(--border); border-radius:16px; padding:clamp(24px,5vw,48px); backdrop-filter:blur(20px); margin-bottom:60px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
.cv-form-intro { background:var(--accent-dim); border-left: 3px solid var(--accent); border-radius:0 8px 8px 0; padding:20px 24px; margin-bottom:32px; font-size:14px; color:var(--muted); line-height:1.7; }
.cv-form-intro strong { color:var(--text); font-weight: 600; }
.cv-form-intro em { color:var(--muted); font-style:italic; background: rgba(0,0,0,0.2); padding: 2px 6px; border-radius: 4px; }

.cv-section-divider { font-family:'Barlow Condensed',sans-serif; font-size:24px; font-weight: 700; color:var(--text); text-transform:uppercase; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.05); margin:40px 0 24px; display:flex; align-items:center; gap:12px; }
.cv-section-icon { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 16px; }
.cv-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.cv-field { display:flex; flex-direction:column; gap:8px; margin-bottom:8px; position: relative; }

.cv-label { font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600; letter-spacing:.1em; color:var(--muted); text-transform:uppercase; display:flex; align-items:center; flex-wrap:wrap; }
.cv-label.required { color: var(--accent); }
.cv-label-note { font-size:10px; color:var(--dim); font-weight:400; letter-spacing:.02em; text-transform:none; margin-left: 8px; }

.cv-input, .cv-select, .cv-textarea { background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:14px 16px; color:var(--text); font-family:'Barlow',sans-serif; font-size:15px; outline:none; transition:all 200ms ease; width:100%; box-sizing:border-box; }
.cv-input:hover, .cv-select:hover, .cv-textarea:hover { border-color: rgba(255,255,255,0.2); }
.cv-input:focus, .cv-select:focus, .cv-textarea:focus { border-color:var(--accent); background: rgba(0,0,0,0.5); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
.cv-input::placeholder, .cv-textarea::placeholder { color:var(--dim); }
.cv-select option { background:#0a0c14; color: var(--text); }
.cv-textarea { min-height:160px; resize:vertical; line-height:1.6; }

.cv-char-count { position: absolute; bottom: 12px; right: 12px; font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: var(--dim); background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px; pointer-events: none; }
.cv-hint { font-size:12px; color:var(--dim); line-height:1.5; padding-left:2px; }
.cv-hint a { color:var(--accent); text-decoration:none; }
.cv-hint a:hover { text-decoration:underline; }

/* Custom Dataset Selector Form */
.cv-dataset-select { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.cv-ds-opt { background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px; cursor:pointer; transition:all 150ms; text-align:left; width:100%; display: flex; align-items: center; justify-content: space-between; }
.cv-ds-opt:hover { border-color:var(--border-hover); background:var(--accent-dim); }
.cv-ds-opt.active { border-color:var(--accent); background:var(--accent-dim); box-shadow: 0 0 0 1px var(--accent); }
.cv-ds-opt-label { font-size:14px; font-weight:500; color:var(--text); }
.cv-ds-opt-pct { font-family:'IBM Plex Mono',monospace; font-size:11px; padding: 2px 6px; border-radius: 4px; background: rgba(255,255,255,0.05); }

/* Buttons & States */
.cv-submit-btn { width:100%; background:var(--accent); border:none; border-radius:10px; padding:18px; font-family:'Barlow Condensed',sans-serif; font-size:24px; font-weight:800; letter-spacing:.08em; color:#000; cursor:pointer; transition:all 200ms ease; text-transform:uppercase; margin-top:24px; box-shadow: 0 4px 15px rgba(0,212,255,0.2); }
.cv-submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 25px rgba(0,212,255,0.4); background: #33ddff; }
.cv-submit-btn:disabled { opacity:0.6; cursor:not-allowed; background: var(--dim); color: var(--muted); box-shadow: none; transform: none; }

.cv-error { background:rgba(255,59,59,0.1); border:1px solid rgba(255,59,59,0.3); border-radius:8px; padding:16px 20px; margin-top:20px; font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--error); letter-spacing:.05em; display: flex; align-items: center; gap: 12px; }
.cv-success { background:rgba(0,230,118,0.05); border:1px solid rgba(0,230,118,0.2); border-radius:16px; padding:60px 40px; text-align:center; }
.cv-success-icon { font-size:64px; margin-bottom:20px; filter: drop-shadow(0 0 20px rgba(0,230,118,0.2)); }
.cv-success-title { font-family:'Barlow Condensed',sans-serif; font-size:48px; font-weight:900; color:var(--success); margin-bottom:12px; text-transform: uppercase; }
.cv-success-text { font-size:16px; color:var(--muted); line-height:1.6; max-width: 500px; margin: 0 auto; }

.cv-sending-bar { height:4px; background:rgba(0,0,0,0.5); border-radius:2px; overflow:hidden; margin-top:16px; }
.cv-sending-fill { height:100%; background:var(--accent); animation:cv-slide 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; box-shadow: 0 0 10px var(--accent); }
@keyframes cv-slide { 0%{width:0; margin-left:0} 50%{width:50%; margin-left:25%} 100%{width:0; margin-left:100%} }

/* Sources Grid */
.cv-sources-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:16px; margin-bottom:60px; }
.cv-source-card { background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:20px; transition: background 200ms; }
.cv-source-card:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.1); }
.cv-source-name { font-weight:600; font-size:16px; color:var(--text); margin-bottom:6px; display:flex; align-items:center; gap:8px; }
.cv-source-free { font-family:'IBM Plex Mono',monospace; font-size:9px; font-weight:700; letter-spacing:.1em; padding:3px 8px; border-radius:4px; background:rgba(0,230,118,0.1); border:1px solid rgba(0,230,118,0.3); color:var(--success); text-transform:uppercase; }
.cv-source-desc { font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:12px; }
.cv-source-url { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--accent); text-decoration:none; display: inline-flex; align-items: center; gap: 4px; }
.cv-source-url:hover { text-decoration:underline; }

/* Rules */
.cv-rules { background:var(--panel); border:1px solid var(--border); border-radius:16px; padding:32px; margin-bottom:60px; backdrop-filter:blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
.cv-rules-grid { display:grid; grid-template-columns:1fr 1fr; gap:40px; }
.cv-rules-col-title { font-family:'IBM Plex Mono',monospace; font-size:12px; letter-spacing:.15em; text-transform:uppercase; margin-bottom:20px; font-weight:600; padding-bottom:12px; border-bottom:1px solid rgba(255,255,255,0.05); }
.cv-rule { display:flex; align-items:flex-start; gap:12px; margin-bottom:12px; font-size:14px; color:var(--text); line-height:1.5; }
.cv-rule span:first-child { font-size: 16px; margin-top: 1px; }

/* Developer CTA */
.cv-github-box { background:rgba(99,102,241,0.05); border:1px solid rgba(99,102,241,0.25); border-radius:16px; padding:36px; margin-bottom:60px; display:flex; align-items:center; gap:32px; flex-wrap:wrap; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
.cv-github-text { flex:1; min-width:260px; }
.cv-github-title { font-family:'Barlow Condensed',sans-serif; font-size:32px; font-weight:800; color:var(--text); margin-bottom:8px; text-transform: uppercase; }
.cv-github-desc { font-size:15px; color:var(--muted); line-height:1.6; }
.cv-github-btn { display:inline-flex; align-items:center; gap:10px; background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.4); border-radius:8px; padding:16px 28px; font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600; letter-spacing:.1em; color:#e0e7ff; text-decoration:none; transition:all 200ms ease; text-transform:uppercase; white-space:nowrap; }
.cv-github-btn:hover { background:rgba(99,102,241,0.3); border-color: #818cf8; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(99,102,241,0.2); }

@media(max-width:768px) {
  .cv-grid-2 { grid-template-columns:1fr; gap: 16px; }
  .cv-dataset-select { grid-template-columns:1fr; }
  .cv-rules-grid { grid-template-columns:1fr; gap: 32px; }
  .cv-github-box { flex-direction:column; text-align: center; padding: 24px; }
  .cv-form-wrap { padding: 24px 20px; }
}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

function CovBar({ covered, total }) {
  if (!total) return null;
  const pct   = Math.round((covered / total) * 100);
  const color = pct === 100 ? 'var(--success)' : pct >= 50 ? '#f0b429' : 'var(--error)';
  return (
    <>
      <div className="cv-cov-bar">
        <div className="cv-cov-fill" style={{ width:`${pct}%`, background:color, boxShadow: `0 0 8px ${color}` }}/>
      </div>
      <div className="cv-cov-meta">
        <span style={{ color: 'var(--muted)', fontFamily:'IBM Plex Mono,monospace', fontSize:10 }}>{covered}/{total} NATIONS</span>
        <span style={{ color, fontFamily:'IBM Plex Mono,monospace', fontSize:11, fontWeight:700 }}>{pct}%</span>
      </div>
    </>
  );
}

const GITHUB_REPO = 'https://github.com/warscopeglobal/WarScope-Data';

export default function Contribute() {
  injectCSS('cv-css', CSS);

  const [selectedDataset, setSelectedDataset] = useState('');
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');
  const [form, setForm] = useState({
    name:'', email:'', country:'', dataset:'',
    expertise:'', language:'', source:'', sourceUrl:'',
    data:'', personnel:'', equipment:'', conflicts:'',
    notes:'', canFollowUp:'yes',
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  const selectDataset = (id) => {
    setSelectedDataset(id);
    update('dataset', DATASETS.find(d => d.id === id)?.label ?? id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    
    // 1. Validate Inputs
    const cleanCountry = sanitizeInput(form.country);
    const cleanSource = sanitizeInput(form.source);
    const cleanSourceUrl = sanitizeInput(form.sourceUrl);
    
    if (!cleanCountry) return setErrMsg('Please enter a target country name.');
    if (!selectedDataset) return setErrMsg('Please select an intelligence dataset category.');
    if (!cleanSource) return setErrMsg('A verified source is required. We cannot accept unsourced data.');
    if (!validateEmail(form.email)) return setErrMsg('Please provide a valid email format.');
    if (!form.data.trim() && !form.personnel.trim() && !form.equipment.trim() && !form.conflicts.trim()) {
      return setErrMsg('Please fill in at least one data field (Personnel, Equipment, Conflicts, or Other).');
    }

    // 2. Compile & Sanitize Payload
    const combinedData = [
      form.personnel  ? 'MILITARY PERSONNEL:\n' + sanitizeInput(form.personnel)  : '',
      form.equipment  ? 'EQUIPMENT / VEHICLES:\n' + sanitizeInput(form.equipment) : '',
      form.conflicts  ? 'CONFLICTS / HISTORY:\n'  + sanitizeInput(form.conflicts)  : '',
      form.data       ? 'OTHER DATA:\n'           + sanitizeInput(form.data)       : '',
    ].filter(Boolean).join('\n\n──────\n\n');

    setStatus('sending');
    
    // 3. Transmit securely
    try {
      const res = await fetch(`${API}/api/mail/contribute`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name:       sanitizeInput(form.name) || 'Anonymous Analyst',
          email:      sanitizeInput(form.email),
          country:    cleanCountry,
          dataset:    sanitizeInput(form.dataset || selectedDataset),
          expertise:  sanitizeInput(form.expertise),
          language:   sanitizeInput(form.language),
          source:     `${cleanSource}${cleanSourceUrl ? ' — ' + cleanSourceUrl : ''}`,
          data:       combinedData,
          notes:      `Can follow up: ${sanitizeInput(form.canFollowUp)}\n\n${sanitizeInput(form.notes)}`,
        }),
      });
      
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error ?? 'Transmission Failed. Server rejected payload.');
      setStatus('success');
      
    } catch (err) {
      setStatus('error');
      setErrMsg(err.message || 'Secure transmission failed. Please email contact@warscopeglobal.com directly.');
    }
  };

  const ds = DATASETS.find(d => d.id === selectedDataset);

  return (
    <div className="cv">
      <SEO
        title="Contribute Military Data | WarScope"
        description="Help build the world's most accurate open military intelligence database. Submit secured military data for your country."
        canonical="/contribute"
      />
      <Navbar />
      <div className="cv-wrap">

        {/* Hero */}
        <div className="cv-hero">
          <div className="cv-badge">📡 Open Source Intelligence (OSINT) Initiative</div>
          <h1 className="cv-hero-title">EXPAND THE<br/><em>GLOBAL DATABASE</em></h1>
          <p className="cv-hero-sub">
            WarScope lacks verified military data for over <strong style={{color:'var(--text)'}}>140 nations</strong>. 
            Help us map the global tactical landscape. Submit public, verified data about your country's armed forces. 
            <strong style={{color:'var(--text)'}}> No coding required.</strong>
          </p>
        </div>

        {/* Dataset Selection */}
        <div className="cv-sec">01 // TARGET DOMAINS</div>
        <div className="cv-cov-grid">
          {DATASETS.filter(d => d.total > 0).map(d => {
            const pr = PRIORITY_COLORS[d.priority];
            return (
              <div key={d.id} className={`cv-cov-item ${selectedDataset===d.id?'selected':''}`}
                onClick={() => selectDataset(d.id)}>
                <div className="cv-cov-label">{d.label}</div>
                <div className="cv-cov-desc">{d.desc}</div>
                <CovBar covered={d.covered} total={d.total}/>
                <div className="cv-priority" style={{color:pr.text, background: pr.bg, border: `1px solid ${pr.border}`, width: 'fit-content', marginTop: 12}}>{pr.label}</div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="cv-sec">02 // SUBMISSION PROTOCOL</div>
        <div className="cv-steps">
          {[
            { num:'1', icon:'📝', title:'Input Intel', desc:'Describe troop numbers, equipment, or history in plain language. Exact formatting is not required.' },
            { num:'2', icon:'🔍', title:'Cite Origin', desc:'Provide a public source (Government site, News, SIPRI). Unverified data is automatically rejected.' },
            { num:'3', icon:'🛡️', title:'Verification', desc:'Our analysts review submissions within 7 days. Verified data is deployed to the live global map.' },
          ].map(s => (
            <div key={s.num} className="cv-step">
              <div className="cv-step-num">{s.num}</div>
              <div className="cv-step-icon">{s.icon}</div>
              <div className="cv-step-title">{s.title}</div>
              <div className="cv-step-desc">{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Form Main Area */}
        <div className="cv-sec">03 // INTEL SECURE UPLOAD</div>
        <div className="cv-form-wrap">
          
          <div className="cv-form-intro">
            <strong>Clearance Not Required.</strong> You do not need to be a military expert. Submit what you know about your country's forces in simple terms. We will parse and format the data.<br/><br/>
            The critical component is your <strong>Source Link</strong>. Data without a public origin cannot be added.<br/>
            <em>Example: "Nigeria has about 100,000 active soldiers. The main tank is the T-72, about 200 units. Source: Nigerian Army Official Website (army.mil.ng)"</em>
          </div>

          {status === 'success' ? (
            <div className="cv-success">
              <div className="cv-success-icon">✓</div>
              <div className="cv-success-title">INTEL SECURELY RECEIVED</div>
              <div className="cv-success-text">
                Your data has been securely transmitted to the WarScope Analyst Team.<br/>
                Verification takes up to <strong style={{color:'var(--text)'}}>7 days</strong> before deployment to the live grid. 
                If you provided an email, you will be notified upon publication.<br/><br/>
                Support: <a href="mailto:contact@warscopeglobal.com" style={{color:'var(--accent)'}}>contact@warscopeglobal.com</a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              {/* Identity block */}
              <div className="cv-section-divider">
                <div className="cv-section-icon">👤</div> OPERATIVE PROFILE <span style={{color:'var(--dim)',fontWeight:500,fontSize:14,textTransform:'none',marginLeft:'auto'}}>(Optional)</span>
              </div>
              
              <div className="cv-grid-2">
                <div className="cv-field">
                  <label className="cv-label">Alias / Name <span className="cv-label-note">For database credits</span></label>
                  <input className="cv-input" placeholder="Leave blank for anonymity" value={form.name} onChange={e => update('name', e.target.value)} maxLength={80}/>
                </div>
                <div className="cv-field">
                  <label className="cv-label">Secure Comm (Email) <span className="cv-label-note">For deployment confirmation</span></label>
                  <input className="cv-input" type="email" placeholder="agent@domain.com" value={form.email} onChange={e => update('email', e.target.value)} maxLength={120}/>
                </div>
                <div className="cv-field">
                  <label className="cv-label">Clearance Background <span className="cv-label-note">Helps verify reliability</span></label>
                  <select className="cv-select" value={form.expertise} onChange={e => update('expertise', e.target.value)}>
                    <option value="">Select background...</option>
                    {EXPERTISE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cv-field">
                  <label className="cv-label">Native Language <span className="cv-label-note">Submit in any language</span></label>
                  <input className="cv-input" placeholder="e.g. Arabic, French, Russian..." value={form.language} onChange={e => update('language', e.target.value)} maxLength={60}/>
                </div>
              </div>

              {/* Target Data Block */}
              <div className="cv-section-divider">
                <div className="cv-section-icon">🌍</div> TARGET ACQUISITION <span style={{color:'var(--accent)',fontWeight:700,fontSize:20,marginLeft:'auto'}}>*</span>
              </div>

              <div className="cv-field" style={{marginBottom:24}}>
                <label className="cv-label required">Target Nation <span className="cv-label-note">Which country's forces are you reporting on?</span></label>
                <input className="cv-input" placeholder="e.g. Brazil, Japan, South Africa..." value={form.country} onChange={e => update('country', e.target.value)} maxLength={80}/>
              </div>

              <div className="cv-field" style={{marginBottom:24}}>
                <label className="cv-label required">Intelligence Category <span className="cv-label-note">Select from the grid above or list here</span></label>
                <div className="cv-dataset-select">
                  {DATASETS.map(d => {
                    const pct = d.total ? Math.round((d.covered/d.total)*100) : 100;
                    const col = pct===100?'var(--success)':pct>=50?'#f0b429':'var(--error)';
                    return (
                      <button key={d.id} type="button" className={`cv-ds-opt ${selectedDataset===d.id?'active':''}`} onClick={() => selectDataset(d.id)}>
                        <div className="cv-ds-opt-label">{d.label.replace(/[^a-zA-Z &]/g, '').trim()}</div>
                        {d.total > 0 && <div className="cv-ds-opt-pct" style={{color:col, border: `1px solid ${col}40`}}>{pct}% mapped</div>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Source Block */}
              <div className="cv-section-divider">
                <div className="cv-section-icon">📚</div> ORIGIN SOURCE <span style={{color:'var(--accent)',fontWeight:700,fontSize:20,marginLeft:'auto'}}>*</span>
              </div>

              <div className="cv-grid-2">
                <div className="cv-field">
                  <label className="cv-label required">Source Origin</label>
                  <select className="cv-select" value={form.source} onChange={e => update('source', e.target.value)}>
                    <option value="">Select source type...</option>
                    {SOURCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="cv-field">
                  <label className="cv-label">Reference Link <span className="cv-label-note">URL or Book/Page Ref</span></label>
                  <input className="cv-input" placeholder="https://..." value={form.sourceUrl} onChange={e => update('sourceUrl', e.target.value)} maxLength={400}/>
                </div>
              </div>

              {/* Data Input Block */}
              <div className="cv-section-divider" style={{marginTop: 40}}>
                <div className="cv-section-icon">⚔️</div> INTELLIGENCE PAYLOAD <span style={{color:'var(--accent)',fontWeight:700,fontSize:20,marginLeft:'auto'}}>*</span>
              </div>
              <div className="cv-hint" style={{marginBottom: 20}}>Please complete at least one of the following payload fields.</div>

              <div className="cv-field" style={{marginBottom:24}}>
                <label className="cv-label">Personnel & Structure <span className="cv-label-note">Troop counts, branches, HQ</span></label>
                <textarea className="cv-textarea" placeholder="e.g. Total active: ~150,000. Army: 100k, Navy: 20k, Air Force: 30k..." value={form.personnel} onChange={e => update('personnel', e.target.value)} maxLength={3000}/>
                <span className="cv-char-count">{form.personnel.length}/3000</span>
              </div>

              <div className="cv-field" style={{marginBottom:24}}>
                <label className="cv-label">Hardware & Vehicles <span className="cv-label-note">Tanks, Jets, Naval Assets</span></label>
                <textarea className="cv-textarea" placeholder="e.g. MBT: T-72 (150 units). Jets: F-16 (20 active). Submarines: 2 Diesel..." value={form.equipment} onChange={e => update('equipment', e.target.value)} maxLength={3000}/>
                <span className="cv-char-count">{form.equipment.length}/3000</span>
              </div>

              <div className="cv-field" style={{marginBottom:24}}>
                <label className="cv-label">Conflicts & Operations <span className="cv-label-note">Wars, border disputes, deployments</span></label>
                <textarea className="cv-textarea" placeholder="e.g. Ongoing border skirmish in northern sector since 2018..." value={form.conflicts} onChange={e => update('conflicts', e.target.value)} maxLength={3000}/>
                <span className="cv-char-count">{form.conflicts.length}/3000</span>
              </div>

              <div className="cv-field" style={{marginBottom:24}}>
                <label className="cv-label">Corrections / Anomalies <span className="cv-label-note">Fix existing database errors</span></label>
                <textarea className="cv-textarea" placeholder="e.g. WarScope lists 50k troops, but the 2024 Ministry White Paper states 75k..." value={form.data} onChange={e => update('data', e.target.value)} maxLength={3000}/>
                <span className="cv-char-count">{form.data.length}/3000</span>
              </div>

              {/* Submission Box */}
              {errMsg && <div className="cv-error">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {errMsg}
              </div>}

              <button type="submit" className="cv-submit-btn" disabled={status==='sending'}>
                {status==='sending' ? 'ENCRYPTING & TRANSMITTING...' : 'INITIATE SECURE UPLOAD'}
              </button>
              {status==='sending' && <div className="cv-sending-bar"><div className="cv-sending-fill"/></div>}
              
              <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:10,color:'var(--dim)',marginTop:16,letterSpacing:'.05em',textAlign:'center'}}>
                SECURE POST TO DB · REVIEWED & SANITIZED IN 7 DAYS · PII REDACTED
              </div>
            </form>
          )}
        </div>

        {/* Sources Info */}
        <div className="cv-sec">APPROVED OPEN SOURCES</div>
        <div className="cv-sources-grid">
          {[
            { name:'SIPRI', free:true, desc:'Arms transfers and military spending. Best free source for defence data.', url:'https://sipri.org' },
            { name:'UCDP', free:true, desc:'Academic conflict data. Gold standard for wars and conflict history.', url:'https://ucdp.uu.se' },
            { name:'CIA World Factbook', free:true, desc:'Personnel, branches, equipment overview for every country.', url:'https://cia.gov/the-world-factbook/' },
            { name:'FAS Nuclear Notebook', free:true, desc:'Most accurate independent nuclear warhead estimates.', url:'https://fas.org/issues/nuclear-weapons/nuclear-notebook/' },
            { name:'ACLED', free:true, desc:'Conflict events updated daily. Good for recent clashes.', url:'https://acleddata.com' },
            { name:'OFAC / EU Sanctions', free:true, desc:'Official US and EU sanctions lists — definitive source.', url:'https://ofac.treasury.gov' },
            { name:'GlobalFirepower', free:true, desc:'Useful starting point — always verify figures independently.', url:'https://globalfirepower.com' },
            { name:'IISS Military Balance', free:false, desc:'Most detailed but paywalled. Cite page numbers, never copy text.', url:'https://iiss.org' },
          ].map((s,i) => (
            <div key={i} className="cv-source-card">
              <div className="cv-source-name">{s.name} {s.free && <span className="cv-source-free">FREE</span>}</div>
              <div className="cv-source-desc">{s.desc}</div>
              <a href={s.url} target="_blank" rel="noopener" className="cv-source-url">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                {s.url.replace('https://','')}
              </a>
            </div>
          ))}
        </div>

        {/* Rules */}
        <div className="cv-sec">DATA INTEGRITY MANDATES</div>
        <div className="cv-rules" style={{marginBottom:48}}>
          <div className="cv-rules-grid">
            <div>
              <div className="cv-rules-col-title" style={{color:'var(--success)', borderBottomColor: 'var(--success)'}}>✅ APPROVED INTEL</div>
              {['Government defence ministry websites','SIPRI, IISS, UCDP, FAS Nuclear Notebook','Wikipedia with cited primary sources','News articles from major outlets','Personal knowledge of your own country\'s public military data','Official manufacturer specifications'].map((t,i) => <div key={i} className="cv-rule"><span style={{color:'var(--success)'}}>✓</span><span>{t}</span></div>)}
            </div>
            <div>
              <div className="cv-rules-col-title" style={{color:'var(--error)', borderBottomColor: 'var(--error)'}}>❌ REJECTED INTEL</div>
              {['Classified or leaked documents','Unverified social media posts or forum claims','Any data with no source at all','Information that could endanger military personnel','Estimates presented as confirmed facts without saying they are estimates'].map((t,i) => <div key={i} className="cv-rule"><span style={{color:'var(--error)'}}>✕</span><span>{t}</span></div>)}
            </div>
          </div>
        </div>

        {/* GitHub for devs */}
        <div className="cv-sec">ENGINEERING DIVISION</div>
        <div className="cv-github-box">
          <div className="cv-github-text">
            <div className="cv-github-title">Access the GitHub Repository</div>
            <div className="cv-github-desc">Fork the open-source warscope-data repository and submit a Pull Request directly via JSON. See CONTRIBUTING.md for schema validation guides.</div>
          </div>
          <a href={GITHUB_REPO} target="_blank" rel="noopener" className="cv-github-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
            FORK ON GITHUB
          </a>
        </div>

      </div>
      <Footer />
    </div>
  );
}