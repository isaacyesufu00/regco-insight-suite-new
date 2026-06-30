import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import CookieConsent from "@/components/CookieConsent";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { Navigate } from "react-router-dom";
import Contact from "./pages/Contact";
import BookDemo from "./pages/BookDemo";
import Dashboard from "./pages/Dashboard";
import DashboardHome from "./pages/DashboardHome";
import NewReport from "./pages/NewReport";
import MyReports from "./pages/MyReports";

import DashboardSettings from "./pages/DashboardSettings";
import ComplianceCalendar from "./pages/ComplianceCalendar";
import DashboardTutorial from "./pages/DashboardTutorial";
import TransactionMonitor from "./pages/TransactionMonitor";
import Customer360 from "./pages/Customer360";
import Screening from "./pages/Screening";
import RegulatoryIntelligence from "./pages/RegulatoryIntelligence";
import BoardPack from "./pages/BoardPack";
import AuditTracker from "./pages/AuditTracker";
import FeatureGate from "./components/FeatureGate";
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
import DashboardWorkspace from "./pages/DashboardWorkspace";
import { WhoWeServePage, PricingPage } from "./pages/marketing/MarketingPages";
import Homepage from "./pages/marketing/Homepage";
import SecurityPage from "./pages/marketing/SecurityPage";
import NewProductPage from "./pages/marketing/ProductPage";
import NewCompanyPage from "./pages/marketing/CompanyPage";
import AboutPage from "./pages/marketing/AboutPage";
import ProductAutomatedReturns from "./pages/marketing/ProductAutomatedReturns";
import ProductLiveScreening from "./pages/marketing/ProductLiveScreening";
import ProductTransactionMonitoring from "./pages/marketing/ProductTransactionMonitoring";
import ProductAuditTrail from "./pages/marketing/ProductAuditTrail";
import AdminTemplates from "./pages/AdminTemplates";
import AdminTemplateEditor from "./pages/AdminTemplateEditor";
import EditorialProduct from "./pages/Product";
import EditorialAboutUs from "./pages/AboutUs";
import EditorialWhoWeServe from "./pages/WhoWeServe";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <ProfileProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/home-legacy" element={<Homepage />} />
            <Route path="/login" element={<Navigate to="/sign-in" replace />} />
            <Route path="/sign-in" element={<SignIn />} />
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
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/product" element={<NewProductPage />} />
            <Route path="/product/automated-returns" element={<ProductAutomatedReturns />} />
            <Route path="/product/live-screening" element={<ProductLiveScreening />} />
            <Route path="/product/transaction-monitoring" element={<ProductTransactionMonitoring />} />
            <Route path="/product/audit-trail" element={<ProductAuditTrail />} />
            <Route path="/who-we-serve" element={<WhoWeServePage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/company" element={<NewCompanyPage />} />
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
            <Route path="/about" element={<AboutPage />} />
            {/* Redirect old public pages to homepage */}
            <Route path="/features/*" element={<Navigate to="/#features" replace />} />
            <Route path="/use-cases/*" element={<Navigate to="/#platform" replace />} />
            <Route path="/dashboard/agent" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardWorkspace />} />
              <Route path="reports" element={<MyReports />} />
              <Route path="new-report" element={<NewReport />} />
              <Route path="data-sources" element={<Navigate to="/dashboard/transactions" replace />} />
              <Route path="calendar" element={<ComplianceCalendar />} />
              <Route path="settings" element={<DashboardSettings />} />
              <Route path="support" element={<SupportTickets />} />
              <Route path="tutorial" element={<DashboardTutorial />} />
              <Route path="transactions" element={<FeatureGate feature="transactionMonitor"><TransactionMonitor /></FeatureGate>} />
              <Route path="customers" element={<FeatureGate feature="customerIntelligence" requiredTier="State MFB"><Customer360 /></FeatureGate>} />
              <Route path="screening" element={<FeatureGate feature="sanctionsScreening" requiredTier="State MFB"><Screening /></FeatureGate>} />
              <Route path="regulatory-intelligence" element={<RegulatoryIntelligence />} />
              <Route path="board-pack" element={<FeatureGate feature="boardPack" requiredTier="State MFB"><BoardPack /></FeatureGate>} />
              <Route path="audit-tracker" element={<FeatureGate feature="auditTracker" requiredTier="State MFB"><AuditTracker /></FeatureGate>} />
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
              <Route path="templates" element={<AdminTemplates />} />
              <Route path="templates/:id" element={<AdminTemplateEditor />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
          </ProfileProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
