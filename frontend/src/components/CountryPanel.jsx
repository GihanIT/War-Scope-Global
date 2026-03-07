import { useEffect, useState, useRef, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Personnel: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Target: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  Plane: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2 .5-3.5 1.5L14.5 9 6.3 7.2C5.8 7 5.4 7.2 5.2 7.6L4 10l6 4-4 4-2.8-.9L2 14l3.5 3.5c.4.4.4 1 0 1.4L4.1 20.3c-.4.4-1 .4-1.4 0L1.3 18.9c-.4-.4-.4-1 0-1.4l3.5-3.5 1.1-1.2.9 2.8-4-4-2.4 1.2c-.4.2-.6.6-.5 1.1l1.8 8.2z"/></svg>
  ),
  Fighter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/></svg>
  ),
  Helicopter: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
  ),
  Anchor: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="22" x2="12" y2="8"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>
  ),
  Dollar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Nuclear: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .11 1.89l1.8 2.6a4.8 4.8 0 0 0 .8-1.5z"/><path d="M15 19.4a1.65 1.65 0 0 0 1.89.11l2.6 1.8a4.8 4.8 0 0 0-1.5.8z"/><path d="M12 21a1.65 1.65 0 0 0-1.65-1.65H8.5a4.8 4.8 0 0 0 0 3h1.85A1.65 1.65 0 0 0 12 21z"/><path d="M4.6 15a1.65 1.65 0 0 1-.11 1.89l-1.8 2.6a4.8 4.8 0 0 1-.8-1.5z"/><path d="M9 19.4a1.65 1.65 0 0 1-1.89.11l-2.6 1.8a4.8 4.8 0 0 1 1.5.8z"/><path d="M12 3a1.65 1.65 0 0 1 1.65 1.65h1.85a4.8 4.8 0 0 1 0-3h-1.85A1.65 1.65 0 0 1 12 3z"/><path d="M15 4.6a1.65 1.65 0 0 1-1.89-.11l-2.6-1.8a4.8 4.8 0 0 1 1.5-.8z"/><path d="M19.4 9a1.65 1.65 0 0 1-.11-1.89l1.8-2.6a4.8 4.8 0 0 1 .8 1.5z"/><path d="M4.6 9a1.65 1.65 0 0 0 .11-1.89l-1.8-2.6a4.8 4.8 0 0 0-.8 1.5z"/><path d="M9 4.6a1.65 1.65 0 0 0 1.89-.11l2.6-1.8a4.8 4.8 0 0 0-1.5-.8z"/></svg>
  ),
};

// ─── CSS variables injected once ─────────────────────────────────────────────
const CSS_VARS = `
  :root {
    --bg-panel:      rgba(10, 12, 20, 0.75);
    --border:        rgba(0, 212, 255, 0.15);
    --border-dim:    rgba(30, 36, 51, 0.5);
    --accent:        #00d4ff;
    --danger:        #ff3b3b;
    --nuclear:       #ffaa00;
    --text-primary:  #e8eaf0;
    --text-secondary:#8892a4;
  }
  @keyframes skeleton-pulse {
    0%, 100% { opacity: 0.3; }
    50%      { opacity: 0.6; }
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
    background: var(--border-dim);
    border-radius: 4px;
    animation: skeleton-pulse 1.4s ease-in-out infinite;
  }
  .cp-panel {
    animation: slide-in 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
  }
  .cp-section {
    animation: fade-in 350ms ease both;
  }
  .cp-news-link:hover { color: var(--accent) !important; text-shadow: 0 0 8px rgba(0,212,255,0.4); }
  .cp-close-btn:hover { color: var(--text-primary) !important; background: rgba(255,59,59,0.15) !important; border-color: var(--danger) !important; }
  .cp-retry-btn:hover { background: rgba(0,212,255,0.15) !important; box-shadow: 0 0 12px rgba(0,212,255,0.2); }
  
  /* Tactical Scrollbar */
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

function StatRow({ icon: Icon, label, value, valueStyle }) {
  return (
    <div style={{
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      padding:        '10px 0',
      borderBottom:   '1px solid var(--border-dim)',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center', opacity: 0.8 }}>
          <Icon />
        </span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
          {label}
        </span>
      </span>
      <span style={{
        fontSize:    14,
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
      fontSize:      11,
      fontFamily:    'monospace',
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color:         'var(--accent)',
      opacity:       0.9,
      marginBottom:  16,
      marginTop:     28,
      paddingBottom: 6,
      borderBottom:  '1px solid var(--border)',
      animationDelay: `${delay}ms`,
      display:       'flex',
      alignItems:    'center',
      gap:           8,
    }}
      className="cp-section"
    >
      <div style={{ width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 6px var(--accent)' }} />
      {children}
    </div>
  );
}

function CompareTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background:   'rgba(5, 7, 12, 0.95)',
      border:       '1px solid var(--accent)',
      borderRadius: 4,
      padding:      '8px 12px',
      fontSize:     11,
      fontFamily:   'monospace',
      boxShadow:    '0 4px 12px rgba(0,0,0,0.5)',
    }}>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 6, borderBottom: '1px solid rgba(0,212,255,0.2)', paddingBottom: 4 }}>
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, margin: '2px 0' }}>
          {p.name}: {Number(p.value).toLocaleString()}
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CountryPanel({ iso3, iso2, countryName, onClose, showHistorical }) {
  const [military,   setMilitary]   = useState(null);
  const [conflicts,  setConflicts]  = useState([]);
  const [news,       setNews]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [retryKey,   setRetryKey]   = useState(0);
  const styleInjected = useRef(false);

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

      if (milData.status === 'rejected') throw milData.reason;

    } catch (err) {
      setError(err.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [iso3, countryName, retryKey]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const s  = military?.stats       ?? {};
  const avg = military?.worldAverages ?? {};
  
  // ── NEW SYNCED FILTER ──
  // If we are in historical mode, show all conflicts. Otherwise, filter active only.
  const visibleConflicts = showHistorical 
    ? conflicts 
    : conflicts.filter((c) => c.is_active);

  const chartData = [
    { name: 'Personnel', country: Math.round((s.active_personnel ?? 0) / 1000), avg: Math.round((avg.active_personnel ?? 0) / 1000) },
    { name: 'Tanks',     country: s.tanks ?? 0, avg: avg.tanks ?? 0 },
    { name: 'Aircraft',  country: s.total_military_aircraft ?? 0, avg: avg.total_military_aircraft ?? 0 },
    { name: 'Naval',     country: s.total_naval_fleet ?? 0, avg: avg.total_naval_fleet ?? 0 },
  ];

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
    boxShadow:       '-10px 0 40px rgba(0,0,0,0.8)',
    fontFamily:      "'Barlow', system-ui, sans-serif",
  };

  return (
    <div className="cp-panel" style={panelStyle}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        padding:        '20px 18px 16px',
        borderBottom:   '1px solid var(--border)',
        background:     'rgba(0, 212, 255, 0.03)',
        flexShrink:     0,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {iso2 && (
              <img
                src={`https://flagcdn.com/w80/${iso2.toLowerCase()}.png`}
                alt={countryName}
                style={{
                  width:        52,
                  height:       36,
                  objectFit:    'cover',
                  borderRadius: 4,
                  border:       '1px solid rgba(255,255,255,0.1)',
                  flexShrink:   0,
                  boxShadow:    '0 2px 10px rgba(0,0,0,0.5)',
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div>
              <div style={{
                fontSize:    24,
                fontWeight:  700,
                color:       'var(--text-primary)',
                lineHeight:  1.1,
                letterSpacing: '0.02em',
              }}>
                {countryName}
              </div>
              {military?.country?.iso3 && (
                <div style={{
                  fontSize:    11,
                  fontFamily:  'monospace',
                  color:       'var(--accent)',
                  letterSpacing: '0.12em',
                  marginTop:   4,
                }}>
                  ISO-3: {military.country.iso3}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {s.id != null && military?.country && (
              <div style={{
                fontSize:     11,
                fontFamily:   'monospace',
                color:        'var(--accent)',
                background:   'rgba(0, 212, 255, 0.1)',
                border:       '1px solid var(--border)',
                borderRadius: 4,
                padding:      '4px 8px',
                letterSpacing: '0.08em',
                whiteSpace:   'nowrap',
              }}>
                GFP #{military.country.rank ?? '—'}
              </div>
            )}
            <button
              className="cp-close-btn"
              onClick={onClose}
              style={{
                background:   'rgba(255,255,255,0.05)',
                border:       '1px solid var(--border-dim)',
                color:        'var(--text-secondary)',
                cursor:       'pointer',
                borderRadius: 4,
                width:        30,
                height:       30,
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                fontSize:     18,
                transition:   'all 200ms ease',
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
          <div style={{ padding: 30, textAlign: 'center' }}>
            <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 20, fontFamily: 'monospace' }}>
              [ ERR: DATA_RETRIEVAL_FAILED ]<br/>{error}
            </div>
            <button
              className="cp-retry-btn"
              onClick={() => setRetryKey((k) => k + 1)}
              style={{
                background:   'rgba(0,212,255,0.05)',
                border:       '1px solid var(--accent)',
                color:        'var(--accent)',
                cursor:       'pointer',
                borderRadius: 4,
                padding:      '8px 20px',
                fontSize:     12,
                fontFamily:   'monospace',
                letterSpacing: '0.1em',
                transition:   'all 200ms ease',
              }}
            >
              REINITIALIZE LINK
            </button>
          </div>
        ) : (
          <div style={{ padding: '0 18px 30px' }}>

            {/* ── Military stats ─────────────────────────────────────── */}
            <SectionHeader delay={0}>Military Strength</SectionHeader>

            <StatRow icon={Icons.Personnel} label="Active Personnel"   value={fmt(s.active_personnel)} />
            <StatRow icon={Icons.Shield}    label="Reserve Personnel"  value={fmt(s.reserve_personnel)} />
            <StatRow icon={Icons.Target}    label="Armored Vehicles"   value={fmt(s.tanks)} />
            <StatRow icon={Icons.Plane}     label="Total Aircraft"     value={fmt(s.total_military_aircraft)} />
            <StatRow icon={Icons.Fighter}   label="Fighter Aircraft"   value={fmt(s.fighter_aircraft)} />
            <StatRow icon={Icons.Helicopter}label="Attack Helicopters" value={fmt(s.attack_helicopters)} />
            <StatRow icon={Icons.Anchor}    label="Naval Fleet"        value={fmt(s.total_naval_fleet)} />
            <StatRow
              icon={Icons.Dollar}
              label="Defense Budget"
              value={formatBudget(s.defense_budget_usd)}
              valueStyle={{ color: 'var(--accent)' }}
            />
            <StatRow
              icon={Icons.Nuclear}
              label="Nuclear Warheads"
              value={
                (s.nuclear_weapons ?? 0) > 0
                  ? `DETECTED: ${Number(s.nuclear_weapons).toLocaleString()}`
                  : 'NONE DETECTED'
              }
              valueStyle={{
                color: (s.nuclear_weapons ?? 0) > 0
                  ? 'var(--nuclear)'
                  : 'var(--text-secondary)',
                textShadow: (s.nuclear_weapons ?? 0) > 0 ? '0 0 8px rgba(255,170,0,0.5)' : 'none'
              }}
            />

            {/* ── Comparison chart ───────────────────────────────────── */}
            <SectionHeader delay={60}>Global Comparison</SectionHeader>

            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px 8px 8px', borderRadius: 6, border: '1px solid var(--border-dim)' }}>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                  barCategoryGap="25%"
                >
                  <XAxis
                    type="number"
                    tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={{ stroke: 'var(--border-dim)' }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={70}
                    tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontFamily: 'monospace' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CompareTooltip />} cursor={{ fill: 'rgba(0,212,255,0.05)' }} />
                  <Bar dataKey="country" name={countryName} radius={[0, 4, 4, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="var(--accent)" fillOpacity={0.9} />
                    ))}
                  </Bar>
                  <Bar dataKey="avg" name="World Avg" radius={[0, 4, 4, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i} fill="rgba(255,255,255,0.15)" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── Active conflicts ───────────────────────────────────── */}
            <SectionHeader delay={100}>
               {showHistorical ? 'Historical Conflicts' : 'Active Conflicts'}
            </SectionHeader>

            {visibleConflicts.length === 0 ? (
              <div style={{
                fontSize:  11,
                fontFamily: 'monospace',
                color:     'var(--text-secondary)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed var(--border-dim)',
                padding:   '12px',
                borderRadius: 4,
                textAlign: 'center'
              }}>
                [ STATUS: CLEAR ] {showHistorical ? 'NO RECORDED CONFLICTS' : 'NO ACTIVE ZONES'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {visibleConflicts.slice(0, 8).map((c) => (
                  <div key={c.id} style={{
                    display:    'flex',
                    alignItems: 'flex-start',
                    gap:        12,
                    padding:    '12px',
                    background: 'linear-gradient(90deg, rgba(255,59,59,0.1) 0%, rgba(255,59,59,0.02) 100%)',
                    borderLeft: '2px solid var(--danger)',
                    borderTop:  '1px solid rgba(255,59,59,0.1)',
                    borderRight:'1px solid rgba(255,59,59,0.1)',
                    borderBottom:'1px solid rgba(255,59,59,0.1)',
                    borderRadius: '0 4px 4px 0',
                  }}>
                    <div style={{
                      width:        8,
                      height:       8,
                      borderRadius: '50%',
                      background:   'var(--danger)',
                      marginTop:    5,
                      flexShrink:   0,
                      boxShadow:    '0 0 8px var(--danger)',
                      animation:    'skeleton-pulse 2s infinite'
                    }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize:     13,
                        fontWeight:   600,
                        color:        '#ff8080',
                        lineHeight:   1.3,
                        marginBottom: 4,
                      }}>
                        {c.conflict_name ?? c.location}
                      </div>
                      <div style={{
                        fontSize:  10,
                        fontFamily: 'monospace',
                        color:     'var(--text-secondary)',
                        display:   'flex',
                        gap:       12,
                      }}>
                        {c.start_year && <span>SINCE: {c.start_year}</span>}
                        {c.intensity_level && (
                          <span style={{ color: 'var(--danger)', opacity: 0.9 }}>
                            INT-LEVEL: {c.intensity_level}
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
              <div style={{
                fontSize:  11,
                fontFamily: 'monospace',
                color:     'var(--text-secondary)',
                background: 'rgba(255,255,255,0.02)',
                border: '1px dashed var(--border-dim)',
                padding:   '12px',
                borderRadius: 4,
                textAlign: 'center'
              }}>
                [ NO SIGNAL DETECTED ]
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {news.slice(0, 5).map((article, i) => (
                  <div key={i} style={{
                    padding:      '12px',
                    background:   'rgba(0,0,0,0.2)',
                    border:       '1px solid var(--border-dim)',
                    borderRadius: 4,
                    transition:   'border-color 200ms ease',
                  }}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cp-news-link"
                      style={{
                        fontSize:       13,
                        fontWeight:     500,
                        color:          'var(--text-primary)',
                        textDecoration: 'none',
                        lineHeight:     1.4,
                        display:        'block',
                        marginBottom:   8,
                      }}
                    >
                      {article.title}
                    </a>
                    <div style={{
                      display:    'flex',
                      gap:        12,
                      fontSize:   10,
                      fontFamily: 'monospace',
                      color:      'var(--text-secondary)',
                    }}>
                      {article.source && (
                        <span style={{
                          color:        'var(--accent)',
                          opacity:      0.8,
                          maxWidth:     140,
                          overflow:     'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace:   'nowrap',
                        }}>
                          SRC: {article.source}
                        </span>
                      )}
                      {article.seendate && (
                        <span>| LOG: {fmtDate(article.seendate).toUpperCase()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Ad placeholder ──────────────────────────────────── */}
            <div style={{
              width:          '100%',
              height:         '250px',
              background:     'rgba(0, 212, 255, 0.02)',
              border:         '1px dashed var(--border)',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              color:          'var(--accent)',
              opacity:        0.5,
              fontSize:       '11px',
              marginTop:      '24px',
              borderRadius:   4,
              fontFamily:     'monospace',
              letterSpacing:  '0.1em',
            }}>
              [ SECURE COMM CHANNEL ]
            </div>

          </div>
        )}
      </div>
    </div>
  );
}