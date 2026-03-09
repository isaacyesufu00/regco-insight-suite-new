import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";

const DashboardSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [companyName, setCompanyName] = useState("");
  const [rcNumber, setRcNumber] = useState("");
  const [cbnCategory, setCbnCategory] = useState("");
  const [complianceLead, setComplianceLead] = useState("");
  const [phone, setPhone] = useState("");
  const [notifyReportReady, setNotifyReportReady] = useState(true);
  const [saving, setSaving] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPw, setChangingPw] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles")
      .select("company_name, rc_number, cbn_license_category, compliance_lead_name, phone, notification_email_report_ready")
      .eq("id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setCompanyName(data.company_name || "");
          setRcNumber(data.rc_number || "");
          setCbnCategory(data.cbn_license_category || "");
          setComplianceLead(data.compliance_lead_name || "");
          setPhone(data.phone || "");
          setNotifyReportReady(data.notification_email_report_ready ?? true);
        }
      });
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      company_name: companyName.trim().slice(0, 200),
      rc_number: rcNumber.trim().slice(0, 50),
      cbn_license_category: cbnCategory.trim().slice(0, 100),
      compliance_lead_name: complianceLead.trim().slice(0, 100),
      phone: phone.trim().slice(0, 30),
      notification_email_report_ready: notifyReportReady,
    }).eq("id", user.id);
    setSaving(false);
    toast({
      title: error ? "Something went wrong" : "Profile updated",
      description: error ? "We couldn't save your changes. Please try again." : "Your profile has been updated successfully.",
      variant: error ? "destructive" : "default",
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast({ title: "Password too short", description: "Your new password must be at least 8 characters.", variant: "destructive" });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords match.", variant: "destructive" });
      return;
    }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPw(false);
    if (error) {
      toast({ title: "Something went wrong", description: "We couldn't update your password. Please try again.", variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "Your password has been changed successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <BackButton to="/dashboard" />

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your institution's information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-2">
              <Label>Institution Name</Label>
              <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label>RC Number</Label>
              <Input value={rcNumber} onChange={(e) => setRcNumber(e.target.value)} placeholder="e.g. RC123456" maxLength={50} />
            </div>
            <div className="space-y-2">
              <Label>CBN License Category</Label>
              <Input value={cbnCategory} onChange={(e) => setCbnCategory(e.target.value)} placeholder="e.g. Commercial Bank" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Compliance Lead Full Name</Label>
              <Input value={complianceLead} onChange={(e) => setComplianceLead(e.target.value)} placeholder="e.g. John Adeyemi" maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" maxLength={30} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Contact RegCo support to change your email.</p>
            </div>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} minLength={8} />
            </div>
            <Button type="submit" disabled={changingPw}>{changingPw ? "Updating..." : "Change Password"}</Button>
          </form>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Email me when my report is ready</p>
              <p className="text-xs text-muted-foreground">Receive an email notification when a report finishes processing.</p>
            </div>
            <Switch checked={notifyReportReady} onCheckedChange={(v) => { setNotifyReportReady(v); }} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSettings;
