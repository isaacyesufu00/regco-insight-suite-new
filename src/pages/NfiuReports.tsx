import { useEffect, useCallback, useState } from "react";
import {
  FileWarning, RefreshCw, Download, Copy, Check, Send,
  ChevronRight, AlertCircle, FileCode2, Plus, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type ReportType = "STR" | "CTR" | "FTR";
type ReportStatus = "draft" | "reviewed" | "filed";

interface NfiuReport {
  id: string;
  user_id: string;
  report_type: ReportType;
  case_id: string;
  xml_content: string | null;
  status: ReportStatus;
  filed_at: string | null;
  created_at: string;
  updated_at: string;
}

const typeColors: Record<ReportType, string> = {
  STR: "bg-rose-50 text-rose-700 border-rose-100",
  CTR: "bg-amber-50 text-amber-700 border-amber-100",
  FTR: "bg-blue-50 text-blue-700 border-blue-100",
};

const statusColors: Record<ReportStatus, string> = {
  draft: "bg-neutral-100 text-neutral-600 border-neutral-200",
  reviewed: "bg-indigo-50 text-indigo-700 border-indigo-100",
  filed: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function NfiuReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<NfiuReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<NfiuReport | null>(null);
  const [generating, setGenerating] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("nfiu_reports")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      const rows = (data as unknown as NfiuReport[]) || [];
      setReports(rows);
      setSelected((prev) => prev ?? rows[0] ?? null);
    } catch (e) {
      console.error("Failed to load NFIU reports:", e);
      toast.error(e instanceof Error ? e.message : "Failed to load NFIU reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadReports();
  }, [user, loadReports]);

  const generateFromCase = async (caseId: string) => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-nfiu-report", {
        body: { case_id: caseId },
      });
      if (error) throw error;
      toast.success(`GoAML ${data.report_type} report generated (${data.filing_number}).`);
      await loadReports();
      const fresh = reports.find((r) => r.id === data.report_id);
      if (fresh) setSelected(fresh);
    } catch (e) {
      console.error("generate-nfiu-report error:", e);
      toast.error(e instanceof Error ? e.message : "Failed to generate report");
    } finally {
      setGenerating(false);
    }
  };

  const submitReport = async (reportId: string) => {
    setSubmittingId(reportId);
    try {
      const { data, error } = await supabase.functions.invoke("submit-nfiu", {
        body: { report_id: reportId },
      });
      if (error) throw error;
      toast.success(data.message || "Report filed with NFIU.");
      await loadReports();
    } catch (e) {
      console.error("submit-nfiu error:", e);
      toast.error(e instanceof Error ? e.message : "Failed to file report");
    } finally {
      setSubmittingId(null);
    }
  };

  const downloadXml = (report: NfiuReport) => {
    if (!report.xml_content) {
      toast.error("No XML content to download");
      return;
    }
    const blob = new Blob([report.xml_content], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nfiu_${report.report_type}_${report.id.slice(0, 8)}.xml`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("XML downloaded");
  };

  const copyXml = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("XML copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-ink-10 pb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-ink text-[var(--paper)] flex items-center justify-center shadow-sm">
            <FileWarning className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-serif text-3xl text-ink tracking-tight">NFIU / CBN Reporting</h1>
            <p className="text-[13.5px] text-ink-muted mt-1 max-w-xl">
              CBN Pillar 5 Compliance: Generate GoAML 4.0 STR / CTR / FTR filings from investigation cases and submit to NFIU.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadReports}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-[13px] font-medium border border-ink-10 text-ink hover:bg-[var(--paper-2)]/60 transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </button>
        </div>
      </div>

      {/* Generate-from-case bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-[var(--paper-2)]/40 border border-ink-10 rounded-xl">
        <Plus className="w-4 h-4 text-ink-muted" />
        <span className="text-[13px] text-ink">Generate a report from an existing case:</span>
        <input
          id="case-id-input"
          placeholder="Paste case UUID..."
          className="bg-white border border-ink-10 px-3 py-1.5 rounded-lg text-[13px] text-ink outline-none focus:ring-1 focus:ring-ink/20 w-72"
        />
        <button
          onClick={() => {
            const el = document.getElementById("case-id-input") as HTMLInputElement | null;
            const v = el?.value?.trim();
            if (!v) {
              toast.error("Enter a case UUID");
              return;
            }
            generateFromCase(v);
          }}
          disabled={generating}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium bg-ink text-[var(--paper)] hover:bg-ink/90 transition-all disabled:opacity-60"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCode2 className="w-4 h-4" />}
          {generating ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* List */}
        <div className="lg:col-span-2 border border-ink-10 rounded-xl bg-white overflow-hidden shadow-sm">
          <div className="p-4 border-b border-ink-10 flex items-center justify-between">
            <span className="text-[13px] font-medium text-ink">Filed &amp; Draft Reports</span>
            <span className="text-[11px] font-mono text-ink-muted">{reports.length} total</span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-ink-muted text-[13px]">
                <Loader2 className="w-6 h-6 animate-spin text-ink-muted/60" />
                <span>Loading reports...</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="py-20 text-center text-ink-muted space-y-2">
                <AlertCircle className="w-8 h-8 mx-auto text-ink-muted/40" />
                <p className="text-[13px]">No reports yet. Generate one from a case above.</p>
              </div>
            ) : (
              <table className="w-full text-[13px] border-collapse">
                <thead>
                  <tr className="text-left text-ink-muted border-b border-ink-10 bg-[var(--paper-2)]/40 font-mono text-[10.5px] uppercase tracking-wider">
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Case</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => {
                    const isSel = selected?.id === r.id;
                    return (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className={`border-b border-ink-10 last:border-0 hover:bg-[var(--paper-2)]/30 cursor-pointer transition-colors ${isSel ? "bg-[var(--paper-2)]/60" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${typeColors[r.report_type]}`}>{r.report_type}</span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-ink-muted whitespace-nowrap">{r.case_id.slice(0, 8)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-[11px] rounded border capitalize ${statusColors[r.status]}`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3 text-ink-muted whitespace-nowrap font-mono text-[11px]">
                          {new Date(r.updated_at).toLocaleString("en-NG", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <ChevronRight className={`w-4 h-4 text-ink-muted/50 transition-transform ${isSel ? "translate-x-0.5 text-ink" : ""}`} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail / XML panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-ink-10 rounded-xl bg-white p-5 shadow-sm min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between border-b border-ink-10 pb-3">
              <h3 className="text-[14px] font-semibold text-ink flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-ink-muted" /> GoAML XML
              </h3>
              {selected && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => selected.xml_content && copyXml(selected.xml_content)}
                    title="Copy XML"
                    className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-[var(--paper-2)]/60 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => downloadXml(selected)}
                    title="Download XML"
                    className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-[var(--paper-2)]/60 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {selected ? (
              <div className="flex-1 flex flex-col gap-3 pt-3 min-h-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 text-[11px] font-semibold rounded border ${typeColors[selected.report_type]}`}>{selected.report_type}</span>
                  <span className={`px-2 py-0.5 text-[11px] rounded border capitalize ${statusColors[selected.status]}`}>{selected.status}</span>
                </div>

                <div className="flex-1 overflow-auto rounded-lg bg-neutral-900 text-neutral-100 p-3 min-h-[200px] max-h-[360px]">
                  <pre className="text-[11px] font-mono whitespace-pre-wrap break-all leading-relaxed">
                    {selected.xml_content || "// No XML generated yet. Use 'Generate Report' to build the GoAML payload."}
                  </pre>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {selected.status !== "filed" ? (
                    <button
                      onClick={() => submitReport(selected.id)}
                      disabled={submittingId === selected.id}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium bg-ink text-[var(--paper)] hover:bg-ink/90 transition-all disabled:opacity-60"
                    >
                      {submittingId === selected.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {submittingId === selected.id ? "Filing..." : "File with NFIU"}
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[12.5px] text-emerald-700 bg-emerald-50 border border-emerald-100">
                      <Check className="w-4 h-4" /> Filed {selected.filed_at ? new Date(selected.filed_at).toLocaleDateString("en-NG") : ""}
                    </div>
                  )}
                  <button
                    onClick={() => generateFromCase(selected.case_id)}
                    disabled={generating}
                    title="Regenerate"
                    className="flex items-center justify-center px-3 py-2 rounded-lg border border-ink-10 text-ink hover:bg-[var(--paper-2)]/60 transition-all disabled:opacity-60"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-ink-muted select-none py-16">
                <FileCode2 className="w-10 h-10 mb-2 opacity-25" />
                <p className="text-[13px]">Select a report to preview its GoAML XML</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
