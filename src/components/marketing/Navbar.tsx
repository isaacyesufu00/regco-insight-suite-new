import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
const SANS = '"DM Sans", system-ui, sans-serif';

const productItems = [
  { label: 'Alert Triage', desc: 'Prioritize high-value compliance cases', href: '/product/alert-triage' },
  { label: 'Identity Review', desc: 'Structured KYC and due diligence workflows', href: '/product/identity-review' },
  { label: 'Sanctions Screening', desc: 'Coordinated PEP and sanctions checks', href: '/product/screening' },
  { label: 'Case Management', desc: 'Route investigations through auditable workflows', href: '/product/case-management' },
  { label: 'Reporting', desc: 'Consistent outputs for regulators and teams', href: '/product/reporting' },
  { label: 'Audit Trail', desc: 'Preserve every decision for traceability', href: '/product/audit-trail' },
];

const navLinks = [
  { label: 'Why Regco', href: '/why-regco' },
  { label: 'Enterprise', href: '/enterprise' },
  { label: 'Docs', href: '/docs' },
  { label: 'Resources', href: '/resources' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { setProductOpen(false); }, [location.pathname]);

  const isActive = (href: string) =>
    href === '/docs' ? location.pathname.startsWith('/docs') : location.pathname === href;

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      height: '64px',
      background: scrolled ? 'rgba(255,255,255,0.92)' : '#FFFFFF',
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${scrolled ? '#0000001A' : '#0000001A'}`,
      display: 'flex', alignItems: 'center',
      fontFamily: SANS,
    }}>
      <div style={{ boxSizing: 'border-box', marginLeft: 'auto', marginRight: 'auto', width: 'min(100% - 32px, 1040px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ width: '6px', height: '16px', background: '#A76D3B', display: 'inline-block' }} />
          <span style={{ fontFamily: SERIF, fontSize: '22px', fontWeight: 600, color: '#000000CC', letterSpacing: '-0.22px' }}>Regco</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProductOpen((p) => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: SANS, fontSize: '15px', color: '#00000099', borderRadius: '6px', transition: 'color 0.12s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#000000CC')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#00000099')}
            >
              Products
            </button>
            {productOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', width: '520px', background: '#FFFFFF', border: '1px solid #0000001A', borderRadius: '12px', padding: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                <div style={{ gridColumn: '1/-1', paddingBottom: '10px', marginBottom: '6px', borderBottom: '1px solid #0000001A' }}>
                  <p style={{ fontFamily: SANS, fontSize: '11px', fontWeight: 700, color: '#00000066', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Platform features</p>
                </div>
                {productItems.map((item) => (
                  <Link key={item.label} to={item.href} style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', borderRadius: '6px', textDecoration: 'none' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#0000000A')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                  >
                    <span style={{ fontFamily: SANS, fontSize: '14px', fontWeight: 600, color: '#000000CC', marginBottom: '2px' }}>{item.label}</span>
                    <span style={{ fontFamily: SANS, fontSize: '12px', color: '#00000099' }}>{item.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link key={link.label} to={link.href} style={{ padding: '8px 14px', fontFamily: SANS, fontSize: '15px', color: active ? '#000000CC' : '#00000099', textDecoration: 'none', borderRadius: '6px', transition: 'color 0.12s' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#000000CC')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = active ? '#000000CC' : '#00000099')}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <Link to="/login" style={{ padding: '8px 14px', fontFamily: SANS, fontSize: '15px', color: '#00000099', textDecoration: 'none', borderRadius: '6px' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#000000CC')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#00000099')}
          >
            Log in
          </Link>
          <Link to="/book-demo" style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 500, color: '#FFFFFF', background: '#000000CC', textDecoration: 'none', borderRadius: '999px', padding: '9px 18px', transition: 'background 0.15s' }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#000000')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#000000CC')}
          >
            Get it free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
