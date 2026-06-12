import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ITEMS = [
  {
    tag: '01',
    problem: 'Compliance teams spend weeks on returns that should take hours.',
    solution: 'RegCo generates all 17 returns from a single CBS upload in under 5 minutes.',
  },
  {
    tag: '02',
    problem: 'Suspicious transactions go undetected until regulators come knocking.',
    solution: 'Six AML rules run automatically on every transaction batch. Alerts fire in real time. STR generation is one click.',
  },
  {
    tag: '03',
    problem: 'Regulatory changes are missed because no one reads every CBN circular.',
    solution: "RegCo's intelligence feed monitors CBN, NFIU, SCUML, NDIC, and FIRS and flags changes that affect your institution.",
  },
];

function ProblemItem({ item }: { item: typeof ITEMS[0] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 60,
        padding: '56px 0',
        borderTop: '1px solid var(--bd-light)',
        alignItems: 'start',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 2,
            color: 'var(--tx-muted)',
            marginBottom: 16,
          }}
        >
          PROBLEM · {item.tag}
        </div>
        <motion.h3
          initial={{ opacity: 0.9 }}
          animate={inView ? { opacity: 1 } : {}}
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.25,
            letterSpacing: '-0.5px',
            color: 'var(--tx-secondary)',
            textDecoration: inView ? 'line-through' : 'none',
            textDecorationColor: 'rgba(196,74,74,0.5)',
            textDecorationThickness: 2,
            transition: 'text-decoration 0.6s ease 0.3s',
          }}
        >
          {item.problem}
        </motion.h3>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          background: '#fff',
          padding: 32,
          borderRadius: 'var(--r-card)',
          border: '1px solid var(--bd-light)',
          boxShadow: 'var(--sh-card)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              background: 'var(--ac-teal-light)',
              color: 'var(--ac-teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ac-teal)', letterSpacing: 1 }}>REGCO SOLUTION</span>
        </div>
        <p
          style={{
            fontFamily: 'var(--font-head)',
            fontSize: 22,
            fontWeight: 500,
            lineHeight: 1.4,
            color: 'var(--tx-primary)',
            letterSpacing: '-0.3px',
          }}
        >
          {item.solution}
        </p>
      </motion.div>
    </div>
  );
}

export function ProblemSolutionSection() {
  return (
    <section style={{ background: 'var(--bg-page)', padding: '120px 32px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ marginBottom: 56, maxWidth: 720 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 2,
              color: 'var(--ac-teal)',
              marginBottom: 16,
            }}
          >
            BUILT FOR NIGERIA
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
            Nigerian compliance doesn't have to be this hard.
          </h2>
        </div>
        <div>
          {ITEMS.map((item, i) => (
            <ProblemItem key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProblemSolutionSection;
