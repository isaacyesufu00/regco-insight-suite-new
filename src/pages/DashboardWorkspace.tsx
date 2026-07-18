import { useEffect, useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { Loader2 } from "lucide-react";

type TabId = "fraud" | "identity" | "returns";

const TABS: { id: TabId; label: string }[] = [
  { id: "fraud",    label: "Fraud & AML" },
  { id: "identity", label: "Identity & Screening" },
  { id: "returns",  label: "Regulatory Returns" },
];

// ─── Shared primitives ─────────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white border border-[var(--line)] rounded-lg ${className}`} style={{ padding: 20 }}>
    {children}
  </div>
);

const KPI: React.FC<{ label: string; value: string; delta?: string; tone?: "positive" | "negative" | "neutral" }> = ({
  label, value, delta, tone = "neutral",
}) => {
  const color = tone === "positive" ? "var(--green)" : tone === "negative" ? "var(--red)" : "var(--ink-3)";
  return (
    <Card>
      <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--ink-3)]">{label}</p>
      <p className="mt-3 text-[28px] font-mono tracking-tight text-[var(--navy)] leading-none">{value}</p>
      {delta && <p className="mt-2 text-[12px] font-mono" style={{ color }}>{delta}</p>}
    </Card>
  );
};

const SectionTitle: React.FC<{ children: React.ReactNode; right?: React.ReactNode }> = ({ children, right }) => (
  <div className="flex items-baseline justify-between mb-3">
    <h3 className="text-[14px] font-semibold text-[var(--navy)]">{children}</h3>
    {right}
  </div>
);

const Pill: React.FC<{ status: string }> = ({ status }) => {
  const m =
    status === "hit"    ? { bg: "var(--red-soft)",   fg: "var(--red)" } :
    status === "review" ? { bg: "#FFF7E6",            fg: "#B8862A" } :
    status === "flagged" ? { bg: "var(--red-soft)",  fg: "var(--red)" } :
    status === "clean"  ? { bg: "var(--green-soft)", fg: "var(--green)" } :
                          { bg: "var(--green-soft)", fg: "var(--green)" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-mono uppercase tracking-[0.1em]"
      style={{ background: m.bg, color: m.fg }}
    >
      {status}
    </span>
  );
};

const StatusBadge: React.FC<{ s: string }> = ({ s }) => {
  const key = (s || "").toLowerCase();
  const m =
    key === "acknowledged" ? { bg: "var(--green-soft)", fg: "var(--green)" } :
    key === "submitted"     ? { bg: "var(--blue-soft)",  fg: "var(--blue)" } :
    key === "validating"    ? { bg: "#FFF7E6",           fg: "#B8862A" } :
    key === "ready"         ? { bg: "var(--green-soft)", fg: "var(--green)" } :
    key === "failed"        ? { bg: "var(--red-soft)",   fg: "var(--red)" } :
                              { bg: "#F4F5F7",           fg: "var(--ink-3)" };
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-mono uppercase tracking-[0.1em]"
      style={{ background: m.bg, color: m.fg }}
    >
      {s}
    </span>
  );
};

const EmptyState: React.FC<{ label: string }> = ({ label }) => (
  <div className="px-5 py-10 text-center text-[12.5px] text-[var(--ink-3)]">
    No {label} yet — data appears here as activity is recorded.
  </div>
);

// ─── Live data hook ────────────────────────────────────────────────────
interface WorkspaceData {
  loading: boolean;
  // Fraud & AML
  txn7d: number;
  amlTotal: number;
  amlOpen: number;
  flagged: number;
  flaggedAmount: number;
  // Identity & Screening
  screened24h: number;
  sanctionsHits: number;
  pepMatches: number;
  uboComplete: number;
  uboTotal: number;
  owners: { owner_name: string; ownership_pct: number; screening_status: string }[];
  sanctions: { list_name: string; entity_details: any; match_score: number }[];
  // Returns
  returnTypes: number;
  filedReady: number;
  failed: number;
  processing: number;
  reports: { report_name: string; report_type: string | null; regulator: string | null; status: string; created_at: string }[];
}

const emptyData: WorkspaceData = {
  loading: true,
  txn7d: 0, amlTotal: 0, amlOpen: 0, flagged: 0, flaggedAmount: 0,
  screened24h: 0, sanctionsHits: 0, pepMatches: 0, uboComplete: 0, uboTotal: 0,
  owners: [], sanctions: [],
  returnTypes: 0, filedReady: 0, failed: 0, processing: 0, reports: [],
};

function useWorkspaceData(userId: string | undefined, institutionId: string | undefined) {
  const [data, setData] = useState<WorkspaceData>(emptyData);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      const inst = institutionId;
      const since7d = new Date(Date.now() - 7 * 864e5).toISOString();
      const since24h = new Date(Date.now() - 864e5).toISOString();

      const [txnRes, amlRes, flaggedRes, screenedRes, sancRes, pepRes, uboRes, typesRes, reportsRes] = await Promise.all([
        inst ? supabase.from("unified_transactions").select("id", { count: "exact", head: true }).eq("institution_id", inst).gte("transaction_date", since7d) : Promise.resolve({ count: 0 }),
        inst ? supabase.from("aml_alerts").select("id, status", { count: "exact" }).eq("institution_id", inst) : Promise.resolve({ data: [] as any, count: 0 }),
        inst ? supabase.from("unified_transactions").select("amount", { count: "exact" }).eq("institution_id", inst).eq("is_flagged", true) : Promise.resolve({ data: [] as any, count: 0 }),
        inst ? supabase.from("screening_results").select("id", { count: "exact", head: true }).eq("institution_id", inst).gte("search_date", since24h) : Promise.resolve({ count: 0 }),
        inst ? supabase.from("sanctions_screen_results").select("id, list_name, entity_details, match_score").eq("institution_id", inst).gte("match_score", 0.7) : Promise.resolve({ data: [] as any }),
        inst ? supabase.from("pep_screen_results").select("id", { count: "exact", head: true }).eq("institution_id", inst) : Promise.resolve({ count: 0 }),
        inst ? supabase.from("customer_beneficial_owners").select("owner_name, ownership_pct, screening_status").eq("user_id", userId) : Promise.resolve({ data: [] as any }),
        supabase.from("institution_report_types").select("id", { count: "exact", head: true }).eq("user_id", userId).eq("is_active", true),
        supabase.from("reports").select("report_name, report_type, regulator, status, created_at").eq("user_id", userId).order("created_at", { ascending: false }).limit(20),
      ]);

      if (cancelled) return;

      const amlRows = (amlRes as any)?.data || [];
      const uboRows = (uboRes as any)?.data || [];
      const sancRows = (sancRes as any)?.data || [];
      const flaggedRows = (flaggedRes as any)?.data || [];

      const flaggedAmount = flaggedRows.reduce((s: number, r: any) => s + (Number(r.amount) || 0), 0);
      const uboScored = uboRows.filter((o: any) => o.screening_status && o.screening_status !== "pending").length;

      setData({
        loading: false,
        txn7d: (txnRes as any)?.count || 0,
        amlTotal: (amlRes as any)?.count || 0,
        amlOpen: amlRows.filter((a: any) => a.status === "open" || a.status === "new").length,
        flagged: (flaggedRes as any)?.count || 0,
        flaggedAmount,
        screened24h: (screenedRes as any)?.count || 0,
        sanctionsHits: sancRows.length,
        pepMatches: (pepRes as any)?.count || 0,
        uboComplete: uboScored,
        uboTotal: uboRows.length,
        owners: uboRows,
        sanctions: sancRows,
        returnTypes: (typesRes as any)?.count || 0,
        filedReady: (reportsRes as any)?.data?.filter((r: any) => r.status === "ready").length || 0,
        failed: (reportsRes as any)?.data?.filter((r: any) => r.status === "failed").length || 0,
        processing: (reportsRes as any)?.data?.filter((r: any) => r.status === "processing").length || 0,
        reports: (reportsRes as any)?.data || [],
      });
    })();
    return () => { cancelled = true; };
  }, [userId, institutionId]);

  return data;
}

const fmtNaira = (n: number) => {
  if (n >= 1e9) return `₦${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `₦${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `₦${(n / 1e3).toFixed(0)}K`;
  return `₦${n}`;
};

// ─── Tab 1: Fraud & AML ────────────────────────────────────────────────
const trendData = [
  { d: "Mon", volume: 12400, anomaly: 14 },
  { d: "Tue", volume: 13800, anomaly: 18 },
  { d: "Wed", volume: 11200, anomaly: 9 },
  { d: "Thu", volume: 16200, anomaly: 27 },
  { d: "Fri", volume: 18800, anomaly: 22 },
  { d: "Sat", volume: 9200,  anomaly: 6 },
  { d: "Sun", volume: 7800,  anomaly: 4 },
];

const FraudView = ({ d }: { d: WorkspaceData }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPI label="Transactions (7d)" value={d.loading ? "…" : d.txn7d.toLocaleString()} delta={d.txn7d ? "live" : "no activity"} />
      <KPI label="AML alerts (open)" value={d.loading ? "…" : `${d.amlOpen}`} delta={d.amlTotal ? `${d.amlTotal} total` : "none"} tone={d.amlOpen ? "negative" : "neutral"} />
      <KPI label="Flagged txns" value={d.loading ? "…" : `${d.flagged}`} delta={d.flagged ? "review queue" : "clear"} tone={d.flagged ? "negative" : "positive"} />
      <KPI label="Flagged value" value={d.loading ? "…" : fmtNaira(d.flaggedAmount)} delta={d.flaggedAmount ? "under review" : "—"} />
    </div>

    <Card>
      <SectionTitle right={<span className="text-[11px] font-mono text-[var(--ink-3)]">Illustrative · last 7 days</span>}>
        Transaction volume vs anomalous activity
      </SectionTitle>
      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <ComposedChart data={trendData} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EEF0F3" />
            <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ fontSize: 12, border: "1px solid #E5E5E5", borderRadius: 6, padding: "6px 8px" }}
              cursor={{ fill: "rgba(0,0,0,0.03)" }}
            />
            <Area yAxisId="left"  type="monotone" dataKey="volume"  stroke="#0052CC" fill="#DEEBFF" strokeWidth={2} />
            <Bar  yAxisId="right" dataKey="anomaly" fill="#172B4D" radius={[2, 2, 0, 0]} barSize={14} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>

    <Card>
      <SectionTitle>Live signals</SectionTitle>
      {d.loading ? (
        <div className="py-10 flex justify-center"><Loader2 className="animate-spin" size={22} /></div>
      ) : d.amlTotal === 0 && d.flagged === 0 ? (
        <EmptyState label="AML alerts or flagged transactions" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[13px]">
          <div><span className="font-mono text-[20px] text-[var(--navy)]">{d.amlTotal}</span><p className="text-[var(--ink-3)]">AML alerts</p></div>
          <div><span className="font-mono text-[20px] text-[var(--navy)]">{d.amlOpen}</span><p className="text-[var(--ink-3)]">open</p></div>
          <div><span className="font-mono text-[20px] text-[var(--navy)]">{d.flagged}</span><p className="text-[var(--ink-3)]">flagged txns</p></div>
          <div><span className="font-mono text-[20px] text-[var(--navy)]">{fmtNaira(d.flaggedAmount)}</span><p className="text-[var(--ink-3)]">flagged value</p></div>
        </div>
      )}
    </Card>
  </div>
);

// ─── Tab 2: Identity & Screening ───────────────────────────────────────
const IdentityView = ({ d }: { d: WorkspaceData }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPI label="Customers screened (24h)" value={d.loading ? "…" : `${d.screened24h}`} delta={d.screened24h ? "live" : "none today"} />
      <KPI label="Sanctions hits" value={d.loading ? "…" : `${d.sanctionsHits}`} delta={d.sanctionsHits ? "review" : "clear"} tone={d.sanctionsHits ? "negative" : "positive"} />
      <KPI label="PEP matches" value={d.loading ? "…" : `${d.pepMatches}`} delta={d.pepMatches ? "pending review" : "none"} />
      <KPI
        label="UBO completeness"
        value={d.loading ? "…" : d.uboTotal ? `${Math.round((d.uboComplete / d.uboTotal) * 100)}%` : "—"}
        delta={d.uboTotal ? `${d.uboComplete}/${d.uboTotal} scored` : "no owners"}
      />
    </div>

    <Card className="!p-0">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-[14px] font-semibold text-[var(--navy)]">Beneficial owners</h3>
        <p className="text-[11.5px] text-[var(--ink-3)] mt-1">Reconciled against CAC via cac-lookup.</p>
      </div>
      {d.loading ? (
        <div className="py-10 flex justify-center"><Loader2 className="animate-spin" size={22} /></div>
      ) : d.owners.length === 0 ? (
        <EmptyState label="beneficial owners" />
      ) : (
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] border-t border-[var(--line)]">
              <th className="px-5 py-2.5 font-normal">Owner</th>
              <th className="px-5 py-2.5 font-normal">Stake</th>
              <th className="px-5 py-2.5 font-normal text-right">CAC status</th>
            </tr>
          </thead>
          <tbody>
            {d.owners.map((o, i) => (
              <tr key={i} className="border-t border-[var(--line)]">
                <td className="px-5 py-3 text-[var(--navy)]">{o.owner_name}</td>
                <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{o.ownership_pct}%</td>
                <td className="px-5 py-3 text-right"><Pill status={o.screening_status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>

    <Card className="!p-0">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-[14px] font-semibold text-[var(--navy)]">Sanctions verification board</h3>
        <p className="text-[11.5px] text-[var(--ink-3)] mt-1">Cross-checked against UN, OFAC, EU, UK HMT, CBN watchlists.</p>
      </div>
      {d.loading ? (
        <div className="py-10 flex justify-center"><Loader2 className="animate-spin" size={22} /></div>
      ) : d.sanctions.length === 0 ? (
        <EmptyState label="sanctions matches" />
      ) : (
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] border-t border-[var(--line)]">
              <th className="px-5 py-2.5 font-normal">List</th>
              <th className="px-5 py-2.5 font-normal">Entity</th>
              <th className="px-5 py-2.5 font-normal text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {d.sanctions.map((s, i) => (
              <tr key={i} className="border-t border-[var(--line)]">
                <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{s.list_name}</td>
                <td className="px-5 py-3 text-[var(--navy)]">{s.entity_details?.matched_name || "—"}</td>
                <td className="px-5 py-3 font-mono text-right" style={{ color: "var(--red)" }}>{s.match_score?.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  </div>
);

// ─── Tab 3: Regulatory Returns ─────────────────────────────────────────
const ReturnsView = ({ d }: { d: WorkspaceData }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPI label="Return types" value={d.loading ? "…" : `${d.returnTypes}`} delta="configured" />
      <KPI label="Filed (ready)" value={d.loading ? "…" : `${d.filedReady}`} delta="ready to submit" tone="positive" />
      <KPI label="Processing" value={d.loading ? "…" : `${d.processing}`} delta="running" />
      <KPI label="Failed" value={d.loading ? "…" : `${d.failed}`} delta={d.failed ? "need attention" : "none"} tone={d.failed ? "negative" : "neutral"} />
    </div>

    <Card className="!p-0">
      <div className="px-5 pt-5 pb-3 flex items-baseline justify-between">
        <h3 className="text-[14px] font-semibold text-[var(--navy)]">Recent reports</h3>
        <span className="text-[11px] font-mono text-[var(--ink-3)]">{d.reports.length}</span>
      </div>
      {d.loading ? (
        <div className="py-10 flex justify-center"><Loader2 className="animate-spin" size={22} /></div>
      ) : d.reports.length === 0 ? (
        <EmptyState label="reports" />
      ) : (
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] border-t border-[var(--line)]">
              <th className="px-5 py-2.5 font-normal">Report</th>
              <th className="px-5 py-2.5 font-normal">Regulator</th>
              <th className="px-5 py-2.5 font-normal">Created</th>
              <th className="px-5 py-2.5 font-normal text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {d.reports.map((r, i) => (
              <tr key={i} className="border-t border-[var(--line)]">
                <td className="px-5 py-3 text-[var(--navy)]">{r.report_name}</td>
                <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{r.regulator || r.report_type || "—"}</td>
                <td className="px-5 py-3 text-[var(--ink-2)]">{new Date(r.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</td>
                <td className="px-5 py-3 text-right"><StatusBadge s={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  </div>
);

// ─── Workspace shell ───────────────────────────────────────────────────
export default function DashboardWorkspace() {
  const [tab, setTab] = useState<TabId>("fraud");
  const { user } = useAuth();
  const { userName } = useProfile();
  const [institutionId, setInstitutionId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    // Resolve the user's institution, preferring an active institution record
    // (guards against dangling institution_users rows pointing at deleted orgs).
    supabase
      .from("institution_users")
      .select("institution_id, institutions(status)")
      .eq("user_id", user.id)
      .limit(1)
      .then(({ data }) => {
        const row = (data as any[])?.[0];
        setInstitutionId(row?.institution_id || undefined);
      });
  }, [user?.id]);

  const d = useWorkspaceData(user?.id, institutionId);

  // Lightweight presence ping
  useEffect(() => { void supabase.auth.getUser(); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white border-b border-[var(--line)]">
        <div className="px-6 h-14 flex items-end justify-between">
          <nav className="flex items-center gap-6 h-full">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative h-full text-[13.5px] font-medium tracking-tight transition-colors"
                  style={{ color: active ? "var(--navy)" : "var(--ink-3)" }}
                >
                  {t.label}
                  {active && (
                    <span className="absolute left-0 right-0 -bottom-px h-[2px]" style={{ background: "var(--blue)" }} />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)]">
            {userName ? `Officer · ${userName}` : "Workspace"}
          </div>
        </div>
      </header>

      <div className="flex-1 px-6 py-6 bg-[#FAFBFC]">
        <div className="max-w-[1100px] mx-auto">
          {tab === "fraud"    && <FraudView d={d} />}
          {tab === "identity" && <IdentityView d={d} />}
          {tab === "returns"  && <ReturnsView d={d} />}
        </div>
      </div>
    </div>
  );
}
