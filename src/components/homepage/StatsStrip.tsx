import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

const STATS = [
  { value: 17, suffix: '', label: 'Mandatory returns automated' },
  { value: 6, suffix: '', label: 'Regulators (CBN, NFIU, SCUML, NDIC, FIRS, PENCOM)' },
  { value: 2, suffix: 'M+', prefix: '₦', label: 'Min CBN fine avoided per violation' },
  { value: 99.9, suffix: '%', label: 'Platform uptime SLA' },
];

function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const next = value * ease;
      setDisplay(parseFloat(next.toFixed(value % 1 !== 0 ? 1 : 0)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

export function StatsStrip() {
  return (
    <section style={{ background: 'var(--bg-page)', padding: '40px 32px 80px' }}>
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          background: '#fff',
          borderRadius: 'var(--r-card)',
          border: '1px solid var(--bd-light)',
          boxShadow: 'var(--sh-card)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          overflow: 'hidden',
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              padding: '32px 28px',
              borderLeft: i > 0 ? '1px solid var(--bd-light)' : 'none',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-head)',
                fontSize: 40,
                fontWeight: 600,
                color: 'var(--tx-primary)',
                letterSpacing: '-1.2px',
                lineHeight: 1,
                marginBottom: 10,
              }}
            >
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </div>
            <div style={{ fontSize: 13, color: 'var(--tx-secondary)', lineHeight: 1.5 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatsStrip;
