// src/pages/Contribute.jsx

import { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SEO    from '../seo/SEO.jsx';

const REPO     = 'https://github.com/GihanIT/War-Scope-Global';
const DATA_DIR = `${REPO}/tree/main/frontend/src/data`;
const BLOB_DIR = `${REPO}/blob/main/frontend/src/data`;
const EDIT_DIR = `${REPO}/edit/main/frontend/src/data`;
const EMAIL    = 'contact@warscopeglobal.com';

const DATASETS = [
  { id:'army-units', label:'Army units & personnel', file:'army-units-db.js', template:'army-units.template.js', covered:54,  total:195, desc:'Troop numbers, branches, headquarters' },
  { id:'vehicles',   label:'Vehicles & equipment',   file:'vehicles-data.js', template:'vehicles.template.js',   covered:25,  total:195, desc:'Tanks, aircraft, warships, missiles' },
  { id:'sanctions',  label:'Sanctions & embargoes',  file:'sanctions-data.js', template:'sanctions.template.js', covered:19,  total:195, desc:'Active sanctions, financial, trade' },
  { id:'arms-trade', label:'Arms transfers & deals', file:'arms-trade-data.js', template:'arms-trade.template.js', covered:40, total:195, desc:'Weapons bought or sold: supplier, type, year' },
  { id:'timeline',   label:'Conflict history',       file:'timeline-data.js', template:'timeline.template.js',   covered:120, total:195, desc:'Wars and conflicts involving a country' },
];

const STEPS = [
  {
    title: 'Fork the repository',
    text: <>Click <strong>Fork</strong> at the top right of the <a href={REPO} target="_blank" rel="noopener noreferrer">War-Scope-Global repository</a>. This creates your own copy.</>,
  },
  {
    title: 'Clone your fork',
    text: <>Replace <code>YOUR-USERNAME</code> with your GitHub username.</>,
    code: `git clone https://github.com/YOUR-USERNAME/War-Scope-Global.git
cd War-Scope-Global`,
  },
  {
    title: 'Create a branch',
    text: <>Use a short name that says what you are adding.</>,
    code: `git checkout -b add-thailand-army-units`,
  },
  {
    title: 'Find your sources',
    text: <>Every data point needs a cited source. Good free starting points are SIPRI, UCDP, the CIA World Factbook and government defence ministry websites. The approved list is in <a href={`${BLOB_DIR}/SOURCES.md`} target="_blank" rel="noopener noreferrer">SOURCES.md</a>.</>,
  },
  {
    title: 'Add your data',
    text: <>Open the matching file in <code>frontend/src/data</code> (see the table above). Copy the template from <code>frontend/src/data/templates</code> and add your entry in the <strong>exact same format</strong> as the existing entries.</>,
  },
  {
    title: 'Check the site still runs',
    text: <>Open the page that uses your data. If it goes blank or the browser console shows an error, look for a missing comma, quote or bracket in your entry.</>,
    code: `cd frontend
npm install
npm run dev`,
  },
  {
    title: 'Commit and push',
    text: <>Commit only files inside <code>frontend/src/data</code>.</>,
    code: `cd ..
git add frontend/src/data
git commit -m "Add Thailand army units (Source: Royal Thai Army website + IISS 2025)"
git push origin add-thailand-army-units`,
  },
  {
    title: 'Open a pull request',
    text: <>On your fork, click <strong>Compare &amp; pull request</strong>. The base repository must be <code>GihanIT/War-Scope-Global</code> and the base branch <code>main</code>. Include the country, the file you changed, a source for each figure and any caveats.</>,
  },
  {
    title: 'Review and publish',
    text: <>Pull requests are reviewed within 7 days. We may ask you to clarify or verify a source. Once merged, your name is added to <code>CONTRIBUTORS.md</code> and the data goes live on the next site deployment.</>,
  },
];

const ACCEPTED = [
  ['Government defence ministry websites', 'army.mil.ng, mod.gov.uk, defense.gov'],
  ['Academic databases', 'SIPRI, UCDP, FAS Nuclear Notebook, ACLED'],
  ['Official international sources', 'CIA World Factbook, UN reports, OFAC, EU sanctions'],
  ['Manufacturer specifications', 'Official datasheets for vehicles, aircraft, weapons'],
  ['News from major outlets', 'Reuters, AP, BBC, Al Jazeera (for recent events)'],
  ['IISS Military Balance', 'Cite the page number. Do not copy text verbatim'],
  ['Personal knowledge', 'If you served or work in defence: public information only'],
];

const REJECTED = [
  ['Classified or leaked documents', 'Legal risk, unverifiable'],
  ['Social media posts, forums, Reddit', 'Unreliable, unverifiable'],
  ['Data with no source at all', 'Cannot verify accuracy'],
  ['Paywalled content copied verbatim', 'Copyright violation'],
  ['Information endangering personnel', 'Safety risk'],
  ['Estimates not marked as estimates', 'Misleading'],
];

const FORMAT_RULES = [
  <>Do not change a file&apos;s export structure. Only add entries to the existing arrays or objects.</>,
  <>Use ISO 3166-1 alpha-3 country codes, for example <code>NGA</code> for Nigeria or <code>THA</code> for Thailand.</>,
  <>Keep all strings in English unless the template says otherwise.</>,
  <>Mark estimates clearly, for example <code>&apos;~100,000&apos;</code>, or explain them in the <code>notes</code> field.</>,
  <>Put the source in the entry&apos;s <code>source</code> field.</>,
  <>Do not reformat or reorder existing entries. Small, focused changes are reviewed faster.</>,
];

const ISO_CODES = [
  ['Afghanistan','AFG'],['Algeria','DZA'],['Angola','AGO'],['Argentina','ARG'],['Australia','AUS'],['Austria','AUT'],
  ['Bangladesh','BGD'],['Belgium','BEL'],['Brazil','BRA'],['Bulgaria','BGR'],['Canada','CAN'],['Chile','CHL'],
  ['China','CHN'],['Colombia','COL'],['Czech Republic','CZE'],['Denmark','DNK'],['DRC','COD'],['Egypt','EGY'],
  ['Ethiopia','ETH'],['Finland','FIN'],['France','FRA'],['Georgia','GEO'],['Germany','DEU'],['Ghana','GHA'],
  ['Greece','GRC'],['India','IND'],['Indonesia','IDN'],['Iran','IRN'],['Iraq','IRQ'],['Israel','ISR'],
  ['Italy','ITA'],['Japan','JPN'],['Jordan','JOR'],['Kenya','KEN'],['Libya','LBY'],['Malaysia','MYS'],
  ['Mexico','MEX'],['Morocco','MAR'],['Myanmar','MMR'],['Netherlands','NLD'],['Nigeria','NGA'],['North Korea','PRK'],
  ['Norway','NOR'],['Oman','OMN'],['Pakistan','PAK'],['Philippines','PHL'],['Poland','POL'],['Portugal','PRT'],
  ['Romania','ROU'],['Russia','RUS'],['Saudi Arabia','SAU'],['Singapore','SGP'],['Somalia','SOM'],['South Africa','ZAF'],
  ['South Korea','KOR'],['Spain','ESP'],['Sudan','SDN'],['Sweden','SWE'],['Syria','SYR'],['Taiwan','TWN'],
  ['Thailand','THA'],['Turkey','TUR'],['UAE','ARE'],['Ukraine','UKR'],['United Kingdom','GBR'],['United States','USA'],
  ['Vietnam','VNM'],
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');

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
  --dim: #8294ad;
  --error: #ef4444;
  --success: #10b981;
}

html { scroll-behavior: smooth; }

.cv { min-height:100dvh; background:var(--bg); color:var(--text); font-family:'Barlow',sans-serif; overflow-x:hidden; position:relative; }
.cv::before { content:''; position:fixed; inset:0; background-image:radial-gradient(circle at 50% 0%, rgba(0,212,255,0.05) 0%, transparent 70%), linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px); background-size:100% 100%, 40px 40px, 40px 40px; pointer-events:none; z-index:0; }
.cv * { box-sizing:border-box; }
.cv a:focus-visible, .cv button:focus-visible, .cv summary:focus-visible { outline:2px solid var(--accent); outline-offset:3px; border-radius:4px; }

.cv-wrap { max-width:1280px; width:100%; margin:0 auto; padding:0 clamp(20px, 4vw, 60px) 100px; position:relative; z-index:1; }

/* Hero */
.cv-hero { padding:60px 0 44px; max-width:860px; }
.cv-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:999px; padding:6px 16px; font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; color:var(--success); margin-bottom:22px; }
.cv-hero-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:clamp(40px, 6vw, 68px); line-height:1.05; letter-spacing:.01em; margin:0 0 18px; text-transform:uppercase; }
.cv-hero-title span { color:var(--accent); }
.cv-hero-sub { font-size:18px; color:var(--muted); line-height:1.65; max-width:68ch; margin:0 0 28px; }
.cv-hero-actions { display:flex; flex-wrap:wrap; gap:12px; }

.cv-btn { display:inline-flex; align-items:center; gap:10px; border-radius:8px; padding:14px 24px; font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600; text-decoration:none; transition:background 200ms ease, border-color 200ms ease, transform 200ms ease; cursor:pointer; }
.cv-btn-primary { background:var(--accent); color:#001018; border:1px solid var(--accent); }
.cv-btn-primary:hover { background:var(--accent-hover); transform:translateY(-1px); }
.cv-btn-ghost { background:transparent; color:var(--text); border:1px solid var(--border-hover); }
.cv-btn-ghost:hover { background:var(--accent-dim); }

/* Sections */
.cv-section { margin-top:64px; }
.cv-section-title { font-family:'Barlow Condensed',sans-serif; font-size:clamp(26px, 3.4vw, 36px); font-weight:800; letter-spacing:.01em; margin:0 0 8px; text-transform:uppercase; }
.cv-section-lead { color:var(--muted); font-size:16px; line-height:1.65; max-width:70ch; margin:0 0 24px; }
.cv-section code, .cv-step code, .cv-note code { font-family:'IBM Plex Mono',monospace; font-size:.88em; background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.08); border-radius:4px; padding:1px 6px; color:#e2f6ff; }
.cv a { color:var(--accent); }
.cv a:hover { color:var(--accent-hover); }
.cv .cv-btn-primary, .cv .cv-btn-primary:hover { color:#001018; }
.cv .cv-btn-ghost, .cv .cv-btn-ghost:hover { color:var(--text); }

/* Dataset table */
.cv-data-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(340px, 1fr)); gap:16px; }
.cv-data-card { background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:22px; backdrop-filter:blur(12px); display:flex; flex-direction:column; gap:10px; }
.cv-data-name { font-size:18px; font-weight:600; line-height:1.3; }
.cv-data-desc { font-size:14px; color:var(--dim); line-height:1.5; }
.cv-data-file { font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--muted); word-break:break-all; }
.cv-cov-bar { height:4px; background:rgba(255,255,255,0.06); border-radius:2px; overflow:hidden; }
.cv-cov-fill { height:100%; border-radius:2px; }
.cv-cov-meta { display:flex; justify-content:space-between; font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--dim); }
.cv-data-links { display:flex; flex-wrap:wrap; gap:14px; margin-top:auto; padding-top:6px; font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight:600; }

.cv-note { margin-top:20px; background:var(--accent-dim); border-left:3px solid var(--accent); border-radius:0 8px 8px 0; padding:16px 20px; font-size:15px; color:var(--muted); line-height:1.6; max-width:80ch; }
.cv-note strong { color:var(--text); }

/* Browser route */
.cv-browser { background:var(--panel); border:1px solid var(--border); border-radius:14px; padding:clamp(22px, 3vw, 36px); }
.cv-browser ol { margin:0; padding-left:22px; color:var(--muted); font-size:16px; line-height:1.7; max-width:72ch; }
.cv-browser li { margin-bottom:6px; }
.cv-browser li strong { color:var(--text); }

/* Steps */
.cv-steps { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:0; max-width:820px; }
.cv-step { display:grid; grid-template-columns:44px 1fr; gap:18px; padding-bottom:30px; position:relative; }
.cv-step:not(:last-child)::before { content:''; position:absolute; left:21px; top:44px; bottom:0; width:1px; background:var(--border); }
.cv-step-num { width:44px; height:44px; border-radius:50%; border:1px solid var(--border-hover); background:var(--accent-dim); display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-size:15px; font-weight:600; color:var(--accent); }
.cv-step-title { font-size:20px; font-weight:600; margin:8px 0 6px; }
.cv-step-text { color:var(--muted); font-size:16px; line-height:1.65; margin:0; }
.cv-step-text strong { color:var(--text); }

.cv-code { position:relative; margin-top:14px; background:#060a12; border:1px solid rgba(255,255,255,0.1); border-radius:10px; }
.cv-code pre { margin:0; padding:16px 84px 16px 18px; overflow-x:auto; font-family:'IBM Plex Mono',monospace; font-size:13px; line-height:1.7; color:#d7e6f5; }
.cv-copy { position:absolute; top:10px; right:10px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.14); border-radius:6px; color:var(--muted); font-family:'IBM Plex Mono',monospace; font-size:11px; padding:5px 10px; cursor:pointer; }
.cv-copy:hover { background:rgba(255,255,255,0.12); color:var(--text); }

/* Rules */
.cv-rules-list { margin:0; padding-left:22px; color:var(--muted); font-size:16px; line-height:1.7; max-width:78ch; }
.cv-rules-list li { margin-bottom:8px; }

.cv-two { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
.cv-box { background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:22px; }
.cv-box h3 { margin:0 0 14px; font-size:18px; font-weight:600; }
.cv-box.ok h3 { color:var(--success); }
.cv-box.no h3 { color:var(--error); }
.cv-box ul { list-style:none; margin:0; padding:0; }
.cv-box li { padding:10px 0; border-top:1px solid rgba(255,255,255,0.06); font-size:15px; line-height:1.5; color:var(--text); }
.cv-box li:first-child { border-top:none; padding-top:0; }
.cv-box li span { display:block; font-size:13px; color:var(--dim); margin-top:2px; }

/* PR example */
.cv-pr { background:var(--panel); border:1px solid var(--border); border-radius:12px; padding:clamp(20px, 3vw, 32px); max-width:820px; }
.cv-pr-label { font-family:'IBM Plex Mono',monospace; font-size:12px; color:var(--dim); margin:0 0 6px; }
.cv-pr-title { font-size:17px; font-weight:600; margin:0 0 20px; }
.cv-pr-body { font-size:15px; line-height:1.65; color:var(--muted); }
.cv-pr-body p { margin:0 0 10px; }
.cv-pr-body ul { margin:0 0 10px; padding-left:20px; }

/* ISO */
.cv-iso summary { cursor:pointer; font-size:16px; font-weight:600; padding:14px 18px; background:var(--panel); border:1px solid var(--border); border-radius:10px; max-width:820px; }
.cv-iso-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:6px 24px; padding:18px 4px 0; max-width:900px; }
.cv-iso-row { display:flex; justify-content:space-between; gap:10px; font-size:14px; color:var(--muted); padding:5px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
.cv-iso-row b { font-family:'IBM Plex Mono',monospace; font-weight:600; color:var(--text); }

/* Help */
.cv-help { background:rgba(99,102,241,0.05); border:1px solid rgba(99,102,241,0.25); border-radius:16px; padding:clamp(24px, 4vw, 36px); display:flex; align-items:center; gap:28px; flex-wrap:wrap; }
.cv-help-text { flex:1; min-width:260px; }
.cv-help-title { font-family:'Barlow Condensed',sans-serif; font-size:30px; font-weight:800; margin:0 0 8px; text-transform:uppercase; }
.cv-help-desc { font-size:15px; color:var(--muted); line-height:1.6; margin:0; }
.cv-help-actions { display:flex; flex-wrap:wrap; gap:12px; }

@media (max-width: 860px) {
  .cv-two { grid-template-columns:1fr; }
  .cv-data-grid { grid-template-columns:1fr; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior:auto; }
  .cv * { transition:none !important; }
}
`;

function injectCSS(id, css) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="cv-code">
      <pre><code>{code}</code></pre>
      <button type="button" className="cv-copy" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
    </div>
  );
}

function CovBar({ covered, total }) {
  const pct   = Math.round((covered / total) * 100);
  const color = pct >= 50 ? '#fbbf24' : 'var(--error)';
  return (
    <>
      <div className="cv-cov-bar" role="img" aria-label={`${covered} of ${total} countries covered`}>
        <div className="cv-cov-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className="cv-cov-meta">
        <span>{covered} of {total} countries covered</span>
        <span>{pct}%</span>
      </div>
    </>
  );
}

export default function Contribute() {
  injectCSS('cv-css', CSS);

  return (
    <div className="cv">
      <SEO
        title="How to Contribute Military Data | WarScope"
        description="Add or correct military data on WarScope through a GitHub pull request. Step-by-step guide, data files, templates and source rules."
        canonical="/contribute"
      />
      <Navbar />

      <div className="cv-wrap">

        {/* Hero */}
        <header className="cv-hero">
          <div className="cv-badge">Open data · GitHub pull requests</div>
          <h1 className="cv-hero-title">Help us map <span>every country&apos;s forces</span></h1>
          <p className="cv-hero-sub">
            WarScope still has no verified military data for most of the world&apos;s countries. All of our data lives in one folder of one open repository. Add or correct entries there with a pull request and your work reaches thousands of readers.
          </p>
          <div className="cv-hero-actions">
            <a className="cv-btn cv-btn-primary" href={REPO} target="_blank" rel="noopener noreferrer">Open the repository on GitHub</a>
            <a className="cv-btn cv-btn-ghost" href={DATA_DIR} target="_blank" rel="noopener noreferrer">Browse the data folder</a>
          </div>
        </header>

        {/* Which file */}
        <section className="cv-section" aria-labelledby="cv-files">
          <h2 className="cv-section-title" id="cv-files">Which file do I edit?</h2>
          <p className="cv-section-lead">
            Pick the dataset you know best. Each card links to the file, the template to copy from, and a button that opens the file in GitHub&apos;s browser editor.
          </p>

          <div className="cv-data-grid">
            {DATASETS.map(d => (
              <div key={d.id} className="cv-data-card">
                <div className="cv-data-name">{d.label}</div>
                <div className="cv-data-desc">{d.desc}</div>
                <div className="cv-data-file">frontend/src/data/{d.file}</div>
                <CovBar covered={d.covered} total={d.total} />
                <div className="cv-data-links">
                  <a href={`${EDIT_DIR}/${d.file}`} target="_blank" rel="noopener noreferrer">Edit in browser</a>
                  <a href={`${BLOB_DIR}/templates/${d.template}`} target="_blank" rel="noopener noreferrer">View template</a>
                </div>
              </div>
            ))}
          </div>

          <div className="cv-note">
            <strong>Other files.</strong> <code>nuclear-data.js</code>, <code>alliance-data.js</code>, <code>blog-data.js</code> and <code>quiz-data.js</code> are maintained by the project owner. To suggest a change to those, <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">open a GitHub Issue</a>. Please do not edit anything outside <code>frontend/src/data</code>: pull requests that touch <code>backend/</code>, config files or <code>.env</code> files will be closed.
          </div>
        </section>

        {/* Browser route */}
        <section className="cv-section" aria-labelledby="cv-browser">
          <h2 className="cv-section-title" id="cv-browser">Easiest way: edit in your browser</h2>
          <p className="cv-section-lead">You do not need Git installed. All you need is a free GitHub account.</p>
          <div className="cv-browser">
            <ol>
              <li>Sign in to GitHub and click <strong>Edit in browser</strong> on the dataset above. GitHub creates your own fork automatically.</li>
              <li>Add your entry, following the template format exactly.</li>
              <li>Click <strong>Commit changes</strong>, choose <strong>Create a new branch and start a pull request</strong>, then click <strong>Propose changes</strong>.</li>
              <li>Fill in the pull request description (see the example below).</li>
            </ol>
          </div>
        </section>

        {/* Git route */}
        <section className="cv-section" aria-labelledby="cv-git">
          <h2 className="cv-section-title" id="cv-git">Using Git on your computer</h2>
          <p className="cv-section-lead">Prefer working locally? Follow these steps in order.</p>
          <ol className="cv-steps">
            {STEPS.map((s, i) => (
              <li key={s.title} className="cv-step">
                <div className="cv-step-num" aria-hidden="true">{i + 1}</div>
                <div>
                  <h3 className="cv-step-title">{s.title}</h3>
                  <p className="cv-step-text">{s.text}</p>
                  {s.code && <CodeBlock code={s.code} />}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Formatting rules */}
        <section className="cv-section" aria-labelledby="cv-format">
          <h2 className="cv-section-title" id="cv-format">Formatting rules</h2>
          <ul className="cv-rules-list">
            {FORMAT_RULES.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </section>

        {/* Data quality */}
        <section className="cv-section" aria-labelledby="cv-quality">
          <h2 className="cv-section-title" id="cv-quality">Data quality rules</h2>
          <p className="cv-section-lead">You must cite a source for every data point. Data without a source cannot be merged.</p>
          <div className="cv-two">
            <div className="cv-box ok">
              <h3>We accept</h3>
              <ul>
                {ACCEPTED.map(([t, e]) => <li key={t}>{t}<span>{e}</span></li>)}
              </ul>
            </div>
            <div className="cv-box no">
              <h3>We do not accept</h3>
              <ul>
                {REJECTED.map(([t, e]) => <li key={t}>{t}<span>{e}</span></li>)}
              </ul>
            </div>
          </div>
          <div className="cv-note">
            Good free sources: <a href="https://sipri.org" target="_blank" rel="noopener noreferrer">SIPRI</a>, <a href="https://ucdp.uu.se" target="_blank" rel="noopener noreferrer">UCDP</a>, <a href="https://www.cia.gov/the-world-factbook/" target="_blank" rel="noopener noreferrer">CIA World Factbook</a> and government defence ministry websites. The full approved list is in <a href={`${BLOB_DIR}/SOURCES.md`} target="_blank" rel="noopener noreferrer">SOURCES.md</a>.
          </div>
        </section>

        {/* PR example */}
        <section className="cv-section" aria-labelledby="cv-pr">
          <h2 className="cv-section-title" id="cv-pr">Writing a good pull request</h2>
          <p className="cv-section-lead">Always include the country, the file you changed, a source for each figure and any caveats.</p>
          <div className="cv-pr">
            <p className="cv-pr-label">Title</p>
            <p className="cv-pr-title">Add Thailand army units, air force and navy data. Source: Royal Thai Army website + IISS 2025</p>
            <p className="cv-pr-label">Description</p>
            <div className="cv-pr-body">
              <p>Adding Thailand military data to <code>army-units-db.js</code>.</p>
              <p><strong>Sources</strong></p>
              <ul>
                <li>Personnel figures: Royal Thai Armed Forces official website (rta.mi.th), accessed March 2026</li>
                <li>Equipment: IISS Military Balance 2025, p.287</li>
              </ul>
              <p><strong>Notes</strong></p>
              <ul>
                <li>Reserve figures are approximate because official numbers are not publicly released</li>
                <li>Special Forces unit names are translated from Thai, with the Thai names in comments</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ISO codes */}
        <section className="cv-section cv-iso" aria-labelledby="cv-iso">
          <h2 className="cv-section-title" id="cv-iso">Country codes</h2>
          <p className="cv-section-lead">Use ISO 3166-1 alpha-3 codes in the <code>iso3</code> field.</p>
          <details>
            <summary>Show common country codes</summary>
            <div className="cv-iso-grid">
              {ISO_CODES.map(([name, code]) => (
                <div key={code} className="cv-iso-row"><span>{name}</span><b>{code}</b></div>
              ))}
            </div>
            <p className="cv-section-lead" style={{ marginTop: 16 }}>
              Full list: <a href="https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3" target="_blank" rel="noopener noreferrer">ISO 3166-1 on Wikipedia</a>
            </p>
          </details>
        </section>

        {/* Help */}
        <section className="cv-section">
          <div className="cv-help">
            <div className="cv-help-text">
              <h2 className="cv-help-title">Questions?</h2>
              <p className="cv-help-desc">
                Open an issue with the <code>question</code> label or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. By contributing, you agree that your contribution is released under the repository&apos;s license.
              </p>
            </div>
            <div className="cv-help-actions">
              <a className="cv-btn cv-btn-ghost" href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">Open an issue</a>
              <a className="cv-btn cv-btn-primary" href={`${REPO}/fork`} target="_blank" rel="noopener noreferrer">Fork on GitHub</a>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}