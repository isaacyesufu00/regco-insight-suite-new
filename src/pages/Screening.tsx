import { useEffect, useMemo, useState } from "react";
import { Shield, Search, Upload, History, Loader2, Download, AlertTriangle, CheckCircle2, RefreshCw, Database } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type Tab = "quick" | "batch" | "history" | "status";

interface SanctionsMatch {
  id: string;
  full_name: string;
  list_name: string;
  list_type: string;
  reason?: string | null;
}
interface PepMatch {
  id: string;
  full_name: string;
  position: string | null;
  country: string | null;
  category: string | null;
  status: string | null;
}
interface ScreeningResult {
  risk_level: "none" | "low" | "medium" | "high" | "critical";
  sanctions_matches: SanctionsMatch[];
  pep_matches: PepMatch[];
  total_matches: number;
  screened_at: string;
}
interface BatchRow {
  name: string;
  bvn?: string;
  status: "pending" | "screening" | "done" | "error";
  risk?: string;
  matches?: number;
}
interface HistoryRow {
  id: string;
  search_name: string;
  search_bvn: string | null;
  highest_risk: string;
  matches_found: number;
  action_taken: string | null;
  search_date: string;
}

const LISTS_CHECKED = [
  "UN Security Council",
  "OFAC SDN",
  "EU Consolidated",
  "UK HM Treasury",
  "Nigerian PEP Database",
];

const riskColor = (r: string) => {
  switch (r) {
    case "critical": return { bg: "#FEE2E2", fg: "#991B1B", border: "#FCA5A5" };
    case "high": return { bg: "#FEF3C7", fg: "#9A3412", border: "#FDBA74" };
    case "medium": return { bg: "#FEF9C3", fg: "#854D0E", border: "#FDE68A" };
    case "low": return { bg: "#DBEAFE", fg: "#1E40AF", border: "#93C5FD" };
    default: return { bg: "#DCFCE7", fg: "#166534", border: "#86EFAC" };
  }
};

const riskLabel = (r: string) => {
  if (r === "none") return "CLEAR ✓";
  if (r === "critical") return "⛔ CRITICAL";
  if (r === "high") return "🔴 HIGH RISK";
  if (r === "medium") return "🟡 REVIEW";
  return r.toUpperCase();
};

export default function Screening() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("quick");

  // --- Quick screen ---
  const [screenName, setScreenName] = useState("");
  const [screenBvn, setScreenBvn] = useState("");
  const [screening, setScreening] = useState(false);
  const [screeningResult, setScreeningResult] = useState<ScreeningResult | null>(null);
  const [lastScreeningId, setLastScreeningId] = useState<string | null>(null);

  // --- Batch screen ---
  const [batchRows, setBatchRows] = useState<BatchRow[]>([]);
  const [batchRunning, setBatchRunning] = useState(false);

  // --- History ---
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [historySearch, setHistorySearch] = useState("");
  const [historyRiskFilter, setHistoryRiskFilter] = useState("");

  const loadHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("screening_results")
      .select("id, search_name, search_bvn, highest_risk, matches_found, action_taken, search_date")
      .eq("user_id", user.id)
      .order("search_date", { ascending: false })
      .limit(200);
    setHistory((data as HistoryRow[]) || []);
  };

  useEffect(() => { if (tab === "history") loadHistory(); }, [tab, user]);

  const runScreen = async (name: string, bvn: string): Promise<ScreeningResult | null> => {
    const { data, error } = await supabase.functions.invoke("screen-customer", {
      body: { name, bvn: bvn || null },
    });
    if (error) {
      toast.error(error.message || "Screening failed");
      return null;
    }
    return data as ScreeningResult;
  };

  const handleQuickScreen = async () => {
    if (!screenName.trim()) { toast.error("Enter a name to screen"); return; }
    setScreening(true);
    setScreeningResult(null);
    setLastScreeningId(null);
    const result = await runScreen(screenName.trim(), screenBvn.trim());
    if (result) {
      setScreeningResult(result);
      // grab the newly-inserted record id for action_taken updates
      const { data: row } = await supabase
        .from("screening_results")
        .select("id")
        .eq("user_id", user!.id)
        .eq("search_name", screenName.trim())
        .order("search_date", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (row) setLastScreeningId(row.id);
      toast.success(`Screening complete — ${result.total_matches} match${result.total_matches !== 1 ? "es" : ""}`);
    }
    setScreening(false);
  };

  const saveScreeningAction = async (action: "cleared" | "escalated" | "filed_str") => {
    if (!lastScreeningId) return;
    const { error } = await supabase
      .from("screening_results")
      .update({ action_taken: action })
      .eq("id", lastScreeningId);
    if (error) { toast.error(error.message); return; }
    toast.success(action === "cleared" ? "Marked as cleared" : "Escalated for STR filing");
  };

  // --- Batch CSV upload ---
  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = String(ev.target?.result || "");
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      const rows: BatchRow[] = [];
      // Detect header
      const start = /name/i.test(lines[0] || "") ? 1 : 0;
      for (let i = start; i < lines.length; i++) {
        const parts = lines[i].split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
        const name = parts[0];
        const bvn = parts[1];
        if (name) rows.push({ name, bvn, status: "pending" });
      }
      setBatchRows(rows);
      toast.success(`Loaded ${rows.length} rows`);
    };
    reader.readAsText(file);
  };

  const runBatch = async () => {
    if (batchRows.length === 0) return;
    setBatchRunning(true);
    const updated = [...batchRows];
    for (let i = 0; i < updated.length; i++) {
      updated[i] = { ...updated[i], status: "screening" };
      setBatchRows([...updated]);
      const r = await runScreen(updated[i].name, updated[i].bvn || "");
      if (r) {
        updated[i] = { ...updated[i], status: "done", risk: r.risk_level, matches: r.total_matches };
      } else {
        updated[i] = { ...updated[i], status: "error" };
      }
      setBatchRows([...updated]);
    }
    setBatchRunning(false);
    toast.success("Batch screening complete");
  };

  const exportBatchCsv = () => {
    const header = "Name,BVN,Risk Level,Matches\n";
    const body = batchRows.map((r) => `"${r.name}","${r.bvn || ""}","${r.risk || ""}","${r.matches ?? ""}"`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `screening-batch-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredHistory = useMemo(() => {
    return history.filter((h) => {
      if (historyRiskFilter && h.highest_risk !== historyRiskFilter) return false;
      if (historySearch && !h.search_name.toLowerCase().includes(historySearch.toLowerCase())) return false;
      return true;
    });
  }, [history, historySearch, historyRiskFilter]);

  // --- Styles ---
  const cardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1px solid rgba(0,0,0,0.07)",
    borderRadius: 12,
    padding: 24,
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", height: 44, borderRadius: 8,
    border: "1px solid rgba(0,0,0,0.12)", background: "#F5F5F0",
    padding: "0 14px", fontSize: 14, outline: "none", boxSizing: "border-box",
  };
  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: "10px 16px",
    fontSize: 13,
    fontWeight: 600,
    background: active ? "#0A0A0A" : "transparent",
    color: active ? "#FFFFFF" : "#6B6B6B",
    border: "1px solid " + (active ? "#0A0A0A" : "rgba(0,0,0,0.12)"),
    borderRadius: 8,
    cursor: "pointer",
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Shield size={22} strokeWidth={2} color="#0A0A0A" />
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0A0A0A", margin: 0, letterSpacing: "-0.5px" }}>
            Risk Screening
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "#6B6B6B", margin: 0 }}>
          Screen individuals and entities against sanctions lists, PEP databases, and crime records.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        <button style={tabBtn(tab === "quick")} onClick={() => setTab("quick")}>Quick Screen</button>
        <button style={tabBtn(tab === "batch")} onClick={() => setTab("batch")}>Batch Screen</button>
        <button style={tabBtn(tab === "history")} onClick={() => setTab("history")}>Screening History</button>
        <button style={tabBtn(tab === "status")} onClick={() => setTab("status")}>List Status</button>
      </div>

      {/* === QUICK SCREEN === */}
      {tab === "quick" && (
        <>
          <div style={cardStyle}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", marginBottom: 6, display: "block" }}>Full Name *</label>
                <input value={screenName} onChange={(e) => setScreenName(e.target.value)} placeholder="Enter full name to screen" style={inputStyle} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#0A0A0A", marginBottom: 6, display: "block" }}>BVN (optional)</label>
                <input value={screenBvn} onChange={(e) => setScreenBvn(e.target.value)} placeholder="Enter BVN" style={inputStyle} />
              </div>
            </div>

            <div style={{ marginBottom: 16, padding: 14, background: "#F5F5F0", borderRadius: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
                Lists Being Checked
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {LISTS_CHECKED.map((list) => (
                  <span key={list} style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.08)", padding: "4px 10px", fontSize: 11, fontWeight: 500, color: "#0A0A0A", borderRadius: 999 }}>
                    {list}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleQuickScreen}
              disabled={screening || !screenName.trim()}
              style={{
                width: "100%", height: 44, background: "#0A0A0A", color: "#FFFFFF",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: screening ? "not-allowed" : "pointer", opacity: !screenName.trim() ? 0.5 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {screening ? <><Loader2 size={16} className="animate-spin" /> Screening...</> : <><Search size={16} /> Screen Now</>}
            </button>
          </div>

          {screeningResult && (
            <div style={{ ...cardStyle, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>Screening Result</p>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>{screenName}</h2>
                </div>
                <div style={{ textAlign: "right" }}>
                  {(() => {
                    const c = riskColor(screeningResult.risk_level);
                    return (
                      <div style={{ background: c.bg, color: c.fg, border: `1px solid ${c.border}`, padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700, display: "inline-block", marginBottom: 6 }}>
                        {riskLabel(screeningResult.risk_level)}
                      </div>
                    );
                  })()}
                  <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>
                    {screeningResult.total_matches} match{screeningResult.total_matches !== 1 ? "es" : ""} found
                  </p>
                </div>
              </div>

              {screeningResult.sanctions_matches.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", margin: "0 0 10px" }}>
                    Sanctions Matches ({screeningResult.sanctions_matches.length})
                  </h3>
                  {screeningResult.sanctions_matches.map((m) => (
                    <div key={m.id} style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: m.reason ? 4 : 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{m.full_name}</span>
                        <span style={{ fontSize: 11, color: "#991B1B", fontWeight: 600 }}>{m.list_name}</span>
                      </div>
                      {m.reason && <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>{m.reason}</p>}
                    </div>
                  ))}
                </div>
              )}

              {screeningResult.pep_matches.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", margin: "0 0 10px" }}>
                    PEP Matches ({screeningResult.pep_matches.length})
                  </h3>
                  {screeningResult.pep_matches.map((p) => (
                    <div key={p.id} style={{ background: "#FEF9C3", border: "1px solid #FDE68A", borderRadius: 8, padding: 12, marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{p.full_name}</span>
                        <span style={{ fontSize: 11, color: "#854D0E", fontWeight: 600 }}>PEP — {p.category}</span>
                      </div>
                      <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>
                        {p.position} · {p.country} · {p.status === "active" ? "Currently serving" : "Former"}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {screeningResult.risk_level === "none" && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: 8 }}>
                  <CheckCircle2 size={18} color="#166534" />
                  <span style={{ fontSize: 13, color: "#166534", fontWeight: 600 }}>
                    No matches found across any sanctions list or PEP database.
                  </span>
                </div>
              )}

              {screeningResult.risk_level !== "none" && (
                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button onClick={() => saveScreeningAction("cleared")} style={{ flex: 1, height: 40, background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Mark as Cleared
                  </button>
                  <button onClick={() => saveScreeningAction("escalated")} style={{ flex: 1, height: 40, background: "transparent", color: "#DC2626", border: "1px solid rgba(220,38,38,0.3)", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Escalate — File STR
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* === BATCH === */}
      {tab === "batch" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", margin: "0 0 4px" }}>Batch Screening</h2>
              <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>Upload a CSV with columns: Name, BVN</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                <Upload size={14} /> Upload CSV
                <input type="file" accept=".csv" onChange={handleCsvUpload} style={{ display: "none" }} />
              </label>
              {batchRows.length > 0 && (
                <>
                  <button onClick={runBatch} disabled={batchRunning} style={{ padding: "8px 14px", background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    {batchRunning ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                    {batchRunning ? "Screening..." : "Run Batch"}
                  </button>
                  <button onClick={exportBatchCsv} style={{ padding: "8px 14px", background: "transparent", color: "#0A0A0A", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Download size={14} /> Export
                  </button>
                </>
              )}
            </div>
          </div>

          {batchRows.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", background: "#F5F5F0", borderRadius: 8 }}>
              <Upload size={28} color="#9B9B9B" style={{ margin: "0 auto 10px" }} />
              <p style={{ fontSize: 13, color: "#6B6B6B", margin: 0 }}>Upload a CSV file to begin batch screening</p>
            </div>
          ) : (
            <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ background: "#F5F5F0" }}>
                  <tr>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Name</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>BVN</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Status</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Risk</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {batchRows.map((r, i) => {
                    const c = r.risk ? riskColor(r.risk) : null;
                    return (
                      <tr key={i} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "10px 12px", color: "#0A0A0A", fontWeight: 500 }}>{r.name}</td>
                        <td style={{ padding: "10px 12px", color: "#6B6B6B" }}>{r.bvn || "—"}</td>
                        <td style={{ padding: "10px 12px", color: "#6B6B6B" }}>
                          {r.status === "screening" && <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Loader2 size={12} className="animate-spin" /> screening</span>}
                          {r.status === "done" && <span style={{ color: "#166534" }}>done</span>}
                          {r.status === "pending" && <span>pending</span>}
                          {r.status === "error" && <span style={{ color: "#991B1B" }}>error</span>}
                        </td>
                        <td style={{ padding: "10px 12px" }}>
                          {r.risk && c ? (
                            <span style={{ background: c.bg, color: c.fg, border: `1px solid ${c.border}`, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                              {riskLabel(r.risk)}
                            </span>
                          ) : "—"}
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: "#0A0A0A", fontWeight: 600 }}>{r.matches ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* === HISTORY === */}
      {tab === "history" && (
        <div style={cardStyle}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9B9B9B" }} />
              <input
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                placeholder="Search by name..."
                style={{ ...inputStyle, paddingLeft: 34 }}
              />
            </div>
            <select
              value={historyRiskFilter}
              onChange={(e) => setHistoryRiskFilter(e.target.value)}
              style={{ ...inputStyle, width: 180 }}
            >
              <option value="">All risk levels</option>
              <option value="none">Clear</option>
              <option value="medium">Review</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {filteredHistory.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", background: "#F5F5F0", borderRadius: 8 }}>
              <History size={28} color="#9B9B9B" style={{ margin: "0 auto 10px" }} />
              <p style={{ fontSize: 13, color: "#6B6B6B", margin: 0 }}>No screening history yet</p>
            </div>
          ) : (
            <div style={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ background: "#F5F5F0" }}>
                  <tr>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Name</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Date</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Risk</th>
                    <th style={{ padding: "10px 12px", textAlign: "right", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Matches</th>
                    <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600, color: "#6B6B6B", fontSize: 11, textTransform: "uppercase" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((h) => {
                    const c = riskColor(h.highest_risk);
                    return (
                      <tr key={h.id} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "10px 12px", color: "#0A0A0A", fontWeight: 500 }}>{h.search_name}</td>
                        <td style={{ padding: "10px 12px", color: "#6B6B6B" }}>{new Date(h.search_date).toLocaleString()}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ background: c.bg, color: c.fg, border: `1px solid ${c.border}`, padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                            {riskLabel(h.highest_risk)}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", textAlign: "right", color: "#0A0A0A", fontWeight: 600 }}>{h.matches_found}</td>
                        <td style={{ padding: "10px 12px", color: "#6B6B6B", textTransform: "capitalize" }}>{h.action_taken?.replace("_", " ") || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* === LIST STATUS === */}
      {tab === "status" && <ListStatusTab />}
    </div>
  );
}

function ListStatusTab() {
  const [syncLogs, setSyncLogs] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [syncing, setSyncing] = useState(false);

  const load = async () => {
    const [{ data: logs }, { data: entries }] = await Promise.all([
      supabase.from("sanctions_sync_log").select("*").order("sync_date", { ascending: false }).limit(50),
      supabase.from("sanctions_entries").select("list_name").limit(20000),
    ]);
    setSyncLogs(logs || []);
    const c: Record<string, number> = {};
    (entries || []).forEach((r: any) => { c[r.list_name] = (c[r.list_name] || 0) + 1; });
    setCounts(c);
  };

  useEffect(() => { load(); }, []);

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const { error } = await supabase.functions.invoke("sync-sanctions", { body: { list: "all" } });
      if (error) toast.error(error.message);
      else toast.success("Sync triggered — refreshing list counts");
      await load();
    } finally {
      setSyncing(false);
    }
  };

  const lists = [
    { name: "UN Security Council", source: "scsanctions.un.org", type: "Auto-synced daily" },
    { name: "OFAC SDN", source: "treasury.gov/ofac", type: "Auto-synced daily" },
    { name: "EU Consolidated", source: "webgate.ec.europa.eu", type: "Auto-synced daily" },
    { name: "UK HM Treasury", source: "gov.uk", type: "Auto-synced daily" },
    { name: "CBN Watchlist", source: "cbn.gov.ng", type: "Manually maintained" },
  ];

  return (
    <div style={{ background: "#FFFFFF", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", margin: "0 0 4px" }}>Sanctions List Status</h2>
          <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>Lists are synced automatically every day at 02:00.</p>
        </div>
        <button onClick={triggerSync} disabled={syncing} style={{ height: 36, padding: "0 18px", background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: syncing ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          {syncing ? <><Loader2 size={14} className="animate-spin" /> Syncing…</> : <><RefreshCw size={14} /> Sync All Now</>}
        </button>
      </div>

      {lists.map((list) => {
        const latest = syncLogs.find((l) => l.list_name === list.name);
        const count = counts[list.name] || 0;
        const ok = count > 0;
        return (
          <div key={list.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: ok ? "#DCFCE7" : "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {ok ? <CheckCircle2 size={16} color="#166534" /> : <AlertTriangle size={16} color="#9A3412" />}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{list.name}</p>
                <p style={{ fontSize: 11, color: "#6B6B6B", margin: 0 }}>{list.source} · {list.type}</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>{count.toLocaleString()}</p>
              <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>
                {latest ? `Last synced ${new Date(latest.sync_date).toLocaleDateString("en-NG")}` : ok ? "Active" : "Not yet synced"}
              </p>
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 18, padding: 14, background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#854D0E", margin: "0 0 4px" }}>About the CBN Watchlist</p>
        <p style={{ fontSize: 12, color: "#78350F", margin: 0, lineHeight: 1.55 }}>
          The CBN does not publish a machine-readable terrorism watchlist. RegCo maintains this list manually from
          publicly available CBN circulars. To obtain the full CBN watchlist, write to the Director, Financial Policy
          and Regulation at the CBN, then contact support to ingest the updated list.
        </p>
      </div>
    </div>
  );
}

