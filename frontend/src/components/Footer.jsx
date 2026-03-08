import { Link } from 'react-router-dom';

// ─── Inline Tactical SVGs ─────────────────────────────────────────────────────
const Icons = {
  Radar: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/><line x1="12" y1="12" x2="12" y2="2"/></svg>,
  Shield: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Terminal: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>,
  Database: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>,
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Barlow:wght@400;500;600&display=swap');

  .ws-footer-wrapper {
    background: #050508;
    border-top: 1px solid rgba(0, 212, 255, 0.15);
    padding: 32px 24px 24px; /* Reduced height */
    position: relative;
    overflow: hidden;
    z-index: 10;
  }

  .ws-footer-wrapper::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 212, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.02) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .ws-ft-inner {
    max-width: 1400px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .ws-ft-top {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 40px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
    padding-bottom: 24px; /* Reduced height */
    margin-bottom: 20px;
  }

  .ws-ft-brand {
    display: flex;
    flex-direction: column;
    gap: 12px;
    flex: 0 0 280px; /* Fixed width so links spread properly */
  }

  .ws-ft-brand-name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    color: #e8eaf0;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-shadow: 0 0 12px rgba(0,212,255,0.3);
  }

  .ws-ft-tagline {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: #8892a4;
    letter-spacing: 0.1em;
    line-height: 1.5;
    text-transform: uppercase;
  }

  .ws-ft-live-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    font-weight: 600;
    color: #ff8080;
    letter-spacing: 0.15em;
    width: fit-content;
    margin-top: 4px;
  }
  
  .ws-ft-pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ff3b3b;
    box-shadow: 0 0 8px #ff3b3b;
    animation: ft-pulse-live 2s infinite;
  }
  @keyframes ft-pulse-live {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  /* Fill center space */
  .ws-ft-links-wrap {
    display: flex;
    flex: 1;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: space-around; /* Spreads link columns evenly */
  }

  .ws-ft-col {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 140px;
  }

  .ws-ft-col-title {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    color: #e8eaf0;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ws-ft-col-title svg {
    color: #00d4ff;
    opacity: 0.8;
  }

  .ws-ft-link {
    font-family: 'Barlow', sans-serif;
    font-size: 13px;
    color: #8892a4;
    text-decoration: none;
    transition: all 200ms ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .ws-ft-link::before {
    content: '▸';
    color: #00d4ff;
    opacity: 0;
    transform: translateX(-4px);
    transition: all 200ms ease;
    font-size: 12px;
  }

  .ws-ft-link:hover {
    color: #00d4ff;
    text-shadow: 0 0 8px rgba(0,212,255,0.4);
    transform: translateX(4px);
  }
  .ws-ft-link:hover::before {
    opacity: 1;
    transform: translateX(0);
  }

  /* Centered Bottom Area */
  .ws-ft-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px;
    color: #4a5568;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .ws-ft-disclaimer {
    max-width: 800px;
    line-height: 1.5;
    color: #3a4155;
    font-size: 9px;
  }

  @media (max-width: 900px) {
    .ws-ft-top { flex-direction: column; gap: 32px; }
    .ws-ft-links-wrap { justify-content: flex-start; gap: 40px; }
    .ws-ft-brand { flex: auto; }
  }
`;

function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}

export default function Footer() {
  injectCSS('ws-footer-styles', CSS);
  const year = new Date().getFullYear();

  const PLATFORM_LINKS = [
    { label: 'Global Map', to: '/' },
    { label: 'Conflict Timeline', to: '/timeline' },
    { label: 'Nuclear Arsenal', to: '/nuclear' },
    { label: 'Sanctions Tracker', to: '/sanctions' },
    { label: 'Live Incident Feed', to: '/incidents' },
  ];

  const LEGAL_LINKS = [
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms of Use', to: '/terms' },
    { label: 'Disclaimer', to: '/disclaimer' },
    { label: 'Cookie Policy', to: '/cookie-policy' },
  ];

  const INFO_LINKS = [
    { label: 'About WarScope', to: '/about' },
    { label: 'Data Sources', to: '/data-sources' },
    { label: 'Methodology', to: '/methodology' },
    { label: 'Secure Contact', to: '/contact' },
  ];

  return (
    <footer className="ws-footer-wrapper">
      <div className="ws-ft-inner">

        {/* ── Top section ─────────────────────────────────────────────── */}
        <div className="ws-ft-top">
          
          {/* Brand */}
          <div className="ws-ft-brand">
            <div className="ws-ft-brand-name">
              <Icons.Radar />
              <span><span style={{ color: '#00d4ff' }}>WAR</span>SCOPE</span>
            </div>
            <div className="ws-ft-tagline">
              Global Geopolitical Intelligence<br />
              Automated Data Aggregation
            </div>
            <div className="ws-ft-live-indicator">
              <span className="ws-ft-pulse" />
              SYSTEM ACTIVE
            </div>
          </div>

          {/* Link groups (Spreads out to fill center space) */}
          <div className="ws-ft-links-wrap">
            <div className="ws-ft-col">
              <div className="ws-ft-col-title"><Icons.Terminal /> Platform</div>
              {PLATFORM_LINKS.map(link => (
                <Link key={link.label} to={link.to} className="ws-ft-link">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="ws-ft-col">
              <div className="ws-ft-col-title"><Icons.Shield /> Legal</div>
              {LEGAL_LINKS.map(link => (
                <Link key={link.label} to={link.to} className="ws-ft-link">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="ws-ft-col">
              <div className="ws-ft-col-title"><Icons.Database /> Intelligence</div>
              {INFO_LINKS.map(link => (
                <Link key={link.label} to={link.to} className="ws-ft-link">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar (Centered, plain text sources) ────────────────── */}
        <div className="ws-ft-bottom">
          <div>
            DATA SOURCES: UCDP Conflict Data · GDELT Project · SIPRI Arms Data · OFAC SDN List · UN Security Council · ACLED
          </div>
          <div className="ws-ft-disclaimer">
            [ SYSTEM LOG ] For informational and analytical purposes only. Data sourced from public OSINT databases and automated aggregators. Not intended for use as operational military intelligence.
          </div>
          <div style={{ marginTop: '8px' }}>
            © {year} WARSCOPE · ALL RIGHTS RESERVED
          </div>
        </div>

      </div>
    </footer>
  );
}