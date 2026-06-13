import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const ITEMS = [
  { tag: '01', problem: 'Compliance teams spend days on returns that should take minutes.', solution: 'RegCo generates all 17 returns from a single CBS upload in under 5 minutes.' },
  { tag: '02', problem: 'Suspicious transactions go undetected until regulators arrive.', solution: 'Six AML detection rules run automatically. Alerts, STRs, and case management in one place.' },
  { tag: '03', problem: 'Regulatory changes are missed because no one reads every CBN circular.', solution: "RegCo's live intelligence feed flags every circular that affects your institution.", },
];

function Row({ item, i }: { item: typeof ITEMS[0]; i: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.1 }}
      style={{ display: 'grid', gridTemplateColumns: '60px 1fr 1.1fr', gap: 24, padding: '32px 0', borderTop: '1px solid var(--bd-light)', alignItems: 'start' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: 'var(--tx-muted)', letterSpacing: '0.1em' }}>{item.tag}</span>
      <p style={{ fontFamily: 'var(--font-head)', fontSize: 21, fontWeight: 600, color: 'var(--tx-primary)', margin: 0, lineHeight: 1.35, letterSpacing: '-0.3px' }}>{item.problem}</p>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ display: 'inline-block', padding: '4px 10px', background: 'var(--ac-teal-light)', color: 'var(--ac-teal)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', borderRadius: 4, textTransform: 'uppercase', flexShrink: 0, marginTop: 4 }}>Solution</span>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--tx-secondary)', margin: 0, lineHeight: 1.5 }}>{item.solution}</p>
      </div>
    </motion.div>
  );
}

export function CompactProblemSolution() {
  return (
    <section className="section-white" style={{ padding: '100px 24px', borderTop: '1px solid var(--bd-light)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--tx-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px', textAlign: 'center' }}>
          The problem · the solution
        </p>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800, letterSpacing: '-2px', lineHeight: 1.05, color: 'var(--tx-primary)', margin: '0 0 60px', textAlign: 'center' }}>
          Why CBN-licensed banks choose RegCo
        </h2>
        {ITEMS.map((item, i) => <Row key={i} item={item} i={i} />)}
        <div style={{ borderTop: '1px solid var(--bd-light)', paddingTop: 32, textAlign: 'center' }}>
          <Link to="/features" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--ac-teal)', textDecoration: 'none' }}>
            See full platform overview →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CompactProblemSolution;
