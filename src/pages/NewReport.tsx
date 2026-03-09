import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import { CheckCircle, ChevronRight, FileText, Upload } from "lucide-react";
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
}

interface DataSource {
  id: string;
  file_name: string;
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

const STEPS = ["Report Type", "Reporting Period", "Report Details", "Review", "Confirmation"];

const NewReport = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);

  // Form state
  const [reportType, setReportType] = useState("");
  const [periodStart, setPeriodStart] = useState<Date>();
  const [periodEnd, setPeriodEnd] = useState<Date>();
  const [dataSourceId, setDataSourceId] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("company_name, rc_number, cbn_license_category").eq("id", user.id).maybeSingle(),
      supabase.from("institution_report_types").select("report_type").eq("user_id", user.id),
      supabase.from("data_sources").select("id, file_name").eq("user_id", user.id).eq("status", "Ready"),
    ]).then(([profileRes, typesRes, dsRes]) => {
      if (profileRes.data) setProfile(profileRes.data);
      if (typesRes.data && typesRes.data.length > 0) {
        setAvailableTypes(typesRes.data.map((t) => t.report_type));
      } else {
        setAvailableTypes(ALL_REPORT_TYPES);
      }
      if (dsRes.data) setDataSources(dsRes.data);
    });
  }, [user]);

  const handleFieldChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!user || !profile) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from("report_requests").insert({
        user_id: user.id,
        institution_name: profile.company_name || "",
        rc_number: profile.rc_number,
        report_type: reportType,
        reporting_period_start: periodStart!.toISOString().split("T")[0],
        reporting_period_end: periodEnd!.toISOString().split("T")[0],
        data_source_id: dataSourceId || null,
        form_data: formData,
        status: "Processing",
      });

      if (error) throw error;

      // Also insert into reports table for dashboard tracking
      await supabase.from("reports").insert({
        user_id: user.id,
        report_name: `${reportType} — ${profile.company_name || "Report"}`,
        report_type: reportType,
        status: "Processing",
        reporting_period_start: periodStart!.toISOString().split("T")[0],
        reporting_period_end: periodEnd!.toISOString().split("T")[0],
      });

      setStep(4); // Confirmation
      setTimeout(() => navigate("/dashboard/reports"), 3000);
    } catch {
      toast({ title: "Something went wrong", description: "We couldn't submit your report. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const fields = reportFields[reportType] || [];
  const canProceedStep0 = !!reportType;
  const canProceedStep1 = !!periodStart && !!periodEnd;
  const canProceedStep2 = fields.every((f) => formData[f.name]?.trim());

  return (
    <div className="max-w-3xl mx-auto">
      <BackButton to="/dashboard" />

      {/* Progress indicator */}
      <div className="flex items-center gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
              i < step ? "bg-primary border-primary text-primary-foreground" :
              i === step ? "border-primary text-primary bg-primary/10" :
              "border-border text-muted-foreground"
            )}>
              {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={cn("w-8 h-0.5", i < step ? "bg-primary" : "bg-border")} />}
          </div>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mb-4">{STEPS[step]}</p>

      {/* Step 0: Report Type */}
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

      {/* Step 1: Reporting Period */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Reporting Period</CardTitle>
            <CardDescription>Select the date range and data source for this report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
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
                <Label>End Date</Label>
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
              <Label>Data Source</Label>
              {dataSources.length > 0 ? (
                <Select value={dataSourceId} onValueChange={setDataSourceId}>
                  <SelectTrigger><SelectValue placeholder="Select a data source" /></SelectTrigger>
                  <SelectContent>
                    {dataSources.map((ds) => (
                      <SelectItem key={ds.id} value={ds.id}>{ds.file_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="border border-dashed border-border rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload your data first</p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/dashboard/data-sources">Go to Data Sources</Link>
                  </Button>
                </div>
              )}
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

      {/* Step 2: Report Details */}
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
                <p className="text-sm font-medium text-foreground">{profile?.cbn_license_category || "—"}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Reporting Period</Label>
                <p className="text-sm font-medium text-foreground">
                  {periodStart && periodEnd ? `${format(periodStart, "PP")} – ${format(periodEnd, "PP")}` : "—"}
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
              <p className="text-sm text-muted-foreground">No additional fields required for this report type.</p>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)} disabled={fields.length > 0 && !canProceedStep2}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review */}
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
                  {periodStart && periodEnd ? `${format(periodStart, "PP")} – ${format(periodEnd, "PP")}` : "—"}
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
              <Button variant="outline" size="sm" onClick={() => setStep(0)}>Edit Type</Button>
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>Edit Period</Button>
              <Button variant="outline" size="sm" onClick={() => setStep(2)}>Edit Details</Button>
              <div className="flex-1" />
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Submitting..." : "Confirm & Generate"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Your report is being generated</h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This usually takes 2 to 5 minutes. We will notify you when it is ready. Redirecting to My Reports…
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewReport;
