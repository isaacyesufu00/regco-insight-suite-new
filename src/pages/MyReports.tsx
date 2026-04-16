import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import {
  Download,
  FileText,
  Search,
  RefreshCw,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Report {
  id: string;
  report_name: string;
  report_type: string | null;
  status: string;
  created_at: string;
  file_path: string | null;
  file_url: string | null;
  report_url: string | null;
  reporting_period_start: string | null;
  reporting_period_end: string | null;
  pdf_url: string | null;
  docx_url: string | null;
  xlsx_url: string | null;
  error_message: string | null;
}

const isReady = (s: string) => s.toLowerCase() === "ready";
const isFailed = (s: string) => s.toLowerCase() === "failed";
const isProcessing = (s: string) =>
  s.toLowerCase() === "processing" || s.toLowerCase() === "pending";

const POLL_INTERVAL_MS = 8_000; // 8 seconds

const MyReports = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Ref to latest reports — lets polling compare statuses without stale closures
  const reportsRef = useRef<Report[]>([]);
  useEffect(() => {
    reportsRef.current = reports;
  }, [reports]);

  const fetchReports = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("reports")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      // Show a toast when a report transitions to "ready"
      (data as Report[]).forEach((updated) => {
        const existing = reportsRef.current.find((r) => r.id === updated.id);
        if (existing && existing.status !== updated.status && isReady(updated.status)) {
          toast({
            title: "Report ready",
            description: `"${updated.report_name}" is ready to download.`,
          });
        }
      });
      setReports(data as Report[]);
    }
  }, [user, toast]);

  // Initial load
  useEffect(() => {
    fetchReports().then(() => setLoading(false));
  }, [fetchReports]);

  // Real-time subscription (primary live updates via Supabase Realtime)
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("reports-my")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports", filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setReports((p) => [payload.new as Report, ...p]);
          } else if (payload.eventType === "UPDATE") {
            const updated = payload.new as Report;
            setReports((p) => p.map((r) => (r.id === updated.id ? updated : r)));
            if (isReady(updated.status)) {
              toast({
                title: "Report ready",
                description: `"${updated.report_name}" is ready to download.`,
              });
            }
          } else if (payload.eventType === "DELETE") {
            setReports((p) => p.filter((r) => r.id !== (payload.old as { id: string }).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Polling fallback — every 8 seconds. Ensures updates are caught even if
  // the Realtime subscription misses a push.
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchReports, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [user, fetchReports]);

  // Resolve the download URL for a ready report.
  // Priority: report_url (new flow) → pdf_url → file_path (legacy).
  const resolveDownloadUrl = (r: Report): string | null => {
    if (r.report_url) {
      const { data } = supabase.storage.from("reports").getPublicUrl(r.report_url);
      return data?.publicUrl || null;
    }
    return r.pdf_url || null;
  };

  const handleDownload = async (r: Report) => {
    const url = resolveDownloadUrl(r);
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = r.report_name;
      a.target = "_blank";
      a.click();
      return;
    }
    // Fallback: try to create a signed URL from file_path
    if (r.file_path) {
      const { data } = await supabase.storage
        .from("reports")
        .createSignedUrl(r.file_path, 3600);
      if (data?.signedUrl) {
        const a = document.createElement("a");
        a.href = data.signedUrl;
        a.download = r.report_name;
        a.click();
        return;
      }
    }
    toast({
      title: "Download unavailable",
      description: "The report file is not yet available. Please try again shortly.",
      variant: "destructive",
    });
  };

  const handleDownloadFormat = async (
    url: string | null,
    filePath: string | null,
    name: string
  ) => {
    let signedUrl = url;
    if (!signedUrl && filePath) {
      const { data } = await supabase.storage.from("reports").createSignedUrl(filePath, 3600);
      signedUrl = data?.signedUrl || null;
    }
    if (signedUrl) {
      const a = document.createElement("a");
      a.href = signedUrl;
      a.download = name;
      a.click();
    } else {
      toast({
        title: "Download unavailable",
        description: "This file format is not yet available.",
        variant: "destructive",
      });
    }
  };

  const handleRetry = async (reportId: string) => {
    await supabase.from("reports").update({ status: "Processing" }).eq("id", reportId);
    toast({ title: "Retrying", description: "We're regenerating your report." });
  };

  const types = Array.from(new Set(reports.map((r) => r.report_type).filter(Boolean)));

  const filtered = reports.filter((r) => {
    if (search && !r.report_name.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== "all" && r.report_type !== typeFilter) return false;
    return true;
  });

  const statusBadge = (r: Report) => {
    if (isReady(r.status)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-success/10 text-success border-success/20">
          Ready
        </span>
      );
    }
    if (isFailed(r.status)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-destructive/10 text-destructive border-destructive/20">
          Failed
        </span>
      );
    }
    if (isProcessing(r.status)) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border bg-warning/10 text-warning border-warning/20">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-muted text-muted-foreground">
        {r.status}
      </span>
    );
  };

  const actionCell = (r: Report) => {
    if (isReady(r.status)) {
      // If the report has a report_url (new flow), show a single download button.
      // Otherwise fall back to the multi-format dropdown for legacy reports.
      if (r.report_url) {
        return (
          <Button size="sm" onClick={() => handleDownload(r)}>
            <Download className="mr-1 h-3 w-3" /> Download Report
          </Button>
        );
      }
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="outline">
              <Download className="mr-1 h-3 w-3" /> Download{" "}
              <ChevronDown className="ml-1 h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() =>
                handleDownloadFormat(r.pdf_url, r.file_path, `${r.report_name}.pdf`)
              }
            >
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDownloadFormat(r.docx_url, null, `${r.report_name}.docx`)}
            >
              Download Word (.docx)
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDownloadFormat(r.xlsx_url, null, `${r.report_name}.xlsx`)}
            >
              Download Excel (.xlsx)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (isFailed(r.status)) {
      return (
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-start gap-2 p-2.5 rounded-lg border border-destructive/30 bg-destructive/5 max-w-[260px] text-left">
            <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-xs text-destructive break-words">
              {r.error_message || "We encountered an issue. Our team has been notified."}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => handleRetry(r.id)}>
            <RefreshCw className="mr-1 h-3 w-3" /> Try Again
          </Button>
        </div>
      );
    }

    if (isProcessing(r.status)) {
      return (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Generating…
        </span>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <BackButton to="/dashboard" />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">My Reports</CardTitle>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t!} value={t!}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No reports found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Reporting Period</TableHead>
                    <TableHead>Date Generated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.report_name}</TableCell>
                      <TableCell>{r.report_type || "—"}</TableCell>
                      <TableCell>
                        {r.reporting_period_start && r.reporting_period_end
                          ? `${new Date(r.reporting_period_start).toLocaleDateString()} – ${new Date(r.reporting_period_end).toLocaleDateString()}`
                          : "—"}
                      </TableCell>
                      <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{statusBadge(r)}</TableCell>
                      <TableCell className="text-right">{actionCell(r)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MyReports;
