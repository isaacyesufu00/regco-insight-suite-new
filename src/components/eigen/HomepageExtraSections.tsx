import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, FileCheck, ClipboardCheck, UserCheck, Search } from 'lucide-react';

/* ====== Helpers ====== */
const WordReveal = ({ text, size = 48, color = '#0A0A0A' }: { text: string; size?: number; color?: string }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const words = text.split(' ');
  return (
    <h2 ref={ref} style={{ fontSize: size, fontWeight: 800, color, letterSpacing: '-1.5px', lineHeight: 1.08, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0.25em' }}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block' }}
        >
          {w}
        </motion.span>
      ))}
    </h2>
  );
};

const Counter = ({ to, suffix = '' }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val}{suffix}</span>;
};

/* ====== SECTION A — BOARD PACK ====== */
export const BoardPackSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const rows = [
    { label: 'Returns Filed', value: '16 of 16' },
    { label: 'AML Flags', value: '12' },
    { label: 'STRs Filed', value: '2' },
    { label: 'KYC Rate', value: '94%' },
    { label: 'Customers Screened', value: '3,420' },
    { label: 'Tasks', value: '12 of 12' },
  ];
  const bullets = [
    'Pulls regulatory returns filed this month',
    'Compiles AML/CFT flagged transactions and STR count',
    'Reports KYC completion rate across all customers',
    'Summarises sanctions screening volume and matches',
    'Shows monthly compliance task completion',
    'Includes certification block ready for sign-off',
  ];
  return (
    <section ref={ref} style={{ background: '#F5F5F0', padding: '120px 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <motion.div initial={{ opacity: 0, scale: 0.94, rotate: -1 }} animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div style={{ background: '#FFFFFF', borderRadius: 14, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.10)' }}>
            <div style={{ background: '#0A0A0A', padding: '20px 24px', color: '#FFFFFF' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Compliance Committee Report</p>
              <p style={{ fontSize: 16, fontWeight: 700, margin: '4px 0 0' }}>May 2026</p>
            </div>
            <div style={{ padding: '8px 0' }}>
              {rows.map((r, i) => (
                <motion.div key={r.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.06 }}
                  style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <span style={{ fontSize: 13, color: '#525252' }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#0A0A0A' }}>{r.value}</span>
                </motion.div>
              ))}
            </div>
            <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ background: '#0A0A0A', color: '#FFFFFF', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <Download size={13} /> Download
              </button>
            </div>
          </div>
        </motion.div>

        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9B9B9B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>NEW — COMPLIANCE REPORTING</p>
          <WordReveal text="Your monthly board pack. Generated in seconds." />
          <p style={{ fontSize: 16, color: '#525252', margin: '20px 0 28px', lineHeight: 1.55, maxWidth: 460 }}>
            RegCo pulls every compliance metric for the month and assembles a board-ready report. What used to take two days takes thirty seconds.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bullets.map((b, i) => (
              <motion.div key={b}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 18, height: 18, borderRadius: 999, background: '#0A0A0A', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0, marginTop: 1 }}>✓</div>
                <span style={{ fontSize: 14, color: '#0A0A0A' }}>{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ====== SECTION B — AUDIT TRACKER ====== */
export const AuditTrackerSection = () => {
  const cards = [
    { icon: ClipboardCheck, title: 'Track every finding', desc: 'Log every CBN, NDIC, or internal audit finding in one register with severity, category, and source.' },
    { icon: UserCheck, title: 'Assign owners and deadlines', desc: 'Every issue gets an owner, a due date, and a status. Overdue items auto-flag in red so nothing slips.' },
    { icon: FileCheck, title: 'Close with evidence', desc: 'Document the remediation, attach evidence notes, and close the issue — ready for the next examination.' },
  ];
  return (
    <section style={{ background: '#FFFFFF', padding: '120px 0' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9B9B9B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>NEW — AUDIT TRACKER</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <WordReveal text="Never lose track of an examination finding." />
        </div>
        <p style={{ fontSize: 16, color: '#525252', margin: '20px auto 56px', lineHeight: 1.55, maxWidth: 620 }}>
          A single register for every CBN examination finding, internal audit issue, and self-assessment gap — owned, tracked, and closed.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 22 }}>
          {cards.map((c, i) => (
            <motion.div key={c.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4 }}
              style={{ background: '#F5F5F0', borderRadius: 16, padding: 32, textAlign: 'left', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div style={{ width: 46, height: 46, borderRadius: 12, background: '#0A0A0A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                <c.icon size={20} color="#FFFFFF" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0A0A0A', margin: '0 0 8px', letterSpacing: '-0.3px' }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: '#525252', margin: 0, lineHeight: 1.55 }}>{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ====== SECTION C — REGULATORY INTELLIGENCE ====== */
export const RegulatoryIntelSection = () => {
  const sources = ['Nairametrics', 'BusinessDay', 'Punch Nigeria', 'Vanguard', 'The Guardian'];
  const news = [
    { src: 'Nairametrics', title: 'CBN raises monetary policy rate by 50 basis points', time: '12 min ago', unread: true },
    { src: 'BusinessDay', title: 'NDIC announces revised deposit insurance coverage limits', time: '2 hr ago', unread: true },
    { src: 'Punch Nigeria', title: 'NFIU issues advisory on virtual asset service providers', time: '5 hr ago', unread: false },
    { src: 'Vanguard', title: 'CBN circular on AML/CFT compliance for microfinance banks', time: '1 day ago', unread: false },
  ];
  return (
    <section style={{ background: '#0A0A0A', padding: '120px 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>NEW — REGULATORY INTELLIGENCE</p>
          <WordReveal text="CBN circulars. Industry news. Monthly tasks." color="#FFFFFF" />
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', margin: '20px 0 28px', lineHeight: 1.55, maxWidth: 460 }}>
            Six Nigerian regulatory and banking sources, automatically refreshed every three hours. Plus a monthly task checklist that resets itself.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {sources.map((s) => (
              <span key={s} style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>{s}</span>
            ))}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          style={{ background: '#161616', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#FFFFFF' }}>Live News Feed</span>
          </div>
          {news.map((n, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{ padding: '16px 22px', borderBottom: i < news.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.unread ? '#FFFFFF' : 'rgba(255,255,255,0.2)', marginTop: 6, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{n.src}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>•</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: 13.5, color: '#FFFFFF', margin: 0, lineHeight: 1.45 }}>{n.title}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

/* ====== SECTION D — PLATFORM COUNTER ====== */
export const PlatformCounterSection = () => {
  const stats = [
    { n: 16, suf: '', label: 'Returns automated' },
    { n: 5, suf: '', label: 'Regulators covered' },
    { n: 5, suf: '', label: 'Global sanctions lists' },
    { n: 12, suf: '', label: 'Monthly tasks tracked' },
  ];
  return (
    <section style={{ background: '#F5F5F0', padding: '120px 0' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#9B9B9B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>THE PLATFORM</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 64 }}>
          <WordReveal text="Everything a compliance team needs in one place." />
        </div>
        <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid rgba(0,0,0,0.07)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', overflow: 'hidden' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ padding: '48px 24px', borderRight: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
              <p style={{ fontSize: 56, fontWeight: 800, color: '#0A0A0A', margin: 0, letterSpacing: '-2px', lineHeight: 1 }}>
                <Counter to={s.n} suffix={s.suf} />
              </p>
              <p style={{ fontSize: 13, color: '#6B6B6B', margin: '12px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
