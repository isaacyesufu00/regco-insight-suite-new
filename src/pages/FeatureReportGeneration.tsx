import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { Upload, Settings, Download, FileText, FileSpreadsheet, FileType, Check, RefreshCw, Clock, Zap, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const steps = [
  { icon: Upload, title: "Upload", desc: "Upload your core banking export in Excel or CSV format. Supported systems include Flexcube, Finacle, T24, Rubies, Bankone, and standard Excel files." },
  { icon: Settings, title: "Process", desc: "RegCo validates your data, structures it to CBN requirements, and generates your formatted return automatically." },
  { icon: Download, title: "Download", desc: "Download your finished report in PDF for direct submission, Word for editing, or Excel for internal verification." },
];

const reportTypes = [
  { name: "CBN Monetary Policy Return", who: "Commercial Banks & MFBs", freq: "Monthly" },
  { name: "CBN Forex Return", who: "Commercial Banks & Authorised Dealers", freq: "Weekly & Monthly" },
  { name: "AML/CFT Report", who: "All Licensed Institutions", freq: "Quarterly" },
  { name: "NFIU Regulatory Return", who: "All Licensed Institutions", freq: "Quarterly" },
  { name: "Prudential Return", who: "Commercial Banks & Merchant Banks", freq: "Monthly" },
  { name: "MFB Regulatory Return", who: "Microfinance Banks", freq: "Monthly" },
  { name: "SCUML Compliance Report", who: "Finance Companies & DNFBPs", freq: "Annual" },
];

const formats = [
  { icon: FileText, name: "PDF", headline: "Ready to Submit", desc: "Formatted to exact CBN standards. Print or attach directly to your CBN portal submission. No reformatting needed.", tag: "Most Popular" },
  { icon: FileType, name: "Word", headline: "Editable Before Submission", desc: "Full Word document if your compliance officer needs to make minor adjustments or add commentary before submission.", tag: null },
  { icon: FileSpreadsheet, name: "Excel", headline: "Full Data Audit Trail", desc: "Complete underlying data in tabular format for internal audit, finance team review, or record keeping purposes.", tag: null },
];

const systems = ["Oracle Flexcube", "Infosys Finacle", "Temenos T24", "Rubies", "Bankone", "Manual Excel Upload", "Custom CSV"];

const stats = [
  { value: "5+ Hours", label: "Saved per report cycle per institution" },
  { value: "Under 5 min", label: "From data upload to finished report" },
  { value: "7 Returns", label: "CBN return types supported and growing" },
];

const ReportMockup = () => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Processing");

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setStatus("Ready");
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-10 max-w-md mx-auto"
    >
      <div className="rounded-2xl border border-border/60 card-elevated p-6">
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">CBN Monetary Policy Return</span>
          <Badge variant={status === "Ready" ? "default" : "secondary"} className="text-xs">
            {status}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-3">October 2025 • First National MFB</p>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2 text-right">{progress}%</p>
      </div>
    </motion.div>
  );
};

const FeatureReportGeneration = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Regulatory Reports That Write Themselves.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload your data. Select your return type. Download a submission-ready CBN report in minutes — formatted exactly to current CBN standards.
          </p>
        </motion.div>
        <ReportMockup />
      </div>
    </section>

    {/* Three Steps */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-14">
          Three steps to a finished CBN return.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="relative text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <s.icon className="w-8 h-8 text-primary" />
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Step {i + 1}</span>
              <h3 className="text-lg font-bold text-foreground mt-1 mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 text-border">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Report Types */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-4">
          Every CBN return your institution needs.
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.5} className="text-sm text-muted-foreground text-center mb-12 max-w-lg mx-auto">
          RegCo supports all major CBN return types across banks, MFBs, and finance companies.
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {reportTypes.map((r, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.08 + 1} className="rounded-2xl border border-border/60 p-5 card-elevated">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-success shrink-0" />
                <h3 className="text-sm font-bold text-foreground">{r.name}</h3>
              </div>
              <Badge variant="secondary" className="text-xs mb-2">{r.freq}</Badge>
              <p className="text-xs text-muted-foreground">Applies to: {r.who}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Download Formats */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Download in the format that works for you.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {formats.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated text-center relative">
              {f.tag && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs">{f.tag}</Badge>
              )}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{f.headline}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Accuracy & Updates — dark section */}
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="max-w-3xl mx-auto text-center mb-10">
          <RefreshCw className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold font-display leading-tight mb-4">
            Always formatted to current CBN standards.
          </h2>
          <p className="text-sm opacity-70 leading-relaxed max-w-2xl mx-auto">
            CBN reporting templates change. When they do, RegCo updates automatically so your institution never submits an outdated return. Our compliance team monitors CBN circulars and template updates continuously.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            "Automatic template updates when CBN requirements change.",
            "Validation checks that flag missing or inconsistent data before generation.",
            "Full generation audit trail showing what data was used and when the report was created.",
          ].map((point, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm opacity-80">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Compatible Systems */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-10">
          Works with how your institution already operates.
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto mb-6">
          {systems.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.08 + 1}>
              <Badge variant="outline" className="text-sm px-4 py-2 font-medium">{s}</Badge>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Not sure if your system is supported? <a href="/contact" className="text-primary hover:underline font-medium">Contact us</a> and we'll confirm within 24 hours.
        </p>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated text-center">
              <div className="text-3xl font-extrabold font-display text-primary mb-1">{s.value}</div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <PageCTA headline="Start generating your first CBN report today." contactMessage="I am interested in RegCo report generation. Please contact me to discuss pricing." />
    <Footer />
  </div>
);

export default FeatureReportGeneration;
