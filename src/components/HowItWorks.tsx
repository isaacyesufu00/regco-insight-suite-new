import { useState } from "react";
import { AnimateIn } from "./AnimateIn";

const items = [
  {
    label: "Dashboard Overview",
    title: "Dashboard.",
    subtitle: "Everything at a glance.",
    desc: "Your compliance home screen. See pending reports, upcoming deadlines, institution health metrics, and recent activity — all in one view.",
  },
  {
    label: "My Reports",
    title: "My Reports.",
    subtitle: "Your complete filing history.",
    desc: "Every return ever generated is stored here. Filter by status, return type, or date. Download any report again at any time. Full audit trail built in.",
  },
  {
    label: "Create Report",
    title: "Create Report.",
    subtitle: "From upload to return in 5 minutes.",
    desc: "Upload your CBS export, select your reporting period, and click generate. RegCo handles validation, AI generation, formatting, and delivery automatically.",
  },
  {
    label: "Compliance Mail",
    title: "Compliance Mail.",
    subtitle: "Every regulator notice. One inbox.",
    desc: "CBN circulars, NFIU advisories, SCUML updates, deadline reminders, and error notifications — all organised by category so nothing is ever missed.",
  },
  {
    label: "Calendar",
    title: "Compliance Calendar.",
    subtitle: "Every deadline. Visible.",
    desc: "A live calendar showing every regulatory filing deadline for every return your institution is required to file. Color-coded by urgency. Sync to your phone.",
  },
  {
    label: "Data Sources",
    title: "Data Sources.",
    subtitle: "Connect your CBS once.",
    desc: "Map your core banking system export format to RegCo once. Every subsequent upload is recognised instantly with no manual column matching required.",
  },
  {
    label: "Settings",
    title: "Settings.",
    subtitle: "Your institution profile.",
    desc: "Institution details, team members, notification preferences, and billing — all managed in one clean settings panel.",
  },
];

const panels: Record<number, React.ReactNode> = {
  0: <DashboardPanel />,
  1: <ReportsPanel />,
  2: <CreatePanel />,
  3: <MailPanel />,
  4: <CalendarPanel />,
  5: <DataPanel />,
  6: <SettingsPanel />,
};

const HowItWorks = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="platform" style={{ background: "#F5F5F7", padding: "140px 0", position: "relative" }}>
      <div className="max-w-[1200px] mx-auto px-6">
        <AnimateIn>
          <h2 style={{ fontWeight: 700, fontSize: "clamp(32px, 4vw, 52px)", color: "#1D1D1F", textAlign: "center", marginBottom: 80 }}>
            A complete compliance command centre.
          </h2>
        </AnimateIn>

        <div className="flex gap-12" style={{ minHeight: 520 }}>
          {/* Left accordion */}
          <div className="w-[40%] shrink-0">
            {items.map((item, i) => (
              <div key={i} className="mb-3">
                <button
                  onClick={() => setActive(i)}
                  className="w-full flex items-center gap-3 text-left"
                  style={{
                    background: "rgba(0,0,0,0.05)",
                    borderRadius: 980,
                    padding: "12px 20px",
                    cursor: "pointer",
                    border: "none",
                  }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      border: active === i ? "none" : "1.5px solid rgba(0,0,0,0.2)",
                      background: active === i ? "#1D1D1F" : "transparent",
                      color: active === i ? "white" : "#1D1D1F",
                      fontSize: 16,
                      fontWeight: 300,
                      lineHeight: 1,
                    }}
                  >
                    {active === i ? "−" : "+"}
                  </div>
                  <span style={{ fontWeight: 500, fontSize: 17, color: "#1D1D1F" }}>{item.label}</span>
                </button>

                <div
                  style={{
                    maxHeight: active === i ? 300 : 0,
                    overflow: "hidden",
                    transition: "max-height 0.4s ease",
                  }}
                >
                  <div style={{ background: "#EBEBF0", borderRadius: 14, padding: "20px 22px", marginTop: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: "#1D1D1F" }}>{item.title} </span>
                    <span style={{ fontWeight: 400, fontSize: 15, color: "#6E6E73" }}>{item.subtitle} {item.desc}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right sticky panel */}
          <div className="flex-1 sticky top-[100px] self-start">
            <div
              style={{
                background: "white",
                borderRadius: 20,
                boxShadow: "0 4px 40px rgba(0,0,0,0.1)",
                overflow: "hidden",
                height: 520,
              }}
            >
              {items.map((_, i) => (
                <div
                  key={i}
                  style={{
                    opacity: active === i ? 1 : 0,
                    transition: "opacity 0.4s",
                    position: active === i ? "relative" : "absolute",
                    inset: 0,
                    height: "100%",
                    display: active === i ? "flex" : "none",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 32,
                  }}
                >
                  {panels[i]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function DashboardPanel() {
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3">
        {[{ n: "12", l: "Total" }, { n: "3", l: "Processing" }, { n: "9", l: "Ready" }].map((c) => (
          <div key={c.l} className="flex-1 bg-[#F5F5F7] rounded-xl p-4">
            <div style={{ fontWeight: 900, fontSize: 28, color: "#1D1D1F" }}>{c.n}</div>
            <div style={{ fontSize: 12, color: "#86868B", marginTop: 4 }}>{c.l} reports</div>
          </div>
        ))}
      </div>
      <div className="bg-[#F5F5F7] rounded-xl p-4">
        <div style={{ fontSize: 12, color: "#86868B", marginBottom: 12 }}>Recent Reports</div>
        {["MFB Return Q1 2026", "Prudential Return Q1", "CBN Forex Return", "AML/CFT Report"].map((r, i) => (
          <div key={r} className="flex justify-between items-center py-2.5" style={{ borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.06)" : "none" }}>
            <span style={{ fontSize: 13, color: "#1D1D1F" }}>{r}</span>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 11, background: "rgba(52,199,89,0.12)", color: "#34C759" }}>Ready</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsPanel() {
  return (
    <div className="w-full space-y-2">
      <div style={{ fontSize: 12, color: "#86868B", marginBottom: 8 }}>All Reports</div>
      {["MFB Prudential Return", "CBN Forex Return", "AML/CFT Report", "Liquidity Return", "Capital Adequacy"].map((r, i) => (
        <div key={r} className="flex justify-between items-center p-3 bg-[#F5F5F7] rounded-xl">
          <span style={{ fontSize: 13, color: "#1D1D1F" }}>{r}</span>
          <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 11, background: i < 3 ? "rgba(52,199,89,0.12)" : "rgba(255,159,10,0.12)", color: i < 3 ? "#34C759" : "#FF9F0A" }}>
            {i < 3 ? "Ready" : "Processing"}
          </span>
        </div>
      ))}
    </div>
  );
}

function CreatePanel() {
  return (
    <div className="w-full text-center">
      <div className="w-full max-w-sm mx-auto border-2 border-dashed border-black/10 rounded-2xl p-8">
        <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F5F7] flex items-center justify-center mb-4">
          <span className="text-xl">📄</span>
        </div>
        <p style={{ fontWeight: 600, fontSize: 16, color: "#1D1D1F" }}>Drop your CBS export</p>
        <p style={{ fontSize: 13, color: "#86868B", marginTop: 4 }}>.xlsx, .csv, .xls</p>
      </div>
      <button className="mt-6 px-8 py-3 rounded-[10px] text-sm font-medium" style={{ background: "#0066CC", color: "white", border: "none" }}>
        Generate Report
      </button>
    </div>
  );
}

function MailPanel() {
  return (
    <div className="w-full flex gap-4 h-full">
      <div className="w-48 border-r border-black/5 pr-3 space-y-2">
        <div style={{ fontSize: 12, color: "#86868B", marginBottom: 8 }}>Inbox</div>
        {["CAR Warning", "Q1 Due", "NFIU Deadline", "New Circular"].map((m, i) => (
          <div key={m} className={`p-2.5 rounded-xl text-xs ${i === 0 ? "bg-[#F5F5F7]" : ""}`} style={{ color: "#1D1D1F" }}>
            <div className="font-medium">{m}</div>
            <div style={{ color: "#86868B", marginTop: 2, fontSize: 11 }}>Apr {10 + i}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 p-2">
        <p style={{ fontWeight: 600, fontSize: 14, color: "#1D1D1F" }}>CAR Below Threshold</p>
        <p style={{ fontSize: 12, color: "#86868B", marginTop: 4 }}>From: RegCo Compliance Engine</p>
        <p style={{ fontSize: 13, color: "#6E6E73", marginTop: 12, lineHeight: 1.6 }}>
          Your Capital Adequacy Ratio has fallen to 9.2%, below the CBN minimum of 10%.
        </p>
      </div>
    </div>
  );
}

function CalendarPanel() {
  return (
    <div className="w-full">
      <div style={{ fontSize: 12, color: "#86868B", marginBottom: 12 }}>May 2026</div>
      <div className="grid grid-cols-7 gap-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-center" style={{ fontSize: 11, color: "#86868B", padding: 4 }}>{d}</div>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
          <div key={d} className="text-center relative" style={{ fontSize: 13, color: "#1D1D1F", padding: 6 }}>
            {d}
            {d === 10 && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF3B30]" />}
            {d === 15 && <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FF9F0A]" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function DataPanel() {
  return (
    <div className="w-full space-y-3">
      <div style={{ fontSize: 12, color: "#86868B", marginBottom: 8 }}>Connected Sources</div>
      {[{ name: "Flexcube Export", status: "Active" }, { name: "Trial Balance", status: "Active" }, { name: "GL Export", status: "Pending" }].map((s) => (
        <div key={s.name} className="flex justify-between items-center p-3 bg-[#F5F5F7] rounded-xl">
          <span style={{ fontSize: 13, color: "#1D1D1F" }}>{s.name}</span>
          <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 11, background: s.status === "Active" ? "rgba(52,199,89,0.12)" : "rgba(142,142,147,0.12)", color: s.status === "Active" ? "#34C759" : "#8E8E93" }}>
            {s.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="w-full space-y-4">
      <div style={{ fontSize: 12, color: "#86868B", marginBottom: 8 }}>Institution Settings</div>
      {["Institution Name", "RC Number", "CBN License Category"].map((label) => (
        <div key={label}>
          <p style={{ fontSize: 12, color: "#86868B", marginBottom: 4 }}>{label}</p>
          <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#1D1D1F" }}>
            {label === "Institution Name" ? "Acme MFB Ltd" : label === "RC Number" ? "RC-1234567" : "Unit MFB"}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HowItWorks;
