import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer style={{ background: '#0A0A0A', color: '#FFFFFF', padding: '64px 0 40px' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
        <div>
          <p style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', letterSpacing: '-0.3px' }}>RegCo</p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '240px' }}>
            AI compliance for Nigerian licensed financial institutions.
          </p>
        </div>
        {[
          { heading: 'Product', links: [{ label: 'Features', href: '/product' }, { label: 'Security', href: '/security' }, { label: 'Pricing', href: '/pricing' }, { label: 'Request a demo', href: '/book-demo' }] },
          { heading: 'Company', links: [{ label: 'About', href: '/about' }, { label: 'Company', href: '/company' }, { label: 'Who We Serve', href: '/who-we-serve' }] },
          { heading: 'Legal', links: [{ label: 'Privacy Policy', href: '/legal/privacy-policy' }, { label: 'Terms of Service', href: '/legal/terms-of-service' }, { label: 'Data Processing', href: '/legal/data-processing' }, { label: 'NDPC Compliance', href: '/legal/ndpc-compliance' }] },
          { heading: 'Support', links: [{ label: 'Help Centre', href: '/contact/support' }, { label: 'Contact', href: '/contact/support' }, { label: 'Partnerships', href: '/contact/partnerships' }] },
        ].map(col => (
          <div key={col.heading}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>{col.heading}</p>
            {col.links.map(link => (
              <Link key={link.label} to={link.href} style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: '9px', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#FFFFFF'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>RegCo Technologies Limited · Abuja, Nigeria · 2026</p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>CBN · NFIU · SCUML · NDIC · FIRS · PENCOM</p>
      </div>
    </div>
  </footer>
);
