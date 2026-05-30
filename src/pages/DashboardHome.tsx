import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Loader2, Clock, XCircle, FilePlus, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DownloadButton from "@/components/DownloadButton";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Profile {
  full_name: string | null;
  company_name: string | null;
  rc_number: string | null;
  cbn_license_category: string | null;
}

interface Report {
  id: string;
  report_name: string;
  report_type: string | null;
  regulator: string | null;
  status: string;
  created_at: string;
  generated_at: string | null;
  file_path: string | null;
  pdf_url: string | null;
  reporting_period_start: string | null;
  reporting_period_end: string | null;
}

type Counts = { total: number; ready: number; processing: number; pending: number; failed: number };

const normalize = (s: string | null | undefined) => (s || "").toLowerCase();

const StatusBadge = ({ status }: { status: string }) => {
  const key = normalize(status);
  const config =
    {
      ready: { label: "Ready", color: "#16A34A", bg: "#F0FDF4", border: "rgba(22,163,74,0.2)" },
      processing: { label: "Processing", color: "#2563EB", bg: "#EFF6FF", border: "rgba(37,99,235,0.2)" },
      pending: { label: "Pending", color: "#D97706", bg: "#FFFBEB", border: "rgba(217,119,6,0.2)" },
      failed: { label: "Failed", color: "#DC2626", bg: "#FEF2F2", border: "rgba(220,38,38,0.2)" },
    }[key] || { label: status || "—", color: "#6B6B6B", bg: "#F5F5F5", border: "rgba(0,0,0,0.1)" };

  return (
    <span
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        borderRadius: 999,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
        display: "inline-block",
      }}
    >
      {config.label}
    </span>
  );
};

const ScorePill = ({ label, value, isNegative = false }: { label: string; value: string; isNegative?: boolean }) => (
  <div
    style={{
      background: isNegative ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
      borderRadius: 999,
      padding: "4px 10px",
      display: "inline-flex",
      gap: 6,
      alignItems: "center",
    }}
  >
    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{label}</span>
    <span style={{ fontSize: 11, fontWeight: 700, color: isNegative ? "#FCA5A5" : "rgba(255,255,255,0.95)" }}>{value}</span>
  </div>
);

// Local deadline generator (mirrors ComplianceCalendar logic, condensed)
function deadlinesThisMonth(types: string[]): number {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const dates: Date[] = [];

  const monthlyMap: Record<string, number[]> = {
    "MFB Regulatory Return": [10],
    "Monetary Policy Return": [10],
    "CBN Monetary Policy Return": [10],
    "Prudential Return": [10],
    "CBN Forex Return": [15],
    "PAYE Remittance": [10],
    "VAT Return": [21],
    "Withholding Tax Return": [21],
    "AML/CFT Report": [15],
    "AML/CFT Compliance Report": [15],
    "NFIU Regulatory Return": [15],
  };

  types.forEach((t) => {
    const days = monthlyMap[t];
    if (days) days.forEach((d) => dates.push(new Date(y, m, d)));
  });

  return dates.length;
}

const DashboardHome = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [institutionTypes, setInstitutionTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    if (!user) return;
    const [pRes, rRes, tRes] = await Promise.all([
      supabase.from("profiles").select("full_name, company_name, rc_number, cbn_license_category").eq("id", user.id).maybeSingle(),
      supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("institution_report_types").select("report_type").eq("user_id", user.id).eq("is_active", true),
    ]);
    if (pRes.data) setProfile(pRes.data);
    if (rRes.data) setReports(rRes.data as Report[]);
    if (tRes.data) setInstitutionTypes(tRes.data.map((r) => r.report_type));
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchAll();
    const channel = supabase
      .channel("dashboard-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === "UPDATE" && normalize((payload.new as Report).status) === "ready") {
            toast({ title: "Report ready", description: `"${(payload.new as Report).report_name}" is ready to download.` });
          }
          fetchAll();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const counts: Counts = useMemo(() => {
    const c: Counts = { total: reports.length, ready: 0, processing: 0, pending: 0, failed: 0 };
    reports.forEach((r) => {
      const s = normalize(r.status);
      if (s === "ready") c.ready++;
      else if (s === "processing") c.processing++;
      else if (s === "pending") c.pending++;
      else if (s === "failed") c.failed++;
    });
    return c;
  }, [reports]);

  // Calendar stats: total deadlines this month from institution types; completed = ready reports this month
  const calendarStats = useMemo(() => {
    const total = deadlinesThisMonth(institutionTypes);
    const now = new Date();
    const completed = reports.filter((r) => {
      if (normalize(r.status) !== "ready") return false;
      const d = new Date(r.generated_at || r.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    return { total, completed: Math.min(completed, total || completed) };
  }, [institutionTypes, reports]);

  const scoreBreakdown = useMemo(() => {
    const totalAttempts = counts.ready + counts.failed;
    const filingScore = totalAttempts === 0 ? 40 : Math.round((counts.ready / totalAttempts) * 40);
    const calendarScore = calendarStats.total === 0 ? 30 : Math.round((calendarStats.completed / calendarStats.total) * 30);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recent = reports.filter(
      (r) => normalize(r.status) === "ready" && new Date(r.generated_at || r.created_at) > thirtyDaysAgo
    );
    const recencyScore = recent.length > 0 ? Math.min(recent.length * 5, 20) : 0;
    const failurePenalty = counts.failed > 0 ? -10 : 0;
    return { filingScore, calendarScore, recencyScore, failurePenalty };
  }, [counts, calendarStats, reports]);

  const healthScore = Math.max(
    0,
    Math.min(
      100,
      scoreBreakdown.filingScore + scoreBreakdown.calendarScore + scoreBreakdown.recencyScore + scoreBreakdown.failurePenalty
    )
  );

  const recentReports = reports.slice(0, 8);
  const institutionName = profile?.company_name || "Your Institution";
  const licenseCategory = profile?.cbn_license_category || "Licensed Institution";
  const licenseNumber = profile?.rc_number ? `RC ${profile.rc_number}` : "—";

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 320 }}>
        <Loader2 size={28} className="animate-spin" color="#0A0A0A" />
      </div>
    );
  }

  const statusCards = [
    { label: "Reports Generated", value: counts.ready, sub: "Successfully filed", icon: CheckCircle, color: "#16A34A", bg: "#F0FDF4", borderColor: "rgba(22,163,74,0.15)" },
    { label: "Processing", value: counts.processing, sub: "Currently running", icon: Loader2, color: "#2563EB", bg: "#EFF6FF", borderColor: "rgba(37,99,235,0.15)", animate: counts.processing > 0 },
    { label: "Pending Upload", value: counts.pending, sub: "Awaiting data", icon: Clock, color: "#D97706", bg: "#FFFBEB", borderColor: "rgba(217,119,6,0.15)" },
    {
      label: "Failed",
      value: counts.failed,
      sub: counts.failed > 0 ? "Require attention" : "No failures",
      icon: XCircle,
      color: counts.failed > 0 ? "#DC2626" : "#9B9B9B",
      bg: counts.failed > 0 ? "#FEF2F2" : "#F5F5F5",
      borderColor: counts.failed > 0 ? "rgba(220,38,38,0.15)" : "rgba(0,0,0,0.07)",
    },
  ];

  const ringColor = healthScore >= 70 ? "#16A34A" : healthScore >= 40 ? "#D97706" : "#DC2626";
  const ringStatus = healthScore >= 70 ? "Good Standing" : healthScore >= 40 ? "Needs Attention" : "At Risk";

  return (
    <div style={{ maxWidth: 1100, fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
      {/* Health card */}
      <div
        style={{
          background: "#0A0A0A",
          borderRadius: 12,
          padding: 24,
          color: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
            {institutionName}
          </p>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px", letterSpacing: "-0.4px" }}>Compliance Dashboard</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            {licenseCategory} · {licenseNumber}
          </p>

          <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
            <ScorePill label="Filing rate" value={`${scoreBreakdown.filingScore}/40`} />
            <ScorePill label="Calendar" value={`${scoreBreakdown.calendarScore}/30`} />
            <ScorePill label="Recency" value={`${scoreBreakdown.recencyScore}/20`} />
            {scoreBreakdown.failurePenalty < 0 && (
              <ScorePill label="Failures" value={`${scoreBreakdown.failurePenalty}`} isNegative />
            )}
          </div>
        </div>

        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - healthScore / 100) }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="46" textAnchor="middle" fill="white" fontSize="22" fontWeight="800" fontFamily="Inter">
              {healthScore}
            </text>
            <text x="50" y="62" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="10" fontFamily="Inter">
              / 100
            </text>
          </svg>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "4px 0 0", fontWeight: 500 }}>{ringStatus}</p>
        </div>
      </div>

      {/* Status cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
        {statusCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
              style={{
                background: "#FFFFFF",
                borderRadius: 12,
                border: `1px solid ${card.borderColor}`,
                padding: 20,
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: card.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={18} color={card.color} className={card.animate ? "animate-spin" : ""} />
                </div>
              </div>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#0A0A0A", margin: "0 0 4px", letterSpacing: "-1px", lineHeight: 1 }}>
                {card.value}
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: "0 0 2px" }}>{card.label}</p>
              <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0 }}>{card.sub}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Calendar compliance */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.07)",
          padding: 20,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: "0 0 2px" }}>Monthly Filing Progress</h3>
            <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0 }}>
              {new Date().toLocaleString("en-NG", { month: "long", year: "numeric" })}
            </p>
          </div>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#0A0A0A" }}>
            {calendarStats.completed}/{calendarStats.total}
          </span>
        </div>
        <div style={{ height: 6, background: "rgba(0,0,0,0.06)", borderRadius: 999, overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: calendarStats.total > 0 ? `${Math.min(100, (calendarStats.completed / calendarStats.total) * 100)}%` : "0%",
            }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            style={{ height: "100%", background: "#0A0A0A", borderRadius: 999 }}
          />
        </div>
        <p style={{ fontSize: 12, color: "#9B9B9B", margin: "8px 0 0" }}>
          {Math.max(0, calendarStats.total - calendarStats.completed)} deadline
          {calendarStats.total - calendarStats.completed !== 1 ? "s" : ""} remaining this month
        </p>
      </div>

      {/* Recent reports */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 12,
          border: "1px solid rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>Recent Reports</h3>
          <Link to="/dashboard/reports" style={{ fontSize: 12, color: "#6B6B6B", textDecoration: "none", fontWeight: 500 }}>
            View all →
          </Link>
        </div>

        {recentReports.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <FileText size={32} color="#D1D5DB" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, color: "#9B9B9B", margin: "0 0 16px" }}>No reports yet</p>
            <Link
              to="/dashboard/new-report"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
                color: "#0A0A0A",
                textDecoration: "none",
                background: "#F5F5F0",
                padding: "8px 16px",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.10)",
              }}
            >
              <FilePlus size={14} /> Generate your first report →
            </Link>
          </div>
        ) : (
          recentReports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 20px",
                borderBottom: i < recentReports.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#F5F5F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FileText size={14} color="#6B6B6B" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {report.report_type || report.report_name || "Regulatory Return"}
                  </p>
                  <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>
                    {report.regulator || "—"} ·{" "}
                    {new Date(report.generated_at || report.created_at).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <StatusBadge status={report.status} />
                {normalize(report.status) === "ready" && <DownloadButton report={report as any} variant="icon" size="sm" />}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
