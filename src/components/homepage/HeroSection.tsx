import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DOT_ROWS = 28;
const DOT_COLS = 36;
const DOT_SPACING = 18;

const NIGERIA_CELLS = new Set<string>([
  ...Array.from({ length: 6 }, (_, c) => `10,${c + 10}`),
  ...Array.from({ length: 8 }, (_, c) => `11,${c + 9}`),
  ...Array.from({ length: 10 }, (_, c) => `12,${c + 8}`),
  ...Array.from({ length: 12 }, (_, c) => `13,${c + 8}`),
  ...Array.from({ length: 13 }, (_, c) => `14,${c + 8}`),
  ...Array.from({ length: 14 }, (_, c) => `15,${c + 7}`),
  ...Array.from({ length: 15 }, (_, c) => `16,${c + 7}`),
  ...Array.from({ length: 14 }, (_, c) => `17,${c + 7}`),
  ...Array.from({ length: 13 }, (_, c) => `18,${c + 8}`),
  ...Array.from({ length: 12 }, (_, c) => `19,${c + 8}`),
  ...Array.from({ length: 10 }, (_, c) => `20,${c + 9}`),
  ...Array.from({ length: 8 }, (_, c) => `21,${c + 10}`),
  ...Array.from({ length: 5 }, (_, c) => `22,${c + 11}`),
  '9,19', '9,20', '9,21', '10,20', '10,21',
]);

function NigeriaDotMap() {
  const width = DOT_COLS * DOT_SPACING;
  const height = DOT_ROWS * DOT_SPACING;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {Array.from({ length: DOT_ROWS }, (_, r) =>
        Array.from({ length: DOT_COLS }, (_, c) => {
          const key = `${r},${c}`;
          const isNigeria = NIGERIA_CELLS.has(key);
          const isAbuja = r === 15 && c === 15;
          const cx = c * DOT_SPACING + DOT_SPACING / 2;
          const cy = r * DOT_SPACING + DOT_SPACING / 2;

          if (isAbuja) {
            return (
              <g key={key}>
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="var(--ac-teal)"
                  opacity={0.25}
                  animate={{ r: [6, 14, 6], opacity: [0.25, 0, 0.25] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
                />
                <circle cx={cx} cy={cy} r={3.5} fill="var(--ac-teal)" />
              </g>
            );
          }
          if (isNigeria) {
            return <circle key={key} cx={cx} cy={cy} r={2.4} fill="var(--tx-primary)" opacity={0.55} />;
          }
          return <circle key={key} cx={cx} cy={cy} r={1.2} fill="var(--tx-primary)" opacity={0.08} />;
        })
      )}
    </svg>
  );
}

function ComplianceCard() {
  const rows = [
    { label: 'CBN Monthly Return', status: 'Filed', color: 'var(--ac-teal)' },
    { label: 'NFIU AML Report', status: 'Processing', color: '#b58a00' },
    { label: 'VAT — FIRS', status: 'Due in 3d', color: '#c44a4a' },
  ];
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 'var(--r-card)',
        padding: 20,
        width: 320,
        boxShadow: 'var(--sh-float)',
        border: '1px solid var(--bd-light)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--tx-muted)', fontWeight: 500 }}>Compliance score</div>
          <div style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 600, color: 'var(--tx-primary)', letterSpacing: '-0.6px' }}>
            87<span style={{ color: 'var(--tx-muted)', fontSize: 18, fontWeight: 400 }}> / 100</span>
          </div>
        </div>
        <div
          style={{
            background: 'var(--ac-teal-light)',
            color: 'var(--ac-teal)',
            padding: '4px 10px',
            borderRadius: 980,
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          ✓ Good standing
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map((r) => (
          <div
            key={r.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 12px',
              background: 'var(--bg-page)',
              borderRadius: 6,
              fontSize: 13,
            }}
          >
            <span style={{ color: 'var(--tx-primary)', fontWeight: 500 }}>{r.label}</span>
            <span style={{ color: r.color, fontWeight: 600, fontSize: 12 }}>{r.status}</span>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 14,
          padding: '10px 12px',
          borderRadius: 6,
          background: 'var(--tx-primary)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        Generate CBN Return →
      </div>
    </div>
  );
}

const HEADING = "Every Nigerian bank's compliance, automated.";

export function HeroSection() {
  const navigate = useNavigate();
  const words = HEADING.split(' ');

  return (
    <section
      style={{
        minHeight: '100vh',
        paddingTop: 120,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-page)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          right: -60,
          top: 100,
          opacity: 0.95,
          pointerEvents: 'none',
        }}
      >
        <NigeriaDotMap />
      </div>

      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '0 32px',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr',
          gap: 60,
          alignItems: 'center',
        }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 12px',
              background: 'var(--ac-teal-light)',
              border: '1px solid rgba(11,140,110,0.15)',
              borderRadius: 980,
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--ac-teal)',
              marginBottom: 28,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ac-teal)' }} />
            CBN Compliant · NFIU Certified · NDPA Ready
          </motion.div>

          <h1
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(44px, 6.2vw, 78px)',
              fontWeight: 600,
              lineHeight: 1.02,
              letterSpacing: '-2px',
              color: 'var(--tx-primary)',
              marginBottom: 28,
            }}
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'inline-block', marginRight: '0.25em' }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            style={{
              fontSize: 18,
              lineHeight: 1.55,
              color: 'var(--tx-secondary)',
              maxWidth: 520,
              marginBottom: 36,
            }}
          >
            17 mandatory returns across 6 regulators. Live AML monitoring. AI-powered alerts. Built exclusively for CBN-licensed institutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
          >
            <button
              onClick={() => navigate('/book-demo')}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                background: 'var(--tx-primary)',
                border: 'none',
                padding: '12px 22px',
                borderRadius: 'var(--r-btn)',
                cursor: 'pointer',
                transition: 'opacity 0.12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Get started ›
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--tx-secondary)',
                background: 'none',
                border: '1px solid var(--bd-light)',
                padding: '11px 20px',
                borderRadius: 'var(--r-btn)',
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(28,46,74,0.2)';
                e.currentTarget.style.color = 'var(--tx-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--bd-light)';
                e.currentTarget.style.color = 'var(--tx-secondary)';
              }}
            >
              View documentation
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'flex', justifyContent: 'flex-end', position: 'relative', zIndex: 2 }}
        >
          <ComplianceCard />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
