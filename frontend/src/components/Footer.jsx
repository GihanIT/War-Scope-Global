// src/components/Footer.jsx
// Inline CSS only — paste into any page

export default function Footer() {
  const year = new Date().getFullYear();

  const styles = {
    footer: {
      background: 'rgba(4,4,10,0.95)',
      borderTop: '1px solid #161b2e',
      padding: '32px 40px 24px',
      fontFamily: "'IBM Plex Mono', monospace",
      color: '#8892a4',
    },
    inner: {
      maxWidth: 1400,
      margin: '0 auto',
    },
    top: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
      gap: 32,
      marginBottom: 28,
      paddingBottom: 24,
      borderBottom: '1px solid #161b2e',
    },
    brand: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    brandName: {
      fontFamily: "'Barlow Condensed', sans-serif",
      fontWeight: 800,
      fontSize: 22,
      color: '#e8eaf0',
      letterSpacing: '0.04em',
    },
    brandTagline: {
      fontSize: 11,
      color: '#3a4155',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      lineHeight: 1.6,
      maxWidth: 220,
    },
    liveDot: {
      display: 'inline-block',
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#00d4ff',
      boxShadow: '0 0 6px #00d4ff',
      marginRight: 6,
      animation: 'none',
    },
    linkGroups: {
      display: 'flex',
      gap: 48,
      flexWrap: 'wrap',
    },
    linkGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
    },
    linkGroupTitle: {
      fontSize: 9,
      letterSpacing: '0.16em',
      color: '#3a4155',
      textTransform: 'uppercase',
      marginBottom: 4,
    },
    link: {
      fontSize: 12,
      color: '#8892a4',
      textDecoration: 'none',
      letterSpacing: '0.04em',
      transition: 'color 150ms',
      cursor: 'pointer',
    },
    bottom: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
    },
    copyright: {
      fontSize: 11,
      color: '#3a4155',
      letterSpacing: '0.08em',
    },
    disclaimer: {
      fontSize: 10,
      color: '#3a4155',
      letterSpacing: '0.06em',
      maxWidth: 480,
      textAlign: 'right',
      lineHeight: 1.6,
    },
    dataSource: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    sourceTag: {
      fontSize: 9,
      letterSpacing: '0.1em',
      color: '#3a4155',
      border: '1px solid #161b2e',
      padding: '3px 8px',
      borderRadius: 3,
      textTransform: 'uppercase',
    },
  };

  const navLink = (href, label) => (
    <a
      key={label}
      href={href}
      style={styles.link}
      onMouseEnter={e => e.target.style.color = '#00d4ff'}
      onMouseLeave={e => e.target.style.color = '#8892a4'}
    >
      {label}
    </a>
  );

  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>

        {/* ── Top section ─────────────────────────────────────────────── */}
        <div style={styles.top}>

          {/* Brand */}
          <div style={styles.brand}>
            <div style={styles.brandName}>
              <span style={{ color: '#00d4ff' }}>WAR</span>SCOPE
            </div>
            <div style={styles.brandTagline}>
              <span style={styles.liveDot} />
              Global conflict intelligence<br />
              Data updated every 15 minutes
            </div>
          </div>

          {/* Link groups */}
          <div style={styles.linkGroups}>

            <div style={styles.linkGroup}>
              <div style={styles.linkGroupTitle}>Platform</div>
              {navLink('/', 'Globe')}
              {navLink('/timeline', 'Timeline')}
              {navLink('/nuclear', 'Nuclear')}
              {navLink('/sanctions', 'Sanctions')}
              {navLink('/incidents', 'Incident Feed')}
            </div>

            <div style={styles.linkGroup}>
              <div style={styles.linkGroupTitle}>Legal</div>
              {navLink('/privacy-policy', 'Privacy Policy')}
              {navLink('/terms', 'Terms of Use')}
              {navLink('/disclaimer', 'Disclaimer')}
              {navLink('/cookie-policy', 'Cookie Policy')}
            </div>

            <div style={styles.linkGroup}>
              <div style={styles.linkGroupTitle}>Information</div>
              {navLink('/about', 'About WarScope')}
              {navLink('/data-sources', 'Data Sources')}
              {navLink('/methodology', 'Methodology')}
              {navLink('/contact', 'Contact')}
            </div>

          </div>
        </div>

        {/* ── Data sources ────────────────────────────────────────────── */}
        <div style={styles.dataSource}>
          {['UCDP Conflict Data', 'GDELT Project', 'SIPRI Arms Data', 'OFAC SDN List', 'UN Security Council', 'ACLED'].map(s => (
            <span key={s} style={styles.sourceTag}>{s}</span>
          ))}
        </div>

        {/* ── Bottom bar ──────────────────────────────────────────────── */}
        <div style={styles.bottom}>
          <div style={styles.copyright}>
            © {year} WarScope · All rights reserved
          </div>
          <div style={styles.disclaimer}>
            For informational purposes only. Data sourced from public databases.
            Not intended as operational military intelligence.
          </div>
        </div>

      </div>
    </footer>
  );
}