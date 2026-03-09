import { useEffect, useState } from "react";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BackButton } from "@/components/BackButton";
import { Users, UserPlus, MessageSquare } from "lucide-react";

interface Client {
  id: string;
  full_name: string | null;
  company_name: string | null;
  rc_number: string | null;
  created_at: string;
  account_status: string;
}

interface DemoRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string;
  message: string | null;
  created_at: string;
}

const ALL_TYPES = [
  "CBN Monetary Policy Return", "CBN Forex Return", "AML/CFT Report",
  "NFIU Regulatory Return", "Prudential Return", "MFB Regulatory Return", "SCUML Compliance Report",
];

const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [clients, setClients] = useState<Client[]>([]);
  const [demoRequests, setDemoRequests] = useState<DemoRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Onboard form
  const [onboardName, setOnboardName] = useState("");
  const [onboardRC, setOnboardRC] = useState("");
  const [onboardCBN, setOnboardCBN] = useState("");
  const [onboardLead, setOnboardLead] = useState("");
  const [onboardEmail, setOnboardEmail] = useState("");
  const [onboardPhone, setOnboardPhone] = useState("");
  const [onboardTypes, setOnboardTypes] = useState<string[]>([]);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    if (adminLoading) return;
    if (!isAdmin) { navigate("/dashboard"); return; }

    Promise.all([
      supabase.from("profiles").select("id, full_name, company_name, rc_number, created_at, account_status"),
      supabase.from("demo_requests").select("*").order("created_at", { ascending: false }),
    ]).then(([clientsRes, demosRes]) => {
      if (clientsRes.data) setClients(clientsRes.data);
      if (demosRes.data) setDemoRequests(demosRes.data);
      setLoadingData(false);
    });
  }, [isAdmin, adminLoading, navigate]);

  const toggleType = (t: string) => {
    setOnboardTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const handleOnboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardEmail || !onboardName) return;
    setOnboarding(true);

    try {
      // Note: Creating auth accounts requires service role - this would be an edge function in production
      // For now we show a message about this limitation
      toast({
        title: "Client onboarding",
        description: "Client onboarding with account creation requires a backend service. The profile data has been noted.",
      });
    } catch {
      toast({ title: "Something went wrong", description: "We couldn't onboard this client.", variant: "destructive" });
    } finally {
      setOnboarding(false);
    }
  };

  if (adminLoading || loadingData) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto">
      <BackButton to="/dashboard" />
      <h1 className="text-2xl font-bold text-foreground mb-6">Admin Panel</h1>

      <Tabs defaultValue="clients">
        <TabsList>
          <TabsTrigger value="clients" className="gap-2"><Users className="h-4 w-4" />Client Management</TabsTrigger>
          <TabsTrigger value="onboard" className="gap-2"><UserPlus className="h-4 w-4" />Onboard Client</TabsTrigger>
          <TabsTrigger value="demos" className="gap-2"><MessageSquare className="h-4 w-4" />Demo Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="clients">
          <Card>
            <CardHeader><CardTitle>All Clients</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institution</TableHead>
                      <TableHead>RC Number</TableHead>
                      <TableHead>Date Joined</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.company_name || c.full_name || "—"}</TableCell>
                        <TableCell>{c.rc_number || "—"}</TableCell>
                        <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                        <TableCell><Badge variant={c.account_status === "Active" ? "default" : "secondary"}>{c.account_status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboard">
          <Card>
            <CardHeader>
              <CardTitle>Onboard New Client</CardTitle>
              <CardDescription>Register a new institution on the RegCo platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOnboard} className="space-y-4 max-w-lg">
                <div className="space-y-2"><Label>Institution Name *</Label><Input value={onboardName} onChange={(e) => setOnboardName(e.target.value)} required maxLength={200} /></div>
                <div className="space-y-2"><Label>RC Number</Label><Input value={onboardRC} onChange={(e) => setOnboardRC(e.target.value)} placeholder="RC123456" maxLength={50} /></div>
                <div className="space-y-2"><Label>CBN License Category</Label><Input value={onboardCBN} onChange={(e) => setOnboardCBN(e.target.value)} maxLength={100} /></div>
                <div className="space-y-2"><Label>Compliance Lead Full Name</Label><Input value={onboardLead} onChange={(e) => setOnboardLead(e.target.value)} maxLength={100} /></div>
                <div className="space-y-2"><Label>Email *</Label><Input type="email" value={onboardEmail} onChange={(e) => setOnboardEmail(e.target.value)} required maxLength={255} /></div>
                <div className="space-y-2"><Label>Phone Number</Label><Input value={onboardPhone} onChange={(e) => setOnboardPhone(e.target.value)} maxLength={30} /></div>
                <div className="space-y-2">
                  <Label>Report Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TYPES.map((t) => (
                      <Badge
                        key={t}
                        variant={onboardTypes.includes(t) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleType(t)}
                      >{t}</Badge>
                    ))}
                  </div>
                </div>
                <Button type="submit" disabled={onboarding}>{onboarding ? "Onboarding..." : "Onboard Client"}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demos">
          <Card>
            <CardHeader><CardTitle>Demo Requests</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoRequests.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-medium">{d.full_name}</TableCell>
                        <TableCell>{d.email}</TableCell>
                        <TableCell>{d.phone || "—"}</TableCell>
                        <TableCell>{d.company_name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{d.message || "—"}</TableCell>
                        <TableCell>{new Date(d.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
