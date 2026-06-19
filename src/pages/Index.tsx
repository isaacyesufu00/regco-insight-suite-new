import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const COLORS = {
  pageBg: '#F5F2EC',
  text: '#1A1A1A',
  muted: '#9B9B9B',
  body: '#5C5C5C',
  border: '#D8D4CE',
  cta: '#8B6BBE',
  ctaHover: '#7A5CAD',
  step: '#C4793A',
  ctaBg: '#EAE0F5',
  cardBg: '#EDE9E2',
  cardBorder: '#E0DDD6',
  navInputBg: '#FFFFFF',
  heroInputBg: '#F9F7F4',
};

const serif: React.CSSProperties = { fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif", fontWeight: 700, letterSpacing: '-0.01em' };
const sans: React.CSSProperties = { fontFamily: "'Inter', system-ui, sans-serif" };

// ─── NAV ────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onScroll(); onResize();
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 50,
      background: COLORS.pageBg,
      borderBottom: scrolled ? `1px solid ${COLORS.border}` : '1px solid transparent',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button aria-label="Menu" style={{ display: 'flex', flexDirection: 'column', gap: 4, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <span style={{ display: 'block', width: 18, height: 1.5, background: COLORS.text }} />
          <span style={{ display: 'block', width: 18, height: 1.5, background: COLORS.text }} />
          <span style={{ display: 'block', width: 18, height: 1.5, background: COLORS.text }} />
        </button>
        <a href="/" style={{ ...serif, fontSize: 22, color: COLORS.text, letterSpacing: '-0.01em', textDecoration: 'none' }}>Regco</a>
      </div>

      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {['Use cases', 'Pricing', 'About'].map(l => (
            <a key={l} href="#" style={{ ...sans, fontSize: 15, color: COLORS.text, textDecoration: 'none' }}
               onMouseEnter={e => (e.currentTarget.style.color = COLORS.body)}
               onMouseLeave={e => (e.currentTarget.style.color = COLORS.text)}>{l}</a>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {!isMobile && (
          <>
            <a href="/login" style={{ ...sans, fontSize: 15, color: COLORS.text, textDecoration: 'none', cursor: 'pointer' }}>Sign in</a>
            <div style={{ display: 'flex', alignItems: 'center', borderRadius: 9999, border: `1px solid ${COLORS.border}`, background: COLORS.navInputBg, padding: '4px 4px 4px 16px', gap: 4 }}>
              <input type="email" placeholder="Enter email" style={{ ...sans, fontSize: 14, color: COLORS.text, background: 'transparent', border: 'none', outline: 'none', width: 140 }} />
              <CtaButton small>Get a demo</CtaButton>
            </div>
          </>
        )}
        {isMobile && <CtaButton small>Get a demo</CtaButton>}
      </div>
    </nav>
  );
}

function CtaButton({ children, small, large }: { children: React.ReactNode; small?: boolean; large?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? COLORS.ctaHover : COLORS.cta,
        color: '#FFFFFF', border: 'none', cursor: 'pointer',
        borderRadius: 9999, ...sans, fontWeight: 500,
        padding: small ? '8px 18px' : large ? '12px 22px' : '10px 20px',
        fontSize: small ? 14 : 15,
        whiteSpace: 'nowrap', transition: 'background 150ms',
      }}>{children}</button>
  );
}

function EmailPill({ placeholder = 'Enter your work email', bg = COLORS.heroInputBg, borderColor = COLORS.border }: { placeholder?: string; bg?: string; borderColor?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', borderRadius: 9999,
      border: `1px solid ${borderColor}`, background: bg,
      padding: '6px 6px 6px 24px', width: 380, maxWidth: '100%',
      margin: '0 auto', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <input type="email" placeholder={placeholder} style={{ ...sans, fontSize: 15, color: COLORS.text, background: 'transparent', border: 'none', outline: 'none', flex: 1, minWidth: 0 }} />
      <CtaButton large>Request a demo</CtaButton>
    </div>
  );
}

// ─── HERO ────────────────────────────────────────────────────────────────
function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    r(); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
  }, []);

  const rects = isMobile ? [
    { left: 0, top: 175, w: 34, h: 34, bg: '#C4A8D4', op: 0.75 },
    { left: 0, top: 290, w: 34, h: 24, bg: '#B89EC7', op: 0.65 },
    { left: 0, top: 350, w: 34, h: 30, bg: '#9B85B5', op: 0.60 },
  ] : [
    { left: 0, top: 175, w: 34, h: 34, bg: '#C4A8D4', op: 0.75 },
    { left: 0, top: 290, w: 34, h: 24, bg: '#B89EC7', op: 0.65 },
    { left: 0, top: 350, w: 34, h: 30, bg: '#9B85B5', op: 0.60 },
    { left: 42, top: 450, w: 158, h: 34, bg: '#87C5C0', op: 0.60 },
    { left: 42, top: 510, w: 158, h: 65, bg: '#ADE3DF', op: 0.50 },
    { right: 0, top: 195, w: 40, h: 72, bg: '#E8B4BC', op: 0.60 },
    { right: 0, top: 435, w: 200, h: 70, bg: '#F5E17A', op: 0.70 },
  ];

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', position: 'relative',
      overflow: 'hidden', background: COLORS.pageBg, paddingTop: 64,
    }}>
      {rects.map((r, i) => (
        <div key={i} style={{
          position: 'absolute', pointerEvents: 'none', zIndex: 0,
          left: r.left, right: r.right, top: r.top,
          width: r.w, height: r.h, background: r.bg, opacity: r.op,
        } as React.CSSProperties} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900, margin: '0 auto', padding: '0 40px' }}>
        <h1 style={{ ...serif, fontSize: isMobile ? 52 : 108, lineHeight: 1.05, color: COLORS.text, letterSpacing: '-0.02em', margin: 0 }}>
          AI for the compliance<br />that can't be wrong.
        </h1>
        <p style={{ ...sans, marginTop: 32, fontSize: isMobile ? 16 : 18, color: COLORS.body, lineHeight: 1.5, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
          Automate CBN and NFIU returns. Screen clients live. Catch fraud before it files.
        </p>
        <div style={{ marginTop: 40 }}>
          <EmailPill />
        </div>
      </div>

      <div style={{
        marginTop: 96, paddingBottom: 64, width: '100%',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 80, flexWrap: 'wrap', position: 'relative', zIndex: 1,
      }}>
        {['CBN', 'NFIU', 'SCUML', 'NDIC', 'FIRS'].map(r => (
          <span key={r} style={{ ...sans, fontSize: 18, fontWeight: 600, color: COLORS.text, letterSpacing: '0.02em', opacity: 0.75 }}>{r}</span>
        ))}
      </div>
    </section>
  );
}

// ─── Shared headline pair ────────────────────────────────────────────────
function HeadlinePair({ step, primary, secondary, size = 64 }: { step?: string; primary: string; secondary: string; size?: number }) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    r(); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
  }, []);
  const s = isMobile ? 36 : size;
  return (
    <>
      {step && <div style={{ ...sans, fontSize: 13, fontWeight: 500, color: COLORS.step, letterSpacing: '0.04em', marginBottom: 20, textTransform: 'uppercase' }}>{step}</div>}
      <h2 style={{ ...serif, fontSize: s, lineHeight: 1.08, color: COLORS.text, letterSpacing: '-0.02em', margin: 0 }}>{primary}</h2>
      <h2 style={{ ...serif, fontSize: s, lineHeight: 1.08, color: COLORS.muted, letterSpacing: '-0.02em', margin: 0 }}>{secondary}</h2>
    </>
  );
}

function Placeholder({ height, text }: { height: number; text: string }) {
  return (
    <div style={{ width: '100%', height, background: '#E4E0D8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <span style={{ ...sans, fontSize: 14, color: COLORS.muted, textAlign: 'center' }}>{text}</span>
    </div>
  );
}

// ─── Sections 3-7 ────────────────────────────────────────────────────────
function ComplianceRecord() {
  return (
    <section style={{ background: COLORS.pageBg, paddingTop: 96, padding: '96px 40px 0', maxWidth: 1200, margin: '0 auto' }}>
      <HeadlinePair step="1. MONITOR" primary="A single compliance record for the entire institution." secondary="Same obligation. Same answer." />
      <div style={{ marginTop: 48, width: '100%', borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden', background: '#FFFFFF' }}>
        <div style={{ height: 520, background: '#F0EDE8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <span style={{ ...sans, fontSize: 14, color: COLORS.muted, textAlign: 'center' }}>
            [ INSERT REGCO DASHBOARD SCREENSHOT: split-pane agent + AML monitoring table ]
          </span>
        </div>
      </div>
    </section>
  );
}

function UseCases() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    r(); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
  }, []);

  const cards = [
    { label: 'Head of Compliance, unit MFB', title: 'Generate the CBN daily return, flag NFIU obligations, and confirm submission — end to end, in a single command', divider: true },
    { label: 'AML Officer, commercial bank', title: "Screen every new customer's BVN and NIN against sanctions, PEP lists, and adverse media before the account goes live", divider: false },
    { label: 'CCO, payment institution', title: 'Which customers triggered AML rules more than twice this month, and what is their current risk classification?', divider: false },
  ];

  return (
    <section style={{ background: COLORS.pageBg, padding: '96px 40px 0', maxWidth: 1200, margin: '0 auto' }}>
      <HeadlinePair step="2. DETECT" primary="Automated returns, live screening, and real-time monitoring." secondary="Built for compliance. Audit-ready from day one." />
      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 32 : 40 }}>
        {cards.map((c, i) => (
          <div key={i}>
            <div style={{ ...sans, fontSize: 13, color: COLORS.muted, marginBottom: 12 }}>{c.label}</div>
            <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: COLORS.text, lineHeight: 1.35 }}>{c.title}</div>
            {c.divider && <div style={{ marginTop: 24, width: '60%', height: 1, background: COLORS.border }} />}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 64, width: '100%', borderRadius: 12, border: `1px solid ${COLORS.border}`, overflow: 'hidden', background: '#FFFFFF' }}>
        <Placeholder height={560} text="[ INSERT REGCO AGENT SCREENSHOT: left AI chat panel with compliance thought labels + right transaction monitoring or filing dashboard ]" />
      </div>
    </section>
  );
}

function DeployCards() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    r(); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
  }, []);

  const cards = [
    { ph: '[ INSERT SCREENSHOT: RegCo scheduled compliance digest notification or board-level summary view ]', title: 'Brief your board', body: 'Scheduled compliance digests keep leadership informed automatically, with no last-minute report assembly from your team.' },
    { ph: '[ INSERT SCREENSHOT: RegCo CBN/NFIU return submission interface showing portal-ready file and validation status ]', title: 'File with regulators', body: 'Push completed CBN and NFIU returns to submission-ready formats, validated and confirmed before every regulatory deadline.' },
  ];

  return (
    <section style={{ background: COLORS.pageBg, padding: '96px 40px 96px', maxWidth: 1200, margin: '0 auto' }}>
      <HeadlinePair step="3. DEPLOY" primary="Wire compliance into how your institution operates." secondary="A workflow, not a report." size={56} />
      <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: COLORS.cardBg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${COLORS.cardBorder}` }}>
            <Placeholder height={isMobile ? 260 : 380} text={c.ph} />
            <div style={{ padding: '28px 28px 32px' }}>
              <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 10 }}>{c.title}</div>
              <p style={{ ...sans, fontSize: 16, color: COLORS.body, lineHeight: 1.65, margin: 0 }}>{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturePair() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    r(); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
  }, []);

  const cards = [
    { ph: "[ INSERT SCREENSHOT: RegCo agent interface showing a compliance question with a tabulated answer — e.g. 'Which accounts are high risk this week?' with response table ]", title: 'Ask your compliance data', body: 'Ask follow-up questions about any alert, return, or screening result and get answers backed by governed compliance logic.' },
    { ph: '[ INSERT SCREENSHOT: RegCo audit summary or case record export view — document-style output with timestamps and reviewer identities ]', title: 'Audit trail and case management', body: 'Every alert, review, decision, and filing is logged with timestamp, reviewer identity, and outcome — always ready for examination.' },
  ];

  return (
    <section style={{ background: COLORS.pageBg, padding: '0 40px 96px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: COLORS.cardBg, borderRadius: 12, overflow: 'hidden', border: `1px solid ${COLORS.cardBorder}` }}>
            <Placeholder height={isMobile ? 220 : 340} text={c.ph} />
            <div style={{ padding: '24px 24px 28px' }}>
              <div style={{ ...sans, fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{c.title}</div>
              <p style={{ ...sans, fontSize: 16, color: COLORS.body, lineHeight: 1.65, margin: 0 }}>{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Infrastructure() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    r(); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
  }, []);

  const rows = [
    { name: 'Automated Returns', desc: 'Handle CBN and NFIU filing end to end — from data ingestion to portal-ready submission, with no manual formatting.' },
    { name: 'Live Client Screening', desc: 'Check every customer\'s BVN, NIN, and name against sanctions, PEP, and adverse media lists in real time, before and after onboarding.' },
    { name: 'Transaction Monitoring', desc: 'Catch fraud, AML violations, and unusual money movement in near real time using rule-based and AI-assisted detection across all transaction types.' },
  ];

  return (
    <section style={{ background: COLORS.pageBg, padding: '96px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <HeadlinePair primary="Regco connects your institution's data to a governed compliance layer." secondary="No compliance team of fifteen required." size={56} />
      <div style={{ marginTop: 64, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '60% 40%', gap: 0, alignItems: 'start' }}>
        <div style={{ width: '100%', maxWidth: 550 }}>
          <IsometricSheets />
        </div>
        <div style={{ paddingLeft: isMobile ? 0 : 40, display: 'flex', flexDirection: 'column', gap: 48, marginTop: isMobile ? 48 : 0 }}>
          {rows.map((r, i) => (
            <div key={i}>
              <div style={{ ...sans, fontSize: 18, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>{r.name}</div>
              <p style={{ ...sans, fontSize: 16, color: COLORS.body, lineHeight: 1.65, margin: 0 }}>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IsometricSheets() {
  return (
    <svg viewBox="0 0 550 480" width="100%" style={{ display: 'block' }}>
      <g fill="none" stroke="#C8C4BC" strokeWidth="1">
        {/* Bottom sheet */}
        <polygon points="80,360 320,440 500,340 260,260" />
        {[0,1,2,3,4,5,6,7].map(i => (
          <line key={`b${i}`} x1={120 + i*40} y1={344 + i*10} x2={300 + i*40} y2={284 + i*10} />
        ))}
        {/* Middle sheet */}
        <polygon points="70,260 310,340 490,240 250,160" />
        {[0,1,2,3,4,5,6].map(i => (
          <line key={`m${i}`} x1={120 + i*40} y1={244 + i*10} x2={300 + i*40} y2={184 + i*10} />
        ))}
        {/* Top sheet */}
        <polygon points="60,160 300,240 480,140 240,60" />
        {[0,1,2,3,4,5].map(i => (
          <line key={`t${i}`} x1={120 + i*40} y1={144 + i*10} x2={280 + i*40} y2={84 + i*10} />
        ))}
      </g>
    </svg>
  );
}

function Testimonials() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    r(); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
  }, []);

  const items = [
    {
      quote: '"This changed how we handle monthly returns. What used to take three days now takes under an hour — and our auditors have a complete decision trail for every transaction reviewed."',
      name: 'Marvellous Okoroigwe', title: 'Head of Compliance, Nakdnx MFB', company: 'Nakdnx MFB',
    },
    {
      quote: '"Compliance review used to mean long email chains with the risk team. Now I ask the agent a question and get a filing-ready answer in minutes — no manual lookups, no back-and-forth."',
      name: '[ Client name ]', title: 'Chief Compliance Officer, [ Institution ]', company: '[ Institution ]',
    },
  ];

  return (
    <section style={{ background: COLORS.pageBg, padding: '96px 40px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ ...serif, fontSize: isMobile ? 36 : 56, lineHeight: 1.1, color: COLORS.text, marginBottom: 48 }}>
        How serious compliance teams use AI to meet every obligation on time.
      </h2>
      <div style={{ width: '100%', height: 1, background: COLORS.border }} />
      {items.map((t, i) => (
        <div key={i} style={{ padding: '56px 0', borderBottom: `1px solid ${COLORS.border}`, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '58% 42%', gap: 40, alignItems: 'start' }}>
          <div style={{ ...serif, fontSize: isMobile ? 18 : 22, lineHeight: 1.55, color: COLORS.text }}>{t.quote}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 52, height: 52, borderRadius: 9999, background: COLORS.border }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ ...sans, fontSize: 15, fontWeight: 500, color: COLORS.text }}>{t.name}</span>
                <span style={{ ...sans, fontSize: 14, color: '#6B6B6B' }}>{t.title}</span>
              </div>
            </div>
            <div style={{ marginTop: 20, ...sans, fontSize: 18, fontWeight: 700, color: COLORS.text, letterSpacing: '0.01em' }}>{t.company}</div>
          </div>
        </div>
      ))}
    </section>
  );
}

function CTAFooter() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const r = () => setIsMobile(window.innerWidth < 768);
    r(); window.addEventListener('resize', r); return () => window.removeEventListener('resize', r);
  }, []);

  const rects = isMobile ? [
    { left: 0, top: 120, w: 130, h: 30, bg: '#C8B8D8', op: 0.5 },
    { left: 0, top: 160, w: 130, h: 30, bg: '#BCA8CC', op: 0.45 },
  ] : [
    { left: 0, top: 120, w: 130, h: 30, bg: '#C8B8D8', op: 0.5 },
    { left: 0, top: 160, w: 130, h: 30, bg: '#BCA8CC', op: 0.45 },
    { right: 0, top: 120, w: 200, h: 35, bg: '#D4C4E4', op: 0.45 },
    { right: 0, top: 165, w: 160, h: 30, bg: '#C0B0D4', op: 0.4 },
    { right: 40, top: 260, w: 120, h: 30, bg: '#CCB8E0', op: 0.35 },
  ];

  return (
    <section style={{ background: COLORS.ctaBg, position: 'relative', overflow: 'hidden', minHeight: 600 }}>
      {rects.map((r, i) => (
        <div key={i} style={{
          position: 'absolute', pointerEvents: 'none',
          left: r.left, right: r.right, top: r.top,
          width: r.w, height: r.h, background: r.bg, opacity: r.op,
        } as React.CSSProperties} />
      ))}

      <div style={{ position: 'relative', zIndex: 1, padding: '160px 40px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h2 style={{ ...serif, fontSize: isMobile ? 42 : 72, lineHeight: 1.1, color: COLORS.text, letterSpacing: '-0.02em', margin: 0 }}>
          Stop assembling compliance manually.<br />Start filing with confidence.
        </h2>
        <div style={{ marginTop: 48, width: '100%' }}>
          <EmailPill bg="#F4F0F8" borderColor="#C8C0D8" />
        </div>
      </div>

      <div style={{ padding: '80px 40px 64px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? 32 : 40 }}>
          <FooterCol header="GUIDES" links={["The Compliance Officer's AML Handbook", 'The Guide to Regulatory Returns']} />
          <FooterCol header="RESOURCES" links={['Customers', 'Security', 'Pricing', 'Use cases']} />
          <FooterCol header="COMPANY" links={['About', 'Help docs', 'LinkedIn', 'X']} />
        </div>
      </div>
    </section>
  );
}

function FooterCol({ header, links }: { header: string; links: string[] }) {
  return (
    <div>
      <div style={{ ...sans, fontSize: 11, fontWeight: 600, color: COLORS.text, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>{header}</div>
      {links.map(l => (
        <a key={l} href="#" style={{ ...sans, fontSize: 15, color: COLORS.text, display: 'block', marginBottom: 8, lineHeight: 2, textDecoration: 'none' }}
           onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
           onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}>{l}</a>
      ))}
    </div>
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────
export default function Index() {
  useEffect(() => {
    document.title = 'Regco | AI for the compliance that can\'t be wrong';
    const prevBg = document.body.style.background;
    document.body.style.background = COLORS.pageBg;
    return () => { document.body.style.background = prevBg; };
  }, []);

  return (
    <div style={{ background: COLORS.pageBg, color: COLORS.text, ...sans, minHeight: '100vh' }}>
      <Nav />
      <Hero />
      <ComplianceRecord />
      <UseCases />
      <DeployCards />
      <FeaturePair />
      <Infrastructure />
      <Testimonials />
      <CTAFooter />
    </div>
  );
}
