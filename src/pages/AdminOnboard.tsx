import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const LICENSE_CATEGORIES = [
  "Unit MFB",
  "State MFB",
  "National MFB",
  "Commercial Bank",
];

const ALL_REPORT_TYPES = [
  "CBN Monetary Policy Return",
  "CBN Forex Return",
  "AML/CFT Report",
  "NFIU Regulatory Return",
  "MFB Regulatory Return",
  "Prudential Return",
  "SCUML Compliance Report",
];

const AdminOnboard = () => {
  const [form, setForm] = useState({
    compliance_lead_name: "",
    email: "",
    institution_name: "",
    rc_number: "",
    cbn_license_category: "",
  });
  const [reportTypes, setReportTypes] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successEmail, setSuccessEmail] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleReportType = (rt: string) => {
    setReportTypes((prev) =>
      prev.includes(rt) ? prev.filter((x) => x !== rt) : [...prev, rt]
    );
  };

  const resetForm = () => {
    setForm({
      compliance_lead_name: "",
      email: "",
      institution_name: "",
      rc_number: "",
      cbn_license_category: "",
    });
    setReportTypes([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessEmail(null);
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('onboard-client', {
        body: {
          email: form.email,
          institution_name: form.institution_name,
          compliance_lead_name: form.compliance_lead_name,
          rc_number: form.rc_number,
          cbn_license_category: form.cbn_license_category,
          report_types: reportTypes,
        }
      });

      if (error) {
        throw new Error(error.message || "Onboarding failed");
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setSuccessEmail(form.email);
      resetForm();
    } catch (err: any) {
      setErrorMessage("Onboarding failed. Please try again or contact support.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Onboard New Client</CardTitle>
        <CardDescription>Register a new institution on the RegCo platform.</CardDescription>
      </CardHeader>
      <CardContent>
        {successEmail && (
          <Alert className="mb-6 border-primary bg-primary/10 text-primary">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Client onboarded successfully. Welcome email sent to {successEmail}.
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert className="mb-6 border-destructive bg-destructive/10 text-destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Full Name (Compliance Lead) *</Label>
            <Input
              value={form.compliance_lead_name}
              onChange={(e) => updateField("compliance_lead_name", e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label>Email Address *</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label>Institution Name *</Label>
            <Input
              value={form.institution_name}
              onChange={(e) => updateField("institution_name", e.target.value)}
              required
              placeholder="First Microfinance Bank"
            />
          </div>

          <div className="space-y-2">
            <Label>RC Number *</Label>
            <Input
              value={form.rc_number}
              onChange={(e) => updateField("rc_number", e.target.value)}
              required
              placeholder="RC123456"
            />
          </div>

          <div className="space-y-2">
            <Label>CBN License Category *</Label>
            <Select
              value={form.cbn_license_category}
              onValueChange={(v) => updateField("cbn_license_category", v)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {LICENSE_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Report Types</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ALL_REPORT_TYPES.map((rt) => (
                <label key={rt} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors">
                  <Checkbox
                    checked={reportTypes.includes(rt)}
                    onCheckedChange={() => toggleReportType(rt)}
                  />
                  <span className="text-sm">{rt}</span>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={submitting || !form.cbn_license_category} className="w-full" size="lg">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Onboarding...
              </>
            ) : (
              "Onboard Client"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminOnboard;
