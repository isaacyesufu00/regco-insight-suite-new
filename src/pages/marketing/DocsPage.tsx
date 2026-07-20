import { Link } from 'react-router-dom';

/* ===== Homepage design tokens (identical to RegcoHome) ===== */
const T = {
  canvas: "#F8F8F3",
  ink: "#000000",
  inkCC: "#000000CC",
  ink99: "#00000099",
  ink8C: "#0000008C",
  inkB3: "#000000B3",
  ink66: "#00000066",
  ink26: "#00000026",
  ink14: "#00000014",
  ink0F: "#0000000F",
  inkE6: "#000000E6",
  canvasTone: "#F8F8F3",
  red: "#C8102E",
};
const SANS = 'Inter, system-ui, -apple-system, "Segoe UI", sans-serif';
const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
const MAX = 1136;

/* ===== Homepage navbar (identical markup to RegcoHome Nav) ===== */
function Nav() {
  const links = [
    { l: "Home", to: "/" },
    { l: "Product", to: "/product" },
    { l: "Who we serve", to: "/who-we-serve" },
    { l: "Docs", to: "/docs" },
    { l: "About", to: "/about" },
  ];
  return (
    <div style={{ background: T.canvas, fontFamily: SANS, position: "sticky", top: 0, zIndex: 50 }}>
      <style>{`
        .regco-nav-link .regco-underline {
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.25s ease;
        }
        .regco-nav-link:hover .regco-underline {
          transform: scaleX(1);
        }
      `}</style>
      <div style={{
        maxWidth: MAX, margin: "0 auto", height: 70, paddingInline: 32,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24,
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <span style={{ color: T.ink, fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>RegCo</span>
        </Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {links.map((x) => (
            <Link key={x.l} to={x.to} className="regco-nav-link" style={{ position: "relative", color: T.inkCC, fontSize: 14, fontWeight: 500, textDecoration: "none", lineHeight: 1.43 }}>
              <span style={{ display: "block", textAlign: "center" }}>{x.l}</span>
              <span className="regco-underline" style={{ position: "absolute", bottom: -2, left: 0, height: 1, width: "100%", background: T.inkE6 }} />
            </Link>
          ))}
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.ink0F, borderRadius: 999, padding: "7px 12px", fontFamily: SANS, fontSize: 14, fontWeight: 500, color: T.inkCC, lineHeight: 1 }}>
            <Link to="/sign-in" style={{ color: T.inkCC, textDecoration: "none" }}>Login</Link>
          </span>
          <Link to="/book-demo" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 32, padding: "0 12px", borderRadius: 999, background: T.inkE6, color: T.canvasTone, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1, textDecoration: "none" }}>
            Book a demo
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ===== Homepage footer (identical links to RegcoHome Footer) ===== */
function Footer() {
  const cols = [
    { h: "Platform", items: ["Overview", "Fraud Detection", "Identity Screening", "Audit & Governance", "Regulatory Reporting", "AI Compliance Brain"] },
    { h: "Company", items: ["About", "Customers", "Pricing", "Careers", "Contact"] },
    { h: "Resources", items: ["Documentation", "Knowledge Base", "Compliance Guides", "Blog", "Platform Updates"] },
    { h: "Legal", items: ["Privacy Policy", "Terms of Service", "Security", "Data Processing Agreement", "Responsible AI"] },
  ];
  return (
    <div style={{ background: T.canvas }}>
      <div style={{ maxWidth: MAX, margin: "0 auto", paddingBlock: 64, paddingInline: 32 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ height: 22, width: 96, background: T.ink, borderRadius: 3, opacity: 0.85 }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", columnGap: 40, rowGap: 32 }}>
            {cols.map((c) => (
              <div key={c.h} style={{ minWidth: 112 }}>
                <div style={{ color: T.inkE6, fontFamily: SANS, fontSize: 14, fontWeight: 500, letterSpacing: "-0.14px", lineHeight: 1.43, textWrap: "balance" }}>{c.h}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                  {c.items.map((i) => (
                    <a key={i} href="#" style={{ color: T.ink99, fontFamily: SANS, fontSize: 14, fontWeight: 500, lineHeight: 1.43, textDecoration: "none" }}>{i}</a>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ color: T.ink99, fontFamily: SANS, fontSize: 12, fontWeight: 500, lineHeight: 1.33, textWrap: "pretty" }}>
              © 2026 RegCo
              <br />
              Compliance Intelligence for Financial Institutions.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Docs content (Paper design, no borders) ===== */
const C = {
  black: "#000000",
  brown: "#A76D3B",
  red: "#AD6565",
  gold: "#D99518CC",
  green: "#2A8C53",
  plum: "#9C47A1CC",
  magenta: "#A63A9D",
  violet: "#8F5DD4",
  lime: "#59A63A",
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontFamily: SERIF, fontSize: '28px', color: T.ink, letterSpacing: '-0.28px', lineHeight: '115%', marginBottom: '14px' }}>{children}</div>
);

const Row = ({ color, title, children }: { color: string; title: string; children: React.ReactNode }) => (
  <div style={{ alignItems: 'flex-start', boxSizing: 'border-box', columnGap: '16px', display: 'grid', gridTemplateColumns: '1.13fr 1fr', paddingBlock: '32px', rowGap: '12px' }}>
    <div style={{ alignItems: 'flex-start', boxSizing: 'border-box', display: 'flex', gap: '24px' }}>
      <div style={{ backgroundColor: color, boxSizing: 'border-box', flexShrink: '0', height: '16px', marginTop: '6px', width: '6px' }} />
      <div style={{ boxSizing: 'border-box', color: T.ink, flexBasis: '0%', flexGrow: '1', fontFamily: SERIF, fontSize: '24px', letterSpacing: '-0.24px', lineHeight: '115%', minWidth: '0px', textWrap: 'balance' }}>
        {title}
      </div>
    </div>
    <div style={{ boxSizing: 'border-box', color: T.ink99, fontFamily: SANS, fontSize: '14px', lineHeight: '145%', textWrap: 'pretty' }}>
      {children}
    </div>
  </div>
);

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '14px', padding: '14px 0' }}>
    <div style={{ flexShrink: 0, width: '26px', height: '26px', borderRadius: '999px', background: T.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: '13px', fontWeight: 700 }}>
      {n}
    </div>
    <div>
      <div style={{ fontFamily: SERIF, fontSize: '17px', color: T.ink, marginBottom: '4px' }}>{title}</div>
      <div style={{ fontFamily: SANS, fontSize: '14px', color: T.ink99, lineHeight: '1.55' }}>{children}</div>
    </div>
  </div>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: '13px', background: T.ink0F, borderRadius: '5px', padding: '1px 6px', color: T.ink }}>{children}</code>
);

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'how', label: 'How the connection works' },
  { id: 'pull', label: 'Option 1 — Pull (recommended)' },
  { id: 'filedrop', label: 'Option 2 — File drop (fallback)' },
  { id: 'compare', label: 'Which should you choose?' },
  { id: 'setup', label: 'In-app setup steps' },
  { id: 'faq', label: 'FAQ' },
];

export default function DocsPage() {
  return (
    <div style={{ background: T.canvas, color: T.ink, fontFamily: SANS, position: 'relative', WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale', minHeight: '100vh' }}>
      <Nav />

      {/* Hero */}
      <section style={{ paddingTop: '96px', paddingBottom: '48px' }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', paddingInline: 32 }}>
          <div style={{ fontFamily: SERIF, color: T.ink, fontSize: '38px', letterSpacing: '-0.38px', lineHeight: '105%', textWrap: 'balance', marginBottom: '32px' }}>
            Connect your bank's CBS to Regco
          </div>
          <div style={{ color: T.ink99, fontFamily: SANS, fontSize: '18px', lineHeight: '145%', textWrap: 'pretty', maxWidth: '760px' }}>
            <p style={{ marginBottom: '20px' }}>
              This guide walks your bank, step by step, through feeding transactions from your Core Banking System (CBS) into Regco — so they are monitored for fraud and AML, screened against sanctions, and reported to the CBN and NFIU without manual effort.
            </p>
            <p style={{ marginBottom: '20px' }}>
              You do not need to write any cryptography inside your CBS, and your bank never holds a Regco secret. Most banks are live in a single afternoon: grant Regco read-only access to a feed you already operate, and Regco pulls the rest.
            </p>
            <p style={{ marginBottom: '0' }}>
              If your CBS cannot expose a feed, there is a file-drop fallback that needs nothing more than a scheduled export.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '28px' }}>
            <Link to="/book-demo" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 38, padding: '0 20px', borderRadius: 999, background: T.inkE6, color: T.canvasTone, fontFamily: SANS, fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
              Book a demo
            </Link>
            <Link to="/product" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', height: 38, padding: '0 20px', borderRadius: 999, background: T.ink0F, color: T.inkCC, fontFamily: SANS, fontSize: '15px', fontWeight: 500, textDecoration: 'none' }}>
              Explore Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Body */}
      <section style={{ paddingBottom: '112px' }}>
        <div style={{ maxWidth: MAX, margin: '0 auto', paddingInline: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 180px) minmax(0, 1fr)', gap: '48px', alignItems: 'start' }}>
            {/* Sticky TOC */}
            <aside style={{ position: 'sticky', top: '96px' }}>
              <p style={{ fontFamily: SANS, fontSize: '11px', fontWeight: 700, color: T.ink66, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>On this page</p>
              {TOC.map((t) => (
                <a key={t.id} href={`#${t.id}`} style={{ display: 'block', fontFamily: SANS, fontSize: '14px', color: T.ink99, textDecoration: 'none', padding: '5px 0' }}>
                  {t.label}
                </a>
              ))}
            </aside>

            {/* Content */}
            <div style={{ minWidth: 0 }}>
              <div id="overview" style={{ scrollMarginTop: '96px' }}>
                <SectionTitle>Overview</SectionTitle>
                <div style={{ color: T.ink99, fontFamily: SANS, fontSize: '15px', lineHeight: '1.7', maxWidth: '760px' }}>
                  Regco ingests your transactions through one secure entry point. We recommend banks begin with <strong style={{ color: T.ink }}>Pull</strong> because it requires <strong style={{ color: T.ink }}>zero changes to your CBS</strong> — you simply grant Regco read-only access to data you already store. If that is not possible, use <strong style={{ color: T.ink }}>File drop</strong> as a universal fallback.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '24px 0 8px' }}>
                  {[
                    { color: C.green, title: 'No CBS code changes', body: 'Integration logic lives in Regco, not in your transaction-posting path.' },
                    { color: C.brown, title: 'Bank holds no secret', body: 'RegCo custodies credentials in its Vault; your perimeter stays clean.' },
                    { color: C.violet, title: 'Fast to security-review', body: 'Granting read access is a standard, low-risk request for your IT team.' },
                  ].map((c) => (
                    <div key={c.title} style={{ padding: '22px' }}>
                      <div style={{ width: '6px', height: '16px', background: c.color, marginBottom: '14px' }} />
                      <div style={{ fontFamily: SERIF, fontSize: '18px', color: T.ink, marginBottom: '6px' }}>{c.title}</div>
                      <div style={{ fontFamily: SANS, fontSize: '13.5px', color: T.ink99, lineHeight: '1.6' }}>{c.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="how" style={{ scrollMarginTop: '96px' }}>
                <SectionTitle>How the connection works</SectionTitle>
                <div style={{ marginTop: '8px' }}>
                  <Row color={C.black} title="Your CBS holds the transactions">
                    Your core banking system already records every lodgment, withdrawal, transfer, and charge. That data is the single source of truth Regco needs.
                  </Row>
                  <Row color={C.brown} title="Regco reads it through one secure path">
                    Either Regco pulls from a read-only feed you provision, or your bank drops a CSV into a RegCo-owned location. Both paths use the same encrypted, audited ingestion engine.
                  </Row>
                  <Row color={C.green} title="Transactions are evaluated automatically">
                    Each ingested transaction is checked against CBN and NFIU rules — thresholds, structuring, velocity, sanctions — and flagged or escalated without a human in the loop.
                  </Row>
                  <Row color={C.violet} title="Outputs flow to reporting">
                    Flagged activity becomes a case; qualifying activity becomes a CTR, SAR/STR, or GoAML filing ready for the regulator. Nothing is retyped by hand.
                  </Row>
                  <Row color={C.gold} title="Everything is auditable">
                    Every ingestion, evaluation, and decision is logged with a timestamp and identity, so your internal audit and the regulator can trace any transaction end to end.
                  </Row>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="pull" style={{ scrollMarginTop: '96px' }}>
                <div style={{ fontFamily: SANS, fontSize: '12px', fontWeight: 700, color: C.brown, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Option 1 · Recommended</div>
                <SectionTitle>Pull — RegCo reads a read-only feed</SectionTitle>
                <div style={{ color: T.ink99, fontFamily: SANS, fontSize: '15px', lineHeight: '1.7', maxWidth: '760px', marginBottom: '8px' }}>
                  Your bank provisions a <strong style={{ color: T.ink }}>read-only</strong> feed — a Postgres read-replica, a warehouse view, an SFTP CSV drop, or a read-only API. RegCo connects using credentials it stores encrypted in its own Vault, then ingests transactions on a schedule (default: daily at 02:00). Your CBS never signs anything and never holds a Regco secret.
                </div>

                <div style={{ marginTop: '20px' }}>
                  <Step n={1} title="Provision a read-only feed">
                    Create a read-only user or view on your CBS data store. Pick whichever is easiest for your team: a Postgres read-replica or warehouse view (preferred), an SFTP location RegCo can poll for a nightly CSV, or a read-only REST/API endpoint.
                  </Step>
                  <Step n={2} title="Share the connection details with RegCo">
                    Send the endpoint or host and the read-only credential to your RegCo onboarding contact through a secure channel. Credentials are encrypted at rest in RegCo's Vault — never stored in plaintext, never visible to your CBS.
                  </Step>
                  <Step n={3} title="Register the connection in RegCo">
                    In RegCo, open <Code>/dashboard/connectors</Code>, choose <strong style={{ color: T.ink }}>Pull</strong>, and enter a name and feed type. RegCo stores the connection (credential encrypted) and begins scheduled pulls.
                  </Step>
                  <Step n={4} title="Verify the first sync">
                    Open the connection and click <strong style={{ color: T.ink }}>Sync now</strong>, or wait for the scheduled run. The status shows <Code>success</Code> and your transactions appear in Monitoring within minutes. No code changes in your CBS.
                  </Step>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="filedrop" style={{ scrollMarginTop: '96px' }}>
                <div style={{ fontFamily: SANS, fontSize: '12px', fontWeight: 700, color: T.ink99, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Option 2 · Universal fallback</div>
                <SectionTitle>File drop — your bank exports a CSV</SectionTitle>
                <div style={{ color: T.ink99, fontFamily: SANS, fontSize: '15px', lineHeight: '1.7', maxWidth: '760px', marginBottom: '8px' }}>
                  If your CBS cannot expose a live feed, your bank exports transactions to a RegCo-owned drop location (SFTP/CSV). RegCo ingests the file on a schedule. This needs only a scheduled export job — still no custom crypto and no secret inside your bank.
                </div>

                <div style={{ marginTop: '20px' }}>
                  <Step n={1} title="Get your drop location">
                    RegCo provisions a write-only drop bucket for your institution and shares the SFTP path and credentials with you.
                  </Step>
                  <Step n={2} title="Schedule a CBS export">
                    Configure your CBS (or a small ETL job) to export transactions as CSV to that drop, for example nightly. One column set is enough — see the field list below.
                  </Step>
                  <Step n={3} title="Register the file-drop in RegCo">
                    In RegCo, open <Code>/dashboard/connectors</Code>, choose <strong style={{ color: T.ink }}>File drop</strong>, and enter the drop path. RegCo picks up new files on its schedule.
                  </Step>
                  <Step n={4} title="Verify ingestion">
                    After the next export, open the connection and confirm the sync status is <Code>success</Code>. Transactions flow into Monitoring automatically.
                  </Step>
                </div>

                <div style={{ padding: '20px 24px', marginTop: '16px', background: T.ink0F }}>
                  <div style={{ fontFamily: SERIF, fontSize: '16px', color: T.ink, marginBottom: '8px' }}>Expected CSV columns</div>
                  <div style={{ fontFamily: SANS, fontSize: '14px', color: T.ink99, lineHeight: '1.7' }}>
                    <Code>account_number</Code>, <Code>customer_name</Code>, <Code>amount</Code>, <Code>transaction_type</Code>, <Code>transaction_date</Code>, <Code>narration</Code>, <Code>channel</Code>, <Code>branch_code</Code>, <Code>currency</Code> (optional, defaults to NGN).
                  </div>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="compare" style={{ scrollMarginTop: '96px' }}>
                <SectionTitle>Which should you choose?</SectionTitle>
                <div style={{ marginTop: '8px' }}>
                  <Row color={C.black} title="CBS code changes"><strong style={{ color: T.ink }}>None</strong> for either path. Integration logic runs in Regco, not in your bank.</Row>
                  <Row color={C.brown} title="Bank holds a RegCo secret"><strong style={{ color: T.ink }}>No</strong> in both cases. The credential RegCo uses is encrypted in RegCo's own Vault.</Row>
                  <Row color={C.green} title="Setup effort">Pull: grant read access. File drop: schedule one export job.</Row>
                  <Row color={C.gold} title="Data freshness">Pull: near real-time or scheduled. File drop: per export, often daily.</Row>
                  <Row color={C.plum} title="Best when">Pull: a feed or replica is available. File drop: no live feed is possible.</Row>
                  <Row color={C.lime} title="Same engine either way">Both feed the identical ingestion engine, so monitoring, alerts, case management, and CBN/NFIU reporting behave exactly the same.</Row>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="setup" style={{ scrollMarginTop: '96px' }}>
                <SectionTitle>Set it up in RegCo</SectionTitle>
                <div style={{ color: T.ink99, fontFamily: SANS, fontSize: '15px', lineHeight: '1.7', marginBottom: '12px' }}>
                  Once your bank's feed or drop is ready, the in-app flow takes about two minutes.
                </div>
                <div style={{ padding: '24px 28px', background: T.ink0F }}>
                  <div style={{ fontFamily: SERIF, fontSize: '17px', color: T.ink, marginBottom: '12px' }}>/dashboard/connectors</div>
                  <ol style={{ margin: 0, paddingLeft: '20px', fontFamily: SANS, color: T.ink99, fontSize: '15px', lineHeight: '1.9' }}>
                    <li>Open <strong style={{ color: T.ink }}>CBS connectors</strong> from the dashboard sidebar (under Intelligence).</li>
                    <li>Pick <strong style={{ color: T.ink }}>Pull</strong> (recommended) or <strong style={{ color: T.ink }}>File drop</strong> (fallback).</li>
                    <li>Give the connection a name and choose the feed type.</li>
                    <li>Add the endpoint or drop path. Credentials stay encrypted in RegCo Vault.</li>
                    <li>Save, then click <strong style={{ color: T.ink }}>Sync now</strong> to confirm the first ingestion.</li>
                  </ol>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="faq" style={{ scrollMarginTop: '96px' }}>
                <SectionTitle>Frequently asked questions</SectionTitle>
                <div style={{ marginTop: '8px' }}>
                  <Row color={C.brown} title="Do we modify our CBS posting code?">No. Both Pull and File drop avoid touching your posting path. Integration logic runs in Regco, not in your bank.</Row>
                  <Row color={C.red} title="Does our bank hold a RegCo secret?">No. The credential RegCo uses to read your feed is encrypted in RegCo's own Vault. Your bank never custodies a RegCo secret.</Row>
                  <Row color={C.violet} title="What if we cannot expose any feed?">Use File drop. Your bank exports a CSV to a RegCo-owned drop; RegCo ingests it on a schedule. No live feed required.</Row>
                  <Row color={C.green} title="Is the transfer secure?">Yes. Connections use read-only, least-privilege access; secrets are Vault-encrypted and fail-closed; every ingestion is audited.</Row>
                  <Row color={C.gold} title="How fresh are the transactions?">Pull runs on a schedule you control (default daily 02:00) and can be triggered manually; File drop reflects each export run.</Row>
                  <Row color={C.plum} title="Who can see our data?">Only your institution, scoped by row-level security. RegCo staff see only what your onboarding access grants — never raw transaction secrets.</Row>
                </div>
              </div>

              {/* CTA */}
              <div style={{ height: '48px' }} />
              <div style={{ background: T.inkE6, borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: '22px', color: '#FFFFFF', marginBottom: '6px' }}>Ready to connect your bank?</div>
                  <p style={{ fontFamily: SANS, fontSize: '14px', color: '#FFFFFF99', margin: 0, maxWidth: '420px', lineHeight: 1.6 }}>
                    Book a session with our onboarding team and go live in an afternoon.
                  </p>
                </div>
                <Link to="/book-demo" style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 600, color: '#000000', background: '#FFFFFF', textDecoration: 'none', borderRadius: '999px', padding: '11px 20px' }}>
                  Book a demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
