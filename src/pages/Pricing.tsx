import { Navbar } from '@/components/homepage/Navbar';
import { Footer } from '@/components/homepage/Footer';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const PLANS = [
  { name: 'Unit MFB', monthly: '₦350k', setup: '₦150k', features: ['10 returns/month', '1,000 txn capacity', '1 user', 'CBN/NFIU/FIRS'] },
  { name: 'State MFB', monthly: '₦700k', setup: '₦300k', features: ['All 17 returns', 'Live webhook', '3 users', 'Board pack'], popular: true },
  { name: 'National MFB', monthly: '₦1.5M', setup: '₦500k', features: ['API access', 'Case management', '10 users', '100k customers'] },
  { name: 'PMB', monthly: '₦900k', setup: '₦400k', features: ['Mortgage returns', 'CBN PMB module', '5 users', 'Specialized AML'] },
  { name: 'Finance Company', monthly: '₦1.2M', setup: '₦450k', features: ['FCY returns', 'Multi-product', '8 users', 'Treasury module'] },
  { name: 'Commercial Bank', monthly: '₦3M', setup: '₦1.5M', features: ['Unlimited everything', 'White-label', 'Dedicated CSM', 'FlexCube integration'] },
];

export default function Pricing() {
  const navigate = useNavigate();
  return (
    <div className="ballpark-bg" style={{ minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <Navbar />
      <section style={{ padding: '160px 28px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>Pricing</p>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(44px, 7vw, 96px)', fontWeight: 800, letterSpacing: '-3px', lineHeight: 1.02, color: 'var(--tx-primary)', margin: 0 }}>
          Priced for your licence tier.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--tx-secondary)', maxWidth: 640, margin: '32px auto 0' }}>
          Transparent, all-inclusive monthly pricing. No surprise fees. Cancel anytime.
        </p>
      </section>

      <section className="section-white" style={{ padding: '40px 28px 120px', borderTop: '1px solid var(--bd-light)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {PLANS.map(p => (
            <div key={p.name} style={{
              background: '#fff', border: p.popular ? '2px solid var(--ac-teal)' : '1px solid var(--bd-light)',
              borderRadius: 'var(--r-card)', padding: 28, display: 'flex', flexDirection: 'column', position: 'relative',
              boxShadow: p.popular ? '0 8px 32px rgba(11,140,110,0.12)' : 'var(--sh-card)',
            }}>
              {p.popular && <span style={{ position: 'absolute', top: -12, left: 24, padding: '4px 12px', background: 'var(--ac-teal)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', borderRadius: 999 }}>POPULAR</span>}
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: 'var(--tx-primary)', margin: '0 0 16px', letterSpacing: '-0.4px' }}>{p.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 40, fontWeight: 800, color: 'var(--tx-primary)', letterSpacing: '-1.5px' }}>{p.monthly}</span>
                <span style={{ fontSize: 14, color: 'var(--tx-secondary)' }}>/mo</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--tx-muted)', margin: '4px 0 24px' }}>{p.setup} setup</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', flex: 1 }}>
                {p.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 8, padding: '6px 0', fontSize: 14, color: 'var(--tx-primary)' }}>
                    <Check size={16} style={{ color: 'var(--ac-teal)', flexShrink: 0, marginTop: 2 }} /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/book-demo')} style={{
                fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600,
                color: p.popular ? '#fff' : 'var(--tx-primary)',
                background: p.popular ? 'var(--tx-primary)' : 'transparent',
                border: p.popular ? 'none' : '1px solid rgba(0,0,0,0.15)',
                padding: '10px 20px', borderRadius: 'var(--r-btn)', cursor: 'pointer',
              }}>
                Book a demo →
              </button>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
