import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/contexts/ProfileContext";

interface Report {
  id: string;
  report_name: string;
  report_type: string | null;
  status: string;
  created_at: string;
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const formatDate = () =>
  new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const StatusDot = ({ status }: { status: string }) => {
  const s = (status || "").toLowerCase();
  const color = s === "ready" ? "#3F6B4A" : s === "failed" ? "#9C2A1F" : s === "processing" ? "#B8862A" : "#5A5A57";
  return <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: color }} />;
};

const upcomingReturns = [
  { name: "CBN MFB Quarterly Return", due: "28 Jun", category: "CBN" },
  { name: "NDIC Premium Assessment", due: "30 Jun", category: "NDIC" },
  { name: "NFIU CTR — June",         due: "05 Jul", category: "NFIU" },
  { name: "SCUML Compliance Filing", due: "12 Jul", category: "SCUML" },
];

export default function DashboardOverview() {
  const { userName, institutionName } = useProfile();
  const [reports, setReports] = useState<Report[]>([]);
  const [counts, setCounts] = useState({ total: 0, ready: 0, processing: 0 });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("reports")
        .select("id, report_name, report_type, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);
      const all = (data as Report[]) || [];
      setReports(all);
      setCounts({
        total: all.length,
        ready: all.filter((r) => r.status?.toLowerCase() === "ready").length,
        processing: all.filter((r) => r.status?.toLowerCase() === "processing").length,
      });
    })();
  }, []);

  const score = 94;
  const firstName = (userName || "").split(" ")[0] || "there";

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <header className="mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">{formatDate()}</p>
        <h1 className="mt-3 font-serif text-[44px] md:text-[56px] leading-[1.05] text-ink">
          {greeting()}, {firstName}.
        </h1>
        {institutionName && (
          <p className="mt-2 font-serif italic text-[18px] text-ink-muted">{institutionName}</p>
        )}
      </header>

      {/* Top row: score + due + filed */}
      <section className="grid md:grid-cols-12 gap-8 pb-12 border-b border-ink-10">
        <div className="md:col-span-5">
          <p className="tag mb-3">Compliance score</p>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-[120px] leading-none text-ink">{score}</span>
            <span className="font-mono text-[13px] text-[var(--rust)]">+3 this week</span>
          </div>
          <p className="mt-4 text-[14px] text-ink-muted max-w-sm leading-relaxed">
            Based on filing timeliness, validation pass rate, and outstanding regulatory follow-ups.
          </p>
        </div>

        <div className="md:col-span-7 grid grid-cols-3 gap-6">
          <div>
            <p className="tag mb-3">Due this week</p>
            <p className="font-serif text-5xl text-ink">4</p>
            <p className="mt-1 font-mono text-[11px] text-ink-muted">returns</p>
          </div>
          <div>
            <p className="tag mb-3">Filed YTD</p>
            <p className="font-serif text-5xl text-ink">{counts.total || 47}</p>
            <p className="mt-1 font-mono text-[11px] text-ink-muted">on time</p>
          </div>
          <div>
            <p className="tag mb-3">In progress</p>
            <p className="font-serif text-5xl text-ink">{counts.processing}</p>
            <p className="mt-1 font-mono text-[11px] text-ink-muted">drafting</p>
          </div>
        </div>
      </section>

      {/* Mid: Due this week list + Recent reports */}
      <section className="grid md:grid-cols-12 gap-10 py-12">
        <div className="md:col-span-7">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-serif text-2xl text-ink">Due this week</h2>
            <Link to="/dashboard/calendar" className="text-[13px] text-ink-muted hover:text-ink transition-colors inline-flex items-center gap-1">
              Full calendar <ArrowRight size={12} />
            </Link>
          </div>
          <div className="border-t border-ink-10">
            {upcomingReturns.map((r) => (
              <div key={r.name} className="flex items-center justify-between py-4 border-b border-ink-10">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted w-12">{r.category}</span>
                  <span className="text-[14.5px] text-ink">{r.name}</span>
                </div>
                <span className="font-mono text-[12px] text-ink-muted">DUE {r.due}</span>
              </div>
            ))}
          </div>
          <Link to="/dashboard/new-report" className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-[var(--paper)] text-[13.5px] font-medium hover:bg-[var(--rust)] transition-colors">
            Start a new report <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="md:col-span-5">
          <h2 className="font-serif text-2xl text-ink mb-5">Recent reports</h2>
          <div className="border-t border-ink-10">
            {reports.length === 0 ? (
              <p className="py-6 text-[14px] text-ink-muted">No reports yet. Generate your first one.</p>
            ) : (
              reports.map((r) => (
                <Link key={r.id} to="/dashboard/reports" className="flex items-center justify-between py-3 border-b border-ink-10 group">
                  <div className="flex items-center gap-3 min-w-0">
                    <StatusDot status={r.status} />
                    <span className="text-[14px] text-ink truncate group-hover:text-rust transition-colors">{r.report_name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-ink-muted">{new Date(r.created_at).toLocaleDateString("en-NG", { day: "2-digit", month: "short" })}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Bottom: Agent + Intelligence */}
      <section className="grid md:grid-cols-2 gap-6 pb-8">
        <Link to="/dashboard/agent" className="group p-8 border border-ink-10 rounded-md bg-white hover:bg-[var(--paper-2)]/60 transition-colors">
          <p className="tag mb-3">Agent</p>
          <h3 className="font-serif text-2xl text-ink">Ask your compliance officer anything.</h3>
          <p className="mt-3 text-[14px] text-ink-muted leading-relaxed">
            "What is my single-obligor exposure to Customer X?" — answered with citations from your own data.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-[13px] text-ink group-hover:text-rust transition-colors">
            Open agent <ArrowRight size={13} />
          </span>
        </Link>

        <Link to="/dashboard/regulatory-intelligence" className="group p-8 border border-ink-10 rounded-md bg-white hover:bg-[var(--paper-2)]/60 transition-colors">
          <p className="tag mb-3">Regulatory intelligence</p>
          <h3 className="font-serif text-2xl text-ink">Today's CBN circulars and rule changes.</h3>
          <p className="mt-3 text-[14px] text-ink-muted leading-relaxed">
            We monitor every regulator publication so your team doesn't have to.
          </p>
          <span className="mt-5 inline-flex items-center gap-1 text-[13px] text-ink group-hover:text-rust transition-colors">
            See updates <ArrowRight size={13} />
          </span>
        </Link>
      </section>
    </div>
  );
}
