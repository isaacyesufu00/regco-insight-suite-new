import { Link } from 'react-router-dom';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

export default function SecurityPage() {
  return (
    <div style={{ background: 'var(--n-0)', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--n-500)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px', borderBottom: '1px solid var(--n-40)' }}>
        <div className="atl-container">
          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue-800)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>Security</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-1.5px', lineHeight: 1.07, marginBottom: '20px', maxWidth: '700px' }}>
            Secure by design for{' '}
            <span className="blue-underline">sensitive</span>{' '}
            enterprise workflows.
          </h1>
          <p style={{ fontSize: '20px', color: 'var(--n-500)', lineHeight: 1.65, maxWidth: '560px', marginBottom: '36px' }}>
            Protect regulated data, isolate permissions, and enforce access controls that scale with your organization.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="atl-section-sm" style={{ background: 'var(--n-30)', borderBottom: '1px solid var(--n-40)' }}>
        <div className="atl-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
          {[
            { title: 'No training on your data', body: 'Operational data is never used to train or update any AI model. It is used only to execute your compliance workflows and produce outputs.' },
            { title: 'Organization-scoped isolation', body: 'Row-level security at the database level means every query is scoped to your organization only. It is architecturally impossible for cross-tenant data access to occur.' },
            { title: 'Full audit visibility', body: 'Every agent action, workflow execution, and user activity is logged with timestamp, identity, and outcome — always ready for review.' },
          ].map(item => (
            <div key={item.title} style={{ background: 'var(--n-0)', border: '1px solid var(--n-70)', borderRadius: 'var(--radius-xl)', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '40px', height: '40px', background: 'var(--blue-100)', borderRadius: '8px', marginBottom: '16px' }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--n-800)', marginBottom: '10px' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--n-500)', lineHeight: 1.7, margin: 0 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8-feature grid */}
      <section className="atl-section" style={{ borderBottom: '1px solid var(--n-40)' }}>
        <div className="atl-container">
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-0.8px', marginBottom: '48px' }}>Security architecture</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'var(--n-70)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
            {[
              { title: 'PKCE Authentication', body: 'The most secure auth flow available. Every session uses a code verifier and challenge. No tokens are exposed in URLs or logs.' },
              { title: 'Row-Level Security', body: 'All data access is filtered at the database level to your organization scope. No application-layer workaround can override this constraint.' },
              { title: 'Input Sanitisation', body: 'All user inputs are sanitised before reaching the database. Injection, XSS, and cross-site attacks are blocked at the application layer.' },
              { title: 'Encryption at Rest and in Transit', body: 'All data encrypted at rest using AES-256 and in transit using TLS 1.3. Storage access requires authenticated sessions.' },
              { title: 'Rate Limiting', body: 'Authentication attempts are rate-limited per device. Repeated failures trigger automatic lockout and activity logging.' },
              { title: 'Session Controls', body: 'Sessions expire after a configurable period of inactivity and require re-authentication to resume.' },
              { title: 'Role-Based Access', body: 'Granular permission levels for viewers, reviewers, approvers, and administrators. Access is explicit, not inherited.' },
              { title: 'No Vendor Lock-in on Data', body: 'Your data lives in your controlled environment. You can export everything at any time with no proprietary lock-in on records.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--n-0)', padding: '32px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--n-800)', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--n-500)', lineHeight: 1.7, margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshot placeholder */}
      <section className="atl-section-sm" style={{ borderBottom: '1px solid var(--n-40)' }}>
        <div className="atl-container">
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--n-70)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="screenshot-placeholder" style={{ minHeight: '300px' }}>
              <p style={{ fontWeight: 600, color: 'var(--n-400)' }}>[ INSERT SCREENSHOT: Security Dashboard or Audit Log ]</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="atl-section" style={{ textAlign: 'center' }}>
        <div className="atl-container" style={{ maxWidth: '520px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-0.8px', marginBottom: '12px' }}>Need more security detail?</h2>
          <p style={{ fontSize: '16px', color: 'var(--n-500)', marginBottom: '28px', lineHeight: 1.7 }}>Our team will walk you through our architecture, access controls, and data handling practices.</p>
          <Link to="/book-demo" className="btn-primary" style={{ fontSize: '15px', padding: '12px 24px' }}>Request a security briefing</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
