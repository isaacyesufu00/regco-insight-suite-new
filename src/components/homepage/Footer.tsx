import { Link } from 'react-router-dom';

const COLS: Record<string, [string, string][]> = {
  Products: [
    ['/', 'Report Generation'],
    ['/', 'Transaction Monitor'],
    ['/', 'Sanctions Screening'],
    ['/', 'Regulatory Intelligence'],
  ],
  Regulators: [
    ['/blog/compliance-guide', 'CBN'],
    ['/blog/compliance-guide', 'NFIU'],
    ['/blog/compliance-guide', 'SCUML'],
    ['/blog/compliance-guide', 'FIRS'],
  ],
  Resources: [
    ['/blog/updates', 'Updates'],
    ['/blog/compliance-guide', 'Compliance Guide'],
    ['/contact/support', 'Support'],
    ['/book-demo', 'Book a Demo'],
  ],
  Company: [
    ['/legal/privacy-policy', 'Privacy'],
    ['/legal/terms-of-service', 'Terms'],
    ['/legal/data-processing', 'DPA'],
    ['/legal/ndpc-compliance', 'NDPC'],
  ],
};

export function Footer() {
  return (
    <footer style={{ background: '#fff', borderTop: '1px solid var(--bd-light)', padding: '64px 32px 32px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 40 }}>
          <div>
            <Link
              to="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textDecoration: 'none',
                fontFamily: 'var(--font-head)',
                fontSize: 22,
                fontWeight: 600,
                color: 'var(--tx-primary)',
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: 'var(--tx-primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                R
              </span>
              RegCo
            </Link>
            <p style={{ fontSize: 13.5, color: 'var(--tx-secondary)', lineHeight: 1.6, maxWidth: 260 }}>
              Compliance automation for CBN-licensed financial institutions. Abuja, Nigeria.
            </p>
          </div>

          {Object.entries(COLS).map(([heading, links]) => (
            <div key={heading}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx-primary)', marginBottom: 14, letterSpacing: 0.4 }}>
                {heading}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map(([href, label]) => (
                  <Link
                    key={label}
                    to={href}
                    style={{
                      fontSize: 13.5,
                      color: 'var(--tx-secondary)',
                      textDecoration: 'none',
                      transition: 'color 0.12s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--tx-primary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--tx-secondary)')}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 48,
            paddingTop: 24,
            borderTop: '1px solid var(--bd-light)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 12.5, color: 'var(--tx-muted)' }}>© 2026 RegCo Technologies Limited</span>
          <span style={{ fontSize: 12.5, color: 'var(--tx-muted)' }}>Built in Abuja, Nigeria 🇳🇬</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
