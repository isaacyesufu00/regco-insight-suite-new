import { useState } from 'react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const HeroSection = () => (
  <section style={{ paddingTop: '120px', paddingBottom: '100px', background: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '999px', padding: '4px 12px', marginBottom: '28px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#15803D', letterSpacing: '0.02em' }}>Now in early access</span>
        </div>

        <h1 style={{ fontSize: 'clamp(38px, 5vw, 62px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1.06, marginBottom: '20px' }}>
          AI compliance for financial institutions.
        </h1>

        <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1.7, marginBottom: '36px', maxWidth: '440px' }}>
          RegCo helps Nigerian banks, fintechs, and microfinance banks turn regulation into action — reports, audit trails, and compliance workflows, powered by AI.
        </p>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/book-demo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#16A34A', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', padding: '12px 26px', borderRadius: '8px', textDecoration: 'none', letterSpacing: '-0.1px', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#15803D'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#16A34A'}
          >
            Request a demo <ChevronRight size={15} />
          </Link>
          <Link to="/product" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '15px', color: '#374151', textDecoration: 'none', fontWeight: '500', padding: '12px 4px', borderBottom: '1px solid transparent', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderBottomColor = '#9CA3AF'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'}
          >
            See how it works →
          </Link>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ background: '#F3F4F6', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.07)', overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.09)', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/lovable-uploads/hero-screenshot.png"
            alt="RegCo Agent Interface"
            style={{ width: '100%', display: 'block' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <div style={{ position: 'absolute', padding: '48px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <span style={{ fontSize: '24px', fontWeight: '800', color: '#16A34A', letterSpacing: '-1px' }}>R</span>
            </div>
            <p style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: '500' }}>RegCo Agent interface</p>
            <p style={{ fontSize: '12px', color: '#D1D5DB', marginTop: '4px' }}>Upload a screenshot to replace</p>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '-16px', left: '24px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '10px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A' }} />
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A' }}>16 regulator returns automated</span>
        </div>
      </div>
    </div>
  </section>
);

const LogoBar = () => (
  <section style={{ background: '#F9FAFB', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '28px 0' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
      <p style={{ fontSize: '12px', fontWeight: '500', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '20px' }}>
        Built for institutions regulated by
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
        {['CBN', 'NFIU', 'SCUML', 'NDIC', 'FIRS', 'PENCOM'].map(reg => (
          <span key={reg} style={{ fontSize: '15px', fontWeight: '700', color: '#9CA3AF', letterSpacing: '0.05em' }}>{reg}</span>
        ))}
      </div>
    </div>
  </section>
);

const features = [
  {
    number: '01',
    headline: 'All 17 returns. One upload.',
    body: 'RegCo reads your CBS trial balance and generates every mandatory regulatory return across CBN, NFIU, SCUML, NDIC, FIRS, and PENCOM — in under 5 minutes. No templates. No data entry.',
    img: '/lovable-uploads/feature-reports.png',
  },
  {
    number: '02',
    headline: 'Real-time AML monitoring.',
    body: 'Six CBN-compliant AML rules applied to every transaction the moment it posts. CTRs, structuring, velocity anomalies, dormant reactivations — all surfaced within 2 seconds.',
    img: '/lovable-uploads/feature-aml.png',
  },
  {
    number: '03',
    headline: 'Five sanctions lists. Three seconds.',
    body: 'Screen any customer against the UN Security Council, OFAC SDN, EU Consolidated, UK HM Treasury, and CBN Watchlist simultaneously. Nigerian PEPs identified automatically.',
    img: '/lovable-uploads/feature-screening.png',
  },
  {
    number: '04',
    headline: 'Board packs in 30 seconds.',
    body: 'RegCo compiles your filings, AML activity, KYC metrics, and screening history into a formatted compliance committee report automatically every month.',
    img: '/lovable-uploads/feature-boardpack.png',
  },
];

const FeaturesSection = () => (
  <section style={{ background: '#FFFFFF', padding: '100px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
      <div style={{ marginBottom: '72px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>What RegCo does</p>
        <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-1.2px', lineHeight: 1.1, maxWidth: '520px' }}>
          Everything a compliance team needs. In one place.
        </h2>
      </div>

      {features.map((feat, i) => (
        <motion.div
          key={feat.number}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
            paddingBottom: i < features.length - 1 ? '80px' : '0',
            marginBottom: i < features.length - 1 ? '80px' : '0',
            borderBottom: i < features.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
          }}
        >
          <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
            <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9CA3AF', marginBottom: '16px' }}>{feat.number}</p>
            <h3 style={{ fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '16px' }}>
              {feat.headline}
            </h3>
            <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.75, marginBottom: '24px' }}>
              {feat.body}
            </p>
            <Link to="/product" style={{ fontSize: '14px', fontWeight: '600', color: '#15803D', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px', borderBottom: '1px solid #DCFCE7', paddingBottom: '2px', transition: 'border-color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderBottomColor = '#16A34A'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderBottomColor = '#DCFCE7'}
            >
              Learn more →
            </Link>
          </div>

          <div style={{ order: i % 2 === 0 ? 2 : 1 }}>
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', background: '#F3F4F6', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={feat.img} alt={feat.headline} style={{ width: '100%', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <p style={{ fontSize: '13px', color: '#9CA3AF', padding: '48px', textAlign: 'center', position: 'absolute' }}>Screenshot: {feat.headline}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section style={{ background: '#F9FAFB', padding: '100px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>How it works</p>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-1px', lineHeight: 1.1 }}>
          From CBS export to filed return. Five minutes.
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '28px', left: '10%', right: '10%', height: '1px', background: 'rgba(0,0,0,0.08)', zIndex: 0 }} />

        {[
          { step: '01', title: 'Upload', body: 'Upload your CBS trial balance or transaction file. Any format — Excel, CSV.' },
          { step: '02', title: 'Ask', body: 'Tell RegCo Agent what you need. "Generate my May CBN MFB return."' },
          { step: '03', title: 'Analyse', body: 'RegCo validates your data — CAR, liquidity, NPL — against CBN thresholds.' },
          { step: '04', title: 'Act', body: 'Confirm the details in the modal. RegCo generates the formatted return.' },
          { step: '05', title: 'Report', body: 'Download the ready return, file it, and store it in your audit trail.' },
        ].map((item, i) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.09, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ padding: '0 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#16A34A', fontFamily: 'monospace' }}>{item.step}</span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0A0A0A', marginBottom: '8px', letterSpacing: '-0.2px' }}>{item.title}</h3>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.65 }}>{item.body}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ marginTop: '64px', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 12px 48px rgba(0,0,0,0.07)', background: '#F3F4F6', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/lovable-uploads/workflow-screenshot.png" alt="RegCo workflow" style={{ width: '100%', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <p style={{ fontSize: '13px', color: '#9CA3AF', padding: '48px', textAlign: 'center', position: 'absolute' }}>Workflow screenshot — upload to replace</p>
      </div>
    </div>
  </section>
);

const DashboardSection = () => (
  <section style={{ background: '#0A0A0A', padding: '100px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Live monitoring</p>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-1px', lineHeight: 1.1, marginBottom: '20px' }}>
            Your compliance health. At a glance.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: '32px' }}>
            Every transaction screened in real time. Every pending filing tracked with its deadline. Every AML flag surfaced with severity and context. Your compliance score updated automatically.
          </p>
          {[
            'Live AML transaction screening across all channels',
            'Compliance health score updated in real time',
            'CBN deadline tracker with countdown per return',
            'Instant alert for critical flags requiring review',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', flexShrink: 0 }} />
              <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{item}</span>
            </div>
          ))}
          <Link to="/book-demo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#16A34A', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', padding: '11px 22px', borderRadius: '7px', textDecoration: 'none', marginTop: '16px', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#15803D'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#16A34A'}
          >
            See the dashboard →
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1 }}>
          <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 80px rgba(0,0,0,0.4)', background: '#1A1A1A', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src="/lovable-uploads/dashboard-screenshot.png" alt="RegCo Dashboard" style={{ width: '100%', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <p style={{ fontSize: '13px', color: '#4B5563', padding: '48px', textAlign: 'center', position: 'absolute' }}>Dashboard screenshot — upload to replace</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const ReportsSection = () => (
  <section style={{ background: '#FFFFFF', padding: '100px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
      <div style={{ textAlign: 'center', marginBottom: '56px' }}>
        <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Reports and audit packs</p>
        <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-1px', lineHeight: 1.1 }}>
          Every return. Every pack. Always audit-ready.
        </h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '56px' }}>
        {[
          { label: 'CBN', count: '6', desc: 'MFB Regulatory, Monetary Policy, Prudential, Forex, Board Governance, Consumer Protection' },
          { label: 'NFIU · SCUML · NDIC', count: '6', desc: 'AML/CFT Report, Regulatory Return, International Transfers, Annual Compliance, Premium Return, Single Obligor' },
          { label: 'FIRS · PENCOM', count: '5', desc: 'VAT at 7.5%, PAYE with pension deductions, WHT by payment type, Company Income Tax, and PENCOM pension remittance' },
        ].map(item => (
          <div key={item.label} style={{ background: '#F9FAFB', borderRadius: '12px', padding: '28px', border: '1px solid rgba(0,0,0,0.07)' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>{item.label}</p>
            <p style={{ fontSize: '40px', fontWeight: '800', color: '#0A0A0A', letterSpacing: '-2px', marginBottom: '12px', lineHeight: 1 }}>{item.count}</p>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.65 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 8px 40px rgba(0,0,0,0.06)', background: '#F3F4F6', minHeight: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/lovable-uploads/reports-screenshot.png" alt="RegCo Reports" style={{ width: '100%', display: 'block' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        <p style={{ fontSize: '13px', color: '#9CA3AF', padding: '48px', textAlign: 'center', position: 'absolute' }}>Reports screenshot — upload to replace</p>
      </div>
    </div>
  </section>
);

const faqs = [
  { q: 'What is RegCo?', a: 'RegCo is an AI compliance platform for Nigerian licensed financial institutions. It automates mandatory regulatory filings, monitors transactions for AML violations, screens customers against sanctions lists, and helps compliance officers manage their entire regulatory workload from one interface.' },
  { q: 'Who is RegCo for?', a: 'RegCo is built for compliance teams at CBN-licensed institutions: Unit MFBs, State MFBs, National MFBs, Primary Mortgage Banks, Finance Companies, and Commercial Banks. Any institution with mandatory filing obligations to CBN, NFIU, SCUML, NDIC, FIRS, or PENCOM will benefit.' },
  { q: 'Can RegCo read uploaded documents?', a: 'Yes. Upload your CBS trial balance, loan portfolio, transaction CSV, or any compliance document. RegCo reads the file, validates the data, and uses it to generate the relevant returns or analysis.' },
  { q: 'Can RegCo generate regulatory returns automatically?', a: 'Yes. RegCo Agent generates all 17 mandatory returns from your CBS export. You upload the file, confirm the period and details through a guided form, and RegCo produces the submission-ready return — in under 5 minutes.' },
  { q: 'How does RegCo handle AML compliance?', a: 'RegCo applies six CBN-compliant AML rules to every transaction: CTR filing for amounts above NGN 5 million, structuring detection, velocity monitoring, round-figure flagging, dormant account reactivation detection, and narration mismatch analysis. Critical flags are surfaced within 2 seconds of transaction posting.' },
  { q: 'Is RegCo secure for regulated institutions?', a: "Yes. RegCo uses PKCE authentication, row-level security on all data, input sanitization, 8-hour session timeouts, encrypted storage, and is registered with the Nigeria Data Protection Commission (NDPC) under the NDPA 2023. Your institution's data is isolated from all other clients at the database level." },
  { q: 'Does RegCo replace our compliance officer?', a: 'No. RegCo is a tool for compliance officers, not a replacement. It handles the mechanical work — data entry, formatting, calculations, deadline tracking — so your compliance officer can focus on judgment, interpretation, and decision-making.' },
  { q: 'How do I get started?', a: 'Request a demo using the button on this page. We will schedule a walkthrough, configure your institution profile, and have you generating your first return in under 30 minutes.' },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ background: '#FFFFFF', padding: '100px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 40px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Frequently asked questions</p>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.8px', lineHeight: 1.12 }}>
            Common questions from banks, fintechs, and compliance teams.
          </h2>
        </div>

        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
            >
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A', lineHeight: 1.4, paddingRight: '24px', letterSpacing: '-0.1px' }}>{faq.q}</span>
              <ChevronDown size={16} color="#9CA3AF" style={{ flexShrink: 0, transition: 'transform 0.22s', transform: open === i ? 'rotate(180deg)' : 'none' }} />
            </button>
            {open === i && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.75, paddingBottom: '20px' }}>{faq.a}</p>
              </motion.div>
            )}
          </div>
        ))}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: '#6B7280', marginBottom: '16px' }}>Still have questions? We are here to help.</p>
          <Link to="/book-demo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#16A34A', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', padding: '11px 22px', borderRadius: '7px', textDecoration: 'none', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#15803D'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#16A34A'}
          >
            Request a demo →
          </Link>
        </div>
      </div>
    </section>
  );
};

const FinalCtaSection = () => (
  <section style={{ background: '#0A0A0A', padding: '120px 0' }}>
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 40px', textAlign: 'center' }}>
      <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-2px', lineHeight: 1.06, marginBottom: '20px' }}>
        AI compliance for your institution. Ready in 30 minutes.
      </h2>
      <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: '36px', maxWidth: '500px', margin: '0 auto 36px' }}>
        Join Nigerian financial institutions that file faster, screen smarter, and never miss a CBN deadline.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <Link to="/book-demo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#16A34A', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', padding: '13px 28px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#15803D'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#16A34A'}
        >
          Request a demo
        </Link>
        <Link to="/product" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '15px', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: '500', padding: '13px 4px', borderBottom: '1px solid transparent', transition: 'border-color 0.15s, color 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(255,255,255,0.3)'; (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
        >
          See how it works →
        </Link>
      </div>
    </div>
  </section>
);

export default function Homepage() {
  useScrollReveal();

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <LogoBar />
      <FeaturesSection />
      <HowItWorksSection />
      <DashboardSection />
      <ReportsSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
