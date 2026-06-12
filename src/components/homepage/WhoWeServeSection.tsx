import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TIERS = [
  {
    id: 'unit',
    label: 'Unit MFBs',
    icon: '◎',
    headline: 'Community banking compliance at ₦350,000/month.',
    body: "Unit MFBs get CBN, NFIU, and FIRS returns automated, with AML monitoring for 1,000 transactions and a 1-user seat. Everything you need. Nothing you don't.",
    stats: ['10 returns/month', 'CBN · NFIU · FIRS', '1 user seat', '₦350k/month'],
  },
  {
    id: 'state',
    label: 'State MFBs',
    icon: '◈',
    headline: 'The full RegCo platform at state-bank scale.',
    body: 'All 17 returns across 5 regulators. Live webhook transaction feed. Customer 360 profiles. Risk analysis. Board pack generation. 3 user seats and 5,000 customer capacity.',
    stats: ['17 returns', '5 regulators', 'Live webhook', '3 user seats'],
  },
  {
    id: 'national',
    label: 'National MFBs',
    icon: '◉',
    headline: 'Enterprise compliance for nationally-licensed MFBs.',
    body: 'Everything in State MFB plus REST API access for direct CBS integration, 10 user seats, 100,000 customer capacity, and 100,000 transactions per upload.',
    stats: ['API access', '10 user seats', '100k customers', '100k txn/upload'],
  },
  {
    id: 'commercial',
    label: 'Commercial Banks',
    icon: '⬡',
    headline: 'Unlimited access for full commercial bank compliance.',
    body: 'Every feature, unlimited users, unlimited transactions. White-label option for subsidiary institutions. Dedicated onboarding. Direct FlexCube/Finacle integration on request.',
    stats: ['Unlimited users', 'White-label', 'Dedicated support', 'Direct API'],
  },
];

export function WhoWeServeSection() {
  const [active, setActive] = useState('state');
  const navigate = useNavigate();
  const tier = TIERS.find((t) => t.id === active)!;

  return (
    <section id="who" style={{ background: 'var(--bg-page)', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ marginBottom: 56 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: 'var(--ac-teal)', marginBottom: 16 }}>
            WHO WE SERVE
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(36px, 4.5vw, 56px)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-1.4px',
              color: 'var(--tx-primary)',
            }}
          >
            RegCo for every CBN tier.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 1.4fr', gap: 80, alignItems: 'start' }}>
          <div style={{ borderTop: '1px solid var(--bd-light)' }}>
            {TIERS.map((t) => {
              const isActive = active === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setActive(t.id)}
                  style={{
                    padding: '20px 0',
                    borderBottom: '1px solid var(--bd-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    transition: 'all 0.2s',
                  }}
                >
                  <span
                    style={{
                      fontSize: 22,
                      color: isActive ? 'var(--ac-teal)' : 'var(--tx-muted)',
                      transition: 'color 0.2s',
                    }}
                  >
                    {t.icon}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-head)',
                      fontSize: 20,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--tx-primary)' : 'var(--tx-secondary)',
                      letterSpacing: '-0.3px',
                      transition: 'color 0.2s',
                    }}
                  >
                    {t.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="who-active-dot"
                      style={{
                        marginLeft: 'auto',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: 'var(--ac-teal)',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 32,
                    fontWeight: 600,
                    lineHeight: 1.15,
                    letterSpacing: '-0.8px',
                    color: 'var(--tx-primary)',
                    marginBottom: 16,
                  }}
                >
                  {tier.headline}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--tx-secondary)', marginBottom: 28 }}>{tier.body}</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 28 }}>
                  {tier.stats.map((s) => (
                    <div
                      key={s}
                      style={{
                        padding: '12px 14px',
                        background: '#fff',
                        border: '1px solid var(--bd-light)',
                        borderRadius: 8,
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: 'var(--tx-primary)',
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/book-demo')}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: 'var(--tx-primary)',
                    background: 'none',
                    border: '1px solid var(--bd-light)',
                    padding: '10px 22px',
                    borderRadius: 'var(--r-btn)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.borderColor = 'rgba(28,46,74,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none';
                    e.currentTarget.style.borderColor = 'var(--bd-light)';
                  }}
                >
                  Learn about {tier.label} ›
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhoWeServeSection;
