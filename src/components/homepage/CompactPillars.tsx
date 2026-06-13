import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

const PILLARS = [
  { num: '01', title: 'Report Automation', body: '17 returns. 6 regulators. AI-drafted from your CBS in minutes.', tag: 'CBN · NFIU · SCUML · NDIC · FIRS · PENCOM' },
  { num: '02', title: 'AML Monitoring', body: '6 real-time detection rules. Live webhook. STR auto-queue.', tag: 'Live · Rule-based · Case management' },
  { num: '03', title: 'Sanctions Screening', body: 'UN, OFAC, EU, UK HMT, and CBN lists. Nigerian PEP database.', tag: '5 lists · Fuzzy matching · Daily sync' },
  { num: '04', title: 'Regulatory Intelligence', body: 'Live CBN circulars, NFIU advisories, and compliance calendar.', tag: 'Real-time · Auto-updated · Searchable' },
];

export function CompactPillars() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} style={{ background: 'rgba(10,10,10,0.97)', padding: '100px 24px', borderTop: '1px solid var(--bd-dark)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 60, gap: 24, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, color: '#fff', margin: 0, maxWidth: 600 }}>
            Complete compliance infrastructure
          </h2>
          <Link to="/features" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--ac-teal-dark)', textDecoration: 'none' }}>
            Full platform →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
          {PILLARS.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: i * 0.08 }}
              style={{ background: 'rgba(10,10,10,1)', padding: '32px 28px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--ac-teal-dark)', letterSpacing: '0.12em' }}>{p.num}</span>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.4px' }}>{p.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5, flex: 1 }}>{p.body}</p>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.04em', marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.08)' }}>{p.tag}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CompactPillars;
