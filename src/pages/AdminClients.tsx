import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ClientRow {
  id: string;
  full_name: string | null;
  company_name: string | null;
  rc_number: string | null;
  cbn_license_category: string | null;
  compliance_lead_name: string | null;
  created_at: string;
  account_status: string;
  report_type_count: number;
  email?: string;
}

const AdminClients = () => {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, company_name, rc_number, cbn_license_category, compliance_lead_name, created_at, account_status");

      if (!profiles) { setLoading(false); return; }

      // Get report type counts per user
      const { data: reportTypes } = await supabase
        .from("institution_report_types")
        .select("user_id, report_type");

      const countMap: Record<string, number> = {};
      (reportTypes || []).forEach((rt) => {
        countMap[rt.user_id] = (countMap[rt.user_id] || 0) + 1;
      });

      const rows: ClientRow[] = profiles.map((p) => ({
        ...p,
        report_type_count: countMap[p.id] || 0,
      }));

      setClients(rows);
      setLoading(false);
    };

    fetchClients();
  }, []);

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.company_name || "").toLowerCase().includes(q) ||
      (c.rc_number || "").toLowerCase().includes(q) ||
      (c.compliance_lead_name || "").toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle>All Clients ({clients.length})</CardTitle>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, RC number..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Institution Name</TableHead>
                <TableHead>RC Number</TableHead>
                <TableHead>License Category</TableHead>
                <TableHead>Compliance Lead</TableHead>
                <TableHead>Report Types</TableHead>
                <TableHead>Date Onboarded</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No clients found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/admin/clients/${c.id}`)}
                  >
                    <TableCell className="font-medium">{c.company_name || c.full_name || "—"}</TableCell>
                    <TableCell>{c.rc_number || "—"}</TableCell>
                    <TableCell>{c.cbn_license_category || "—"}</TableCell>
                    <TableCell>{c.compliance_lead_name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{c.report_type_count}</Badge>
                    </TableCell>
                    <TableCell>{new Date(c.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant={c.account_status === "Active" ? "default" : "secondary"}>
                        {c.account_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminClients;
