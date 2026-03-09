import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { Clock, Shield, Users, FileCheck, CheckCircle2 } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const withoutRegCo = [
  { day: "Monday", task: "Extract data from CBS manually." },
  { day: "Tue–Wed", task: "Format into CBN template." },
  { day: "Thursday", task: "Review and fix errors." },
  { day: "Friday", task: "Submit and pray nothing is wrong." },
];

const withRegCo = [
  { day: "Mon AM", task: "Upload CBS export file." },
  { day: "Mon PM", task: "Download finished submission-ready report." },
  { day: "Done.", task: "" },
];

const benefits = [
  { icon: Clock, title: "Never miss a deadline", text: "Automated report status tracking keeps you ahead of every submission date." },
  { icon: FileCheck, title: "Always the correct format", text: "Submit in the correct CBN format even when templates change." },
  { icon: Shield, title: "Full audit trail", text: "Protects you personally if a submission is ever questioned." },
  { icon: Users, title: "Multi-user access", text: "Your team can collaborate without sharing passwords." },
];

const UseCaseCompliance = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Give Your Compliance Team Their Time Back.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            RegCo is built around the daily reality of Nigerian compliance officers — tight deadlines, changing templates, and zero tolerance for errors.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Day in the life */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          A day in the life
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Without */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="rounded-2xl border border-destructive/30 p-6 bg-destructive/5">
            <h3 className="text-lg font-bold text-destructive mb-4">Without RegCo</h3>
            <div className="space-y-3">
              {withoutRegCo.map((w, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs font-semibold text-destructive w-16 shrink-0 pt-0.5">{w.day}</span>
                  <p className="text-sm text-muted-foreground">{w.task}</p>
                </div>
              ))}
            </div>
          </motion.div>
          {/* With */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} className="rounded-2xl border border-success/30 p-6 bg-success/5">
            <h3 className="text-lg font-bold text-success mb-4">With RegCo</h3>
            <div className="space-y-3">
              {withRegCo.map((w, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-xs font-semibold text-success w-16 shrink-0 pt-0.5">{w.day}</span>
                  {w.task ? (
                    <p className="text-sm text-muted-foreground">{w.task}</p>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Benefits */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Key benefits for compliance officers
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {benefits.map((b, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <b.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonial */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.blockquote initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl italic text-foreground leading-relaxed">
            "RegCo gave us back two full days every month. I can finally focus on actual compliance strategy instead of formatting spreadsheets."
          </p>
          <footer className="mt-4 text-sm text-muted-foreground">— Compliance Lead, Commercial Bank, Lagos</footer>
        </motion.blockquote>
      </div>
    </section>

    <PageCTA headline="Ready to give your compliance team their time back?" contactMessage="I am interested in RegCo for our compliance team. Please contact me to discuss pricing." />
    <Footer />
  </div>
);

export default UseCaseCompliance;
