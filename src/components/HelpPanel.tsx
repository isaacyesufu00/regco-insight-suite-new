import { useState } from "react";
import { HelpCircle, Send, CheckCircle2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const subjects = [
  "Report Generation Issue",
  "File Upload Issue",
  "Login Problem",
  "Billing Question",
  "Other",
];

const faqs = [
  { q: "How long does report generation take?", a: "Most reports are ready within 2 to 5 minutes. If your report is still processing after 10 minutes please contact support." },
  { q: "What file formats can I upload?", a: "We accept Excel (.xlsx) and CSV (.csv) files exported from your core banking system." },
  { q: "My download link has expired. What do I do?", a: "Return to My Reports and click the Download button again to generate a fresh link." },
  { q: "Can I edit a report after it has been generated?", a: "Download the Word version of your report which is fully editable." },
  { q: "How do I add another user from my team?", a: "Go to Settings and select User Management to invite additional team members." },
  { q: "What happens if I submit incorrect data?", a: "Do not submit the report to the CBN. Contact support immediately and we will void the report and help you generate a corrected version." },
];

export function HelpPanel() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!subject || message.trim().length < 20) {
      toast({ title: "Please select a subject and enter at least 20 characters.", variant: "destructive" });
      return;
    }
    if (!user) return;

    setSubmitting(true);
    try {
      // Get institution name
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_name")
        .eq("id", user.id)
        .maybeSingle();

      const institutionName = profile?.company_name || "Unknown";

      const { error } = await supabase.from("support_tickets").insert({
        user_id: user.id,
        institution_name: institutionName,
        subject,
        message: message.trim(),
      });

      if (error) throw error;

      // Send notification email
      await supabase.functions.invoke("send-support-notification", {
        body: { institution_name: institutionName, subject, message: message.trim(), user_email: user.email },
      });

      setSubmitted(true);
      setSubject("");
      setMessage("");
    } catch {
      toast({ title: "Failed to submit ticket. Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSubject("");
    setMessage("");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
        <SheetTrigger asChild>
          <button
            className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
            aria-label="Get help"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Support</SheetTitle>
          </SheetHeader>
          <Tabs defaultValue="help" className="mt-4">
            <TabsList className="w-full">
              <TabsTrigger value="help" className="flex-1">Get Help</TabsTrigger>
              <TabsTrigger value="faqs" className="flex-1">FAQs</TabsTrigger>
            </TabsList>

            <TabsContent value="help" className="mt-4 space-y-4">
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                  <h3 className="text-lg font-semibold text-foreground">Message Received</h3>
                  <p className="text-sm text-muted-foreground">
                    Your message has been received. A member of the RegCo team will respond within 4 business hours.
                  </p>
                  <Button variant="outline" onClick={resetForm}>Submit Another Request</Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Subject</label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Message</label>
                    <Textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue in detail (minimum 20 characters)..."
                      rows={5}
                    />
                    {message.length > 0 && message.length < 20 && (
                      <p className="text-xs text-destructive">{20 - message.length} more characters needed</p>
                    )}
                  </div>
                  <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                </>
              )}
            </TabsContent>

            <TabsContent value="faqs" className="mt-4">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>
    </>
  );
}
