import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DemoRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company_name: string;
  message: string | null;
  created_at: string;
}

const AdminDemos = () => {
  const [demos, setDemos] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("demo_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setDemos(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo Requests ({demos.length})</CardTitle>
      </CardHeader>
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
              {demos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">No demo requests yet.</TableCell>
                </TableRow>
              ) : (
                demos.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.full_name}</TableCell>
                    <TableCell>{d.email}</TableCell>
                    <TableCell>{d.phone || "—"}</TableCell>
                    <TableCell>{d.company_name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{d.message || "—"}</TableCell>
                    <TableCell>{new Date(d.created_at).toLocaleDateString()}</TableCell>
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

export default AdminDemos;
