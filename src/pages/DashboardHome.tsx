import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Profile { company_name: string | null; }
interface Report { id: string; report_name: string; report_type: string | null; status: string; created_at: string; file_path: string | null; reporting_period_start: string | null; reporting_period_end: string | null; pdf_url: string | null; report_url: string | null; }

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  Pending: { label: "Pending", bg: "rgba(142,142,147,0.12)", color: "#8E8E93" },
  Processing: { label: "Processing", bg: "rgba(255,159,10,0.12)", color: "#FF9F0A" },
  Ready: { label: "Ready", bg: "rgba(52,199,89,0.12)", color: "#34C759" },
  Failed: { label: "Failed", bg: "rgba(255,59,48,0.12)", color: "#FF3B30" },
};

const StatusPill = ({ status }: { status: string }) => {
  const s = STATUS_STYLE[status] || STATUS_STYLE.Pending;
  return <span style={{ display: "inline-block", background: s.bg, color: s.color, borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 500 }}>{s.label}</span>;
};

const DashboardHome = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("company_name").eq("id", user.id).maybeSingle(),
      supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]).then(([p, r]) => { if (p.data) setProfile(p.data); if (r.data) setReports(r.data as Report[]); setLoading(false); });
    const channel = supabase.channel("dashboard-home").on("postgres_changes", { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` }, (payload) => {
      if (payload.eventType === "INSERT") setReports((p) => [payload.new as Report, ...p]);
      else if (payload.eventType === "UPDATE") { const u = payload.new as Report; setReports((p) => p.map((r) => (r.id === u.id ? u : r))); if (u.status === "Ready") toast({ title: "Report ready", description: `"${u.report_name}" is ready to download.` }); }
      else if (payload.eventType === "DELETE") setReports((p) => p.filter((r) => r.id !== (payload.old as { id: string }).id));
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, toast]);

  const handleDownload = async (r: Report) => {
    let url: string | null = null;
    if (r.report_url) { const { data } = supabase.storage.from("reports").getPublicUrl(r.report_url); url = data?.publicUrl || null; }
    else if (r.pdf_url) url = r.pdf_url;
    else if (r.file_path) { const { data } = await supabase.storage.from("reports").createSignedUrl(r.file_path, 3600); url = data?.signedUrl || null; }
    if (!url) { toast({ title: "Download unavailable", description: "Try again shortly.", variant: "destructive" }); return; }
    const a = document.createElement("a"); a.href = url; a.download = r.report_name; a.click();
  };

  const counts = { Pending: reports.filter((r) => r.status === "Pending").length, Processing: reports.filter((r) => r.status === "Processing").length, Ready: reports.filter((r) => r.status === "Ready").length, Failed: reports.filter((r) => r.status === "Failed").length };
  const recentReports = reports.slice(0, 8);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#0066CC" }} /></div>;

  const card: React.CSSProperties = { background: "#FFFFFF", borderRadius: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" };

  return (
    <div className="space-y-4 page-fade-in">
      <div style={{ ...card, padding: "20px 24px" }} className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#34C759] inline-block" />
            <span className="text-[14px] text-[#6E6E73]">{profile?.company_name || "Your Institution"}</span>
          </div>
          <h2 className="text-[20px] font-semibold text-[#1D1D1F] mt-1">{reports[0]?.report_name || "No reports yet"}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{ s: "Pending", sub: "Awaiting upload" }, { s: "Processing", sub: "Validating CBS data" }, { s: "Ready", sub: "Available to download" }, { s: "Failed", sub: "Needs attention" }].map((c) => (
          <div key={c.s} style={{ ...card, padding: 24 }}>
            <StatusPill status={c.s} />
            <p className="text-[48px] font-black text-[#1D1D1F] mt-4" style={{ lineHeight: 1, letterSpacing: -1 }}>{counts[c.s as keyof typeof counts]}</p>
            <p className="text-[13px] text-[#6E6E73] mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <div style={{ ...card, overflow: "hidden" }}>
        <div className="flex items-center justify-between" style={{ background: "#F5F5F7", padding: "14px 20px" }}>
          <h3 className="text-[14px] font-semibold text-[#1D1D1F]">Recent Reports</h3>
          <Link to="/dashboard/reports" className="text-[13px] text-[#0066CC]" style={{ backgroundImage: "none" }}>View all →</Link>
        </div>
        {recentReports.length === 0 ? (
          <div className="text-center py-12 px-6"><p className="text-[14px] text-[#6E6E73]">No reports yet. <Link to="/dashboard/new-report" className="text-[#0066CC] font-medium" style={{ backgroundImage: "none" }}>Create your first report</Link>.</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr style={{ background: "#F5F5F7" }}>{["REPORT", "TYPE", "PERIOD", "STATUS", "DATE", "ACTION"].map((h) => <th key={h} className="text-left text-[11px] font-medium text-[#6E6E73] uppercase tracking-wider" style={{ padding: "12px 20px" }}>{h}</th>)}</tr></thead>
              <tbody>{recentReports.map((r) => (
                <tr key={r.id} className="hover:bg-[rgba(0,0,0,0.02)] transition-colors" style={{ borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                  <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 500, color: "#1D1D1F" }}>{r.report_name}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#6E6E73" }}>{r.report_type || "—"}</td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#6E6E73" }}>{r.reporting_period_start && r.reporting_period_end ? `${new Date(r.reporting_period_start).toLocaleDateString()} – ${new Date(r.reporting_period_end).toLocaleDateString()}` : "—"}</td>
                  <td style={{ padding: "14px 20px" }}><StatusPill status={r.status} /></td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "#86868B" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "14px 20px" }}>{r.status === "Ready" ? <button onClick={() => handleDownload(r)} className="text-[13px] font-medium text-[#0066CC] hover:underline">Download</button> : <Link to="/dashboard/reports" className="text-[13px] text-[#6E6E73] hover:underline" style={{ backgroundImage: "none" }}>View</Link>}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
