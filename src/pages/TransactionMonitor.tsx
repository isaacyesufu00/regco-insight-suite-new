import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Upload, Activity, CheckCircle2,
  Search, RefreshCw, Shield, TrendingDown, Loader2,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";

interface FlaggedTransaction {
  id: string;
  account_id: string;
  transaction_date: string;
  amount: number;
  narration: string;
  flag_type: string;
  severity: "critical" | "high" | "medium";
  status: "pending" | "reviewed" | "reported" | "dismissed";
  rule_triggered: string;
  user_id: string;
  created_at: string;
}

type RawRow = Record<string, string>;

const SEVERITY_COLORS = {
  critical: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.25)" },
  high: { bg: "rgba(249,115,22,0.1)", text: "#f97316", border: "rgba(249,115,22,0.25)" },
  medium: { bg: "rgba(234,179,8,0.1)", text: "#ca8a04", border: "rgba(234,179,8,0.25)" },
};

const STATUS_COLORS = {
  pending: { bg: "rgba(99,102,241,0.1)", text: "#6366f1", border: "rgba(99,102,241,0.25)" },
  reviewed: { bg: "rgba(16,185,129,0.1)", text: "#10b981", border: "rgba(16,185,129,0.25)" },
  reported: { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.25)" },
  dismissed: { bg: "rgba(107,114,128,0.1)", text: "#6b7280", border: "rgba(107,114,128,0.25)" },
};

function parseCSV(text: string): RawRow[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
  return lines.slice(1).map((line) => {
    const vals = line.split(",").map((v) => v.trim().replace(/^["']|["']$/g, ""));
    const row: RawRow = {};
    headers.forEach((h, i) => { row[h] = vals[i] ?? ""; });
    return row;
  });
}

function findCol(row: RawRow, candidates: string[]): string {
  for (const c of candidates) {
    if (row[c] !== undefined) return row[c];
  }
  return "";
}

function flagRow(row: RawRow): { flag_type: string; severity: FlaggedTransaction["severity"]; rule_triggered: string } | null {
  const amtRaw = findCol(row, ["amount", "debit", "credit", "transaction amount", "value"]);
  const amount = parseFloat(amtRaw.replace(/[,₦\s]/g, "")) || 0;
  const acct = findCol(row, ["account", "account_id", "account id", "acct", "acct_id"]);

  if (amount >= 5_000_000) {
    return { flag_type: "CTR Threshold Breach", severity: "critical", rule_triggered: `Amount ₦${amount.toLocaleString()} meets/exceeds CTR threshold of ₦5,000,000` };
  }
  if (amount >= 4_500_000 && amount < 5_000_000 && amount % 1000 === 0) {
    return { flag_type: "Structuring Pattern", severity: "high", rule_triggered: `Amount ₦${amount.toLocaleString()} appears structured just below CTR threshold` };
  }
  if (amount >= 1_000_000 && amount % 500_000 === 0) {
    return { flag_type: "Round Figure Transaction", severity: "medium", rule_triggered: `Round-figure amount ₦${amount.toLocaleString()} ≥ ₦1M may indicate layering` };
  }
  void acct;
  return null;
}

function velocityFlag(rows: RawRow[]): Set<number> {
  const acctCount: Record<string, number[]> = {};
  rows.forEach((row, i) => {
    const acct = findCol(row, ["account", "account_id", "account id", "acct", "acct_id"]);
    if (!acct) return;
    if (!acctCount[acct]) acctCount[acct] = [];
    acctCount[acct].push(i);
  });
  const flagged = new Set<number>();
  Object.values(acctCount).forEach((indices) => {
    if (indices.length >= 5) indices.forEach((i) => flagged.add(i));
  });
  return flagged;
}

export default function TransactionMonitor() {
  const { user } = useAuth();
  const [flags, setFlags] = useState<FlaggedTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const fileRef = useRef<HTMLInputElement>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const fetchFlags = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("flagged_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setFlags(data as FlaggedTransaction[]);
  }, [user]);

  useEffect(() => {
    fetchFlags().finally(() => setLoading(false));

    if (!user) return;
    const ch = supabase
      .channel("flagged-tx-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "flagged_transactions", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "INSERT") {
          setFlags((p) => [payload.new as FlaggedTransaction, ...p]);
        } else if (payload.eventType === "UPDATE") {
          setFlags((p) => p.map((f) => (f.id === (payload.new as FlaggedTransaction).id ? (payload.new as FlaggedTransaction) : f)));
        } else if (payload.eventType === "DELETE") {
          setFlags((p) => p.filter((f) => f.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();
    channelRef.current = ch;
    return () => { supabase.removeChannel(ch); };
  }, [user, fetchFlags]);

  const handleFile = (file: File) => {
    if (!file || !user) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const rows = parseCSV(text);
        const velocityFlagged = velocityFlag(rows);
        const toInsert: Omit<FlaggedTransaction, "id" | "created_at">[] = [];

        rows.forEach((row, i) => {
          const amtRaw = findCol(row, ["amount", "debit", "credit", "transaction amount", "value"]);
          const amount = parseFloat(amtRaw.replace(/[,₦\s]/g, "")) || 0;
          const acct = findCol(row, ["account", "account_id", "account id", "acct", "acct_id"]);
          const narration = findCol(row, ["narration", "description", "remarks", "memo", "reference"]);
          const dateRaw = findCol(row, ["date", "transaction_date", "txn_date", "value_date"]);

          let flag = flagRow(row);

          if (!flag && velocityFlagged.has(i)) {
            flag = { flag_type: "Velocity Anomaly", severity: "high", rule_triggered: `Account ${acct} has 5+ transactions in this batch — possible layering` };
          }

          if (flag) {
            toInsert.push({
              account_id: acct || `ACCT-${i + 1}`,
              transaction_date: dateRaw || new Date().toISOString().slice(0, 10),
              amount,
              narration: narration || "—",
              flag_type: flag.flag_type,
              severity: flag.severity,
              status: "pending",
              rule_triggered: flag.rule_triggered,
              user_id: user.id,
            });
          }
        });

        if (toInsert.length > 0) {
          const BATCH = 50;
          for (let b = 0; b < toInsert.length; b += BATCH) {
            await supabase.from("flagged_transactions").insert(toInsert.slice(b, b + BATCH));
          }
        }
      } finally {
        setUploading(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const updateStatus = async (id: string, status: FlaggedTransaction["status"]) => {
    await supabase.from("flagged_transactions").update({ status }).eq("id", id);
  };

  const filtered = flags.filter((f) => {
    if (search && !f.account_id.toLowerCase().includes(search.toLowerCase()) && !f.flag_type.toLowerCase().includes(search.toLowerCase()) && !f.narration.toLowerCase().includes(search.toLowerCase())) return false;
    if (severityFilter !== "all" && f.severity !== severityFilter) return false;
    if (statusFilter !== "all" && f.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    critical: flags.filter((f) => f.severity === "critical").length,
    high: flags.filter((f) => f.severity === "high").length,
    medium: flags.filter((f) => f.severity === "medium").length,
    pending: flags.filter((f) => f.status === "pending").length,
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Transaction Monitor</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Upload transaction CSV files to detect AML/CFT risk patterns in real-time</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchFlags}>
              <RefreshCw className="h-4 w-4 mr-1.5" /> Refresh
            </Button>
            <Button size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Upload className="h-4 w-4 mr-1.5" />}
              {uploading ? "Processing…" : "Upload CSV"}
            </Button>
            <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Critical", value: stats.critical, icon: AlertTriangle, color: "#ef4444" },
            { label: "High Risk", value: stats.high, icon: TrendingDown, color: "#f97316" },
            { label: "Medium Risk", value: stats.medium, icon: Eye, color: "#ca8a04" },
            { label: "Pending Review", value: stats.pending, icon: Activity, color: "#6366f1" },
          ].map(({ label, value, icon: Icon, color }) => (
            <Card key={label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="rounded-lg p-2" style={{ background: `${color}18` }}>
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by account, type, narration…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "critical", "high", "medium"].map((s) => (
                  <button key={s} onClick={() => setSeverityFilter(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                    style={{
                      background: severityFilter === s ? "#1D1D1F" : "transparent",
                      color: severityFilter === s ? "white" : "#6E6E73",
                      borderColor: severityFilter === s ? "#1D1D1F" : "rgba(0,0,0,0.12)",
                    }}>
                    {s === "all" ? "All Severity" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
                <div className="w-px bg-border mx-1" />
                {["all", "pending", "reviewed", "reported", "dismissed"].map((s) => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                    style={{
                      background: statusFilter === s ? "#1D1D1F" : "transparent",
                      color: statusFilter === s ? "white" : "#6E6E73",
                      borderColor: statusFilter === s ? "#1D1D1F" : "rgba(0,0,0,0.12)",
                    }}>
                    {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-base font-semibold text-foreground mb-1">
                  {flags.length === 0 ? "No transactions flagged yet" : "No results match your filter"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {flags.length === 0 ? "Upload a transaction CSV to start AML screening" : "Adjust your search or filter"}
                </p>
                {flags.length === 0 && (
                  <Button className="mt-4" onClick={() => fileRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" /> Upload CSV
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {filtered.map((flag) => {
                    const sev = SEVERITY_COLORS[flag.severity];
                    const sts = STATUS_COLORS[flag.status];
                    return (
                      <motion.div
                        key={flag.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                        style={{ borderColor: sev.border, background: sev.bg }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-semibold text-sm text-foreground">{flag.account_id}</span>
                            <Badge style={{ background: sev.bg, color: sev.text, border: `1px solid ${sev.border}` }}>
                              {flag.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" style={{ color: sts.text, borderColor: sts.border }}>
                              {flag.status.charAt(0).toUpperCase() + flag.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">{flag.flag_type}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{flag.rule_triggered}</p>
                          <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                            <span>₦{flag.amount.toLocaleString("en-NG")}</span>
                            <span>·</span>
                            <span>{flag.transaction_date}</span>
                            <span>·</span>
                            <span className="truncate max-w-[200px]">{flag.narration}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {flag.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => updateStatus(flag.id, "reviewed")}>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Review
                              </Button>
                              <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => updateStatus(flag.id, "reported")}>
                                <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Report STR
                              </Button>
                              <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => updateStatus(flag.id, "dismissed")}>
                                Dismiss
                              </Button>
                            </>
                          )}
                          {flag.status === "reviewed" && (
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => updateStatus(flag.id, "reported")}>
                              <AlertTriangle className="h-3.5 w-3.5 mr-1" /> Report STR
                            </Button>
                          )}
                          {(flag.status === "reported" || flag.status === "dismissed") && (
                            <span className="text-xs text-muted-foreground italic self-center">
                              {flag.status === "reported" ? "STR filed" : "Dismissed"}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
