import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const productItems = [
  { label: 'Alert Triage', desc: 'Prioritize high-value compliance cases', href: '/product/alert-triage' },
  { label: 'Identity Review', desc: 'Structured KYC and due diligence workflows', href: '/product/identity-review' },
  { label: 'Sanctions Screening', desc: 'Coordinated PEP and sanctions checks', href: '/product/screening' },
  { label: 'Case Management', desc: 'Route investigations through auditable workflows', href: '/product/case-management' },
  { label: 'Reporting', desc: 'Consistent outputs for regulators and teams', href: '/product/reporting' },
  { label: 'Audit Trail', desc: 'Preserve every decision for traceability', href: '/product/audit-trail' },
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

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
      height: '60px',
      background: scrolled ? 'rgba(255,255,255,0.97)' : '#FFFFFF',
      backdropFilter: 'blur(8px)',
      borderBottom: scrolled ? '1px solid var(--n-70)' : '1px solid var(--n-40)',
      transition: 'border-color 0.2s',
      display: 'flex', alignItems: 'center',
    }}>
      <div className="atl-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--blue-800)', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>R</span>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--n-800)', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px' }}>Regco</span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProductOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 14px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500, color: 'var(--n-500)', fontFamily: 'var(--font-body)', borderRadius: 'var(--radius-md)', transition: 'background 0.12s, color 0.12s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--n-30)'; el.style.color = 'var(--n-800)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--n-500)'; }}
            >
              Products <ChevronDown size={14} style={{ transition: 'transform 0.18s', transform: productOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {productOpen && (
              <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)', width: '520px', background: '#FFFFFF', border: '1px solid var(--n-70)', borderRadius: '8px', padding: '16px', boxShadow: 'var(--shadow-xl)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                <div style={{ gridColumn: '1/-1', paddingBottom: '10px', marginBottom: '6px', borderBottom: '1px solid var(--n-40)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--n-200)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Platform features</p>
                </div>
                {productItems.map(item => (
                  <Link key={item.label} to={item.href} style={{ display: 'flex', flexDirection: 'column', padding: '10px 12px', borderRadius: '6px', textDecoration: 'none', transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--n-30)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--n-800)', marginBottom: '2px' }}>{item.label}</span>
                    <span style={{ fontSize: '12px', color: 'var(--n-400)' }}>{item.desc}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {[
            { label: 'Why Regco', href: '/why-regco' },
            { label: 'Enterprise', href: '/enterprise' },
            { label: 'Security', href: '/security' },
            { label: 'Resources', href: '/resources' },
          ].map(link => (
            <Link key={link.label} to={link.href} style={{ padding: '6px 14px', fontSize: '14px', fontWeight: 500, color: 'var(--n-500)', textDecoration: 'none', borderRadius: 'var(--radius-md)', transition: 'background 0.12s, color 0.12s' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'var(--n-30)'; el.style.color = 'var(--n-800)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.color = 'var(--n-500)'; }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Link to="/login" style={{ padding: '6px 14px', fontSize: '14px', fontWeight: 500, color: 'var(--blue-800)', textDecoration: 'none', borderRadius: 'var(--radius-md)', transition: 'background 0.12s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--blue-50)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            Log in
          </Link>
          <Link to="/book-demo" className="btn-primary" style={{ fontSize: '14px', padding: '8px 18px' }}>
            Get it free
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
