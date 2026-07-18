import { useEffect, useMemo, useState } from "react";
import {
  AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { Loader2 } from "lucide-react";

/* Dataviz palette (validated against the dataviz skill's validate_palette.js,
   --mode light). Direct labels used on every chart so color is never the only
   distinction. */
const C = {
  navy:   "#172B4D",
  blue:   "#1d4ed8",
  green:  "#166534",
  red:    "#be123c",
  orange: "#b45309",
  ink:    "#172B4D",
  ink2:   "#3A3A3A",
  ink3:   "#6B6B6B",
  line:   "#E5E5E5",
  soft:   "#F4F5F7",
  white:  "#FFFFFF",
};

const fmtNaira = (n: number) => {
  if (n >= 1e9) return `₦${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `₦${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `₦${(n / 1e3).toFixed(0)}K`;
  return `₦${n?.toLocaleString?.() ?? n}`;
};

// ─── Live data (real backend) ──────────────────────────────────────────
function useInsights(userId: string | undefined, institutionId: string | undefined) {
  const [state, setState] = useState<{
    loading: boolean;
    txnTrend: { day: string; volume: number; flagged: number }[];
    alerts: { id: string; type: string; amount: number; status: string; created_at: string }[];
    returns: { status: string; count: number }[];
    totals: { txn7d: number; flagged: number; flaggedValue: number; alertsOpen: number; alertsTotal: number };
  }>({ loading: true, txnTrend: [], alerts: [], returns: [], totals: { txn7d: 0, flagged: 0, flaggedValue: 0, alertsOpen: 0, alertsTotal: 0 } });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const inst = institutionId;
      const since7d = new Date(Date.now() - 7 * 864e5).toISOString();

      // 7-day daily transaction volume + flagged count (for the trend area chart)
      const { data: txns } = inst
        ? await supabase
            .from("unified_transactions")
            .select("transaction_date, amount, is_flagged")
            .eq("institution_id", inst)
            .gte("transaction_date", since7d)
        : { data: [] as any };

      // Recent AML alerts with amount + status
      const { data: aml } = inst
        ? await supabase
            .from("aml_alerts")
            .select("id, alert_type, amount, status, created_at")
            .eq("institution_id", inst)
            .order("created_at", { ascending: false })
            .limit(8)
        : { data: [] as any };

      // Returns status composition (user-scoped)
      const { data: reports } = await supabase
        .from("reports")
        .select("status")
        .eq("user_id", userId);

      if (cancelled) return;

      // bucket transactions by day
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const buckets: Record<number, { day: string; volume: number; flagged: number; amt: number }> = {};
      (txns || []).forEach((t: any) => {
        const d = new Date(t.transaction_date);
        const k = d.getDay();
        if (!buckets[k]) buckets[k] = { day: days[k], volume: 0, flagged: 0, amt: 0 };
        buckets[k].volume += 1;
        buckets[k].amt += Number(t.amount) || 0;
        if (t.is_flagged) buckets[k].flagged += 1;
      });
      const txnTrend = Object.values(buckets).sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day));

      const alerts = (aml || []).map((a: any) => ({
        id: a.id,
        type: a.alert_type || "AML",
        amount: Number(a.amount) || 0,
        status: a.status || "open",
        created_at: a.created_at,
      }));

      const counts: Record<string, number> = {};
      (reports || []).forEach((r: any) => {
        const s = (r.status || "unknown").toLowerCase();
        counts[s] = (counts[s] || 0) + 1;
      });
      const returns = Object.entries(counts).map(([status, count]) => ({ status, count }));

      const flaggedValue = (txns || []).reduce((s: number, t: any) => s + (t.is_flagged ? Number(t.amount) || 0 : 0), 0);
      const alertsOpen = alerts.filter((a) => a.status === "open" || a.status === "new").length;

      setState({
        loading: false,
        txnTrend,
        alerts,
        returns,
        totals: {
          txn7d: (txns || []).length,
          flagged: (txns || []).filter((t: any) => t.is_flagged).length,
          flaggedValue,
          alertsOpen,
          alertsTotal: alerts.length,
        },
      });
    })();
    return () => { cancelled = true; };
  }, [userId, institutionId]);

  return state;
}

// ─── UI primitives ─────────────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white border border-[var(--line)] rounded-xl ${className}`} style={{ padding: 20 }}>
    {children}
  </div>
);

const KPI: React.FC<{ label: string; value: string; sub?: string; tone?: "neutral" | "risk" | "ok" }> = ({ label, value, sub, tone = "neutral" }) => {
  const toneColor = tone === "risk" ? C.red : tone === "ok" ? C.green : C.ink3;
  return (
    <Card>
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--ink-3)]">{label}</p>
      <p className="mt-3 text-[30px] font-mono tracking-tight text-[var(--navy)] leading-none">{value}</p>
      {sub && <p className="mt-2 text-[12px] font-mono" style={{ color: toneColor }}>{sub}</p>}
    </Card>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div className="flex items-baseline justify-between mb-4">
    <h3 className="text-[15px] font-semibold text-[var(--navy)]">{children}</h3>
    {right}
  </div>
);

const tooltipStyle = { fontSize: 12, border: "1px solid #E5E5E5", borderRadius: 8, padding: "8px 10px", background: "#fff" };

// ─── Page ─────────────────────────────────────────────────────────────
const RETURN_COLORS: Record<string, string> = {
  ready: C.green,
  processing: C.blue,
  failed: C.red,
  submitted: C.orange,
  validating: C.orange,
  unknown: C.ink3,
};

const DashboardInsights = () => {
  const { user } = useAuth();
  const { institutionId } = useProfile() as any;
  const d = useInsights(user?.id, institutionId);

  const totalReturns = useMemo(() => d.returns.reduce((s, r) => s + r.count, 0), [d.returns]);
  const pieData = d.returns.length
    ? d.returns
    : [{ status: "no returns yet", count: 1 }];

  return (
    <div style={{ background: "#F4F5F7", minHeight: "100vh", fontFamily: "var(--font-sans)" }}>
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <header className="mb-6">
          <h1 className="text-[24px] font-semibold text-[var(--navy)]">Compliance overview</h1>
          <p className="text-[13px] text-[var(--ink-3)] mt-1">
            Live signals across fraud &amp; AML, identity &amp; screening, and regulatory returns.
          </p>
        </header>

        {d.loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin" size={26} /></div>
        ) : (
          <div className="space-y-6">
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <KPI label="Transactions (7d)" value={d.totals.txn7d.toLocaleString()} sub={d.totals.txn7d ? "live" : "no activity"} />
              <KPI
                label="Flagged transactions"
                value={`${d.totals.flagged}`}
                sub={d.totals.flagged ? fmtNaira(d.totals.flaggedValue) + " under review" : "clear"}
                tone={d.totals.flagged ? "risk" : "ok"}
              />
              <KPI
                label="AML alerts (open)"
                value={`${d.totals.alertsOpen}`}
                sub={d.totals.alertsTotal ? `${d.totals.alertsTotal} total` : "none"}
                tone={d.totals.alertsOpen ? "risk" : "neutral"}
              />
              <KPI label="Returns on file" value={`${totalReturns}`} sub={totalReturns ? "across statuses" : "none yet"} />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2">
                <SectionTitle right={<span className="text-[11px] font-mono text-[var(--ink-3)]">last 7 days</span>}>
                  Transaction volume vs flagged activity
                </SectionTitle>
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <AreaChart data={d.txnTrend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                      <defs>
                        <linearGradient id="vol" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={C.blue} stopOpacity={0.25} />
                          <stop offset="100%" stopColor={C.blue} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Area type="monotone" dataKey="volume" name="Volume" stroke={C.blue} fill="url(#vol)" strokeWidth={2} />
                      <Area type="monotone" dataKey="flagged" name="Flagged" stroke={C.red} fill={C.red} fillOpacity={0.12} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card>
                <SectionTitle>Returns by status</SectionTitle>
                <div style={{ width: "100%", height: 280 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="count"
                        nameKey="status"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                        label={(e: any) => `${e.status}: ${e.count}`}
                        labelLine={false}
                      >
                        {pieData.map((p, i) => (
                          <Cell key={i} fill={RETURN_COLORS[(p.status || "").toLowerCase()] || C.ink3} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Alerts table */}
            <Card className="!p-0">
              <div className="px-5 pt-5 pb-3 flex items-baseline justify-between">
                <h3 className="text-[15px] font-semibold text-[var(--navy)]">Recent AML alerts</h3>
                <span className="text-[11px] font-mono text-[var(--ink-3)]">{d.alerts.length}</span>
              </div>
              {d.alerts.length === 0 ? (
                <div className="px-5 py-10 text-center text-[12.5px] text-[var(--ink-3)]">
                  No AML alerts recorded yet.
                </div>
              ) : (
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] border-t border-[var(--line)]">
                      <th className="px-5 py-2.5 font-normal">Type</th>
                      <th className="px-5 py-2.5 font-normal">Amount</th>
                      <th className="px-5 py-2.5 font-normal">Status</th>
                      <th className="px-5 py-2.5 font-normal text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.alerts.map((a) => (
                      <tr key={a.id} className="border-t border-[var(--line)]">
                        <td className="px-5 py-3 text-[var(--navy)]">{a.type}</td>
                        <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{a.amount ? fmtNaira(a.amount) : "—"}</td>
                        <td className="px-5 py-3">
                          <span
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-mono uppercase tracking-[0.1em]"
                            style={{
                              background: a.status === "open" || a.status === "new" ? "var(--red-soft)" : "var(--green-soft)",
                              color: a.status === "open" || a.status === "new" ? "var(--red)" : "var(--green)",
                            }}
                          >{a.status}</span>
                        </td>
                        <td className="px-5 py-3 text-right text-[var(--ink-2)]">
                          {new Date(a.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInsights;
