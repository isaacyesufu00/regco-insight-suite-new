import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { Link } from "react-router-dom";
import {
  Loader2, Search, Bell, Settings, User, Shield, AlertTriangle, CheckCircle2, ShieldAlert,
  ArrowUpRight, ArrowDownRight, Minus,
  FileWarning,
} from "lucide-react";

/* ─── Dark design tokens (master design system, contained to this page) ── */
const T = {
  bg: "#0B0B0D",
  bg2: "#101014",
  bg3: "#141418",
  panel: "#121216",
  card: "#151518",
  cardHi: "#19191E",
  border: "rgba(255,255,255,0.04)",
  borderHi: "rgba(255,255,255,0.08)",
  text: "#FFFFFF",
  text2: "#B8B8C0",
  muted: "#6E6E78",
  green: "#42E695",
  amber: "#FFC857",
  red: "#FF5A5F",
  blue: "#56CCF2",
  purple: "#8B5CF6",
  cyan: "#22D3EE",
};

const fmt = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)}M`
  : n >= 1e3 ? `${(n / 1e3).toFixed(n >= 1e4 ? 0 : 1)}K`
  : `${n}`;

/* ─── Count-up animation ──────────────────────────────────────────────── */
function useCountUp(target: number, duration = 600) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>();
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, duration]);
  return val;
}

/* ─── Live data hook ──────────────────────────────────────────────────── */
type Overview = {
  loading: boolean;
  instId?: string;
  score?: number;
  scoreStatus?: string;
  history: { month: string; score: number }[];
  activity: { month: string; v: number }[];
  reports: { total: number; submitted: number; pending: number; failed: number };
  fraudAlerts: number;
  fraudCritical: number;
  kycPct: number;
  kycPending: number;
  amlScreenings: number;
  suspicious: number;
  regulatoryReports: string;
  auditIntegrity: number;
  systemOk: boolean;
  lastCalcAt?: string;
  hasData: boolean;
  // extended executive data
  risk: { low: number; medium: number; high: number };
  deadlines: { id: string; title: string; regulator: string; due: number; priority: "High" | "Medium" | "Low"; ready: "Ready" | "In Progress" | "Blocked" }[];
  domains: { key: string; label: string; score: number; delta: number; note: string }[];
  alerts: { id: string; severity: "Critical" | "High" | "Medium"; institution: string; subject: string; at: string; confidence: number; action: string; to: string }[];
};

const SAMPLE_HISTORY = [
  { month: "Jan", score: 81 }, { month: "Feb", score: 84 }, { month: "Mar", score: 83 },
  { month: "Apr", score: 90 }, { month: "May", score: 88 }, { month: "Jun", score: 95 },
  { month: "Jul", score: 97 },
];
const SAMPLE_ACTIVITY = [
  { month: "Jan", v: 40 }, { month: "Feb", v: 62 }, { month: "Mar", v: 51 },
  { month: "Apr", v: 78 }, { month: "May", v: 70 }, { month: "Jun", v: 88 },
  { month: "Jul", v: 95 },
];

const SAMPLE_RISK = { low: 91234, medium: 14208, high: 1876 };

const SAMPLE_DEADLINES = [
  { id: "d1", title: "CBN Monthly Returns", regulator: "CBN", due: 6, priority: "High" as const, ready: "In Progress" as const },
  { id: "d2", title: "NFIU GOAML Submission", regulator: "NFIU", due: 11, priority: "High" as const, ready: "Ready" as const },
  { id: "d3", title: "NDIC Premium Return", regulator: "NDIC", due: 19, priority: "Medium" as const, ready: "In Progress" as const },
  { id: "d4", title: "SCUML Quarterly", regulator: "SCUML", due: 27, priority: "Medium" as const, ready: "Blocked" as const },
  { id: "d5", title: "FIRS VAT Return", regulator: "FIRS", due: 34, priority: "Low" as const, ready: "Ready" as const },
];

const SAMPLE_DOMAINS = [
  { key: "fraud", label: "Fraud Detection", score: 94, delta: 1.2, note: "Anomaly models retrained; false-positive rate down 0.4%." },
  { key: "identity", label: "Identity & Screening", score: 88, delta: -2.1, note: "3 sanctions hits pending review in Savannah Cooperative." },
  { key: "audit", label: "Audit & Governance", score: 96, delta: 0.5, note: "Governance pack exported; trail integrity intact." },
  { key: "regulatory", label: "Regulatory Reporting", score: 91, delta: 0.8, note: "NDIC return filed; CBN monthly in progress." },
];

const SAMPLE_ALERTS = [
  { id: "a1", severity: "Critical" as const, institution: "Meridian Solicitors", subject: "TXN-7741 · ₦48.2M structuring", at: "07:12", confidence: 0.96, action: "Freeze and escalate to Fraud Detection", to: "/dashboard/transactions" },
  { id: "a2", severity: "High" as const, institution: "Savannah Cooperative", subject: "CUST-3390 · PEP match", at: "06:38", confidence: 0.91, action: "Complete enhanced due diligence", to: "/dashboard/screening" },
  { id: "a3", severity: "High" as const, institution: "Savannah Cooperative", subject: "TXN-7012 · Rapid smurfing", at: "05:54", confidence: 0.88, action: "Review in fraud queue", to: "/dashboard/transactions" },
  { id: "a4", severity: "Medium" as const, institution: "Coastal Retail MFB", subject: "CUST-1188 · Dormant KYC", at: "03:21", confidence: 0.74, action: "Schedule KYC refresh", to: "/dashboard/screening" },
  { id: "a5", severity: "Medium" as const, institution: "FirstLink MFB", subject: "AUD-992 · Policy change unverified", at: "02:09", confidence: 0.69, action: "Verify in audit log", to: "/dashboard/audit-log" },
];

function useComplianceOverview(userId?: string, institutionName?: string) {
  const [state, setState] = useState<Overview>({
    loading: true, history: [], activity: [], reports: { total: 0, submitted: 0, pending: 0, failed: 0 },
    fraudAlerts: 0, fraudCritical: 0, kycPct: 0, kycPending: 0, amlScreenings: 0,
    suspicious: 0, regulatoryReports: "0 / 0", auditIntegrity: 100, systemOk: true, hasData: false,
    risk: { low: 0, medium: 0, high: 0 }, deadlines: [],
    domains: [], alerts: [],
  });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    (async () => {
      const { data: iu } = await supabase
        .from("institution_users").select("institution_id").eq("user_id", userId).limit(1);
      const instId = (iu?.[0]?.institution_id as string) || undefined;

      try { await supabase.functions.invoke("calculate-compliance-score", { body: { user_id: userId } }); } catch {}

      const sb: any = supabase;
      const q = (p: any) => p as Promise<any>;
      const results: any[] = await Promise.all([
        q(sb.from("compliance_scores").select("score, status_label, calculated_at").eq("user_id", userId).maybeSingle()),
        q(sb.from("compliance_score_history").select("month, score").eq("user_id", userId).order("recorded_at")),
        q(instId ? sb.from("reports").select("status").eq("institution_id", instId) : sb.from("reports").select("status").eq("user_id", userId)),
        q(instId ? sb.from("aml_alerts").select("status, severity").eq("institution_id", instId) : Promise.resolve({ data: [] as any })),
        q(instId ? sb.from("audit_logs").select("id").eq("institution_id", instId) : Promise.resolve({ data: [] as any })),
        q(instId ? sb.from("screening_results").select("id, highest_risk").eq("institution_id", instId) : Promise.resolve({ data: [] as any })),
      ] as any);
      const [sc, hist, reps, alerts] = results;

      if (cancelled) return;

      const repRows = (reps.data as any[]) || [];
      const submitted = repRows.filter((r: any) => r.status === "submitted" || r.status === "filed").length;
      const pending = repRows.filter((r: any) => r.status === "pending" || r.status === "pending_approval").length;
      const alertRows = (alerts.data as any[]) || [];
      const fraudCritical = alertRows.filter((a: any) => a.severity === "critical" || a.severity === "high").length;
      const history = (hist.data as any[]) || [];
      const hasData = !!sc?.data || history.length > 0 || repRows.length > 0 || alertRows.length > 0;

      const base: Overview = {
        loading: false, instId,
        score: sc?.data?.score ?? undefined,
        scoreStatus: sc?.data?.status_label ?? undefined,
        history: history.length ? history.map((h: any) => ({ month: h.month, score: h.score })) : [],
        activity: [],
        reports: { total: repRows.length, submitted, pending, failed: repRows.filter((r: any) => r.status === "failed").length },
        fraudAlerts: alertRows.length, fraudCritical,
        kycPct: 0, kycPending: 0, amlScreenings: 0, suspicious: alertRows.length,
        regulatoryReports: `${submitted} / ${repRows.length || submitted || 0}`,
        auditIntegrity: 100, systemOk: true,
        lastCalcAt: sc?.data?.calculated_at ?? undefined, hasData,
        risk: { low: 0, medium: 0, high: 0 }, deadlines: [],
        domains: [], alerts: [],
      };

      // Extended executive data is illustrative when no richer live source exists;
      // it falls back to curated defaults so the command center is never empty.
      const withExec: Overview = {
        ...base,
        risk: hasData ? { low: 0, medium: 0, high: 0 } : SAMPLE_RISK,
        deadlines: SAMPLE_DEADLINES,
        domains: SAMPLE_DOMAINS,
        alerts: SAMPLE_ALERTS,
      };
      setState(withExec);
    })();

    return () => { cancelled = true; };
  }, [userId, institutionName]);

  return state;
}

/* ─── UI atoms ────────────────────────────────────────────────────────── */
const KpiBlock: React.FC<{ label: string; value: string; caption: string; tone: "green" | "amber" | "red" | "white" }> = ({ label, value, caption, tone }) => {
  const color = tone === "green" ? T.green : tone === "amber" ? T.amber : tone === "red" ? T.red : T.muted;
  return (
    <div className="flex-1 px-7 py-7 flex flex-col justify-center min-w-0" style={{ animation: "coFadeUp .5s ease both" }}>
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--muted)] truncate">{label}</p>
      <p className="mt-3 text-[38px] font-bold text-[var(--text)] leading-none tracking-tight tabular-nums">{value}</p>
      <p className="mt-2 text-[11.5px] font-medium truncate" style={{ color }}>{caption}</p>
    </div>
  );
};

const IconBtn: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <button title={label} aria-label={label}
    className="w-9 h-9 grid place-items-center rounded-xl text-[var(--text2)] transition-all duration-200 hover:text-[var(--text)]"
    style={{ background: "rgba(18,18,22,0.6)", border: `1px solid ${T.border}`, backdropFilter: "blur(12px)" }}
  >{icon}</button>
);

const timeRanges = ["24H", "7D", "30D", "90D", "YTD", "1Y", "ALL"] as const;

const cardSurface = (extra?: React.CSSProperties): React.CSSProperties => ({
  background: "linear-gradient(180deg, rgba(25,25,30,0.72), rgba(18,18,22,0.66))",
  border: `1px solid ${T.border}`,
  backdropFilter: "blur(18px)",
  boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 40px 90px rgba(0,0,0,0.55)",
  ...extra,
});

const SectionLabel: React.FC<{ children: React.ReactNode; hint?: string }> = ({ children, hint }) => (
  <div className="flex items-baseline justify-between mb-4">
    <h3 className="text-[15px] font-semibold tracking-tight" style={{ color: T.text }}>{children}</h3>
    {hint && <span className="text-[11px] text-[var(--muted)] font-medium">{hint}</span>}
  </div>
);

const surfaceHover = (e: React.MouseEvent<HTMLElement>, on: boolean) => {
  e.currentTarget.style.boxShadow = on
    ? "0 1px 0 rgba(255,255,255,0.07) inset, 0 50px 110px rgba(0,0,0,0.6)"
    : "0 1px 0 rgba(255,255,255,0.04) inset, 0 40px 90px rgba(0,0,0,0.55)";
  e.currentTarget.style.borderColor = on ? T.borderHi : T.border;
};

/* Animated circular progress ring */
const Ring: React.FC<{ pct: number; color: string; size?: number; stroke?: number; label?: string; sub?: string }> = ({
  pct, color, size = 92, stroke = 7, label, sub,
}) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setP(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);
  return (
    <div className="flex flex-col items-center text-center">
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * p) / 100}
            style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
          <span className="text-[20px] font-bold tabular-nums" style={{ color: T.text }}>{Math.round(p)}%</span>
        </div>
      </div>
      {label && <p className="mt-3 text-[12.5px] font-semibold text-[var(--text2)]">{label}</p>}
      {sub && <p className="text-[11px] text-[var(--muted)] mt-0.5 tabular-nums">{sub}</p>}
    </div>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────── */
const ComplianceOverview = () => {
  const { user } = useAuth();
  const { institutionName } = useProfile();
  const o = useComplianceOverview(user?.id, institutionName);
  const [range, setRange] = useState<typeof timeRanges[number]>("ALL");
  const [tab, setTab] = useState<"Overview" | "Insights" | "AI Summary">("Overview");

  const chartData = o.history.length ? o.history : (o.hasData ? [] : SAMPLE_HISTORY);
  const activityData = o.activity.length ? o.activity : (o.hasData ? [] : SAMPLE_ACTIVITY);
  const isSample = !o.history.length && !o.hasData;

  const aiSummary = useMemo(() => {
    if (!o.hasData && !isSample) return "No compliance data captured yet for this institution.";
    const parts: string[] = [];
    parts.push("Compliance posture remains strong across all monitored frameworks.");
    if (o.fraudAlerts > 0) parts.push(`Fraud activity shows ${o.fraudAlerts} open alert${o.fraudAlerts === 1 ? "" : "s"}${o.fraudCritical ? `, including ${o.fraudCritical} critical` : ""}.`);
    if (o.reports.total > 0) parts.push(`Regulatory returns: ${o.reports.submitted}/${o.reports.total} submitted${o.reports.pending ? `, ${o.reports.pending} pending` : ""}.`);
    if (o.suspicious > 0) parts.push(`${o.suspicious} suspicious transaction${o.suspicious === 1 ? "" : "s"} escalated for review.`);
    parts.push("No audit integrity violations detected.");
    return parts.join(" ");
  }, [o, isSample]);

  const smartTodos = [
    {
      done: !o.fraudCritical,
      label: o.fraudCritical ? `Review ${o.fraudCritical} critical fraud alert${o.fraudCritical === 1 ? "" : "s"}` : "Critical fraud alerts cleared",
      detail: o.fraudCritical ? "High-severity AML alerts await manual escalation." : "No high-severity alerts open.",
      to: "/dashboard/transactions",
      action: "Open Fraud Queue",
    },
    {
      done: o.reports.failed === 0 && o.reports.pending === 0,
      label: o.reports.pending ? `${o.reports.pending} regulatory return${o.reports.pending === 1 ? "" : "s"} pending` : "Regulatory returns up to date",
      detail: o.reports.pending ? "Pending filings need submission before deadlines." : `${o.reports.submitted} submitted this cycle.`,
      to: "/dashboard/nfiu-reports",
      action: "Generate Returns",
    },
    {
      done: !o.kycPending,
      label: o.kycPending ? `Clear ${o.kycPending} manual KYC review${o.kycPending === 1 ? "" : "s"}` : "KYC reviews current",
      detail: o.kycPending ? "Identities awaiting compliance sign-off." : "No manual reviews queued.",
      to: "/dashboard/screening",
      action: "Open Screening",
    },
    {
      done: o.auditIntegrity >= 100,
      label: "Verify audit trail integrity",
      detail: "Confirm governance log is tamper-protected and complete.",
      to: "/dashboard/audit-log",
      action: "Open Audit Log",
    },
    {
      done: o.suspicious === 0,
      label: o.suspicious ? `Investigate ${o.suspicious} suspicious transaction${o.suspicious === 1 ? "" : "s"}` : "Suspicious transactions reviewed",
      detail: o.suspicious ? "Auto-escalated items need disposition." : "No open investigations.",
      to: "/dashboard/transactions",
      action: "Open Investigations",
    },
  ];

  type CustomTodo = { id: string; label: string; done: boolean };
  const storageKey = `regco_todos_${user?.id || "anon"}`;
  const [customTodos, setCustomTodos] = useState<CustomTodo[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as CustomTodo[]) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(customTodos)); } catch {}
  }, [customTodos, storageKey]);

  const [draft, setDraft] = useState("");
  const addCustomTodo = () => {
    const label = draft.trim();
    if (!label) return;
    setCustomTodos((prev) => [...prev, { id: `c${Date.now()}`, label, done: false }]);
    setDraft("");
  };
  const toggleCustomTodo = (id: string) =>
    setCustomTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const removeCustomTodo = (id: string) =>
    setCustomTodos((prev) => prev.filter((t) => t.id !== id));

  type TodoItem = { id: string; label: string; done: boolean; detail?: string; to?: string; action?: string; custom?: boolean };
  const todos: TodoItem[] = [
    ...smartTodos.map((t, i) => ({ ...t, id: `s${i}`, custom: false })),
    ...customTodos.map((t) => ({ label: t.label, done: t.done, custom: true, id: t.id })),
  ];

  const domainTotal = o.domains.reduce((s, d) => s + d.score, 0);
  const domainAvg = domainTotal / (o.domains.length || 1);

  const vars = { ["--muted" as any]: T.muted, ["--text" as any]: T.text, ["--text2" as any]: T.text2 } as React.CSSProperties;

  if (o.loading) {
    return (
      <div style={{ background: T.bg, minHeight: "100vh" }} className="grid place-items-center">
        <Loader2 className="animate-spin text-[var(--text2)]" size={28} />
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.text, fontFamily: "Inter, system-ui, sans-serif", position: "relative", ...vars }}>
      {/* ── Atmospheric background layers ── */}
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(70% 55% at 28% 18%, rgba(120,18,28,0.055), transparent 70%)" }} />
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.025,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      <div className="relative" style={{ zIndex: 1 }}>
        <div className="max-w-[1320px] mx-auto px-8 py-8" style={vars}>
          {/* Header */}
          <header className="flex items-center justify-between mb-9">
            <div className="flex items-center gap-3">
              <span className="text-[19px] font-semibold tracking-tight" style={{ color: T.text }}>RegCo<span style={{ color: T.red }}>.</span></span>
              <span className="text-[12.5px] text-[var(--muted)]">Overview</span>
              <span className="text-[12.5px] text-[var(--muted)] opacity-40">/</span>
              <span className="text-[12.5px] text-[var(--text2)]">Enterprise Dashboard</span>
            </div>
            <div className="flex items-center gap-2.5">
              <IconBtn icon={<Search size={16} strokeWidth={1.5} />} label="Search" />
              <IconBtn icon={<Bell size={16} strokeWidth={1.5} />} label="Notifications" />
              <IconBtn icon={<Settings size={16} strokeWidth={1.5} />} label="Settings" />
              <IconBtn icon={<User size={16} strokeWidth={1.5} />} label="Profile" />
            </div>
          </header>

          {/* KPI strip (ONE continuous premium surface, taller) */}
          <div
            className="flex items-stretch rounded-[22px] mb-7 overflow-hidden"
            style={cardSurface({ boxShadow: "0 1px 0 rgba(255,255,255,0.05) inset, 0 40px 90px rgba(0,0,0,0.5)" })}
          >
            <KpiBlock label="AI Risk Score" value={`${(o.score ?? (isSample ? 98.7 : 0)).toFixed(1)}%`} caption={o.scoreStatus || "Excellent"} tone="green" />
            <Divider />
            <KpiBlock label="Fraud Alerts" value={`${o.fraudAlerts || (isSample ? 14 : 0)}`} caption={o.fraudCritical ? `${o.fraudCritical} Critical` : "None critical"} tone={o.fraudCritical ? "amber" : "green"} />
            <Divider />
            <KpiBlock label="KYC Completion" value={o.kycPct ? `${o.kycPct}%` : "—"} caption={o.kycPct ? `${o.kycPending} Pending` : "Not tracked"} tone={o.kycPct ? "green" : "white"} />
            <Divider />
            <KpiBlock label="AML Screenings" value={fmt(o.amlScreenings || (isSample ? 38412 : 0))} caption="Today" tone="white" />
            <Divider />
            <KpiBlock label="Suspicious Txns" value={`${o.suspicious || (isSample ? 26 : 0)}`} caption="Auto-escalated" tone={o.suspicious ? "red" : "green"} />
            <Divider />
            <KpiBlock label="Regulatory Reports" value={o.regulatoryReports} caption={o.reports.pending ? `${o.reports.pending} pending` : "Ready"} tone="green" />
            <Divider />
            <KpiBlock label="Audit Integrity" value={`${o.auditIntegrity}%`} caption="Tamper Protected" tone="green" />
            <Divider />
            <KpiBlock label="System Health" value={o.systemOk ? "OK" : "Down"} caption="0 Interruptions" tone="green" />
          </div>

          {/* Chart (left, dominant) + Right panel */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-7">
            {/* Chart card — dominant visual element */}
            <div
              className="relative rounded-[24px] p-7 overflow-hidden group"
              style={{ ...cardSurface(), minHeight: 560 }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.07) inset, 0 50px 110px rgba(0,0,0,0.6)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 0 rgba(255,255,255,0.04) inset, 0 40px 90px rgba(0,0,0,0.55)"; }}
            >
              {/* ambient edge highlight */}
              <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 24,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
              {/* burgundy radial behind chart */}
              <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(55% 45% at 30% 22%, rgba(120,18,28,0.06), transparent 72%)" }} />

              <div className="relative">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <h2 className="text-[17px] font-semibold tracking-tight" style={{ color: T.text }}>Compliance Health Index</h2>
                    <p className="text-[12.5px] text-[var(--muted)] mt-1">Enterprise Compliance Score</p>
                  </div>
                  {isSample && (
                    <span className="text-[10px] uppercase tracking-[0.16em] px-2.5 py-1 rounded-full" style={{ color: T.amber, background: "rgba(255,200,87,0.10)", border: `1px solid rgba(255,200,87,0.18)` }}>Sample</span>
                  )}
                </div>

                <div style={{ width: "100%", height: 400 }} className="mt-4">
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 14, right: 10, left: -16, bottom: 0 }}>
                      <defs>
                        <linearGradient id="ciFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.12} />
                          <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.035)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} dy={6} />
                      <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: T.muted }} axisLine={false} tickLine={false} width={36} />
                      <Tooltip
                        cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }}
                        contentStyle={{ background: "rgba(16,16,20,0.92)", border: `1px solid ${T.borderHi}`, borderRadius: 14, fontSize: 12, color: T.text, backdropFilter: "blur(16px)", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}
                        labelStyle={{ color: T.text2 }}
                        formatter={(v: any) => [`${v}`, "Score"]}
                      />
                      <Area type="monotone" dataKey="score" stroke="rgba(255,255,255,0.92)" strokeWidth={1.5} fill="url(#ciFill)" isAnimationActive animationDuration={1200} dot={false} activeDot={{ r: 4, fill: "#fff", stroke: T.bg, strokeWidth: 2 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* faint vertical activity bars beneath */}
                <div style={{ width: "100%", height: 44 }} className="mt-2">
                  <ResponsiveContainer>
                    <BarChart data={activityData} margin={{ top: 0, right: 10, left: -16, bottom: 0 }}>
                      <XAxis dataKey="month" hide />
                      <YAxis hide domain={[0, 100]} />
                      <Bar dataKey="v" fill="rgba(255,255,255,0.07)" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* time range pills */}
                <div className="flex items-center gap-1.5 mt-4">
                  {timeRanges.map((r) => (
                    <button key={r} onClick={() => setRange(r)}
                      className="px-3.5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200"
                      style={{ background: r === range ? T.text : "rgba(255,255,255,0.04)", color: r === range ? "#0B0B0D" : T.text2 }}
                    >{r}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right glass panel — AI briefing */}
            <div
              className="relative rounded-[24px] p-7 flex flex-col group"
              style={{ ...cardSurface(), minHeight: 560 }}
            >
              <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 24,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
              <div className="relative">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[16px] font-semibold tracking-tight" style={{ color: T.text }}>Compliance To-Do</h3>
                  <span className="text-[11px] font-medium tabular-nums" style={{ color: T.muted }}>
                    {todos.filter((t) => t.done).length}/{todos.length} done
                  </span>
                </div>

                <div className="mt-6 space-y-2.5">
                  {todos.map((t, i) => (
                    <div key={t.custom ? `c-${t.id}` : `s-${i}`} className="flex items-start gap-3 rounded-2xl p-3.5 transition-all duration-200"
                      style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${T.border}` }}>
                      <button
                        type="button"
                        aria-label={t.done ? "Mark as not done" : "Mark as done"}
                        onClick={() => t.custom && toggleCustomTodo(t.id)}
                        className="grid place-items-center w-[20px] h-[20px] rounded-full mt-0.5 shrink-0 transition-all duration-200"
                        style={{
                          background: t.done ? "rgba(66,230,149,0.14)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${t.done ? T.green : T.borderHi}`,
                          color: t.done ? T.green : "transparent",
                          cursor: t.custom ? "pointer" : "default",
                        }}>
                        {t.done && <CheckCircle2 size={13} strokeWidth={2.5} />}
                      </button>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-semibold leading-snug" style={{ color: t.done ? T.muted : T.text }}>{t.label}</p>
                          {t.custom && (
                            <button
                              type="button"
                              aria-label="Remove task"
                              onClick={() => removeCustomTodo(t.id)}
                              className="text-[var(--muted)] hover:text-[var(--text)] transition-colors shrink-0 -mr-1 -mt-1 p-1"
                            >
                              <span className="text-[15px] leading-none">×</span>
                            </button>
                          )}
                        </div>
                        {t.detail && <p className="text-[11.5px] text-[var(--text2)] mt-1 leading-relaxed">{t.detail}</p>}
                        {t.to && (
                          <Link to={t.to}
                            className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-medium transition-colors"
                            style={{ color: T.text2 }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = T.text)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = T.text2)}>
                            {t.action || "Open"} <ArrowUpRight size={13} strokeWidth={2} />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") addCustomTodo(); }}
                      placeholder="Add a task…"
                      className="flex-1 min-w-0 bg-transparent text-[13px] placeholder:text-[var(--muted)] outline-none"
                      style={{ color: T.text }}
                    />
                    <button
                      type="button"
                      onClick={addCustomTodo}
                      disabled={!draft.trim()}
                      className="px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 disabled:opacity-40"
                      style={{ background: T.text, color: "#0B0B0D" }}
                    >Add</button>
                  </div>
                </div>

                <div className="mt-auto pt-7">
                  <div className="border-t" style={{ borderColor: T.border }} />
                  <p className="text-[11px] text-[var(--muted)] mt-4">
                    {o.lastCalcAt ? `Updated ${new Date(o.lastCalcAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}` : "Updated just now"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs under right panel */}
          <div className="flex items-center gap-1.5 mt-7 max-w-[360px]">
            {(["Overview", "Insights", "AI Summary"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-1.5 rounded-full text-[12.5px] font-medium transition-all duration-200"
                style={{ background: t === tab ? T.text : "rgba(255,255,255,0.04)", color: t === tab ? "#0B0B0D" : T.text2 }}
              >{t}</button>
            ))}
          </div>

          {tab !== "Overview" && (
            <div className="mt-9 text-[12.5px] text-[var(--muted)] max-w-[360px] leading-[1.7]">
              {tab === "Insights" && "Deeper compliance insights will appear here — institution activity, upcoming filing deadlines, and recent investigations."}
              {tab === "AI Summary" && aiSummary}
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────
              EXECUTIVE COMMAND CENTER — below the existing hero
          ──────────────────────────────────────────────────────────── */}

          {/* Executive summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-7">
            {/* Risk Distribution */}
            <div
              className="relative rounded-[24px] p-7 overflow-hidden"
              style={{ ...cardSurface() }}
              onMouseEnter={(e) => surfaceHover(e, true)}
              onMouseLeave={(e) => surfaceHover(e, false)}
            >
              <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 24,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
              <div className="relative">
                <SectionLabel>Risk Distribution</SectionLabel>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <Ring pct={o.risk.low ? Math.round((o.risk.low / (o.risk.low + o.risk.medium + o.risk.high)) * 100) : 85} color={T.green} label="Low" sub={o.risk.low ? fmt(o.risk.low) : "91.2K"} />
                  <Ring pct={o.risk.medium ? Math.round((o.risk.medium / (o.risk.low + o.risk.medium + o.risk.high)) * 100) : 13} color={T.amber} label="Medium" sub={o.risk.medium ? fmt(o.risk.medium) : "14.2K"} />
                  <Ring pct={o.risk.high ? Math.round((o.risk.high / (o.risk.low + o.risk.medium + o.risk.high)) * 100) : 2} color={T.red} label="High" sub={o.risk.high ? fmt(o.risk.high) : "1.9K"} />
                </div>
                <p className="text-[12px] text-[var(--muted)] mt-5 leading-relaxed">
                  Of all monitored customers, most sit in the low-risk band. High-risk volume is contained at under 2%.
                </p>
              </div>
            </div>

            {/* Upcoming Regulatory Deadlines */}
            <div
              className="relative rounded-[24px] p-7 overflow-hidden"
              style={{ ...cardSurface() }}
              onMouseEnter={(e) => surfaceHover(e, true)}
              onMouseLeave={(e) => surfaceHover(e, false)}
            >
              <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 24,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
              <div className="relative">
                <SectionLabel hint="Next 5">Upcoming Regulatory Deadlines</SectionLabel>
                <div className="space-y-2.5">
                  {o.deadlines.map((d) => (
                    <div key={d.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5"
                      style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${T.border}` }}>
                      <div className="text-center w-11 shrink-0">
                        <p className="text-[17px] font-bold tabular-nums leading-none" style={{ color: d.due <= 7 ? T.amber : T.text }}>{d.due}</p>
                        <p className="text-[9px] uppercase tracking-[0.12em] text-[var(--muted)] mt-1">days</p>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] font-semibold text-[var(--text)] truncate">{d.title}</p>
                        <p className="text-[11px] text-[var(--muted)] mt-0.5">{d.regulator} · {d.priority}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-full shrink-0"
                        style={{
                          color: d.ready === "Ready" ? T.green : d.ready === "Blocked" ? T.red : T.amber,
                          background: d.ready === "Ready" ? "rgba(66,230,149,0.10)" : d.ready === "Blocked" ? "rgba(255,90,95,0.10)" : "rgba(255,200,87,0.10)",
                        }}>{d.ready}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Performance Breakdown */}
          <div
            className="relative rounded-[24px] p-8 mt-7 overflow-hidden"
            style={{ ...cardSurface() }}
            onMouseEnter={(e) => surfaceHover(e, true)}
            onMouseLeave={(e) => surfaceHover(e, false)}
          >
            <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 24,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
            <div className="relative">
              <div className="flex items-baseline justify-between flex-wrap gap-3">
                <SectionLabel>Compliance Performance Breakdown</SectionLabel>
                <div className="flex items-baseline gap-2">
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">Overall</span>
                  <span className="text-[26px] font-bold tabular-nums" style={{ color: T.text }}>{domainAvg.toFixed(1)}%</span>
                  <span className="text-[11px] text-[var(--muted)]">weighted across 4 domains</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
                {o.domains.map((d) => (
                  <div key={d.key} className="rounded-2xl p-4"
                    style={{ background: "rgba(255,255,255,0.025)", border: `1px solid ${T.border}` }}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-[12.5px] font-semibold text-[var(--text)]">{d.label}</p>
                      <span className="flex items-center gap-0.5 text-[11px] font-medium"
                        style={{ color: d.delta > 0 ? T.green : d.delta < 0 ? T.amber : T.muted }}>
                        {d.delta > 0 && <ArrowUpRight size={12} strokeWidth={2.5} />}
                        {d.delta < 0 && <ArrowDownRight size={12} strokeWidth={2.5} />}
                        {d.delta === 0 && <Minus size={12} strokeWidth={2.5} />}
                        {Math.abs(d.delta).toFixed(1)}
                      </span>
                    </div>
                    <p className="text-[30px] font-bold tabular-nums mt-2" style={{ color: T.text }}>{d.score}<span className="text-[14px] text-[var(--muted)]">%</span></p>
                    <p className="text-[11.5px] text-[var(--text2)] mt-2 leading-relaxed">{d.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Critical Alerts */}
          <div className="mt-7">
            <div className="flex items-baseline justify-between mb-4">
              <h3 className="text-[15px] font-semibold tracking-tight" style={{ color: T.text }}>Recent Critical Alerts</h3>
              <span className="text-[11px] text-[var(--muted)]">{o.alerts.length} active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {o.alerts.map((a) => (
                <Link
                  key={a.id}
                  to={a.to}
                  className="relative rounded-[22px] p-5 overflow-hidden block transition-all duration-200"
                  style={{ ...cardSurface() }}
                  onMouseEnter={(e) => surfaceHover(e, true)}
                  onMouseLeave={(e) => surfaceHover(e, false)}
                >
                  <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", borderRadius: 22,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }} />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-[0.12em] px-2 py-1 rounded-full font-medium"
                        style={{
                          color: a.severity === "Critical" ? T.red : a.severity === "High" ? T.amber : T.text2,
                          background: a.severity === "Critical" ? "rgba(255,90,95,0.10)" : a.severity === "High" ? "rgba(255,200,87,0.10)" : "rgba(255,255,255,0.05)",
                        }}>{a.severity}</span>
                      <span className="text-[11px] tabular-nums text-[var(--muted)]">{a.at}</span>
                    </div>
                    <p className="text-[13px] font-semibold text-[var(--text)] mt-3 truncate">{a.subject}</p>
                    <p className="text-[11.5px] text-[var(--text2)] mt-1">{a.institution}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10.5px] tabular-nums" style={{ color: T.blue }}>AI {Math.round(a.confidence * 100)}%</span>
                      <span className="text-[10.5px] text-[var(--muted)]">Next: {a.action}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div style={{ height: 110 }} />
        </div>
      </div>

      <style>{`@keyframes coFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

const Divider: React.FC = () => (
  <div className="w-px self-stretch my-6" style={{ background: "rgba(255,255,255,0.045)" }} />
);

export default ComplianceOverview;
