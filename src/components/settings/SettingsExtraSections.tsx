import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { useProfile } from "@/contexts/ProfileContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Copy, Eye, EyeOff, RefreshCw, UserPlus, Trash2, Mail } from "lucide-react";

const API_ENDPOINT = "https://pdplkprcomjslilznbsl.supabase.co/functions/v1/api-reports";

interface InviteRow {
  id: string;
  invited_email: string;
  invited_name: string | null;
  role: string;
  status: string;
  created_at: string;
}

const ROLE_LABEL: Record<string, string> = {
  compliance_officer: "Compliance Officer",
  analyst: "Analyst",
  read_only: "Read Only",
};

function TeamMembersSection() {
  const { user } = useAuth();
  const { maxUsersAllowed } = useFeatureAccess();
  const { toast } = useToast();
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("compliance_officer");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await (supabase as any)
      .from("institution_users")
      .select("id, invited_email, invited_name, role, status, created_at")
      .eq("admin_user_id", user.id)
      .order("created_at", { ascending: false });
    setInvites((data as unknown as InviteRow[]) || []);
  };

  useEffect(() => { load(); }, [user?.id]);

  if (maxUsersAllowed <= 1) return null;

  const used = invites.filter((i) => i.status !== "revoked").length + 1; // +1 for owner
  const remaining = maxUsersAllowed - used;

  const submit = async () => {
    if (!user) return;
    if (!email.includes("@")) { toast({ title: "Invalid email", variant: "destructive" }); return; }
    if (remaining <= 0) { toast({ title: "User limit reached", description: `Your plan allows ${maxUsersAllowed} users.`, variant: "destructive" }); return; }
    setSubmitting(true);
    const { error } = await (supabase as any).from("institution_users").insert({
      admin_user_id: user.id,
      invited_email: email.trim().toLowerCase(),
      invited_name: name.trim() || null,
      role,
      status: "pending",
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not invite", description: error.message.includes("duplicate") ? "This email is already invited." : "Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: "Invite created", description: `${email} can sign up at regco-insight-suite.vercel.app/sign-up to join.` });
    setOpen(false); setEmail(""); setName(""); setRole("compliance_officer");
    load();
  };

  const revoke = async (id: string) => {
    await supabase.from("institution_users").delete().eq("id", id);
    load();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Invite colleagues to your institution. {used} of {maxUsersAllowed} seats used.
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" disabled={remaining <= 0}>
              <UserPlus className="w-4 h-4 mr-2" /> Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Invite team member</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="colleague@institution.com" />
              </div>
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compliance_officer">Compliance Officer</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="read_only">Read Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={submit} disabled={submitting}>{submitting ? "Sending..." : "Send invite"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {invites.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No team members invited yet.</p>
        ) : (
          <div className="divide-y">
            {invites.map((i) => (
              <div key={i.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{i.invited_name || i.invited_email}</p>
                    <p className="text-xs text-muted-foreground truncate">{i.invited_email} · {ROLE_LABEL[i.role] || i.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted capitalize">{i.status}</span>
                  <Button variant="ghost" size="icon" onClick={() => revoke(i.id)}>
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ApiAccessSection() {
  const { user } = useAuth();
  const { tier } = useFeatureAccess();
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState<string>("");
  const [show, setShow] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("profiles").select("reporting_api_key").eq("id", user.id).maybeSingle();
    setApiKey((data as any)?.reporting_api_key || "");
  };

  useEffect(() => { load(); }, [user?.id]);

  if (tier !== "national_mfb" && tier !== "commercial_bank") return null;

  const regenerate = async () => {
    if (!user) return;
    setRegenerating(true);
    const newKey = Array.from(crypto.getRandomValues(new Uint8Array(32))).map((b) => b.toString(16).padStart(2, "0")).join("");
    const { error } = await supabase.from("profiles").update({ reporting_api_key: newKey }).eq("id", user.id);
    setRegenerating(false);
    if (error) {
      toast({ title: "Could not rotate key", variant: "destructive" });
    } else {
      setApiKey(newKey);
      setShow(true);
      toast({ title: "API key rotated", description: "Update any integrations with the new key." });
    }
  };

  const masked = apiKey ? `${apiKey.slice(0, 6)}${"•".repeat(28)}${apiKey.slice(-4)}` : "";
  const copyKey = () => { navigator.clipboard.writeText(apiKey); toast({ title: "API key copied" }); };
  const copyUrl = () => { navigator.clipboard.writeText(API_ENDPOINT); toast({ title: "Endpoint URL copied" }); };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Access</CardTitle>
        <CardDescription>Programmatic access to your reports. Available on your tier.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Endpoint URL</Label>
          <div className="flex gap-2">
            <Input value={API_ENDPOINT} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={copyUrl}><Copy className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>API Key</Label>
          <div className="flex gap-2">
            <Input value={show ? apiKey : masked} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={() => setShow(!show)}>{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
            <Button variant="outline" size="icon" onClick={copyKey}><Copy className="w-4 h-4" /></Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Example request</Label>
          <pre className="bg-muted/50 rounded-md p-3 text-xs font-mono overflow-x-auto border">
{`curl -H "x-api-key: ${show ? apiKey : "<your-key>"}" \\
  ${API_ENDPOINT}`}
          </pre>
        </div>
        <Button variant="outline" onClick={regenerate} disabled={regenerating}>
          <RefreshCw className="w-4 h-4 mr-2" /> {regenerating ? "Rotating..." : "Regenerate Key"}
        </Button>
      </CardContent>
    </Card>
  );
}

function WhiteLabelSection() {
  const { tier } = useFeatureAccess();
  if (tier !== "commercial_bank") return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>White Label</CardTitle>
        <CardDescription>Operate RegCo under your institution's brand.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border bg-gradient-to-br from-muted/40 to-muted/10 p-8 text-center">
          <h3 className="text-lg font-semibold tracking-tight">White-label RegCo under your brand</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Display RegCo compliance tools under your institution's brand name, colours, and domain for your clients or internal teams.
          </p>
          <Button asChild className="mt-5">
            <a href="mailto:partnerships@regco.com.ng">Contact us about white-labelling →</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SettingsExtraSections() {
  return (
    <>
      <TeamMembersSection />
      <ApiAccessSection />
      <WhiteLabelSection />
    </>
  );
}
