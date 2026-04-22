import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  ShieldCheck,
  Layers,
  Clock,
  FileCheck,
  AlertTriangle,
  Mail,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import BrandLogo from "./BrandLogo";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, delay: i * 0.15 },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const steps = [
  { n: "1", title: "Export CBS Data", desc: "Pull the raw trial balance or general ledger straight from your core banking system. No reformatting." },
  { n: "2", title: "Upload to RegCo", desc: "Drop the file in. Our engine parses every sheet, maps account codes and validates balances automatically." },
  { n: "3", title: "Download CBN Return", desc: "Get a submission-ready PDF, Word or Excel return. Reviewed, formatted, and on file in under five minutes." },
];

const features = [
  { icon: Sparkles, title: "AI Validation Engine", desc: "Every figure, ratio and total reconciled before the report is generated. Errors are flagged with the exact source row." },
  { icon: Layers, title: "7 Report Types", desc: "MFB, CBN Forex, AML/CFT, Prudential, NFIU, SCUML and Monetary Policy returns — all from a single upload." },
  { icon: Clock, title: "5-Minute Generation", desc: "What used to take five days of compliance work happens while you wait for your coffee." },
  { icon: FileCheck, title: "CBN Formatted Output", desc: "Outputs match CBN templates exactly. Print, sign, and submit. No reformatting, no rework." },
  { icon: AlertTriangle, title: "Error Detection", desc: "Reconciliation breaks, missing accounts, and ratio violations are surfaced before you submit, not after the sanction." },
  { icon: Mail, title: "Email Notifications", desc: "Reminders for filing deadlines, instant alerts when reports are ready, and a full audit trail of every submission." },
];

const reportTypes = [
  "MFB Regulatory Return",
  "CBN Forex Return",
  "AML/CFT Compliance",
  "Prudential Return",
  "NFIU Return",
  "SCUML Report",
  "Monetary Policy Return",
];

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.4]);

  return (
    <>
      {/* HERO — full viewport editorial */}
      <section
        ref={heroRef}
        className="relative min-h-screen w-full overflow-hidden bg-[#0A0A0A] text-white"
      >
        {/* Animated gradient backdrop */}
        <motion.div
          aria-hidden
          style={{ scale: bgScale, opacity: bgOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 75% 30%, rgba(255,154,0,0.45) 0%, rgba(255,61,0,0.25) 30%, rgba(10,10,10,1) 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom right, rgba(0,0,0,0.55), rgba(255,61,0,0.10))",
            }}
          />
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </motion.div>

        {/* Right vertical nav (desktop only) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-8"
        >
          {["About", "Features", "Pricing", "Contact"].map((item) => {
            const href =
              item === "About" ? "/about"
              : item === "Pricing" ? "/#pricing"
              : item === "Contact" ? "/contact"
              : "#features";
            return (
              <Link
                key={item}
                to={href}
                className="text-[11px] tracking-[0.3em] uppercase text-white/60 hover:text-white transition-colors"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                {item}
              </Link>
            );
          })}
          <BrandLogo size={20} />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1 container mx-auto px-6 lg:px-12 pt-32 pb-16 grid lg:grid-cols-12 gap-10 items-center">
            {/* Left rotated column — desktop */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hidden lg:flex lg:col-span-3 flex-col gap-10"
            >
              <div
                className="text-white/90 font-serif-display text-4xl leading-[0.95]"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              >
                Regulatory<br />Compliance.
              </div>
              <div className="max-w-xs">
                <p className="text-sm text-white/70 leading-relaxed">
                  RegCo is an automated CBN compliance platform — turning five days of manual reporting into five minutes of AI-powered accuracy.
                </p>
                <Button asChild size="lg" className="mt-6 rounded-none bg-gradient-brand text-white border-0 hover:opacity-90 px-6 font-semibold">
                  <Link to="/book-demo">
                    Get Started <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Right editorial heading */}
            <div className="lg:col-span-9 lg:text-right">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-6">
                  Abuja · Est. 2026
                </p>
                <h1 className="font-serif-display text-5xl sm:text-6xl lg:text-[5.5rem] leading-[1.02] text-white">
                  The Regulatory<br />
                  Reporting Platform<br />
                  <span className="text-gradient">For Nigerian Banks</span>
                </h1>
              </motion.div>

              {/* Mobile-only CTA + description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="lg:hidden mt-8 space-y-6"
              >
                <p className="text-base text-white/70 leading-relaxed max-w-xl">
                  Five days of manual CBN reporting compressed into five minutes of AI-powered accuracy. Built for compliance officers, not IT teams.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="rounded-none bg-gradient-brand text-white border-0 hover:opacity-90 font-semibold">
                    <Link to="/book-demo">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-none bg-transparent border-white/30 text-white hover:bg-white/10 font-semibold">
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Hero footer bar */}
          <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-sm">
            <div className="container mx-auto px-6 lg:px-12 py-4 flex flex-wrap items-center justify-between gap-3 text-xs tracking-widest uppercase text-white/50">
              <div className="flex items-center gap-3">
                <BrandLogo size={14} />
                <span>RegCo Technologies</span>
              </div>
              <span>The compliance OS for CBN-licensed institutions</span>
              <span className="hidden md:inline">Scroll ↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 md:py-32 bg-[#0A0A0A] text-white">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="max-w-2xl mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">How it works</p>
            <h2 className="font-serif-display text-4xl md:text-6xl leading-[1.05]">
              From raw CBS export<br />to filed return.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={fadeUp}
                custom={i}
                className="relative"
              >
                <div className="font-serif-display text-[120px] leading-none text-gradient mb-4">
                  {s.n}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-white/60 leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 -right-3 w-6 h-px bg-gradient-brand" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 md:py-32 bg-white text-foreground">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={slideInLeft}
            className="max-w-3xl mb-16"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-primary mb-4">Features</p>
            <h2 className="font-serif-display text-4xl md:text-6xl leading-[1.05] text-foreground">
              Everything a Compliance<br />Officer Needs.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={fadeUp}
                custom={i % 3}
                className="group relative bg-background p-8 hover:bg-secondary/40 transition-colors"
              >
                <div
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-[3px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                />
                <div
                  className="w-10 h-10 mb-6 flex items-center justify-center text-white"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* REPORT TYPES MARQUEE */}
      <section className="py-20 bg-[#0A0A0A] text-white overflow-hidden">
        <p className="text-center text-xs tracking-[0.4em] uppercase text-white/50 mb-10">
          Supported regulatory returns
        </p>
        <div className="relative w-full overflow-hidden">
          <div className="marquee flex items-center gap-10 whitespace-nowrap w-max">
            {[...reportTypes, ...reportTypes, ...reportTypes].map((t, i) => (
              <div key={i} className="flex items-center gap-10">
                <span className="font-serif-display text-3xl md:text-5xl text-white">{t}</span>
                <span
                  aria-hidden
                  className="inline-block w-5 h-5 md:w-6 md:h-6 shrink-0"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
