import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Deadline {
  id: string;
  date: number;
  regulator: "CBN" | "FIRS" | "NFIU" | "NDIC" | "SCUML";
  title: string;
  description: string;
  severity: "high" | "medium";
}

const getDeadlines = (year: number, month: number): Deadline[] => {
  const deadlines: Deadline[] = [];
  const cbnReturnMonth = new Date(year, month - 1, 1).toLocaleString("en-NG", { month: "long", year: "numeric" });

  deadlines.push(
    { id: `cbn-mfb-${year}-${month}`, date: 15, regulator: "CBN", title: `MFB Regulatory Return — ${cbnReturnMonth}`, description: "Monthly balance sheet, CAR, NPL, liquidity submission to CBN.", severity: "high" },
    { id: `cbn-monetary-${year}-${month}`, date: 15, regulator: "CBN", title: `Monetary Policy Return — ${cbnReturnMonth}`, description: "Interest rates and monetary aggregates submission.", severity: "high" },
    { id: `cbn-prudential-${year}-${month}`, date: 15, regulator: "CBN", title: `Prudential Return — ${cbnReturnMonth}`, description: "Risk assets, provisions, and loan classification.", severity: "high" },
    { id: `firs-paye-${year}-${month}`, date: 10, regulator: "FIRS", title: "PAYE Remittance", description: "Employee income tax for previous month remitted to FIRS.", severity: "high" },
    { id: `firs-vat-${year}-${month}`, date: 21, regulator: "FIRS", title: "VAT Return", description: "Monthly VAT return at 7.5% remitted to FIRS.", severity: "high" },
    { id: `firs-wht-${year}-${month}`, date: 21, regulator: "FIRS", title: "WHT Return", description: "Withholding tax on vendor payments.", severity: "medium" },
  );

  if ([3, 6, 9, 0].includes(month)) {
    deadlines.push({ id: `nfiu-aml-${year}-${month}`, date: 30, regulator: "NFIU", title: "AML/CFT Compliance Report", description: "Quarterly AML/CFT programme effectiveness report to NFIU.", severity: "high" });
  }
  if (month === 1) {
    deadlines.push({ id: `ndic-premium-${year}`, date: 28, regulator: "NDIC", title: "Annual Premium Return", description: "Annual NDIC insurance premium based on insured deposits.", severity: "high" });
  }
  if (month === 0) {
    deadlines.push({ id: `scuml-annual-${year}`, date: 31, regulator: "SCUML", title: "Annual Compliance Report", description: "Annual AML/CFT compliance attestation to SCUML.", severity: "high" });
  }
  if (month === 5) {
    deadlines.push({ id: `firs-cit-${year}`, date: 30, regulator: "FIRS", title: "Company Income Tax Return", description: "Annual CIT filing. 30% for large companies.", severity: "high" });
  }
  return deadlines;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const regulatorColors: Record<string, { dot: string; badge: string; text: string }> = {
  CBN: { dot: "#DC2626", badge: "#FEF2F2", text: "#DC2626" },
  FIRS: { dot: "#D97706", badge: "#FFFBEB", text: "#D97706" },
  NFIU: { dot: "#7C3AED", badge: "#F5F3FF", text: "#7C3AED" },
  NDIC: { dot: "#0369A1", badge: "#EFF6FF", text: "#0369A1" },
  SCUML: { dot: "#059669", badge: "#ECFDF5", text: "#059669" },
};

const ComplianceCalendar = () => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const deadlines = useMemo(() => getDeadlines(viewYear, viewMonth), [viewYear, viewMonth]);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells: Array<{ day: number; currentMonth: boolean }> = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) calendarCells.push({ day: daysInPrevMonth - i, currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push({ day: d, currentMonth: true });
  const remaining = 42 - calendarCells.length;
  for (let d = 1; d <= remaining; d++) calendarCells.push({ day: d, currentMonth: false });

  const isToday = (day: number) => day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();
  const getDeadlinesForDay = (day: number) => deadlines.filter((d) => d.date === day);
  const selectedDeadlines = selectedDate ? getDeadlinesForDay(selectedDate) : [];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); } else setViewMonth((m) => m - 1);
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); } else setViewMonth((m) => m + 1);
    setSelectedDate(null);
  };

  const monthName = new Date(viewYear, viewMonth, 1).toLocaleString("en-NG", { month: "long", year: "numeric" });

  const upcomingDeadlines = useMemo(() => {
    const result: Array<Deadline & { fullDate: Date }> = [];
    for (let offset = 0; offset < 90; offset++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      const dl = getDeadlines(d.getFullYear(), d.getMonth()).filter((x) => x.date === d.getDate());
      dl.forEach((item) => result.push({ ...item, fullDate: d }));
    }
    return result.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const daysUntil = (date: Date) => {
    const diff = Math.ceil((date.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    if (diff < 0) return `${Math.abs(diff)} days ago`;
    return `In ${diff} days`;
  };
  const urgencyColor = (date: Date) => {
    const diff = Math.ceil((date.getTime() - today.getTime()) / 86400000);
    if (diff < 0) return "#6B6B6B";
    if (diff <= 7) return "#DC2626";
    if (diff <= 14) return "#D97706";
    return "#16A34A";
  };

  return (
    <div style={{ padding: 32, maxWidth: 1000, background: "#F5F5F0", minHeight: "100vh" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0A0A0A", margin: "0 0 4px", letterSpacing: "-0.5px" }}>Compliance Calendar</h1>
        <p style={{ fontSize: 14, color: "#6B6B6B", margin: 0 }}>Every CBN, NFIU, SCUML, NDIC and FIRS filing deadline for the year.</p>
      </div>

      <div style={{ display: isMobile ? "block" : "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden", marginBottom: isMobile ? 20 : 0 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <button onClick={prevMonth} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={16} color="#525252" />
            </button>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>{monthName}</h2>
            <button onClick={nextMonth} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(0,0,0,0.1)", background: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={16} color="#525252" />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "12px 16px 0" }}>
            {WEEKDAYS.map((w) => (
              <div key={w} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: "#9B9B9B", padding: "0 4px 8px", letterSpacing: "0.06em" }}>{w}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: "0 16px 16px", gap: 2 }}>
            {calendarCells.map((cell, idx) => {
              const dayDeadlines = cell.currentMonth ? getDeadlinesForDay(cell.day) : [];
              const isSelected = selectedDate === cell.day && cell.currentMonth;
              const isTodayCell = isToday(cell.day) && cell.currentMonth;
              return (
                <motion.button
                  key={idx}
                  onClick={() => cell.currentMonth && setSelectedDate(cell.day)}
                  whileHover={cell.currentMonth ? { scale: 1.05 } : {}}
                  style={{
                    minHeight: 52, borderRadius: 8, border: "none",
                    background: isSelected ? "#0A0A0A" : isTodayCell ? "rgba(0,0,0,0.06)" : "transparent",
                    cursor: cell.currentMonth ? "pointer" : "default",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
                    padding: "6px 4px 4px", opacity: cell.currentMonth ? 1 : 0.25,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: isTodayCell || isSelected ? 800 : 500, color: isSelected ? "#FFFFFF" : isTodayCell ? "#0A0A0A" : "#525252", marginBottom: 3, lineHeight: 1 }}>
                    {cell.day}
                  </span>
                  {dayDeadlines.length > 0 && (
                    <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                      {dayDeadlines.slice(0, 3).map((dl, i) => (
                        <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: isSelected ? "#FFFFFF" : regulatorColors[dl.regulator]?.dot || "#0A0A0A", flexShrink: 0 }} />
                      ))}
                      {dayDeadlines.length > 3 && (
                        <span style={{ fontSize: 8, color: isSelected ? "#FFFFFF" : "#9B9B9B" }}>+{dayDeadlines.length - 3}</span>
                      )}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          <div style={{ padding: "12px 20px 16px", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: 12, flexWrap: "wrap" }}>
            {Object.entries(regulatorColors).map(([reg, colors]) => (
              <div key={reg} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors.dot }} />
                <span style={{ fontSize: 11, color: "#6B6B6B", fontWeight: 500 }}>{reg}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <AnimatePresence mode="wait">
            {selectedDate ? (
              <motion.div
                key={`${selectedDate}-${viewMonth}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ background: "#0A0A0A", borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 2px" }}>
                    {new Date(viewYear, viewMonth, selectedDate).toLocaleString("en-NG", { weekday: "long" })}
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 800, color: "#FFFFFF", margin: 0, letterSpacing: "-0.5px" }}>
                    {new Date(viewYear, viewMonth, selectedDate).toLocaleString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {selectedDeadlines.length === 0 ? (
                  <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: 20, textAlign: "center" }}>
                    <CheckCircle2 size={24} color="#16A34A" style={{ marginBottom: 8 }} />
                    <p style={{ fontSize: 13, color: "#6B6B6B", margin: 0 }}>No deadlines on this date.</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {selectedDeadlines.map((dl) => (
                      <div key={dl.id} style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: "14px 16px", borderLeft: `3px solid ${regulatorColors[dl.regulator]?.dot}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, background: regulatorColors[dl.regulator]?.badge, color: regulatorColors[dl.regulator]?.text, borderRadius: 4, padding: "2px 6px" }}>{dl.regulator}</span>
                          <span style={{ fontSize: 11, fontWeight: 600, color: dl.severity === "high" ? "#DC2626" : "#D97706" }}>{dl.severity.toUpperCase()}</span>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", margin: "0 0 4px", lineHeight: 1.4 }}>{dl.title}</p>
                        <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0, lineHeight: 1.5 }}>{dl.description}</p>
                        <Link to="/dashboard/new-report" style={{ display: "inline-block", marginTop: 10, fontSize: 12, fontWeight: 600, color: "#0A0A0A", textDecoration: "none", background: "#F5F5F0", borderRadius: 6, padding: "6px 10px" }}>
                          Generate return →
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: 32, textAlign: "center" }}
              >
                <Clock size={24} color="#D1D5DB" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", margin: "0 0 4px" }}>Select a date</p>
                <p style={{ fontSize: 13, color: "#9B9B9B", margin: 0 }}>Click any date to see filing deadlines.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div style={{ marginTop: 24, background: "#FFFFFF", borderRadius: 16, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>Upcoming Deadlines — Next 90 Days</h3>
        </div>
        {upcomingDeadlines.slice(0, 12).map((dl, i) => (
          <div key={`${dl.id}-${i}`} style={{ padding: "14px 20px", borderBottom: i < 11 ? "1px solid rgba(0,0,0,0.04)" : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: regulatorColors[dl.regulator]?.dot, flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{dl.title}</p>
                <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>
                  {dl.fullDate.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: urgencyColor(dl.fullDate) }}>{daysUntil(dl.fullDate)}</span>
              <span style={{ fontSize: 11, fontWeight: 600, background: regulatorColors[dl.regulator]?.badge, color: regulatorColors[dl.regulator]?.text, borderRadius: 4, padding: "2px 7px" }}>{dl.regulator}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceCalendar;
