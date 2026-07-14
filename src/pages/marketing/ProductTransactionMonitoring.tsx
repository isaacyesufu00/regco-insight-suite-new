import FeaturePageTemplate from "./FeaturePageTemplate";
import { Activity, Zap, Filter, FileWarning, Sliders, LineChart } from "lucide-react";

export default function ProductTransactionMonitoring() {
  return (
    <FeaturePageTemplate
      seoTitle="Transaction Monitoring | RegCo"
      seoDescription="Near-real-time fraud and AML detection tuned to regulatory thresholds — CTR, structuring, velocity, dormancy. STR/CTR drafts ready for NFIU submission."
      tag="Transaction Monitoring"
      title="Near-real-time fraud and AML detection, with cases that arrive evidence-attached."
      intro="Rules tuned to regulatory thresholds — CTR ₦5M, 24-hour velocity ₦10M, structuring, dormancy triggers, narration mismatches — running across every transaction your CBS produces. Hits route straight into the case queue with the supporting evidence already gathered."
      problem={{
        heading: "Generic AML engines fire too late and miss the local typologies.",
        body: "International AML platforms run rules tuned to USD/EUR thresholds and Western typologies. They don't catch the structuring patterns common in domestic retail banking, they miss narration-based laundering, and by the time the batch job runs the funds have already moved. RegCo monitors at the transaction event with rules tuned to the actual CBN and NFIU thresholds.",
      }}
      capabilities={[
        { icon: Zap,          title: "Sub-100ms screening",       body: "Production tier processes transaction events at median sub-100ms latency. Hits surface before settlement, not the next morning." },
        { icon: Filter,       title: "Locally-tuned rules",      body: "CTR ₦5M, structuring within ₦4.5M bands, 24-hour velocity ₦10M, dormancy reactivation, narration-mismatch, counterparty risk — all out of the box." },
        { icon: FileWarning,  title: "Auto STR/CTR drafts",       body: "When a rule fires that meets reporting thresholds, RegCo drafts the STR or CTR in NFIU's XML format and routes it to the compliance officer for sign-off." },
        { icon: Sliders,      title: "Configurable thresholds",   body: "Adjust thresholds per license category, customer segment, or product. Changes are version-controlled with effective dates." },
        { icon: Activity,     title: "Case-attached evidence",    body: "Every case lands in the queue with the triggering transaction, related history, customer context, and rule rationale already attached." },
        { icon: LineChart,    title: "False-positive analytics",  body: "Track FP ratio per rule over time. Tune confidently with the before/after impact projected against historical data." },
      ]}
      workflow={[
        { step: "01", title: "Stream events", body: "Connect to your CBS event stream or feed batches of transactions. We support real-time and scheduled ingestion side by side." },
        { step: "02", title: "Detect & enrich", body: "Rules evaluate at the event. When one fires, the case is enriched with customer history, related transactions, and prior alerts before it reaches the queue." },
        { step: "03", title: "Decide & file", body: "Reviewer approves, escalates, or dismisses with reason. Approved STR/CTR drafts are submitted to NFIU; dismissals are logged with rationale." },
      ]}
      benefits={[
        { metric: "<100ms", label: "Median event latency" },
        { metric: "−65%",   label: "False-positive reduction" },
        { metric: "24/7",   label: "Continuous monitoring" },
        { metric: "0",      label: "Manual STR/CTR drafting" },
      ]}
      badges={["NFIU", "CBN AML/CFT", "FATF Rec. 20", "EFCC reportable", "GIABA"]}
      faqs={[
        { q: "Can we keep our existing rule set?",
          a: "Yes. The default default rule pack ships pre-configured, but every rule is editable and you can add organisation-specific rules with the visual editor or expression DSL." },
        { q: "What's the integration with NFIU?",
          a: "Approved STR and CTR drafts are produced in NFIU's accepted XML format and either uploaded automatically (where the institution has API access) or staged for manual upload via the goAML portal." },
        { q: "How do we tune false positives down?",
          a: "Each rule shows its precision and recall against your real history. Threshold or scope changes preview the impact before you commit, so you can tune without flying blind." },
        { q: "Does the case queue support role-based escalation?",
          a: "Yes — analyst, supervisor, MLRO, and executive tiers each see appropriate cases. Escalation paths and SLAs are configurable per case type." },
      ]}
    />
  );
}
