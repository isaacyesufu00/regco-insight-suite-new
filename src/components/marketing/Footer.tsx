import { Link } from 'react-router-dom';

const cols = [
  {
    heading: 'Platform',
    links: ['Alert Triage', 'Identity Review', 'Sanctions Screening', 'Case Management', 'Reporting', 'Audit Trail'],
    hrefs: ['/product/alert-triage', '/product/identity-review', '/product/screening', '/product/case-management', '/product/reporting', '/product/audit-trail'],
  },
  {
    heading: 'Solutions',
    links: ['For Compliance', 'For Risk', 'For Audit', 'For Operations', 'Enterprise'],
    hrefs: ['/solutions/compliance', '/solutions/risk', '/solutions/audit', '/solutions/operations', '/enterprise'],
  },
  {
    heading: 'Resources',
    links: ['Documentation', 'Security', 'Status', 'Blog', 'Changelog'],
    hrefs: ['/docs', '/security', '/status', '/blog/updates', '/changelog'],
  },
  {
    heading: 'Company',
    links: ['About', 'Careers', 'Press', 'Contact', 'Privacy Policy'],
    hrefs: ['/about', '/careers', '/press', '/contact', '/legal/privacy-policy'],
  },
];

export const Footer = () => (
  <footer style={{ background: 'var(--n-800)', color: '#FFFFFF', padding: '64px 0 40px' }}>
    <div className="atl-container">
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '28px', height: '28px', background: 'var(--blue-600)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF' }}>R</span>
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>Regco</span>
          </div>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: '240px' }}>
            AI agents for enterprise compliance. Built for regulated institutions that need control, traceability, and auditability.
          </p>
        </div>
        {cols.map(col => (
          <div key={col.heading}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>{col.heading}</p>
            {col.links.map((link, i) => (
              <Link key={link} to={col.hrefs[i]} style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', marginBottom: '9px', transition: 'color 0.12s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#FFFFFF'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)'}
              >{link}</Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>© 2026 Regco Technologies Limited. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Privacy Policy', href: '/legal/privacy-policy' },
            { label: 'Terms of Service', href: '/legal/terms-of-service' },
            { label: 'Cookie Policy', href: '/legal/privacy-policy' },
          ].map(item => (
            <Link key={item.label} to={item.href} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.12s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)'}
            >{item.label}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
