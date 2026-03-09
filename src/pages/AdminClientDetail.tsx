import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Pencil, Save, X, Loader2 } from "lucide-react";

const ALL_REPORT_TYPES = [
  "CBN Monetary Policy Return",
  "CBN Forex Return",
  "AML/CFT Report",
  "NFIU Regulatory Return",
  "Prudential Return",
  "MFB Regulatory Return",
  "SCUML Compliance Report",
];

const LICENSE_CATEGORIES = [
  "Commercial Bank", "Merchant Bank", "National MFB", "State MFB", "Unit MFB", "Finance Company", "Other",
];

interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  rc_number: string | null;
  cbn_license_category: string | null;
  compliance_lead_name: string | null;
  phone: string | null;
  account_status: string;
  created_at: string;
}

interface Report {
  id: string;
  report_name: string;
  report_type: string | null;
  status: string;
  created_at: string;
}

const AdminClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [reportTypes, setReportTypes] = useState<string[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [editForm, setEditForm] = useState({
    company_name: "",
    rc_number: "",
    cbn_license_category: "",
    compliance_lead_name: "",
    phone: "",
    account_status: "",
  });
  const [editReportTypes, setEditReportTypes] = useState<string[]>([]);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      const [profileRes, rtRes, reportsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("institution_report_types").select("report_type").eq("user_id", id),
        supabase.from("reports").select("id, report_name, report_type, status, created_at").eq("user_id", id).order("created_at", { ascending: false }),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        setEditForm({
          company_name: profileRes.data.company_name || "",
          rc_number: profileRes.data.rc_number || "",
          cbn_license_category: profileRes.data.cbn_license_category || "",
          compliance_lead_name: profileRes.data.compliance_lead_name || "",
          phone: profileRes.data.phone || "",
          account_status: profileRes.data.account_status || "Active",
        });
      }

      const rts = (rtRes.data || []).map((r) => r.report_type);
      setReportTypes(rts);
      setEditReportTypes(rts);

      if (reportsRes.data) setReports(reportsRes.data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);

    try {
      // Update profile
      await supabase
        .from("profiles")
        .update({
          company_name: editForm.company_name,
          rc_number: editForm.rc_number,
          cbn_license_category: editForm.cbn_license_category,
          compliance_lead_name: editForm.compliance_lead_name,
          phone: editForm.phone,
          account_status: editForm.account_status,
        })
        .eq("id", id);

      // Sync report types: delete all, re-insert selected
      await supabase.from("institution_report_types").delete().eq("user_id", id);
      if (editReportTypes.length > 0) {
        await supabase.from("institution_report_types").insert(
          editReportTypes.map((rt) => ({ user_id: id, report_type: rt, is_active: true }))
        );
      }

      setProfile((prev) => prev ? { ...prev, ...editForm } : prev);
      setReportTypes(editReportTypes);
      setEditing(false);
      toast({ title: "Client updated successfully" });
    } catch {
      toast({ title: "Failed to update client", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) {
    return <p className="text-center text-muted-foreground">Client not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate("/admin/clients")} className="gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Clients
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{profile.company_name || profile.full_name || "Client"}</CardTitle>
            <CardDescription>Onboarded {new Date(profile.created_at).toLocaleDateString()}</CardDescription>
          </div>
          {!editing ? (
            <Button variant="outline" onClick={() => setEditing(true)} className="gap-2">
              <Pencil className="h-4 w-4" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => { setEditing(false); setEditReportTypes(reportTypes); }} className="gap-2">
                <X className="h-4 w-4" /> Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <div className="space-y-4 max-w-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institution Name</Label>
                  <Input value={editForm.company_name} onChange={(e) => setEditForm((p) => ({ ...p, company_name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>RC Number</Label>
                  <Input value={editForm.rc_number} onChange={(e) => setEditForm((p) => ({ ...p, rc_number: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>CBN License Category</Label>
                <Select value={editForm.cbn_license_category} onValueChange={(v) => setEditForm((p) => ({ ...p, cbn_license_category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LICENSE_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Compliance Lead</Label>
                  <Input value={editForm.compliance_lead_name} onChange={(e) => setEditForm((p) => ({ ...p, compliance_lead_name: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Account Status</Label>
                <Select value={editForm.account_status} onValueChange={(v) => setEditForm((p) => ({ ...p, account_status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Deactivated">Deactivated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Report Types</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_REPORT_TYPES.map((rt) => (
                    <label key={rt} className="flex items-center gap-3 p-2 rounded border cursor-pointer hover:bg-accent/50">
                      <Checkbox
                        checked={editReportTypes.includes(rt)}
                        onCheckedChange={() =>
                          setEditReportTypes((prev) =>
                            prev.includes(rt) ? prev.filter((x) => x !== rt) : [...prev, rt]
                          )
                        }
                      />
                      <span className="text-sm">{rt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <DetailRow label="Institution" value={profile.company_name} />
                <DetailRow label="RC Number" value={profile.rc_number} />
                <DetailRow label="License Category" value={profile.cbn_license_category} />
                <DetailRow label="Compliance Lead" value={profile.compliance_lead_name} />
                <DetailRow label="Phone" value={profile.phone} />
                <div>
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div className="mt-1">
                    <Badge variant={profile.account_status === "Active" ? "default" : "secondary"}>
                      {profile.account_status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Assigned Report Types</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {reportTypes.length > 0 ? reportTypes.map((rt) => (
                    <Badge key={rt} variant="outline">{rt}</Badge>
                  )) : (
                    <span className="text-sm text-muted-foreground">No report types assigned</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report History ({reports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No reports generated yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.report_name}</TableCell>
                      <TableCell>{r.report_type || "—"}</TableCell>
                      <TableCell><Badge variant="secondary">{r.status}</Badge></TableCell>
                      <TableCell>{new Date(r.created_at).toLocaleDateString()}</TableCell>
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

const DetailRow = ({ label, value }: { label: string; value: string | null }) => (
  <div>
    <span className="text-sm text-muted-foreground">{label}</span>
    <p className="text-sm font-medium text-foreground">{value || "—"}</p>
  </div>
);

export default AdminClientDetail;
