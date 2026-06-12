import { useNavigate } from 'react-router-dom';

export function TrustCtaSection() {
  const navigate = useNavigate();

  return (
    <>
      <section style={{ background: 'var(--bg-page)', padding: '100px 32px' }}>
        <div style={{ maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 56,
              color: 'var(--ac-teal)',
              lineHeight: 0.6,
              marginBottom: 24,
            }}
          >
            “
          </div>
          <blockquote
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(24px, 3vw, 34px)',
              fontWeight: 500,
              lineHeight: 1.3,
              letterSpacing: '-0.6px',
              color: 'var(--tx-primary)',
              marginBottom: 32,
              padding: 0,
            }}
          >
            RegCo gives us the same compliance infrastructure that commercial banks have. For a Unit MFB, that used to be completely out of reach.
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'var(--ac-teal)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              MO
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, color: 'var(--tx-primary)', fontSize: 14 }}>Marvellous Okoroigwe</div>
              <div style={{ fontSize: 13, color: 'var(--tx-secondary)' }}>Head of Compliance, Nakdnx MFB</div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" style={{ background: 'var(--bg-dark)', padding: '100px 32px' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            background: 'linear-gradient(135deg, #0f2133 0%, #142b44 100%)',
            borderRadius: 'var(--r-card)',
            padding: '64px 48px',
            textAlign: 'center',
            border: '1px solid var(--bd-dark)',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: '-1px',
              color: '#fff',
              marginBottom: 16,
            }}
          >
            Ready to automate your compliance?
          </h2>
          <p style={{ fontSize: 17, color: 'var(--tx-muted-dark)', maxWidth: 580, margin: '0 auto 32px', lineHeight: 1.55 }}>
            Book a 30-minute demo. We'll map RegCo to your CBS and your regulators, live.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/book-demo')}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--tx-primary)',
                background: '#fff',
                border: 'none',
                padding: '12px 28px',
                borderRadius: 'var(--r-btn)',
                cursor: 'pointer',
                transition: 'opacity 0.12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Book a demo ›
            </button>
            <button
              onClick={() => navigate('/login')}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--tx-on-dark)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--bd-dark)',
                padding: '12px 28px',
                borderRadius: 'var(--r-btn)',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            >
              Sign in →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default TrustCtaSection;
