import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  { q: 'Which core banking systems does RegCo support?', a: "RegCo's universal CBS parser works with any export format — FlexCube, Ncube, Finacle, Temenos, and any custom CBS. No template required. Upload your file and RegCo maps the columns automatically." },
  { q: 'How does RegCo access our transaction data?', a: 'Two options: Option A (all tiers) — daily CSV upload from your IT team. Option B (State MFB and above) — a secure webhook URL your IT team connects to your CBS to send each transaction in real time.' },
  { q: "Is RegCo compliant with Nigeria's NDPA data protection law?", a: "Yes. RegCo is registered with the NDPC. All customer data is stored on Frankfurt region (EU) servers, encrypted at rest and in transit. Full data processing agreement available on request." },
  { q: 'What happens when CBN updates a regulation or return format?', a: "RegCo's team updates the return templates within 48 hours of any CBN circular. You receive an in-platform notification and the new template is applied automatically to your next generation." },
  { q: 'How long does it take to go live?', a: 'Most institutions complete onboarding within 14 days: Day 1 (discovery call), Day 3 (CBS file mapping), Day 7 (first test return generated), Day 14 (full go-live with AML monitoring active).' },
  { q: 'Can we trial RegCo before signing a contract?', a: "Yes. Book a 30-minute demo and we'll run RegCo live on your CBS data during the call. If you want to proceed, we send the agreement that day. Most clients sign within a week of their first demo." },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--bd-light)' }}>
      <button onClick={() => setOpen(!open)} style={{ width: '100%', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, textAlign: 'left' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 600, color: 'var(--tx-primary)' }}>{q}</span>
        <ChevronDown size={18} style={{ color: 'var(--tx-secondary)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0)', flexShrink: 0 }} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} style={{ overflow: 'hidden' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--tx-secondary)', margin: '0 0 24px', lineHeight: 1.6, maxWidth: 760 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function CompactCtaFaq() {
  const navigate = useNavigate();
  return (
    <>
      <section style={{ background: 'var(--bg-dark)', padding: '120px 24px', borderTop: '1px solid var(--bd-light)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(36px, 5.5vw, 68px)', fontWeight: 800, letterSpacing: '-3px', lineHeight: 1.05, color: '#fff', margin: '0 0 20px' }}>
            Ready to automate your compliance?
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'rgba(255,255,255,0.7)', margin: '0 0 36px' }}>
            30-minute demo. Live on your CBS data. No slides.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/book-demo')} style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: 'var(--tx-primary)', background: '#fff', border: 'none', padding: '12px 28px', borderRadius: 'var(--r-btn)', cursor: 'pointer' }}>
              Book a demo ↗
            </button>
            <button onClick={() => navigate('/login')} style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '12px 28px', borderRadius: 'var(--r-btn)', cursor: 'pointer' }}>
              Start free →
            </button>
          </div>
        </div>
      </section>

      <section className="section-white" style={{ padding: '100px 24px', borderTop: '1px solid var(--bd-light)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1.8px', lineHeight: 1.1, color: 'var(--tx-primary)', margin: '0 0 32px', textAlign: 'center' }}>
            Frequently asked questions
          </h2>
          {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </div>
      </section>
    </>
  );
}

export default CompactCtaFaq;
