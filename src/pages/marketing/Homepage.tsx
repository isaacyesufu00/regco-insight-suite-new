import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Check } from 'lucide-react';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Homepage() {
  return (
    <div style={{ background: 'var(--n-0)', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--n-500)' }}>
      <Navbar />
      <HeroSection />
      <TrustBar />
      <ValueSection />
      <FeatureCardGrid />
      <FeatureRow1 />
      <FeatureRow2 />
      <FeatureRow3 />
      <StatsSection />
      <TestimonialSection />
      <CtaBanner />
      <FaqSection />
      <Footer />
    </div>
  );
}

const HeroSection = () => (
  <section style={{ background: 'var(--n-0)', paddingTop: '140px', paddingBottom: '80px', borderBottom: '1px solid var(--n-40)' }}>
    <div className="atl-container">
      <motion.div variants={stagger} initial="hidden" animate="show" style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto' }}>
        <motion.div variants={fadeUp} style={{ marginBottom: '24px' }}>
          <span className="tag">Introducing Regco Agent</span>
        </motion.div>

        <motion.h1 variants={fadeUp} style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(40px, 5.5vw, 64px)',
          fontWeight: 800,
          color: 'var(--n-800)',
          lineHeight: 1.08,
          letterSpacing: '-1.5px',
          marginBottom: '24px',
        }}>
          AI agents for enterprise{' '}
          <span className="blue-underline">compliance</span>.
        </motion.h1>

        <motion.p variants={fadeUp} style={{
          fontSize: '20px', color: 'var(--n-500)', lineHeight: 1.65,
          maxWidth: '620px', margin: '0 auto 36px', fontWeight: 400, letterSpacing: '-0.1px',
        }}>
          Regco helps regulated institutions automate AML, KYC, screening, investigations, reporting, and control oversight with governed AI workflows built for auditability and human review.
        </motion.p>

        <motion.div variants={fadeUp} style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/book-demo" className="btn-primary" style={{ fontSize: '16px', padding: '12px 28px' }}>Request a demo</Link>
          <Link to="/product" className="btn-ghost" style={{ fontSize: '16px' }}>See the workflows <ChevronRight size={16} /></Link>
        </motion.div>

        <motion.p variants={fadeUp} style={{ marginTop: '20px', fontSize: '13px', color: 'var(--n-300)' }}>
          Built for compliance, risk, operations, and audit teams.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{
          marginTop: '56px', borderRadius: '12px', overflow: 'hidden',
          border: '1px solid var(--n-70)',
          boxShadow: '0 24px 80px rgba(9,30,66,0.12), 0 0 0 1px rgba(9,30,66,0.04)',
        }}
      >
        <div className="screenshot-placeholder" style={{ minHeight: '480px' }}>
          <div style={{ fontSize: '32px' }}>🖥</div>
          <p style={{ fontWeight: 600, color: 'var(--n-400)', fontSize: '16px' }}>[ INSERT SCREENSHOT: Main Agent Dashboard ]</p>
          <p className="ph-label">{'Upload to Lovable assets → replace this div with <img src="..." style={{width:"100%",display:"block"}} />'}</p>
        </div>
      </motion.div>
    </div>
  </section>
);

const TrustBar = () => (
  <section style={{ background: 'var(--n-30)', padding: '32px 0', borderBottom: '1px solid var(--n-70)' }}>
    <div className="atl-container">
      <p style={{ textAlign: 'center', fontSize: '13px', fontWeight: 600, color: 'var(--n-300)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '24px' }}>
        Trusted by compliance teams at institutions governed by
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
        {['Basel III', 'FATF', 'ISO 37301', 'SOC 2', 'GDPR', 'AML Directive', 'DORA'].map(f => (
          <span key={f} style={{ fontSize: '14px', fontWeight: 700, color: 'var(--n-200)', letterSpacing: '0.04em', fontFamily: 'var(--font-display)' }}>{f}</span>
        ))}
      </div>
    </div>
  </section>
);

const ValueSection = () => (
  <section className="atl-section" style={{ background: 'var(--n-0)', borderBottom: '1px solid var(--n-40)' }}>
    <div className="atl-container">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger} style={{ textAlign: 'center', marginBottom: '64px' }}>
        <motion.p variants={fadeUp} style={{ fontSize: '13px', fontWeight: 700, color: 'var(--blue-800)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Why Regco</motion.p>
        <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-1px', lineHeight: 1.1, maxWidth: '620px', margin: '0 auto 16px' }}>
          Replace manual compliance work with{' '}
          <span className="blue-underline">governed AI</span>.
        </motion.h2>
        <motion.p variants={fadeUp} style={{ fontSize: '18px', color: 'var(--n-500)', lineHeight: 1.65, maxWidth: '560px', margin: '0 auto' }}>
          Compliance teams operate under constant pressure. Regco brings those workflows into one structured system so your organization can automate repetitive tasks, preserve oversight, and keep every decision traceable.
        </motion.p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '40px' }}>
        {[
          { icon: '⚡', title: 'Move faster without losing control', body: 'Reduce manual review time across alert queues, onboarding checks, and regulatory responses without sacrificing accountability.' },
          { icon: '🔒', title: 'Keep every decision traceable', body: 'Every workflow, approval, and output is logged with full provenance so audit teams always have what they need.' },
          { icon: '🎯', title: 'Built for regulated environments', body: 'Regco supports explainability, role-based access, and human review checkpoints so teams can trust the workflow and defend the outcome.' },
        ].map((item, i) => (
          <motion.div key={item.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            style={{ padding: '32px 28px', background: 'var(--n-0)', border: '1px solid var(--n-70)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div style={{ fontSize: '28px', marginBottom: '16px' }}>{item.icon}</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '19px', fontWeight: 700, color: 'var(--n-800)', marginBottom: '10px', letterSpacing: '-0.3px' }}>{item.title}</h3>
            <p style={{ fontSize: '15px', color: 'var(--n-500)', lineHeight: 1.7 }}>{item.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const features = [
  { color: '#0052CC', bg: '#DEEBFF', letter: 'A', name: 'Alert Triage', desc: 'Prioritize high-value cases and reduce noise across compliance queues.' },
  { color: '#36B37E', bg: '#E3FCEF', letter: 'I', name: 'Identity Review', desc: 'Support KYC and due diligence workflows with structured, reviewable inputs.' },
  { color: '#6554C0', bg: '#EAE6FF', letter: 'S', name: 'Sanctions Screening', desc: 'Coordinate sanctions, PEP, and adverse media checks in a governed process.' },
  { color: '#FF7452', bg: '#FFEBE6', letter: 'C', name: 'Case Management', desc: 'Route investigations, notes, and approvals through one auditable workflow.' },
  { color: '#00B8D9', bg: '#E6FCFF', letter: 'R', name: 'Reporting', desc: 'Produce consistent outputs for internal teams and regulatory response.' },
  { color: '#172B4D', bg: '#EBECF0', letter: 'T', name: 'Audit Trail', desc: 'Preserve input, output, review, and approval history for full traceability.' },
];

const FeatureCardGrid = () => (
  <section className="atl-section" style={{ background: 'var(--n-30)', borderBottom: '1px solid var(--n-40)' }}>
    <div className="atl-container">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} style={{ marginBottom: '56px' }}>
        <motion.p variants={fadeUp} style={{ fontSize: '13px', fontWeight: 700, color: 'var(--blue-800)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>The platform</motion.p>
        <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-1px', lineHeight: 1.1, maxWidth: '540px' }}>
          Built for the{' '}
          <span className="blue-underline">workflows</span>{' '}
          that matter most.
        </motion.h2>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {features.map((feat, i) => (
          <motion.div key={feat.name}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ background: 'var(--n-0)', border: '1px solid var(--n-70)', borderRadius: 'var(--radius-xl)', padding: '28px', boxShadow: 'var(--shadow-sm)', cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s' }}
            whileHover={{ boxShadow: '0 8px 24px rgba(9,30,66,0.12)', y: -2 }}
          >
            <div className="product-icon" style={{ background: feat.bg, color: feat.color, marginBottom: '16px', fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {feat.letter}
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--n-800)', marginBottom: '8px', letterSpacing: '-0.2px' }}>{feat.name}</h3>
            <p style={{ fontSize: '14px', color: 'var(--n-500)', lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

type RowProps = {
  eyebrow: string;
  headline: React.ReactNode;
  body: string;
  bullets: string[];
  href: string;
  placeholderLabel: string;
  background: string;
  reversed?: boolean;
};

const FeatureRow = ({ eyebrow, headline, body, bullets, href, placeholderLabel, background, reversed }: RowProps) => {
  const Text = (
    <motion.div initial={{ opacity: 0, x: reversed ? 28 : -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>
      <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue-800)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>{eyebrow}</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-0.8px', lineHeight: 1.12, marginBottom: '16px' }}>{headline}</h2>
      <p style={{ fontSize: '16px', color: 'var(--n-500)', lineHeight: 1.75, marginBottom: '24px' }}>{body}</p>
      {bullets.map(item => (
        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--blue-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Check size={12} color="var(--blue-800)" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '15px', color: 'var(--n-500)' }}>{item}</span>
        </div>
      ))}
      <div style={{ marginTop: '28px' }}>
        <Link to={href} className="btn-primary">Learn more</Link>
      </div>
    </motion.div>
  );

  const Shot = (
    <motion.div initial={{ opacity: 0, x: reversed ? -28 : 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
      <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--n-70)', boxShadow: 'var(--shadow-lg)' }}>
        <div className="screenshot-placeholder" style={{ minHeight: '360px' }}>
          <p style={{ fontWeight: 600, color: 'var(--n-400)' }}>[ INSERT SCREENSHOT: {placeholderLabel} ]</p>
          <p className="ph-label">Replace this div with your actual screenshot</p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section className="atl-section" style={{ background, borderBottom: '1px solid var(--n-40)' }}>
      <div className="atl-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        {reversed ? <>{Shot}{Text}</> : <>{Text}{Shot}</>}
      </div>
    </section>
  );
};

const FeatureRow1 = () => (
  <FeatureRow
    eyebrow="Alert Triage"
    headline={<>Cut through the noise. Focus on{' '}<span className="blue-underline">what matters</span>.</>}
    body="Compliance alert queues are high-volume and time-sensitive. Regco's triage engine ranks cases by risk signal so your team spends time on the cases that need human judgment — not the ones that don't."
    bullets={['Automated priority scoring', 'Noise reduction across channels', 'Consistent escalation logic', 'Full case context in one view']}
    href="/product/alert-triage"
    placeholderLabel="Alert Triage Interface"
    background="var(--n-0)"
  />
);

const FeatureRow2 = () => (
  <FeatureRow
    reversed
    eyebrow="Case Management"
    headline={<>Every investigation. One{' '}<span className="blue-underline">auditable</span>{' '}workspace.</>}
    body="Route investigations, decisions, and approvals through a single controlled workflow. Regco preserves the supporting context, decision path, and workflow history so every case can be reviewed, explained, and defended later."
    bullets={['Human-in-the-loop approval checkpoints', 'Decision and evidence logging', 'Cross-team assignment and escalation', 'Audit-ready case export']}
    href="/product/case-management"
    placeholderLabel="Case Management Workspace"
    background="var(--n-30)"
  />
);

const FeatureRow3 = () => (
  <FeatureRow
    eyebrow="Audit Trail"
    headline={<>Audit readiness built into{' '}<span className="blue-underline">every workflow</span>.</>}
    body="Regco continuously captures the full story of every compliance action — inputs, outputs, reviews, approvals, and exceptions — so your teams are always prepared for internal review or regulatory examination."
    bullets={['Immutable action log', 'Complete workflow history', 'Evidence package export', 'Timestamp and user attribution']}
    href="/product/audit-trail"
    placeholderLabel="Audit Trail Log"
    background="var(--n-0)"
  />
);

const StatsSection = () => (
  <section style={{ background: 'var(--blue-800)', padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
    <div className="atl-container">
      <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ textAlign: 'center', fontSize: '20px', color: 'rgba(255,255,255,0.8)', marginBottom: '56px', fontWeight: 400, lineHeight: 1.6, maxWidth: '540px', margin: '0 auto 56px' }}
      >
        Give your compliance team a better operating model. Reduce manual workload without reducing control.
      </motion.p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(255,255,255,0.12)', borderRadius: '10px', overflow: 'hidden' }}>
        {[
          { number: '17', label: 'Compliance return types automated' },
          { number: '5×', label: 'Faster alert review with AI triage' },
          { number: '100%', label: 'Decision auditability on every workflow' },
          { number: '<2s', label: 'Sanctions and screening response time' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
            style={{ background: 'rgba(255,255,255,0.04)', padding: '36px 28px', textAlign: 'center' }}
          >
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '52px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-2px', lineHeight: 1, marginBottom: '8px' }}>{stat.number}</p>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialSection = () => (
  <section className="atl-section" style={{ background: 'var(--n-0)', borderBottom: '1px solid var(--n-40)' }}>
    <div className="atl-container" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <div style={{ width: '56px', height: '56px', background: 'var(--blue-50)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: 'var(--blue-800)', fontFamily: 'var(--font-display)' }}>"</span>
        </div>
        <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 700, color: 'var(--n-800)', letterSpacing: '-0.5px', lineHeight: 1.3, marginBottom: '24px' }}>
          Regco gave us the structure we needed to handle compliance at scale. The audit trail alone reduced our exam preparation time by weeks.
        </blockquote>
        <div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--n-800)', margin: '0 0 2px' }}>Head of Compliance</p>
          <p style={{ fontSize: '14px', color: 'var(--n-400)' }}>Global Financial Institution — [ INSERT CUSTOMER LOGO ]</p>
        </div>
      </motion.div>
    </div>
  </section>
);

const CtaBanner = () => (
  <section style={{ background: 'linear-gradient(135deg, var(--n-800) 0%, #0747A6 100%)', padding: '96px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="atl-container" style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto' }}>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1.2px', lineHeight: 1.1, marginBottom: '16px' }}
      >
        Move compliance forward with confidence.
      </motion.h2>
      <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
        style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, marginBottom: '36px' }}
      >
        See how Regco can help your teams work faster, stay aligned, and maintain the level of control enterprise environments require.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.18 }}
        style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <Link to="/book-demo" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', color: 'var(--blue-800)', fontSize: '16px', fontWeight: 700, padding: '13px 28px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'opacity 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.9'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
        >Book a demo</Link>
        <Link to="/product" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'transparent', color: '#FFFFFF', fontSize: '16px', fontWeight: 600, padding: '13px 28px', borderRadius: 'var(--radius-lg)', textDecoration: 'none', border: '2px solid rgba(255,255,255,0.35)', fontFamily: 'var(--font-body)', transition: 'border-color 0.15s' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.35)'}
        >See the platform</Link>
      </motion.div>
    </div>
  </section>
);

const faqs = [
  { q: 'What does Regco do?', a: 'Regco helps regulated institutions govern AI-assisted compliance work. It automates structured workflows for AML, KYC, sanctions screening, case management, and reporting while keeping review and oversight in the hands of your team.' },
  { q: 'Who is Regco designed for?', a: 'Regco is built for compliance, risk, legal, operations, and audit teams at regulated financial institutions and enterprise organizations that need control over AI-enabled compliance work.' },
  { q: 'Does Regco replace human reviewers?', a: 'No. Regco is designed to support human review, not replace it. The platform handles repetitive structured work so your team can focus on cases that require judgment, while every decision remains with an authorized person.' },
  { q: 'How does Regco support audit readiness?', a: 'Regco captures the full decision trail — inputs, outputs, approvals, exceptions, and timestamps — for every workflow. Your audit preparation becomes continuous rather than a last-minute effort.' },
  { q: 'Is Regco secure for regulated data?', a: 'Yes. The platform uses row-level data isolation, role-based access controls, encrypted storage, session management, and a complete system audit log. It is built to meet the security expectations of regulated environments.' },
  { q: 'What frameworks does Regco support?', a: 'Regco supports workflows aligned to major compliance obligations including FATF recommendations, Basel III operational risk standards, ISO 37301, GDPR, SOC 2, and regional AML directives.' },
  { q: 'How long does onboarding take?', a: 'Most teams are operational within one session. We configure the platform to match your institution type, regulatory profile, and internal workflows during onboarding.' },
  { q: 'How do I get started?', a: 'Request a demo using the button on this page. We will schedule a walkthrough, understand your compliance requirements, and configure Regco for your specific operating environment.' },
];

const FaqSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="atl-section" style={{ background: 'var(--n-30)', borderBottom: '1px solid var(--n-70)' }}>
      <div className="atl-container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '80px', alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: '80px' }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue-800)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>FAQ</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: '16px' }}>
            Common questions from compliance teams.
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--n-400)', lineHeight: 1.65, marginBottom: '24px' }}>Still have questions? Our team is here to help.</p>
          <Link to="/book-demo" className="btn-primary">Talk to us</Link>
        </div>

        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--n-70)' }}>
              <button onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)' }}
              >
                <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--n-800)', lineHeight: 1.4, paddingRight: '24px', letterSpacing: '-0.1px' }}>{faq.q}</span>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: open === i ? 'var(--blue-50)' : 'var(--n-40)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.15s' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600, color: open === i ? 'var(--blue-800)' : 'var(--n-400)', lineHeight: 1, transition: 'transform 0.2s', display: 'block', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
              </button>
              {open === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                  <p style={{ fontSize: '15px', color: 'var(--n-500)', lineHeight: 1.75, paddingBottom: '20px' }}>{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
