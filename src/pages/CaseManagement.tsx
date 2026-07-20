import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, Plus, X, AlertTriangle, CheckCircle2, Clock, Loader2, UserCircle2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Enterprise Case Management (ECM) workbench — CBN Baseline Standards Art. 8.
// Automates creation, assignment, prioritisation, and tracking of cases arising
// from AML/CFT/CPF alerts, with a full audit trail (case_status_history).

type CaseStatus = "open" | "investigating" | "escalated" | "closed";
type CaseSeverity = "low" | "medium" | "high" | "critical";

interface CaseRow {
  id: string;
  title: string;
  summary: string | null;
  severity: CaseSeverity;
  status: CaseStatus;
  sla_due_at: string | null;
  assignee_id: string | null;
  customer_id: string | null;
  trigger_kind: string | null;
  opened_at: string;
  closed_at: string | null;
  close_reason: string | null;
  created_at: string;
}

const STATUSES: CaseStatus[] = ["open", "investigating", "escalated", "closed"];
const SEVERITIES: CaseSeverity[] = ["low", "medium", "high", "critical"];

const sevColor = (s: string) => {
  const k = s.toLowerCase();
  if (k === "critical") return { bg: "#FEE2E2", fg: "#991B1B", border: "#FCA5A5" };
  if (k === "high") return { bg: "#FED7AA", fg: "#9A3412", border: "#FDBA74" };
  if (k === "medium") return { bg: "#FEF3C7", fg: "#92400E", border: "#FDE68A" };
  return { bg: "#E0E7FF", fg: "#3730A3", border: "#C7D2FE" };
};

const statusColor = (s: string) => {
  if (s === "closed") return { bg: "#D1FAE5", fg: "#065F46" };
  if (s === "escalated") return { bg: "#FEE2E2", fg: "#991B1B" };
  if (s === "investigating") return { bg: "#DBEAFE", fg: "#1E40AF" };
  return { bg: "#F5F5F0", fg: "#525252" };
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtDateTime = (d?: string | null) =>
  d ? new Date(d).toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }) : "—";

export default function CaseManagement() {
  const { user } = useAuth();
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");
  const [selected, setSelected] = useState<CaseRow | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("cases")
      .select("*")
      .eq("user_id", user.id)
      .order("opened_at", { ascending: false })
      .limit(300);
    if (error) {
      toast.error(error.message);
      setCases([]);
    } else {
      setCases((data as unknown as CaseRow[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { if (user) load(); }, [user?.id]);

  const setStatus = async (id: string, status: CaseStatus, note?: string) => {
    const patch: any = { status, updated_at: new Date().toISOString() };
    if (status === "closed") {
      patch.closed_at = new Date().toISOString();
      patch.close_reason = note || null;
    }
    const { error } = await supabase.from("cases").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    // Record the transition in the immutable status-history ledger.
    await supabase.from("case_status_history").insert({
      case_id: id,
      from_status: selected?.status ?? null,
      to_status: status,
      changed_by: user?.id ?? null,
      note: note || null,
    });
    toast.success(`Case ${status.replace("_", " ")}`);
    await load();
    setSelected(null);
  };

  const assign = async (id: string, assignee_id: string | null) => {
    const { error } = await supabase.from("cases").update({ assignee_id, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(assignee_id ? "Case assigned" : "Assignment cleared");
    await load();
  };

  const stats = useMemo(() => ({
    open: cases.filter((c) => c.status === "open").length,
    investigating: cases.filter((c) => c.status === "investigating").length,
    escalated: cases.filter((c) => c.status === "escalated").length,
    closed: cases.filter((c) => c.status === "closed").length,
    overdue: cases.filter((c) => c.status !== "closed" && c.sla_due_at && new Date(c.sla_due_at) < new Date()).length,
  }), [cases]);

  const filtered = statusFilter === "all" ? cases : cases.filter((c) => c.status === statusFilter);

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#0A0A0A", margin: 0, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 10 }}>
            <FolderKanban size={22} strokeWidth={2} /> Case Management
          </h1>
          <p style={{ fontSize: 13, color: "#6B6B6B", margin: "6px 0 0" }}>
            CBN Baseline Standards Art. 8 — assign, prioritise, and track every case from AML/CFT/CPF alerts with a full audit trail.
          </p>
        </div>
        {!showAdd && (
          <button onClick={() => setShowAdd(true)}
            style={{ padding: "10px 18px", borderRadius: 8, background: "#0A0A0A", color: "#FFFFFF", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> New Case
          </button>
        )}
      </div>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 22 }}>
        {[
          { label: "Open", value: stats.open, accent: "#0A0A0A" },
          { label: "Investigating", value: stats.investigating, accent: "#1E40AF" },
          { label: "Escalated", value: stats.escalated, accent: "#991B1B" },
          { label: "Overdue SLA", value: stats.overdue, accent: stats.overdue > 0 ? "#B91C1C" : "#0A0A0A" },
          { label: "Closed", value: stats.closed, accent: "#16A34A" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", padding: 18 }}>
            <p style={{ fontSize: 28, fontWeight: 800, color: s.accent, margin: "0 0 4px", letterSpacing: "-1px" }}>{s.value}</p>
            <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div style={{ display: "inline-flex", gap: 4, padding: 4, background: "#EFEFEA", borderRadius: 10, marginBottom: 18 }}>
        {(["all", ...STATUSES] as const).map((s) => {
          const active = statusFilter === s;
          return (
            <button key={s} onClick={() => setStatusFilter(s as CaseStatus | "all")}
              style={{ padding: "8px 16px", borderRadius: 7, border: "none", fontSize: 13, fontWeight: active ? 600 : 500, color: active ? "#0A0A0A" : "#6B6B6B", background: active ? "#FFFFFF" : "transparent", boxShadow: active ? "0 1px 4px rgba(0,0,0,0.10)" : "none", cursor: "pointer", textTransform: "capitalize" }}>
              {s === "all" ? "All Cases" : s.replace("_", " ")}
            </button>
          );
        })}
      </div>

      {showAdd && <AddCaseForm onCancel={() => setShowAdd(false)} onSaved={async () => { await load(); setShowAdd(false); }} userId={user!.id} />}

      <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center" }}><Loader2 size={20} className="animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <FolderKanban size={28} color="#9B9B9B" style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 14, color: "#6B6B6B", margin: 0 }}>No cases yet. Open one from a flagged alert or create manually.</p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#FAFAF7", textAlign: "left" }}>
                {["Case", "Severity", "Assignee", "SLA", "Status", ""].map((h) => (
                  <th key={h} style={{ padding: "12px 14px", fontSize: 11, fontWeight: 600, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const sc = sevColor(c.severity);
                const stc = statusColor(c.status);
                const overdue = c.status !== "closed" && c.sla_due_at && new Date(c.sla_due_at) < new Date();
                return (
                  <tr key={c.id} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "14px", maxWidth: 320 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{c.title}</p>
                      <p style={{ fontSize: 11, color: "#9B9B9B", margin: "2px 0 0" }}>{c.trigger_kind || "manual"} · opened {fmtDate(c.opened_at)}</p>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: sc.bg, color: sc.fg, textTransform: "capitalize" }}>{c.severity}</span>
                    </td>
                    <td style={{ padding: "14px", color: "#525252", fontSize: 12 }}>
                      {c.assignee_id ? <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><UserCircle2 size={14} /> {c.assignee_id.slice(0, 8)}</span> : <span style={{ color: "#9B9B9B" }}>Unassigned</span>}
                    </td>
                    <td style={{ padding: "14px", color: overdue ? "#B91C1C" : "#525252", fontSize: 12, fontWeight: overdue ? 700 : 400 }}>
                      {c.sla_due_at ? (overdue ? <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} /> {fmtDate(c.sla_due_at)}</span> : fmtDate(c.sla_due_at)) : "—"}
                    </td>
                    <td style={{ padding: "14px" }}>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: stc.bg, color: stc.fg, textTransform: "capitalize" }}>{c.status.replace("_", " ")}</span>
                    </td>
                    <td style={{ padding: "14px" }}>
                      <button onClick={() => setSelected(c)} style={{ background: "none", border: "none", color: "#0A0A0A", fontSize: 12, fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}>Open</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <DetailModal
            caseRow={selected}
            onClose={() => setSelected(null)}
            onStatus={setStatus}
            onAssign={assign}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddCaseForm({ onCancel, onSaved, userId }: { onCancel: () => void; onSaved: () => void; userId: string }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [severity, setSeverity] = useState<CaseSeverity>("medium");
  const [triggerKind, setTriggerKind] = useState("manual");
  const [slaDays, setSlaDays] = useState("7");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim()) { toast.error("Case title is required"); return; }
    setSaving(true);
    const sla = parseInt(slaDays, 10);
    const { error } = await (supabase as any).from("cases").insert({
      user_id: userId,
      title: title.trim(),
      summary: summary.trim() || null,
      severity,
      status: "open",
      trigger_kind: triggerKind,
      sla_due_at: isNaN(sla) ? null : new Date(Date.now() + sla * 86400000).toISOString(),
      opened_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Case created");
    onSaved();
  };

  const label: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };
  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 13.5, fontFamily: "inherit" };

  return (
    <div style={{ background: "#FFFFFF", borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", padding: 32, marginBottom: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ gridColumn: "span 2" }}><label style={label}>Title *</label><input style={input} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Structuring pattern — Acct 0123" /></div>
        <div style={{ gridColumn: "span 2" }}><label style={label}>Summary</label><textarea style={{ ...input, minHeight: 70, resize: "vertical" }} value={summary} onChange={(e) => setSummary(e.target.value)} /></div>
        <div><label style={label}>Severity</label>
          <select style={input} value={severity} onChange={(e) => setSeverity(e.target.value as CaseSeverity)}>{SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
        <div><label style={label}>Trigger</label>
          <select style={input} value={triggerKind} onChange={(e) => setTriggerKind(e.target.value)}>
            {["manual", "alert", "screening", "transaction", "audit"].map((t) => <option key={t} value={t}>{t}</option>)}
          </select></div>
        <div><label style={label}>SLA (days from today)</label><input style={input} type="number" min={0} value={slaDays} onChange={(e) => setSlaDays(e.target.value)} /></div>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
        <button onClick={onCancel} style={{ padding: "10px 18px", borderRadius: 8, background: "#FFFFFF", color: "#0A0A0A", border: "1px solid rgba(0,0,0,0.12)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
        <button onClick={submit} disabled={saving} style={{ padding: "10px 22px", borderRadius: 8, background: "#0A0A0A", color: "#FFFFFF", border: "none", fontSize: 13, fontWeight: 600, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1 }}>{saving ? "Saving…" : "Create Case"}</button>
      </div>
    </div>
  );
}

function DetailModal({ caseRow, onClose, onStatus, onAssign }: {
  caseRow: CaseRow;
  onClose: () => void;
  onStatus: (id: string, status: CaseStatus, note?: string) => void;
  onAssign: (id: string, assignee_id: string | null) => void;
}) {
  const [assignee, setAssignee] = useState(caseRow.assignee_id || "");
  const [note, setNote] = useState("");

  const sc = sevColor(caseRow.severity);
  const overdue = caseRow.status !== "closed" && caseRow.sla_due_at && new Date(caseRow.sla_due_at) < new Date();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={(e) => e.stopPropagation()}
        style={{ background: "#FFFFFF", borderRadius: 14, maxWidth: 640, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: sc.bg, color: sc.fg, textTransform: "capitalize" }}>{caseRow.severity}</span>
              <span style={{ fontSize: 11, color: "#9B9B9B" }}>{caseRow.trigger_kind}</span>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>{caseRow.title}</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={18} /></button>
        </div>
        <div style={{ padding: 28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 18 }}>
            <Field label="Opened" value={fmtDateTime(caseRow.opened_at)} />
            <Field label="SLA Due" value={caseRow.sla_due_at ? fmtDateTime(caseRow.sla_due_at) : "—"} warning={!!overdue} />
            <Field label="Status" value={caseRow.status.replace("_", " ")} />
            <Field label="Closed" value={caseRow.closed_at ? fmtDateTime(caseRow.closed_at) : "—"} />
          </div>
          {caseRow.summary && <div style={{ marginBottom: 18 }}><Field label="Summary" value={caseRow.summary} /></div>}
          {caseRow.close_reason && <div style={{ marginBottom: 18 }}><Field label="Close Reason" value={caseRow.close_reason} /></div>}

          <label style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Assignee (user id)</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            <input value={assignee} onChange={(e) => setAssignee(e.target.value)} placeholder="Paste assignee user UUID…"
              style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 13 }} />
            <button onClick={() => onAssign(caseRow.id, assignee.trim() || null)} style={{ padding: "8px 14px", borderRadius: 8, background: "#F5F5F0", color: "#0A0A0A", border: "1px solid rgba(0,0,0,0.08)", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>Assign</button>
          </div>

          <label style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Transition Note (optional)</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason for status change…"
            style={{ width: "100%", minHeight: 70, padding: "10px 12px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", fontSize: 13.5, resize: "vertical", marginBottom: 16 }} />

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {STATUSES.filter((s) => s !== caseRow.status).map((s) => (
              <button key={s} onClick={() => onStatus(caseRow.id, s, note.trim() || undefined)} style={{
                padding: "8px 14px", borderRadius: 8,
                background: s === "closed" ? "#0A0A0A" : "#FFFFFF",
                color: s === "closed" ? "#FFFFFF" : "#0A0A0A",
                border: "1px solid rgba(0,0,0,0.12)", fontSize: 12.5, fontWeight: 600, cursor: "pointer", textTransform: "capitalize",
              }}>Mark {s.replace("_", " ")}</button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Field({ label, value, warning }: { label: string; value: string | null | undefined; warning?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: 10.5, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 13.5, color: warning ? "#B91C1C" : "#0A0A0A", margin: 0, lineHeight: 1.55 }}>{value || "—"}</p>
    </div>
  );
}
