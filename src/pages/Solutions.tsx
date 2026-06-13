import { Navbar } from '@/components/homepage/Navbar';
import { Footer } from '@/components/homepage/Footer';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const TIERS = [
  { id: 'unit', label: 'Unit MFB', monthly: '₦350,000', setup: '₦150,000', features: ['CBN/NFIU/FIRS returns (10/month)', 'Batch transaction monitor (1,000 txns)', 'Regulatory intelligence feed', 'Compliance calendar', '1 user seat'], challenge: 'Unit MFBs face the same CBN requirements as large banks with a fraction of the compliance team. Every missed return is a minimum ₦2M fine.' },
  { id: 'state', label: 'State MFB', monthly: '₦700,000', setup: '₦300,000', features: ['All 17 mandatory returns', 'Live webhook transaction feed', 'Customer 360 profiles', 'Sanctions & PEP screening', 'Risk analysis (CAMEL)', 'Board pack generator', '3 user seats', '5,000 customer capacity'], challenge: 'State MFBs operating across multiple branches need full 5-regulator coverage, live transaction monitoring, and team-level access control.' },
  { id: 'national', label: 'National MFB', monthly: '₦1,500,000', setup: '₦500,000', features: ['Everything in State MFB', 'REST API access for CBS integration', 'Audit tracker with tamper-proof logs', 'Case management (ECM)', '10 user seats', '100,000 customer capacity', '100,000 transactions per upload'], challenge: 'National MFBs with tens of thousands of customers need bulk data ingestion, high-volume AML screening, and API access for direct CBS integration.' },
  { id: 'commercial', label: 'Commercial Bank', monthly: '₦3,000,000', setup: '₦1,500,000', features: ['All features, unlimited', 'White-label option for group subsidiaries', 'Dedicated onboarding manager', 'Custom API integration (FlexCube/Finacle)', 'Unlimited users', 'Unlimited transactions'], challenge: 'Commercial banks under full CBN regulation need every return, every feature, unlimited scale, and the option to white-label for subsidiary institutions.' },
];

export default function Solutions() {
  const [active, setActive] = useState('state');
  const navigate = useNavigate();
  const tier = TIERS.find(t => t.id === active)!;

  return (
    <div className="ballpark-bg" style={{ minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <Navbar />
      <section style={{ padding: '160px 28px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--tx-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            Solutions
          </p>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(44px, 7vw, 96px)', fontWeight: 800, letterSpacing: '-3px', lineHeight: 1.02, color: 'var(--tx-primary)', margin: 0 }}>
            Built for every CBN-licensed institution
          </h1>
        </div>
      </section>

      <section className="section-white" style={{ padding: '40px 28px 120px', borderTop: '1px solid var(--bd-light)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 48 }}>
          <div>
            {TIERS.map(t => {
              const isActive = t.id === active;
              return (
                <div key={t.id} onClick={() => setActive(t.id)}
                  style={{ padding: '16px 0', borderBottom: '1px solid var(--bd-light)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: isActive ? 'var(--ac-teal)' : 'rgba(0,0,0,0.15)' }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--tx-primary)' : 'var(--tx-secondary)' }}>{t.label}</span>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tier.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--tx-secondary)', lineHeight: 1.6, margin: '0 0 32px' }}>{tier.challenge}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-head)', fontSize: 56, fontWeight: 800, color: 'var(--tx-primary)', letterSpacing: '-2px' }}>{tier.monthly}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--tx-secondary)' }}>/month</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tx-muted)', margin: '0 0 32px' }}>{tier.setup} one-time setup</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px' }}>
                {tier.features.map(f => (
                  <li key={f} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--bd-light)' }}>
                    <Check size={18} style={{ color: 'var(--ac-teal)', flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--tx-primary)' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/book-demo')} style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#fff', background: 'var(--tx-primary)', border: 'none', padding: '12px 28px', borderRadius: 'var(--r-btn)', cursor: 'pointer' }}>
                Book demo for {tier.label} →
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />
    </div>
  );
}
