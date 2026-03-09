import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Globe: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  Feed: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1"/></svg>,
  Blog: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>,
  Compare: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  Nuclear: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 9V3"/><path d="m15.6 10.5 5.2-3"/><path d="m8.4 13.5-5.2 3"/><path d="M12 15v6"/><path d="m15.6 13.5 5.2 3"/><path d="m8.4 10.5-5.2-3"/></svg>,
  Radar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="12" x2="12" y2="2"/></svg>,
  Sanctions: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  Timeline: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/><circle cx="21" cy="12" r="3"/><circle cx="18" cy="18" r="3"/></svg>,
  // New icons for dropdowns
  ChevronDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  Lock: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Cargo: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><path d="M2 15h20v4H2z"/></svg>,
  Tank: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="12" width="20" height="8" rx="2" ry="2"/><path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><line x1="16" y1="10" x2="22" y2="10"/></svg>,
  Users: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
};

// ─── Styles injected once ─────────────────────────────────────────────────────
const NAVBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

  /* ── Links ── */
  .ws-nav-link {
    position: relative; display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 2px; font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; color: #8892a4;
    text-decoration: none; transition: color 200ms ease, text-shadow 200ms ease;
    white-space: nowrap; cursor: pointer;
  }
  .ws-nav-link::after {
    content: ''; position: absolute; bottom: -20px; left: 0;
    width: 100%; height: 2px; background: #00d4ff;
    transform: scaleX(0); transition: transform 200ms ease; box-shadow: 0 0 8px #00d4ff;
  }
  .ws-nav-link:hover { color: #00d4ff; text-shadow: 0 0 8px rgba(0, 212, 255, 0.4); }
  .ws-nav-link.active { color: #e8eaf0; text-shadow: 0 0 8px rgba(255, 255, 255, 0.3); }
  .ws-nav-link.active::after { transform: scaleX(1); }

  .ws-nav-link.nuclear-link:hover { color: #ff8080; text-shadow: 0 0 8px rgba(255,59,59,0.4); }
  .ws-nav-link.nuclear-link::after { background: #ff3b3b; box-shadow: 0 0 8px #ff3b3b; }
  .ws-nav-link.nuclear-link.active { color: #ff8080; text-shadow: 0 0 8px rgba(255,59,59,0.4); }

  /* ── Dropdowns ── */
  .ws-dropdown-wrap {
    position: relative; display: flex; align-items: center; height: 100%;
  }
  .ws-dropdown-trigger {
    display: flex; align-items: center; gap: 6px; padding: 6px 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; color: #8892a4;
    cursor: pointer; transition: color 200ms ease, text-shadow 200ms ease;
  }
  .ws-dropdown-wrap:hover .ws-dropdown-trigger { color: #00d4ff; text-shadow: 0 0 8px rgba(0,212,255,0.4); }
  
  .ws-dropdown-menu {
    position: absolute; top: calc(100% - 10px); left: 50%; transform: translateX(-50%) translateY(10px);
    background: rgba(5, 7, 12, 0.95); border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 4px;
    opacity: 0; visibility: hidden; pointer-events: none; transition: all 200ms ease;
    box-shadow: 0 8px 32px rgba(0,0,0,0.8); backdrop-filter: blur(16px); z-index: 100;
  }
  .ws-dropdown-wrap:hover .ws-dropdown-menu { opacity: 1; visibility: visible; pointer-events: auto; transform: translateX(-50%) translateY(0); }
  
  .ws-dropdown-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 16px;
    font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 500;
    letter-spacing: 0.1em; color: #8892a4; text-decoration: none; text-transform: uppercase;
    border-radius: 4px; transition: all 150ms ease; white-space: nowrap;
  }
  .ws-dropdown-item:hover:not(.locked) { background: rgba(0, 212, 255, 0.1); color: #e8eaf0; }
  .ws-dropdown-item.active { background: rgba(0, 212, 255, 0.05); color: #00d4ff; }
  .ws-dropdown-item.locked { opacity: 0.4; cursor: not-allowed; }

  /* ── Right System Elements ── */
  .ws-clock {
    font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 600;
    color: #00d4ff; letter-spacing: 0.15em; background: rgba(0, 212, 255, 0.05);
    border: 1px solid rgba(0, 212, 255, 0.2); padding: 6px 12px; border-radius: 4px;
    text-shadow: 0 0 8px rgba(0, 212, 255, 0.3);
  }

  @keyframes pulse-live {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(255,59,59,0.6); }
    50% { opacity: 0.4; box-shadow: 0 0 2px rgba(255,59,59,0.2); }
  }
  .pulse-live { animation: pulse-live 2s infinite; }

  /* ── Mobile ── */
  .ws-hamburger {
    background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2);
    color: #00d4ff; cursor: pointer; border-radius: 4px; width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
    transition: all 200ms ease; flex-shrink: 0;
  }
  .ws-hamburger:hover { background: rgba(0,212,255,0.15); border-color: #00d4ff; box-shadow: 0 0 12px rgba(0,212,255,0.3); }

  @keyframes ws-dropdown-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  .ws-mobile-menu {
    animation: ws-dropdown-in 200ms ease forwards; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    overflow-y: auto; max-height: calc(100vh - 60px);
  }

  .ws-mobile-section {
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 600;
    color: #00d4ff; letter-spacing: 0.2em; text-transform: uppercase;
    padding: 24px 24px 8px; opacity: 0.7; border-bottom: 1px solid rgba(0,212,255,0.1); margin-bottom: 4px;
  }

  .ws-mobile-link {
    display: flex; align-items: center; gap: 12px; padding: 14px 24px;
    font-family: 'IBM Plex Mono', monospace; font-size: 13px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase; color: #8892a4;
    text-decoration: none; transition: all 150ms ease; cursor: pointer;
  }
  .ws-mobile-link:hover:not(.locked)  { color: #00d4ff; background: rgba(0, 212, 255, 0.05); padding-left: 28px; }
  .ws-mobile-link.active { color: #e8eaf0; background: rgba(0, 212, 255, 0.1); border-left: 3px solid #00d4ff; }
  .ws-mobile-link.nuclear-mobile:hover:not(.locked)  { color: #ff8080; background: rgba(255,59,59,0.05); }
  .ws-mobile-link.nuclear-mobile.active { color: #ff8080; background: rgba(255,59,59,0.08); border-left-color: #ff3b3b; }
  .ws-mobile-link.locked { opacity: 0.4; cursor: not-allowed; }

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

// ─── Hierarchy config ────────────────────────────────────────────────────────
const PRIMARY_LINKS = [
  { label: 'GLOBE',   to: '/',          Icon: Icons.Globe },
  { label: 'FEED',    to: '/incidents', Icon: Icons.Feed },
  { label: 'COMPARE', to: '/compare',   Icon: Icons.Compare },
  { label: 'NUCLEAR', to: '/nuclear',   Icon: Icons.Nuclear, red: true },
];

const INTEL_LINKS = [
  { label: 'TIMELINE',   to: '/timeline',  Icon: Icons.Timeline },
  { label: 'SANCTIONS',  to: '/sanctions', Icon: Icons.Sanctions },
  { label: 'ARMS TRADE', to: '/arms-trade', Icon: Icons.Cargo },  
];

const DB_LINKS = [
  { label: 'INTEL BLOG', to: '/blog', Icon: Icons.Blog },
  { label: 'VEHICLE DB', to: '/vehicles',     Icon: Icons.Tank },
  { label: 'UNIT DB',    to: '/units',     Icon: Icons.Users },
];

// ─── Component blocks ─────────────────────────────────────────────────────────
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

function NavDropdown({ label, links }) {
  const { pathname } = useLocation();
  const isActive = links.some(l => l.to !== '#' && (l.exact ? pathname === l.to : pathname.startsWith(l.to)));

  return (
    <div className="ws-dropdown-wrap">
      <div className="ws-dropdown-trigger" style={{ color: isActive ? '#e8eaf0' : '' }}>
        {label} <span style={{ opacity: 0.6, display: 'flex', marginTop: 2 }}><Icons.ChevronDown /></span>
      </div>
      <div className="ws-dropdown-menu">
        {links.map((link, i) => {
          const isItemActive = link.to !== '#' && (link.exact ? pathname === link.to : pathname.startsWith(link.to));
          return (
            <Link
              key={i}
              to={link.locked ? '#' : link.to}
              className={`ws-dropdown-item ${link.locked ? 'locked' : ''} ${isItemActive ? 'active' : ''}`}
              onClick={e => link.locked && e.preventDefault()}
            >
              <span style={{ opacity: isItemActive ? 1 : 0.7, display: 'flex' }}><link.Icon /></span>
              {link.label}
              {link.locked && <span style={{ marginLeft: 'auto', opacity: 0.5, display: 'flex' }}><Icons.Lock /></span>}
            </Link>
          );
        })}
      </div>
    </div>
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

  // UTC Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
          {PRIMARY_LINKS.map(({ label, to, Icon, red }) => (
            <NavLink key={to} to={to} label={label} Icon={Icon} exact={to === '/'} red={red} />
          ))}
          
          <NavDropdown label="INTEL" links={INTEL_LINKS} />
          <NavDropdown label="DATABASE" links={DB_LINKS} />
        </div>

        {/* Right: System Status & Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          
          {/* Tactical UTC Clock */}
          <div className="ws-clock" suppressHydrationWarning>
            {time}
          </div>

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
          paddingBottom: '24px'
        }}>
          
          <div className="ws-mobile-section">PRIMARY COMMANDS</div>
          {PRIMARY_LINKS.map(({ label, to, Icon, red }) => {
            const isActive = to === '/' ? pathname === '/' : pathname.startsWith(to);
            return (
              <Link
                key={to} to={to}
                className={`ws-mobile-link${red ? ' nuclear-mobile' : ''}${isActive ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <span style={{ opacity: isActive ? 1 : 0.6, display: 'flex' }}><Icon /></span>
                {label}
              </Link>
            );
          })}

          <div className="ws-mobile-section">INTELLIGENCE</div>
          {INTEL_LINKS.map(({ label, to, Icon, locked }) => {
            const isActive = to !== '#' && pathname.startsWith(to);
            return (
              <Link
                key={label} to={locked ? '#' : to}
                className={`ws-mobile-link ${locked ? 'locked' : ''} ${isActive ? ' active' : ''}`}
                onClick={(e) => { if (locked) e.preventDefault(); else setMenuOpen(false); }}
              >
                <span style={{ opacity: isActive ? 1 : 0.6, display: 'flex' }}><Icon /></span>
                {label}
                {locked && <span style={{ marginLeft: 'auto', opacity: 0.5, display: 'flex' }}><Icons.Lock /></span>}
              </Link>
            );
          })}

          <div className="ws-mobile-section">DATABASES</div>
          {DB_LINKS.map(({ label, to, Icon, locked }) => {
            const isActive = to !== '#' && pathname.startsWith(to);
            return (
              <Link
                key={label} to={locked ? '#' : to}
                className={`ws-mobile-link ${locked ? 'locked' : ''} ${isActive ? ' active' : ''}`}
                onClick={(e) => { if (locked) e.preventDefault(); else setMenuOpen(false); }}
              >
                <span style={{ opacity: isActive ? 1 : 0.6, display: 'flex' }}><Icon /></span>
                {label}
                {locked && <span style={{ marginLeft: 'auto', opacity: 0.5, display: 'flex' }}><Icons.Lock /></span>}
              </Link>
            );
          })}

        </div>
      )}
    </>
  );
}