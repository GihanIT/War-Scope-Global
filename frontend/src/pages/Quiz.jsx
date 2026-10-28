// src/pages/Quiz.jsx
// Daily military trivia — 5 questions per day, streak tracking, localStorage
// Add to App.jsx: import Quiz from './pages/Quiz.jsx';
//                 <Route path="/quiz" element={<Quiz />} />
// Add to Navbar INTEL_LINKS: { label:'INTEL QUIZ', to:'/quiz', Icon: Icons.Quiz }

import { useState, useEffect, useRef } from 'react';
import Navbar   from '../components/Navbar.jsx';
import Footer   from '../components/Footer.jsx';
import AdBanner from '../components/AdBanner.jsx';
import SEO      from '../seo/SEO.jsx';
import { getDailyQuestions, getTodayStr, QUIZ_CATEGORIES } from '../data/quiz-data.js';

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_STATE   = 'warscope:quiz:state:v2';
const LS_STREAK  = 'warscope:quiz:streak:v2';
const LS_HISTORY = 'warscope:quiz:history:v2';

function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap');

:root {
  --qz-cyan: #00d4ff;
  --qz-indigo: #6366f1;
  --qz-indigo-dim: rgba(99,102,241,0.15);
  --qz-green: #00e676;
  --qz-red: #ff3b3b;
  --qz-gold: #f59e0b;
  --qz-bg: #03050a;
  --qz-card: rgba(12,16,30,0.85);
  --qz-border: rgba(99,102,241,0.25);
  --qz-text: #f0f4ff;
  --qz-text-dim: #94a3b8;
}

.qz { min-height:100dvh; background:var(--qz-bg); color:var(--qz-text); font-family:'Barlow',sans-serif; overflow-x:hidden; position:relative; }
.qz::before { content:''; position:fixed; inset:0; background-image:radial-gradient(circle at 50% 0%, rgba(99,102,241,0.1) 0%, transparent 60%), linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px); background-size:100% 100%, 40px 40px, 40px 40px; pointer-events:none; z-index:0; }

/* ── 3-Column Layout ── */
.qz-layout { display: flex; justify-content: center; gap: 32px; max-width: 1400px; margin: 0 auto; padding: 0 20px 80px; position: relative; z-index: 1; align-items: flex-start; }
.qz-main { flex: 1; max-width: 800px; width: 100%; }
.qz-sidebar { width: 160px; flex-shrink: 0; position: sticky; top: 100px; padding-top: 50px; display: flex; flex-direction: column; gap: 24px; align-items: center; }

/* ── Hero ── */
.qz-hero { text-align:center; padding:50px 0 30px; }
.qz-hero-badge { display:inline-flex; align-items:center; gap:8px; background:var(--qz-indigo-dim); border:1px solid var(--qz-border); border-radius:999px; padding:6px 18px; font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600; letter-spacing:.15em; color:#a5b4fc; margin-bottom:20px; }
.qz-hero-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:clamp(48px,9vw,80px); line-height:1; letter-spacing:.02em; margin-bottom:16px; text-transform:uppercase; text-shadow: 0 0 30px rgba(99,102,241,0.3); }
.qz-hero-sub { font-size:16px; color:var(--qz-text-dim); max-width:540px; margin:0 auto; line-height:1.6; }

/* ── Streak bar ── */
.qz-streak-bar { display:grid; grid-template-columns: auto 1px 1fr 1px 1fr 1px 1fr; align-items:center; gap:20px; background:var(--qz-card); border:1px solid var(--qz-border); border-top: 2px solid var(--qz-indigo); border-radius:12px; padding:20px 24px; margin-bottom:32px; backdrop-filter:blur(12px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
.qz-streak-item { text-align:center; }
.qz-streak-val { font-family:'Barlow Condensed',sans-serif; font-size:36px; font-weight:900; line-height:1; }
.qz-streak-lbl { font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:.15em; color:#64748b; text-transform:uppercase; margin-top:6px; }
.qz-streak-fire { font-size:32px; line-height:1; filter: drop-shadow(0 0 10px rgba(245,158,11,0.5)); }
.qz-streak-div { width:1px; height:40px; background:rgba(255,255,255,0.08); }

/* ── History dots ── */
.qz-history { display:flex; gap:6px; justify-content:center; flex-wrap:wrap; margin-top:16px; padding: 16px; background: rgba(0,0,0,0.2); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
.qz-hist-dot { width:12px; height:12px; border-radius:50%; box-shadow: 0 0 8px rgba(0,0,0,0.5); }

/* ── Category badge ── */
.qz-cat-badge { display:inline-flex; align-items:center; gap:6px; padding:6px 16px; border-radius:4px; font-family:'IBM Plex Mono',monospace; font-size:10px; font-weight:600; letter-spacing:.12em; border:1px solid; margin-bottom:24px; text-transform: uppercase; }

/* ── Question card ── */
.qz-card { background:var(--qz-card); border:1px solid var(--qz-border); border-radius:16px; padding:40px; margin-bottom:24px; backdrop-filter:blur(20px); box-shadow:0 12px 40px rgba(0,0,0,0.5); }
.qz-progress-wrap { display:flex; align-items:center; gap:16px; margin-bottom:24px; }
.qz-progress-bar { flex:1; height:6px; background:rgba(255,255,255,0.05); border-radius:3px; overflow:hidden; }
.qz-progress-fill { height:100%; border-radius:3px; background:var(--qz-indigo); transition:width 400ms cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 0 10px var(--qz-indigo); }
.qz-progress-text { font-family:'IBM Plex Mono',monospace; font-size:12px; font-weight: 600; color:var(--qz-text-dim); white-space:nowrap; }

.qz-diff { display:flex; gap:6px; margin-bottom:24px; align-items: center; }
.qz-diff-pip { width:12px; height:6px; border-radius:2px; }
.qz-question { font-size:24px; font-weight:600; line-height:1.5; margin-bottom:32px; color:var(--qz-text); }

/* ── Options ── */
.qz-options { display:flex; flex-direction:column; gap:12px; }
.qz-option { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:16px 20px; cursor:pointer; font-size:17px; font-weight:500; color:#cbd5e1; text-align:left; transition:all 200ms ease; display:flex; align-items:center; gap:16px; line-height:1.4; font-family: 'Barlow', sans-serif; }
.qz-option:hover:not(:disabled) { background:var(--qz-indigo-dim); border-color:var(--qz-indigo); color:var(--qz-text); transform:translateX(4px); box-shadow: -4px 0 15px rgba(99,102,241,0.2); }
.qz-option:disabled { cursor:default; transform:none; }
.qz-option.correct { background:rgba(0,230,118,0.1); border-color:var(--qz-green); color:var(--qz-text); }
.qz-option.wrong { background:rgba(255,59,59,0.1); border-color:var(--qz-red); color:var(--qz-text); }
.qz-option.reveal { background:rgba(255,255,255,0.02); border-color:rgba(255,255,255,0.05); color:#64748b; opacity: 0.6; }
.qz-option.reveal.correct-reveal { background:rgba(0,230,118,0.05); border-color:rgba(0,230,118,0.4); color:var(--qz-green); opacity: 1; }
.qz-option-letter { width:32px; height:32px; border-radius:6px; background:rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:700; flex-shrink:0; transition:all 200ms; }
.qz-option.correct .qz-option-letter { background:var(--qz-green); color:#000; border-color: var(--qz-green); }
.qz-option.wrong   .qz-option-letter { background:var(--qz-red); color:#fff; border-color: var(--qz-red); }
.qz-option.reveal.correct-reveal .qz-option-letter { background:rgba(0,230,118,0.2); color:var(--qz-green); border-color: var(--qz-green); }

/* ── Fact reveal ── */
.qz-fact { background:rgba(99,102,241,0.05); border-left:3px solid var(--qz-indigo); border-radius:0 8px 8px 0; padding:18px 24px; margin-top:24px; font-size:15px; color:var(--qz-text-dim); line-height:1.6; animation:qz-slide-up 400ms cubic-bezier(0.16, 1, 0.3, 1) both; }
.qz-fact strong { color:#a5b4fc; font-weight:600; letter-spacing: .05em; font-family: 'IBM Plex Mono', monospace; font-size: 13px; text-transform: uppercase; }
@keyframes qz-slide-up { from{opacity:0; transform:translateY(10px)} to{opacity:1; transform:translateY(0)} }

/* ── Next button ── */
.qz-next-btn { width:100%; margin-top:24px; background:var(--qz-indigo); border:1px solid #818cf8; border-radius:10px; padding:20px; font-family:'Barlow Condensed',sans-serif; font-size:24px; font-weight:800; letter-spacing:.08em; color:#fff; cursor:pointer; transition:all 200ms ease; text-transform:uppercase; box-shadow: 0 4px 15px rgba(99,102,241,0.3); }
.qz-next-btn:hover { background:#4f46e5; transform:translateY(-2px); box-shadow:0 8px 24px rgba(99,102,241,0.5); }

/* ── Result & Screen Layouts ── */
.qz-screen { background:var(--qz-card); border:1px solid var(--qz-border); border-radius:16px; padding:48px 40px; text-align:center; backdrop-filter:blur(20px); box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
.qz-screen.broken { border-color: rgba(255,59,59,0.3); border-top: 3px solid var(--qz-red); }
.qz-result-emoji { font-size:72px; margin-bottom:16px; line-height:1; filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3)); }
.qz-result-title { font-family:'Barlow Condensed',sans-serif; font-size:54px; font-weight:900; margin-bottom:8px; line-height: 1; text-transform: uppercase; }
.qz-result-score { font-family:'IBM Plex Mono',monospace; font-size:14px; color:var(--qz-text-dim); margin-bottom:36px; letter-spacing: .05em; }

.qz-result-breakdown { display:grid; grid-template-columns:repeat(4, 1fr); gap:12px; margin-bottom:36px; }
.qz-result-stat { background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); border-radius:10px; padding:20px; transition: transform 200ms; }
.qz-result-stat:hover { transform: translateY(-2px); background:rgba(255,255,255,0.03); }
.qz-result-stat-val { font-family:'Barlow Condensed',sans-serif; font-size:42px; font-weight:900; line-height:1; margin-bottom:6px; }
.qz-result-stat-lbl { font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:.15em; color:#64748b; text-transform:uppercase; }

/* ── Answer review ── */
.qz-review { margin-bottom:36px; text-align: left; background: rgba(0,0,0,0.2); border-radius: 12px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); }
.qz-review-title { font-family:'IBM Plex Mono',monospace; font-size:11px; letter-spacing:.2em; color:var(--qz-cyan); text-transform:uppercase; margin-bottom:20px; display: flex; align-items: center; gap: 8px; }
.qz-review-title::before { content: ''; width: 8px; height: 8px; background: var(--qz-cyan); border-radius: 50%; display: inline-block; }
.qz-review-item { display:flex; align-items:flex-start; gap:16px; padding:16px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
.qz-review-item:last-child { border-bottom:none; padding-bottom: 0; }
.qz-review-icon { font-size:18px; flex-shrink:0; margin-top:2px; background: rgba(255,255,255,0.05); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
.qz-review-q { font-size:15px; font-weight: 500; color:var(--qz-text); line-height:1.5; margin-bottom: 6px; }
.qz-review-a { font-size:13px; color:var(--qz-text-dim); background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px; display: inline-block; }

/* ── Share button ── */
.qz-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin-bottom: 20px; }
.qz-share-btn { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.15); border-radius:8px; padding:16px 32px; font-family:'IBM Plex Mono',monospace; font-size:13px; font-weight:600; letter-spacing:.1em; color:#cbd5e1; cursor:pointer; transition:all 200ms; text-transform:uppercase; display:inline-flex; align-items:center; gap: 8px; text-decoration: none; }
.qz-share-btn:hover { background:rgba(255,255,255,0.1); color:var(--qz-text); border-color: rgba(255,255,255,0.3); }
.qz-share-btn.primary { background:var(--qz-indigo); border-color:transparent; color:#fff; }
.qz-share-btn.primary:hover { background: #4f46e5; box-shadow:0 4px 20px rgba(99,102,241,0.4); transform: translateY(-2px); }

/* ── Countdown ── */
.qz-countdown { font-family:'IBM Plex Mono',monospace; font-size:12px; color:#64748b; margin-top:24px; letter-spacing:.1em; background: rgba(0,0,0,0.3); display: inline-block; padding: 8px 16px; border-radius: 20px; }

/* ── Ads Wrapper ── */
.qz-ad-wrapper { margin: 32px 0; display: flex; justify-content: center; width: 100%; overflow: hidden; }

/* ── Responsive Rules ── */
@media(max-width:1200px) {
  /* Hide sidebars on smaller desktop/tablets */
  .qz-sidebar { display: none; }
}
@media(max-width:768px) {
  .qz-streak-bar { grid-template-columns: 1fr; gap: 12px; text-align: center; }
  .qz-streak-div { width: 100%; height: 1px; }
  .qz-streak-item { display: flex; justify-content: space-between; align-items: center; width: 100%; }
  .qz-streak-lbl { margin-top: 0; }
  .qz-streak-fire { display: none; }
  .qz-result-breakdown { grid-template-columns: repeat(2, 1fr); }
  .qz-card, .qz-screen { padding: 32px 20px; }
}
@media(max-width:480px) {
  .qz-hero-title { font-size: 42px; }
  .qz-actions { flex-direction: column; width: 100%; }
  .qz-share-btn { width: 100%; justify-content: center; }
}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style'); s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

const LETTERS = ['A', 'B', 'C', 'D'];

function getCatConfig(catId) {
  return QUIZ_CATEGORIES.find(c => c.id === catId) ?? { label: catId, color: '#6366f1' };
}

function scoreEmoji(score, total) {
  const pct = score / total;
  if (pct === 1)   return '🎖️';
  if (pct >= 0.8)  return '🔥';
  if (pct >= 0.6)  return '💪';
  if (pct >= 0.4)  return '🎯';
  return '📚';
}

function scoreTitle(score, total) {
  const pct = score / total;
  if (pct === 1)   return 'PERFECT INTEL';
  if (pct >= 0.8)  return 'FIELD COMMANDER';
  if (pct >= 0.6)  return 'INTEL OFFICER';
  if (pct >= 0.4)  return 'ANALYST';
  return 'RECRUIT';
}

function getNextMidnight() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return midnight - now;
}

function formatCountdown(ms) {
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Quiz() {
  injectCSS('qz-css', CSS);

  const today     = getTodayStr();
  const questions = getDailyQuestions(today, 5);

  // ── State ─────────────────────────────────────────────────────────────────
  const [phase, setPhase]       = useState('quiz'); // 'quiz' | 'result' | 'done' | 'broken'
  const [qIdx,  setQIdx]        = useState(0);
  const [selected, setSelected] = useState(null);   // index of chosen option
  const [answers, setAnswers]   = useState([]);     // { question, chosen, correct, isRight }
  const [score, setScore]       = useState(0);
  const [streak, setStreak]     = useState({ current: 0, best: 0, lastDate: null });
  const [history, setHistory]   = useState([]);     // last 14 days: { date, score, total }
  const [copied, setCopied]     = useState(false);
  const [countdown, setCountdown] = useState(getNextMidnight());
  const cardRef = useRef(null);

  // ── Load saved state ──────────────────────────────────────────────────────
  useEffect(() => {
    const savedStreak  = loadLS(LS_STREAK,  { current: 0, best: 0, lastDate: null });
    const savedHistory = loadLS(LS_HISTORY, []);
    setStreak(savedStreak);
    setHistory(savedHistory);

    // Check if already played today
    const savedState = loadLS(LS_STATE, null);
    if (savedState?.date === today) {
      setScore(savedState.score);
      setAnswers(savedState.answers ?? []);
      setPhase('done');
    }
  }, [today]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'done' && phase !== 'result' && phase !== 'broken') return;
    const iv = setInterval(() => setCountdown(getNextMidnight()), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  // ── Answer a question ─────────────────────────────────────────────────────
  const handleSelect = (optIdx) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const q       = questions[qIdx];
    const isRight = optIdx === q.answer;
    const newAnswers = [...answers, { question: q.question, chosen: q.options[optIdx], correct: q.options[q.answer], isRight, category: q.category }];
    setAnswers(newAnswers);
    if (isRight) setScore(s => s + 1);
  };

  // ── Next question / finish ────────────────────────────────────────────────
  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      finishQuiz();
    } else {
      setQIdx(i => i + 1);
      setSelected(null);
      cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const finishQuiz = () => {
    const finalScore = answers.filter(a => a.isRight).length + (selected === questions[qIdx].answer ? 1 : 0);
    const passed     = finalScore >= 3; // 3/5 or better keeps streak

    // Update streak
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    const yStr      = yesterday.toISOString().slice(0, 10);
    const newStreak = { ...streak };

    if (passed) {
      if (streak.lastDate === yStr || streak.lastDate === today) {
        newStreak.current = streak.lastDate === today ? streak.current : streak.current + 1;
      } else {
        newStreak.current = 1;
      }
      newStreak.best     = Math.max(newStreak.current, streak.best);
      newStreak.lastDate = today;
    } else {
      newStreak.current  = 0;
      newStreak.lastDate = today;
    }

    // Update history
    const newHistory = [
      { date: today, score: finalScore, total: questions.length, passed },
      ...history.filter(h => h.date !== today),
    ].slice(0, 14);

    setStreak(newStreak);
    setHistory(newHistory);
    saveLS(LS_STREAK, newStreak);
    saveLS(LS_HISTORY, newHistory);
    saveLS(LS_STATE, { date: today, score: finalScore, answers });

    setPhase(passed ? 'result' : 'broken');
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleShare = () => {
    const dots = answers.map(a => a.isRight ? '🟢' : '🔴').join('');
    const text = `WarScope Daily Intel Quiz\n${dots}\n${score}/${questions.length} · 🔥 ${streak.current} day streak\nwarscopeglobal.com/quiz`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const q      = questions[qIdx];
  const catCfg = q ? getCatConfig(q.category) : null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="qz">
      <SEO
        title="Daily Military Intel Quiz | WarScope"
        description="Test your military and geopolitical knowledge with WarScope's daily 5-question intel briefing. New questions every day."
        canonical="/quiz"
      />
      <Navbar />

      {/* Main 3-Column Layout Wrapper */}
      <div className="qz-layout">
        
        {/* Left Ad Sidebar */}
        <aside className="qz-sidebar left">
          <div style={{ fontSize: 10, color: 'var(--qz-text-dim)', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Advertisement</div>
          <AdBanner id="ad-quiz-left-sidebar" size="160x600" />
        </aside>

        {/* Center Main Content */}
        <main className="qz-main">
          {/* Hero */}
          <div className="qz-hero">
            <div className="qz-hero-badge">
              <span>🎖️</span> DAILY INTEL BRIEFING
            </div>
            <h1 className="qz-hero-title">INTEL QUIZ</h1>
            <p className="qz-hero-sub">
              5 classified questions. New briefing every 24 hours.<br/>
              Test your tactical, geopolitical, and historical knowledge.
            </p>
          </div>

          {/* Top Leaderboard Ad Placement */}
          <div className="qz-ad-wrapper" style={{ marginTop: 0 }}>
              <AdBanner id="ad-quiz-top" size="728x90" />
          </div>

          {/* Streak bar */}
          <div className="qz-streak-bar">
            <div className="qz-streak-item">
              <div className="qz-streak-fire">🔥</div>
            </div>
            <div className="qz-streak-div"/>
            <div className="qz-streak-item">
              <div className="qz-streak-val" style={{ color: streak.current > 0 ? 'var(--qz-gold)' : '#475569' }}>
                {streak.current}
              </div>
              <div className="qz-streak-lbl">Current Streak</div>
            </div>
            <div className="qz-streak-div"/>
            <div className="qz-streak-item">
              <div className="qz-streak-val" style={{ color: 'var(--qz-indigo)' }}>{streak.best}</div>
              <div className="qz-streak-lbl">Best Streak</div>
            </div>
            <div className="qz-streak-div"/>
            <div className="qz-streak-item">
              <div className="qz-streak-val" style={{ color: 'var(--qz-green)' }}>
                {history.filter(h => h.passed).length}
              </div>
              <div className="qz-streak-lbl">Days Won</div>
            </div>
          </div>
          
          {/* History dots */}
          {history.length > 0 && (
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <div className="qz-streak-lbl" style={{ marginBottom: 8 }}>Last {history.length} operations</div>
                  <div className="qz-history">
                      {[...history].reverse().map((h, i) => (
                      <div key={i} className="qz-hist-dot"
                          title={`${h.date}: ${h.score}/${h.total}`}
                          style={{ background: h.passed ? 'var(--qz-green)' : 'var(--qz-red)', opacity: 0.5 + (i/history.length)*0.5 }}/>
                      ))}
                  </div>
              </div>
          )}

          {/* ── QUIZ PHASE ── */}
          {phase === 'quiz' && q && (
            <div className="qz-card" ref={cardRef}>
              {/* Progress */}
              <div className="qz-progress-wrap">
                <div className="qz-progress-bar">
                  <div className="qz-progress-fill" style={{ width:`${((qIdx + (selected !== null ? 1 : 0)) / questions.length) * 100}%` }}/>
                </div>
                <div className="qz-progress-text">
                  FILE {qIdx + 1} OF {questions.length}
                </div>
              </div>

              {/* Difficulty & Category Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
                  <div className="qz-cat-badge" style={{ color: catCfg.color, borderColor:`${catCfg.color}50`, background:`${catCfg.color}15`, margin: 0 }}>
                  {catCfg.label}
                  </div>

                  <div className="qz-diff" style={{ margin: 0 }}>
                  {[1,2,3].map(i => (
                      <div key={i} className="qz-diff-pip" style={{
                      background: i <= q.difficulty
                          ? q.difficulty === 1 ? 'var(--qz-green)' : q.difficulty === 2 ? 'var(--qz-gold)' : 'var(--qz-red)'
                          : 'rgba(255,255,255,0.1)'
                      }}/>
                  ))}
                  <span style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:10, color:'#64748b', letterSpacing:'.12em', marginLeft:6, textTransform:'uppercase' }}>
                      {q.difficulty === 1 ? 'BASIC' : q.difficulty === 2 ? 'ADVANCED' : 'CLASSIFIED'}
                  </span>
                  </div>
              </div>

              {/* Question */}
              <div className="qz-question">{q.question}</div>

              {/* Options */}
              <div className="qz-options">
                {q.options.map((opt, i) => {
                  let cls = 'qz-option';
                  if (selected !== null) {
                    if (i === q.answer)       cls += ' correct';
                    else if (i === selected)  cls += ' wrong';
                    else                      cls += ' reveal';
                    if (i === q.answer && i !== selected) cls += ' correct-reveal';
                  }
                  return (
                    <button key={i} className={cls} disabled={selected !== null} onClick={() => handleSelect(i)}>
                      <span className="qz-option-letter">{LETTERS[i]}</span>
                      <span style={{ flex: 1 }}>{opt}</span>
                      {selected !== null && i === q.answer && <span style={{ fontSize:20 }}>✓</span>}
                      {selected !== null && i === selected && i !== q.answer && <span style={{ fontSize:20 }}>✗</span>}
                    </button>
                  );
                })}
              </div>

              {/* Fact */}
              {selected !== null && (
                <div className="qz-fact">
                  <strong><span style={{marginRight: 6}}>📡</span> DECLASSIFIED INTEL:</strong><br/>{q.fact}
                </div>
              )}

              {/* Next */}
              {selected !== null && (
                <button className="qz-next-btn" onClick={handleNext}>
                  {qIdx + 1 >= questions.length ? 'VIEW BRIEFING RESULTS →' : 'NEXT FILE →'}
                </button>
              )}
            </div>
          )}

          {/* ── RESULT / DONE / BROKEN PHASES ── */}
          {phase !== 'quiz' && (
            <div className={`qz-screen ${phase === 'broken' ? 'broken' : ''}`}>
              {phase === 'broken' ? (
                  <div style={{ fontSize:72, marginBottom:16 }}>💀</div>
              ) : phase === 'done' ? (
                  <div style={{ fontSize:72, marginBottom:16 }}>🗓️</div>
              ) : (
                  <div className="qz-result-emoji">{scoreEmoji(score, questions.length)}</div>
              )}
              
              <div className="qz-result-title" style={{
                color: phase === 'broken' ? 'var(--qz-red)' 
                     : score === questions.length ? 'var(--qz-gold)'
                     : score >= 3 ? 'var(--qz-green)' : '#a5b4fc'
              }}>
                {phase === 'broken' ? 'STREAK BROKEN' : phase === 'done' ? 'BRIEFING COMPLETE' : scoreTitle(score, questions.length)}
              </div>
              
              <div className="qz-result-score">
                {score} / {questions.length} correct — {phase === 'broken' ? 'need 3+ to maintain streak' : `🔥 ${streak.current} day streak`}
              </div>

              {/* Stats grid */}
              <div className="qz-result-breakdown">
                <div className="qz-result-stat">
                  <div className="qz-result-stat-val" style={{ color: phase === 'broken' ? 'var(--qz-red)' : 'var(--qz-green)' }}>
                      {phase === 'broken' ? '0' : score}
                  </div>
                  <div className="qz-result-stat-lbl">{phase === 'broken' ? 'New Streak' : 'Correct'}</div>
                </div>
                <div className="qz-result-stat">
                  <div className="qz-result-stat-val" style={{ color: 'var(--qz-indigo)' }}>{streak.best}</div>
                  <div className="qz-result-stat-lbl">Best Streak</div>
                </div>
                <div className="qz-result-stat">
                  <div className="qz-result-stat-val" style={{ color: 'var(--qz-green)' }}>{history.filter(h=>h.passed).length}</div>
                  <div className="qz-result-stat-lbl">Days Won</div>
                </div>
                <div className="qz-result-stat">
                  <div className="qz-result-stat-val" style={{ color: 'var(--qz-gold)' }}>
                    {history.length ? Math.round(history.filter(h=>h.passed).length/history.length*100) : 0}%
                  </div>
                  <div className="qz-result-stat-lbl">Win Rate</div>
                </div>
              </div>

              {/* Answer review */}
              {answers.length > 0 && (
                  <div className="qz-review">
                  <div className="qz-review-title">Post-Operation Debrief</div>
                  {answers.map((a, i) => (
                      <div key={i} className="qz-review-item">
                      <span className="qz-review-icon" style={{ color: a.isRight ? 'var(--qz-green)' : 'var(--qz-red)', background: a.isRight ? 'rgba(0,230,118,0.1)' : 'rgba(255,59,59,0.1)' }}>
                          {a.isRight ? '✓' : '✗'}
                      </span>
                      <div style={{ flex: 1 }}>
                          <div className="qz-review-q">{questions[i]?.question}</div>
                          {!a.isRight && (
                          <div className="qz-review-a">
                              Your answer: <span style={{ color:'var(--qz-red)', fontWeight: 600 }}>{a.chosen}</span>
                              <span style={{ margin: '0 8px', color: '#64748b'}}>|</span>
                              Correct: <span style={{ color:'var(--qz-green)', fontWeight: 600 }}>{a.correct}</span>
                          </div>
                          )}
                      </div>
                      </div>
                  ))}
                  </div>
              )}

              {/* Actions */}
              <div className="qz-actions">
                <button className="qz-share-btn primary" onClick={handleShare}>
                  {copied ? '✓ COPIED TO CLIPBOARD' : '📤 SHARE INTEL REPORT'}
                </button>
                <a href="/" className="qz-share-btn">
                  🌍 RETURN TO MAP
                </a>
              </div>
              
              <div className="qz-countdown">
                Next briefing available in: {formatCountdown(countdown)}
              </div>
            </div>
          )}

          {/* Bottom Ad Placement */}
          {(phase === 'result' || phase === 'done' || phase === 'broken') && (
              <div className="qz-ad-wrapper">
                  <AdBanner id="ad-quiz-bottom" size="300x250" />
              </div>
          )}

        </main>

        {/* Right Ad Sidebar */}
        <aside className="qz-sidebar right">
          <div style={{ fontSize: 10, color: 'var(--qz-text-dim)', letterSpacing: '0.1em', marginBottom: 8, textTransform: 'uppercase' }}>Advertisement</div>
          <AdBanner id="ad-quiz-right-sidebar" size="160x600" />
        </aside>

      </div>
      <Footer />
    </div>
  );
}