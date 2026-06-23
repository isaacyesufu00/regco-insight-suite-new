import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function CompanyPage() {
  useScrollReveal();

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '120px 0 80px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Company</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1.07, marginBottom: '20px', maxWidth: '680px' }}>
            We build compliance tools for regulated financial institutions.
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1.7, maxWidth: '520px' }}>
            RegCo Technologies Limited is based in our headquarters city. We exist to help regulated banks, fintechs, and microfinance banks manage regulatory compliance with speed, clarity, and control.
          </p>
        </div>
      </section>

      {/* Sections */}
      {[
        { heading: 'Who we are', body: 'RegCo Technologies Limited is a compliance technology company building AI-powered tools for licensed financial institutions. We serve MFBs, finance companies, PMBs, and commercial banks — any institution with mandatory regulatory obligations to the CBN, NFIU, SCUML, NDIC, FIRS, or PENCOM.' },
        { heading: 'Our mission', body: 'Our mission is to make compliance simple, reliable, and automatic for every regulated financial institution. We believe that when compliance is easy, it happens. When it happens consistently, institutions are safer. When institutions are safer, the regulated financial system is stronger.' },
        { heading: 'Why we built RegCo', body: 'Every licensed financial institution in our market must file up to 17 mandatory regulatory returns per year. Most do this manually — in Excel, at 11pm before the deadline, with a compliance officer juggling every regulator at once. We built RegCo because the tools available to compliance officers were inadequate for the complexity of what the CBN actually requires.' },
        { heading: 'Our principles', body: 'We build accurate before fast. We design for compliance officers, not for demos. We are Jurisdiction-specific, not a foreign product retrofitted. We are transparent about what RegCo can and cannot do. And we build software that works five years from now.' },
        { heading: 'How we work with financial institutions', body: 'We work directly with the Head of Compliance and the CEO at each institution. We configure the platform to match your CBS format, your regulatory profile, and your internal workflows. We provide onboarding support and are available throughout your first month to ensure everything is working correctly.' },
      ].map((section, i) => (
        <section key={section.heading} style={{ padding: '64px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', background: i % 2 === 0 ? '#FFFFFF' : '#F9FAFB' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '80px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.2px', lineHeight: 1.3 }}>{section.heading}</h2>
            <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8 }}>{section.body}</p>
          </div>
        </section>
      ))}

      {/* Stats row */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(0,0,0,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          {[
            { number: '17', label: 'Mandatory returns automated' },
            { number: '5', label: 'Regulators covered' },
            { number: '6', label: 'CBN AML rules applied per transaction' },
            { number: '30s', label: 'To generate a compliance board pack' },
          ].map(stat => (
            <div key={stat.label} style={{ background: '#FFFFFF', padding: '36px 32px' }}>
              <p style={{ fontSize: '44px', fontWeight: '800', color: '#0A0A0A', letterSpacing: '-2px', marginBottom: '8px', lineHeight: 1 }}>{stat.number}</p>
              <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5, margin: 0 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.8px', marginBottom: '12px' }}>
            Work with RegCo
          </h2>
          <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7, marginBottom: '28px' }}>
            We partner with financial institutions, compliance consulting firms, and banking technology providers. Reach out to discuss how RegCo can support your work.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/book-demo" style={{ display: 'inline-flex', background: '#16A34A', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', padding: '11px 22px', borderRadius: '7px', textDecoration: 'none' }}>
              Request a demo
            </Link>
            <Link to="/contact/partnerships" style={{ display: 'inline-flex', background: '#FFFFFF', color: '#0A0A0A', fontSize: '14px', fontWeight: '500', padding: '11px 22px', borderRadius: '7px', textDecoration: 'none', border: '1px solid rgba(0,0,0,0.12)' }}>
              Partnership enquiries
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
