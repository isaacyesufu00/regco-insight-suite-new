import { Link } from 'react-router-dom';
import { Navbar } from '@/components/marketing/Navbar';
import { Footer } from '@/components/marketing/Footer';

const SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';
const SANS = '"DM Sans", system-ui, sans-serif';

const INK = '#000000CC';
const INK_SOFT = '#00000099';
const INK_FAINT = '#00000066';
const HAIR = '#0000001A';

// Color bar palette lifted directly from the Paper reference design.
const C = {
  brown: '#A76D3B',
  red: '#AD6565',
  gold: '#D99518CC',
  green: '#2A8C53',
  plum: '#9C47A1CC',
  magenta: '#A63A9D',
  violet: '#8F5DD4',
  lime: '#59A63A',
  black: '#000000',
};

const Container = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ boxSizing: 'border-box', marginLeft: 'auto', marginRight: 'auto', width: 'min(100% - 32px, 1040px)', ...style }}>
    {children}
  </div>
);

// A two-column "row" exactly matching the Paper reference pattern.
const Row = ({ color, title, children }: { color: string; title: string; children: React.ReactNode }) => (
  <div style={{ alignItems: 'flex-start', borderTopColor: HAIR, borderTopStyle: 'solid', borderTopWidth: '1px', boxSizing: 'border-box', columnGap: '16px', display: 'grid', gridTemplateColumns: '1.13fr 1fr', paddingBlock: '32px', rowGap: '12px' }}>
    <div style={{ alignItems: 'flex-start', boxSizing: 'border-box', display: 'flex', gap: '24px' }}>
      <div style={{ backgroundColor: color, boxSizing: 'border-box', flexShrink: '0', height: '16px', marginTop: '6px', width: '6px' }} />
      <div style={{ boxSizing: 'border-box', color: INK, flexBasis: '0%', flexGrow: '1', fontFamily: SERIF, fontSize: '24px', letterSpacing: '-0.24px', lineHeight: '115%', minWidth: '0px', textWrap: 'balance' }}>
        {title}
      </div>
    </div>
    <div style={{ boxSizing: 'border-box', color: INK_SOFT, fontFamily: SANS, fontSize: '14px', lineHeight: '145%', textWrap: 'pretty' }}>
      {children}
    </div>
  </div>
);

const Step = ({ n, title, children }: { n: number; title: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: '14px', padding: '14px 0', borderBottom: `1px solid ${HAIR}` }}>
    <div style={{ flexShrink: 0, width: '26px', height: '26px', borderRadius: '999px', background: INK, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: '13px', fontWeight: 700 }}>
      {n}
    </div>
    <div>
      <div style={{ fontFamily: SERIF, fontSize: '17px', color: INK, marginBottom: '4px' }}>{title}</div>
      <div style={{ fontFamily: SANS, fontSize: '14px', color: INK_SOFT, lineHeight: '1.55' }}>{children}</div>
    </div>
  </div>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code style={{ fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontSize: '13px', background: '#0000000A', border: `1px solid ${HAIR}`, borderRadius: '5px', padding: '1px 6px', color: INK }}>
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
    <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: SANS, color: INK_SOFT }}>
      <Navbar />

      {/* Hero */}
      <section style={{ boxSizing: 'border-box', paddingTop: '128px', paddingBottom: '48px' }}>
        <Container>
          <div style={{ boxSizing: 'border-box', fontFamily: SERIF, color: INK, fontSize: '38px', letterSpacing: '-0.38px', lineHeight: '105%', textWrap: 'balance', marginBottom: '32px' }}>
            Connect your bank's CBS to Regco
          </div>
          <div style={{ boxSizing: 'border-box', color: INK_SOFT, fontFamily: SANS, fontSize: '18px', lineHeight: '145%', textWrap: 'pretty', maxWidth: '720px' }}>
            <p style={{ marginBottom: '20px' }}>
              A step-by-step guide to feeding your core banking system (CBS) transactions into Regco for monitoring, screening, and reporting. No custom crypto in your CBS — and Regco never asks your bank to hold a Regco secret.
            </p>
            <p style={{ marginBottom: '20px' }}>
              We recommend starting with <strong style={{ color: INK }}>Pull</strong>, because it requires <strong style={{ color: INK }}>zero code changes inside your CBS</strong>. If your CBS can't expose a feed, use <strong style={{ color: INK }}>File drop</strong> as a universal fallback.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
            <Link to="/dashboard/connectors" style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 500, color: '#FFFFFF', background: INK, textDecoration: 'none', borderRadius: '999px', padding: '10px 18px', transition: 'background 0.15s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#000000')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = INK)}
            >
              Open connectors
            </Link>
            <Link to="/book-demo" style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 500, color: INK, background: 'transparent', border: `1px solid ${HAIR}`, textDecoration: 'none', borderRadius: '999px', padding: '10px 18px', transition: 'background 0.15s' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#0000000A')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              Talk to onboarding
            </Link>
          </div>
        </Container>
      </section>

      {/* Body */}
      <section style={{ boxSizing: 'border-box', paddingBottom: '144px' }}>
        <Container>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 180px) minmax(0, 1fr)', gap: '48px', alignItems: 'start' }}>
            {/* Sticky TOC */}
            <aside style={{ position: 'sticky', top: '96px' }}>
              <p style={{ fontFamily: SANS, fontSize: '11px', fontWeight: 700, color: INK_FAINT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>On this page</p>
              {TOC.map((t) => (
                <a key={t.id} href={`#${t.id}`} style={{ display: 'block', fontFamily: SANS, fontSize: '14px', color: INK_SOFT, textDecoration: 'none', padding: '5px 0', borderLeft: `2px solid ${HAIR}`, paddingLeft: '12px', marginBottom: '2px' }}>
                  {t.label}
                </a>
              ))}
            </aside>

            {/* Content */}
            <div style={{ minWidth: 0 }}>
              <div id="overview" style={{ scrollMarginTop: '96px' }}>
                <div style={{ fontFamily: SERIF, fontSize: '28px', color: INK, letterSpacing: '-0.28px', lineHeight: '115%', marginBottom: '20px' }}>Overview</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '8px' }}>
                  {[
                    { color: C.green, title: 'No CBS changes', body: 'Integration logic lives in Regco, not in your posting path.' },
                    { color: C.brown, title: 'Bank holds no secret', body: 'RegCo custodies credentials in its Vault; yours stays clean.' },
                    { color: C.violet, title: 'Fast to approve', body: 'Granting read access is a low-risk, standard security request.' },
                  ].map((c) => (
                    <div key={c.title} style={{ border: `1px solid ${HAIR}`, borderRadius: '12px', padding: '22px' }}>
                      <div style={{ width: '6px', height: '16px', background: c.color, marginBottom: '14px' }} />
                      <div style={{ fontFamily: SERIF, fontSize: '18px', color: INK, marginBottom: '6px' }}>{c.title}</div>
                      <div style={{ fontFamily: SANS, fontSize: '13.5px', color: INK_SOFT, lineHeight: '1.6' }}>{c.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="pull" style={{ scrollMarginTop: '96px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontFamily: SANS, fontSize: '12px', fontWeight: 700, color: C.brown, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Option 1 · Recommended</span>
                </div>
                <div style={{ fontFamily: SERIF, fontSize: '28px', color: INK, letterSpacing: '-0.28px', lineHeight: '115%', marginBottom: '14px' }}>Pull — RegCo reads a read-only feed</div>
                <div style={{ fontFamily: SANS, fontSize: '15px', color: INK_SOFT, lineHeight: '1.7', maxWidth: '760px', marginBottom: '8px' }}>
                  Your bank provisions a <strong style={{ color: INK }}>read-only</strong> feed — a Postgres read-replica, a warehouse view, an SFTP CSV drop, or a read-only API. RegCo connects with credentials it stores encrypted in its own Vault, then ingests transactions on a schedule (default: daily at 02:00). Your CBS never signs anything and never holds a RegCo secret.
                </div>

                <div style={{ border: `1px solid ${HAIR}`, borderRadius: '12px', padding: '8px 28px', marginTop: '20px' }}>
                  <Step n={1} title="Provision a read-only feed">
                    Create a read-only user / view on your CBS data store — a Postgres read-replica or warehouse view (preferred), an SFTP location RegCo can poll for a nightly CSV, or a read-only REST/API endpoint.
                  </Step>
                  <Step n={2} title="Share connection details with RegCo">
                    Provide the endpoint/host and the read-only credential to your RegCo onboarding contact. Credentials are encrypted at rest in RegCo's Vault — never stored in plaintext, never visible to your CBS.
                  </Step>
                  <Step n={3} title="Register the connection in-app">
                    In RegCo, go to <Code>/dashboard/connectors</Code> → choose <strong style={{ color: INK }}>Pull</strong> → enter a name and feed type. RegCo stores the connection (credential encrypted) and begins scheduled pulls.
                  </Step>
                  <Step n={4} title="Verify the first sync">
                    Open the connection and click <strong style={{ color: INK }}>Sync now</strong>, or wait for the scheduled run. The status shows <Code>success</Code> and your transactions appear in Monitoring within minutes. No code in your CBS.
                  </Step>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="filedrop" style={{ scrollMarginTop: '96px' }}>
                <div style={{ fontFamily: SANS, fontSize: '12px', fontWeight: 700, color: INK_SOFT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Option 2 · Universal fallback</div>
                <div style={{ fontFamily: SERIF, fontSize: '28px', color: INK, letterSpacing: '-0.28px', lineHeight: '115%', marginBottom: '14px' }}>File drop — bank exports a CSV</div>
                <div style={{ fontFamily: SANS, fontSize: '15px', color: INK_SOFT, lineHeight: '1.7', maxWidth: '760px', marginBottom: '8px' }}>
                  If your CBS can't expose a live feed, your bank exports transactions to a RegCo-owned drop location (SFTP/CSV). RegCo ingests the file on a schedule. This needs only a scheduled export job — still no custom crypto and no secret in your bank.
                </div>

                <div style={{ border: `1px solid ${HAIR}`, borderRadius: '12px', padding: '8px 28px', marginTop: '20px' }}>
                  <Step n={1} title="Get your drop location">
                    RegCo provisions a write-only drop bucket for your institution and shares the SFTP path / credentials with you.
                  </Step>
                  <Step n={2} title="Schedule a CBS export">
                    Configure your CBS (or a small ETL job) to export transactions as CSV to that drop, e.g. nightly. One column set is enough — see the field list below.
                  </Step>
                  <Step n={3} title="Register the file-drop in-app">
                    In RegCo, go to <Code>/dashboard/connectors</Code> → choose <strong style={{ color: INK }}>File drop</strong> → enter the drop path. RegCo picks up new files on its schedule.
                  </Step>
                  <Step n={4} title="Verify ingestion">
                    After the next export, open the connection and confirm the sync status is <Code>success</Code>. Transactions flow into Monitoring automatically.
                  </Step>
                </div>

                <div style={{ border: `1px solid ${HAIR}`, borderRadius: '12px', padding: '20px 24px', marginTop: '16px', background: '#00000005' }}>
                  <div style={{ fontFamily: SERIF, fontSize: '16px', color: INK, marginBottom: '8px' }}>Expected CSV columns</div>
                  <div style={{ fontFamily: SANS, fontSize: '14px', color: INK_SOFT, lineHeight: '1.7' }}>
                    <Code>account_number</Code>, <Code>customer_name</Code>, <Code>amount</Code>, <Code>transaction_type</Code>, <Code>transaction_date</Code>, <Code>narration</Code>, <Code>channel</Code>, <Code>branch_code</Code>, <Code>currency</Code> (optional, defaults to NGN).
                  </div>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="compare" style={{ scrollMarginTop: '96px' }}>
                <div style={{ fontFamily: SERIF, fontSize: '28px', color: INK, letterSpacing: '-0.28px', lineHeight: '115%', marginBottom: '20px' }}>Which should you choose?</div>
                <div>
                  <Row color={C.green} title="CBS code changes"><strong style={{ color: INK }}>None</strong> for either path. Integration logic runs in Regco, not in your bank.</Row>
                  <Row color={C.brown} title="Bank holds a RegCo secret"><strong style={{ color: INK }}>No</strong> in both cases. Credentials RegCo uses are encrypted in RegCo's own Vault.</Row>
                  <Row color={C.violet} title="Setup effort">Pull: grant read access. File drop: schedule one export job.</Row>
                  <Row color={C.gold} title="Freshness">Pull: near real-time / scheduled. File drop: per export (often daily).</Row>
                  <Row color={C.plum} title="Best when">Pull: a feed or replica is available. File drop: no live feed is possible.</Row>
                  <Row color={C.lime} title="Same engine either way">Both feed the identical ingestion engine, so monitoring, alerts, case management, and NFIU/CBN reporting behave exactly the same.</Row>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="setup" style={{ scrollMarginTop: '96px' }}>
                <div style={{ fontFamily: SERIF, fontSize: '28px', color: INK, letterSpacing: '-0.28px', lineHeight: '115%', marginBottom: '16px' }}>Set it up in Regco</div>
                <div style={{ fontFamily: SANS, fontSize: '15px', color: INK_SOFT, lineHeight: '1.7', marginBottom: '12px' }}>
                  Once your bank's feed or drop is ready, the in-app flow takes about two minutes.
                </div>
                <div style={{ border: `1px solid ${HAIR}`, borderRadius: '12px', padding: '24px 28px' }}>
                  <div style={{ fontFamily: SERIF, fontSize: '17px', color: INK, marginBottom: '12px' }}>/dashboard/connectors</div>
                  <ol style={{ margin: 0, paddingLeft: '20px', fontFamily: SANS, color: INK_SOFT, fontSize: '15px', lineHeight: '1.9' }}>
                    <li>Open <strong style={{ color: INK }}>CBS connectors</strong> from the dashboard sidebar (under Intelligence).</li>
                    <li>Pick <strong style={{ color: INK }}>Pull</strong> (recommended) or <strong style={{ color: INK }}>File drop</strong> (fallback).</li>
                    <li>Give the connection a name and choose the feed type.</li>
                    <li>Add the endpoint / drop path. Credentials stay encrypted in RegCo Vault.</li>
                    <li>Save, then click <strong style={{ color: INK }}>Sync now</strong> to confirm the first ingestion.</li>
                  </ol>
                </div>
              </div>

              <div style={{ height: '56px' }} />

              <div id="faq" style={{ scrollMarginTop: '96px' }}>
                <div style={{ fontFamily: SERIF, fontSize: '28px', color: INK, letterSpacing: '-0.28px', lineHeight: '115%', marginBottom: '20px' }}>Frequently asked questions</div>
                <div>
                  <Row color={C.brown} title="Do we modify CBS posting code?">No. Both Pull and File drop avoid touching your posting path. Integration logic runs in RegCo, not in your bank.</Row>
                  <Row color={C.red} title="Does our bank hold a RegCo secret?">No. Credentials RegCo uses to read your feed are encrypted in RegCo's own Vault. Your bank never custodies a RegCo secret.</Row>
                  <Row color={C.violet} title="No feed at all?">Use File drop. Your bank exports a CSV to a RegCo-owned drop; RegCo ingests it on a schedule. No live feed required.</Row>
                  <Row color={C.green} title="Is the transfer secure?">Yes. Connections use read-only, least-privilege access; secrets are Vault-encrypted and fail-closed; every ingestion is audited.</Row>
                  <Row color={C.gold} title="How fresh are transactions?">Pull runs on a schedule you control (default daily 02:00) and can be triggered manually; File drop reflects each export run.</Row>
                </div>
              </div>

              {/* CTA */}
              <div style={{ height: '48px' }} />
              <div style={{ background: INK, borderRadius: '16px', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: '22px', color: '#FFFFFF', marginBottom: '6px' }}>Ready to connect?</div>
                  <p style={{ fontFamily: SANS, fontSize: '14px', color: '#FFFFFF99', margin: 0, maxWidth: '420px', lineHeight: 1.6 }}>
                    Start a pull connection in your dashboard, or book a session with onboarding.
                  </p>
                </div>
                <Link to="/dashboard/connectors" style={{ fontFamily: SANS, fontSize: '15px', fontWeight: 600, color: '#000000', background: '#FFFFFF', textDecoration: 'none', borderRadius: '999px', padding: '11px 20px' }}>
                  Go to connectors
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </div>
  );
}
