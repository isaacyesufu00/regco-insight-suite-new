import FeaturePageTemplate from "./FeaturePageTemplate";
import { ShieldCheck, Link2, Users, FileArchive, ClipboardList, KeyRound } from "lucide-react";

export default function ProductAuditTrail() {
  return (
    <FeaturePageTemplate
      seoTitle="Audit Trail & Case Management | RegCo"
      seoDescription="Immutable, hash-chained record of every regulatory decision. Case workflow, evidence packets, examiner-ready exports — one chain of custody."
      tag="Audit Trail & Case Mgmt"
      title="One chain of custody. Every decision attributable. Examiner-ready in one click."
      intro="Every alert, override, escalation, and submission is recorded with actor, timestamp, and supporting evidence — chained cryptographically so the record cannot be silently modified. When the examiner arrives or internal audit asks who approved what, the answer is one click away."
      problem={{
        heading: "Compliance evidence lives in five places and none of it ties together.",
        body: "Email threads, screenshots, shared drives, paper sign-offs, and a dozen unrelated tools — that's the reality of audit prep at most institutions. When CBN or internal audit asks for the decision trail behind a specific filing or case, the next two weeks are spent reconstructing it. RegCo records every action against the entity it touched, with the original evidence attached, in one tamper-evident log.",
      }}
      capabilities={[
        { icon: ShieldCheck,   title: "Tamper-evident log",     body: "Every event hash-chained to the previous. Any retroactive modification breaks the chain and is visible on the next integrity check." },
        { icon: Link2,         title: "Cross-entity linking",   body: "An action on a return, case, customer, or transaction is linked to all related entities. One query surfaces the full decision context." },
        { icon: Users,         title: "Attributable actions",   body: "Every event carries the actor, role, IP, and timestamp. Service-account actions are distinguishable from human ones." },
        { icon: FileArchive,   title: "Evidence packet export", body: "One-click examiner export bundles the case, its source data snapshot, related actions, and approvals into a signed PDF + JSON archive." },
        { icon: ClipboardList, title: "Case workflow",          body: "Assign, escalate, attach evidence, resolve — with SLAs, comments, and outcome tracking. Every state transition logged." },
        { icon: KeyRound,      title: "RBAC + retention",       body: "Role-based access scoped to the principle of least privilege. Retention policies aligned to CBN record-keeping requirements (7 years default)." },
      ]}
      workflow={[
        { step: "01", title: "Action happens", body: "Anywhere in the platform — a return submitted, a case escalated, an override applied — the event is captured with full context and hash-chained." },
        { step: "02", title: "Linked & retained", body: "The event is bound to every entity it touched: customer, return, case, transaction. Retention is set per category and enforced automatically." },
        { step: "03", title: "Examiner-ready export", body: "Request a date or entity range; receive a signed evidence packet with chain verification, ready to hand to your supervisor or external auditor." },
      ]}
      benefits={[
        { metric: "<60s",  label: "Examiner export, end-to-end" },
        { metric: "100%",  label: "Decisions attributable" },
        { metric: "7 yr",  label: "Retention out of the box" },
        { metric: "SHA-256", label: "Chain integrity" },
      ]}
      badges={["CBN record-keeping", "NFIU", "NDPC", "ISO 27001 aligned", "SOC 2 controls"]}
      faqs={[
        { q: "What exactly is recorded?",
          a: "Every state-changing action across returns, screening, monitoring, cases, and admin: who did what, when, with what input, against which entity, and the resulting state. Read-only access is logged separately for sensitive entities." },
        { q: "How is the chain verified?",
          a: "Each event includes the SHA-256 of the previous event plus its own payload. A scheduled integrity job verifies the chain end-to-end; any break is surfaced immediately with the affected range." },
        { q: "Can we delete personal data when required by NDPC?",
          a: "Yes. NDPC erasure requests are honoured by tombstoning the personal data while preserving the integrity of the chain. The fact of erasure is itself a logged, attributable event." },
        { q: "Does the auditor need a RegCo account to verify an export?",
          a: "No. The export ships with a standalone verifier and includes the public hash chain. Independent auditors verify integrity without platform access." },
      ]}
    />
  );
}
