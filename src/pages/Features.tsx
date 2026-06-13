import { Navbar } from '@/components/homepage/Navbar';
import { Footer } from '@/components/homepage/Footer';
import { motion } from 'framer-motion';

const FEATURE_SECTIONS = [
  { id: 'reports', tag: 'Report Generation', title: 'All 17 mandatory returns, automated', body: "Every return across CBN, NFIU, SCUML, NDIC, FIRS, and PENCOM. Upload your CBS export and RegCo's AI maps every account category to the correct regulator template, validates all ratios and percentages, and produces a plain-text file ready for submission. Works with FlexCube, Ncube, Finacle, Temenos, or any custom CBS format." },
  { id: 'aml', tag: 'AML Monitoring', title: 'Six detection rules on every transaction', body: 'RegCo applies CTR (₦5M+ threshold), structuring pattern detection, velocity anomaly detection, round-figure screening, PEP matching against 200+ Nigerian PEPs, and sanctions matching against 5 international lists. Every flagged transaction is logged with flag reason, escalated to the STR queue, and available for case management.' },
  { id: 'screening', tag: 'Sanctions Screening', title: 'UN, OFAC, EU, HM Treasury, and CBN — daily sync', body: 'Five international and local sanctions lists sync daily at 2am via pg_cron. Fuzzy name matching catches variants and transliterations. Screen a single customer name (Quick Screen) or upload a CSV batch. Every screening result is logged with match score, matched entry, and recommended action.' },
  { id: 'intel', tag: 'Regulatory Intelligence', title: 'Every CBN circular, every NFIU advisory', body: "RegCo's intelligence feed pulls from 6 Nigerian regulatory news sources plus NewsAPI, and seeds CBN circulars directly into your compliance calendar. Monthly compliance tasks auto-populate with this month's submissions. Mark items read, track completion, filter by source. Never miss a regulatory change again." },
  { id: 'cases', tag: 'Case Management', title: 'Enterprise AML case tracking — CBN compliant', body: "Create, assign, prioritize, and track AML cases from alert to STR filing. AI generates a 3-paragraph case narrative (what was detected, why it's suspicious under CBN guidelines, recommended action) for every case. Full immutable audit trail of all actions. CBN Baseline Standards for Automated AML Solutions compliant." },
  { id: 'board', tag: 'Board Pack', title: 'Monthly compliance committee reports in one click', body: 'Generate a complete compliance committee pack: compliance score history, all filings for the month, outstanding items, AML case summary, sanctions screening activity, and KYC completion rate. PDF-ready. One click. Every month.' },
];

export default function Features() {
  return (
    <div className="ballpark-bg" style={{ minHeight: '100vh', fontFamily: 'var(--font-body)' }}>
      <Navbar />

      <section style={{ padding: '160px 28px 80px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700, color: 'var(--tx-muted)', letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 20px' }}>
          Platform features
        </p>
        <h1 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(44px, 7vw, 96px)', fontWeight: 800, letterSpacing: '-3px', lineHeight: 1.02, color: 'var(--tx-primary)', margin: 0, maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto' }}>
          The complete compliance toolkit for Nigerian banks
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, color: 'var(--tx-secondary)', maxWidth: 680, margin: '32px auto 0', lineHeight: 1.55 }}>
          17 returns. 6 regulators. Live AML monitoring. Sanctions screening. AI case management. All in one platform, built exclusively for CBN-licensed institutions.
        </p>
      </section>

      {FEATURE_SECTIONS.map((feat, i) => {
        const reverse = i % 2 === 1;
        return (
          <section key={feat.id} id={feat.id} className={i % 2 === 0 ? 'section-white' : 'section-alt'} style={{ padding: '80px 28px', borderTop: '1px solid var(--bd-light)' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
              <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}
                style={{ order: reverse ? 2 : 1 }}>
                <span style={{ display: 'inline-block', padding: '4px 10px', background: 'var(--ac-teal-light)', color: 'var(--ac-teal)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', borderRadius: 4, marginBottom: 20 }}>{feat.tag}</span>
                <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 'clamp(28px, 3.6vw, 44px)', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, color: 'var(--tx-primary)', margin: '0 0 20px' }}>{feat.title}</h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--tx-secondary)', lineHeight: 1.6, margin: 0 }}>{feat.body}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.6 }}
                style={{ order: reverse ? 1 : 2, aspectRatio: '4/3', background: 'linear-gradient(135deg, #0A0A0A 0%, #2a2a2a 100%)', borderRadius: 'var(--r-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--sh-card)' }}>
                <p style={{ fontFamily: 'var(--font-head)', fontSize: 32, fontWeight: 700, color: 'rgba(255,255,255,0.85)', letterSpacing: '-1px', textAlign: 'center', padding: 32 }}>{feat.tag}</p>
              </motion.div>
            </div>
          </section>
        );
      })}

      <Footer />
    </div>
  );
}
