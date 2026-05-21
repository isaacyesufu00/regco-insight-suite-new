import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { Navigate } from "react-router-dom";
import Contact from "./pages/Contact";
import BookDemo from "./pages/BookDemo";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import NewReport from "./pages/NewReport";
import MyReports from "./pages/MyReports";
import DataSources from "./pages/DataSources";
import DashboardSettings from "./pages/DashboardSettings";
import ComplianceCalendar from "./pages/ComplianceCalendar";
import DashboardTutorial from "./pages/DashboardTutorial";
import TransactionMonitor from "./pages/TransactionMonitor";
import Customer360 from "./pages/Customer360";
import AdminLayout from "./pages/AdminLayout";
import AdminClients from "./pages/AdminClients";
import AdminClientDetail from "./pages/AdminClientDetail";
import AdminOnboard from "./pages/AdminOnboard";
import AdminDemos from "./pages/AdminDemos";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import SupportTickets from "./pages/SupportTickets";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthConfirm from "./pages/auth/Confirm";
import BlogUpdates from "./pages/blog/BlogUpdates";
import BlogUpdateDetail from "./pages/blog/BlogUpdateDetail";
import ComplianceGuide from "./pages/blog/ComplianceGuide";
import CBNCirculars from "./pages/blog/CBNCirculars";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/legal/TermsOfServicePage";
import DataProcessingPage from "./pages/legal/DataProcessingPage";
import NDPCCompliancePage from "./pages/legal/NDPCCompliancePage";
import SupportPage from "./pages/contact/SupportPage";
import PartnershipsPage from "./pages/contact/PartnershipsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/signup" element={<Navigate to="/sign-up" replace />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/book-demo" element={<BookDemo />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/confirm" element={<AuthConfirm />} />
            <Route path="/auth/callback" element={<AuthConfirm />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/security" element={<Security />} />
            {/* Blog */}
            <Route path="/blog/updates" element={<BlogUpdates />} />
            <Route path="/blog/updates/:slug" element={<BlogUpdateDetail />} />
            <Route path="/blog/compliance-guide" element={<ComplianceGuide />} />
            <Route path="/blog/cbn-circulars" element={<CBNCirculars />} />
            {/* Legal */}
            <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/legal/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/legal/data-processing" element={<DataProcessingPage />} />
            <Route path="/legal/ndpc-compliance" element={<NDPCCompliancePage />} />
            {/* Contact */}
            <Route path="/contact/book-demo" element={<Navigate to="/book-demo" replace />} />
            <Route path="/contact/support" element={<SupportPage />} />
            <Route path="/contact/partnerships" element={<PartnershipsPage />} />
            {/* Redirect old public pages to homepage */}
            <Route path="/about" element={<Navigate to="/#about" replace />} />
            <Route path="/features/*" element={<Navigate to="/#features" replace />} />
            <Route path="/use-cases/*" element={<Navigate to="/#platform" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="reports" element={<MyReports />} />
              <Route path="new-report" element={<NewReport />} />
              <Route path="data-sources" element={<DataSources />} />
              <Route path="calendar" element={<ComplianceCalendar />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="support" element={<SupportTickets />} />
              <Route path="tutorial" element={<DashboardTutorial />} />
              <Route path="transactions" element={<TransactionMonitor />} />
              <Route path="customers" element={<Customer360 />} />
            </Route>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminClients />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="clients/:id" element={<AdminClientDetail />} />
              <Route path="onboard" element={<AdminOnboard />} />
              <Route path="demos" element={<AdminDemos />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
