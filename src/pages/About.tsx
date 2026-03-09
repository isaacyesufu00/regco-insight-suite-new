import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download, ShieldCheck, Landmark, Lock, Headphones, MapPin, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1 },
  }),
};

const steps = [
  { icon: Upload, step: "Step 1", title: "You provide your compliance data", desc: "Upload your core banking exports in Excel or CSV format." },
  { icon: FileText, step: "Step 2", title: "RegCo generates your report", desc: "Our engine processes your data and produces audit-ready filings." },
  { icon: Download, step: "Step 3", title: "You download and submit to the CBN", desc: "Download in PDF, Word, or Excel and file with confidence." },
];

const features = [
  { icon: ShieldCheck, title: "Gold-Standard Accuracy", desc: "Every report is validated against CBN formatting and calculation rules." },
  { icon: Landmark, title: "Built for Nigerian Compliance", desc: "Purpose-built for CBN, NFIU, SCUML, and NDIC regulatory frameworks." },
  { icon: Lock, title: "Bank-Grade Security", desc: "End-to-end encryption with SOC 2 compliant infrastructure." },
  { icon: Headphones, title: "Dedicated Support", desc: "Our compliance specialists are available to assist your team." },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Mission Statement */}
      <section className="hero-gradient pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-center max-w-3xl mx-auto">
            <span className="text-sm font-semibold text-primary tracking-wide uppercase">Our Mission</span>
            <h1 className="mt-3 text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
              Eliminating the compliance burden on Nigerian financial institutions.
            </h1>
            <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Regulatory reporting should never be the reason a bank faces sanctions. We built the infrastructure so your team can focus on banking, not paperwork.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why We Built This */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-8">Why We Built This</h2>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Every quarter, compliance officers at Nigerian banks and microfinance banks spend days — sometimes weeks — manually compiling CBN regulatory returns. The process involves pulling data from core banking systems, reformatting it into the exact templates the CBN requires, cross-checking calculations, and praying nothing was missed before the deadline.
              </p>
              <p>
                When something does go wrong — a missed deadline, a formatting error, or an incorrect figure — the consequences are severe. CBN penalties start at ₦2,000,000 and can escalate quickly. For smaller institutions like unit MFBs, a single sanction can represent a significant portion of their annual revenue.
              </p>
              <p>
                We built RegCo because this problem is entirely solvable with technology. The data already exists in your core banking system. The CBN return formats are well-defined. What was missing was the infrastructure to connect the two automatically, accurately, and on time — every single reporting cycle.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 hero-gradient">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground text-lg">Three simple steps to audit-ready compliance reports.</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {steps.map((item, i) => (
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

      {/* Why RegCo */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">Why RegCo</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="card-elevated rounded-xl p-6 border border-border/50"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-20 md:py-28 hero-gradient">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">The Team</h2>
          </motion.div>

          <div className="max-w-sm mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="card-elevated rounded-xl p-8 border border-border/50 text-center">
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Founder & CEO</h3>
              <p className="text-sm text-primary font-medium mt-1">Former Compliance Professional</p>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                Built RegCo after seeing firsthand how much time Nigerian MFBs waste on manual regulatory submissions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-foreground">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-background">
              Ready to simplify your compliance reporting?
            </h2>
            <p className="mt-4 text-background/70 text-lg">
              Join hundreds of Nigerian financial institutions already using RegCo.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold">
                <Link to="/book-demo">Book a Free Demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base font-semibold border-background/20 text-background hover:bg-background/10"
              >
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location */}
      <section className="py-10 bg-background">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <MapPin className="w-4 h-4" />
            Headquartered in Abuja, Nigeria. Serving financial institutions nationwide.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
