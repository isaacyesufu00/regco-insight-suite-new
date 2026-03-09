import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageCTA from "@/components/PageCTA";
import { motion } from "framer-motion";
import { LayoutDashboard, RefreshCw, Users, Archive, Building2, Activity, Shield, Download } from "lucide-react";
import DashboardMock from "@/components/DashboardMock";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.45, delay: i * 0.1 } }),
};

const highlights = [
  "Real-time report status updates",
  "Company-specific report type assignments",
  "Multi-format download options",
  "Data source management",
  "User role management",
  "Audit trail and history",
];

const featureCards = [
  { icon: Building2, title: "Personalised for your institution", text: "Your company name, RC number, and assigned return types are pre-configured before you log in." },
  { icon: Activity, title: "Real-time updates", text: "Report status changes from Processing to Ready automatically without refreshing." },
  { icon: Users, title: "Role-based access", text: "Assign Compliance Lead, Officer, Reviewer, and Auditor roles to different team members." },
  { icon: Archive, title: "Complete history", text: "Every report ever generated is stored with full metadata and available for re-download." },
];

const FeatureDashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="hero-gradient pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-foreground tracking-tight leading-[1.1]">
            Your Entire Compliance Operation in One Place.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The RegCo dashboard gives your compliance team a real-time view of every report, every data source, and every submission deadline — all in one clean interface.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Dashboard Mockup */}
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
          <DashboardMock />
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 mt-10 max-w-3xl mx-auto">
          {highlights.map((h, i) => (
            <motion.span key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              {h}
            </motion.span>
          ))}
        </div>
      </div>
    </section>

    {/* Feature Cards */}
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {featureCards.map((f, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1} className="rounded-2xl border border-border/60 p-6 card-elevated flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <PageCTA headline="Ready to see your dashboard?" contactMessage="I am interested in the RegCo dashboard. Please contact me to discuss pricing." />
    <Footer />
  </div>
);

export default FeatureDashboard;
