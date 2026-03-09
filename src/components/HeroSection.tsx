import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Upload, ListChecks, Download, Landmark, ShieldCheck, FileText, Scale, Users, BadgeCheck } from "lucide-react";
import DashboardMock from "./DashboardMock";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1 },
  }),
};

const howItWorks = [
  {
    icon: Upload,
    step: "Step 1",
    title: "Upload your CBS export",
    desc: "Drop your core banking system export file — CSV or Excel. No reformatting needed.",
  },
  {
    icon: ListChecks,
    step: "Step 2",
    title: "Select your return type",
    desc: "Choose the CBN return you need to file. RegCo handles formatting and calculations.",
  },
  {
    icon: Download,
    step: "Step 3",
    title: "Download your submission-ready report",
    desc: "Get a fully compliant report in PDF, Word, or Excel — ready to submit to the CBN.",
  },
];

const stats = [
  { value: "Under 5 minutes", label: "Average report generation time" },
  { value: "8+ hours saved", label: "Per compliance officer per month" },
  { value: "₦2,000,000+", label: "Average CBN penalty avoided" },
];

const institutionBadges = ["Unit MFB", "State MFB", "National MFB", "Commercial Bank"];

const regulatoryItems = [
  { icon: Landmark, label: "CBN Returns" },
  { icon: Users, label: "NFIU Reporting" },
  { icon: ShieldCheck, label: "AML/CFT Compliance" },
  { icon: Scale, label: "NDPC Data Protection" },
  { icon: BadgeCheck, label: "SCUML Reporting" },
];

const HeroSection = () => {
  return (
    <>
      {/* Hero */}
      <section className="hero-gradient pt-28 pb-0 md:pt-36 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
              Stop Filing CBN Returns Manually.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Get submission-ready regulatory reports in under 5 minutes. Built exclusively for Nigerian banks and microfinance banks.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold">
                <Link to="/book-demo">Book a Free Demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base font-semibold border-foreground/20"
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 md:mt-20 max-w-4xl mx-auto relative"
          >
            <DashboardMock />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground text-lg">Three steps to audit-ready regulatory reports.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {howItWorks.map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="card-elevated rounded-xl p-6 border border-border/50 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">{item.step}</span>
                <h3 className="mt-2 text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stat Bar */}
      <section className="py-14 hero-gradient">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <p className="text-2xl md:text-3xl font-extrabold font-display text-foreground">{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-10">
              Built for Nigerian Financial Institutions
            </h2>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {institutionBadges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Alignment */}
      <section className="py-20 md:py-28 hero-gradient">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
              Aligned With Nigerian Regulatory Requirements
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 max-w-4xl mx-auto">
            {regulatoryItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="card-elevated rounded-xl p-5 border border-border/50 flex flex-col items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground text-center">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
