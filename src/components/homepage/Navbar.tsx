import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LINKS: [string, string][] = [
  ['Products', '#products'],
  ['Solutions', '#who'],
  ['Pricing', '#pricing'],
  ['Blog', '/blog/updates'],
  ['Company', '/contact/support'],
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? 'rgba(245,245,247,0.85)' : 'rgba(245,245,247,0)',
        backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--bd-light)' : '1px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          height: 64,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textDecoration: 'none',
            fontFamily: 'var(--font-head)',
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--tx-primary)',
            letterSpacing: '-0.4px',
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: 'var(--tx-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            R
          </span>
          RegCo
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {LINKS.map(([label, href]) =>
            href.startsWith('/') ? (
              <Link
                key={label}
                to={href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--tx-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--tx-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--tx-secondary)')}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'var(--tx-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.12s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--tx-primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--tx-secondary)')}
              >
                {label}
              </a>
            )
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--tx-secondary)',
              background: 'none',
              border: 'none',
              padding: '7px 14px',
              borderRadius: 'var(--r-btn)',
              cursor: 'pointer',
              transition: 'color 0.12s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--tx-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--tx-secondary)')}
          >
            Sign in
          </button>
          <button
            onClick={() => navigate('/book-demo')}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              color: '#fff',
              background: 'var(--tx-primary)',
              border: 'none',
              padding: '8px 18px',
              borderRadius: 'var(--r-btn)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'opacity 0.12s',
              letterSpacing: '-0.1px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            Get started ›
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
