import { useEffect, useState, useCallback } from "react";
import { ShieldAlert, RefreshCw, Loader2, Power, PowerOff } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminCheck } from "@/hooks/useAdminCheck";

type Tab = "rules" | "alerts";

interface Rule {
  id: string;
  rule_code: string;
  category: string;
  regulator: string | null;
  title: string;
  description: string;
  severity: string;
  threshold: Record<string, unknown>;
  citation: string | null;
  enabled: boolean;
}

interface Alert {
  id: string;
  transaction_id: string | null;
  customer_id: string | null;
  case_id: string | null;
  rule_code: string;
  rule_title: string;
  category: string;
  severity: string;
  score: number;
  evidence: Record<string, unknown>;
  status: string;
  created_at: string;
}

const sevColor = (s: string) => {
  const k = (s || "").toLowerCase();
  if (k === "critical") return { bg: "#FEE2E2", fg: "#991B1B" };
  if (k === "high") return { bg: "#FED7AA", fg: "#9A3412" };
  if (k === "medium") return { bg: "#FEF3C7", fg: "#92400E" };
  return { bg: "#E0E7FF", fg: "#3730A3" };
};

const statusColor = (s: string) => {
  if (s === "closed" || s === "dismissed") return { bg: "#D1FAE5", fg: "#065F46" };
  if (s === "escalated") return { bg: "#FEE2E2", fg: "#991B1B" };
  if (s === "reviewing") return { bg: "#DBEAFE", fg: "#1E40AF" };
  return { bg: "#F5F5F0", fg: "#525252" };
};

const ALERT_STATUSES = ["open", "reviewing", "escalated", "dismissed", "closed"];

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleString("en-NG", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";

const fmtThreshold = (t: Record<string, unknown>) =>
  Object.entries(t || {})
    .map(([k, v]) => `${k}=${typeof v === "number" ? v.toLocaleString("en-NG") : String(v)}`)
    .join(", ");

export default function AmlRules() {
  const { user } = useAuth();
  const { isAdmin } = useAdminCheck();
  const [tab, setTab] = useState<Tab>("rules");
  const [rules, setRules] = useState<Rule[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescanning, setRescanning] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rulesRes, alertsRes] = await Promise.all([
        supabase.from("transaction_rules").select("*").order("category").order("rule_code"),
        supabase
          .from("transaction_alerts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200),
      ]);
      if (rulesRes.error) throw rulesRes.error;
      if (alertsRes.error) throw alertsRes.error;
      setRules((rulesRes.data as Rule[]) || []);
      setAlerts((alertsRes.data as Alert[]) || []);
    } catch (e) {
      console.error("Failed to load AML rules/alerts:", e);
      toast.error(e instanceof Error ? e.message : "Failed to load rules");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRule = async (rule: Rule) => {
    setSavingId(rule.id);
    try {
      const { error } = await supabase
        .from("transaction_rules")
        .update({ enabled: !rule.enabled })
        .eq("id", rule.id);
      if (error) throw error;
      setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)));
      toast.success(`${rule.rule_code} ${!rule.enabled ? "enabled" : "disabled"}`);
    } catch (e) {
      console.error("Failed to toggle rule:", e);
      toast.error(e instanceof Error ? e.message : "Failed to update rule");
    } finally {
      setSavingId(null);
    }
  };

  const updateAlertStatus = async (alert: Alert, status: string) => {
    try {
      const { error } = await supabase
        .from("transaction_alerts")
        .update({ status })
        .eq("id", alert.id);
      if (error) throw error;
      setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, status } : a)));
    } catch (e) {
      console.error("Failed to update alert status:", e);
      toast.error(e instanceof Error ? e.message : "Failed to update alert");
    }
  };

  const rescan = async () => {
    if (!user) return;
    setRescanning(true);
    try {
      const { data, error } = await supabase.rpc("fn_rescan_transactions", {
        p_user_id: user.id,
        p_limit: 1000,
      });
      if (error) throw error;
      toast.success(`Re-scanned ${data ?? 0} transactions`);
      await load();
    } catch (e) {
      console.error("Failed to rescan transactions:", e);
      toast.error(e instanceof Error ? e.message : "Rescan failed");
    } finally {
      setRescanning(false);
    }
  };

  return (
    <div className="p-6 md:p-8" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-ink text-[var(--paper)] flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={18} strokeWidth={1.7} />
          </div>
          <div>
            <h1 className="font-serif text-2xl text-ink">Transaction Rules Engine</h1>
            <p className="text-[13px] text-ink-muted mt-0.5">
              Server-side AML/fraud monitoring rules. Alerts and critical cases are generated automatically on ingest.
            </p>
          </div>
        </div>
        <button
          onClick={rescan}
          disabled={rescanning}
          className="flex items-center gap-2 px-3.5 py-2 rounded-md text-[13px] bg-ink text-[var(--paper)] hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {rescanning ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Re-scan transactions
        </button>
      </div>

      <div className="flex gap-1 mb-5 border-b border-ink-10">
        {(["rules", "alerts"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-[13px] capitalize border-b-2 -mb-px transition-colors ${
              tab === t ? "border-[var(--rust)] text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {t === "rules" ? `Rules (${rules.length})` : `Alerts (${alerts.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-ink-muted text-[13px] py-12 justify-center">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      ) : tab === "rules" ? (
        <div className="overflow-x-auto rounded-lg border border-ink-10">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-ink-muted border-b border-ink-10 bg-[var(--paper-2)]/50">
                <th className="px-4 py-2.5 font-medium">Rule</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Severity</th>
                <th className="px-4 py-2.5 font-medium">Threshold</th>
                <th className="px-4 py-2.5 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((r) => {
                const sc = sevColor(r.severity);
                return (
                  <tr key={r.id} className="border-b border-ink-10 last:border-0 align-top">
                    <td className="px-4 py-3">
                      <div className="text-ink font-medium">{r.title}</div>
                      <div className="font-mono text-[11px] text-ink-muted">{r.rule_code}</div>
                      <div className="text-[12px] text-ink-muted mt-1 max-w-md">{r.description}</div>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{r.category}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{ background: sc.bg, color: sc.fg }}
                      >
                        {r.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-ink-muted max-w-[220px] break-words">
                      {fmtThreshold(r.threshold)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => toggleRule(r)}
                        disabled={!isAdmin || savingId === r.id}
                        title={isAdmin ? "" : "Admin only"}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] transition-colors ${
                          r.enabled ? "text-emerald-700 bg-emerald-50" : "text-ink-muted bg-[var(--paper-2)]"
                        } disabled:opacity-60`}
                      >
                        {savingId === r.id ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : r.enabled ? (
                          <Power size={12} />
                        ) : (
                          <PowerOff size={12} />
                        )}
                        {r.enabled ? "Enabled" : "Disabled"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {rules.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    No rules configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-ink-10">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-ink-muted border-b border-ink-10 bg-[var(--paper-2)]/50">
                <th className="px-4 py-2.5 font-medium">Alert</th>
                <th className="px-4 py-2.5 font-medium">Severity</th>
                <th className="px-4 py-2.5 font-medium">Score</th>
                <th className="px-4 py-2.5 font-medium">Evidence</th>
                <th className="px-4 py-2.5 font-medium">Raised</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((a) => {
                const sc = sevColor(a.severity);
                const stc = statusColor(a.status);
                return (
                  <tr key={a.id} className="border-b border-ink-10 last:border-0 align-top">
                    <td className="px-4 py-3">
                      <div className="text-ink font-medium">{a.rule_title}</div>
                      <div className="font-mono text-[11px] text-ink-muted">{a.rule_code}</div>
                      {a.case_id && (
                        <div className="text-[11px] text-[var(--rust)] mt-0.5">Linked to case</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={{ background: sc.bg, color: sc.fg }}
                      >
                        {a.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{a.score}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-ink-muted max-w-[220px] break-words">
                      {fmtThreshold(a.evidence)}
                    </td>
                    <td className="px-4 py-3 text-ink-muted whitespace-nowrap">{fmtDate(a.created_at)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={a.status}
                        onChange={(e) => updateAlertStatus(a, e.target.value)}
                        className="text-[12px] rounded-md px-2 py-1 border border-ink-10 bg-[var(--paper)]"
                        style={{ color: stc.fg }}
                      >
                        {ALERT_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    No alerts yet. Ingest transactions or run a re-scan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
