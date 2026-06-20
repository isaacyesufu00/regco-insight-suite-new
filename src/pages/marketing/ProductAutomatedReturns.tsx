import FeaturePageTemplate from "./FeaturePageTemplate";
import { FileCheck, CalendarClock, ShieldCheck, FileSpreadsheet, Inbox, GitBranch } from "lucide-react";

export default function ProductAutomatedReturns() {
  return (
    <FeaturePageTemplate
      seoTitle="Automated Regulatory Returns | RegCo"
      seoDescription="Compile, validate, and file every CBN, NDIC, NFIU, SCUML and FIRS return directly from your core banking data. Zero spreadsheets, zero late filings."
      tag="Automated Returns"
      title="Every mandatory return, compiled and filed on the regulator's calendar."
      intro="RegCo pulls directly from your core banking system, runs the same arithmetic and edit checks the regulator runs, and assembles every submission in the format the supervisor expects. Your compliance officer approves; we handle the rest."
      problem={{
        heading: "Spreadsheets, consultants, and last-minute scrambles don't scale to 17 returns.",
        body: "Most licensed institutions still hand-build returns the night before they're due — copy-pasting from CBS exports into outdated templates, hoping no schedule shifts and no edit-check fails. One missed deadline is a finding; one schema mismatch is a re-submission. RegCo eliminates both by maintaining live templates against every regulator's current specification and recomputing your figures from source every cycle.",
      }}
      capabilities={[
        { icon: FileCheck,       title: "17 mandatory returns",      body: "CBN, NDIC, NFIU, SCUML, FIRS, PENCOM — all return types covered out of the box, with new ones added when the regulator publishes them." },
        { icon: CalendarClock,   title: "Calendar-aware filing",     body: "Knows the actual due dates per license category. Reminders fire 14, 7, and 1 day out; status flips to overdue automatically." },
        { icon: ShieldCheck,     title: "Schema-validated",          body: "Each return is checked against the live regulator schema before submission — no rejections for missing fields or bad totals." },
        { icon: FileSpreadsheet, title: "PDF / XLSX / XML / CSV",    body: "One generation step, every output format the supervisor accepts. NFIU XML, CBN XLSX templates, board-pack PDF — all from the same data." },
        { icon: Inbox,           title: "Acknowledgement capture",   body: "Filing receipts and supervisor acknowledgements are stored against each submission, ready for the next on-site examination." },
        { icon: GitBranch,       title: "Versioned templates",       body: "When a regulator updates a return, the template is versioned. Prior submissions remain reproducible exactly as filed." },
      ]}
      workflow={[
        { step: "01", title: "Connect your CBS", body: "One-time connection to T24, Finacle, BankOne, NIPS or your custom core. Or schedule a daily CSV upload — either works." },
        { step: "02", title: "Approve the draft", body: "On the due-date cycle, RegCo compiles the return, runs the edit checks, and presents the draft to your compliance officer for sign-off." },
        { step: "03", title: "Submit & archive",  body: "Approved returns go to the regulator's portal. Acknowledgements, source data snapshot, and approval trail are archived under one reference." },
      ]}
      benefits={[
        { metric: "−85%", label: "Prep time per return" },
        { metric: "0",    label: "Schema-fail rejections" },
        { metric: "100%", label: "On-time filing rate" },
        { metric: "7 yr", label: "Audit-ready retention" },
      ]}
      badges={["CBN", "NDIC", "NFIU", "SCUML", "FIRS", "PENCOM", "NDPC"]}
      faqs={[
        { q: "Do you support our license category specifically?",
          a: "Yes. RegCo's return library is keyed to license category — Commercial, Merchant, Non-Interest, National/State/Unit MFB, PSB, Finance Company. The dashboard only shows you the returns you actually owe." },
        { q: "What if a regulator updates a return mid-year?",
          a: "Templates are versioned. When CBN or NFIU publishes a revised specification, our regulatory team updates the active template and re-validates the next cycle automatically — no work on your side." },
        { q: "Can the compliance officer still override figures?",
          a: "Yes. Every field is editable in the approval step, with the change logged against the user and timestamp. The original source value is retained for the audit trail." },
        { q: "Where are the source data snapshots stored?",
          a: "In your tenant-isolated storage, encrypted at rest. They are linked to each submission so any prior return can be reproduced byte-for-byte." },
      ]}
    />
  );
}
