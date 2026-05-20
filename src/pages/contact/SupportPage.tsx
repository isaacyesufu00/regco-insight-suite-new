import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, BookOpen, Plus, Minus } from "lucide-react";
import { PageShell, PageHero, ContentSection } from "@/components/eigen/PageShell";

const cards = [
  { icon: Mail, title: "Send us a message", desc: "For account issues, report errors, or technical problems. We respond within 24 hours on business days.", cta: "support@regco.com.ng", href: "mailto:support@regco.com.ng" },
  { icon: MessageCircle, title: "WhatsApp us", desc: "Quick questions about your account or reports. Available Monday to Friday, 9am–6pm WAT.", cta: "Chat on WhatsApp", href: "https://wa.me/2348000000000" },
  { icon: BookOpen, title: "Compliance Guide", desc: "Step-by-step guide to generating every return type, uploading CBS data, and understanding your compliance score.", cta: "Read the guide →", href: "/blog/compliance-guide" },
];

const faqs = [
  { q: "How do I upload my CBS data?", a: "Go to Create Report, select your regulator and return type, then upload your Excel file from your core banking system. RegCo accepts files from FlexCube, Ncube, Finacle, and any CBS that exports Excel." },
  { q: "Why is my report showing 'Validation Failed'?", a: "This usually means your balance sheet does not reconcile — your Total Assets (Net) does not equal Total Liabilities + Equity. Check that your provisions are correctly deducted from gross assets in your upload file." },
  { q: "How long does report generation take?", a: "Most reports generate in under 5 minutes. Complex reports with large transaction datasets may take up to 10 minutes." },
  { q: "Can I regenerate a report if the figures change?", a: "Yes. Go to My Reports, find the report, and click 'Regenerate'. You will need to upload an updated CBS file." },
  { q: "What file format is the generated report?", a: "All reports are generated as plain text (.txt) files formatted to match the regulator's submission template. Open in any text editor, Word, or Notepad." },
];

const Card = ({ c, i }: { c: typeof cards[number]; i: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = c.icon;
  const isInternal = c.href.startsWith("/");
  const inner = (
    <>
      <div style={{ width: 44, height: 44, borderRadius: 10, background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <Icon size={20} color="#fff" />
      </div>
      <h3 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{c.title}</h3>
      <p style={{ fontSize: 14, color: "#4A4A4A", lineHeight: 1.6, margin: "0 0 18px" }}>{c.desc}</p>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{c.cta}</span>
    </>
  );
  const baseStyle = { display: "block", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 28, textDecoration: "none", color: "inherit", height: "100%" };
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }}>
      {isInternal
        ? <Link to={c.href} style={baseStyle}>{inner}</Link>
        : <a href={c.href} style={baseStyle}>{inner}</a>}
    </motion.div>
  );
};

const FAQ = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: "#0A0A0A" }}>{q}</span>
        {open ? <Minus size={18} color="#0A0A0A" /> : <Plus size={18} color="#0A0A0A" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            <p style={{ fontSize: 15, color: "#3A3A3A", lineHeight: 1.7, margin: "0 0 20px" }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SupportPage = () => (
  <PageShell>
    <PageHero label="SUPPORT" title="How can we help?" subtitle="Get help with your RegCo account, report generation, or regulatory questions." />
    <ContentSection>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 80 }}>
        {cards.map((c, i) => <Card key={c.title} c={c} i={i} />)}
      </div>
      <div style={{ maxWidth: 760 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 24px" }}>Frequently asked questions</h2>
        <div>
          {faqs.map((f) => <FAQ key={f.q} q={f.q} a={f.a} />)}
        </div>
      </div>
    </ContentSection>
  </PageShell>
);

export default SupportPage;
