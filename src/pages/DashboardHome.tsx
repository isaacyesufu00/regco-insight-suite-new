import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, CalendarDays, FilePlus, Download, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ComplianceGauge } from "@/components/ComplianceGauge";

interface Profile {
  full_name: string | null;
  company_name: string | null;
  rc_number: string | null;
  account_status: string;
}

interface Report {
  id: string;
  report_name: string;
  report_type: string | null;
  status: string;
  created_at: string;
  file_path: string | null;
  reporting_period_start: string | null;
  reporting_period_end: string | null;
  pdf_url: string | null;
}

const statusColors: Record<string, { bg: string; color: string }> = {
  Ready: { bg: "rgba(52,199,89,0.12)", color: "#34C759" },
  Processing: { bg: "rgba(255,159,10,0.12)", color: "#FF9F0A" },
  Failed: { bg: "rgba(255,59,48,0.12)", color: "#FF3B30" },
  Pending: { bg: "rgba(142,142,147,0.12)", color: "#8E8E93" },
};

const DashboardHome = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [profileRes, reportsRes] = await Promise.all([
        supabase.from("profiles").select("full_name, company_name, rc_number, account_status").eq("id", user.id).maybeSingle(),
        supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      if (profileRes.data) setProfile(profileRes.data);
      if (reportsRes.data) setReports(reportsRes.data);
      setLoading(false);
    };

    fetchData();

    const channel = supabase
      .channel("reports-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` }, (payload) => {
        if (payload.eventType === "INSERT") {
          setReports((prev) => [payload.new as Report, ...prev]);
        } else if (payload.eventType === "UPDATE") {
          const updated = payload.new as Report;
          setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          if (updated.status === "Ready") {
            toast({ title: "Report ready", description: `"${updated.report_name}" is ready to download.` });
          }
        } else if (payload.eventType === "DELETE") {
          setReports((prev) => prev.filter((r) => r.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, toast]);

  const handleDownload = async (filePath: string, reportName: string) => {
    const { data } = await supabase.storage.from("reports").createSignedUrl(filePath, 3600);
    if (data?.signedUrl) {
      const a = document.createElement("a");
      a.href = data.signedUrl;
      a.download = reportName;
      a.click();
    }
  };

  const now = new Date();
  const thisMonth = reports.filter((r) => {
    const d = new Date(r.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const totalReports = reports.length;
  const processing = reports.filter((r) => r.status === "Processing").length;
  const ready = reports.filter((r) => r.status === "Ready").length;
  const failed = reports.filter((r) => r.status === "Failed").length;
  const recentReports = reports.slice(0, 10);
  const latestType = reports[0]?.report_type || "No reports yet";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <svg className="w-8 h-8 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#0066CC" strokeWidth="2" strokeDasharray="31.4 31.4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-w-6xl">
      {/* Institution header card */}
      <div
        style={{
          background: "white",
          borderRadius: 13,
          border: "1px solid rgba(0,0,0,0.06)",
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34C759" }} />
          <span style={{ fontSize: 13, color: "#6E6E73" }}>{profile?.company_name || "Institution"}</span>
          <span style={{ color: "#6E6E73" }}>—</span>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#1D1D1F" }}>{latestType}</span>
        </div>
        <div
          className="flex items-center justify-center"
          style={{ width: 30, height: 30, borderRadius: "50%", background: "#1D1D1F", color: "white", fontSize: 12, fontWeight: 700 }}
        >
          {totalReports}
        </div>
      </div>

      {/* Status cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Pending", value: reports.filter((r) => r.status === "Pending").length, status: "Pending", icon: Clock },
          { label: "Processing", value: processing, status: "Processing", icon: Clock },
          { label: "Ready", value: ready, status: "Ready", icon: CheckCircle },
          { label: "Failed", value: failed, status: "Failed", icon: AlertTriangle },
        ].map((c) => {
          const sc = statusColors[c.status] || statusColors.Pending;
          return (
            <div
              key={c.label}
              style={{
                background: "white",
                borderRadius: 13,
                border: "1px solid rgba(0,0,0,0.06)",
                padding: 22,
              }}
            >
              <div
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-3"
                style={{ background: sc.bg, color: sc.color, fontSize: 11, fontWeight: 500 }}
              >
                <c.icon size={12} strokeWidth={1.5} />
                {c.label}
              </div>
              <p style={{ fontWeight: 900, fontSize: 44, color: "#1D1D1F", lineHeight: 1 }}>{c.value}</p>
              <p style={{ fontSize: 14, color: "#1D1D1F", marginTop: 4 }}>reports</p>
              <p style={{ fontSize: 12, color: "#AAAAAA", marginTop: 2 }}>All time</p>
            </div>
          );
        })}
      </div>

      {/* Compliance Score */}
      <ComplianceGauge />

      {/* Recent Reports Table */}
      <div
        style={{
          background: "white",
          borderRadius: 13,
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div className="flex items-center justify-between p-5">
          <h2 style={{ fontWeight: 700, fontSize: 18, color: "#1D1D1F" }}>Recent Reports</h2>
          {reports.length > 0 && (
            <Link to="/dashboard/reports" style={{ fontSize: 14, color: "#0066CC", textDecoration: "none" }}>
              View All
            </Link>
          )}
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-16 px-4">
            <FileText size={40} strokeWidth={1} style={{ color: "#AAAAAA", margin: "0 auto 16px" }} />
            <h3 style={{ fontWeight: 600, fontSize: 18, color: "#1D1D1F" }}>No reports yet</h3>
            <p style={{ fontSize: 14, color: "#6E6E73", marginTop: 4 }}>Create your first CBN return to get started.</p>
            <Link
              to="/dashboard/new-report"
              className="inline-flex items-center gap-2 mt-6"
              style={{ background: "#0066CC", color: "white", borderRadius: 980, padding: "10px 20px", fontSize: 14, textDecoration: "none" }}
            >
              <FilePlus size={16} strokeWidth={1.5} />
              Create Report
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ background: "#FAFAFA", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Report Name", "Type", "Period", "Created", "Status", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      fontSize: 11,
                      color: "#AAAAAA",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      fontWeight: 500,
                      padding: "11px 18px",
                      textAlign: h === "" ? "right" : "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentReports.map((r) => {
                const sc = statusColors[r.status] || statusColors.Pending;
                return (
                  <tr
                    key={r.id}
                    style={{ borderTop: "1px solid rgba(0,0,0,0.04)" }}
                    className="hover:bg-black/[0.02] transition-colors"
                  >
                    <td style={{ padding: "12px 18px", fontSize: 13, fontWeight: 500, color: "#1D1D1F" }}>
                      {r.report_name}
                    </td>
                    <td style={{ padding: "12px 18px", fontSize: 13, color: "#6E6E73" }}>{r.report_type || "—"}</td>
                    <td style={{ padding: "12px 18px", fontSize: 13, color: "#6E6E73" }}>
                      {r.reporting_period_start && r.reporting_period_end
                        ? `${new Date(r.reporting_period_start).toLocaleDateString()} – ${new Date(r.reporting_period_end).toLocaleDateString()}`
                        : "—"}
                    </td>
                    <td style={{ padding: "12px 18px", fontSize: 13, color: "#6E6E73" }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full"
                        style={{ fontSize: 12, fontWeight: 500, background: sc.bg, color: sc.color }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      {r.status === "Ready" && r.file_path && (
                        <button
                          onClick={() => handleDownload(r.file_path!, r.report_name)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#0066CC",
                            fontSize: 13,
                            cursor: "pointer",
                          }}
                        >
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
