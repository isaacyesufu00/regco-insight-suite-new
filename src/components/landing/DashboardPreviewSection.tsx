import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  Home,
  FileText,
  FilePlus,
  Mail,
  CalendarDays,
  Database,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Dashboard" },
  { icon: FileText, label: "My Reports", active: true, badge: 3 },
  { icon: FilePlus, label: "Create Report" },
  { icon: Mail, label: "Compliance Mail", badge: 4 },
  { icon: CalendarDays, label: "Calendar" },
  { icon: Database, label: "Data Sources" },
  { icon: Settings, label: "Settings" },
];

const DashboardPreviewSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const rotateX = useTransform(scrollYProgress, [0, 1], [22, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.4, 1]);

  return (
    <section ref={ref} className="bg-white py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0A0A0A] text-center tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          A dashboard built for compliance teams.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-4 text-center text-[#555] text-base md:text-lg max-w-xl mx-auto"
        >
          One place for raw data, generated reports, calendar deadlines, and regulator notices.
        </motion.p>

        <motion.div
          style={{
            rotateX,
            scale,
            opacity,
            transformPerspective: 1200,
            transformOrigin: "center top",
          }}
          className="mt-16 max-w-6xl mx-auto"
        >
          <div className="bg-surface-light-2 rounded-[20px] border border-[#E8E8E8] shadow-2xl overflow-hidden">
            <div className="grid grid-cols-[260px_1fr] min-h-[440px]">
              {/* Sidebar */}
              <div className="bg-surface-light-2 p-4 border-r border-[#E8E8E8]">
                {/* Institution card */}
                <div className="bg-[#0A0A0A] rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                    <span className="text-white text-lg">✦</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-white/55">Team</div>
                    <div className="text-sm font-semibold text-white truncate">Nakdnx MFB</div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-4 mt-3 px-2 text-[12px] text-[#888]">
                  <span>Overview</span>
                  <span>· 24</span>
                  <span>· 6</span>
                  <span>· 83</span>
                </div>

                {/* Nav items */}
                <div className="mt-6 space-y-1">
                  {navItems.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3.5 px-3 py-2.5 rounded-[10px] transition-colors ${
                        item.active
                          ? "bg-white border border-[#E8E8E8]"
                          : ""
                      }`}
                    >
                      <item.icon
                        className={`w-4 h-4 ${
                          item.active ? "text-[#0A0A0A]" : "text-[#888]"
                        }`}
                      />
                      <span
                        className={`flex-1 text-[13px] ${
                          item.active
                            ? "text-[#0A0A0A] font-semibold"
                            : "text-[#555] font-medium"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.badge && (
                        <span className="w-5 h-5 rounded-full bg-[#0A0A0A] text-white text-[10px] font-bold flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="bg-surface-light-2 p-6">
                <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <div>
                      <div className="text-[11px] text-[#888]">Nakdnx MFB Ltd.</div>
                      <div className="text-base font-bold text-[#0A0A0A]">
                        CBN Q4 2025 Return
                      </div>
                    </div>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-[#0A0A0A] text-white text-xs font-bold flex items-center justify-center">
                    8
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-[#0A0A0A]/20 text-[10px] font-semibold text-[#0A0A0A]">
                      Pending
                    </div>
                    <div className="mt-3 text-2xl font-bold text-[#0A0A0A]">12 reports</div>
                    <div className="text-[12px] text-[#888] mt-1">Awaiting upload</div>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#E8E8E8] p-5">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-warning/15 border border-warning/30 text-[10px] font-semibold text-warning-foreground">
                      Processing
                    </div>
                    <div className="mt-3 text-2xl font-bold text-[#0A0A0A]">4 reports</div>
                    <div className="text-[12px] text-[#888] mt-1">Validating CBS data</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreviewSection;
