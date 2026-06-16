import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function SecurityPage() {
  useScrollReveal();

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '120px 0 80px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <p style={{ fontSize: '12px', fontWeight: '600', color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Security</p>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-2px', lineHeight: 1.07, marginBottom: '20px', maxWidth: '700px' }}>
            Security built for regulated financial institutions.
          </h1>
          <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1.7, maxWidth: '560px' }}>
            RegCo is designed for compliance teams handling sensitive financial data. Every technical decision prioritises trust, auditability, and control.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(0,0,0,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
          {[
            { title: 'No training on your data', body: "Your institution's financial data, customer records, and CBS exports are never used to train or update any AI model. Your data is used only to generate your regulatory outputs and nothing else." },
            { title: 'Isolated data environments', body: "Row-level security at the PostgreSQL level means every query is scoped to your institution only. It is architecturally impossible for one client's data to be accessed by another." },
            { title: 'Full audit visibility', body: 'Every agent action, report generation, screening result, and user activity is logged with a timestamp, user identity, and outcome. Your trail is always ready for CBN examiners.' },
          ].map(item => (
            <div key={item.title} style={{ background: '#FFFFFF', padding: '40px 36px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0A0A0A', marginBottom: '12px', letterSpacing: '-0.3px' }}>{item.title}</h3>
              <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.75, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security details — 8 items in 2-column grid */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px' }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.8px', marginBottom: '48px' }}>
            Security architecture
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'rgba(0,0,0,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
            {[
              { title: 'PKCE Authentication', body: 'The most secure Supabase auth flow. Every session uses a code verifier and challenge. No tokens are exposed in URLs or logs.' },
              { title: 'Row-Level Security', body: 'All data access is filtered at the PostgreSQL level to your institution. No application-layer workaround can override this.' },
              { title: 'Input Sanitisation', body: 'All user inputs are sanitised before reaching the database. SQL injection, XSS, and injection attacks are blocked at the application layer.' },
              { title: 'Encrypted at Rest and in Transit', body: 'All data encrypted at rest (AES-256) and in transit (TLS 1.3). Storage bucket access requires authenticated sessions.' },
              { title: 'Rate Limiting and Lockout', body: 'Login attempts are limited to 5 per 15 minutes per device. Repeated failures trigger an automatic lockout.' },
              { title: 'Session Timeout', body: 'Sessions expire after 8 hours of inactivity and require re-authentication. This matches CBN security guidelines for financial system access.' },
              { title: 'NDPC Registration', body: 'RegCo is registered with the Nigeria Data Protection Commission as both Data Controller and Data Processor under the NDPA 2023.' },
              { title: 'No Vendor Lock-in', body: "Your data lives in your Supabase project. You can export everything at any time. We hold nothing proprietary over your institution's records." },
            ].map(item => (
              <div key={item.title} style={{ background: '#FFFFFF', padding: '32px 36px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0A0A0A', marginBottom: '8px', letterSpacing: '-0.2px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance table */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.8px', marginBottom: '20px' }}>
              NDPC registered. CBN-ready architecture.
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.75, marginBottom: '28px' }}>
              RegCo operates a formal Data Processing Agreement with every client institution. Our security posture meets CBN Baseline Standards for Automated AML Solutions.
            </p>
            <Link to="/book-demo" style={{ fontSize: '14px', fontWeight: '600', color: '#15803D', textDecoration: 'none', borderBottom: '1px solid #DCFCE7', paddingBottom: '2px' }}>
              Talk to us about security →
            </Link>
          </div>
          <div>
            {[
              { label: 'NDPC Registration', value: 'Registered' },
              { label: 'Data Processing Agreement', value: 'Available for all clients' },
              { label: 'CBN AML Baseline Standards', value: 'Compliant' },
              { label: 'NDPA 2023', value: 'Compliant' },
              { label: 'Data Residency', value: 'Nigeria / Supabase US-East' },
              { label: 'Encryption', value: 'AES-256 + TLS 1.3' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: '14px', color: '#6B7280' }}>{item.label}</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0A0A0A' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#0A0A0A', letterSpacing: '-0.8px', marginBottom: '12px' }}>Need more security detail?</h2>
          <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '28px', lineHeight: 1.7 }}>Our team will walk you through our architecture, compliance posture, and data handling practices in a dedicated security conversation.</p>
          <Link to="/book-demo" style={{ display: 'inline-flex', background: '#16A34A', color: '#FFFFFF', fontSize: '14px', fontWeight: '600', padding: '12px 24px', borderRadius: '7px', textDecoration: 'none' }}>
            Request a security briefing →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
