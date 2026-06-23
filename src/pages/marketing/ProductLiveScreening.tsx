import FeaturePageTemplate from "./FeaturePageTemplate";
import { UserCheck, Globe2, Eye, RefreshCcw, FileSearch, AlertOctagon } from "lucide-react";

export default function ProductLiveScreening() {
  return (
    <FeaturePageTemplate
      seoTitle="Live Client Screening | RegCo"
      seoDescription="BVN and NIN verification plus continuous sanctions, PEP and adverse-media screening tuned for local names. One verdict per customer, fully audited."
      tag="Live Client Screening"
      title="One verdict per customer. Every watchlist. Fully audited."
      intro="Every customer is screened at onboarding and continuously thereafter against the five legally mandated sanctions lists, PEP databases, and adverse-media sources — with the underlying evidence retained against the customer record for the duration of the relationship."
      problem={{
        heading: "Five separate watchlist tools, none tuned for local names.",
        body: "Most off-the-shelf screening engines were built for Latin-alphabet names and over-match on domestic customers — flooding the queue with false positives while still missing the real hits because they don't account for naming-order variation, multiple yorùbá/igbo/hausa transliterations, or partial-match patterns. RegCo runs name-matching tuned for local conventions and unifies the five mandated watchlists into one verdict.",
      }}
      capabilities={[
        { icon: UserCheck,    title: "BVN & NIN verification",    body: "Direct NIBSS and NIMC integration. Identity verified at onboarding with biometric match and bound to the customer record." },
        { icon: Globe2,       title: "5 sanctions lists",         body: "UN Security Council, US OFAC SDN, EU Consolidated, UK HMT, CBN Watchlist — all kept in sync and screened atomically." },
        { icon: Eye,          title: "PEP & adverse media",       body: "Politically-exposed-persons database plus adverse-media monitoring across domestic and international news sources." },
        { icon: RefreshCcw,   title: "Continuous re-screening",   body: "Every customer re-screened daily as lists change. Status flips and rationale recorded automatically — no manual sweeps." },
        { icon: FileSearch,   title: "Evidence packet",           body: "Per-customer evidence file: list version, match score, decision, decision-maker, supporting docs. One click to retrieve." },
        { icon: AlertOctagon, title: "Risk-tiered queue",         body: "Hits prioritised by severity and combined risk score. Examiners see exactly why a decision was made, when." },
      ]}
      workflow={[
        { step: "01", title: "Customer onboarded", body: "BVN/NIN verified, identity documents captured, baseline screen runs across all five lists plus PEP and adverse media." },
        { step: "02", title: "Decision & evidence", body: "Clear hits auto-escalate to your queue with evidence attached. Clean customers proceed; risk score and verdict are bound to the record." },
        { step: "03", title: "Continuous monitoring", body: "Lists update daily; affected customers re-screened automatically. Status changes trigger reviewer notification with full diff." },
      ]}
      benefits={[
        { metric: "−72%", label: "False-positive rate vs. legacy" },
        { metric: "5/5",  label: "Mandated watchlists covered" },
        { metric: "<2s",  label: "Median onboarding screen" },
        { metric: "100%", label: "Decisions auditable" },
      ]}
      badges={["CBN AML/CFT", "NFIU", "FATF", "UN", "OFAC", "EU", "UK HMT"]}
      faqs={[
        { q: "How is RegCo different from name-screening libraries we already have?",
          a: "The matching engine is tuned for local naming patterns — ordering variation, transliteration, prefixes, and family names. We benchmark false positives at roughly a third of generic engines while preserving recall on real hits." },
        { q: "Do we have to manually update sanctions lists?",
          a: "No. All five lists are synced on the regulator's publication cadence. The list version used for each screening decision is recorded with the evidence." },
        { q: "Can you screen against a custom internal blacklist?",
          a: "Yes. You can upload internal denylists or allowlists. They run alongside the regulatory lists and contribute to the unified verdict." },
        { q: "Is biometric data stored?",
          a: "Verification responses are stored as hashed identifiers and decision metadata. Raw biometric payloads are not retained beyond the verification call." },
      ]}
    />
  );
}
