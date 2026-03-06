import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// ─── Styles injected once ─────────────────────────────────────────────────────
const NAVBAR_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Barlow:wght@400;600&display=swap');

  .ws-nav-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 2px;
    font-family: 'Barlow', system-ui, sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #8892a4;
    text-decoration: none;
    border-bottom: 2px solid transparent;
    transition: color 150ms ease, border-color 150ms ease;
    white-space: nowrap;
    cursor: pointer;
  }
  .ws-nav-link:hover {
    color: #e8eaf0;
  }
  .ws-nav-link.active {
    color: #00d4ff;
    border-bottom-color: #00d4ff;
  }

  .ws-search-input {
    background: #0a0a0f;
    border: 1px solid #1e2433;
    color: #e8eaf0;
    border-radius: 6px;
    padding: 7px 12px 7px 34px;
    font-size: 13px;
    font-family: 'Barlow', system-ui, sans-serif;
    width: 200px;
    outline: none;
    transition: border-color 180ms ease, box-shadow 180ms ease, width 250ms ease;
  }
  .ws-search-input::placeholder { color: #4a5568; }
  .ws-search-input:focus {
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0,212,255,0.08);
    width: 240px;
  }

  .ws-hamburger {
    background: transparent;
    border: 1px solid #1e2433;
    color: #e8eaf0;
    cursor: pointer;
    border-radius: 5px;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: background 150ms, border-color 150ms;
    flex-shrink: 0;
  }
  .ws-hamburger:hover {
    background: rgba(0,212,255,0.07);
    border-color: rgba(0,212,255,0.3);
  }

  @keyframes ws-dropdown-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ws-mobile-menu {
    animation: ws-dropdown-in 200ms ease forwards;
  }

  .ws-mobile-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 20px;
    font-family: 'Barlow', system-ui, sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #8892a4;
    text-decoration: none;
    border-bottom: 1px solid #1e2433;
    transition: color 150ms, background 150ms;
    cursor: pointer;
  }
  .ws-mobile-link:last-child { border-bottom: none; }
  .ws-mobile-link:hover  { color: #e8eaf0; background: rgba(255,255,255,0.03); }
  .ws-mobile-link.active { color: #00d4ff; background: rgba(0,212,255,0.05); }

  @media (max-width: 768px) {
    .ws-nav-center, .ws-nav-right { display: none !important; }
    .ws-hamburger-wrap             { display: flex !important; }
  }
  @media (min-width: 769px) {
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

// ─── Nav links config ─────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: '🌍 Globe',   to: '/' },
  { label: '📰 Blog',    to: '/blog' },
  { label: '⚖️ Compare', to: '/compare' },
];

// ─── Search component ─────────────────────────────────────────────────────────
function SearchInput({ onSubmit }) {
  const [val, setVal] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && val.trim()) {
      onSubmit?.(val.trim());
      setVal('');
    }
  };

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      {/* Search icon */}
      <svg
        width="14" height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4a5568"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          position:      'absolute',
          left:          11,
          top:           '50%',
          transform:     'translateY(-50%)',
          pointerEvents: 'none',
        }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="ws-search-input"
        type="text"
        placeholder="Search country..."
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="Search country"
      />
    </div>
  );
}

// ─── Desktop nav link ─────────────────────────────────────────────────────────
function NavLink({ to, label, exact }) {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === to : pathname.startsWith(to);

  return (
    <Link to={to} className={`ws-nav-link${isActive ? ' active' : ''}`}>
      {label}
    </Link>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export default function Navbar() {
  injectStyle('ws-navbar-css', NAVBAR_CSS);

  const navigate                  = useNavigate();
  const { pathname }              = useLocation();
  const [menuOpen, setMenuOpen]   = useState(false);
  const menuRef                   = useRef(null);
  const hamburgerRef              = useRef(null);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Close on outside click
  const handleOutside = useCallback((e) => {
    if (
      menuRef.current      && !menuRef.current.contains(e.target) &&
      hamburgerRef.current && !hamburgerRef.current.contains(e.target)
    ) {
      setMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (menuOpen) document.addEventListener('mousedown', handleOutside);
    else          document.removeEventListener('mousedown', handleOutside);
    return ()  => document.removeEventListener('mousedown', handleOutside);
  }, [menuOpen, handleOutside]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleSearch = (query) => {
    navigate(`/?countries=${encodeURIComponent(query.toUpperCase())}`);
  };

  return (
    <>
      {/* ── Main bar ──────────────────────────────────────────────────── */}
      <nav style={{
        position:       'sticky',
        top:            0,
        zIndex:         100,
        width:          '100%',
        height:         60,
        background:     '#0f1117',
        borderBottom:   '1px solid #1e2433',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 20px',
        flexShrink:     0,
        boxSizing:      'border-box',
        // Subtle glass micro-texture
        backdropFilter: 'blur(8px)',
        boxShadow:      '0 1px 0 rgba(0,212,255,0.04)',
      }}>

        {/* ── Left: wordmark ──────────────────────────────────────────── */}
        <Link
          to="/"
          style={{
            textDecoration: 'none',
            display:        'flex',
            alignItems:     'center',
            gap:            8,
            flexShrink:     0,
          }}
        >
          <span style={{
            fontFamily:    "'IBM Plex Mono', monospace",
            fontWeight:    500,
            fontSize:      20,
            color:         '#00d4ff',
            letterSpacing: '-0.02em',
            lineHeight:    1,
          }}>
            ⚔️ WarScope
          </span>
          <span style={{
            background:    'rgba(255,59,59,0.15)',
            border:        '1px solid rgba(255,59,59,0.3)',
            borderRadius:  3,
            padding:       '1px 5px',
            fontFamily:    "'IBM Plex Mono', monospace",
            fontSize:      8,
            color:         '#ff3b3b',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginTop:     1,
          }}>
            LIVE
          </span>
        </Link>

        {/* ── Center: desktop links ────────────────────────────────────── */}
        <div
          className="ws-nav-center"
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        32,
            position:   'absolute',
            left:       '50%',
            transform:  'translateX(-50%)',
          }}
        >
          {NAV_LINKS.map(({ label, to }) => (
            <NavLink
              key={to}
              to={to}
              label={label}
              exact={to === '/'}
            />
          ))}
        </div>

        {/* ── Right: search + mobile hamburger ─────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>

          {/* Desktop search */}
          <div className="ws-nav-right" style={{ display: 'flex', alignItems: 'center' }}>
            <SearchInput onSubmit={handleSearch} />
          </div>

          {/* Hamburger */}
          <div className="ws-hamburger-wrap" style={{ alignItems: 'center' }}>
            <button
              ref={hamburgerRef}
              className="ws-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile dropdown ──────────────────────────────────────────── */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="ws-mobile-menu"
          style={{
            position:    'fixed',
            top:         60,
            left:        0,
            right:       0,
            zIndex:      99,
            background:  '#0f1117',
            borderBottom:'1px solid #1e2433',
            boxShadow:   '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {NAV_LINKS.map(({ label, to }) => {
            const isActive = to === '/'
              ? pathname === '/'
              : pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`ws-mobile-link${isActive ? ' active' : ''}`}
              >
                {label}
              </Link>
            );
          })}

          {/* Mobile search */}
          <div style={{
            padding:      '12px 20px 16px',
            borderTop:    '1px solid #1e2433',
          }}>
            <div style={{ position: 'relative' }}>
              <svg
                width="14" height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4a5568"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  position:      'absolute',
                  left:          11,
                  top:           '50%',
                  transform:     'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="ws-search-input"
                style={{ width: '100%' }}
                type="text"
                placeholder="Search country..."
                aria-label="Search country"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    handleSearch(e.target.value.trim());
                    setMenuOpen(false);
                    e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}