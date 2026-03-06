import { useEffect, useState, useRef, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

// ─── CSS variables injected once ─────────────────────────────────────────────
const CSS_VARS = `
  :root {
    --bg-panel:      #0f1117;
    --border:        #1e2433;
    --accent:        #00d4ff;
    --danger:        #ff3b3b;
    --nuclear:       #ffaa00;
    --text-primary:  #e8eaf0;
    --text-secondary:#8892a4;
  }
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.8; }
  }
  @keyframes slide-in {
    from { transform: translateX(100%); }
    to   { transform: translateX(0);    }
  }
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0);   }
  }
  .cp-skeleton {
    background: var(--border);
    border-radius: 4px;
    animation: skeleton-pulse 1.4s ease-in-out infinite;
  }
  .cp-panel {
    animation: slide-in 300ms ease forwards;
  }
  .cp-section {
    animation: fade-in 350ms ease both;
  }
  .cp-news-link:hover { color: var(--accent) !important; }
  .cp-close-btn:hover { color: var(--text-primary) !important; background: rgba(255,59,59,0.12) !important; }
  .cp-retry-btn:hover { background: rgba(0,212,255,0.15) !important; }
  /* Scrollbar */
  .cp-scroll::-webkit-scrollbar       { width: 4px; }
  .cp-scroll::-webkit-scrollbar-track { background: transparent; }
  .cp-scroll::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
  .cp-scroll::-webkit-scrollbar-thumb:hover { background: var(--accent); }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

function formatBudget(usd) {
  if (!usd || usd === 0) return '—';
  const n = Number(usd);
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(0)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(0)}M`;
  return `$${(n / 1e3).toFixed(0)}K`;
}

function fmt(n) {
  return n ? Number(n).toLocaleString() : '0';
}

function fmtDate(str) {
  if (!str) return '';
  const d = new Date(str.replace(/(\d{8})/, '$1').replace(/^(\d{4})(\d{2})(\d{2})/, '$1-$2-$3'));
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function apiFetch(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SkeletonBlock({ w = '100%', h = 14, mb = 10 }) {
  return (
    <div className="cp-skeleton"
      style={{ width: w, height: h, marginBottom: mb }} />
  );
}

function SkeletonPanel() {
  return (
    <div style={{ padding: '20px 18px' }}>
      <SkeletonBlock h={20} w="60%" mb={24} />
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
          <SkeletonBlock w="45%" h={12} mb={0} />
          <SkeletonBlock w="30%" h={12} mb={0} />
        </div>
      ))}
      <SkeletonBlock h={140} mb={20} />
      <SkeletonBlock h={12} w="40%" mb={12} />
      {[...Array(5)].map((_, i) => (
        <SkeletonBlock key={i} h={10} w={`${70 + (i * 5) % 25}%`} mb={10} />
      ))}
    </div>
  );
}

function StatRow({ emoji, label, value, valueStyle }) {
  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '9px 0',
      borderBottom:   '1px solid rgba(30,36,51,0.6)',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14, width: 20, textAlign: 'center' }}>{emoji}</span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '0.04em' }}>
          {label}
        </span>
      </span>
      <span style={{
        fontSize:    13,
        fontFamily:  'monospace',
        fontWeight:  600,
        color:       'var(--text-primary)',
        ...valueStyle,
      }}>
        {value}
      </span>
    </div>
  );
}

function SectionHeader({ children, delay = 0 }) {
  return (
    <div style={{
      fontSize:      10,
      fontFamily:    'monospace',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color:         'var(--accent)',
      opacity:       0.8,
      marginBottom:  12,
      marginTop:     24,
      paddingBottom: 6,
      borderBottom:  '1px solid rgba(0,212,255,0.15)',
      animationDelay: `${delay}ms`,
    }}
      className="cp-section"
    >
      {children}
    </div>
  );
}

// Custom tooltip for Recharts
function CompareTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:   'rgba(10,12,20,0.97)',
      border:       '1px solid var(--border)',
      borderRadius: 4,
      padding:      '8px 12px',
      fontSize:     11,
      fontFamily:   'monospace',
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }}>
          {p.name}: {Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CountryPanel({ iso3, iso2, countryName, onClose }) {
  const [military,   setMilitary]   = useState(null);
  const [conflicts,  setConflicts]  = useState([]);
  const [news,       setNews]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [retryKey,   setRetryKey]   = useState(0);
  const styleInjected = useRef(false);

  // Inject CSS once into document head
  if (!styleInjected.current) {
    const el = document.getElementById('cp-styles');
    if (!el) {
      const style = document.createElement('style');
      style.id = 'cp-styles';
      style.textContent = CSS_VARS;
      document.head.appendChild(style);
    }
    styleInjected.current = true;
  }

  const load = useCallback(async () => {
    if (!iso3) return;
    setLoading(true);
    setError(null);

    try {
      const [milData, conflictData, newsData] = await Promise.allSettled([
        apiFetch(`${API}/api/countries/${iso3}/military`),
        apiFetch(`${API}/api/conflicts/${iso3}`),
        apiFetch(`${API}/api/news/${encodeURIComponent(countryName)}`),
      ]);

      if (milData.status === 'fulfilled')      setMilitary(milData.value);
      if (conflictData.status === 'fulfilled') setConflicts(conflictData.value ?? []);
      if (newsData.status === 'fulfilled')     setNews(newsData.value?.articles ?? []);

      // If the primary data (military) failed, surface an error
      if (milData.status === 'rejected') throw milData.reason;

    } catch (err) {
      setError(err.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [iso3, countryName, retryKey]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const s  = military?.stats       ?? {};
  const avg = military?.worldAverages ?? {};

  const activeConflicts = conflicts.filter((c) => c.is_active);

  // Chart data
  const chartData = [
    {
      name:    'Personnel',
      country: Math.round((s.active_personnel ?? 0) / 1000),
      avg:     Math.round((avg.active_personnel ?? 0) / 1000),
      unit:    'K',
    },
    {
      name:    'Tanks',
      country: s.tanks ?? 0,
      avg:     avg.tanks ?? 0,
      unit:    '',
    },
    {
      name:    'Aircraft',
      country: s.total_military_aircraft ?? 0,
      avg:     avg.total_military_aircraft ?? 0,
      unit:    '',
    },
    {
      name:    'Naval',
      country: s.total_naval_fleet ?? 0,
      avg:     avg.total_naval_fleet ?? 0,
      unit:    '',
    },
  ];

  // ── Panel shell ─────────────────────────────────────────────────────────────
  const panelStyle = {
    position:        'fixed',
    top:             0,
    right:           0,
    width:           'min(380px, 100vw)',
    height:          '100vh',
    background:      'var(--bg-panel)',
    borderLeft:      '1px solid var(--border)',
    display:         'flex',
    flexDirection:   'column',
    zIndex:          1000,
    boxShadow:       '-8px 0 40px rgba(0,0,0,0.6)',
    fontFamily:      "'IBM Plex Sans', system-ui, sans-serif",
  };

  return (
    <div className="cp-panel" style={panelStyle}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        padding:        '18px 18px 14px',
        borderBottom:   '1px solid var(--border)',
        background:     'rgba(255,255,255,0.02)',
        flexShrink:     0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Flag */}
            {iso2 && (
              <img
                src={`https://flagcdn.com/w80/${iso2.toLowerCase()}.png`}
                alt={countryName}
                style={{
                  width:        48,
                  height:       32,
                  objectFit:    'cover',
                  borderRadius: 3,
                  border:       '1px solid var(--border)',
                  flexShrink:   0,
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div>
              <div style={{
                fontSize:    20,
                fontWeight:  700,
                color:       'var(--text-primary)',
                lineHeight:  1.2,
                letterSpacing: '-0.01em',
              }}>
                {countryName}
              </div>
              {military?.country?.iso3 && (
                <div style={{
                  fontSize:    10,
                  fontFamily:  'monospace',
                  color:       'var(--text-secondary)',
                  letterSpacing: '0.1em',
                  marginTop:   2,
                }}>
                  {military.country.iso3}
                </div>
              )}
            </div>
          </div>

          {/* Rank badge + close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {s.id != null && military?.country && (
              <div style={{
                fontSize:     10,
                fontFamily:   'monospace',
                color:        'var(--accent)',
                border:       '1px solid var(--accent)',
                borderRadius: 3,
                padding:      '3px 7px',
                letterSpacing: '0.06em',
                whiteSpace:   'nowrap',
              }}>
                {/* rank comes from countries table; we'll show iso3 as fallback */}
                GFP #{military.country.rank ?? '—'}
              </div>
            )}
            <button
              className="cp-close-btn"
              onClick={onClose}
              style={{
                background:   'transparent',
                border:       '1px solid var(--border)',
                color:        'var(--text-secondary)',
                cursor:       'pointer',
                borderRadius: 4,
                width:        28,
                height:       28,
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                fontSize:     16,
                lineHeight:   1,
                transition:   'all 160ms',
                flexShrink:   0,
              }}
              aria-label="Close panel"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* ── Scrollable body ─────────────────────────────────────────────── */}
      <div className="cp-scroll" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>

        {loading ? (
          <SkeletonPanel />
        ) : error ? (
          <div style={{ padding: 24, textAlign: 'center' }}>
            <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
              ⚠ {error}
            </div>
            <button
              className="cp-retry-btn"
              onClick={() => setRetryKey((k) => k + 1)}
              style={{
                background:   'transparent',
                border:       '1px solid var(--accent)',
                color:        'var(--accent)',
                cursor:       'pointer',
                borderRadius: 4,
                padding:      '7px 18px',
                fontSize:     12,
                fontFamily:   'monospace',
                letterSpacing: '0.06em',
                transition:   'background 160ms',
              }}
            >
              ↺ RETRY
            </button>
          </div>
        ) : (
          <div style={{ padding: '4px 18px 24px' }}>

            {/* ── Military stats ─────────────────────────────────────── */}
            <SectionHeader delay={0}>Military Strength</SectionHeader>

            <StatRow emoji="👥" label="Active Personnel"   value={fmt(s.active_personnel)} />
            <StatRow emoji="🪖" label="Reserve Personnel"  value={fmt(s.reserve_personnel)} />
            <StatRow emoji="🚗" label="Tanks"              value={fmt(s.tanks)} />
            <StatRow emoji="✈️"  label="Total Aircraft"    value={fmt(s.total_military_aircraft)} />
            <StatRow emoji="⚔️"  label="Fighter Aircraft"  value={fmt(s.fighter_aircraft)} />
            <StatRow emoji="🚁" label="Attack Helicopters" value={fmt(s.attack_helicopters)} />
            <StatRow emoji="🚢" label="Naval Fleet"        value={fmt(s.total_naval_fleet)} />
            <StatRow
              emoji="💰"
              label="Defense Budget"
              value={formatBudget(s.defense_budget_usd)}
              valueStyle={{ color: 'var(--accent)' }}
            />
            <StatRow
              emoji="☢️"
              label="Nuclear Weapons"
              value={
                (s.nuclear_weapons ?? 0) > 0
                  ? `⚠ ${Number(s.nuclear_weapons).toLocaleString()}`
                  : 'None'
              }
              valueStyle={{
                color: (s.nuclear_weapons ?? 0) > 0
                  ? 'var(--nuclear)'
                  : 'var(--text-secondary)',
              }}
            />

            {/* ── Comparison chart ───────────────────────────────────── */}
            <SectionHeader delay={60}>vs. World Average</SectionHeader>

            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
                barCategoryGap="28%"
              >
                <XAxis
                  type="number"
                  tick={{ fill: '#8892a4', fontSize: 9, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#1e2433' }}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={62}
                  tick={{ fill: '#8892a4', fontSize: 9, fontFamily: 'monospace' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CompareTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Bar dataKey="country" name={countryName} radius={[0, 2, 2, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="var(--accent)" fillOpacity={0.85} />
                  ))}
                </Bar>
                <Bar dataKey="avg" name="World Avg" radius={[0, 2, 2, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="#2a3555" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* ── Active conflicts ───────────────────────────────────── */}
            <SectionHeader delay={100}>Active Conflicts</SectionHeader>

            {activeConflicts.length === 0 ? (
              <div style={{
                fontSize:  12,
                color:     'var(--text-secondary)',
                fontStyle: 'italic',
                padding:   '4px 0 8px',
              }}>
                No active conflicts recorded
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeConflicts.slice(0, 8).map((c) => (
                  <div key={c.id} style={{
                    display:    'flex',
                    alignItems: 'flex-start',
                    gap:        10,
                    padding:    '8px 10px',
                    background: 'rgba(255,59,59,0.05)',
                    border:     '1px solid rgba(255,59,59,0.15)',
                    borderRadius: 4,
                  }}>
                    <div style={{
                      width:        7,
                      height:       7,
                      borderRadius: '50%',
                      background:   'var(--danger)',
                      marginTop:    4,
                      flexShrink:   0,
                      boxShadow:    '0 0 6px var(--danger)',
                    }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize:     12,
                        fontWeight:   600,
                        color:        'var(--text-primary)',
                        lineHeight:   1.3,
                        marginBottom: 2,
                      }}>
                        {c.conflict_name ?? c.location}
                      </div>
                      <div style={{
                        fontSize:  10,
                        fontFamily: 'monospace',
                        color:     'var(--text-secondary)',
                        display:   'flex',
                        gap:       8,
                      }}>
                        {c.start_year && <span>Since {c.start_year}</span>}
                        {c.intensity_level && (
                          <span style={{ color: 'var(--danger)', opacity: 0.8 }}>
                            INT-{c.intensity_level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── News ──────────────────────────────────────────────── */}
            <SectionHeader delay={140}>Latest Intelligence</SectionHeader>

            {news.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                No recent intelligence available
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {news.slice(0, 5).map((article, i) => (
                  <div key={i} style={{
                    padding:      '10px 0',
                    borderBottom: '1px solid rgba(30,36,51,0.5)',
                  }}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cp-news-link"
                      style={{
                        fontSize:       12,
                        fontWeight:     500,
                        color:          'var(--text-primary)',
                        textDecoration: 'none',
                        lineHeight:     1.4,
                        display:        'block',
                        marginBottom:   5,
                        transition:     'color 150ms',
                      }}
                    >
                      {article.title}
                    </a>
                    <div style={{
                      display:    'flex',
                      gap:        8,
                      fontSize:   10,
                      fontFamily: 'monospace',
                      color:      'var(--text-secondary)',
                    }}>
                      {article.source && (
                        <span style={{
                          color:        'var(--accent)',
                          opacity:      0.7,
                          maxWidth:     120,
                          overflow:     'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace:   'nowrap',
                        }}>
                          {article.source}
                        </span>
                      )}
                      {article.seendate && (
                        <span>{fmtDate(article.seendate)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Ad placeholder ──────────────────────────────────── */}
            <div style={{
              width:          '300px',
              height:         '250px',
              border:         '1px dashed #1e2433',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          '#8892a4',
              fontSize:       '12px',
              margin:         '16px auto',
              borderRadius:   4,
              fontFamily:     'monospace',
              letterSpacing:  '0.06em',
            }}>
              Ad 300×250
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
