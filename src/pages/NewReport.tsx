import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import {
  CheckCircle,
  ChevronRight,
  FileText,
  Upload,
  X,
  Download,
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ALL_REPORT_TYPES = [
  "CBN Monetary Policy Return",
  "CBN Forex Return",
  "AML/CFT Report",
  "NFIU Regulatory Return",
  "Prudential Return",
  "MFB Regulatory Return",
  "SCUML Compliance Report",
];

interface Profile {
  company_name: string | null;
  rc_number: string | null;
  cbn_license_category: string | null;
  compliance_lead_name: string | null;
  notification_email_report_ready: string | null;
}

// Fields per report type
const reportFields: Record<string, { name: string; label: string; placeholder: string }[]> = {
  "CBN Monetary Policy Return": [
    { name: "total_deposit_liabilities", label: "Total Deposit Liabilities (₦)", placeholder: "e.g. 5,000,000,000" },
    { name: "total_loan_portfolio", label: "Total Loan Portfolio (₦)", placeholder: "e.g. 3,200,000,000" },
    { name: "capital_base", label: "Capital Base (₦)", placeholder: "e.g. 1,000,000,000" },
    { name: "liquidity_ratio", label: "Liquidity Ratio (%)", placeholder: "e.g. 35.5" },
    { name: "capital_adequacy_ratio", label: "Capital Adequacy Ratio (%)", placeholder: "e.g. 15.2" },
  ],
  "CBN Forex Return": [
    { name: "total_fx_inflows", label: "Total FX Inflows (USD)", placeholder: "e.g. 12,000,000" },
    { name: "total_fx_outflows", label: "Total FX Outflows (USD)", placeholder: "e.g. 9,500,000" },
    { name: "net_open_position", label: "Net Open Position (USD)", placeholder: "e.g. 2,500,000" },
    { name: "currency_breakdown", label: "Currency Breakdown", placeholder: "e.g. USD: 60%, GBP: 25%, EUR: 15%" },
  ],
  "AML/CFT Report": [
    { name: "strs_filed", label: "Suspicious Transaction Reports Filed", placeholder: "e.g. 12" },
    { name: "flagged_value", label: "Total Value of Flagged Transactions (₦)", placeholder: "e.g. 450,000,000" },
    { name: "compliance_officer", label: "Compliance Officer Name", placeholder: "e.g. John Adeyemi" },
    { name: "scuml_number", label: "SCUML Registration Number", placeholder: "e.g. SCUML/2024/001" },
  ],
  "NFIU Regulatory Return": [
    { name: "cash_transaction_reports", label: "Number of Cash Transaction Reports", placeholder: "e.g. 150" },
    { name: "international_transfer_reports", label: "Number of International Transfer Reports", placeholder: "e.g. 45" },
    { name: "high_value_total", label: "Total Value of High-Value Transactions (₦)", placeholder: "e.g. 2,000,000,000" },
  ],
  "MFB Regulatory Return": [
    { name: "total_deposits", label: "Total Deposits (₦)", placeholder: "e.g. 800,000,000" },
    { name: "total_loans", label: "Total Loans Outstanding (₦)", placeholder: "e.g. 600,000,000" },
    { name: "par_ratio", label: "Portfolio at Risk Ratio (%)", placeholder: "e.g. 5.2" },
    { name: "oss_ratio", label: "Operational Self-Sufficiency Ratio (%)", placeholder: "e.g. 120" },
    { name: "active_borrowers", label: "Number of Active Borrowers", placeholder: "e.g. 2,500" },
  ],
};

const STEPS = ["Report Type", "Reporting Period", "Report Details", "Review", "Processing"];

type ProcessingStatus = "processing" | "ready" | "failed";

const NewReport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  // Form state
  const [reportType, setReportType] = useState("");
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();
  const [cbsFile, setCbsFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Step 4 processing state
  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("processing");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [processingError, setProcessingError] = useState<string>("");
  const [validationMetrics, setValidationMetrics] = useState<{
    car_percentage: number | null;
    liquidity_percentage: number | null;
    npl_ratio: number | null;
  } | null>(null);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("profiles")
        .select(
          "company_name, rc_number, cbn_license_category, compliance_lead_name, notification_email_report_ready"
        )
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("institution_report_types").select("report_type").eq("user_id", user.id),
    ]).then(([profileRes, typesRes]) => {
      if (profileRes.data) setProfile(profileRes.data);
      if (typesRes.data && typesRes.data.length > 0) {
        setAvailableTypes(typesRes.data.map((t) => t.report_type));
      } else {
        setAvailableTypes(ALL_REPORT_TYPES);
      }
    });
  }, [user]);

  // Poll reports table every 8 seconds while on the processing step
  useEffect(() => {
    if (step !== 4 || !currentReportId) return;
    if (processingStatus === "ready" || processingStatus === "failed") return;

    const interval = setInterval(async () => {
      const { data, error } = await supabase
        .from("reports")
        .select("status, report_url, error_message, car_percentage, liquidity_percentage, npl_ratio")
        .eq("id", currentReportId)
        .single();

      if (error || !data) return;

      const status = (data.status as string).toLowerCase();

      if (status === "ready") {
        // Generate public URL from the report_url storage path
        let url = "";
        if (data.report_url) {
          const { data: publicData } = supabase.storage
            .from("reports")
            .getPublicUrl(data.report_url as string);
          url = publicData?.publicUrl || (data.report_url as string);
        }
        setDownloadUrl(url);
        setValidationMetrics({
          car_percentage: (data.car_percentage as number | null) ?? null,
          liquidity_percentage: (data.liquidity_percentage as number | null) ?? null,
          npl_ratio: (data.npl_ratio as number | null) ?? null,
        });
        setProcessingStatus("ready");
      } else if (status === "failed") {
        setProcessingError(
          (data.error_message as string | null) ||
            "An unexpected error occurred. Our team has been notified."
        );
        setProcessingStatus("failed");
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [step, currentReportId, processingStatus]);

  const handleFileSelect = (file: File) => {
    setCbsFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetAndStartOver = () => {
    setStep(0);
    setReportType("");
    setPeriodStart(undefined);
    setPeriodEnd(undefined);
    setCbsFile(null);
    setFormData({});
    setCurrentReportId(null);
    setProcessingStatus("processing");
    setDownloadUrl("");
    setProcessingError("");
    setValidationMetrics(null);
  };

  const handleSubmit = async () => {
    if (!user || !profile || !cbsFile) return;
    setSubmitting(true);

    let createdReportId: string | null = null;

    try {
      const periodStartStr = periodStart!.toISOString().split("T")[0];
      const periodEndStr = periodEnd!.toISOString().split("T")[0];
      const reportName = `${reportType} — ${profile.company_name || "Report"}`;

      // Step 1: Upload CBS file to "reports" bucket under the user's folder
      const safeFileName = cbsFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${user.id}/${Date.now()}_${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(storagePath, cbsFile, { upsert: false });

      if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);

      // Step 2: Generate a signed URL valid for 7200 seconds
      const { data: signedData, error: signedError } = await supabase.storage
        .from("reports")
        .createSignedUrl(storagePath, 7200);

      if (signedError || !signedData?.signedUrl) {
        throw new Error("Could not generate a signed URL for the uploaded file.");
      }
      const fileUrl = signedData.signedUrl;

      // Step 3: Create the report row in the reports table with status "pending"
      const { data: newReport, error: reportError } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          report_name: reportName,
          report_type: reportType,
          status: "pending",
          file_url: fileUrl,
          reporting_period_start: periodStartStr,
          reporting_period_end: periodEndStr,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (reportError || !newReport) {
        throw new Error(reportError?.message || "Failed to create report record.");
      }
      createdReportId = newReport.id;

      // Step 4: Call the notify-automation edge function
      const clientEmail =
        profile.notification_email_report_ready || user.email || "";

      const { error: fnError } = await supabase.functions.invoke("notify-automation", {
        body: {
          report_id: newReport.id,
          user_id: user.id,
          institution_name: profile.company_name,
          cbn_license_number: profile.rc_number,
          cbn_license_category: profile.cbn_license_category,
          compliance_lead_name: profile.compliance_lead_name,
          reporting_period_start: periodStartStr,
          reporting_period_end: periodEndStr,
          file_url: fileUrl,
          client_email: clientEmail,
        },
      });

      // Log but don't block — the automation may still process the report
      if (fnError) {
        console.warn("notify-automation returned an error:", fnError.message);
      }

      // Step 5: Move to the processing step — polling takes over from here
      setCurrentReportId(newReport.id);
      setProcessingStatus("processing");
      setStep(4);
    } catch (err) {
      const errMsg =
        err instanceof Error ? err.message : "An unexpected error occurred.";

      // If we managed to create the report row, mark it as failed
      if (createdReportId) {
        await supabase
          .from("reports")
          .update({ status: "failed", error_message: errMsg })
          .eq("id", createdReportId);
      }

      toast({
        title: "Submission failed",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const fields = reportFields[reportType] || [];
  const canProceedStep0 = !!reportType;
  const canProceedStep1 = !!periodStart && !!periodEnd && !!cbsFile;
  const canProceedStep2 = fields.every((f) => formData[f.name]?.trim());

  return (
    <div className="max-w-3xl mx-auto">
      <BackButton to="/dashboard" />

      {/* Progress indicator */}
      <div className="flex items-center gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                i < step
                  ? "bg-primary border-primary text-primary-foreground"
                  : i === step
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground"
              )}
            >
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn("w-8 h-0.5", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-4">{STEPS[step]}</p>

      {/* ── Step 0: Report Type ── */}
      {step === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableTypes.map((type) => (
            <Card
              key={type}
              className={cn(
                "cursor-pointer transition-all hover:border-primary/50",
                reportType === type && "border-primary ring-2 ring-primary/20"
              )}
              onClick={() => setReportType(type)}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground">{type}</span>
              </CardContent>
            </Card>
          ))}
          <div className="col-span-full flex justify-end mt-4">
            <Button onClick={() => setStep(1)} disabled={!canProceedStep0}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 1: Reporting Period + CBS File Upload ── */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Reporting Period &amp; CBS File</CardTitle>
            <CardDescription>
              Select your reporting dates and upload the CBS export file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Date pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !periodStart && "text-muted-foreground"
                      )}
                    >
                      {periodStart ? format(periodStart, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={periodStart}
                      onSelect={setPeriodStart}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !periodEnd && "text-muted-foreground"
                      )}
                    >
                      {periodEnd ? format(periodEnd, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={periodEnd}
                      onSelect={setPeriodEnd}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* CBS File upload */}
            <div className="space-y-2">
              <Label>CBS Export File</Label>
              {cbsFile ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-accent/40">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{cbsFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(cbsFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCbsFile(null)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground">
                    Click to upload or drag &amp; drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Excel (.xlsx, .xls), CSV, or any CBS export format
                  </p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv,.txt,.pdf,.zip"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileSelect(f);
                }}
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 2: Report Details ── */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Details — {reportType}</CardTitle>
            <CardDescription>Fill in the required financial data for this return.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pre-filled fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">Institution Name</Label>
                <p className="text-sm font-medium text-foreground">{profile?.company_name || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">RC Number</Label>
                <p className="text-sm font-medium text-foreground">{profile?.rc_number || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">CBN License Category</Label>
                <p className="text-sm font-medium text-foreground">
                  {profile?.cbn_license_category || "—"}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Reporting Period</Label>
                <p className="text-sm font-medium text-foreground">
                  {periodStart && periodEnd
                    ? `${format(periodStart, "PP")} – ${format(periodEnd, "PP")}`
                    : "—"}
                </p>
              </div>
            </div>

            {fields.map((f) => (
              <div key={f.name} className="space-y-2">
                <Label htmlFor={f.name}>{f.label}</Label>
                <Input
                  id={f.name}
                  placeholder={f.placeholder}
                  value={formData[f.name] || ""}
                  onChange={(e) => handleFieldChange(f.name, e.target.value)}
                />
              </div>
            ))}

            {fields.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No additional fields required for this report type.
              </p>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={fields.length > 0 && !canProceedStep2}
              >
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 3: Review ── */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review Your Report</CardTitle>
            <CardDescription>Please review all details before submitting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Report Type</span>
                <span className="font-medium text-foreground">{reportType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Institution</span>
                <span className="font-medium text-foreground">{profile?.company_name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">RC Number</span>
                <span className="font-medium text-foreground">{profile?.rc_number || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Period</span>
                <span className="font-medium text-foreground">
                  {periodStart && periodEnd
                    ? `${format(periodStart, "PP")} – ${format(periodEnd, "PP")}`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">CBS File</span>
                <span className="font-medium text-foreground truncate max-w-[220px]">
                  {cbsFile?.name || "—"}
                </span>
              </div>
              {fields.map((f) => (
                <div key={f.name} className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-medium text-foreground">{formData[f.name] || "—"}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setStep(0)}>
                Edit Type
              </Button>
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                Edit Period / File
              </Button>
              <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                Edit Details
              </Button>
              <div className="flex-1" />
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Confirm & Generate"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 4: Processing / Result ── */}
      {step === 4 && (
        <Card>
          <CardContent className="py-14 px-8">
            {/* Processing — orange spinner */}
            {processingStatus === "processing" && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: "rgba(249,115,22,0.1)" }}>
                  <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#f97316" }} />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Processing your report…
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                  Your CBS file has been uploaded and is being processed by our automation.
                  This usually takes 2–5 minutes.
                </p>
                {currentReportId && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted text-xs text-muted-foreground font-mono">
                    <span className="text-foreground/50">Report ID:</span>
                    <span className="font-semibold text-foreground select-all">{currentReportId}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-5">
                  Checking for updates every 8 seconds…
                </p>
              </div>
            )}

            {/* Ready — green success with download + validation metrics */}
            {processingStatus === "ready" && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 mx-auto mb-5 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Your Report Is Ready
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
                  Your CBN-ready compliance report has been generated successfully.
                </p>

                <div className="flex gap-3 justify-center flex-wrap mb-8">
                  {downloadUrl ? (
                    <Button asChild>
                      <a href={downloadUrl} download target="_blank" rel="noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                      </a>
                    </Button>
                  ) : (
                    <Button onClick={() => navigate("/dashboard/reports")}>
                      View in My Reports
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => navigate("/dashboard/reports")}>
                    Go to My Reports
                  </Button>
                </div>

                {/* Validation metrics — shown when automation populates them */}
                {validationMetrics &&
                  (validationMetrics.car_percentage !== null ||
                    validationMetrics.liquidity_percentage !== null ||
                    validationMetrics.npl_ratio !== null) && (
                    <div className="border border-border rounded-xl p-5 bg-accent/30 text-left">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Validation Metrics
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        {validationMetrics.car_percentage !== null && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">CAR</p>
                            <p className="text-lg font-bold text-foreground">
                              {validationMetrics.car_percentage.toFixed(2)}%
                            </p>
                          </div>
                        )}
                        {validationMetrics.liquidity_percentage !== null && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Liquidity Ratio</p>
                            <p className="text-lg font-bold text-foreground">
                              {validationMetrics.liquidity_percentage.toFixed(2)}%
                            </p>
                          </div>
                        )}
                        {validationMetrics.npl_ratio !== null && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">NPL Ratio</p>
                            <p className="text-lg font-bold text-foreground">
                              {validationMetrics.npl_ratio.toFixed(2)}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {/* Failed — red error card */}
            {processingStatus === "failed" && (
              <div className="space-y-5">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-destructive mb-1">
                      Report generation failed
                    </p>
                    <p className="text-sm text-destructive/80 break-words">
                      {processingError ||
                        "An unexpected error occurred. Our team has been notified."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={resetAndStartOver}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/dashboard/reports")}>
                    Go to My Reports
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewReport;
