import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { Check, Upload, FileText, Download, AlertTriangle, Clock, RefreshCw } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const painPoints = [
  { icon: AlertTriangle, text: "Manual Excel reporting takes days. One formula error can trigger a CBN query." },
  { icon: RefreshCw, text: "CBN templates change without warning and your team scrambles to update everything." },
  { icon: Clock, text: "Submission deadlines pile up across multiple return types simultaneously." },
];

const solutions = [
  { icon: Upload, title: "Upload", text: "Upload your CBS export from Rubies, Bankone, or any Excel file. RegCo formats it automatically." },
  { icon: FileText, title: "Generate", text: "Your MFB Regulatory Return, AML/CFT Report, and NFIU Return are generated in under 5 minutes." },
  { icon: Download, title: "Download", text: "Download submission-ready PDF, Word, or Excel files formatted to exact CBN standards." },
];

const returns = [
  { name: "MFB Regulatory Return", freq: "Monthly" },
  { name: "AML/CFT Report", freq: "Quarterly" },
  { name: "NFIU Regulatory Return", freq: "Quarterly" },
  { name: "SCUML Compliance Report", freq: "Annual" },
];

const systems = ["Rubies", "Bankone", "Flexcube", "Finacle", "T24", "Manual Excel Upload"];

const UseCaseMFB = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero */}
    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Built for Microfinance Banks.<br />Made for Nigeria.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            RegCo understands the unique CBN reporting obligations of unit, state, and national MFBs — so your compliance team can stop wrestling with Excel and start submitting with confidence.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Pain Points */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          The challenges every MFB compliance officer knows.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {painPoints.map((p, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated">
              <p.icon className="w-8 h-8 text-destructive mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How RegCo Solves It */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          How RegCo solves it
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {solutions.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Supported Returns */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Supported MFB Return Types
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {returns.map((r, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="flex items-center gap-3 rounded-xl border border-border/60 p-4 card-elevated">
              <Check className="w-5 h-5 text-success shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.freq}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Compatible Systems */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-8">
          Compatible Core Banking Systems
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {systems.map((s, i) => (
            <motion.span key={s} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground">
              {s}
            </motion.span>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonial */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.blockquote initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl italic text-foreground leading-relaxed">
            "Our compliance team used to spend 3 days preparing our monthly CBN returns. With RegCo it takes less than an hour."
          </p>
          <footer className="mt-4 text-sm text-muted-foreground">— Head of Compliance, State MFB, Abuja</footer>
        </motion.blockquote>
      </div>
    </section>

    <PageCTA headline="Ready to simplify your MFB compliance reporting?" contactMessage="I am interested in RegCo for my Microfinance Bank. Please contact me to discuss pricing." />
    <Footer />
  </div>
);

export default UseCaseMFB;
