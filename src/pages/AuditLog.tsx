import { useEffect, useState, useCallback } from "react";
import { 
  ShieldCheck, ShieldAlert, Shield, Search, RefreshCw, 
  ArrowRight, FileJson, Clock, CheckCircle2, History,
  ChevronRight, AlertCircle, Copy, Check
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  payload: {
    new?: Record<string, any>;
    old?: Record<string, any>;
  };
  prev_hash: string;
  curr_hash: string;
  created_at: string;
}

interface VerificationResult {
  is_valid: boolean;
  total_checked: number;
  failed_log_id: string | null;
  expected_hash: string | null;
  actual_hash: string | null;
}

const entityColors: Record<string, { bg: string; text: string }> = {
  customers: { bg: "bg-blue-50 text-blue-700 border-blue-100", text: "text-blue-700" },
  customer_kyc: { bg: "bg-indigo-50 text-indigo-700 border-indigo-100", text: "text-indigo-700" },
  unified_transactions: { bg: "bg-amber-50 text-amber-700 border-amber-100", text: "text-amber-700" },
  cases: { bg: "bg-purple-50 text-purple-700 border-purple-100", text: "text-purple-700" },
  transaction_alerts: { bg: "bg-rose-50 text-rose-700 border-rose-100", text: "text-rose-700" },
  transaction_rules: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", text: "text-emerald-700" },
};

const actionColors: Record<string, { bg: string; text: string }> = {
  INSERT: { bg: "bg-emerald-500/10 text-emerald-600", text: "text-emerald-600" },
  UPDATE: { bg: "bg-amber-500/10 text-amber-600", text: "text-amber-600" },
  DELETE: { bg: "bg-rose-500/10 text-rose-600", text: "text-rose-600" },
};

export default function AuditLog() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Filters
  const [searchEntityId, setSearchEntityId] = useState("");
  const [filterAction, setFilterAction] = useState<string>("ALL");
  const [filterEntity, setFilterEntity] = useState<string>("ALL");

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterAction !== "ALL") {
        query = query.eq("action", filterAction);
      }
      if (filterEntity !== "ALL") {
        query = query.eq("entity", filterEntity);
      }
      if (searchEntityId.trim()) {
        query = query.eq("entity_id", searchEntityId.trim());
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      setLogs((data as unknown as AuditLog[]) || []);
    } catch (e: any) {
      console.error("Failed to load audit logs:", e);
      toast.error(e.message || "Failed to load audit ledger");
    } finally {
      setLoading(false);
    }
  }, [filterAction, filterEntity, searchEntityId]);

  const verifyLedger = async () => {
    setVerifying(true);
    setVerification(null);
    try {
      // Invoke Deno edge function to run cryptographic verification
      const { data, error } = await supabase.functions.invoke("verify-audit-chain");
      
      if (error) throw error;

      if (data?.success && data?.verification) {
        setVerification(data.verification);
        if (data.verification.is_valid) {
          toast.success(`Ledger verified intact! ${data.verification.total_checked} blocks validated.`);
        } else {
          toast.error("Ledger verification failed! The chain has been broken.", {
            duration: 6000
          });
        }
      } else {
        throw new Error("Invalid verification response structure");
      }
    } catch (e: any) {
      console.error("Verification error:", e);
      toast.error(e.message || "Cryptographic verification failed");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  // Run genesis validation on first load
  useEffect(() => {
    if (user) {
      verifyLedger();
    }
  }, [user]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getEntityLabel = (entity: string) => {
    return entity.replace(/_/g, " ");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-10 pb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-ink text-[var(--paper)] flex items-center justify-center shadow-sm">
            <History className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-ink tracking-tight">Immutable Audit Ledger</h1>
            <p className="text-[13.5px] text-ink-muted mt-1 max-w-xl">
              CBN Pillar 6 Compliance: Cryptographically chained ledger tracking modifications across core database schemas.
            </p>
          </div>
        </div>

        <button
          onClick={verifyLedger}
          disabled={verifying}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-[13px] font-medium bg-ink text-[var(--paper)] hover:bg-ink/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-sm"
        >
          {verifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
          {verifying ? "Verifying Ledger..." : "Verify Ledger Integrity"}
        </button>
      </div>

      {/* Verification Results Panel */}
      <AnimatePresence mode="wait">
        {verification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-5 rounded-xl border shadow-sm transition-all duration-300 ${
              verification.is_valid 
                ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-900" 
                : "bg-rose-500/5 border-rose-500/20 text-rose-900"
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className={`p-2 rounded-lg ${verification.is_valid ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}>
                {verification.is_valid ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <h3 className="text-[15px] font-semibold tracking-tight">
                    {verification.is_valid ? "Cryptographic Chain Intact" : "Ledger Chain Verification Failure"}
                  </h3>
                  <span className="text-[11px] font-mono opacity-80 bg-black/5 px-2 py-0.5 rounded-full">
                    Validated: {verification.total_checked} Blocks
                  </span>
                </div>
                <p className="text-[13px] mt-1 opacity-90 leading-relaxed">
                  {verification.is_valid 
                    ? "All block hashes match their serial payloads. No unauthorized row insertion, modification, or deletion was detected in the audited tables."
                    : "A signature mismatch was detected in the database ledger. This indicates potential manual data tampering outside of the application boundaries or hash alteration."}
                </p>

                {!verification.is_valid && verification.failed_log_id && (
                  <div className="mt-4 p-4 rounded-lg bg-black/5 border border-rose-500/10 font-mono text-[11px] space-y-2">
                    <p className="font-semibold text-rose-800">Tampered Block Details:</p>
                    <div className="grid grid-cols-[110px_1fr] gap-x-2 gap-y-1">
                      <span className="opacity-70">Log Record ID:</span>
                      <span className="break-all select-all font-medium text-black">{verification.failed_log_id}</span>
                      <span className="opacity-70">Calculated Hash:</span>
                      <span className="break-all font-medium text-emerald-700">{verification.expected_hash}</span>
                      <span className="opacity-70">Stored Hash:</span>
                      <span className="break-all font-medium text-rose-700">{verification.actual_hash}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control bar / Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--paper-2)]/40 border border-ink-10 rounded-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider">Entity Type</span>
            <select
              value={filterEntity}
              onChange={(e) => setFilterEntity(e.target.value)}
              className="bg-white border border-ink-10 px-3 py-1.5 rounded-lg text-[13px] text-ink outline-none cursor-pointer focus:ring-1 focus:ring-ink/20"
            >
              <option value="ALL">All Tables</option>
              <option value="customers">Customers</option>
              <option value="customer_kyc">Customer KYC</option>
              <option value="unified_transactions">Unified Transactions</option>
              <option value="cases">Cases</option>
              <option value="transaction_alerts">Transaction Alerts</option>
              <option value="transaction_rules">Transaction Rules</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider">Action</span>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="bg-white border border-ink-10 px-3 py-1.5 rounded-lg text-[13px] text-ink outline-none cursor-pointer focus:ring-1 focus:ring-ink/20"
            >
              <option value="ALL">All Actions</option>
              <option value="INSERT">INSERT (Create)</option>
              <option value="UPDATE">UPDATE (Modify)</option>
              <option value="DELETE">DELETE (Remove)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full md:w-auto">
          <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider">Search by Entity ID</span>
          <div className="relative">
            <input
              type="text"
              value={searchEntityId}
              onChange={(e) => setSearchEntityId(e.target.value)}
              placeholder="Enter exact UUID..."
              className="bg-white border border-ink-10 pl-9 pr-3 py-1.5 rounded-lg text-[13px] text-ink placeholder-ink-muted w-full md:w-64 outline-none focus:ring-1 focus:ring-ink/20"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          </div>
        </div>
      </div>

      {/* Main Grid: Ledger & Detail Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Table Ledger Panel */}
        <div className="lg:col-span-2 border border-ink-10 rounded-xl bg-white overflow-hidden shadow-sm">
          <div className="p-4 border-b border-ink-10 flex items-center justify-between">
            <span className="text-[13px] font-medium text-ink">Ledger Blocks</span>
            <span className="text-[11px] font-mono text-ink-muted">Showing last 100 entries</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-muted text-[13px]">
                <RefreshCw className="w-6 h-6 animate-spin text-ink-muted/60" />
                <span>Syncing Ledger state...</span>
              </div>
            ) : logs.length === 0 ? (
              <div className="py-20 text-center text-ink-muted space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-ink-muted/40" />
                <p className="text-[13px]">No matching audit blocks found.</p>
              </div>
            ) : (
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr className="text-left text-ink-muted border-b border-ink-10 bg-[var(--paper-2)]/40 font-mono text-[10.5px] uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Timestamp</th>
                    <th className="px-4 py-3 font-medium">Entity Schema</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                    <th className="px-4 py-3 font-medium">Signature</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const entColor = entityColors[log.entity] || { bg: "bg-neutral-50 text-neutral-700 border-neutral-100", text: "text-neutral-700" };
                    const actColor = actionColors[log.action] || { bg: "bg-neutral-100 text-neutral-600", text: "text-neutral-600" };
                    const isSelected = selectedLog?.id === log.id;
                    
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className={`border-b border-ink-10 last:border-0 hover:bg-[var(--paper-2)]/30 cursor-pointer transition-colors ${
                          isSelected ? "bg-[var(--paper-2)]/60" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-ink-muted whitespace-nowrap font-mono text-[11px]">
                          {new Date(log.created_at).toLocaleString("en-NG", {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false
                          })}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[11px] font-medium rounded border ${entColor.bg}`}>
                            {getEntityLabel(log.entity)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[10.5px] font-mono font-semibold rounded ${actColor.bg}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-ink-muted whitespace-nowrap max-w-[120px] truncate">
                          {log.curr_hash}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <ChevronRight className={`w-4 h-4 text-ink-muted/50 transition-transform ${isSelected ? "translate-x-0.5 text-ink" : ""}`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detailed Pane */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-ink-10 rounded-xl bg-white p-5 shadow-sm space-y-5 min-h-[400px]">
            <h3 className="text-[14px] font-semibold text-ink border-b border-ink-10 pb-3 flex items-center gap-2">
              <FileJson className="w-4 h-4 text-ink-muted" /> Block Inspector
            </h3>

            {selectedLog ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">Log ID</span>
                  <div className="flex items-center justify-between bg-[var(--paper-2)]/50 border border-ink-10 px-2.5 py-1.5 rounded-lg text-[11.5px] font-mono">
                    <span className="truncate max-w-[180px]">{selectedLog.id}</span>
                    <button 
                      onClick={() => copyToClipboard(selectedLog.id, "logId")}
                      className="text-ink-muted hover:text-ink transition-colors"
                    >
                      {copiedId === "logId" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">Record target ID</span>
                  <div className="flex items-center justify-between bg-[var(--paper-2)]/50 border border-ink-10 px-2.5 py-1.5 rounded-lg text-[11.5px] font-mono">
                    <span className="truncate max-w-[180px]">{selectedLog.entity_id || "SYSTEM"}</span>
                    {selectedLog.entity_id && (
                      <button 
                        onClick={() => copyToClipboard(selectedLog.entity_id!, "entityId")}
                        className="text-ink-muted hover:text-ink transition-colors"
                      >
                        {copiedId === "entityId" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">Previous Hash (parent block)</span>
                  <p className="font-mono text-[10.5px] text-ink-muted break-all select-all leading-normal p-2.5 bg-neutral-50 rounded-lg border border-ink-10">
                    {selectedLog.prev_hash}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">Current Signature Hash</span>
                  <p className="font-mono text-[10.5px] text-ink break-all select-all leading-normal p-2.5 bg-emerald-50/20 border border-emerald-100 rounded-lg">
                    {selectedLog.curr_hash}
                  </p>
                </div>

                <div className="space-y-2 border-t border-ink-10 pt-4">
                  <span className="text-[10px] font-mono uppercase text-ink-muted tracking-wider block">State Payload</span>
                  
                  {selectedLog.payload.new && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">New State</span>
                      <pre className="text-[11px] font-mono p-3 bg-neutral-900 text-neutral-100 rounded-lg overflow-x-auto max-h-[160px]">
                        {JSON.stringify(selectedLog.payload.new, null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedLog.payload.old && (
                    <div className="space-y-1 mt-3">
                      <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">Previous State</span>
                      <pre className="text-[11px] font-mono p-3 bg-neutral-900 text-neutral-100 rounded-lg overflow-x-auto max-h-[160px]">
                        {JSON.stringify(selectedLog.payload.old, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-ink-muted select-none">
                <FileJson className="w-10 h-10 mb-2 opacity-25" />
                <p className="text-[13px]">Select a ledger block to view serialized cryptographic payload</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
