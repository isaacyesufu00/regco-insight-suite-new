import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Search, Loader2, ChevronRight, ChevronLeft, CreditCard, Activity,
  AlertTriangle, Shield, Ban, CheckCircle, FileText, Filter,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type View = "search" | "results" | "profile";

interface Customer {
  id: string;
  user_id: string;
  full_name: string;
  bvn: string | null;
  phone_number: string | null;
  email: string | null;
  customer_segment: string | null;
  account_number: string | null;
  date_of_birth: string | null;
  address: string | null;
  created_at: string;
}

const fmtNGN = (n: number | string | null | undefined) => {
  const v = Number(n || 0);
  return "₦" + v.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const fmtDateTime = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleString("en-NG", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";

export default function Customer360() {
  const { user } = useAuth();
  const [view, setView] = useState<View>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Customer[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Profile state
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [customerAccounts, setCustomerAccounts] = useState<any[]>([]);
  const [customerKyc, setCustomerKyc] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [sanctionsMatches, setSanctionsMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"accounts" | "transactions" | "kyc" | "alerts" | "sanctions">("accounts");

  // tx filters
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [channelFilter, setChannelFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredTransactions = useMemo(() => {
    let f = [...transactions];
    if (dateFrom) f = f.filter((t) => new Date(t.transaction_date) >= new Date(dateFrom));
    if (dateTo) f = f.filter((t) => new Date(t.transaction_date) <= new Date(dateTo + "T23:59:59"));
    if (amountMin) f = f.filter((t) => Number(t.amount) >= Number(amountMin));
    if (amountMax) f = f.filter((t) => Number(t.amount) <= Number(amountMax));
    if (channelFilter) f = f.filter((t) => t.channel === channelFilter);
    if (typeFilter) f = f.filter((t) => t.transaction_type === typeFilter);
    return f;
  }, [transactions, dateFrom, dateTo, amountMin, amountMax, channelFilter, typeFilter]);

  const debouncedSearch = (q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => handleSearch(q), 300);
  };

  const handleSearch = async (query: string) => {
    if (!user) return;
    if (query.trim().length < 2) {
      setResults([]);
      setView("search");
      return;
    }
    setSearching(true);
    const q = query.trim();
    try {
      const [nameRes, bvnRes, phoneRes, accountRes] = await Promise.all([
        supabase.from("customers").select("*").eq("user_id", user.id).ilike("full_name", `%${q}%`).limit(8),
        supabase.from("customers").select("*").eq("user_id", user.id).ilike("bvn", `%${q}%`).limit(5),
        supabase.from("customers").select("*").eq("user_id", user.id).ilike("phone_number", `%${q}%`).limit(5),
        supabase.from("customer_accounts").select("customer_id, account_number").eq("user_id", user.id).ilike("account_number", `%${q}%`).limit(5),
      ]);

      let fromAccounts: Customer[] = [];
      const acctRows = (accountRes.data || []) as { customer_id: string | null }[];
      if (acctRows.length) {
        const ids = [...new Set(acctRows.map((a) => a.customer_id).filter((x): x is string => Boolean(x)))];
        if (ids.length) {
          const { data } = await supabase.from("customers").select("*").in("id", ids);
          fromAccounts = (data as Customer[]) || [];
        }
      }

      const all = [
        ...((nameRes.data as Customer[]) || []),
        ...((bvnRes.data as Customer[]) || []),
        ...((phoneRes.data as Customer[]) || []),
        ...fromAccounts,
      ];
      const unique = all.filter((c, i, arr) => arr.findIndex((x) => x.id === c.id) === i);
      setResults(unique);
      setView("results");
    } finally {
      setSearching(false);
    }
  };

  const loadProfile = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setView("profile");
    setActiveTab("accounts");
    setLoadingProfile(true);
    try {
      const firstName = customer.full_name.split(" ")[0] || customer.full_name;
      const [accountsRes, kycRes, txRes, alertsRes, sanctionsRes] = await Promise.all([
        supabase.from("customer_accounts").select("*").eq("customer_id", customer.id).order("open_date", { ascending: false }),
        supabase.from("customer_kyc").select("*").eq("customer_id", customer.id).maybeSingle(),
        supabase.from("unified_transactions").select("*").eq("customer_id", customer.id).order("transaction_date", { ascending: false }).limit(50),
        customer.account_number
          ? supabase.from("transaction_reviews").select("*").eq("account_number", customer.account_number).order("transaction_date", { ascending: false }).limit(20)
          : Promise.resolve({ data: [] }),
        supabase.from("sanctions_entries").select("id, full_name, list_name, list_type").ilike("full_name", `%${firstName}%`).limit(5),
      ]);
      setCustomerAccounts(accountsRes.data || []);
      setCustomerKyc(kycRes.data || null);
      setTransactions(txRes.data || []);
      setAlerts((alertsRes as any).data || []);
      setSanctionsMatches(sanctionsRes.data || []);
    } finally {
      setLoadingProfile(false);
    }
  };

  const resetToSearch = () => {
    setView("search");
    setSelectedCustomer(null);
    setSearchQuery("");
    setResults([]);
  };

  // ============ SEARCH BAR (reusable) ============
  const SearchBar = (
    <div style={{ position: "relative", marginBottom: "12px" }}>
      <Search size={16} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9B9B9B" }} />
      <input
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          debouncedSearch(e.target.value);
        }}
        placeholder="BVN, account number, name, or phone..."
        autoFocus
        style={{
          width: "100%", height: "52px", borderRadius: "12px",
          border: "1px solid rgba(0,0,0,0.12)", background: "#FFFFFF",
          paddingLeft: "44px", paddingRight: "16px", fontSize: "15px",
          color: "#0A0A0A", outline: "none", boxSizing: "border-box",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", transition: "border-color 0.15s, box-shadow 0.15s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#0A0A0A";
          e.target.style.boxShadow = "0 0 0 3px rgba(0,0,0,0.08)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(0,0,0,0.12)";
          e.target.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
        }}
      />
      {searching && (
        <Loader2 size={15} style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#9B9B9B" }} className="animate-spin" />
      )}
    </div>
  );

  // ============ RENDER ============
  return (
    <div style={{ fontFamily: "Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif" }}>
      <AnimatePresence mode="wait">
        {view === "search" && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "80px", textAlign: "center" }}
          >
            <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Users size={24} color="#FFFFFF" />
            </div>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0A0A0A", letterSpacing: "-0.8px", marginBottom: "8px" }}>Customer 360</h1>
            <p style={{ fontSize: "15px", color: "#6B6B6B", marginBottom: "36px", lineHeight: 1.6 }}>
              Search any customer by BVN, account number, phone, or name.<br />
              See every account, KYC status, transaction, and alert — in one place.
            </p>
            {SearchBar}
            <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
              {["Search by BVN", "Account Number", "Full Name", "Phone Number"].map((t) => (
                <span key={t} style={{ fontSize: "11px", color: "#9B9B9B", background: "rgba(0,0,0,0.04)", borderRadius: "999px", padding: "4px 12px", border: "1px solid rgba(0,0,0,0.07)" }}>{t}</span>
              ))}
            </div>
          </motion.div>
        )}

        {view === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ maxWidth: "640px", margin: "0 auto", paddingTop: "32px" }}
          >
            {SearchBar}
            <p style={{ fontSize: "12px", color: "#9B9B9B", margin: "12px 0" }}>
              {results.length} result{results.length !== 1 ? "s" : ""} for "{searchQuery}"
            </p>
            {results.length === 0 && !searching && (
              <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px dashed rgba(0,0,0,0.12)", padding: "40px 24px", textAlign: "center" }}>
                <p style={{ fontSize: "14px", color: "#6B6B6B", margin: 0 }}>No customers match your search.</p>
                <p style={{ fontSize: "12px", color: "#9B9B9B", margin: "6px 0 0" }}>Try a BVN, full name, account number, or phone number.</p>
              </div>
            )}
            {results.map((customer, i) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => loadProfile(customer)}
                whileHover={{ y: -1, boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", padding: "16px 20px", marginBottom: "8px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "box-shadow 0.15s" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>{customer.full_name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{customer.full_name}</p>
                    <p style={{ fontSize: "12px", color: "#9B9B9B", margin: 0 }}>
                      BVN: {customer.bvn || "Not on file"} · {customer.customer_segment || "Retail"}
                    </p>
                  </div>
                </div>
                <ChevronRight size={16} color="#9B9B9B" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {view === "profile" && selectedCustomer && (
          <motion.div
            key="profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ maxWidth: "1080px", margin: "0 auto" }}
          >
            <button
              onClick={resetToSearch}
              style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: "#6B6B6B", fontSize: "13px", cursor: "pointer", padding: 0, marginBottom: "16px" }}
            >
              <ChevronLeft size={14} /> Back to search
            </button>

            {/* Profile header */}
            <div style={{ background: "#0A0A0A", borderRadius: "14px", padding: "28px 32px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF" }}>{selectedCustomer.full_name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#FFFFFF", margin: "0 0 4px", letterSpacing: "-0.5px" }}>{selectedCustomer.full_name}</h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
                    BVN: {selectedCustomer.bvn || "Not provided"} · {selectedCustomer.customer_segment || "Retail"} · Since {new Date(selectedCustomer.created_at).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {sanctionsMatches.length > 0 && (
                  <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "8px", padding: "8px 14px", textAlign: "center" }}>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Sanctions</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#FCA5A5", margin: 0 }}>POSSIBLE MATCH ⚠</p>
                  </div>
                )}
                <div style={{ background: customerKyc?.kyc_status === "complete" ? "rgba(22,163,74,0.15)" : "rgba(217,119,6,0.15)", borderRadius: "8px", padding: "8px 14px", textAlign: "center" }}>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>KYC</p>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: customerKyc?.kyc_status === "complete" ? "#4ADE80" : "#FCD34D", margin: 0 }}>
                    {customerKyc?.kyc_status === "complete" ? "COMPLETE ✓" : "INCOMPLETE ⚠"}
                  </p>
                </div>
              </div>
            </div>

            {/* Metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "10px", marginBottom: "20px" }}>
              {[
                { label: "Accounts", value: customerAccounts.length, icon: CreditCard, alert: false },
                { label: "Transactions", value: transactions.length, icon: Activity, alert: false },
                { label: "AML Alerts", value: alerts.filter((a) => a.flag_severity === "critical" || a.flag_severity === "high").length, icon: AlertTriangle, alert: alerts.length > 0 },
                { label: "KYC Missing", value: (customerKyc?.missing_items?.length) || 0, icon: Shield, alert: ((customerKyc?.missing_items?.length) || 0) > 0 },
                { label: "Sanctions Hits", value: sanctionsMatches.length, icon: Ban, alert: sanctionsMatches.length > 0 },
              ].map((m) => {
                const Icon = m.icon;
                const danger = m.alert && m.value > 0;
                return (
                  <div key={m.label} style={{ background: "#FFFFFF", borderRadius: "10px", border: `1px solid ${danger ? "rgba(220,38,38,0.2)" : "rgba(0,0,0,0.07)"}`, padding: "16px", textAlign: "center" }}>
                    <Icon size={16} color={danger ? "#DC2626" : "#9B9B9B"} style={{ marginBottom: "8px" }} />
                    <p style={{ fontSize: "28px", fontWeight: 900, color: danger ? "#DC2626" : "#0A0A0A", margin: "0 0 2px", letterSpacing: "-1px" }}>{m.value}</p>
                    <p style={{ fontSize: "11px", color: "#9B9B9B", margin: 0 }}>{m.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", gap: "4px", borderBottom: "1px solid rgba(0,0,0,0.08)", marginBottom: "20px" }}>
              {([
                { id: "accounts", label: "Accounts" },
                { id: "transactions", label: "Transactions" },
                { id: "kyc", label: "KYC" },
                { id: "alerts", label: "Alerts & Cases" },
                { id: "sanctions", label: "Sanctions" },
              ] as { id: typeof activeTab; label: string }[]).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: "transparent", border: "none", padding: "10px 16px",
                    fontSize: "13px", fontWeight: activeTab === tab.id ? 700 : 500,
                    color: activeTab === tab.id ? "#0A0A0A" : "#9B9B9B",
                    borderBottom: activeTab === tab.id ? "2px solid #0A0A0A" : "2px solid transparent",
                    cursor: "pointer", marginBottom: "-1px",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {loadingProfile && (
              <div style={{ background: "#FFFFFF", borderRadius: "12px", padding: "60px", textAlign: "center", border: "1px solid rgba(0,0,0,0.07)" }}>
                <Loader2 size={20} color="#9B9B9B" className="animate-spin" style={{ margin: "0 auto" }} />
                <p style={{ fontSize: "13px", color: "#9B9B9B", marginTop: "12px" }}>Loading customer profile...</p>
              </div>
            )}

            {!loadingProfile && activeTab === "accounts" && (
              <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
                {customerAccounts.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    <CreditCard size={20} color="#9B9B9B" style={{ margin: "0 auto 8px" }} />
                    <p style={{ fontSize: "13px", color: "#9B9B9B" }}>No accounts on file for this customer.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#F5F5F0" }}>
                        {["Account #", "Type", "Currency", "Balance", "Status", "Opened", "Branch"].map((h) => (
                          <th key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px", textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {customerAccounts.map((a) => (
                        <tr key={a.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                          <td style={{ padding: "14px 16px", fontSize: "13px", fontWeight: 600, color: "#0A0A0A" }}>{a.account_number}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6B6B6B" }}>{a.account_type || "—"}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6B6B6B" }}>{a.currency || "NGN"}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#0A0A0A", fontWeight: 600 }}>{fmtNGN(a.balance)}</td>
                          <td style={{ padding: "14px 16px", fontSize: "12px" }}>
                            <span style={{ background: a.status === "Active" ? "#F0FDF4" : "#FEF2F2", color: a.status === "Active" ? "#16A34A" : "#DC2626", borderRadius: "999px", padding: "2px 10px", fontWeight: 600 }}>{a.status || "—"}</span>
                          </td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6B6B6B" }}>{fmtDate(a.open_date)}</td>
                          <td style={{ padding: "14px 16px", fontSize: "13px", color: "#6B6B6B" }}>{a.branch || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {!loadingProfile && activeTab === "transactions" && (
              <div>
                {/* Filters */}
                <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", padding: "16px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <Filter size={14} color="#6B6B6B" />
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#0A0A0A", textTransform: "uppercase", letterSpacing: "0.06em" }}>Filters</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "8px" }}>
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From" style={inputStyle} />
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To" style={inputStyle} />
                    <input type="number" value={amountMin} onChange={(e) => setAmountMin(e.target.value)} placeholder="Min ₦" style={inputStyle} />
                    <input type="number" value={amountMax} onChange={(e) => setAmountMax(e.target.value)} placeholder="Max ₦" style={inputStyle} />
                    <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} style={inputStyle}>
                      <option value="">All channels</option>
                      <option value="POS">POS</option>
                      <option value="ATM">ATM</option>
                      <option value="Web">Web</option>
                      <option value="Mobile">Mobile</option>
                      <option value="Branch">Branch</option>
                      <option value="USSD">USSD</option>
                    </select>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} style={inputStyle}>
                      <option value="">All types</option>
                      <option value="Credit">Credit</option>
                      <option value="Debit">Debit</option>
                      <option value="Transfer">Transfer</option>
                    </select>
                  </div>
                </div>

                <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
                  {filteredTransactions.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center" }}>
                      <Activity size={20} color="#9B9B9B" style={{ margin: "0 auto 8px" }} />
                      <p style={{ fontSize: "13px", color: "#9B9B9B" }}>No transactions match the current filters.</p>
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "#F5F5F0" }}>
                          {["Date", "Type", "Channel", "Counterparty", "Reference", "Amount"].map((h) => (
                            <th key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px", textAlign: h === "Amount" ? "right" : "left", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.map((t) => (
                          <tr key={t.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6B6B6B" }}>{fmtDateTime(t.transaction_date)}</td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#0A0A0A" }}>{t.transaction_type || "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6B6B6B" }}>{t.channel || "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6B6B6B" }}>{t.counterparty || "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "12px", color: "#9B9B9B", fontFamily: "monospace" }}>{t.reference || "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#0A0A0A", fontWeight: 600, textAlign: "right" }}>{fmtNGN(t.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {!loadingProfile && activeTab === "kyc" && (
              <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", padding: "24px" }}>
                {!customerKyc ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Shield size={20} color="#9B9B9B" style={{ margin: "0 auto 8px" }} />
                    <p style={{ fontSize: "13px", color: "#9B9B9B" }}>No KYC record on file for this customer.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "20px" }}>
                      <KvRow label="KYC Status" value={customerKyc.kyc_status || "—"} />
                      <KvRow label="KYC Tier" value={`Tier ${customerKyc.kyc_tier ?? 1}`} />
                      <KvRow label="ID Type" value={customerKyc.id_type || "—"} />
                      <KvRow label="ID Number" value={customerKyc.id_number || "—"} />
                      <KvRow label="Last Reviewed" value={fmtDate(customerKyc.last_reviewed_at)} />
                    </div>
                    <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#0A0A0A", textTransform: "uppercase", letterSpacing: "0.06em", margin: "8px 0 12px" }}>Verification Checks</h4>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px" }}>
                      {[
                        ["ID Verified", customerKyc.id_verified],
                        ["Address Verified", customerKyc.address_verified],
                        ["BVN Verified", customerKyc.bvn_verified],
                        ["Photo Verified", customerKyc.photo_verified],
                      ].map(([label, ok]) => (
                        <div key={label as string} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", background: ok ? "#F0FDF4" : "#FEF2F2", borderRadius: "8px", border: `1px solid ${ok ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}` }}>
                          {ok ? <CheckCircle size={14} color="#16A34A" /> : <AlertTriangle size={14} color="#DC2626" />}
                          <span style={{ fontSize: "13px", color: "#0A0A0A" }}>{label as string}</span>
                        </div>
                      ))}
                    </div>
                    {(customerKyc.missing_items?.length || 0) > 0 && (
                      <div style={{ marginTop: "16px", background: "#FEF2F2", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "8px", padding: "14px" }}>
                        <p style={{ fontSize: "12px", fontWeight: 700, color: "#DC2626", margin: "0 0 8px" }}>Missing Documentation</p>
                        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "13px", color: "#0A0A0A" }}>
                          {(customerKyc.missing_items as string[]).map((m) => <li key={m}>{m}</li>)}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {!loadingProfile && activeTab === "alerts" && (
              <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
                {alerts.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center" }}>
                    <CheckCircle size={20} color="#16A34A" style={{ margin: "0 auto 8px" }} />
                    <p style={{ fontSize: "13px", color: "#0A0A0A", fontWeight: 600 }}>No alerts or cases on file</p>
                    <p style={{ fontSize: "12px", color: "#9B9B9B", marginTop: "4px" }}>This customer has a clean monitoring history.</p>
                  </div>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#F5F5F0" }}>
                        {["Date", "Case #", "Severity", "Reason", "Amount", "Status"].map((h) => (
                          <th key={h} style={{ fontSize: "11px", fontWeight: 700, color: "#6B6B6B", textTransform: "uppercase", letterSpacing: "0.06em", padding: "12px 16px", textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {alerts.map((a) => {
                        const sev = (a.flag_severity || "low").toLowerCase();
                        const sevColor = sev === "critical" || sev === "high" ? "#DC2626" : sev === "medium" ? "#D97706" : "#6B6B6B";
                        return (
                          <tr key={a.id} style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6B6B6B" }}>{fmtDate(a.transaction_date)}</td>
                            <td style={{ padding: "12px 16px", fontSize: "12px", color: "#0A0A0A", fontFamily: "monospace" }}>{a.case_number || "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "12px" }}>
                              <span style={{ background: `${sevColor}15`, color: sevColor, borderRadius: "999px", padding: "2px 10px", fontWeight: 700, textTransform: "uppercase" }}>{sev}</span>
                            </td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#0A0A0A" }}>{a.flag_reason || "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#0A0A0A", fontWeight: 600 }}>{a.amount ? fmtNGN(a.amount) : "—"}</td>
                            <td style={{ padding: "12px 16px", fontSize: "13px", color: "#6B6B6B" }}>{a.status || "Open"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {!loadingProfile && activeTab === "sanctions" && (
              <div>
                <div style={{ background: "#FFFFFF", borderRadius: "12px", border: "1px solid rgba(0,0,0,0.07)", padding: "20px", marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0A0A0A", margin: 0 }}>Sanctions & PEP Screening</h3>
                    <span style={{ fontSize: "11px", color: "#9B9B9B" }}>Last checked: {new Date().toLocaleDateString("en-NG")}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                    {["UN Security Council", "OFAC SDN", "EU Consolidated", "UK HM Treasury", "CBN Watchlist"].map((list) => (
                      <span key={list} style={{ fontSize: "11px", background: "#F0FDF4", color: "#16A34A", borderRadius: "999px", padding: "3px 10px", border: "1px solid rgba(22,163,74,0.2)" }}>✓ {list}</span>
                    ))}
                  </div>
                  {sanctionsMatches.length === 0 ? (
                    <div style={{ background: "#F0FDF4", border: "1px solid rgba(22,163,74,0.2)", borderRadius: "10px", padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <CheckCircle size={20} color="#16A34A" />
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#16A34A", margin: 0 }}>No sanctions matches found</p>
                        <p style={{ fontSize: "12px", color: "#6B6B6B", margin: 0 }}>Customer name and BVN screened against all active sanctions lists.</p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ background: "#FEF2F2", border: "1px solid rgba(220,38,38,0.2)", borderRadius: "10px", padding: "16px" }}>
                      <p style={{ fontSize: "14px", fontWeight: 700, color: "#DC2626", margin: "0 0 12px" }}>⚠ Possible sanctions match — review required</p>
                      {sanctionsMatches.map((match) => (
                        <div key={match.id} style={{ background: "#FFFFFF", borderRadius: "8px", padding: "12px 14px", marginBottom: "8px", border: "1px solid rgba(220,38,38,0.15)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: "#0A0A0A", margin: 0 }}>{match.full_name}</p>
                            <span style={{ fontSize: "11px", background: "#FEF2F2", color: "#DC2626", borderRadius: "999px", padding: "2px 8px", fontWeight: 600 }}>{match.list_name}</span>
                          </div>
                          <p style={{ fontSize: "12px", color: "#6B6B6B", margin: "4px 0 0" }}>Type: {match.list_type} · Action: Review and file STR if confirmed</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: "36px",
  borderRadius: "8px",
  border: "1px solid rgba(0,0,0,0.12)",
  background: "#FFFFFF",
  padding: "0 10px",
  fontSize: "12px",
  color: "#0A0A0A",
  outline: "none",
  fontFamily: "inherit",
};

function KvRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: "10px", color: "#9B9B9B", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px", fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: "14px", color: "#0A0A0A", margin: 0, fontWeight: 500 }}>{value}</p>
    </div>
  );
}
