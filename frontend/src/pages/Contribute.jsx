// src/pages/Contribute.jsx

import { useState, useRef } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SEO    from '../seo/SEO.jsx';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';
const GITHUB_REPO = 'https://github.com/warscopeglobal/WarScope-Data';

const DATASETS = [
  { id:'army-units',  label:'⚔️ Army Units & Personnel',  covered:54,  total:195, priority:'high',   desc:'Troop numbers, branches, headquarters' },
  { id:'vehicles',    label:'🛡️ Vehicles & Equipment',    covered:25,  total:195, priority:'high',   desc:'Tanks, aircraft, warships, missiles' },
  { id:'sanctions',   label:'🚫 Sanctions & Embargoes',      covered:19,  total:195, priority:'medium', desc:'Active sanctions, financial, trade' },
  { id:'arms-trade',  label:'🚀 Arms Transfers & Deals',     covered:40,  total:195, priority:'medium', desc:'Weapons purchased/sold — supplier, type' },
  { id:'timeline',    label:'📜 Conflict History',      covered:120, total:195, priority:'medium', desc:'Wars and conflicts involving the country' },
  { id:'other',       label:'📋 Corrections / Other', covered:0,  total:0,   priority:'low',    desc:'Fixing existing data or missing info' },
];

const EXPERTISE_OPTIONS = [
  'Military historian / researcher',
  'Active or former military personnel',
  'Defence journalist / analyst',
  'Academic / student',
  'Government / policy worker',
  'Interested civilian with knowledge',
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

// ── SECURITY ─────────────────────────────────────────────────────────────────
const sanitizeInput = (str) => {
  if (!str) return '';
  return str.replace(/<script[^>]*?>.*?<\/script>/gi, '').replace(/<[\/\!]*?[^<>]*?>/gi, '').trim();
};

const validateEmail = (email) => {
  if (!email) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  --bg: #03050a;
  --panel: rgba(15, 23, 42, 0.6);
  --panel-solid: #0f172a;
  --border: rgba(0, 212, 255, 0.15);
  --border-hover: rgba(0, 212, 255, 0.4);
  --accent: #00d4ff;
  --accent-hover: #33ddff;
  --accent-dim: rgba(0, 212, 255, 0.08);
  --text: #f8fafc;
  --muted: #cbd5e1;
  --dim: #64748b;
  --error: #ef4444;
  --success: #10b981;
}

html { scroll-behavior: smooth; }

.cv { min-height:100dvh; background:var(--bg); color:var(--text); font-family:'Barlow',sans-serif; overflow-x:hidden; position:relative; }
.cv::before { content:''; position:fixed; inset:0; background-image:radial-gradient(circle at 50% 0%, rgba(0,212,255,0.05) 0%, transparent 70%), linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px); background-size:100% 100%, 40px 40px, 40px 40px; pointer-events:none; z-index:0; }

.cv-wrap { max-width:1600px; width: 100%; margin:0 auto; padding:0 clamp(20px, 4vw, 60px) 100px; position:relative; z-index:1; }

/* Hero */
.cv-hero { padding: 60px 0 50px; text-align:center; max-width: 900px; margin: 0 auto; }
.cv-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:999px; padding:6px 16px; font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; letter-spacing:.1em; color:var(--success); margin-bottom:24px; text-transform:uppercase; box-shadow: 0 0 15px rgba(16,185,129,0.1); }
.cv-hero-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:clamp(40px, 6vw, 72px); line-height:1.05; letter-spacing:.02em; margin-bottom:20px; text-transform: uppercase; }
.cv-hero-title em { color:var(--accent); font-style:normal; text-shadow: 0 0 20px rgba(0,212,255,0.4); }
.cv-hero-sub { font-size:18px; color:var(--muted); line-height:1.6; }

/* Layout Grid */
.cv-layout { display: grid; grid-template-columns: 1fr 1.4fr; gap: clamp(30px, 5vw, 60px); align-items: start; }

/* Sidebar Components */
.cv-sidebar { display: flex; flex-direction: column; gap: 40px; }
.cv-sec-title { font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:700; letter-spacing:.15em; color:var(--text); text-transform:uppercase; margin-bottom:20px; display:flex; align-items:center; gap:16px; }
.cv-sec-title::after { content:''; flex:1; height:1px; background:var(--border); }

/* Compact Dataset Grid */
.cv-cov-grid { display:grid; grid-template-columns: 1fr 1fr; gap:12px; }
.cv-cov-item { background:var(--panel); border:1px solid var(--border); border-radius:10px; padding:16px; backdrop-filter:blur(12px); cursor:pointer; transition:all 200ms ease; }
.cv-cov-item:hover { border-color:var(--border-hover); transform:translateY(-2px); background:var(--accent-dim); }
.cv-cov-item.selected { border-color:var(--accent); background:var(--accent-dim); box-shadow: 0 0 0 1px var(--accent), 0 4px 15px rgba(0,212,255,0.15); }
.cv-cov-label { font-size:14px; font-weight:600; margin-bottom:4px; line-height: 1.3; }
.cv-cov-desc { font-size:12px; color:var(--dim); margin-bottom:12px; line-height:1.4; }
.cv-cov-bar { height:4px; background:rgba(255,255,255,0.05); border-radius:2px; overflow:hidden; margin-bottom:8px; }
.cv-cov-fill { height:100%; border-radius:2px; transition:width 500ms ease; }
.cv-cov-meta { display:flex; justify-content:space-between; align-items: center; }

/* Main Form Area */
.cv-form-container { background:var(--panel); border:1px solid var(--border); border-radius:20px; padding: clamp(24px, 4vw, 48px); backdrop-filter:blur(20px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); position: sticky; top: 40px; }
.cv-form-intro { background:var(--accent-dim); border-left: 3px solid var(--accent); border-radius:0 8px 8px 0; padding:16px 20px; margin-bottom:32px; font-size:15px; color:var(--muted); line-height:1.6; }
.cv-form-intro strong { color:var(--text); }

.cv-card { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; margin-bottom: 24px; }
.cv-card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:700; text-transform:uppercase; letter-spacing:0.02em; }
.cv-card-icon { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 18px; }

.cv-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.cv-field { display:flex; flex-direction:column; gap:8px; margin-bottom:20px; position: relative; }
.cv-field:last-child { margin-bottom: 0; }

.cv-label { font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; letter-spacing:.05em; color:var(--muted); text-transform:uppercase; display:flex; align-items:center; flex-wrap:wrap; }
.cv-label.required::after { content: '*'; color: var(--accent); margin-left: 4px; font-size: 16px; }
.cv-label-note { font-size:11px; color:var(--dim); font-weight:500; letter-spacing:0; text-transform:none; margin-left: auto; }

.cv-input, .cv-select, .cv-textarea { background:rgba(0,0,0,0.4); border:1px solid rgba(255,255,255,0.1); border-radius:8px; padding:14px 16px; color:var(--text); font-family:'Barlow',sans-serif; font-size:16px; outline:none; transition:all 200ms ease; width:100%; box-sizing:border-box; }
.cv-input:hover, .cv-select:hover, .cv-textarea:hover { border-color: rgba(255,255,255,0.2); }
.cv-input:focus, .cv-select:focus, .cv-textarea:focus { border-color:var(--accent); background: rgba(0,0,0,0.6); box-shadow: 0 0 0 3px rgba(0,212,255,0.1); }
.cv-input::placeholder, .cv-textarea::placeholder { color:var(--dim); }
.cv-select option { background: var(--panel-solid); color: var(--text); }
.cv-textarea { min-height:120px; resize:vertical; line-height:1.6; }

.cv-hint { font-size:13px; color:var(--dim); line-height:1.5; margin-bottom: 16px; }

/* Buttons & States */
.cv-submit-btn { width:100%; background:var(--accent); border:none; border-radius:12px; padding:20px; font-family:'Barlow Condensed',sans-serif; font-size:24px; font-weight:800; letter-spacing:.05em; color:#000; cursor:pointer; transition:all 200ms ease; text-transform:uppercase; margin-top:12px; box-shadow: 0 4px 15px rgba(0,212,255,0.2); }
.cv-submit-btn:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 25px rgba(0,212,255,0.4); background: var(--accent-hover); }
.cv-submit-btn:disabled { opacity:0.6; cursor:not-allowed; background: var(--dim); color: var(--muted); box-shadow: none; transform: none; }

.cv-error { background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); border-radius:8px; padding:16px; margin-bottom:20px; font-family:'IBM Plex Mono',monospace; font-size:13px; color:var(--error); display: flex; align-items: center; gap: 12px; }
.cv-success { background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.2); border-radius:16px; padding:60px 40px; text-align:center; }
.cv-success-icon { font-size:64px; margin-bottom:20px; filter: drop-shadow(0 0 20px rgba(16,185,129,0.3)); }
.cv-success-title { font-family:'Barlow Condensed',sans-serif; font-size:42px; font-weight:900; color:var(--success); margin-bottom:16px; text-transform: uppercase; }

/* Simple list & Rules */
.cv-list { list-style: none; padding: 0; margin: 0; }
.cv-list li { font-size: 14px; color: var(--muted); margin-bottom: 12px; padding-left: 24px; position: relative; line-height: 1.5; }
.cv-list li::before { content: '✓'; position: absolute; left: 0; color: var(--success); font-weight: bold; }
.cv-list.reject li::before { content: '✕'; color: var(--error); }

.cv-sources { display: flex; flex-direction: column; gap: 12px; }
.cv-source-card { background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px; }
.cv-source-name { font-weight:600; font-size:15px; margin-bottom:4px; display:flex; justify-content: space-between; align-items: center; }
.cv-source-free { font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; background:rgba(16,185,129,0.1); color:var(--success); }
.cv-source-url { font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--accent); text-decoration:none; margin-top: 8px; display: inline-block;}
.cv-source-url:hover { text-decoration:underline; }

/* Developer CTA */
.cv-github-box { background:rgba(99,102,241,0.05); border:1px solid rgba(99,102,241,0.25); border-radius:16px; padding:36px; margin-top:60px; display:flex; align-items:center; gap:32px; flex-wrap:wrap; box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
.cv-github-text { flex:1; min-width:260px; }
.cv-github-title { font-family:'Barlow Condensed',sans-serif; font-size:32px; font-weight:800; color:var(--text); margin-bottom:8px; text-transform: uppercase; }
.cv-github-desc { font-size:15px; color:var(--muted); line-height:1.6; }
.cv-github-btn { display:inline-flex; align-items:center; gap:10px; background:rgba(99,102,241,0.15); border:1px solid rgba(99,102,241,0.4); border-radius:8px; padding:16px 28px; font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600; letter-spacing:.1em; color:#e0e7ff; text-decoration:none; transition:all 200ms ease; text-transform:uppercase; white-space:nowrap; }
.cv-github-btn:hover { background:rgba(99,102,241,0.3); border-color: #818cf8; transform: translateY(-2px); box-shadow: 0 4px 15px rgba(99,102,241,0.2); }

@media(max-width: 1024px) {
  .cv-layout { grid-template-columns: 1fr; }
  .cv-form-container { position: static; }
  .cv-cov-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
}

@media(max-width: 768px) {
  .cv-grid-2 { grid-template-columns: 1fr; gap: 0; }
  .cv-card { padding: 16px; }
  .cv-form-container { padding: 20px 16px; }
  .cv-github-box { flex-direction:column; text-align: center; padding: 24px; }
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
  const color = pct === 100 ? 'var(--success)' : pct >= 50 ? '#fbbf24' : 'var(--error)';
  return (
    <>
      <div className="cv-cov-bar">
        <div className="cv-cov-fill" style={{ width:`${pct}%`, background:color, boxShadow: `0 0 8px ${color}` }}/>
      </div>
      <div className="cv-cov-meta">
        <span style={{ color: 'var(--dim)', fontFamily:'IBM Plex Mono,monospace', fontSize:10 }}>{covered}/{total} MAPPED</span>
        <span style={{ color, fontFamily:'IBM Plex Mono,monospace', fontSize:12, fontWeight:700 }}>{pct}%</span>
      </div>
    </>
  );
}

export default function Contribute() {
  injectCSS('cv-css', CSS);
  
  const formRef = useRef(null);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');
  
  const [form, setForm] = useState({
    name:'', email:'', country:'', expertise:'', language:'', 
    source:'', sourceUrl:'', data:'', personnel:'', equipment:'', 
    conflicts:'', notes:''
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  
  const selectDataset = (id) => {
    setSelectedDataset(id);
    if (window.innerWidth <= 1024 && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    
    const cleanCountry = sanitizeInput(form.country);
    const cleanSource = sanitizeInput(form.source);
    const cleanSourceUrl = sanitizeInput(form.sourceUrl);
    
    if (!cleanCountry) return setErrMsg('Please enter a target country name.');
    if (!selectedDataset) return setErrMsg('Please select an intelligence category.');
    if (!cleanSource) return setErrMsg('A verified source is required. We cannot accept unsourced data.');
    if (!validateEmail(form.email)) return setErrMsg('Please provide a valid email format.');
    if (!form.data.trim() && !form.personnel.trim() && !form.equipment.trim() && !form.conflicts.trim()) {
      return setErrMsg('Please fill in at least one data payload field (Personnel, Equipment, Conflicts, or Other).');
    }

    const combinedData = [
      form.personnel  ? 'MILITARY PERSONNEL:\n' + sanitizeInput(form.personnel)  : '',
      form.equipment  ? 'EQUIPMENT / VEHICLES:\n' + sanitizeInput(form.equipment) : '',
      form.conflicts  ? 'CONFLICTS / HISTORY:\n'  + sanitizeInput(form.conflicts)  : '',
      form.data       ? 'OTHER DATA:\n'           + sanitizeInput(form.data)       : '',
    ].filter(Boolean).join('\n\n──────\n\n');

    setStatus('sending');
    
    try {
      const res = await fetch(`${API}/api/mail/contribute`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name:       sanitizeInput(form.name) || 'Anonymous Analyst',
          email:      sanitizeInput(form.email),
          country:    cleanCountry,
          dataset:    DATASETS.find(d => d.id === selectedDataset)?.label || selectedDataset,
          expertise:  sanitizeInput(form.expertise),
          language:   sanitizeInput(form.language),
          source:     `${cleanSource}${cleanSourceUrl ? ' — ' + cleanSourceUrl : ''}`,
          data:       combinedData,
          notes:      sanitizeInput(form.notes),
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

  return (
    <div className="cv">
      <SEO
        title="Contribute Military Data | WarScope"
        description="Help build the world's most accurate open military intelligence database. Submit secured military data for your country."
        canonical="/contribute"
      />
      <Navbar />
      
      <div className="cv-wrap">
        {/* Hero Area */}
        <div className="cv-hero">
          <div className="cv-badge">📡 OSINT Crowdsourcing Initiative</div>
          <h1 className="cv-hero-title">MAP THE<br/><em>GLOBAL TACTICAL GRID</em></h1>
          <p className="cv-hero-sub">
            WarScope lacks verified military data for over <strong>140 nations</strong>. 
            Help us build an open, accessible intelligence database. Submit public, verified data about your country's forces. No coding required.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="cv-layout">
          
          {/* Left Sidebar: Context & Guidelines */}
          <div className="cv-sidebar">
            
            <div>
              <div className="cv-sec-title">01 // Target Domains</div>
              <div className="cv-cov-grid">
                {DATASETS.filter(d => d.total > 0).map(d => (
                  <div key={d.id} className={`cv-cov-item ${selectedDataset===d.id?'selected':''}`} onClick={() => selectDataset(d.id)}>
                    <div className="cv-cov-label">{d.label.replace(/[^a-zA-Z &]/g, '').trim()}</div>
                    <div className="cv-cov-desc">{d.desc}</div>
                    <CovBar covered={d.covered} total={d.total}/>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="cv-sec-title">02 // Data Integrity Mandates</div>
              <div className="cv-grid-2">
                <div>
                  <h4 style={{color:'var(--success)', fontSize: 13, letterSpacing:'0.1em', marginBottom:12}}>✅ APPROVED INTEL</h4>
                  <ul className="cv-list">
                    <li>Govt. defence ministry sites</li>
                    <li>SIPRI, IISS, UCDP, FAS</li>
                    <li>Cited Wikipedia articles</li>
                    <li>Major news outlets</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{color:'var(--error)', fontSize: 13, letterSpacing:'0.1em', marginBottom:12}}>❌ REJECTED INTEL</h4>
                  <ul className="cv-list reject">
                    <li>Classified/leaked documents</li>
                    <li>Unverified social media claims</li>
                    <li>Data lacking a source URL</li>
                    <li>Data endangering personnel</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <div className="cv-sec-title">03 // Recommended Sources</div>
              <div className="cv-sources">
                {[
                  { name:'SIPRI Database', url:'sipri.org' },
                  { name:'UCDP Conflict Data', url:'ucdp.uu.se' },
                  { name:'CIA World Factbook', url:'cia.gov' },
                  { name:'FAS Nuclear Notebook', url:'fas.org' },
                ].map((s,i) => (
                  <div key={i} className="cv-source-card">
                    <div className="cv-source-name">{s.name} <span className="cv-source-free">FREE</span></div>
                    <a href={`https://${s.url}`} target="_blank" rel="noopener" className="cv-source-url">{s.url}</a>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: The Form */}
          <div className="cv-main" ref={formRef}>
            <div className="cv-form-container">
              
              <div className="cv-form-intro">
                <strong>Clearance Not Required.</strong> Submit what you know in simple terms. Our analysts will format the data. The critical component is your <strong>Source Link</strong>.
              </div>

              {status === 'success' ? (
                <div className="cv-success">
                  <div className="cv-success-icon">✓</div>
                  <div className="cv-success-title">INTEL RECEIVED</div>
                  <p style={{color:'var(--muted)', fontSize: 18, lineHeight: 1.6}}>
                    Data securely transmitted to the Analyst Team. Verification takes up to 7 days before live deployment.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>

                  {/* 1. Target Card */}
                  <div className="cv-card">
                    <div className="cv-card-header"><div className="cv-card-icon">🌍</div> 1. Target Acquisition</div>
                    
                    <div className="cv-grid-2">
                      <div className="cv-field">
                        <label className="cv-label required">Target Nation <span className="cv-label-note">Country name</span></label>
                        <input className="cv-input" placeholder="e.g. Brazil, Japan, Nigeria..." value={form.country} onChange={e => update('country', e.target.value)} maxLength={80}/>
                      </div>
                      <div className="cv-field">
                        <label className="cv-label required">Category <span className="cv-label-note">Select from list</span></label>
                        <select className="cv-select" value={selectedDataset} onChange={e => selectDataset(e.target.value)}>
                          <option value="">Select an intelligence category...</option>
                          {DATASETS.map(d => <option key={d.id} value={d.id}>{d.label.replace(/[^a-zA-Z &]/g, '').trim()}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 2. Payload Card */}
                  <div className="cv-card">
                    <div className="cv-card-header"><div className="cv-card-icon">⚔️</div> 2. Intelligence Payload</div>
                    <div className="cv-hint">Complete at least one field below based on your selected category. Formatting is not required.</div>
                    
                    <div className="cv-field">
                      <label className="cv-label">Personnel & Structure <span className="cv-label-note">Troop counts, branches</span></label>
                      <textarea className="cv-textarea" placeholder="e.g. Total active: ~150,000. Army: 100k, Navy: 20k, Air Force: 30k..." value={form.personnel} onChange={e => update('personnel', e.target.value)} maxLength={3000}/>
                    </div>

                    <div className="cv-field">
                      <label className="cv-label">Hardware & Vehicles <span className="cv-label-note">Tanks, Jets, Naval</span></label>
                      <textarea className="cv-textarea" placeholder="e.g. MBT: T-72 (150 units). Jets: F-16 (20 active)..." value={form.equipment} onChange={e => update('equipment', e.target.value)} maxLength={3000}/>
                    </div>

                    <div className="cv-field">
                      <label className="cv-label">Conflicts / Other <span className="cv-label-note">Wars, corrections, notes</span></label>
                      <textarea className="cv-textarea" placeholder="e.g. Ongoing border operations since 2018..." value={form.conflicts} onChange={e => update('conflicts', e.target.value)} maxLength={3000}/>
                    </div>
                  </div>

                  {/* 3. Source Card */}
                  <div className="cv-card">
                    <div className="cv-card-header"><div className="cv-card-icon">📚</div> 3. Origin Source</div>
                    
                    <div className="cv-grid-2">
                      <div className="cv-field">
                        <label className="cv-label required">Source Type</label>
                        <select className="cv-select" value={form.source} onChange={e => update('source', e.target.value)}>
                          <option value="">Select origin type...</option>
                          {SOURCE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="cv-field">
                        <label className="cv-label">Reference Link <span className="cv-label-note">URL or Doc Ref</span></label>
                        <input className="cv-input" placeholder="https://..." value={form.sourceUrl} onChange={e => update('sourceUrl', e.target.value)} maxLength={400}/>
                      </div>
                    </div>
                  </div>

                  {/* 4. Profile Card (Optional, moved to bottom for better UX) */}
                  <div className="cv-card" style={{ background: 'transparent', borderColor: 'var(--border)' }}>
                    <div className="cv-card-header" style={{ color: 'var(--muted)' }}><div className="cv-card-icon" style={{opacity: 0.5}}>👤</div> 4. Operative Profile (Optional)</div>
                    
                    <div className="cv-grid-2">
                      <div className="cv-field">
                        <label className="cv-label">Alias / Name <span className="cv-label-note">For database credits</span></label>
                        <input className="cv-input" placeholder="Leave blank for anonymity" value={form.name} onChange={e => update('name', e.target.value)} maxLength={80}/>
                      </div>
                      <div className="cv-field">
                        <label className="cv-label">Secure Comm <span className="cv-label-note">Email for updates</span></label>
                        <input className="cv-input" type="email" placeholder="agent@domain.com" value={form.email} onChange={e => update('email', e.target.value)} maxLength={120}/>
                      </div>
                    </div>
                  </div>

                  {errMsg && <div className="cv-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    {errMsg}
                  </div>}

                  <button type="submit" className="cv-submit-btn" disabled={status==='sending'}>
                    {status==='sending' ? 'ENCRYPTING & TRANSMITTING...' : 'INITIATE SECURE UPLOAD'}
                  </button>
                  
                  <div style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:'var(--dim)',marginTop:20,letterSpacing:'.05em',textAlign:'center'}}>
                    SECURE POST TO DB · REVIEWED IN 7 DAYS · PII REDACTED
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* GitHub for Devs (Full Width Row) */}
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