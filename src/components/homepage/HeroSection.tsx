import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const navigate = useNavigate();
  const words = ['Compliance', 'without', 'the chaos.'];

  return (
    <section style={{ position: 'relative', padding: '160px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 900, height: 600, background: 'radial-gradient(ellipse, rgba(11,140,110,0.08) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', zIndex: 1 }}>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(11,140,110,0.08)', border: '1px solid rgba(11,140,110,0.2)', borderRadius: 999, marginBottom: 32 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ac-teal)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            CBN-Compliant · NFIU-Certified · NDPA-Ready
          </span>
        </motion.div>

        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(56px, 9vw, 128px)', fontWeight: 800, lineHeight: 0.96, letterSpacing: '-4px', color: 'var(--tx-primary)', margin: 0 }}>
          {words.map((w, i) => (
            <motion.span key={i} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }} style={{ display: 'block' }}>
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }}
          style={{ fontFamily: 'var(--font-body)', fontSize: 19, lineHeight: 1.55, color: 'var(--tx-secondary)', maxWidth: 640, margin: '36px auto 0', fontWeight: 400 }}>
          17 mandatory returns. 6 regulators. Live AML monitoring. AI-powered case management. Built exclusively for CBN-licensed Nigerian institutions.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.85 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 44, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/book-demo')} style={{
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: '#fff',
            background: 'var(--tx-primary)', border: 'none', padding: '13px 28px', borderRadius: 'var(--r-btn)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'opacity 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}>
            Book a demo ↗
          </button>
          <button onClick={() => navigate('/login')} style={{
            fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 500, color: 'var(--tx-secondary)',
            background: 'none', border: '1px solid rgba(0,0,0,0.12)', padding: '12px 24px',
            borderRadius: 'var(--r-btn)', cursor: 'pointer', transition: 'all 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.25)'; e.currentTarget.style.color = 'var(--tx-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'var(--tx-secondary)'; }}>
            Get started →
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
