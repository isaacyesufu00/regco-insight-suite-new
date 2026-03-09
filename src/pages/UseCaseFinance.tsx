import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { Check, FileText, Users, Settings, AlertTriangle, Shuffle, XCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const painPoints = [
  { icon: Users, text: "Finance companies often have lean compliance teams managing multiple regulatory obligations simultaneously." },
  { icon: Shuffle, text: "SCUML and CBN requirements overlap in complex ways that are easy to get wrong." },
  { icon: XCircle, text: "Reporting templates for finance companies differ from banks and most generic tools get it wrong." },
];

const differentiators = [
  { icon: FileText, text: "Report templates built specifically for finance company CBN return formats, not adapted from bank templates." },
  { icon: Settings, text: "SCUML compliance report generation included as standard." },
  { icon: Users, text: "Designed for small compliance teams — one person can manage the entire reporting workflow." },
];

const returns = [
  { name: "SCUML Compliance Report", freq: "Annual" },
  { name: "CBN Finance Company Return", freq: "Monthly" },
  { name: "AML/CFT Report", freq: "Quarterly" },
];

const UseCaseFinance = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Regulatory Reporting Built for Finance Companies.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you are a mortgage institution, leasing company, or development finance institution, RegCo generates your CBN and SCUML returns with zero manual formatting.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Pain Points */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Challenges finance companies face
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

    {/* Differentiators */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          What makes RegCo different for finance companies
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {differentiators.map((d, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <d.icon className="w-7 h-7 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Returns */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Supported Returns
        </motion.h2>
        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
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

    <PageCTA headline="Start your free trial today." contactMessage="I am interested in RegCo for our finance company. Please contact me to discuss pricing." />
    <Footer />
  </div>
);

export default UseCaseFinance;
