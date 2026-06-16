import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function AboutPage() {
  useScrollReveal();

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '120px 0 80px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>About RegCo</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1.07, marginBottom: '20px', maxWidth: '720px' }}>
            RegCo exists so compliance teams can focus on judgment, not data entry.
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1.7, maxWidth: '520px' }}>
            Every licensed financial institution in Nigeria carries a significant compliance burden. RegCo was built to carry the mechanical part of that burden so compliance officers can do their actual job.
          </p>
        </div>
      </section>

      {/* Mission — dark green section */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#14532D' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 40px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#86EFAC', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '32px' }}>Our mission</p>
          {[
            { text: 'Every licensed financial institution in Nigeria must file up to 17 mandatory regulatory returns every year — to the CBN, NFIU, SCUML, NDIC, and FIRS. Most of them still do this manually. In Excel. At 11pm before the deadline.', large: true },
            { text: 'The compliance officer is one of the most important people in any Nigerian bank. They sit between the institution and the regulator. Between the rules and the risk. Between a NGN 2,000,000 fine and a clean examination.', large: false },
            { text: 'We built RegCo so they do not have to choose between doing their job well and doing it in time. RegCo Agent handles the filings, the AML screening, the sanctions checks, the board packs, and the audit trails — so compliance officers can focus on judgment, not data entry.', large: false },
            { text: 'We believe Nigerian financial institutions deserve the same tools that the best financial institutions in the world have had for decades. That is what we are building.', large: false },
          ].map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              style={{ fontSize: p.large ? '20px' : '17px', color: p.large ? '#FFFFFF' : 'rgba(255,255,255,0.7)', lineHeight: 1.8, marginBottom: '24px', fontWeight: p.large ? 500 : 400, letterSpacing: '-0.1px' }}
            >
              {p.text}
            </motion.p>
          ))}
          <div style={{ marginTop: '40px', paddingTop: '28px', borderTop: '1px solid rgba(255,255,255,0.12)' }}>
            <p style={{ fontSize: '15px', fontWeight: '700', color: '#86EFAC', margin: '0 0 4px' }}>RegCo Technologies Limited</p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Abuja, Nigeria · 2024</p>
          </div>
        </div>
      </section>

      {/* Problem → Solution narrative */}
      {[
        { heading: 'The problem we solve', body: 'Compliance officers at Nigerian financial institutions spend enormous amounts of time on mechanical work — extracting data from their core banking system, computing regulatory figures in Excel, manually formatting returns, tracking deadlines across five regulators, maintaining KYC records, and preparing for examinations. This work is important, repetitive, and unforgiving. A single error in a CBN return can trigger a sanction. A missed deadline costs the institution money. RegCo removes this mechanical burden.' },
        { heading: 'Why we focus on financial institutions', body: 'Financial institutions carry one of the highest compliance burdens of any industry in Nigeria. The CBN alone requires six mandatory monthly or quarterly returns from every MFB. Add NFIU, SCUML, NDIC, FIRS, and PENCOM, and a Unit MFB compliance officer is managing 17 distinct reporting obligations per year. Most lack the tools, staff, or budget to do this well. RegCo was designed specifically for this context.' },
        { heading: 'How RegCo helps compliance teams', body: 'RegCo gives compliance officers a single interface where they can generate every mandatory return, monitor every transaction for AML violations, screen every customer against five global sanctions lists, track every CBN deadline, maintain every KYC record, document every audit finding, and generate their monthly board pack — automatically. It is not a generic AI tool. It is a compliance command center for regulated Nigerian financial institutions.' },
        { heading: 'Our approach to trust and accuracy', body: 'We are transparent about what RegCo can and cannot do. RegCo validates every balance sheet before generating a CBN return. It checks CAR, liquidity ratio, and NPL ratio against CBN-prescribed thresholds. It never generates a return it cannot validate. When it needs a figure from the user, it asks through a guided form. We would rather ask than guess.' },
        { heading: 'What the future of RegCo looks like', body: 'RegCo is currently live with microfinance banks in Abuja. We are expanding to State MFBs, National MFBs, finance companies, and commercial banks. Our roadmap includes real-time CBS integration, automated STR filing, examination preparation packs, and multi-institution workspaces for compliance consulting firms.' },
      ].map((section, i) => (
        <motion.section
          key={section.heading}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: '64px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', background: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '80px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.2px', lineHeight: 1.3 }}>{section.heading}</h2>
            <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8 }}>{section.body}</p>
          </div>
        </motion.section>
      ))}

      {/* Final CTA */}
      <section style={{ padding: '100px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 40px' }}>
          <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-1px', marginBottom: '16px' }}>
            See RegCo in action.
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7, marginBottom: '28px' }}>
            We will walk you through a live demo tailored to your institution type.
          </p>
          <Link to="/book-demo" style={{ display: 'inline-flex', background: '#16A34A', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none' }}>
            Request a demo →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
