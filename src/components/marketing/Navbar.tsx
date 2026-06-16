import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, FileText, Shield, Activity, Users, Newspaper, ClipboardCheck } from 'lucide-react';

const productLinks = [
  { icon: FileText, label: 'Report Generation', sub: '17 mandatory returns automated', href: '/product' },
  { icon: Activity, label: 'AML Monitoring', sub: 'Real-time transaction screening', href: '/product' },
  { icon: Users, label: 'Customer 360', sub: 'Full customer intelligence', href: '/product' },
  { icon: Shield, label: 'Sanctions Screening', sub: 'Five global lists, 3 seconds', href: '/product' },
  { icon: Newspaper, label: 'Regulatory Intelligence', sub: 'CBN circulars and news feed', href: '/product' },
  { icon: ClipboardCheck, label: 'Audit Tracker', sub: 'Examination findings, end to end', href: '/product' },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setProductOpen(false); }, [location.pathname]);

  useEffect(() => {
    const close = () => setProductOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: '56px',
      background: scrolled ? 'rgba(255,255,255,0.96)' : '#FFFFFF',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: `1px solid ${scrolled ? 'rgba(0,0,0,0.08)' : 'transparent'}`,
      transition: 'border-color 0.2s, background 0.2s',
      display: 'flex', alignItems: 'center',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        <Link to="/" style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A', textDecoration: 'none', letterSpacing: '-0.4px', flexShrink: 0 }}>
          RegCo
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setProductOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: 'none', background: 'transparent', fontSize: '14px', color: '#374151', cursor: 'pointer', borderRadius: '6px', fontFamily: 'inherit', letterSpacing: '-0.1px', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F3F4F6'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              Product <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: productOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {productOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 8px)', left: '50%', transform: 'translateX(-50%)',
                width: '520px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)',
                borderRadius: '12px', padding: '8px', boxShadow: '0 16px 64px rgba(0,0,0,0.10)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px',
              }}>
                <div style={{ gridColumn: '1/-1', padding: '8px 10px', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '2px' }}>
                  <p style={{ fontSize: '11px', fontWeight: '600', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Features</p>
                </div>
                {productLinks.map(item => (
                  <Link key={item.label} to={item.href} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F9FAFB'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div style={{ width: '30px', height: '30px', borderRadius: '7px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <item.icon size={14} color="#374151" strokeWidth={1.7} />
                    </div>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A', margin: '0 0 1px' }}>{item.label}</p>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {[
            { label: 'Security', href: '/security' },
            { label: 'Who We Serve', href: '/who-we-serve' },
            { label: 'Company', href: '/company' },
            { label: 'About', href: '/about' },
          ].map(link => (
            <Link key={link.label} to={link.href} style={{ padding: '6px 12px', fontSize: '14px', color: '#374151', textDecoration: 'none', borderRadius: '6px', letterSpacing: '-0.1px', transition: 'background 0.1s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F3F4F6'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <Link to="/login" style={{ fontSize: '14px', color: '#374151', textDecoration: 'none', padding: '6px 12px', borderRadius: '6px', letterSpacing: '-0.1px', transition: 'background 0.1s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F3F4F6'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          >
            Log in
          </Link>
          <Link to="/book-demo" style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF', background: '#16A34A', borderRadius: '7px', padding: '7px 18px', textDecoration: 'none', letterSpacing: '-0.1px', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#15803D'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#16A34A'}
          >
            Request a demo
          </Link>
        </div>
      </div>
    </header>
  );
};
