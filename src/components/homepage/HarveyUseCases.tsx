import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const USE_CASES = [
  'Regulatory Return Filing',
  'AML Transaction Monitoring',
  'STR Drafting',
  'Customer 360 Profiles',
  'Sanctions Screening',
  'Board Pack Generation',
  'Audit Issue Tracking',
  'CBN Circular Intelligence',
  'Compliance Calendaring',
  'Case Management',
  'PENCOM Remittance',
  'Risk Scoring',
  'PEP Screening',
  'Compliance Exam Prep',
];

const ITEM_HEIGHT = 76;
const VISIBLE = 7;
const HALF = Math.floor(VISIBLE / 2);

export function HarveyUseCases() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % USE_CASES.length), 2400);
    return () => clearInterval(t);
  }, []);

  const items = Array.from({ length: VISIBLE }, (_, i) => {
    const distance = i - HALF;
    const idx = ((active + distance) % USE_CASES.length + USE_CASES.length) % USE_CASES.length;
    return { text: USE_CASES[idx], distance };
  });

  return (
    <section className="section-white" style={{ padding: '100px 24px', borderTop: '1px solid var(--bd-light)', borderBottom: '1px solid var(--bd-light)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr auto', gap: 48, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(28px, 3.2vw, 44px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1.5px', color: 'var(--tx-primary)', margin: 0 }}>
            The top compliance teams in Nigeria use RegCo for
          </h2>
        </div>

        <div style={{ position: 'relative', height: ITEM_HEIGHT * VISIBLE, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: ITEM_HEIGHT * 2, background: 'linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: ITEM_HEIGHT * 2, background: 'linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))', zIndex: 2, pointerEvents: 'none' }} />
          {items.map(({ text, distance }, i) => {
            const abs = Math.abs(distance);
            const opacity = abs === 0 ? 1 : abs === 1 ? 0.38 : abs === 2 ? 0.17 : 0.06;
            return (
              <div key={`${active}-${i}`} style={{
                position: 'absolute', top: i * ITEM_HEIGHT, left: 0, right: 0, height: ITEM_HEIGHT,
                display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                opacity, transform: `scale(${abs === 0 ? 1 : 0.98})`,
                transition: 'opacity 0.55s ease, transform 0.55s ease',
              }}>
                <span style={{
                  fontFamily: 'var(--font-head)', fontSize: 'clamp(24px, 2.4vw, 36px)', fontWeight: 700,
                  letterSpacing: '-0.8px', color: 'var(--tx-primary)', lineHeight: 1,
                }}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>

        <div>
          <button onClick={() => navigate('/features')} style={{
            fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: 'var(--tx-primary)',
            background: 'none', border: '1px solid rgba(0,0,0,0.18)', padding: '10px 20px',
            borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.18)'; }}>
            Explore Platform →
          </button>
        </div>
      </div>
    </section>
  );
}

export default HarveyUseCases;
