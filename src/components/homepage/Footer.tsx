import { Link } from 'react-router-dom';

const cols = [
  { title: 'PLATFORM', links: [{ label: 'Features', to: '/features' }, { label: 'Solutions', to: '/solutions' }, { label: 'Pricing', to: '/pricing' }] },
  { title: 'COMPANY', links: [{ label: 'About', to: '/about' }, { label: 'Book a demo', to: '/book-demo' }, { label: 'Support', to: '/contact/support' }] },
  { title: 'LEGAL', links: [{ label: 'Privacy Policy', to: '/legal/privacy-policy' }, { label: 'Terms of Service', to: '/legal/terms-of-service' }, { label: 'NDPC Compliance', to: '/legal/ndpc-compliance' }] },
];

export function Footer() {
  return (
    <footer style={{ background: 'rgba(255,255,255,0.97)', borderTop: '1px solid var(--bd-light)', padding: '60px 24px 32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, paddingBottom: 48 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: 'var(--tx-primary)', margin: '0 0 12px', letterSpacing: '-0.5px' }}>RegCo</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--tx-secondary)', margin: 0, lineHeight: 1.6, maxWidth: 280 }}>
              Automated regulatory compliance for CBN-licensed Nigerian institutions.
            </p>
          </div>
          {cols.map(c => (
            <div key={c.title}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--tx-primary)', letterSpacing: '0.1em', margin: '0 0 16px' }}>{c.title}</p>
              {c.links.map(l => (
                <p key={l.label} style={{ margin: '0 0 10px' }}>
                  <Link to={l.to} style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--tx-secondary)', textDecoration: 'none' }}>{l.label}</Link>
                </p>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid var(--bd-light)', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tx-muted)', margin: 0 }}>
            © {new Date().getFullYear()} RegCo Technologies Limited · Built in Abuja, Nigeria
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
