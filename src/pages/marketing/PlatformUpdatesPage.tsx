import { PageShell, PageHero, Para, NARROW, T, AccentBar } from "./_shared";

const updates = [
  { date: "Jul 2026", tag: "Connectors", title: "Pull is now the default CBS onboarding path", body: "Institutions connect RegCo to their core banking system with read-only, Vault-encrypted credentials. File drop remains available as a fallback for environments that cannot expose a live feed." },
  { date: "Jun 2026", tag: "Reporting", title: "NFIU GoAML submission packages", body: "Suspicious transaction and activity reports are now formatted to NFIU GoAML expectations, with the supporting narrative attached for the receiving unit." },
  { date: "May 2026", tag: "AI", title: "Compliance brain: evidence-linked answers", body: "The compliance brain now cites the data, control, or regulation behind every recommendation, so reviewers can act on it and auditors can trace it." },
  { date: "Apr 2026", tag: "Screening", title: "BVN and NIN fuzzy matching", body: "Identity screening handles transliteration and nickname variation without blocking legitimate customers, reducing false positives on onboarding." },
  { date: "Mar 2026", tag: "Governance", title: "Immutable audit trail export", body: "Compliance and audit teams can export a complete, tamper-evident decision trail for external review in a single package." },
  { date: "Feb 2026", tag: "Monitoring", title: "Adaptive anomaly detection", body: "Transaction monitoring learns behavioural baselines per institution and flags structuring and velocity spikes that static rules miss." },
];

export default function PlatformUpdatesPage() {
  return (
    <PageShell>
      <PageHero
        kicker="Resources"
        title="What's new in RegCo."
        sub="A running log of the capabilities we've shipped across fraud, identity, reporting, governance, and the compliance brain."
      />
      <div style={{ maxWidth: NARROW, margin: "0 auto", paddingInline: 16, paddingBottom: 64 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {updates.map((u) => (
            <div key={u.title} style={{ display: "flex", alignItems: "flex-start", gap: 16, paddingBlock: 24, borderBottom: `1px solid ${T.ink14}` }}>
              <AccentBar color={[T.red, "#B54708", "#7A4DF2", "#1F6FEB", "#0F8A5F", "#1F6FEB"][updates.indexOf(u) % 6]} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{ color: T.ink66, fontFamily: "Inter, system-ui, sans-serif", fontSize: 13, fontWeight: 600 }}>{u.date}</span>
                  <span style={{ color: T.ink99, fontFamily: "Inter, system-ui, sans-serif", fontSize: 12, fontWeight: 500, background: T.ink0F, padding: "2px 8px", borderRadius: 999 }}>{u.tag}</span>
                </div>
                <div style={{ color: T.inkCC, fontFamily: "Inter, system-ui, sans-serif", fontSize: 18, fontWeight: 600, lineHeight: 1.4 }}>{u.title}</div>
                <Para style={{ fontSize: 15 }}>{u.body}</Para>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
