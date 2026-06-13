import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const MILESTONES = [
  { day: 'DAY 01', title: 'Discovery', sub: 'We learn your CBS format, regulatory calendar, and team structure', above: true },
  { day: 'DAY 03', title: 'Account mapping', sub: 'CBS file columns matched automatically to CBN return templates', above: false },
  { day: 'DAY 07', title: 'First return', sub: 'First AI-generated return reviewed live with your compliance officer', above: true },
  { day: 'DAY 10', title: 'AML calibration', sub: "Transaction rules tuned to your institution's transaction patterns", above: false },
  { day: 'DAY 14 · LIVE', title: 'First filing', sub: 'Full platform active. First submission filed with CBN.', above: true, highlight: true },
];

export function TimelineSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="section-white" style={{ padding: '120px 24px', borderTop: '1px solid var(--bd-light)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-head)', fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800,
          letterSpacing: '-2px', lineHeight: 1.05, color: 'var(--tx-primary)', margin: '0 0 100px', textAlign: 'center',
        }}>
          Your first regulatory return,<br />filed in 14 days.
        </h2>

        <div style={{ position: 'relative', paddingTop: 140, paddingBottom: 140 }}>
          <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'var(--tx-primary)', transformOrigin: 'left' }} />

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${MILESTONES.length}, 1fr)`, alignItems: 'center' }}>
            {MILESTONES.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 + i * 0.18, duration: 0.5 }}
                style={{ position: 'relative', textAlign: 'center', padding: '0 8px' }}>
                {m.above && (
                  <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, marginBottom: 32, paddingBottom: 12 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: m.highlight ? 'var(--ac-teal)' : 'var(--tx-muted)', letterSpacing: '0.12em', margin: '0 0 6px' }}>{m.day}</p>
                    <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: 'var(--tx-primary)', margin: '0 0 4px', letterSpacing: '-0.3px' }}>{m.title}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tx-secondary)', margin: 0, lineHeight: 1.4 }}>{m.sub}</p>
                  </div>
                )}
                <div style={{
                  width: m.highlight ? 18 : 12, height: m.highlight ? 18 : 12, borderRadius: '50%',
                  background: m.highlight ? 'var(--ac-teal)' : 'var(--tx-primary)',
                  border: '3px solid #fff', boxShadow: m.highlight ? '0 0 0 4px rgba(11,140,110,0.2)' : '0 0 0 4px rgba(10,10,10,0.08)',
                  margin: '0 auto',
                }} />
                {!m.above && (
                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 32, paddingTop: 12 }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: 'var(--tx-muted)', letterSpacing: '0.12em', margin: '0 0 6px' }}>{m.day}</p>
                    <p style={{ fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 700, color: 'var(--tx-primary)', margin: '0 0 4px', letterSpacing: '-0.3px' }}>{m.title}</p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tx-secondary)', margin: 0, lineHeight: 1.4 }}>{m.sub}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
