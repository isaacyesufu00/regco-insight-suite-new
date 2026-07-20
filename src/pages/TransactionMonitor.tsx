import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, AlertTriangle, Upload, Copy, Eye, EyeOff, RefreshCw,
  Loader2, FileText, CheckCircle2, Shield, Search, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useProfile } from "@/contexts/ProfileContext";

type Tab = "live" | "batch" | "flagged" | "str";
type Domain = "ALL" | "AML" | "FRAUD" | "CTR";

// Maps a flagged transaction's rule code to its regulatory monitoring domain.
// Mirrors the server-side transaction_rules.category catalogue
// (CBN Baseline Standards Art. 8 — fraud functionalities must be
// clearly segregated from AML/CFT/CPF detection).
const FRAUD_RULES = new Set(["VELOCITY_24H", "DORMANT_REACTIVATION"]);
const CTR_RULES = new Set(["CTR_INDIVIDUAL_5M", "CTR_CORPORATE_10M"]);
const domainOf = (rule?: string | null): Exclude<Domain, "ALL"> => {
  if (!rule) return "AML";
  if (CTR_RULES.has(rule)) return "CTR";
  if (FRAUD_RULES.has(rule)) return "FRAUD";
  return "AML";
};

const DOMAIN_META: Record<Exclude<Domain, "ALL">, { label: string; short: string; fg: string; bg: string; border: string }> = {
  AML: { label: "AML / CFT / CPF", short: "AML", fg: "#991B1B", bg: "#FEF2F2", border: "#FCA5A5" },
  FRAUD: { label: "Fraud Monitoring", short: "FRAUD", fg: "#9A3412", bg: "#FFF7ED", border: "#FDBA74" },
  CTR: { label: "Currency Transaction", short: "CTR", fg: "#1E40AF", bg: "#EFF6FF", border: "#BFDBFE" },
};
const WEBHOOK_URL = `https://pdplkprcomjslilznbsl.supabase.co/functions/v1/receive-transaction`;

interface UnifiedTx {
  id: string;
  user_id: string;
  customer_id: string | null;
  account_number: string | null;
  customer_name: string | null;
  amount: number;
  transaction_type: string | null;
  transaction_date: string;
  narration: string | null;
  channel: string | null;
  branch_code: string | null;
  is_flagged: boolean;
  flag_severity: string | null;
  flag_reason: string | null;
  flag_rule: string | null;
  review_status: string;
  str_reference: string | null;
  str_filed_at: string | null;
  review_notes: string | null;
}

const fmtNGN = (n: number) => "₦" + Number(n || 0).toLocaleString("en-NG");
const startOfTodayISO = () => { const d = new Date(); d.setHours(0,0,0,0); return d.toISOString(); };

export default function TransactionMonitor() {
  const { user, session } = useAuth();
  const { liveWebhook } = useFeatureAccess();
  const { profile, institutionName } = useProfile();
  const [tab, setTab] = useState<Tab>("live");

  // ---- Live tab state ----
  const [apiKey, setApiKey] = useState<string>("");
  const [keyPrefix, setKeyPrefix] = useState<string>("");
  const [hasKey, setHasKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [provisioning, setProvisioning] = useState(false);
  const [liveTransactions, setLiveTransactions] = useState<UnifiedTx[]>([]);
  const [todayStats, setTodayStats] = useState({ total: 0, flagged: 0, critical: 0, cleared: 0 });

  // ---- All transactions (flagged + STR) ----
  const [allTx, setAllTx] = useState<UnifiedTx[]>([]);
  const [loadingAll, setLoadingAll] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<Domain>("ALL");
  const [search, setSearch] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // ---- Batch upload ----
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [batchResult, setBatchResult] = useState<{ total: number; flagged: number } | null>(null);

  // ============== EFFECTS ==============
  const fetchTodayStats = useCallback(async () => {
    if (!user) return;
    const since = startOfTodayISO();
    const { data } = await supabase
      .from("unified_transactions")
      .select("id, is_flagged, flag_severity")
      .eq("user_id", user.id)
      .gte("transaction_date", since);
    const rows = (data || []) as { is_flagged: boolean; flag_severity: string | null }[];
    setTodayStats({
      total: rows.length,
      flagged: rows.filter((r) => r.is_flagged).length,
      critical: rows.filter((r) => r.flag_severity === "critical").length,
      cleared: rows.filter((r) => !r.is_flagged).length,
    });
  }, [user]);

  const fetchLiveFeed = useCallback(async () => {
    if (!user) return;
    const since = startOfTodayISO();
    const { data } = await supabase
      .from("unified_transactions")
      .select("*")
      .eq("user_id", user.id)
      .gte("transaction_date", since)
      .order("transaction_date", { ascending: false })
      .limit(100);
    setLiveTransactions((data as unknown as UnifiedTx[]) || []);
  }, [user]);

  const fetchAllTx = useCallback(async () => {
    if (!user) return;
    setLoadingAll(true);
    const { data } = await supabase
      .from("unified_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("transaction_date", { ascending: false })
      .limit(500);
    setAllTx((data as unknown as UnifiedTx[]) || []);
    setLoadingAll(false);
  }, [user]);

  const loadKeyMeta = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch(
        `https://pdplkprcomjslilznbsl.supabase.co/functions/v1/provision-webhook-key`,
        { method: "GET", headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      const body = await res.json();
      if (body.key) {
        setHasKey(true);
        setKeyPrefix(body.key.key_prefix || "");
      } else {
        setHasKey(false);
      }
    } catch (e) {
      console.error("Failed to load webhook key metadata:", e);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (!user) return;
    fetchTodayStats();
    fetchLiveFeed();
    fetchAllTx();
    loadKeyMeta();

    const ch = supabase
      .channel(`live-tx-${user.id}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "unified_transactions", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const tx = payload.new as UnifiedTx;
          setLiveTransactions((prev) => [tx, ...prev].slice(0, 100));
          setAllTx((prev) => [tx, ...prev]);
          fetchTodayStats();
          if (tx.flag_severity === "critical") {
            toast.error(`Critical AML flag: ${tx.customer_name} — ${fmtNGN(tx.amount)}`);
          } else if (tx.is_flagged) {
            toast(`Flagged: ${tx.customer_name} — ${fmtNGN(tx.amount)}`);
          }
        })
      .on("postgres_changes",
        { event: "UPDATE", schema: "public", table: "unified_transactions", filter: `user_id=eq.${user.id}` },
        (payload) => {
          const tx = payload.new as UnifiedTx;
          setAllTx((prev) => prev.map((r) => (r.id === tx.id ? tx : r)));
          setLiveTransactions((prev) => prev.map((r) => (r.id === tx.id ? tx : r)));
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, fetchTodayStats, fetchLiveFeed, fetchAllTx, loadKeyMeta]);

  // ============== ACTIONS ==============
  const provisionKey = async () => {
    if (!session?.access_token) return;
    setProvisioning(true);
    try {
      const res = await fetch(
        `https://pdplkprcomjslilznbsl.supabase.co/functions/v1/provision-webhook-key`,
        { method: "POST", headers: { Authorization: `Bearer ${session.access_token}` } },
      );
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.error || `Provisioning failed (${res.status})`);
      if (body?.api_key) {
        setApiKey(body.api_key);
        setKeyPrefix(body.prefix);
        setHasKey(true);
        setShowKey(true);
        toast.success("API key generated. Copy and store securely — it won't be shown again.");
      } else {
        toast.error("Could not generate key");
      }
    } catch (e) {
      console.error("Failed to provision webhook key:", e);
      toast.error(e instanceof Error ? e.message : "Could not generate key");
    } finally {
      setProvisioning(false);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  const updateReview = async (id: string, patch: Partial<UnifiedTx>) => {
    const { error } = await supabase.from("unified_transactions").update(patch).eq("id", id);
    if (error) toast.error("Update failed");
    else {
      setAllTx((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      toast.success("Updated");
    }
  };

  const generateAndDownloadSTR = async (tx: UnifiedTx, existingRef?: string) => {
    const inst = institutionName || profile?.company_name || "INSTITUTION";
    const strRef = existingRef || `STR-${inst.replace(/\s/g, "").slice(0, 6).toUpperCase()}-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;
    const content = `FINANCIAL INTELLIGENCE UNIT
SUSPICIOUS TRANSACTION REPORT (STR)
============================================================
REPORT REFERENCE:    ${strRef}
REPORT DATE:         ${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}

PART 1: REPORTING INSTITUTION
Institution:         ${inst}
CBN License:         ${profile?.cbn_license_category || ""}
Compliance Officer:  ${profile?.compliance_lead_name || profile?.full_name || ""}
Phone:               ${profile?.phone || ""}

PART 2: SUBJECT
Account Number:      ${tx.account_number || ""}
Customer Name:       ${tx.customer_name || ""}
Transaction Date:    ${tx.transaction_date ? new Date(tx.transaction_date).toLocaleDateString("en-NG") : ""}
Amount:              NGN ${Number(tx.amount || 0).toLocaleString("en-NG")}
Channel:             ${tx.channel || ""}
Transaction Type:    ${tx.transaction_type || ""}
Branch Code:         ${tx.branch_code || ""}
Narration:           ${tx.narration || ""}

PART 3: SUSPICION
Flag Type:           ${tx.flag_rule || ""}
Severity:            ${(tx.flag_severity || "").toUpperCase()}
Reason:              ${tx.flag_reason || ""}
Reviewer Notes:      ${tx.review_notes || "(none)"}

PART 4: DECLARATION
Filed pursuant to the Money Laundering (Prevention and Prohibition) Act 2022.

CCO Name:            ${profile?.compliance_lead_name || profile?.full_name || ""}
Date:                ___________________________
Signature:           ___________________________
NFIU Reference:      ___________________________

============================================================
CONFIDENTIAL — NOT FOR DISCLOSURE
Generated by RegCo Technologies Limited
${new Date().toISOString()}`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${strRef}_${tx.account_number || "acct"}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (!existingRef) {
      const filedAt = new Date().toISOString();
      const { error } = await supabase
        .from("unified_transactions")
        .update({ review_status: "reported", str_reference: strRef, str_filed_at: filedAt })
        .eq("id", tx.id);
      if (error) {
        console.error("Failed to record STR filing:", error);
        toast.error("STR downloaded but the filing status could not be saved. Please retry.");
        return;
      }
      setAllTx((prev) => prev.map((r) => (r.id === tx.id ? { ...r, review_status: "reported", str_reference: strRef, str_filed_at: filedAt } : r)));
      toast.success(`${strRef} generated. Update NFIU reference number after filing.`);
    } else {
      toast.success("STR re-downloaded");
    }
  };

  // CSV parsing for batch upload
  const handleBatchFile = async (file: File) => {
    if (!user) return;
    setUploading(true);
    setBatchResult(null);
    try {
      const text = await file.text();
      const lines = text.trim().split(/\r?\n/);
      if (lines.length < 2) { toast.error("Empty file"); return; }
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));
      const idxOf = (cands: string[]) => headers.findIndex((h) => cands.includes(h));
      const iAcct = idxOf(["account_number", "account", "acct"]);
      const iName = idxOf(["customer_name", "name"]);
      const iAmt = idxOf(["amount", "value", "debit", "credit"]);
      const iType = idxOf(["transaction_type", "type"]);
      const iDate = idxOf(["transaction_date", "date", "txn_date", "value_date"]);
      const iNarr = idxOf(["narration", "description", "remarks", "memo"]);
      const iChan = idxOf(["channel"]);
      const iBranch = idxOf(["branch_code", "branch"]);

      const rows = lines.slice(1).map((l) => l.split(",").map((v) => v.trim().replace(/^["']|["']$/g, "")));
      const toInsert = rows.map((r) => {
        const amount = parseFloat((r[iAmt] || "0").replace(/[,₦\s]/g, "")) || 0;
        const narration = iNarr >= 0 ? r[iNarr] : "";
        let flagged = false, sev: string | null = null, reason: string | null = null, rule: string | null = null;
        if (amount >= 5_000_000) { flagged = true; sev = "critical"; rule = "CTR"; reason = `Amount ${fmtNGN(amount)} meets CTR threshold (₦5,000,000)`; }
        else if (amount >= 4_500_000 && amount < 5_000_000 && amount % 1000 === 0) { flagged = true; sev = "high"; rule = "STRUCTURING"; reason = `Possible structuring — ${fmtNGN(amount)} just below CTR`; }
        else if (amount >= 1_000_000 && amount % 500_000 === 0) { flagged = true; sev = "medium"; rule = "ROUND_FIGURE"; reason = `Round-figure ${fmtNGN(amount)} ≥ ₦1M`; }

        return {
          user_id: user.id,
          account_number: iAcct >= 0 ? r[iAcct] : null,
          customer_name: iName >= 0 ? r[iName] : "Unknown",
          amount,
          transaction_type: iType >= 0 ? r[iType] : null,
          transaction_date: iDate >= 0 && r[iDate] ? new Date(r[iDate]).toISOString() : new Date().toISOString(),
          narration: narration || null,
          channel: iChan >= 0 ? r[iChan] : null,
          branch_code: iBranch >= 0 ? r[iBranch] : null,
          is_flagged: flagged,
          flag_severity: sev,
          flag_reason: reason,
          flag_rule: rule,
          review_status: flagged ? "pending" : "cleared",
        };
      });

      const BATCH = 100;
      for (let i = 0; i < toInsert.length; i += BATCH) {
        const { error } = await supabase.from("unified_transactions").insert(toInsert.slice(i, i + BATCH));
        if (error) throw error;
      }

      const flagged = toInsert.filter((t) => t.is_flagged).length;
      setBatchResult({ total: toInsert.length, flagged });
      toast.success(`Processed ${toInsert.length} transactions — ${flagged} flagged`);
      fetchAllTx();
      fetchTodayStats();
      fetchLiveFeed();
    } catch (e) {
      console.error("Batch transaction upload failed:", e);
      toast.error(e instanceof Error ? `Failed to process file: ${e.message}` : "Failed to process file");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  // ============== DERIVED ==============
  const flaggedRows = allTx.filter((t) => t.is_flagged).filter((t) => {
    if (domainFilter !== "ALL" && domainOf(t.flag_rule) !== domainFilter) return false;
    if (severityFilter !== "all" && t.flag_severity !== severityFilter) return false;
    if (statusFilter !== "all" && t.review_status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      const blob = `${t.customer_name} ${t.account_number} ${t.flag_reason} ${t.narration}`.toLowerCase();
      if (!blob.includes(s)) return false;
    }
    return true;
  });

  // Per-domain counts across all flagged transactions — surfaces the
  // AML / Fraud / CTR segregation required by CBN Baseline Standards Art. 8.
  const domainCounts = useMemo(() => {
    const c: Record<Exclude<Domain, "ALL">, number> = { AML: 0, FRAUD: 0, CTR: 0 };
    for (const t of allTx) {
      if (t.is_flagged) c[domainOf(t.flag_rule)] += 1;
    }
    return c;
  }, [allTx]);

  const strQueue = allTx.filter((t) => t.is_flagged && (t.review_status === "escalated" || t.review_status === "reported"));

  // ============== RENDER ==============
  return (
    <div style={{ fontFamily: "Inter, sans-serif", maxWidth: 1180, margin: "0 auto" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.5px", margin: 0 }}>Transaction Monitoring</h1>
        <p style={{ fontSize: 14, color: "#6B6B6B", margin: "4px 0 0" }}>
          Live AML/CFT screening, batch review, and STR escalation in one console.
        </p>
        {/* CBN Baseline Standards Art. 8 — fraud monitoring must be segregated
            from AML/CFT/CPF detection and appropriately governed. */}
        <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "flex-start", background: "#F5F5F0", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 10, padding: "12px 16px" }}>
          <Shield size={16} color="#0A0A0A" style={{ flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12.5, color: "#525252", margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: "#0A0A0A" }}>Segregated monitoring.</strong> Fraud and AML/CFT/CPF detection run as
            distinct, governed functions per CBN Baseline Standards (Art. 8). Each alert is tagged to its domain so fraud
            signal volume never masks or degrades AML detection effectiveness.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(0,0,0,0.08)", marginBottom: 20 }}>
        {([
          { id: "live", label: "Live Monitor" },
          { id: "batch", label: "Batch Upload" },
          { id: "flagged", label: `Flagged Transactions${allTx.filter(t=>t.is_flagged).length>0?` · ${allTx.filter(t=>t.is_flagged).length}`:""}` },
          { id: "str", label: `STR Queue${strQueue.length>0?` · ${strQueue.length}`:""}` },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: "transparent", border: "none", padding: "10px 18px", cursor: "pointer",
              fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? "#0A0A0A" : "#9B9B9B",
              borderBottom: tab === t.id ? "2px solid #0A0A0A" : "2px solid transparent",
              marginBottom: -1,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ====== LIVE MONITOR ====== */}
      {tab === "live" && (
        <>
          {liveWebhook && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            {/* Webhook card */}
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", margin: "0 0 4px" }}>Live Ingestion Endpoint</h3>
                  <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>Send transactions from your CBS for instant screening</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 8, height: 8, borderRadius: "50%", background: hasKey ? "#16A34A" : "#D1D5DB" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: hasKey ? "#16A34A" : "#9B9B9B" }}>{hasKey ? "ACTIVE" : "NOT CONFIGURED"}</span>
                </div>
              </div>

              <p style={labelStyle}>Endpoint URL</p>
              <div style={codeBoxStyle}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{WEBHOOK_URL}</span>
                <button onClick={() => copy(WEBHOOK_URL, "URL")} style={iconBtnStyle}><Copy size={13} color="#9B9B9B" /></button>
              </div>

              <p style={{ ...labelStyle, marginTop: 14 }}>API Key (x-api-key header)</p>
              <div style={codeBoxStyle}>
                <span>
                  {apiKey
                    ? (showKey ? apiKey : `${keyPrefix}${"•".repeat(28)}`)
                    : hasKey
                      ? `${keyPrefix}${"•".repeat(28)} (stored)`
                      : "No key generated yet"}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  {apiKey && (
                    <button onClick={() => setShowKey(!showKey)} style={iconBtnStyle}>
                      {showKey ? <EyeOff size={13} color="#9B9B9B" /> : <Eye size={13} color="#9B9B9B" />}
                    </button>
                  )}
                  {apiKey && <button onClick={() => copy(apiKey, "API Key")} style={iconBtnStyle}><Copy size={13} color="#9B9B9B" /></button>}
                </div>
              </div>

              <button onClick={provisionKey} disabled={provisioning}
                style={{ marginTop: 14, background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 8, padding: "10px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
                {provisioning ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                {hasKey ? "Rotate API Key" : "Generate API Key"}
              </button>
              {hasKey && !apiKey && <p style={{ fontSize: 11, color: "#9B9B9B", marginTop: 8 }}>For security, the full key is only shown once at generation. Rotate to view a new one.</p>}

              <details style={{ marginTop: 16 }}>
                <summary style={{ fontSize: 13, color: "#0A0A0A", fontWeight: 600, cursor: "pointer", userSelect: "none" }}>
                  How to connect your CBS →
                </summary>
                <div style={{ marginTop: 12, background: "#F5F5F0", borderRadius: 8, padding: 16, fontSize: 13, color: "#525252", lineHeight: 1.7 }}>
                  <p style={{ fontWeight: 600, color: "#0A0A0A", margin: "0 0 8px" }}>Option A — Nightly file drop (easiest)</p>
                  <p style={{ margin: "0 0 12px" }}>Ask your IT team to export yesterday's transactions as CSV every morning and upload via Batch Upload. We screen automatically.</p>
                  <p style={{ fontWeight: 600, color: "#0A0A0A", margin: "0 0 8px" }}>Option B — Real-time push</p>
                  <p style={{ margin: "0 0 8px" }}>Give your IT team the endpoint URL and API key above. After each transaction posts in your CBS, they POST this JSON:</p>
                  <pre style={{ background: "#0A0A0A", color: "#4ADE80", borderRadius: 6, padding: 12, fontSize: 11, overflow: "auto", margin: 0 }}>
{`{
  "account_number": "0123456789",
  "customer_name": "John Doe",
  "amount": 5500000,
  "transaction_type": "DEBIT",
  "transaction_date": "2026-05-20T14:30:00Z",
  "narration": "Transfer to beneficiary",
  "channel": "mobile",
  "branch_code": "ABJ001"
}`}
                  </pre>
                </div>
              </details>
            </div>

            {/* Today stats */}
            <div style={{ background: "#0A0A0A", borderRadius: 12, padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", margin: "0 0 20px" }}>Today's Screening Stats</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Transactions Screened", value: todayStats.total, color: "#FFFFFF" },
                  { label: "Flagged", value: todayStats.flagged, color: todayStats.flagged > 0 ? "#FCA5A5" : "#4ADE80" },
                  { label: "Critical", value: todayStats.critical, color: todayStats.critical > 0 ? "#FCA5A5" : "#FFFFFF" },
                  { label: "Cleared", value: todayStats.cleared, color: "#4ADE80" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: 14 }}>
                    <p style={{ fontSize: 28, fontWeight: 900, color: s.color, margin: "0 0 2px", letterSpacing: "-1px" }}>{s.value}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: 0 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}



          {/* Live feed */}
          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A" }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>Live Transaction Feed</span>
              </div>
              <span style={{ fontSize: 12, color: "#9B9B9B" }}>{liveTransactions.length} transactions received today</span>
            </div>

            {liveTransactions.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center" }}>
                <Activity size={32} color="#D1D5DB" style={{ marginBottom: 12 }} />
                <p style={{ fontSize: 14, color: "#9B9B9B", margin: "0 0 6px" }}>Waiting for transactions...</p>
                <p style={{ fontSize: 13, color: "#C4C4C4", margin: 0 }}>Connect your CBS using the endpoint above</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {liveTransactions.map((tx) => (
                  <motion.div key={tx.id}
                    initial={{ opacity: 0, x: -16, height: 0 }} animate={{ opacity: 1, x: 0, height: "auto" }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      padding: "14px 20px", borderBottom: "1px solid rgba(0,0,0,0.04)",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      background: tx.flag_severity === "critical" ? "rgba(220,38,38,0.03)" : tx.flag_severity === "high" ? "rgba(217,119,6,0.02)" : "#FFFFFF",
                      borderLeft: tx.is_flagged ? `3px solid ${tx.flag_severity === "critical" ? "#DC2626" : tx.flag_severity === "high" ? "#D97706" : "#2563EB"}` : "3px solid transparent",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {tx.is_flagged && <AlertTriangle size={15} color={tx.flag_severity === "critical" ? "#DC2626" : "#D97706"} style={{ flexShrink: 0 }} />}
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{tx.customer_name || "Unknown"}</p>
                        <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>
                          {tx.account_number} · {tx.channel || "—"} · {new Date(tx.transaction_date).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        {tx.is_flagged && <p style={{ fontSize: 11, color: tx.flag_severity === "critical" ? "#DC2626" : "#D97706", margin: "2px 0 0", fontWeight: 500 }}>{tx.flag_reason}</p>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: "0 0 2px" }}>{fmtNGN(tx.amount)}</p>
                      {tx.is_flagged ? (
                        <span style={{ fontSize: 10, fontWeight: 700, background: tx.flag_severity === "critical" ? "#FEF2F2" : tx.flag_severity === "high" ? "#FFFBEB" : "#EFF6FF", color: tx.flag_severity === "critical" ? "#DC2626" : tx.flag_severity === "high" ? "#D97706" : "#2563EB", borderRadius: 999, padding: "2px 8px" }}>
                          {tx.flag_severity?.toUpperCase()}
                        </span>
                      ) : (
                        <span style={{ fontSize: 10, color: "#16A34A", fontWeight: 600 }}>CLEAN ✓</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </>
      )}

      {/* ====== BATCH UPLOAD ====== */}
      {tab === "batch" && (
        <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A", margin: "0 0 6px" }}>Batch Transaction Upload</h3>
          <p style={{ fontSize: 13, color: "#6B6B6B", margin: "0 0 20px" }}>
            Upload a CSV from your CBS. We screen every row against CTR thresholds, structuring patterns, and round-figure rules.
          </p>

          <div onClick={() => fileRef.current?.click()}
            style={{ border: "2px dashed rgba(0,0,0,0.15)", borderRadius: 12, padding: 40, textAlign: "center", cursor: "pointer", background: "#FAFAF7" }}>
            <Upload size={28} color="#9B9B9B" style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A", margin: "0 0 4px" }}>
              {uploading ? "Processing..." : "Click to upload CSV"}
            </p>
            <p style={{ fontSize: 12, color: "#9B9B9B", margin: 0 }}>
              Expected columns: account_number, customer_name, amount, transaction_type, transaction_date, narration, channel
            </p>
          </div>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleBatchFile(f); }} />

          {batchResult && (
            <div style={{ marginTop: 20, background: "#F0FDF4", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 8, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <CheckCircle2 size={18} color="#16A34A" />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#16A34A", margin: 0 }}>Processed {batchResult.total} transactions</p>
                <p style={{ fontSize: 12, color: "#6B6B6B", margin: 0 }}>{batchResult.flagged} flagged for review — see Flagged Transactions tab.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====== FLAGGED ====== */}
      {tab === "flagged" && (
        <div>
          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: 16, marginBottom: 12, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9B9B9B" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search account, customer, reason..."
                style={{ width: "100%", height: 36, paddingLeft: 34, paddingRight: 12, fontSize: 13, border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, outline: "none", boxSizing: "border-box" }} />
            </div>
            {(["ALL", "AML", "FRAUD", "CTR"] as Domain[]).map((d) => {
              const active = domainFilter === d;
              const meta = d === "ALL" ? null : DOMAIN_META[d];
              const count = d === "ALL" ? allTx.filter((t) => t.is_flagged).length : domainCounts[d];
              return (
                <button key={d} onClick={() => setDomainFilter(d)}
                  style={{
                    padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                    background: active ? (meta ? meta.fg : "#0A0A0A") : "transparent",
                    color: active ? "#FFFFFF" : "#6B6B6B",
                    border: active ? "1px solid transparent" : `1px solid ${meta ? meta.border : "rgba(0,0,0,0.12)"}`,
                    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6,
                  }}>
                  {meta ? meta.short : "All Domains"}
                  <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>{count}</span>
                </button>
              );
            })}
            <span style={{ width: 1, height: 24, background: "rgba(0,0,0,0.08)" }} />
            {["all", "critical", "high", "medium"].map((s) => (
              <FilterPill key={s} label={s === "all" ? "All Severity" : s} active={severityFilter === s} onClick={() => setSeverityFilter(s)} />
            ))}
            <span style={{ width: 1, height: 24, background: "rgba(0,0,0,0.08)" }} />
            {["all", "pending", "cleared", "escalated", "reported", "dismissed"].map((s) => (
              <FilterPill key={s} label={s === "all" ? "All Status" : s} active={statusFilter === s} onClick={() => setStatusFilter(s)} />
            ))}
          </div>

          <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
            {loadingAll ? (
              <div style={{ padding: 60, textAlign: "center" }}><Loader2 size={20} color="#9B9B9B" className="animate-spin" style={{ margin: "0 auto" }} /></div>
            ) : flaggedRows.length === 0 ? (
              <div style={{ padding: 48, textAlign: "center" }}>
                <Shield size={28} color="#9B9B9B" style={{ margin: "0 auto 8px" }} />
                <p style={{ fontSize: 14, color: "#0A0A0A", fontWeight: 600 }}>No flagged transactions</p>
                <p style={{ fontSize: 12, color: "#9B9B9B", marginTop: 4 }}>All screened transactions are clean.</p>
              </div>
            ) : (
              flaggedRows.map((t) => (
                <FlaggedRow key={t.id} tx={t} expanded={expandedRow === t.id}
                  onToggle={() => setExpandedRow(expandedRow === t.id ? null : t.id)}
                  onUpdate={updateReview}
                  onGenerateSTR={generateAndDownloadSTR} />
              ))
            )}
          </div>
        </div>
      )}

      {/* ====== STR QUEUE ====== */}
      {tab === "str" && (
        <div>
          {strQueue.length === 0 ? (
            <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: 48, textAlign: "center" }}>
              <FileText size={28} color="#9B9B9B" style={{ margin: "0 auto 8px" }} />
              <p style={{ fontSize: 14, color: "#0A0A0A", fontWeight: 600 }}>STR queue is empty</p>
              <p style={{ fontSize: 12, color: "#9B9B9B", marginTop: 4 }}>Escalate flagged transactions from the Flagged tab to add them here.</p>
            </div>
          ) : (
            strQueue.map((t) => <StrCard key={t.id} tx={t} onUpdate={updateReview} onRedownload={generateAndDownloadSTR} />)
          )}
        </div>
      )}
    </div>
  );
}

// ============== SUB-COMPONENTS ==============
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        padding: "6px 12px", borderRadius: 999, fontSize: 11, fontWeight: 600,
        background: active ? "#0A0A0A" : "transparent", color: active ? "#FFFFFF" : "#6B6B6B",
        border: active ? "1px solid #0A0A0A" : "1px solid rgba(0,0,0,0.12)",
        cursor: "pointer", textTransform: "capitalize",
      }}>{label}</button>
  );
}

function FlaggedRow({ tx, expanded, onToggle, onUpdate, onGenerateSTR }: {
  tx: UnifiedTx; expanded: boolean; onToggle: () => void;
  onUpdate: (id: string, patch: Partial<UnifiedTx>) => void;
  onGenerateSTR: (tx: UnifiedTx, existingRef?: string) => void | Promise<void>;
}) {
  const sev = tx.flag_severity || "medium";
  const sevColor = sev === "critical" ? "#DC2626" : sev === "high" ? "#D97706" : "#2563EB";
  const dom = domainOf(tx.flag_rule);
  const domMeta = DOMAIN_META[dom];
  return (
    <div style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
      <div onClick={onToggle} style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderLeft: `3px solid ${sevColor}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AlertTriangle size={15} color={sevColor} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{tx.customer_name || "Unknown"}</p>
            <p style={{ fontSize: 11, color: "#9B9B9B", margin: 0 }}>
              {tx.account_number} · {new Date(tx.transaction_date).toLocaleDateString("en-NG")} · {tx.flag_rule}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, background: domMeta.bg, color: domMeta.fg, border: `1px solid ${domMeta.border}`, borderRadius: 999, padding: "2px 8px", textTransform: "uppercase" }}>{domMeta.short}</span>
          <span style={{ fontSize: 11, fontWeight: 700, background: `${sevColor}15`, color: sevColor, borderRadius: 999, padding: "2px 10px", textTransform: "uppercase" }}>{sev}</span>
          <span style={{ fontSize: 11, color: "#6B6B6B", textTransform: "capitalize" }}>{tx.review_status}</span>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: 0, minWidth: 120, textAlign: "right" }}>{fmtNGN(tx.amount)}</p>
          <ChevronDown size={14} color="#9B9B9B" style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </div>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", background: "#FAFAF7", padding: "16px 20px 20px 56px", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              <Kv label="Channel" value={tx.channel || "—"} />
              <Kv label="Type" value={tx.transaction_type || "—"} />
              <Kv label="Branch" value={tx.branch_code || "—"} />
              <Kv label="Date / Time" value={new Date(tx.transaction_date).toLocaleString("en-NG")} />
              <Kv label="Rule" value={tx.flag_rule || "—"} />
              <Kv label="Status" value={tx.review_status} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <Kv label="Narration" value={tx.narration || "—"} />
              <div style={{ marginTop: 10 }}><Kv label="Flag Reason" value={tx.flag_reason || "—"} /></div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <ActionBtn label="Clear" onClick={() => onUpdate(tx.id, { review_status: "dismissed", is_flagged: false })} />
              <ActionBtn label="Generate STR & Download" primary onClick={() => onGenerateSTR(tx)} />
              <ActionBtn label="Add Note" onClick={() => {
                const note = prompt("Add review note:", tx.review_notes || "");
                if (note !== null) onUpdate(tx.id, { review_notes: note });
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Kv({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: 10, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 2px", fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 13, color: "#0A0A0A", margin: 0 }}>{value}</p>
    </div>
  );
}

function ActionBtn({ label, onClick, primary }: { label: string; onClick: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick}
      style={{
        background: primary ? "#0A0A0A" : "#FFFFFF",
        color: primary ? "#FFFFFF" : "#0A0A0A",
        border: primary ? "1px solid #0A0A0A" : "1px solid rgba(0,0,0,0.12)",
        borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}>{label}</button>
  );
}

function StrCard({ tx, onUpdate, onRedownload }: { tx: UnifiedTx; onUpdate: (id: string, patch: Partial<UnifiedTx>) => void; onRedownload: (tx: UnifiedTx, existingRef?: string) => void | Promise<void> }) {
  const [strRef, setStrRef] = useState(tx.str_reference || "");
  const template = `SUSPICIOUS TRANSACTION REPORT (STR)
Filed under Money Laundering (Prohibition) Act, 2022

REPORTING INSTITUTION: [Your institution name]
REPORT DATE: ${new Date().toLocaleDateString("en-NG")}

SUBJECT INFORMATION
Name: ${tx.customer_name || "Unknown"}
Account Number: ${tx.account_number || "—"}

TRANSACTION DETAILS
Date: ${new Date(tx.transaction_date).toLocaleString("en-NG")}
Amount: ${fmtNGN(tx.amount)}
Type: ${tx.transaction_type || "—"}
Channel: ${tx.channel || "—"}
Branch Code: ${tx.branch_code || "—"}
Narration: ${tx.narration || "—"}

REASON FOR SUSPICION
Rule Triggered: ${tx.flag_rule || "—"}
Severity: ${(tx.flag_severity || "—").toUpperCase()}
${tx.flag_reason || ""}

REVIEW NOTES
${tx.review_notes || "(none)"}
`;
  const isFiled = tx.review_status === "reported";
  return (
    <div style={{ background: "#FFFFFF", borderRadius: 12, border: "1px solid rgba(0,0,0,0.07)", padding: 20, marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A", margin: 0 }}>{tx.customer_name} — {fmtNGN(tx.amount)}</p>
          <p style={{ fontSize: 12, color: "#6B6B6B", margin: "2px 0 0" }}>{tx.account_number} · {new Date(tx.transaction_date).toLocaleDateString("en-NG")} · {tx.flag_rule}</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, background: isFiled ? "#F0FDF4" : "#FFFBEB", color: isFiled ? "#16A34A" : "#D97706", borderRadius: 999, padding: "3px 10px", textTransform: "uppercase" }}>
          {isFiled ? `Filed · ${tx.str_reference}` : "Awaiting Filing"}
        </span>
      </div>
      <pre style={{ background: "#0A0A0A", color: "#E5E7EB", borderRadius: 8, padding: 16, fontSize: 11, lineHeight: 1.6, overflow: "auto", margin: 0, maxHeight: 280, fontFamily: "ui-monospace, monospace" }}>
{template}
      </pre>
      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => { navigator.clipboard.writeText(template); toast.success("STR template copied"); }}
          style={{ background: "#FFFFFF", color: "#0A0A0A", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <Copy size={12} /> Copy Template
        </button>
        {isFiled ? (
          <button onClick={() => onRedownload(tx, tx.str_reference || undefined)}
            style={{ background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <FileText size={12} /> Re-download STR
          </button>
        ) : (
          <>
            <input value={strRef} onChange={(e) => setStrRef(e.target.value)} placeholder="NFIU reference #"
              style={{ height: 34, borderRadius: 8, border: "1px solid rgba(0,0,0,0.12)", padding: "0 10px", fontSize: 12, outline: "none", flex: 1, maxWidth: 200 }} />
            <button onClick={() => {
              if (!strRef.trim()) { toast.error("Enter NFIU reference"); return; }
              onUpdate(tx.id, { review_status: "reported", str_reference: strRef.trim(), str_filed_at: new Date().toISOString() });
            }}
              style={{ background: "#0A0A0A", color: "#FFFFFF", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Confirm Filed
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ============== STYLES ==============
const labelStyle: React.CSSProperties = { fontSize: 11, color: "#9B9B9B", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 };
const codeBoxStyle: React.CSSProperties = { background: "#F5F5F0", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "ui-monospace, monospace", fontSize: 12, color: "#0A0A0A" };
const iconBtnStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" };
