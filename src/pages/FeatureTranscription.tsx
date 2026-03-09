import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { Mic, Upload, FileText, Download, Users, ShieldCheck, Clock, Lock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const useCases = [
  { icon: Users, text: "Board of Directors compliance review meetings." },
  { icon: ShieldCheck, text: "Internal audit sessions and findings discussions." },
  { icon: Mic, text: "CBN examination and regulatory call recordings." },
  { icon: FileText, text: "Compliance officer training sessions." },
];

const steps = [
  { icon: Upload, label: "Upload your audio or video recording." },
  { icon: FileText, label: "RegCo transcribes and structures the content with speaker labels where possible." },
  { icon: Download, label: "Download the full transcription as a Word document or PDF." },
];

const features = [
  "Accurate transcription of Nigerian English and financial terminology.",
  "Timestamps throughout.",
  "Speaker identification where audio quality allows.",
  "Fully private and confidential — recordings are not stored after transcription is complete.",
];

const FeatureTranscription = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Transcribe Board Meetings, Audits and Regulatory Calls Instantly.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload a recording of any compliance meeting, board session, or regulatory call and receive a clean, structured transcription in minutes.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Use Cases */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Use cases for transcription
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {useCases.map((u, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <u.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground">{u.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* How it works */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-14">
          How it works
        </motion.h2>
        <div className="max-w-2xl mx-auto">
          {steps.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="flex items-start gap-4 pb-8 last:pb-0 relative">
              {i < steps.length - 1 && <div className="absolute left-[23px] top-12 w-0.5 h-[calc(100%-32px)] bg-border" />}
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 z-10">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="pt-3">
                <span className="text-xs font-bold text-primary mr-2">Step {i + 1}</span>
                <span className="text-sm text-foreground">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-10">
          Features
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {features.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="flex items-start gap-3">
              {i === 3 ? <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" /> : <Clock className="w-5 h-5 text-primary mt-0.5 shrink-0" />}
              <p className="text-sm text-muted-foreground">{f}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <PageCTA headline="Ready to transcribe your next meeting?" contactMessage="I am interested in RegCo transcription. Please contact me to discuss pricing." />
    <Footer />
  </div>
);

export default FeatureTranscription;
