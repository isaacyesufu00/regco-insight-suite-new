import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Sparkles,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import DownloadButton from "@/components/DownloadButton";
import SCUMLForm, { SCUMLPayload } from "@/components/reports/SCUMLForm";
import NDICPremiumForm, { NDICPremiumPayload } from "@/components/reports/NDICPremiumForm";
import NDICSingleObligorForm, { SingleObligorPayload } from "@/components/reports/NDICSingleObligorForm";

// ─── All 16 report types grouped by regulator ───

interface ReportTypeInfo {
  name: string;
  freq: string;
  desc: string;
}

const REPORT_TYPES_BY_REGULATOR: Record<string, ReportTypeInfo[]> = {
  CBN: [
    { name: "MFB Regulatory Return", freq: "Monthly", desc: "Balance sheet, loans, deposits, CAR, liquidity" },
    { name: "Monetary Policy Return", freq: "Monthly", desc: "Interest rates, credit data, monetary compliance" },
    { name: "Prudential Return", freq: "Monthly", desc: "CAMEL framework — capital, asset quality, earnings" },
    { name: "CBN Forex Return", freq: "Weekly/Monthly", desc: "Foreign currency positions and transactions" },
    { name: "Board Governance Return", freq: "Bi-annual", desc: "Corporate governance and board matters" },
    { name: "Consumer Protection Return", freq: "Quarterly", desc: "Customer complaints and resolution data" },
  ],
  NFIU: [
    { name: "AML/CFT Compliance Report", freq: "Quarterly", desc: "Anti-money laundering and counter-terrorism" },
    { name: "NFIU Regulatory Return", freq: "Quarterly", desc: "STR filings, CTR reports, financial intelligence" },
    { name: "International Transfers Report", freq: "Quarterly", desc: "Cross-border transaction monitoring" },
  ],
  SCUML: [
    { name: "SCUML Annual Compliance Report", freq: "Annual", desc: "Annual compliance attestation submitted to SCUML covering AML/CFT programme, customer records, and transaction reporting." },
  ],
  NDIC: [
    { name: "NDIC Premium Return", freq: "Annual", desc: "Deposit insurance premium calculation" },
    { name: "Single Obligor Report", freq: "Quarterly", desc: "Large exposure and concentration risk" },
  ],
  FIRS: [
    { name: "Company Income Tax Return", freq: "Annual", desc: "Corporate tax filing and compliance" },
    { name: "PAYE Remittance", freq: "Monthly", desc: "Employee income tax remittance" },
    { name: "Withholding Tax Return", freq: "Monthly", desc: "WHT on vendor payments and dividends" },
    { name: "VAT Return", freq: "Monthly", desc: "Value added tax on qualifying services" },
  ],
};

const REGULATORS = Object.keys(REPORT_TYPES_BY_REGULATOR);

const ALL_REPORT_TYPE_NAMES = Object.values(REPORT_TYPES_BY_REGULATOR).flat().map(r => r.name);

// Report types that use a structured form instead of a CBS file upload
const FORM_BASED_TYPES = new Set<string>([
  "SCUML Annual Compliance Report",
  "NDIC Premium Return",
  "Single Obligor Report",
]);
const isFormBased = (t: string) => FORM_BASED_TYPES.has(t);
const isQuarterlyForm = (t: string) => t === "Single Obligor Report";

// ─── CBS Templates ───

function getTemplateForReportType(reportType: string): { headers: string[]; rows: string[][] } | null {
  const templates: Record<string, { headers: string[]; rows: string[][] }> = {
    "MFB Regulatory Return": {
      headers: ["Line Item", "Amount"],
      rows: [["Cash and Cash Equivalents",""],["Balances with CBN",""],["Investment Securities",""],["Gross Loans and Advances",""],["Loan Loss Provisions",""],["Fixed Assets Net",""],["Other Assets",""],["Total Assets",""],["Savings Deposits",""],["Demand Deposits",""],["Time Deposits",""],["Other Deposits",""],["Total Deposits",""],["Total Liabilities",""],["Paid Up Capital",""],["Retained Earnings",""],["Total Shareholders Funds",""],["Performing Loans",""],["Non Performing Loans",""],["Tier 1 Capital",""],["Risk Weighted Assets",""],["Liquid Assets",""]],
    },
    "CBN Forex Return": {
      headers: ["Line Item", "Amount (USD)", "Amount (NGN)"],
      rows: [["Total FX Inflows","",""],["Total FX Outflows","",""],["Net Open Position","",""],["USD Inflows","",""],["USD Outflows","",""],["GBP Inflows","",""],["GBP Outflows","",""],["EUR Inflows","",""],["EUR Outflows","",""],["Number of FX Transactions","",""],["Largest Single Transaction USD","",""]],
    },
    "AML/CFT Compliance Report": {
      headers: ["Line Item", "Value"],
      rows: [["Total Transactions Monitored",""],["Total Transaction Value NGN",""],["Flagged Transactions",""],["STR Filed",""],["CTR Filed",""],["False Positives",""],["Total Customers",""],["KYC Compliant Customers",""],["PEP Customers",""],["High Risk Customers",""],["Accounts Frozen",""],["Staff Trained AML",""],["Total Staff",""],["Last Training Date",""]],
    },
    "PAYE Remittance": {
      headers: ["Employee ID", "Employee Name", "Gross Salary", "Taxable Income", "PAYE Deducted", "Pension Deduction", "NHF Deduction"],
      rows: [["","","","","","",""]],
    },
    "Withholding Tax Return": {
      headers: ["Vendor Name", "Vendor TIN", "Payment Type", "Payment Amount", "WHT Rate Percent", "WHT Amount", "Payment Date"],
      rows: [["","","","","","",""]],
    },
    "VAT Return": {
      headers: ["Line Item", "Amount NGN"],
      rows: [["Vatable Sales",""],["Exempt Sales",""],["Total Turnover",""],["Input VAT on Purchases",""],["Output VAT",""],["Net VAT Payable",""],["Prior Period VAT Credit",""]],
    },
    "Company Income Tax Return": {
      headers: ["Line Item", "Amount NGN"],
      rows: [["Gross Income",""],["Cost of Sales",""],["Operating Expenses",""],["Profit Before Tax",""],["Add Back Disallowable Expenses",""],["Less Capital Allowances",""],["Assessable Profit",""],["CIT Rate Percent",""],["CIT Payable",""],["Education Tax",""],["WHT Credits Available",""]],
    },
    "International Transfers Report": {
      headers: ["Transfer Reference", "Direction (In/Out)", "Amount USD", "Amount NGN", "Source Country", "Destination Country", "Bank Name", "Transfer Date", "Purpose", "Above 10K USD (Yes/No)"],
      rows: [["","","","","","","","","",""]],
    },
    "NDIC Premium Return": {
      headers: ["Line Item", "Amount NGN"],
      rows: [["Savings Deposits Insured",""],["Demand Deposits Insured",""],["Time Deposits Insured",""],["Total Insured Deposits",""],["Deposits Exceeding Insured Limit",""],["NDIC License Number",""],["Institution Type",""],["Premium Rate Percent",""]],
    },
    "Single Obligor Report": {
      headers: ["Borrower Name", "Borrower TIN", "Total Exposure NGN", "Percentage of Shareholders Funds", "Exposure Type", "Within Limit Yes/No"],
      rows: [["","","","","",""]],
    },
    "Board Governance Return": {
      headers: ["Line Item", "Value"],
      rows: [["Total Directors",""],["Executive Directors",""],["Non-Executive Directors",""],["Independent Non-Executive Directors",""],["Female Directors",""],["Board Meetings Scheduled",""],["Board Meetings Held",""],["Audit Committee Members",""],["Risk Committee Members",""],["Credit Committee Members",""],["Total Directors Fees NGN",""],["Total Executive Remuneration NGN",""]],
    },
    "Consumer Protection Return": {
      headers: ["Line Item", "Count"],
      rows: [["Total Complaints Received",""],["Complaints Resolved",""],["Complaints Pending",""],["Complaints Escalated to CBN",""],["Average Resolution Days",""],["Credit Related Complaints",""],["Deposit Account Complaints",""],["Electronic Banking Complaints",""],["Fees and Charges Complaints",""],["Total Compensation Paid NGN",""],["Financial Literacy Programmes Held",""],["Customers Reached",""]],
    },
    "Monetary Policy Return": {
      headers: ["Line Item", "Value"],
      rows: [["Prime Lending Rate Percent",""],["Maximum Lending Rate Percent",""],["Minimum Deposit Rate Percent",""],["Savings Deposit Rate Percent",""],["MPR Current Percent",""],["Cash Reserve Ratio Required Percent",""],["Cash Reserve Ratio Actual Percent",""],["Liquidity Ratio Required Percent",""],["Liquidity Ratio Actual Percent",""],["Total Loans Disbursed Month NGN",""],["MSME Loans NGN",""],["Agricultural Loans NGN",""]],
    },
    "Prudential Return": {
      headers: ["Line Item", "Amount NGN"],
      rows: [["Tier 1 Capital",""],["Tier 2 Capital",""],["Total Capital",""],["Risk Weighted Assets",""],["Capital Adequacy Ratio Percent",""],["Total Loans",""],["Performing Loans",""],["Watch List Loans",""],["Substandard Loans",""],["Doubtful Loans",""],["Loss Loans",""],["NPL Ratio Percent",""],["Loan Loss Provisions",""],["Interest Income",""],["Non Interest Income",""],["Total Income",""],["Total Expenses",""],["Profit Before Tax",""],["Return on Assets Percent",""],["Return on Equity Percent",""],["Liquid Assets",""],["Total Liabilities",""],["Liquidity Ratio Percent",""]],
    },
    "SCUML Annual Compliance": {
      headers: ["Line Item", "Value"],
      rows: [["SCUML Registration Number",""],["Registration Date",""],["Registration Status",""],["Last Renewal Date",""],["AML Policy Last Reviewed Date",""],["Risk Assessment Last Conducted Date",""],["Compliance Officer Name",""],["Staff Trained Count",""],["Total Staff Count",""],["Training Provider",""],["Training Date",""],["STR Filed to NFIU Count",""],["CTR Filed to NFIU Count",""],["Total Customers Registered",""],["KYC Completed Count",""],["PEP Identified Count",""],["Accounts Blocked Count",""]],
    },
    "NFIU Regulatory Return": {
      headers: ["Line Item", "Count or Amount"],
      rows: [["Total STR Filed",""],["STR Value NGN",""],["STR With Law Enforcement",""],["STR Pending",""],["Total CTR Filed",""],["CTR Value NGN",""],["CTR Cash Deposits",""],["CTR Cash Withdrawals",""],["CTR Transfers",""],["Total Customers Screened",""],["PEP Matches",""],["Sanctions Matches",""],["Adverse Media Matches",""],["Total Inbound Wires",""],["Inbound Wire Value USD",""],["Total Outbound Wires",""],["Outbound Wire Value USD",""],["High Risk Jurisdictions Count",""]],
    },
  };
  return templates[reportType] || null;
}

function downloadTemplate(reportType: string) {
  const template = getTemplateForReportType(reportType);
  if (!template) return;

  const csvContent = [
    template.headers.join(","),
    ...template.rows.map(r => r.map(c => `"${c}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${reportType.replace(/[^a-zA-Z0-9]/g, "_")}_Template.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

interface Profile {
  company_name: string | null;
  rc_number: string | null;
  cbn_license_category: string | null;
  compliance_lead_name: string | null;
  notification_email_report_ready: boolean;
}

const STEPS = ["Report Type", "Period & CBS Upload", "Review", "Processing"];

type ProcessingStatus = "processing" | "ready" | "failed";

const NewReport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [activeRegulator, setActiveRegulator] = useState("CBN");

  const [reportType, setReportType] = useState("");
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();
  const [cbsFile, setCbsFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [currentReportId, setCurrentReportId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus>("processing");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [processingError, setProcessingError] = useState<string>("");
  const [validationMetrics, setValidationMetrics] = useState<{
    car_percentage: number | null;
    liquidity_percentage: number | null;
    npl_ratio: number | null;
  } | null>(null);

  // Form-based report state
  const currentYear = new Date().getFullYear();
  const [formYear, setFormYear] = useState<string>(String(currentYear));
  const [formQuarter, setFormQuarter] = useState<string>("Q1");
  const [formPayload, setFormPayload] = useState<unknown>(null);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    const preselected = searchParams.get("type");
    if (preselected) {
      setReportType(preselected);
      // Find the regulator for this type
      for (const [reg, types] of Object.entries(REPORT_TYPES_BY_REGULATOR)) {
        if (types.some(t => t.name === preselected)) {
          setActiveRegulator(reg);
          break;
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase
        .from("profiles")
        .select("company_name, rc_number, cbn_license_category, compliance_lead_name, notification_email_report_ready")
        .eq("id", user.id)
        .maybeSingle(),
      supabase.from("institution_report_types").select("report_type").eq("user_id", user.id),
    ]).then(([profileRes, typesRes]) => {
      if (profileRes.data) setProfile(profileRes.data);
      if (typesRes.data && typesRes.data.length > 0) {
        setAvailableTypes(typesRes.data.map((t) => t.report_type));
      } else {
        setAvailableTypes(ALL_REPORT_TYPE_NAMES);
      }
    });
  }, [user]);

  useEffect(() => {
    if (step !== 3 || !currentReportId) return;
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
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls", "csv"].includes(ext || "")) {
      toast({ title: "Unsupported file format", description: "Please upload your CBS export as .xlsx, .xls, or .csv", variant: "destructive" });
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum file size is 50MB.", variant: "destructive" });
      return;
    }
    setCbsFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const resetAndStartOver = () => {
    setStep(0);
    setReportType("");
    setPeriodStart(undefined);
    setPeriodEnd(undefined);
    setCbsFile(null);
    setCurrentReportId(null);
    setProcessingStatus("processing");
    setDownloadUrl("");
    setProcessingError("");
    setValidationMetrics(null);
    setFormPayload(null);
    setFormValid(false);
  };

  const handleFormSubmit = async () => {
    if (!user || !profile || !formPayload) return;
    setSubmitting(true);
    let createdReportId: string | null = null;
    try {
      const reportName = `${reportType} — ${profile.company_name || "Report"}`;
      const periodLabel = isQuarterlyForm(reportType) ? `${formQuarter} ${formYear}` : formYear;
      const periodStartStr = isQuarterlyForm(reportType)
        ? `${formYear}-${String(({ Q1: 1, Q2: 4, Q3: 7, Q4: 10 } as Record<string, number>)[formQuarter]).padStart(2, "0")}-01`
        : `${formYear}-01-01`;
      const periodEndStr = isQuarterlyForm(reportType)
        ? `${formYear}-${String(({ Q1: 3, Q2: 6, Q3: 9, Q4: 12 } as Record<string, number>)[formQuarter]).padStart(2, "0")}-${formQuarter === "Q1" ? "31" : formQuarter === "Q2" ? "30" : formQuarter === "Q3" ? "30" : "31"}`
        : `${formYear}-12-31`;

      const { data: newReport, error: reportError } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          report_name: reportName,
          report_type: reportType,
          status: "processing",
          reporting_period_start: periodStartStr,
          reporting_period_end: periodEndStr,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (reportError || !newReport) throw new Error(reportError?.message || "Failed to create report record.");
      createdReportId = newReport.id;

      const { error: fnError } = await supabase.functions.invoke("generate-form-report", {
        body: {
          report_id: newReport.id,
          report_type: reportType,
          form_payload: formPayload,
          period_label: periodLabel,
        },
      });
      if (fnError) throw new Error(fnError.message || "Generation engine error");

      setCurrentReportId(newReport.id);
      setProcessingStatus("processing");
      setStep(3);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";
      if (createdReportId) {
        await supabase.from("reports").update({ status: "failed", error_message: errMsg }).eq("id", createdReportId);
      }
      toast({ title: "Submission failed", description: errMsg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !profile || !cbsFile) return;
    setSubmitting(true);

    let createdReportId: string | null = null;

    try {
      const periodStartStr = periodStart!.toISOString().split("T")[0];
      const periodEndStr = periodEnd!.toISOString().split("T")[0];
      const reportName = `${reportType} — ${profile.company_name || "Report"}`;

      const safeFileName = cbsFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${user.id}/${Date.now()}_${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(storagePath, cbsFile, { upsert: false });

      if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);

      const { data: signedData, error: signedError } = await supabase.storage
        .from("reports")
        .createSignedUrl(storagePath, 7200);

      if (signedError || !signedData?.signedUrl) {
        throw new Error("Could not generate a signed URL for the uploaded file.");
      }
      const fileUrl = signedData.signedUrl;

      const { data: newReport, error: reportError } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          report_name: reportName,
          report_type: reportType,
          status: "pending",
          file_url: fileUrl,
          file_path: storagePath,
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

      const clientEmail = profile.notification_email_report_ready || user.email || "";

      const { error: fnError } = await supabase.functions.invoke("notify-automation", {
        body: {
          report_id: newReport.id,
          user_id: user.id,
          institution_name: profile.company_name,
          cbn_license_number: profile.rc_number,
          cbn_license_category: profile.cbn_license_category,
          compliance_lead_name: profile.compliance_lead_name,
          report_type: reportType,
          reporting_period_start: periodStartStr,
          reporting_period_end: periodEndStr,
          file_url: fileUrl,
          client_email: clientEmail,
        },
      });

      if (fnError) {
        console.warn("notify-automation returned an error:", fnError.message);
      }

      setCurrentReportId(newReport.id);
      setProcessingStatus("processing");
      setStep(3);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "An unexpected error occurred.";

      if (createdReportId) {
        await supabase.from("reports").update({ status: "failed", error_message: errMsg }).eq("id", createdReportId);
      }

      toast({ title: "Submission failed", description: errMsg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const canProceedStep0 = !!reportType;
  const canProceedStep1 = isFormBased(reportType)
    ? !!formYear && (!isQuarterlyForm(reportType) || !!formQuarter) && formValid
    : !!periodStart && !!periodEnd && !!cbsFile;

  const filteredTypes = useMemo(() => {
    const regTypes = REPORT_TYPES_BY_REGULATOR[activeRegulator] || [];
    if (availableTypes.length === ALL_REPORT_TYPE_NAMES.length) return regTypes;
    return regTypes.filter(t => availableTypes.includes(t.name));
  }, [activeRegulator, availableTypes]);

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

      {/* ── Step 0: Report Type with Regulator Tabs ── */}
      {step === 0 && (
        <div className="space-y-4">
          {/* Regulator tabs */}
          <div className="flex flex-wrap gap-2">
            {REGULATORS.map((reg) => (
              <button
                key={reg}
                onClick={() => setActiveRegulator(reg)}
                style={{
                  borderRadius: 980,
                  padding: "8px 18px",
                  fontSize: 13,
                  fontWeight: 500,
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  background: activeRegulator === reg ? "#1D1D1F" : "transparent",
                  color: activeRegulator === reg ? "white" : "#6E6E73",
                }}
                onMouseEnter={(e) => {
                  if (activeRegulator !== reg) (e.target as HTMLElement).style.background = "rgba(0,0,0,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (activeRegulator !== reg) (e.target as HTMLElement).style.background = "transparent";
                }}
              >
                {reg}
              </button>
            ))}
          </div>

          {/* Report type cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredTypes.map((type) => (
              <div
                key={type.name}
                onClick={() => setReportType(type.name)}
                style={{
                  background: reportType === type.name ? "white" : "#F5F5F7",
                  borderRadius: 12,
                  padding: "16px 18px",
                  cursor: "pointer",
                  border: `1.5px solid ${reportType === type.name ? "#1D1D1F" : "transparent"}`,
                  boxShadow: reportType === type.name ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.2s",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span style={{
                    background: "rgba(0,0,0,0.06)",
                    color: "#6E6E73",
                    borderRadius: 980,
                    padding: "2px 10px",
                    fontSize: 11,
                    fontWeight: 500,
                  }}>
                    {activeRegulator}
                  </span>
                  <span style={{
                    background: "rgba(0,102,204,0.1)",
                    color: "#0066CC",
                    borderRadius: 980,
                    padding: "2px 10px",
                    fontSize: 11,
                  }}>
                    {type.freq}
                  </span>
                </div>
                <h4 style={{ fontWeight: 600, fontSize: 15, color: "#1D1D1F", margin: "6px 0 4px" }}>{type.name}</h4>
                <p style={{ fontSize: 12, color: "#6E6E73", margin: 0 }}>{type.desc}</p>
              </div>
            ))}
          </div>

          {/* Download template link */}
          {reportType && (
            <button
              onClick={() => downloadTemplate(reportType)}
              className="flex items-center gap-2 text-sm font-medium hover:underline"
              style={{ color: "#0066CC", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
            >
              <Download className="w-4 h-4" />
              Download CBS template for {reportType}
            </button>
          )}

          <div className="flex justify-end mt-4">
            <Button onClick={() => setStep(1)} disabled={!canProceedStep0}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 1 (form-based): Period + structured form ── */}
      {step === 1 && isFormBased(reportType) && (
        <Card>
          <CardHeader>
            <CardTitle>{reportType}</CardTitle>
            <CardDescription>
              Complete the sections below. All required fields must be filled before you can continue.
            </CardDescription>
          </CardHeader>
          <CardContent style={{ background: "#F5F5F0", fontFamily: "Inter, sans-serif" }} className="space-y-2">
            <div style={{ display: "grid", gridTemplateColumns: isQuarterlyForm(reportType) ? "1fr 1fr" : "1fr", gap: 14, marginBottom: 8 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6E6E73", marginBottom: 6 }}>Reporting Year</label>
                <select value={formYear} onChange={e => setFormYear(e.target.value)}
                  style={{ width: "100%", background: "#FFF", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const y = String(currentYear - i);
                    return <option key={y} value={y}>{y}</option>;
                  })}
                </select>
              </div>
              {isQuarterlyForm(reportType) && (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6E6E73", marginBottom: 6 }}>Quarter</label>
                  <select value={formQuarter} onChange={e => setFormQuarter(e.target.value)}
                    style={{ width: "100%", background: "#FFF", border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8, padding: "10px 12px", fontSize: 14 }}>
                    {["Q1", "Q2", "Q3", "Q4"].map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              )}
            </div>

            {reportType === "SCUML Annual Compliance Report" && (
              <SCUMLForm
                institutionName={profile?.company_name || ""}
                cbnLicense={profile?.rc_number || ""}
                reportingYear={formYear}
                onValidChange={(v, p: SCUMLPayload) => { setFormValid(v); setFormPayload(p); }}
              />
            )}
            {reportType === "NDIC Premium Return" && (
              <NDICPremiumForm
                institutionName={profile?.company_name || ""}
                cbnLicense={profile?.rc_number || ""}
                reportingYear={formYear}
                onValidChange={(v, p: NDICPremiumPayload) => { setFormValid(v); setFormPayload(p); }}
              />
            )}
            {reportType === "Single Obligor Report" && (
              <NDICSingleObligorForm
                institutionName={profile?.company_name || ""}
                cbnLicense={profile?.rc_number || ""}
                period={`${formQuarter} ${formYear}`}
                onValidChange={(v, p: SingleObligorPayload) => { setFormValid(v); setFormPayload(p); }}
              />
            )}

            <div className="flex justify-between" style={{ marginTop: 24 }}>
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                Review <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 1 (CBS upload, default): Reporting Period + Raw CBS File Upload ── */}
      {step === 1 && !isFormBased(reportType) && (
        <Card>
          <CardHeader>
            <CardTitle>Reporting Period &amp; CBS Export</CardTitle>
            <CardDescription>
              Upload the raw monthly CBS export from your core banking system. No manual extraction required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-primary/20 bg-primary/5">
              <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-foreground">
                <p className="font-medium mb-1">Fully automated processing</p>
                <p className="text-muted-foreground">
                  Upload the raw trial balance, general ledger, or full CBS export — exactly as it comes from
                  Flexcube, Finacle, T24, Bankone, Rubies, or any other core banking system. RegCo will parse all sheets,
                  identify the relevant accounts, validate totals, and generate the return automatically.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reporting Period Start</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !periodStart && "text-muted-foreground")}>
                      {periodStart ? format(periodStart, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={periodStart} onSelect={setPeriodStart} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Reporting Period End</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !periodEnd && "text-muted-foreground")}>
                      {periodEnd ? format(periodEnd, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={periodEnd} onSelect={setPeriodEnd} className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Raw CBS Export File</Label>
              {cbsFile ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-accent/40">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{cbsFile.name}</p>
                    <p className="text-xs text-muted-foreground">{(cbsFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button type="button" onClick={() => setCbsFile(null)} className="text-muted-foreground hover:text-destructive transition-colors">
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
                  <p className="text-sm font-medium text-foreground">Upload your CBS export or GL report</p>
                  <div className="mt-2 space-y-0.5 text-xs text-muted-foreground text-left inline-block">
                    <p>✅ RegCo template (recommended — download below)</p>
                    <p>✅ Raw GL trial balance from FlexCube, Ncube, Finacle, or Temenos</p>
                    <p>✅ Any Excel file with balance sheet or GL data</p>
                    <p>✅ .xlsx and .xls files (max 50MB)</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 max-w-xs mx-auto">
                    RegCo automatically reads your file and extracts the figures needed. For best results, include: Total Assets, Total Deposits, Shareholders Funds, and Capital Adequacy figures.
                  </p>
                </div>
              )}
              <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }} />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)} disabled={!canProceedStep1}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 2: Review ── */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Review &amp; Generate</CardTitle>
            <CardDescription>Confirm the details below before generating your report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Report Type</p>
                <p className="font-medium">{reportType}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Institution</p>
                <p className="font-medium">{profile?.company_name || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Reporting Period</p>
                <p className="font-medium">
                  {isFormBased(reportType)
                    ? (isQuarterlyForm(reportType) ? `${formQuarter} ${formYear}` : formYear)
                    : <>{periodStart && format(periodStart, "dd MMM yyyy")} — {periodEnd && format(periodEnd, "dd MMM yyyy")}</>}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{isFormBased(reportType) ? "Input Method" : "CBS File"}</p>
                <p className="font-medium">{isFormBased(reportType) ? "Structured form" : cbsFile?.name}</p>
              </div>
            </div>
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={isFormBased(reportType) ? handleFormSubmit : handleSubmit} disabled={submitting}>
                {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting…</> : <>Generate Report <Sparkles className="ml-2 h-4 w-4" /></>}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 3: Processing ── */}
      {step === 3 && (
        <Card>
          <CardContent className="py-12 text-center space-y-6">
            {processingStatus === "processing" && (
              <>
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Generating your report</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Parsing CBS data, running compliance checks, and building your regulatory return. This typically takes 30–90 seconds.
                  </p>
                </div>
              </>
            )}

            {processingStatus === "ready" && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Report ready</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your {reportType} has been generated and validated.
                  </p>
                </div>
                {validationMetrics && (validationMetrics.car_percentage || validationMetrics.liquidity_percentage || validationMetrics.npl_ratio) && (
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    {validationMetrics.car_percentage != null && (
                      <div className="p-3 rounded-lg bg-accent text-center">
                        <p className="text-xs text-muted-foreground">CAR</p>
                        <p className="text-lg font-bold text-foreground">{validationMetrics.car_percentage.toFixed(1)}%</p>
                      </div>
                    )}
                    {validationMetrics.liquidity_percentage != null && (
                      <div className="p-3 rounded-lg bg-accent text-center">
                        <p className="text-xs text-muted-foreground">Liquidity</p>
                        <p className="text-lg font-bold text-foreground">{validationMetrics.liquidity_percentage.toFixed(1)}%</p>
                      </div>
                    )}
                    {validationMetrics.npl_ratio != null && (
                      <div className="p-3 rounded-lg bg-accent text-center">
                        <p className="text-xs text-muted-foreground">NPL</p>
                        <p className="text-lg font-bold text-foreground">{validationMetrics.npl_ratio.toFixed(1)}%</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex gap-3 justify-center">
                  {currentReportId && (
                    <DownloadButton
                      report={{
                        id: currentReportId,
                        report_type: reportType,
                        report_url: downloadUrl || undefined,
                        status: 'ready',
                        car_percentage: validationMetrics?.car_percentage ?? null,
                        liquidity_percentage: validationMetrics?.liquidity_percentage ?? null,
                        npl_ratio: validationMetrics?.npl_ratio ?? null,
                        validation_passed: true,
                      }}
                      variant="primary"
                      size="md"
                    />
                  )}
                  <Button variant="outline" onClick={() => navigate("/dashboard/my-reports")}>View All Reports</Button>
                </div>
              </>
            )}

            {processingStatus === "failed" && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Validation failed</h3>
                  <div className="mt-3 p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-left max-w-md mx-auto">
                    <p className="text-sm text-destructive">{processingError}</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button onClick={resetAndStartOver}>
                    <RotateCcw className="mr-2 h-4 w-4" />Try Again
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/dashboard")}>Dashboard</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewReport;
