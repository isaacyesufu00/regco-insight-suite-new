import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

export function CompactFlows() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const aml = [
    { name: 'Emeka Okafor', amount: '₦6.5M', type: 'CTR', critical: true },
    { name: 'Yusuf Ibrahim', amount: '₦12M', type: 'VELOCITY', critical: true },
    { name: 'Fatima Al-Hassan', amount: '₦4.75M', type: 'STRUCTURING', critical: false },
  ];

  return (
    <section ref={ref} className="section-white" style={{ padding: '100px 24px', borderTop: '1px solid var(--bd-light)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: 48, gap: 24, flexWrap: 'wrap' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(32px, 4.2vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, color: 'var(--tx-primary)', margin: 0 }}>
            See it in action
          </h2>
          <Link to="/features" style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: 'var(--ac-teal)', textDecoration: 'none' }}>
            All features →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
            style={{ background: '#fff', border: '1px solid var(--bd-light)', borderRadius: 'var(--r-card)', overflow: 'hidden', boxShadow: 'var(--sh-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px', borderBottom: '1px solid var(--bd-light)', background: '#fafafa' }}>
              {['#fc5753', '#fdbc2c', '#34c748'].map(c => <span key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, display: 'inline-block' }} />)}
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--tx-secondary)', marginLeft: 8 }}>CBN_MFB_Return_May2026.txt</span>
            </div>
            <div style={{ padding: '24px', fontFamily: 'ui-monospace, monospace', fontSize: 13, lineHeight: 1.9 }}>
              <p style={{ margin: 0, color: 'var(--tx-primary)' }}>TOTAL ASSETS: ₦3,250,900,000</p>
              <p style={{ margin: 0, color: 'var(--tx-primary)' }}>CAR: 14.44% <span style={{ color: 'var(--ac-teal)' }}>✓</span></p>
              <p style={{ margin: 0, color: 'var(--tx-primary)' }}>LIQUIDITY: 55.27% <span style={{ color: 'var(--ac-teal)' }}>✓</span></p>
              <p style={{ margin: 0, color: 'var(--tx-primary)' }}>NPL: 4.00% <span style={{ color: 'var(--ac-teal)' }}>✓</span></p>
              <p style={{ margin: '12px 0 0', color: 'var(--ac-teal)', fontWeight: 600 }}>✓ All ratios within CBN limits</p>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--bd-light)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tx-secondary)' }}>
              Report Generation · <Link to="/features" style={{ color: 'var(--ac-teal)', textDecoration: 'none', fontWeight: 600 }}>Learn more →</Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}
            style={{ background: '#fff', border: '1px solid var(--bd-light)', borderRadius: 'var(--r-card)', overflow: 'hidden', boxShadow: 'var(--sh-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--bd-light)', background: '#fafafa' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: 'var(--tx-primary)' }}>Live Transaction Monitor</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ac-teal)', fontWeight: 600 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ac-teal)', animation: 'pulse 1.5s infinite' }} /> LIVE
              </span>
            </div>
            <div style={{ padding: 8 }}>
              {aml.map((r, i) => (
                <div key={i} style={{ padding: '14px 14px', borderBottom: i < aml.length - 1 ? '1px solid var(--bd-light)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--tx-primary)' }}>{r.name}</p>
                    <p style={{ margin: '2px 0 0', fontFamily: 'ui-monospace, monospace', fontSize: 13, color: 'var(--tx-secondary)' }}>{r.amount}</p>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 4, background: r.critical ? '#ffeded' : '#fff8e6', color: r.critical ? '#c2362e' : '#a16a00', letterSpacing: '0.06em' }}>{r.type}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--bd-light)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--tx-secondary)' }}>
              AML Monitoring · <Link to="/features" style={{ color: 'var(--ac-teal)', textDecoration: 'none', fontWeight: 600 }}>Learn more →</Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CompactFlows;
