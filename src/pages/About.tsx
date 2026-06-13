import { Navbar } from '@/components/homepage/Navbar';
import { Footer } from '@/components/homepage/Footer';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const STATS = [
  { num: '17', label: 'Mandatory returns automated' },
  { num: '6', label: 'Nigerian regulators covered' },
  { num: '14', label: 'Days from kickoff to first filing' },
  { num: '48h', label: 'CBN circular response time' },
];

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="ballpark-bg" style={{ minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <Navbar />
      <section style={{ padding: '160px 28px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--tx-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>Company</p>
          <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(44px, 7vw, 96px)', fontWeight: 800, letterSpacing: '-3px', lineHeight: 1.02, color: 'var(--tx-primary)', margin: 0, maxWidth: 1000 }}>
            We're rebuilding compliance from the ground up.
          </h1>
          <p style={{ fontSize: 19, color: 'var(--tx-secondary)', maxWidth: 720, margin: '32px 0 0', lineHeight: 1.55 }}>
            RegCo was built in Abuja by Nigerian engineers and compliance veterans who watched too many MFBs fined for missed returns. We exist so no licensed institution ever misses a CBN deadline again.
          </p>
        </div>
      </section>

      <section className="section-white" style={{ padding: '80px 28px', borderTop: '1px solid var(--bd-light)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
              <p style={{ fontFamily: 'var(--font-head)', fontSize: 64, fontWeight: 800, color: 'var(--tx-primary)', margin: 0, letterSpacing: '-2px', lineHeight: 1 }}>{s.num}</p>
              <p style={{ fontSize: 14, color: 'var(--tx-secondary)', margin: '12px 0 0', maxWidth: 200 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-white" style={{ padding: '80px 28px 120px', borderTop: '1px solid var(--bd-light)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div style={{ padding: 40, background: '#fafafa', borderRadius: 'var(--r-card)', border: '1px solid var(--bd-light)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-teal)', letterSpacing: '0.12em', margin: '0 0 16px' }}>MISSION</p>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700, color: 'var(--tx-primary)', margin: '0 0 16px', letterSpacing: '-0.8px' }}>
              Zero missed deadlines for Nigerian banks.
            </h3>
            <p style={{ fontSize: 15, color: 'var(--tx-secondary)', margin: 0, lineHeight: 1.6 }}>
              Every CBN-licensed institution should be able to file every mandatory return on time, every time — without a 10-person compliance team.
            </p>
          </div>
          <div style={{ padding: 40, background: '#fafafa', borderRadius: 'var(--r-card)', border: '1px solid var(--bd-light)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-teal)', letterSpacing: '0.12em', margin: '0 0 16px' }}>VISION</p>
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700, color: 'var(--tx-primary)', margin: '0 0 16px', letterSpacing: '-0.8px' }}>
              The compliance infrastructure of African finance.
            </h3>
            <p style={{ fontSize: 15, color: 'var(--tx-secondary)', margin: 0, lineHeight: 1.6 }}>
              From Lagos to Nairobi to Accra — one platform, every regulator, full automation. Compliance as infrastructure, not a cost centre.
            </p>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--bg-dark)', padding: '100px 28px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#fff', letterSpacing: '-2px', lineHeight: 1.05, margin: '0 0 24px' }}>
          Want to see RegCo in action?
        </h2>
        <button onClick={() => navigate('/book-demo')} style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--tx-primary)', background: '#fff', border: 'none', padding: '12px 28px', borderRadius: 'var(--r-btn)', cursor: 'pointer' }}>
          Book a demo ↗
        </button>
      </section>

      <Footer />
    </div>
  );
}
