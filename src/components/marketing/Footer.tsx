import { Link } from 'react-router-dom';

const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
const SANS = '"DM Sans", system-ui, sans-serif';
const INK = '#000000CC';
const INK_SOFT = '#00000099';
const INK_FAINT = '#00000066';
const HAIR = '#0000001A';

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
  <footer style={{ background: '#FFFFFF', borderTop: `1px solid ${HAIR}`, padding: '64px 0 40px', fontFamily: SANS }}>
    <div style={{ boxSizing: 'border-box', marginLeft: 'auto', marginRight: 'auto', width: 'min(100% - 32px, 1040px)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ width: '6px', height: '16px', background: '#A76D3B', display: 'inline-block' }} />
            <span style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 600, color: INK, letterSpacing: '-0.22px' }}>Regco</span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: '14px', color: INK_SOFT, lineHeight: 1.7, maxWidth: '260px', margin: 0 }}>
            AI agents for enterprise compliance. Built for regulated institutions that need control, traceability, and auditability.
          </p>
        </div>
        {cols.map((col) => (
          <div key={col.heading}>
            <p style={{ fontFamily: SANS, fontSize: '11px', fontWeight: 700, color: INK_FAINT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>{col.heading}</p>
            {col.links.map((link, i) => (
              <Link key={link} to={col.hrefs[i]} style={{ display: 'block', fontFamily: SANS, fontSize: '14px', color: INK_SOFT, textDecoration: 'none', marginBottom: '9px' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = INK)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = INK_SOFT)}
              >{link}</Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: `1px solid ${HAIR}`, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <p style={{ fontFamily: SANS, fontSize: '13px', color: INK_FAINT, margin: 0 }}>© 2026 Regco Technologies Limited. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          {[
            { label: 'Privacy Policy', href: '/legal/privacy-policy' },
            { label: 'Terms of Service', href: '/legal/terms-of-service' },
            { label: 'Cookie Policy', href: '/legal/privacy-policy' },
          ].map((item) => (
            <Link key={item.label} to={item.href} style={{ fontFamily: SANS, fontSize: '13px', color: INK_FAINT, textDecoration: 'none' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = INK_SOFT)}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = INK_FAINT)}
            >{item.label}</Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
