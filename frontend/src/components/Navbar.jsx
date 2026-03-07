import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  ),
  Feed: () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>
  ),
  Blog: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
  ),
  Compare: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>
  ),
  Nuclear: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 9V3"/><path d="m15.6 10.5 5.2-3"/><path d="m8.4 13.5-5.2 3"/><path d="M12 15v6"/><path d="m15.6 13.5 5.2 3"/><path d="m8.4 10.5-5.2-3"/></svg>
  ),
  Radar: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="12" x2="12" y2="2"/></svg>
  ),
  Sanctions: () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
  ),
  Timeline: () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/><circle cx="21" cy="12" r="3"/><circle cx="18" cy="18" r="3"/></svg>
  ),
};

// ─── Styles injected once ─────────────────────────────────────────────────────
const NAVBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

  .ws-nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 2px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8892a4;
    text-decoration: none;
    transition: color 200ms ease, text-shadow 200ms ease;
    white-space: nowrap;
    cursor: pointer;
  }
  
  .ws-nav-link::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #00d4ff;
    transform: scaleX(0);
    transition: transform 200ms ease;
    box-shadow: 0 0 8px #00d4ff;
  }

  .ws-nav-link:hover {
    color: #00d4ff;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.4);
  }
  
  .ws-nav-link.active {
    color: #e8eaf0;
    text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
  }
  
  .ws-nav-link.active::after {
    transform: scaleX(1);
  }

  /* Nuclear link glows red when active */
  .ws-nav-link.nuclear-link:hover {
    color: #ff8080;
    text-shadow: 0 0 8px rgba(255,59,59,0.4);
  }
  .ws-nav-link.nuclear-link::after {
    background: #ff3b3b;
    box-shadow: 0 0 8px #ff3b3b;
  }
  .ws-nav-link.nuclear-link.active {
    color: #ff8080;
    text-shadow: 0 0 8px rgba(255,59,59,0.4);
  }

  .ws-hamburger {
    background: rgba(0, 212, 255, 0.05);
    border: 1px solid rgba(0, 212, 255, 0.2);
    color: #00d4ff;
    cursor: pointer;
    border-radius: 4px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: all 200ms ease;
    flex-shrink: 0;
  }
  .ws-hamburger:hover {
    background: rgba(0,212,255,0.15);
    border-color: #00d4ff;
    box-shadow: 0 0 12px rgba(0,212,255,0.3);
  }

  @keyframes ws-dropdown-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  
  .ws-mobile-menu {
    animation: ws-dropdown-in 200ms ease forwards;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .ws-mobile-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #8892a4;
    text-decoration: none;
    border-bottom: 1px solid rgba(30, 36, 51, 0.5);
    transition: all 150ms ease;
    cursor: pointer;
  }
  .ws-mobile-link:last-child { border-bottom: none; }
  .ws-mobile-link:hover  { color: #00d4ff; background: rgba(0, 212, 255, 0.05); padding-left: 28px; }
  .ws-mobile-link.active { color: #e8eaf0; background: rgba(0, 212, 255, 0.1); border-left: 3px solid #00d4ff; }
  .ws-mobile-link.nuclear-mobile:hover  { color: #ff8080; background: rgba(255,59,59,0.05); }
  .ws-mobile-link.nuclear-mobile.active { color: #ff8080; background: rgba(255,59,59,0.08); border-left-color: #ff3b3b; }

  @keyframes pulse-live {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(255,59,59,0.6); }
    50% { opacity: 0.4; box-shadow: 0 0 2px rgba(255,59,59,0.2); }
  }
  .pulse-live { animation: pulse-live 2s infinite; }

  .ws-clock {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    color: #00d4ff;
    letter-spacing: 0.15em;
    background: rgba(0, 212, 255, 0.05);
    border: 1px solid rgba(0, 212, 255, 0.2);
    padding: 6px 12px;
    border-radius: 4px;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
  }

  @media (max-width: 1024px) {
    .ws-nav-center { display: none !important; }
    .ws-hamburger-wrap { display: flex !important; }
  }
  @media (max-width: 600px) {
    .ws-clock { display: none !important; }
  }
  @media (min-width: 1025px) {
    .ws-hamburger-wrap { display: none !important; }
  }
`;

function injectStyle(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}

// ─── Nav links config ────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'GLOBE',     to: '/',          Icon: Icons.Globe },
  { label: 'FEED',      to: '/incidents', Icon: Icons.Feed },
  { label: 'INTEL',     to: '/blog',      Icon: Icons.Blog },
  { label: 'COMPARE',   to: '/compare',   Icon: Icons.Compare },
  { label: 'NUCLEAR',   to: '/nuclear',   Icon: Icons.Nuclear, red: true },
  { label: 'SANCTIONS', to: '/sanctions', Icon: Icons.Sanctions },
  { label: 'TIMELINE',  to: '/timeline',  Icon: Icons.Timeline },
];

// ─── Desktop nav link ─────────────────────────────────────────────────────────
function NavLink({ to, label, exact, Icon, red }) {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === to : pathname.startsWith(to);
  const extraClass = red ? ' nuclear-link' : '';

  return (
    <Link to={to} className={`ws-nav-link${extraClass}${isActive ? ' active' : ''}`}>
      <span style={{ opacity: isActive ? 1 : 0.7, color: red && isActive ? '#ff8080' : 'inherit', display: 'flex' }}>
        <Icon />
      </span>
      {label}
    </Link>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  injectStyle('ws-navbar-css', NAVBAR_CSS);

  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState('');
  const menuRef      = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleOutside = useCallback((e) => {
    if (
      menuRef.current      && !menuRef.current.contains(e.target) &&
      hamburgerRef.current && !hamburgerRef.current.contains(e.target)
    ) setMenuOpen(false);
  }, []);

  useEffect(() => {
    if (menuOpen) document.addEventListener('mousedown', handleOutside);
    else          document.removeEventListener('mousedown', handleOutside);
    return () =>  document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen, handleOutside]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ── Main bar ──────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100, width: '100%', height: 60,
        background: 'rgba(5, 5, 8, 0.85)',
        borderBottom: '1px solid rgba(0, 212, 255, 0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', flexShrink: 0, boxSizing: 'border-box',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      }}>

        {/* Left: wordmark */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          <Icons.Radar />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700, fontSize: 18,
            color: '#e8eaf0', letterSpacing: '0.1em', textTransform: 'uppercase',
            lineHeight: 1, textShadow: '0 0 12px rgba(0,212,255,0.5)',
          }}>WarScope</span>
        </Link>

        {/* Center: desktop links */}
        <div className="ws-nav-center" style={{
          display: 'flex', alignItems: 'center', gap: 32,
          position: 'absolute', left: '50%', transform: 'translateX(-50%)', height: '100%',
        }}>
          {NAV_LINKS.map(({ label, to, Icon, red }) => (
            <NavLink key={to} to={to} label={label} Icon={Icon} exact={to === '/'} red={red} />
          ))}
        </div>

        {/* Right: System Status & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>

          {/* Live Status Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,59,59,0.1)', border: '1px solid rgba(255,59,59,0.4)',
            padding: '6px 12px', borderRadius: 4,
            boxShadow: '0 0 10px rgba(255,59,59,0.1)'
          }}>
            <div className="pulse-live" style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff3b3b' }} />
            <span style={{ 
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700, 
              color: '#ff8080', letterSpacing: '0.15em', lineHeight: 1 
            }}>
              SYS: LIVE
            </span>
          </div>

          {/* Mobile Hamburger */}
          <div className="ws-hamburger-wrap" style={{ alignItems: 'center' }}>
            <button
              ref={hamburgerRef} className="ws-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {menuOpen
                  ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                  : <><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="18" x2="20" y2="18"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile dropdown ───────────────────────────────────────────── */}
      {menuOpen && (
        <div ref={menuRef} className="ws-mobile-menu" style={{
          position: 'fixed', top: 60, left: 0, right: 0, zIndex: 99,
          background: 'rgba(5, 5, 8, 0.95)',
          borderBottom: '1px solid rgba(0, 212, 255, 0.2)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.8)',
          paddingBottom: '8px'
        }}>
          {NAV_LINKS.map(({ label, to, Icon, red }) => {
            const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
            return (
              <Link
                key={to} to={to}
                className={`ws-mobile-link${red ? ' nuclear-mobile' : ''}${isActive ? ' active' : ''}`}
              >
                <span style={{ opacity: isActive ? 1 : 0.6, display: 'flex' }}><Icon /></span>
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}