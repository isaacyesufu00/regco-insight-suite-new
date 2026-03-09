import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { Upload, RefreshCw, Server, Code, Lock, Eye, Clock } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const connections = [
  { icon: Upload, title: "Manual Upload", text: "Drag and drop your Excel or CSV export from any core banking system. No reformatting required.", available: true },
  { icon: RefreshCw, title: "Automated Export", text: "Work with your IT team to configure a scheduled export from your CBS that sends data to RegCo automatically.", available: true },
  { icon: Server, title: "SFTP Connection", text: "For institutions with IT capability, connect via secure SFTP for seamless automated data transfer.", available: true },
  { icon: Code, title: "API Connection", text: "Direct API integration for institutions with open banking capability. Coming Q3 2025.", available: false },
];

const systems = ["Oracle Flexcube", "Infosys Finacle", "Temenos T24", "Rubies", "Bankone", "Manual Excel", "Custom CSV"];

const security = [
  { icon: Lock, text: "All uploaded files are stored in a private encrypted storage bucket." },
  { icon: Lock, text: "Files are only accessible to the authenticated institution that uploaded them." },
  { icon: Clock, text: "Download links expire after 1 hour. Files cannot be shared or accessed externally." },
];

const FeatureDataSources = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Connect Your Core Banking System. However It Works.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            RegCo works with how your institution actually operates today — whether that is automated CBS exports, manual Excel files, or anything in between.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Connection Options */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-12">
          Connection Options
        </motion.h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {connections.map((c, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className={`rounded-2xl border p-6 card-elevated relative ${!c.available ? "border-border/40 opacity-70" : "border-border/60"}`}>
              {!c.available && (
                <span className="absolute top-4 right-4 text-xs font-semibold text-warning bg-warning/10 px-2 py-0.5 rounded-full">Coming Soon</span>
              )}
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <c.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Supported Systems */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-8">
          Supported Systems
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

    {/* Data Security */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-2xl md:text-3xl font-bold font-display text-foreground text-center mb-10">
          Data Security
        </motion.h2>
        <div className="max-w-2xl mx-auto space-y-4">
          {security.map((s, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="flex items-start gap-3">
              <s.icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* File Preview Mock */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">File Preview</h3>
          </div>
          <div className="rounded-2xl border border-border/60 card-elevated overflow-hidden">
            <div className="bg-muted/50 px-4 py-2 border-b border-border text-xs font-medium text-muted-foreground">
              sample_cbs_export.xlsx — First 10 rows
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    {["Account No.", "Name", "Balance", "Branch", "Status"].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-semibold text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["001-234-567", "Adebayo Holdings Ltd", "₦12,450,000", "Victoria Island", "Active"],
                    ["001-234-568", "Chukwu Enterprises", "₦8,230,000", "Ikeja", "Active"],
                    ["001-234-569", "Fatima Trading Co.", "₦3,670,000", "Abuja Central", "Active"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-2 text-foreground">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-muted/50 px-4 py-2 border-t border-border text-xs text-muted-foreground">
              Showing 3 of 10 preview rows • 2,450 total records
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    <PageCTA headline="Ready to connect your data?" contactMessage="I am interested in connecting our data sources to RegCo. Please contact me to discuss." />
    <Footer />
  </div>
);

export default FeatureDataSources;
