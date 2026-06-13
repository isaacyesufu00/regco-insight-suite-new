import { useRef, useState, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';

function AnimatedNumber({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const c = animate(0, target, {
      duration: 1.2, ease: [0.22, 1, 0.36, 1],
      onUpdate: v => setVal(Math.round(v)),
    });
    return c.stop;
  }, [target]);
  return <>{val}</>;
}

export function SpeedSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [replay, setReplay] = useState(0);

  const show = inView || replay > 0;
  const key = `${inView}-${replay}`;

  return (
    <section ref={ref} className="section-white" style={{ padding: '120px 24px', borderTop: '1px solid var(--bd-light)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-head)', fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 800,
          letterSpacing: '-2px', lineHeight: 1.1, color: 'var(--tx-primary)', margin: '0 0 80px', textAlign: 'center', maxWidth: 900, marginLeft: 'auto', marginRight: 'auto',
        }}>
          And all this with generation time so fast, you'll file before the reminder lands.
        </h2>

        {show && (
          <div key={key} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'end' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(80px, 14vw, 180px)', fontWeight: 800, color: 'var(--tx-primary)', lineHeight: 0.95, letterSpacing: '-6px', display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <AnimatedNumber target={2} />
                <span style={{ fontSize: '0.3em', fontWeight: 600, color: 'var(--tx-secondary)' }}>min</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(80px, 14vw, 180px)', fontWeight: 800, color: 'rgba(10,10,10,0.18)', lineHeight: 0.95, letterSpacing: '-6px', display: 'flex', alignItems: 'baseline', gap: 12, justifyContent: 'flex-end' }}>
                <span>3</span>
                <span style={{ fontSize: '0.3em', fontWeight: 600 }}>days</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ height: 14, background: 'rgba(0,0,0,0.05)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div key={`r-${key}`} initial={{ width: 0 }} animate={{ width: show ? '5.5%' : 0 }} transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', background: 'var(--ac-teal)', borderRadius: 999 }} />
          </div>
          <div style={{ height: 14, background: 'rgba(0,0,0,0.05)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div key={`m-${key}`} initial={{ width: 0 }} animate={{ width: show ? '100%' : 0 }} transition={{ delay: 0.5, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', background: 'rgba(10,10,10,0.3)', borderRadius: 999 }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--tx-muted)' }}>
          <span>REGCO</span>
          <span>MANUAL PROCESS</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
          <button onClick={() => setReplay(r => r + 1)} style={{
            fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--tx-secondary)',
            background: 'none', border: '1px solid rgba(0,0,0,0.12)', padding: '8px 18px',
            borderRadius: 'var(--r-btn)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.25)'; e.currentTarget.style.color = 'var(--tx-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'; e.currentTarget.style.color = 'var(--tx-secondary)'; }}>
            ↻ Replay
          </button>
        </div>
      </div>
    </section>
  );
}

export default SpeedSection;
