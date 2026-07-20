import { Link } from 'react-router-dom';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';
import {
  Database, FileDown, ArrowRight, CheckCircle2, ShieldCheck, Clock,
  Server, KeyRound, Upload, Sparkles, HelpCircle, ChevronRight,
} from 'lucide-react';

/* ---------- small building blocks ---------- */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue-800)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '14px' }}>
    {children}
  </p>
);

const H1 = ({ children }: { children: React.ReactNode }) => (
  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-1.5px', lineHeight: 1.07, margin: 0, maxWidth: '760px' }}>
    {children}
  </h1>
);

const H2 = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: 'var(--n-800)', letterSpacing: '-0.6px', margin: 0 }}>
    {children}
  </h2>
);

const Lead = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: '19px', color: 'var(--n-500)', lineHeight: 1.65, maxWidth: '600px', margin: 0 }}>
    {children}
  </p>
);

const Body = ({ children }: { children: React.ReactNode }) => (
  <p style={{ fontSize: '15px', color: 'var(--n-500)', lineHeight: 1.75, margin: 0 }}>{children}</p>
);

const Card = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: 'var(--n-0)', border: '1px solid var(--n-70)', borderRadius: 'var(--radius-xl)', padding: '28px', ...style }}>
    {children}
  </div>
);

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '18px', padding: '24px 0', borderBottom: '1px solid var(--n-40)' }}>
    <div style={{ flexShrink: 0, width: '34px', height: '34px', borderRadius: '999px', background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
      {n}
    </div>
    <div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', fontWeight: 700, color: 'var(--n-800)', margin: '0 0 8px' }}>{title}</h3>
      <div style={{ fontSize: '15px', color: 'var(--n-500)', lineHeight: 1.75 }}>{children}</div>
    </div>
  </div>
);

const Checklist = ({ items }: { items: string[] }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0' }}>
    {items.map((it) => (
      <li key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '5px 0', fontSize: '14px', color: 'var(--n-500)', lineHeight: 1.6 }}>
        <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--green-500)' }} />
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', background: 'var(--n-30)', border: '1px solid var(--n-70)', borderRadius: '5px', padding: '2px 7px', color: 'var(--n-800)' }}>
    {children}
  </code>
);

const TOC = [
  { id: 'overview', label: 'Overview' },
  { id: 'pull', label: 'Option 1 — Pull (recommended)' },
  { id: 'filedrop', label: 'Option 2 — File drop (fallback)' },
  { id: 'compare', label: 'Which should you choose?' },
  { id: 'setup', label: 'In-app setup steps' },
  { id: 'faq', label: 'FAQ' },
];

export default function DocsPage() {
  return (
    <div style={{ background: 'var(--n-0)', minHeight: '100vh', fontFamily: 'var(--font-body)', color: 'var(--n-500)' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '64px', borderBottom: '1px solid var(--n-40)' }}>
        <div className="atl-container">
          <Eyebrow>Documentation</Eyebrow>
          <H1>Connect your bank's CBS to Regco</H1>
          <div style={{ height: '20px' }} />
          <Lead>
            A step-by-step guide to feeding your core banking system (CBS) transactions into Regco
            for monitoring, screening, and reporting. No custom crypto in your CBS, and Regco never
            asks your bank to hold a Regco secret.
          </Lead>
          <div style={{ height: '28px' }} />
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/dashboard/connectors" className="btn-primary">Open connectors</Link>
            <Link to="/book-demo" className="btn-secondary">Talk to onboarding</Link>
          </div>
        </div>
      </section>

      {/* Body: TOC + content */}
      <section className="atl-section" style={{ borderBottom: '1px solid var(--n-40)' }}>
        <div className="atl-container" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,220px) minmax(0,1fr)', gap: '48px', alignItems: 'start' }}>
          {/* Sticky TOC */}
          <aside style={{ position: 'sticky', top: '88px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--n-300)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>On this page</p>
            {TOC.map((t) => (
              <a key={t.id} href={`#${t.id}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: 'var(--n-500)', textDecoration: 'none', padding: '6px 0' }}>
                <ChevronRight size={13} style={{ color: 'var(--n-300)' }} /> {t.label}
              </a>
            ))}
          </aside>

          {/* Content */}
          <div style={{ minWidth: 0 }}>
            {/* Overview */}
            <div id="overview" style={{ scrollMarginTop: '88px' }}>
              <H2>Overview</H2>
              <div style={{ height: '16px' }} />
              <Body>
                Regco ingests your transactions through a single, secure entry point. We recommend
                banks start with <strong style={{ color: 'var(--n-800)' }}>Pull</strong> because it
                requires <strong style={{ color: 'var(--n-800)' }}>zero code changes inside your CBS</strong> —
                you simply grant Regco read-only access to a feed you already operate. If your CBS
                can't expose a feed, use <strong style={{ color: 'var(--n-800)' }}>File drop</strong> as a
                universal fallback.
              </Body>
              <div style={{ height: '24px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}>
                {[
                  { icon: <ShieldCheck size={18} style={{ color: 'var(--blue-800)' }} />, title: 'No CBS changes', body: 'Integration logic lives in Regco, not in your posting path.' },
                  { icon: <KeyRound size={18} style={{ color: 'var(--blue-800)' }} />, title: 'Bank holds no secret', body: 'RegCo custodies credentials in its Vault; yours stays clean.' },
                  { icon: <Clock size={18} style={{ color: 'var(--blue-800)' }} />, title: 'Fast to approve', body: 'Granting read access is a low-risk, standard security request.' },
                ].map((c) => (
                  <Card key={c.title} style={{ padding: '22px' }}>
                    <div style={{ width: '38px', height: '38px', background: 'var(--blue-100)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>{c.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--n-800)', margin: '0 0 6px' }}>{c.title}</h3>
                    <p style={{ fontSize: '13.5px', color: 'var(--n-500)', lineHeight: 1.65, margin: 0 }}>{c.body}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div style={{ height: '56px' }} />

            {/* Pull */}
            <div id="pull" style={{ scrollMarginTop: '88px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--ink)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={20} style={{ color: '#fff' }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue-800)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Option 1 · Recommended</p>
                  <H2>Pull — RegCo reads a read-only feed</H2>
                </div>
              </div>
              <div style={{ height: '14px' }} />
              <Body>
                Your bank provisions a <strong style={{ color: 'var(--n-800)' }}>read-only</strong> feed — a
                Postgres read-replica, a warehouse view, an SFTP CSV drop, or a read-only API. RegCo
                connects with credentials it stores encrypted in its own Vault, then ingests
                transactions on a schedule (default: daily at 02:00). Your CBS never signs anything
                and never holds a RegCo secret.
              </Body>

              <div style={{ height: '22px' }} />
              <Card style={{ padding: '8px 28px' }}>
                <Step n={1} title="Provision a read-only feed">
                  Create a read-only user / view on your CBS data store. Pick whichever is easiest for
                  your team:
                  <div style={{ height: '10px' }} />
                  <Checklist items={[
                    'Postgres read-replica or warehouse view (preferred)',
                    'SFTP location RegCo can poll for a nightly CSV',
                    'Read-only REST/API endpoint',
                  ]} />
                </Step>
                <Step n={2} title="Share connection details with RegCo">
                  Provide the endpoint/host and the read-only credential to your RegCo onboarding
                  contact. Credentials are encrypted at rest in RegCo's Vault — they are never
                  stored in plaintext and are never visible to your CBS.
                </Step>
                <Step n={3} title="Register the connection in-app">
                  In RegCo, go to <Code>/dashboard/connectors</Code> → choose <strong>Pull</strong> →
                  enter a name and feed type. RegCo stores the connection (credential encrypted) and
                  begins scheduled pulls.
                </Step>
                <Step n={4} title="Verify the first sync">
                  Open the connection and click <strong>Sync now</strong>, or wait for the scheduled
                  run. The status shows <Code>success</Code> and your transactions appear in
                  Monitoring within minutes. That's it — no code in your CBS.
                </Step>
              </Card>
            </div>

            <div style={{ height: '56px' }} />

            {/* File drop */}
            <div id="filedrop" style={{ scrollMarginTop: '88px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--n-800)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileDown size={20} style={{ color: '#fff' }} />
                </div>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--n-500)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Option 2 · Universal fallback</p>
                  <H2>File drop — bank exports a CSV</H2>
                </div>
              </div>
              <div style={{ height: '14px' }} />
              <Body>
                If your CBS can't expose a live feed, your bank exports transactions to a RegCo-owned
                drop location (SFTP/CSV). RegCo ingests the file on a schedule. This needs only a
                scheduled export job — still no custom crypto and no secret in your bank.
              </Body>

              <div style={{ height: '22px' }} />
              <Card style={{ padding: '8px 28px' }}>
                <Step n={1} title="Get your drop location">
                  RegCo provisions a write-only drop bucket for your institution and shares the
                  SFTP path / credentials with you.
                </Step>
                <Step n={2} title="Schedule a CBS export">
                  Configure your CBS (or a small ETL job) to export transactions as CSV to that drop,
                  e.g. nightly. One column set is enough — see the field list below.
                </Step>
                <Step n={3} title="Register the file-drop in-app">
                  In RegCo, go to <Code>/dashboard/connectors</Code> → choose <strong>File drop</strong> →
                  enter the drop path. RegCo picks up new files on its schedule.
                </Step>
                <Step n={4} title="Verify ingestion">
                  After the next export, open the connection and confirm the sync status is
                  <Code>success</Code>. Transactions flow into Monitoring automatically.
                </Step>
              </Card>

              <div style={{ height: '20px' }} />
              <Card style={{ background: 'var(--n-30)', border: '1px solid var(--n-70)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Upload size={16} style={{ color: 'var(--blue-800)' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '14px', fontWeight: 700, color: 'var(--n-800)' }}>Expected CSV columns</span>
                </div>
                <Body>
                  <Code>account_number</Code>, <Code>customer_name</Code>, <Code>amount</Code>,
                  <Code>transaction_type</Code>, <Code>transaction_date</Code>, <Code>narration</Code>,
                  <Code>channel</Code>, <Code>branch_code</Code>, <Code>currency</Code> (optional, defaults to NGN).
                </Body>
              </Card>
            </div>

            <div style={{ height: '56px' }} />

            {/* Compare */}
            <div id="compare" style={{ scrollMarginTop: '88px' }}>
              <H2>Which should you choose?</H2>
              <div style={{ height: '16px' }} />
              <Card style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', background: 'var(--n-800)', color: '#fff' }}>
                  <div style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700 }}>Consideration</div>
                  <div style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, borderLeft: '1px solid rgba(255,255,255,0.12)' }}>Pull (recommended)</div>
                  <div style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, borderLeft: '1px solid rgba(255,255,255,0.12)' }}>File drop (fallback)</div>
                </div>
                {[
                  ['CBS code changes', 'None', 'None'],
                  ['Bank holds a RegCo secret', 'No', 'No'],
                  ['Setup effort', 'Grant read access', 'Schedule one export'],
                  ['Freshness', 'Near real-time / scheduled', 'Per export (often daily)'],
                  ['Best when', 'Feed or replica available', 'No live feed possible'],
                ].map((row, i) => (
                  <div key={row[0]} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', borderTop: '1px solid var(--n-70)', background: i % 2 ? 'var(--n-30)' : 'var(--n-0)' }}>
                    <div style={{ padding: '13px 20px', fontSize: '14px', fontWeight: 600, color: 'var(--n-800)' }}>{row[0]}</div>
                    <div style={{ padding: '13px 20px', fontSize: '14px', color: 'var(--n-500)', borderLeft: '1px solid var(--n-70)' }}>{row[1]}</div>
                    <div style={{ padding: '13px 20px', fontSize: '14px', color: 'var(--n-500)', borderLeft: '1px solid var(--n-70)' }}>{row[2]}</div>
                  </div>
                ))}
              </Card>
              <div style={{ height: '16px' }} />
              <Body>
                Both paths feed the <em>same</em> ingestion engine, so monitoring, alerts, case
                management, and NFIU/CBN reporting behave identically regardless of which you pick.
              </Body>
            </div>

            <div style={{ height: '56px' }} />

            {/* Setup steps in app */}
            <div id="setup" style={{ scrollMarginTop: '88px' }}>
              <H2>Set it up in RegCo</H2>
              <div style={{ height: '16px' }} />
              <Body>Once your bank's feed or drop is ready, the in-app flow takes about two minutes:</Body>
              <div style={{ height: '18px' }} />
              <Card style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <Server size={18} style={{ color: 'var(--blue-800)' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--n-800)' }}>/dashboard/connectors</span>
                </div>
                <ol style={{ margin: 0, paddingLeft: '20px', color: 'var(--n-500)', fontSize: '15px', lineHeight: 1.8 }}>
                  <li>Open <strong style={{ color: 'var(--n-800)' }}>CBS connectors</strong> from the dashboard sidebar (under Intelligence).</li>
                  <li>Pick <strong style={{ color: 'var(--n-800)' }}>Pull</strong> (recommended) or <strong style={{ color: 'var(--n-800)' }}>File drop</strong> (fallback).</li>
                  <li>Give the connection a name and choose the feed type.</li>
                  <li>Add the endpoint / drop path. Credentials stay encrypted in RegCo Vault.</li>
                  <li>Save, then click <strong>Sync now</strong> to confirm the first ingestion.</li>
                </ol>
              </Card>
            </div>

            <div style={{ height: '56px' }} />

            {/* FAQ */}
            <div id="faq" style={{ scrollMarginTop: '88px' }}>
              <H2>Frequently asked questions</H2>
              <div style={{ height: '16px' }} />
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { q: 'Do we have to modify our CBS transaction-posting code?', a: 'No. Both Pull and File drop avoid touching your posting path. Integration logic runs in RegCo, not in your bank.' },
                  { q: 'Does our bank hold any RegCo secret?', a: 'No. Credentials RegCo uses to read your feed are encrypted in RegCo’s own Vault. Your bank never custodies a RegCo secret.' },
                  { q: 'What if we cannot expose any feed at all?', a: 'Use File drop. Your bank exports a CSV to a RegCo-owned drop; RegCo ingests it on a schedule. No live feed required.' },
                  { q: 'Is the data transfer secure?', a: 'Yes. Connections use read-only, least-privilege access; secrets are Vault-encrypted and fail-closed; every ingestion is audited.' },
                  { q: 'How fresh are the transactions?', a: 'Pull runs on a schedule you control (default daily 02:00) and can be triggered manually; File drop reflects each export run.' },
                ].map((f) => (
                  <Card key={f.q} style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <HelpCircle size={18} style={{ flexShrink: 0, marginTop: '1px', color: 'var(--blue-800)' }} />
                      <div>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 700, color: 'var(--n-800)', margin: '0 0 6px' }}>{f.q}</p>
                        <p style={{ fontSize: '14px', color: 'var(--n-500)', lineHeight: 1.7, margin: 0 }}>{f.a}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ height: '48px' }} />
            <Card style={{ background: 'var(--ink)', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Sparkles size={16} style={{ color: '#fff' }} />
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 700 }}>Ready to connect?</span>
                </div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', margin: 0, maxWidth: '420px' }}>
                  Start a pull connection in your dashboard, or book a session with onboarding.
                </p>
              </div>
              <Link to="/dashboard/connectors" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', color: 'var(--ink)', fontSize: '14px', fontWeight: 600, padding: '10px 18px', borderRadius: '999px', textDecoration: 'none' }}>
                Go to connectors <ArrowRight size={15} />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
