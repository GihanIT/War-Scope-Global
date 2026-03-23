// src/components/IntensityChart.jsx
// Renders a GDELT coverage-volume sparkline inside the Timeline conflict cards.
// Drop into EpisodeTimeline in Timeline.jsx — call it after the key facts row.
//
// Usage:
//   import IntensityChart from '../components/IntensityChart.jsx';
//   <IntensityChart conflictId="ukraine" conflictName="Ukraine War" />
//
// conflictId must match one of the keys in conflictIntensityRoute.js:
//   ukraine, gaza, iran, lebanon, sudan, myanmar, yemen, syria,
//   somalia, drc, mali, burkina, iraq, afghanistan, pakistan, haiti,
//   colombia, nigeria

import { useState, useEffect, useRef } from 'react';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// ── CSS injected once ─────────────────────────────────────────────────────────
const CSS = `
.ic-wrap{margin-top:20px;padding:18px 0 0;border-top:1px solid rgba(0,212,255,0.12)}
.ic-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:8px}
.ic-title{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:600;letter-spacing:.18em;color:#00d4ff;text-transform:uppercase;display:flex;align-items:center;gap:8px}
.ic-title-dot{width:7px;height:7px;border-radius:50%;background:#00d4ff;box-shadow:0 0 8px #00d4ff;flex-shrink:0}
.ic-tabs{display:flex;gap:4px}
.ic-tab{background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.08);border-radius:3px;padding:4px 10px;cursor:pointer;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;letter-spacing:.1em;color:#4a5568;text-transform:uppercase;transition:all 150ms}
.ic-tab:hover{color:#8892a4;border-color:rgba(255,255,255,0.15)}
.ic-tab.on{background:rgba(0,212,255,0.1);border-color:rgba(0,212,255,0.35);color:#00d4ff}
.ic-stats{display:flex;gap:16px;flex-wrap:wrap;margin-bottom:14px}
.ic-stat{text-align:center}
.ic-stat-val{font-family:'IBM Plex Mono',monospace;font-size:16px;font-weight:700;line-height:1}
.ic-stat-lbl{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.12em;color:#4a5568;text-transform:uppercase;margin-top:3px}
.ic-trend-up{color:#ff3b3b}
.ic-trend-dn{color:#00e676}
.ic-trend-st{color:#ffaa00}
.ic-chart-area{position:relative;height:80px;margin-bottom:10px}
.ic-chart-svg{width:100%;height:80px;overflow:visible}
.ic-tooltip{position:absolute;background:rgba(4,6,14,.97);border:1px solid rgba(0,212,255,.25);border-radius:5px;padding:7px 10px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:#e8eaf0;pointer-events:none;white-space:nowrap;z-index:20;transform:translateX(-50%);transition:opacity 100ms}
.ic-axis{display:flex;justify-content:space-between;font-family:'IBM Plex Mono',monospace;font-size:9px;color:#4a5568;letter-spacing:.05em;margin-bottom:12px}
.ic-spikes{padding-top:10px;border-top:1px solid rgba(255,255,255,.05)}
.ic-spikes-title{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.15em;color:#ff9060;text-transform:uppercase;margin-bottom:7px}
.ic-spike-row{display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,.04)}
.ic-spike-row:last-child{border-bottom:none}
.ic-spike-date{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#8892a4;min-width:46px}
.ic-spike-bar-wrap{flex:1;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
.ic-spike-bar{height:100%;border-radius:3px}
.ic-spike-val{font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:700;min-width:32px;text-align:right}
.ic-loading{display:flex;align-items:center;gap:10px;padding:20px 0;font-family:'IBM Plex Mono',monospace;font-size:10px;color:#4a5568;letter-spacing:.12em}
.ic-spin{width:16px;height:16px;border:1.5px solid rgba(0,212,255,.1);border-top:1.5px solid #00d4ff;border-radius:50%;animation:ic-spin .8s linear infinite;flex-shrink:0}
@keyframes ic-spin{to{transform:rotate(360deg)}}
.ic-err{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#4a5568;letter-spacing:.1em;padding:12px 0}
.ic-source{font-family:'IBM Plex Mono',monospace;font-size:8px;color:#2d3748;letter-spacing:.08em;margin-top:4px}
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}

// ── Conflict ID map — Timeline.jsx uses location names, we map to API ids ─────
// Add more as needed. Case-insensitive match on conflict name words.
const NAME_TO_ID = {
  'ukraine':      'ukraine',
  'russia':       'ukraine',
  'gaza':         'gaza',
  'hamas':        'gaza',
  'iran':         'iran',
  'lebanon':      'lebanon',
  'hezbollah':    'lebanon',
  'sudan':        'sudan',
  'myanmar':      'myanmar',
  'burma':        'myanmar',
  'yemen':        'yemen',
  'houthi':       'yemen',
  'syria':        'syria',
  'somalia':      'somalia',
  'al-shabaab':   'somalia',
  'congo':        'drc',
  'drc':          'drc',
  'mali':         'mali',
  'sahel':        'mali',
  'burkina':      'burkina',
  'iraq':         'iraq',
  'afghanistan':  'afghanistan',
  'pakistan':     'pakistan',
  'haiti':        'haiti',
  'colombia':     'colombia',
  'nigeria':      'nigeria',
};

function resolveId(conflictId, conflictName) {
  if (conflictId) return conflictId;
  if (!conflictName) return null;
  const lower = conflictName.toLowerCase();
  for (const [key, id] of Object.entries(NAME_TO_ID)) {
    if (lower.includes(key)) return id;
  }
  return null;
}

// ── Chart rendering ───────────────────────────────────────────────────────────
function AreaChart({ data, color = '#00d4ff', spikeColor = '#ff3b3b' }) {
  const [tooltip, setTooltip] = useState(null);
  const svgRef = useRef(null);

  if (!data?.length) return null;

  const W = 1000; // viewBox width (unitless, responsive)
  const H = 80;
  const PAD = { t: 8, r: 4, b: 4, l: 4 };
  const cW = W - PAD.l - PAD.r;
  const cH = H - PAD.t - PAD.b;

  const vals   = data.map(d => d.value);
  const maxV   = Math.max(...vals) || 1;
  const minV   = Math.min(...vals);
  const range  = maxV - minV || 1;
  const mean   = vals.reduce((a,b)=>a+b,0) / vals.length;
  const std    = Math.sqrt(vals.reduce((a,b)=>a+(b-mean)**2,0)/vals.length);
  const spikeT = mean + 1.5 * std;

  const x = (i) => PAD.l + (i / (data.length - 1)) * cW;
  const y = (v) => PAD.t + cH - ((v - minV) / range) * cH;

  // Build SVG path
  const points = data.map((d, i) => `${x(i)},${y(d.value)}`);
  const linePath = `M ${points.join(' L ')}`;
  const areaPath = `M ${x(0)},${H} L ${points.join(' L ')} L ${x(data.length-1)},${H} Z`;

  const gradId = `ic-grad-${color.replace('#','')}`;

  // Mean line y position
  const meanY = y(mean);

  const handleMouseMove = (e) => {
    const svg  = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const px   = (e.clientX - rect.left) / rect.width * W;
    const idx  = Math.round(((px - PAD.l) / cW) * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    const d    = data[clamped];
    const isSpike = d.value > spikeT;
    setTooltip({
      x: (x(clamped) / W) * 100,
      y: y(d.value),
      label: d.label,
      value: d.value,
      isSpike,
    });
  };

  return (
    <div className="ic-chart-area">
      <svg
        ref={svgRef}
        className="ic-chart-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0.02"/>
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill={`url(#${gradId})`}/>

        {/* Mean reference line */}
        <line x1={PAD.l} y1={meanY} x2={W-PAD.r} y2={meanY}
          stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="4 4"/>

        {/* Spike threshold line */}
        <line x1={PAD.l} y1={y(spikeT)} x2={W-PAD.r} y2={y(spikeT)}
          stroke="rgba(255,100,0,0.2)" strokeWidth="1" strokeDasharray="3 5"/>

        {/* Area line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.8"
          vectorEffect="non-scaling-stroke"/>

        {/* Spike dots */}
        {data.map((d, i) => d.value > spikeT && (
          <circle key={i} cx={x(i)} cy={y(d.value)} r="3"
            fill={spikeColor} stroke="rgba(255,255,255,0.6)" strokeWidth="0.8"
            vectorEffect="non-scaling-stroke"/>
        ))}

        {/* Hover dot */}
        {tooltip && (
          <circle
            cx={x(data.findIndex(d => d.label === tooltip.label))}
            cy={tooltip.y}
            r="4" fill={tooltip.isSpike ? spikeColor : color}
            stroke="white" strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        )}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div className="ic-tooltip" style={{ left:`${tooltip.x}%`, top: -36, opacity: 1 }}>
          <span style={{ color:'#8892a4', marginRight:6 }}>{tooltip.label}</span>
          <span style={{ color: tooltip.isSpike ? '#ff9060' : '#00d4ff', fontWeight:700 }}>
            {tooltip.value.toFixed(4)}
          </span>
          {tooltip.isSpike && <span style={{ color:'#ff6040', marginLeft:6 }}>▲ SPIKE</span>}
        </div>
      )}
    </div>
  );
}

// ── Tone bar chart — vertical bars colored by severity ────────────────────────
function ToneChart({ data, toneColor }) {
  const [tooltip, setTooltip] = useState(null);
  if (!data?.length) return null;

  const vals   = data.map(d => d.value);
  const minV   = Math.min(...vals);  // most negative
  const maxV   = Math.max(...vals);  // least negative (closest to 0)
  const range  = Math.abs(minV - maxV) || 1;

  return (
    <div className="ic-chart-area" style={{ height:80 }}>
      <div style={{ display:'flex', alignItems:'flex-end', height:80, gap:2, position:'relative' }}
        onMouseLeave={() => setTooltip(null)}>
        {data.map((d, i) => {
          // Height proportional to how negative the tone is
          const severity = (d.value - maxV) / (minV - maxV); // 0 = calmest, 1 = worst
          const h        = Math.max(4, severity * 72);
          const color    = toneColor(d.value);
          return (
            <div key={i} style={{ flex:1, display:'flex', alignItems:'flex-end', height:80, cursor:'crosshair' }}
              onMouseEnter={() => setTooltip({ i, label: d.label, value: d.value, color })}>
              <div style={{
                width:'100%', height:h, borderRadius:'2px 2px 0 0',
                background: color, opacity: tooltip?.i === i ? 1 : 0.7,
                transition:'opacity 100ms, height 200ms',
                boxShadow: tooltip?.i === i ? `0 0 8px ${color}` : 'none',
              }}/>
            </div>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <div className="ic-tooltip" style={{
            left: `${(tooltip.i / (data.length-1)) * 100}%`,
            top: -40, opacity:1,
          }}>
            <span style={{ color:'#8892a4', marginRight:6 }}>{tooltip.label}</span>
            <span style={{ color: tooltip.color, fontWeight:700 }}>{tooltip.value.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function IntensityChart({ conflictId, conflictName }) {
  injectCSS('ic-css', CSS);

  const resolvedId = resolveId(conflictId, conflictName);

  const [volData,    setVolData]    = useState(null);
  const [toneData,   setToneData]   = useState(null);
  const [volLoading, setVolLoading] = useState(false);
  const [toneLoading,setToneLoading]= useState(false);
  const [volError,   setVolError]   = useState(null);
  const [toneError,  setToneError]  = useState(null);
  const [timespan,   setTimespan]   = useState('30d');
  const [loaded,     setLoaded]     = useState(false);
  const [activeTab,  setActiveTab]  = useState('volume'); // 'volume' | 'tone' | 'both'

  // Lazy load on first mount
  useEffect(() => { if (!loaded) setLoaded(true); }, []);

  // Fetch volume
  useEffect(() => {
    if (!resolvedId || !loaded) return;
    setVolLoading(true); setVolError(null);
    fetch(`${API}/api/conflict-intensity/${resolvedId}?timespan=${timespan}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setVolData(d); setVolLoading(false); })
      .catch(e => { setVolError(e.message); setVolLoading(false); });
  }, [resolvedId, timespan, loaded]);

  // Fetch tone — backend queue handles rate limiting, no frontend delay needed
  useEffect(() => {
    if (!resolvedId || !loaded) return;
    setToneLoading(true); setToneError(null);
    fetch(`${API}/api/conflict-intensity/${resolvedId}/tone?timespan=${timespan}`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setToneData(d); setToneLoading(false); })
      .catch(e => { setToneError(e.message); setToneLoading(false); });
  }, [resolvedId, timespan, loaded]);

  if (!resolvedId) return null;

  const volTrend  = volData?.stats?.trend;
  const toneTrend = toneData?.stats?.trend;

  const toneColor = (v) => {
    if (v < -4)  return '#ff3b3b';  // severe negative
    if (v < -3)  return '#ff6040';  // very negative
    if (v < -2)  return '#ffaa00';  // negative
    if (v < -1)  return '#f0b429';  // mild negative
    return '#00e676';               // near neutral
  };

  const trendLabel = (trend, type) => {
    if (type === 'tone') {
      if (trend === 'escalating')   return { icon:'▼', label:'ESCALATING',   cls:'ic-trend-up' };
      if (trend === 'deescalating') return { icon:'▲', label:'DE-ESCALATING', cls:'ic-trend-dn' };
      return { icon:'→', label:'STABLE', cls:'ic-trend-st' };
    }
    if (trend === 'rising')  return { icon:'▲', label:'RISING',  cls:'ic-trend-up' };
    if (trend === 'falling') return { icon:'▼', label:'FALLING', cls:'ic-trend-dn' };
    return { icon:'→', label:'STABLE', cls:'ic-trend-st' };
  };

  const firstLabel = volData?.data?.[0]?.label ?? '';
  const lastLabel  = volData?.data?.[volData.data.length-1]?.label ?? '';

  return (
    <div className="ic-wrap" onClick={e => e.stopPropagation()}>
      {/* Header row */}
      <div className="ic-head">
        <div className="ic-title">
          <span className="ic-title-dot"/>
          GDELT INTELLIGENCE · MEDIA ANALYSIS
        </div>
        <div className="ic-tabs">
          {['7d','14d','30d','60d'].map(t => (
            <button key={t} className={`ic-tab${timespan===t?' on':''}`}
              onClick={e => { e.stopPropagation(); setTimespan(t); }}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* View switcher */}
      <div style={{ display:'flex', gap:4, marginBottom:14 }}>
        {[
          { id:'volume', label:'📈 COVERAGE VOLUME' },
          { id:'tone',   label:'🌡 TONE TRACKER' },
          { id:'both',   label:'⚡ COMBINED' },
        ].map(t => (
          <button key={t.id}
            onClick={e => { e.stopPropagation(); setActiveTab(t.id); }}
            style={{
              padding:'5px 12px', borderRadius:3, cursor:'pointer', transition:'all 150ms',
              fontFamily:'IBM Plex Mono,monospace', fontSize:9, fontWeight:600,
              letterSpacing:'.1em', textTransform:'uppercase', border:'1px solid',
              borderColor: activeTab===t.id ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.08)',
              background:  activeTab===t.id ? 'rgba(0,212,255,0.1)' : 'transparent',
              color:       activeTab===t.id ? '#00d4ff' : '#4a5568',
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── VOLUME PANEL ── */}
      {(activeTab === 'volume' || activeTab === 'both') && (
        <div style={{ marginBottom: activeTab === 'both' ? 20 : 0 }}>
          {activeTab === 'both' && (
            <div style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:9, letterSpacing:'.18em', color:'#00d4ff', textTransform:'uppercase', marginBottom:8, opacity:.7 }}>
              ▸ COVERAGE VOLUME
            </div>
          )}

          {volLoading && <div className="ic-loading"><div className="ic-spin"/>FETCHING COVERAGE DATA...</div>}
          {volError   && <div className="ic-err">[ COVERAGE UNAVAILABLE — {volError.toUpperCase()} ]</div>}

          {!volLoading && !volError && volData?.data?.length > 0 && (() => {
            const vt = trendLabel(volTrend, 'volume');
            return (
              <>
                <div className="ic-stats">
                  {[
                    { label:'CURRENT', val: volData.stats.last?.toFixed(3),  color:'#00d4ff' },
                    { label:'PEAK',    val: volData.stats.max?.toFixed(3),   color:'#ff6040' },
                    { label:'AVG',     val: volData.stats.avg?.toFixed(3),   color:'#ffaa00' },
                    { label:'TREND',   val: `${vt.icon} ${vt.label}`, extraClass: vt.cls },
                  ].map(s => (
                    <div key={s.label} className="ic-stat">
                      <div className={`ic-stat-val ${s.extraClass??''}`} style={s.color?{color:s.color}:{}}>{s.val}</div>
                      <div className="ic-stat-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>
                <AreaChart data={volData.data} color="#00d4ff" spikeColor="#ff3b3b"/>
                <div className="ic-axis">
                  <span>{firstLabel}</span>
                  <span style={{ color:'rgba(160,175,200,0.25)' }}>% of global news · spikes = major events</span>
                  <span>{lastLabel}</span>
                </div>
                {volData.spikes?.length > 0 && (
                  <div className="ic-spikes">
                    <div className="ic-spikes-title">⚡ TOP COVERAGE SPIKES</div>
                    {volData.spikes.map((s,i) => {
                      const pct = Math.round((s.value / (volData.stats.max||1)) * 100);
                      return (
                        <div key={i} className="ic-spike-row">
                          <span className="ic-spike-date">{s.date}</span>
                          <div className="ic-spike-bar-wrap">
                            <div className="ic-spike-bar" style={{ width:`${pct}%`, background: pct>80?'#ff3b3b':pct>50?'#ff6040':'#ff9060' }}/>
                          </div>
                          <span className="ic-spike-val" style={{ color: pct>80?'#ff3b3b':pct>50?'#ff9060':'#ffaa00' }}>{s.value.toFixed(3)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ── TONE PANEL ── */}
      {(activeTab === 'tone' || activeTab === 'both') && (
        <div>
          {activeTab === 'both' && (
            <div style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:9, letterSpacing:'.18em', color:'#ff9060', textTransform:'uppercase', marginBottom:8, opacity:.7 }}>
              ▸ TONE TRACKER
            </div>
          )}

          {toneLoading && (
            <div className="ic-loading">
              <div className="ic-spin" style={{ borderTopColor:'#ff9060' }}/>
              {activeTab === 'volume' ? 'FETCHING TONE DATA...' : 'ANALYZING SENTIMENT...'}
            </div>
          )}
          {toneError && <div className="ic-err">[ TONE UNAVAILABLE — {toneError.toUpperCase()} ]</div>}

          {!toneLoading && !toneError && toneData?.data?.length > 0 && (() => {
            const tt     = trendLabel(toneTrend, 'tone');
            const lastT  = toneData.stats.last;
            const tColor = toneColor(lastT);
            const toneFirst = toneData.data[0]?.label ?? '';
            const toneLast  = toneData.data[toneData.data.length-1]?.label ?? '';

            return (
              <>
                {/* Tone explanation */}
                <div style={{ fontFamily:'IBM Plex Mono,monospace', fontSize:9, color:'#4a5568', letterSpacing:'.08em', marginBottom:10, lineHeight:1.6 }}>
                  GDELT TONE SCALE: -10 (EXTREME NEGATIVE) → 0 (NEUTRAL) → +10 (POSITIVE)
                  · WAR COVERAGE TYPICALLY -1 TO -5 · SHARP DROPS = ESCALATION SIGNAL
                </div>

                <div className="ic-stats">
                  {[
                    { label:'CURRENT TONE', val: lastT?.toFixed(2),              color: tColor },
                    { label:'WORST DAY',    val: toneData.stats.min?.toFixed(2), color:'#ff3b3b' },
                    { label:'BEST DAY',     val: toneData.stats.max?.toFixed(2), color:'#00e676' },
                    { label:'SIGNAL',       val: `${tt.icon} ${tt.label}`,       extraClass: tt.cls },
                  ].map(s => (
                    <div key={s.label} className="ic-stat">
                      <div className={`ic-stat-val ${s.extraClass??''}`} style={s.color?{color:s.color}:{}}>{s.val}</div>
                      <div className="ic-stat-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tone chart — inverted scale (more negative = higher alert) */}
                <ToneChart data={toneData.data} toneColor={toneColor}/>

                <div className="ic-axis">
                  <span>{toneFirst}</span>
                  <span style={{ color:'rgba(160,175,200,0.25)' }}>lower = more negative coverage</span>
                  <span>{toneLast}</span>
                </div>

                {/* Escalation dips */}
                {toneData.dips?.length > 0 && (
                  <div className="ic-spikes">
                    <div className="ic-spikes-title" style={{ color:'#ff6040' }}>📉 ESCALATION SIGNALS — MOST NEGATIVE DAYS</div>
                    {toneData.dips.map((d,i) => {
                      // Normalize: most negative gets widest bar
                      const minTone = toneData.stats.min;
                      const pct = Math.round((d.value / minTone) * 100);
                      return (
                        <div key={i} className="ic-spike-row">
                          <span className="ic-spike-date">{d.date}</span>
                          <div className="ic-spike-bar-wrap">
                            <div className="ic-spike-bar" style={{ width:`${pct}%`, background: pct>80?'#ff3b3b':pct>60?'#ff6040':'#ff9060' }}/>
                          </div>
                          <span className="ic-spike-val" style={{ color: pct>80?'#ff3b3b':pct>60?'#ff9060':'#ffaa00' }}>{d.value.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}

          {!toneLoading && !toneError && !toneData?.data?.length && (
            <div className="ic-err">[ NO TONE DATA FOR THIS CONFLICT IN SELECTED PERIOD ]</div>
          )}
        </div>
      )}

      <div className="ic-source">
        SOURCE: GDELT PROJECT — VOLUME = % OF ALL GLOBAL NEWS · TONE = AVG SENTIMENT SCORE · UPDATED EVERY 3 HOURS
      </div>
    </div>
  );
}