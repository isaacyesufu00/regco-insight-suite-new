import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { Check, Bell, AlertTriangle, Clock, Users, Shield, BarChart3, TrendingUp, Eye, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const scoreFactors = [
  { icon: Clock, title: "On-time submissions", desc: "Reports generated and submitted before CBN deadlines keep your score high." },
  { icon: FileText, title: "Report completeness", desc: "Reports with all required fields populated score higher than incomplete submissions." },
  { icon: TrendingUp, title: "Submission frequency", desc: "Consistent on-time filing history across all return types improves your overall score." },
  { icon: AlertTriangle, title: "Outstanding returns", desc: "Any return type that is overdue or missing reduces your score immediately." },
];

const alerts = [
  { color: "bg-success", icon: Check, title: "Report Ready", desc: "Your MFB Regulatory Return for October 2025 is ready for download and submission.", border: "border-success/20" },
  { color: "bg-warning", icon: Bell, title: "Deadline Approaching", desc: "Your AML/CFT Report is due in 5 days. Your data has not been uploaded yet.", border: "border-warning/20" },
  { color: "bg-destructive", icon: AlertTriangle, title: "Overdue", desc: "Your NFIU Return for Q3 2025 has not been submitted. Your compliance score has been affected.", border: "border-destructive/20" },
];

const dashboardItems = [
  "All report types and their current status",
  "Next submission deadline for each return",
  "Compliance score history chart",
  "Outstanding and overdue items highlighted",
  "Team activity log showing who generated what and when",
];

const roles = [
  { title: "Compliance Lead", desc: "Sees full institutional overview and team activity." },
  { title: "Compliance Officers", desc: "See their assigned return types and deadlines." },
  { title: "Reviewers & Auditors", desc: "Have read-only access to status and history." },
];

const stats = [
  { value: "94%", label: "Average compliance score across RegCo institutions" },
  { value: "Zero", label: "Missed deadlines for institutions using automated alerts" },
  { value: "30 min", label: "Average time to resolve a flagged compliance issue" },
];

const ComplianceScoreMockup = () => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setScore((prev) => {
        if (prev >= 94) { clearInterval(timer); return 94; }
        return prev + 2;
      });
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="mt-10 max-w-sm mx-auto"
    >
      <div className="rounded-2xl border border-border/60 card-elevated p-6">
        <div className="flex items-center gap-1.5 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-warning/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-success/60" />
        </div>
        <p className="text-xs text-muted-foreground mb-3">Compliance Score</p>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-5xl font-extrabold font-display text-primary">{score}%</span>
          <Badge className="mb-2 text-xs bg-success/10 text-success border-success/20">Excellent</Badge>
        </div>
        <Progress value={score} className="h-2.5 mb-4" />
        <div className="space-y-2">
          {[
            { name: "Monetary Policy Return", pct: 100 },
            { name: "AML/CFT Report", pct: 95 },
            { name: "NFIU Return", pct: 88 },
            { name: "MFB Regulatory Return", pct: 100 },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{item.name}</span>
              <span className="font-semibold text-foreground">{item.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FeatureMonitoring = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Stay Ahead of Every Compliance Deadline.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            RegCo continuously monitors your institution's compliance posture and alerts your team before deadlines are missed, scores drop, or submissions fall behind.
          </p>
        </motion.div>
        <ComplianceScoreMockup />
      </div>
    </section>

    {/* Compliance Score */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-3">
            Your compliance health at a glance.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            RegCo calculates a real-time compliance score for your institution based on submission history, upcoming deadlines, and report accuracy. Your score updates automatically as reports are generated and submitted.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {[
            { range: "90–100%", color: "bg-success/10 border-success/20 text-success", label: "Excellent — all filings on track" },
            { range: "70–89%", color: "bg-warning/10 border-warning/20 text-warning", label: "Attention needed — some items approaching deadline" },
            { range: "Below 70%", color: "bg-destructive/10 border-destructive/20 text-destructive", label: "At risk — overdue submissions detected" },
          ].map((item, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className={`rounded-xl border p-4 text-center ${item.color}`}>
              <p className="text-2xl font-bold font-display">{item.range}</p>
              <p className="text-xs mt-1 opacity-80">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* What Affects Score */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          How your compliance score is calculated.
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {scoreFactors.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Alerts & Notifications */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Never miss a deadline again.
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-4 mb-8">
          {alerts.map((a, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className={`rounded-xl border ${a.border} p-4 card-elevated flex items-start gap-3`}>
              <div className={`w-8 h-8 rounded-lg ${a.color}/10 flex items-center justify-center shrink-0`}>
                <a.icon className={`w-4 h-4 ${a.color === "bg-success" ? "text-success" : a.color === "bg-warning" ? "text-warning" : "text-destructive"}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{a.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Alerts are sent to your dashboard in real time and to your compliance lead by email automatically.
        </p>
      </div>
    </section>

    {/* Dashboard Overview */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Everything your compliance team needs in one view.
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-3">
          {dashboardItems.map((item, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="flex items-center gap-3 rounded-xl border border-border/60 p-4 card-elevated">
              <Check className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm text-foreground">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Multi-User Monitoring */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center max-w-2xl mx-auto mb-12">
          <Users className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-3">
            Your whole compliance team stays aligned.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every team member with dashboard access sees the same real-time compliance status. No more chasing colleagues for updates or discovering a missed deadline too late.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {roles.map((r, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated text-center">
              <h3 className="text-base font-bold text-foreground mb-2">{r.title}</h3>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 md:py-24 bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="text-center">
              <div className="text-3xl font-extrabold font-display text-primary mb-1">{s.value}</div>
              <p className="text-sm opacity-70">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <PageCTA headline="Keep your institution compliant. Automatically." contactMessage="I am interested in RegCo compliance monitoring. Please contact me to discuss pricing." />
    <Footer />
  </div>
);

export default FeatureMonitoring;
