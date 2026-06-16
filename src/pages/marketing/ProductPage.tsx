import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const productFeatures = [
  { tag: 'AI Agent', headline: 'Ask. RegCo does it.', body: 'Talk to RegCo Agent in plain English. Ask it to generate a return, screen a customer, flag AML risks, or summarise your compliance position. It understands context, asks when it needs more, and executes the task.' },
  { tag: 'Report Generation', headline: '17 returns. One conversation.', body: 'Upload your CBS trial balance once. RegCo generates every mandatory regulatory return across CBN, NFIU, SCUML, NDIC, FIRS, and PENCOM. Validated against CBN thresholds before generating.' },
  { tag: 'Document Analysis', headline: 'Upload. Extract. Understand.', body: 'Upload regulatory circulars, CBS exports, loan schedules, or policy documents. RegCo reads them, extracts the relevant data, and surfaces exactly what you need.' },
  { tag: 'AML and Monitoring', headline: 'Catch every flag. Before CBN does.', body: 'Six CBN-compliant AML rules applied to every transaction. CTRs, structuring, velocity, round figures, dormant accounts, narration mismatch. All detected within 2 seconds.' },
  { tag: 'Policies and SOPs', headline: 'Draft. Review. Distribute.', body: 'RegCo Agent drafts AML/CFT policies, KYC procedures, and compliance SOPs aligned to CBN guidelines. Edit inline, then save to your compliance vault.' },
  { tag: 'Tasks and Deadlines', headline: 'Never miss a filing date.', body: 'Pre-populated monthly compliance task checklist. Deadline countdown per return type. Automated reminders. Every obligation tracked with its due date.' },
  { tag: 'Audit Packs', headline: 'CBN examiners ask. You already have it.', body: 'RegCo compiles your filings, AML logs, case decisions, and evidence trails into a structured audit pack. One click. Full export. Ready for any examination.' },
  { tag: 'Board Summaries', headline: 'Your board pack. 30 seconds.', body: 'Automated monthly compliance committee reports covering filings, AML activity, KYC rates, screening results, and outstanding issues. Formatted. Ready to distribute.' },
];

export default function ProductPage() {
  useScrollReveal();

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '120px 0 80px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>The product</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1.07, marginBottom: '20px' }}>
            RegCo is a compliance command center for regulated financial institutions.
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 36px' }}>
            Everything your compliance team needs to file correctly, monitor continuously, and stay audit-ready — in a single AI-powered interface.
          </p>
          <Link to="/book-demo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#16A34A', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', padding: '12px 26px', borderRadius: '8px', textDecoration: 'none' }}>
            Request a demo →
          </Link>
        </div>

        <div style={{ maxWidth: '1000px', margin: '64px auto 0', padding: '0 40px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 20px 80px rgba(0,0,0,0.09)', background: '#F3F4F6', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <img src="/lovable-uploads/product-hero.png" alt="RegCo Product" style={{ width: '100%', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <p style={{ fontSize: '13px', color: '#9CA3AF', padding: '48px', textAlign: 'center', position: 'absolute' }}>Product screenshot — upload to replace</p>
          </div>
        </div>
      </section>

      {/* Feature sections — alternating layout */}
      {productFeatures.map((feat, i) => (
        <motion.section
          key={feat.tag}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: '80px 0', background: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB', borderBottom: '1px solid rgba(0,0,0,0.05)' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
            <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>{feat.tag}</p>
              <h2 style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '16px' }}>{feat.headline}</h2>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.75, marginBottom: '24px' }}>{feat.body}</p>
              <Link to="/book-demo" style={{ fontSize: '14px', fontWeight: '600', color: '#15803D', textDecoration: 'none', borderBottom: '1px solid #DCFCE7', paddingBottom: '2px' }}>
                See this in action →
              </Link>
            </div>
            <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
              <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 6px 32px rgba(0,0,0,0.06)', background: '#F3F4F6', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <img src={`/lovable-uploads/product-${i + 1}.png`} alt={feat.tag} style={{ width: '100%', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <p style={{ fontSize: '12px', color: '#9CA3AF', padding: '32px', textAlign: 'center', position: 'absolute' }}>{feat.tag}</p>
              </div>
            </div>
          </div>
        </motion.section>
      ))}

      {/* How it works flow */}
      <section style={{ padding: '80px 0', background: '#0A0A0A', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.8px', marginBottom: '48px' }}>
            How RegCo works
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0', flexWrap: 'wrap' }}>
            {['Upload', 'Ask', 'Analyse', 'Act', 'Report'].map((step, i, arr) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '0 20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#16A34A' }}>{`0${i + 1}`}</span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#FFFFFF' }}>{step}</p>
                </div>
                {i < arr.length - 1 && <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.2)', flexShrink: 0 }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.8px', marginBottom: '16px' }}>
            Ready to see RegCo in action?
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '28px' }}>We will walk you through the platform and configure it for your institution type in under 30 minutes.</p>
          <Link to="/book-demo" style={{ display: 'inline-flex', background: '#16A34A', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none' }}>
            Request a demo →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
