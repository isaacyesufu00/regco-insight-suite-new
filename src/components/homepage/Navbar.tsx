import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Platform', path: '/features' },
  { label: 'Solutions', path: '/solutions' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Company', path: '/about' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)',
      backdropFilter: 'saturate(180%) blur(14px)',
      WebkitBackdropFilter: 'saturate(180%) blur(14px)',
      borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent',
      transition: 'all 0.2s',
      fontFamily: 'var(--font-body)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 800, color: 'var(--tx-primary)', textDecoration: 'none', letterSpacing: '-0.5px' }}>
          RegCo
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="hidden md:flex">
          {NAV_LINKS.map(({ label, path }) => {
            const active = location.pathname.startsWith(path);
            return (
              <Link key={path} to={path} style={{
                fontSize: 14, fontWeight: 500,
                color: active ? 'var(--tx-primary)' : 'var(--tx-secondary)',
                textDecoration: 'none', padding: '7px 14px', borderRadius: 6, transition: 'color 0.12s',
              }}>
                {label}
              </Link>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/login')} style={{
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
            color: 'var(--tx-secondary)', background: 'none', border: '1px solid transparent',
            padding: '7px 14px', borderRadius: 'var(--r-btn)', cursor: 'pointer', transition: 'all 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'var(--tx-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.color = 'var(--tx-secondary)'; }}>
            Sign in
          </button>
          <button onClick={() => navigate('/book-demo')} style={{
            fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#fff',
            background: 'var(--tx-primary)', border: 'none', padding: '9px 20px',
            borderRadius: 'var(--r-btn)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            transition: 'opacity 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
            Book a demo ↗
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
