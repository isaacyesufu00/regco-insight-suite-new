import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PILLARS = [
  { num: '01', title: 'Report Automation', body: '17 mandatory returns. Every regulator. AI-drafted from CBS data in minutes.', tag: 'CBN · NFIU · SCUML · NDIC · FIRS · PENCOM' },
  { num: '02', title: 'AML & Transaction Monitoring', body: 'Six detection rules on every transaction. Live webhook feed. Auto-escalation to STR queue.', tag: 'Real-time · 6 AML rules' },
  { num: '03', title: 'Sanctions & Risk Intelligence', body: 'UN, OFAC, EU, HM Treasury, and CBN watchlists. PEP database. Fuzzy name matching.', tag: '5 sanctions lists · Nigerian PEP DB' },
  { num: '04', title: 'Regulatory Intelligence', body: 'CBN circulars, NFIU advisories, and compliance calendar — all in one feed.', tag: 'Live · Auto-updated' },
];

const LAYERS = [
  { label: 'Your Institution', sub: 'Any CBS — FlexCube, Ncube, Finacle, Temenos', accent: false },
  { label: 'RegCo Platform', sub: 'Reports · AML · Screening · Intelligence · AI', accent: true },
  { label: 'Nigerian Regulators', sub: 'CBN · NFIU · SCUML · NDIC · FIRS · PENCOM', accent: false },
];

export function PlatformPillarsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section
      id="products"
      style={{
        background: 'var(--bg-dark)',
        padding: '120px 32px',
        color: 'var(--tx-on-dark)',
      }}
    >
      <div ref={ref} style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ marginBottom: 64, maxWidth: 760 }}>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, color: 'var(--ac-teal-dark)', marginBottom: 16 }}>
            INFRASTRUCTURE
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(36px, 4.6vw, 58px)',
              fontWeight: 600,
              lineHeight: 1.05,
              letterSpacing: '-1.4px',
              color: '#fff',
              marginBottom: 20,
            }}
          >
            The compliance infrastructure layer for Nigerian finance.
          </h2>
          <p style={{ fontSize: 17, color: 'var(--tx-muted-dark)', lineHeight: 1.55, maxWidth: 640 }}>
            Unlike generic compliance tools, RegCo was built from day one for CBN's exact requirements — every return template, every regulator format, every Nigerian deadline.
          </p>
        </div>

        {/* Architecture stack */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 80 }}>
          {LAYERS.map((layer, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              style={{ width: '100%', maxWidth: 560, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <div
                style={{
                  width: '100%',
                  padding: '22px 28px',
                  borderRadius: 'var(--r-card)',
                  background: layer.accent ? 'var(--ac-teal)' : 'var(--bg-dark-card)',
                  border: layer.accent ? '1px solid var(--ac-teal-dark)' : '1px solid var(--bd-dark)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#fff',
                    marginBottom: 4,
                  }}
                >
                  {layer.label}
                </div>
                <div style={{ fontSize: 12.5, color: layer.accent ? 'rgba(255,255,255,0.85)' : 'var(--tx-muted-dark)' }}>{layer.sub}</div>
              </div>
              {i < LAYERS.length - 1 && (
                <div style={{ height: 32, width: 1, background: 'var(--bd-dark)', margin: '6px 0' }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Pillars */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
              style={{
                background: 'var(--bg-dark-card)',
                border: '1px solid var(--bd-dark)',
                borderRadius: 'var(--r-card)',
                padding: 28,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ac-teal-dark)', marginBottom: 12 }}>{p.num}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-head)',
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: 10,
                  letterSpacing: '-0.4px',
                }}
              >
                {p.title}
              </h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.55, color: 'var(--tx-muted-dark)', marginBottom: 16 }}>{p.body}</p>
              <div style={{ fontSize: 11.5, color: 'var(--tx-muted)', fontWeight: 500 }}>{p.tag}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PlatformPillarsSection;
