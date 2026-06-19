import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ComposedChart,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";

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

const ledgerRows = [
  { id: "TXN-92041", entity: "Adebayo Holdings Ltd",  rule: "CBN Rule 4 — Split deposits",      score: 0.92 },
  { id: "TXN-92038", entity: "Okonkwo, C.",            rule: "Velocity > ₦10M in 24h",          score: 0.81 },
  { id: "TXN-92033", entity: "Sunrise Trading Co.",    rule: "Counter-party in OFAC SDN",       score: 0.97 },
  { id: "TXN-92027", entity: "Mensah, A.",             rule: "Narration mismatch — invoice",    score: 0.64 },
  { id: "TXN-92019", entity: "Globalpay Nigeria",      rule: "Structuring — 11 sub-CTR debits", score: 0.88 },
  { id: "TXN-92014", entity: "Bola Estates Ltd",       rule: "Dormant account reactivation",    score: 0.45 },
];

const FraudView = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPI label="Processing latency" value="87ms"  delta="−4ms (target <100ms)" tone="positive" />
      <KPI label="Alerts triaged"     value="142"   delta="+18 vs last week" />
      <KPI label="False-positive ratio" value="6.4%" delta="−1.1pp" tone="positive" />
      <KPI label="Cleared volume (₦)" value="₦4.82B" delta="+₦480M wk" tone="positive" />
    </div>

    <Card>
      <SectionTitle right={<span className="text-[11px] font-mono text-[var(--ink-3)]">Last 7 days</span>}>
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

    <Card className="!p-0">
      <div className="px-5 pt-5 pb-3 flex items-baseline justify-between">
        <h3 className="text-[14px] font-semibold text-[var(--navy)]">Smart risk ledger</h3>
        <span className="text-[11px] font-mono text-[var(--ink-3)]">6 of 142</span>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] border-t border-[var(--line)]">
            <th className="px-5 py-2.5 font-normal">Transaction</th>
            <th className="px-5 py-2.5 font-normal">Entity</th>
            <th className="px-5 py-2.5 font-normal">Triggering control</th>
            <th className="px-5 py-2.5 font-normal text-right">Risk</th>
          </tr>
        </thead>
        <tbody>
          {ledgerRows.map((r) => {
            const tone = r.score >= 0.85 ? "var(--red)" : r.score >= 0.6 ? "#B8862A" : "var(--green)";
            return (
              <tr key={r.id} className="border-t border-[var(--line)]">
                <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{r.id}</td>
                <td className="px-5 py-3 text-[var(--navy)]">{r.entity}</td>
                <td className="px-5 py-3 text-[var(--ink-2)]">{r.rule}</td>
                <td className="px-5 py-3 font-mono text-right" style={{ color: tone }}>{r.score.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  </div>
);

// ─── Tab 2: Identity & Screening ───────────────────────────────────────
const owners = [
  { name: "Adebayo Holdings Ltd",  cac: "RC-1284091", ubo: "Adebayo, T.",   stake: "62%", verified: true },
  { name: "Globalpay Nigeria Ltd", cac: "RC-3041928", ubo: "Okeke, F.",     stake: "100%", verified: true },
  { name: "Bola Estates Ltd",      cac: "RC-1990842", ubo: "Bola, J.",      stake: "55%", verified: false },
  { name: "Sunrise Trading Co.",   cac: "RC-2811209", ubo: "Ahmed, K.",     stake: "70%", verified: true },
];

const sanctions = [
  { name: "Okonkwo, Chidi",  bvn: "2210***482", un: "clear", ofac: "clear", eu: "clear",  hmt: "clear", cbn: "clear" },
  { name: "Mensah, Akua",    bvn: "1947***203", un: "clear", ofac: "hit",   eu: "clear",  hmt: "clear", cbn: "clear" },
  { name: "Adebayo, Tunde",  bvn: "3072***118", un: "clear", ofac: "clear", eu: "clear",  hmt: "clear", cbn: "clear" },
  { name: "Sani, Musa",      bvn: "1184***937", un: "clear", ofac: "clear", eu: "review", hmt: "clear", cbn: "clear" },
];

const Pill: React.FC<{ status: string }> = ({ status }) => {
  const m =
    status === "hit"    ? { bg: "var(--red-soft)",   fg: "var(--red)" } :
    status === "review" ? { bg: "#FFF7E6",            fg: "#B8862A" } :
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

const IdentityView = () => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPI label="Customers screened (24h)" value="1,284" delta="+96" tone="positive" />
      <KPI label="Sanctions hits"           value="3"     delta="2 OFAC · 1 EU" tone="negative" />
      <KPI label="PEP matches"              value="12"    delta="9 pending review" />
      <KPI label="UBO completeness"         value="94.2%" delta="+1.3pp" tone="positive" />
    </div>

    <Card className="!p-0">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-[14px] font-semibold text-[var(--navy)]">Corporate alignment matrix</h3>
        <p className="text-[11.5px] text-[var(--ink-3)] mt-1">Beneficial owners reconciled against CAC.</p>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] border-t border-[var(--line)]">
            <th className="px-5 py-2.5 font-normal">Entity</th>
            <th className="px-5 py-2.5 font-normal">CAC No.</th>
            <th className="px-5 py-2.5 font-normal">Ultimate beneficial owner</th>
            <th className="px-5 py-2.5 font-normal">Stake</th>
            <th className="px-5 py-2.5 font-normal text-right">CAC status</th>
          </tr>
        </thead>
        <tbody>
          {owners.map((o) => (
            <tr key={o.cac} className="border-t border-[var(--line)]">
              <td className="px-5 py-3 text-[var(--navy)]">{o.name}</td>
              <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{o.cac}</td>
              <td className="px-5 py-3 text-[var(--ink-2)]">{o.ubo}</td>
              <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{o.stake}</td>
              <td className="px-5 py-3 text-right">
                <Pill status={o.verified ? "verified" : "review"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>

    <Card className="!p-0">
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-[14px] font-semibold text-[var(--navy)]">Sanctions verification board</h3>
        <p className="text-[11.5px] text-[var(--ink-3)] mt-1">Cross-checked against UN, OFAC, EU, UK HMT, CBN watchlists.</p>
      </div>
      <table className="w-full text-[13px]">
        <thead>
          <tr className="text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] border-t border-[var(--line)]">
            <th className="px-5 py-2.5 font-normal">Customer</th>
            <th className="px-5 py-2.5 font-normal">BVN</th>
            <th className="px-5 py-2.5 font-normal">UN</th>
            <th className="px-5 py-2.5 font-normal">OFAC</th>
            <th className="px-5 py-2.5 font-normal">EU</th>
            <th className="px-5 py-2.5 font-normal">HMT</th>
            <th className="px-5 py-2.5 font-normal">CBN</th>
          </tr>
        </thead>
        <tbody>
          {sanctions.map((s) => (
            <tr key={s.bvn} className="border-t border-[var(--line)]">
              <td className="px-5 py-3 text-[var(--navy)]">{s.name}</td>
              <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{s.bvn}</td>
              <td className="px-5 py-3"><Pill status={s.un} /></td>
              <td className="px-5 py-3"><Pill status={s.ofac} /></td>
              <td className="px-5 py-3"><Pill status={s.eu} /></td>
              <td className="px-5 py-3"><Pill status={s.hmt} /></td>
              <td className="px-5 py-3"><Pill status={s.cbn} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </div>
);

// ─── Tab 3: Regulatory Returns ─────────────────────────────────────────
type ReturnRow = { code: string; name: string; cycle: string; due: string; status: "Draft" | "Validating" | "Submitted" | "Acknowledged" };

const returns: ReturnRow[] = [
  { code: "CBN",  name: "MFB Quarterly Return",          cycle: "Quarterly", due: "28 Jun", status: "Draft" },
  { code: "CBN",  name: "Monetary Policy Return",         cycle: "Monthly",   due: "05 Jul", status: "Validating" },
  { code: "CBN",  name: "Prudential Return",              cycle: "Quarterly", due: "30 Jun", status: "Draft" },
  { code: "NDIC", name: "Premium Assessment (0.40%)",     cycle: "Quarterly", due: "30 Jun", status: "Submitted" },
  { code: "NDIC", name: "Single-Obligor Disclosure",      cycle: "Quarterly", due: "30 Jun", status: "Acknowledged" },
  { code: "NFIU", name: "AML/CFT Quarterly",              cycle: "Quarterly", due: "15 Jul", status: "Draft" },
  { code: "NFIU", name: "CTR — June",                     cycle: "Daily",     due: "05 Jul", status: "Validating" },
  { code: "NFIU", name: "International Transfers",        cycle: "Monthly",   due: "05 Jul", status: "Draft" },
  { code: "SCUML",name: "Annual Compliance",              cycle: "Annual",    due: "31 Dec", status: "Draft" },
  { code: "FIRS", name: "VAT (7.5%)",                     cycle: "Monthly",   due: "21 Jul", status: "Draft" },
  { code: "FIRS", name: "PAYE",                           cycle: "Monthly",   due: "10 Jul", status: "Submitted" },
  { code: "FIRS", name: "WHT",                            cycle: "Monthly",   due: "21 Jul", status: "Draft" },
];

const StatusBadge: React.FC<{ s: ReturnRow["status"] }> = ({ s }) => {
  const m =
    s === "Acknowledged" ? { bg: "var(--green-soft)", fg: "var(--green)" } :
    s === "Submitted"    ? { bg: "var(--blue-soft)",  fg: "var(--blue)" } :
    s === "Validating"   ? { bg: "#FFF7E6",           fg: "#B8862A" } :
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

const ReturnsView = () => {
  const buckets = ["Daily", "Monthly", "Quarterly", "Annual"];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPI label="Returns due (30d)"  value="12"  delta="4 this week" />
        <KPI label="Filed YTD"          value="47"  delta="100% on time" tone="positive" />
        <KPI label="Validation errors"  value="3"   delta="−6 vs last cycle" tone="positive" />
        <KPI label="Avg. compile time"  value="6m"  delta="−42% vs manual" tone="positive" />
      </div>

      {buckets.map((b) => {
        const rows = returns.filter((r) => r.cycle === b);
        if (!rows.length) return null;
        return (
          <Card key={b} className="!p-0">
            <div className="px-5 pt-5 pb-3 flex items-baseline justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--navy)]">{b} returns</h3>
              <span className="text-[11px] font-mono text-[var(--ink-3)]">{rows.length}</span>
            </div>
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11px] font-mono uppercase tracking-[0.14em] text-[var(--ink-3)] border-t border-[var(--line)]">
                  <th className="px-5 py-2.5 font-normal w-20">Regulator</th>
                  <th className="px-5 py-2.5 font-normal">Return</th>
                  <th className="px-5 py-2.5 font-normal w-24">Due</th>
                  <th className="px-5 py-2.5 font-normal w-32">Status</th>
                  <th className="px-5 py-2.5 font-normal w-32 text-right">Export</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={`${r.code}-${r.name}`} className="border-t border-[var(--line)]">
                    <td className="px-5 py-3 font-mono text-[11px] tracking-[0.1em] text-[var(--ink-3)]">{r.code}</td>
                    <td className="px-5 py-3 text-[var(--navy)]">{r.name}</td>
                    <td className="px-5 py-3 font-mono text-[12.5px] text-[var(--ink-2)]">{r.due}</td>
                    <td className="px-5 py-3"><StatusBadge s={r.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <button className="h-7 px-3 text-[11.5px] font-mono uppercase tracking-[0.1em] border border-[var(--line)] rounded text-[var(--navy)] hover:bg-[#F5F5F5]">
                        XML
                      </button>
                      <button className="ml-1 h-7 px-3 text-[11.5px] font-mono uppercase tracking-[0.1em] border border-[var(--line)] rounded text-[var(--navy)] hover:bg-[#F5F5F5]">
                        JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        );
      })}
    </div>
  );
};

// ─── Workspace shell ───────────────────────────────────────────────────
export default function DashboardWorkspace() {
  const [tab, setTab] = useState<TabId>("fraud");
  const { userName } = useProfile();

  // Lightweight presence ping
  useEffect(() => { void supabase.auth.getUser(); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top tab bar */}
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
                    <span
                      className="absolute left-0 right-0 -bottom-px h-[2px]"
                      style={{ background: "var(--blue)" }}
                    />
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

      {/* Canvas body */}
      <div className="flex-1 px-6 py-6 bg-[#FAFBFC]">
        <div className="max-w-[1100px] mx-auto">
          {tab === "fraud"    && <FraudView />}
          {tab === "identity" && <IdentityView />}
          {tab === "returns"  && <ReturnsView />}
        </div>
      </div>
    </div>
  );
}
