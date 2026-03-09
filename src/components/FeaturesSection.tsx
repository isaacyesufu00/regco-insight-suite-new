import { motion } from "framer-motion";
import { ArrowRight, Upload, Building2, Calendar, FileText, Heart, AlertTriangle, Clock, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15 },
  }),
};

const FeaturesSection = () => {
  return (
    <section id="solutions" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-foreground leading-tight">
            Save <span className="inline-flex items-center align-middle mx-1"><FileText className="w-8 h-8 md:w-10 md:h-10 text-primary" /></span> hours
            <br />a week with RegCo
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Card 1 – Reports */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={1}
            className="bg-muted/40 rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="p-7 md:p-9 flex-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-background border border-border/60 rounded-full px-3 py-1.5 mb-5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                Reports
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-snug">
                Instantly generate<br />regulatory reports
              </h3>

              <div className="mt-6 space-y-2.5">
                <div className="flex gap-2">
                  <MockChip icon={<Upload className="w-3.5 h-3.5" />} label="Upload financial data" sub="Choose documents" />
                  <MockChip icon={<Building2 className="w-3.5 h-3.5" />} label="Select regulatory body" sub="Choose documents" />
                </div>
                <div className="flex items-center gap-2 bg-background rounded-xl px-4 py-3 border border-border/40">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Choose reporting period</span>
                </div>
              </div>
            </div>
            <div className="px-7 pb-7 md:px-9 md:pb-9">
              <Link to="/features/report-generation" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                About Reports <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Card 2 – Monitoring */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={2}
            className="bg-muted/40 rounded-3xl overflow-hidden flex flex-col"
          >
            <div className="p-7 md:p-9 flex-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-background border border-border/60 rounded-full px-3 py-1.5 mb-5">
                <BarChart3 className="w-3.5 h-3.5 text-primary" />
                Monitor
              </span>
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-snug">
                Continuous compliance<br />monitoring & alerts
              </h3>

              <div className="mt-6 space-y-2.5">
                <div className="bg-background rounded-xl px-4 py-3 border border-border/40">
                  <p className="text-xs text-muted-foreground mb-1">Compliance Score</p>
                  <p className="text-sm text-foreground font-medium">Institution compliance is at 94% — all filings on track for Q4 2025.</p>
                </div>
                <div className="flex items-center gap-3 bg-background rounded-xl px-4 py-3 border border-border/40">
                  <div className="flex-1">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: "72%" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-7 pb-7 md:px-9 md:pb-9">
              <Link to="/features/monitoring" className="inline-flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors">
                About Monitoring <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const MockChip = ({ icon, label, sub }: { icon: React.ReactNode; label: string; sub: string }) => (
  <div className="flex-1 bg-background rounded-xl px-4 py-3 border border-border/40">
    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-0.5">
      <span className="text-primary">{icon}</span>
      {label}
    </div>
    <p className="text-xs text-muted-foreground">{sub}</p>
  </div>
);

export default FeaturesSection;
