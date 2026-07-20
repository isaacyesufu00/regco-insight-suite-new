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
import RegcoHome from "./pages/RegcoHome";
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
import CaseManagement from "./pages/CaseManagement";
import AmlRules from "./pages/AmlRules";
import AuditLog from "./pages/AuditLog";
import CbsConnectors from "./pages/CbsConnectors";
import NfiuReports from "./pages/NfiuReports";
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
import CBNCirculars from "./pages/blog/CBNCirculars";
import PrivacyPolicyPage from "./pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/legal/TermsOfServicePage";
import DataProcessingPage from "./pages/legal/DataProcessingPage";
import SupportPage from "./pages/contact/SupportPage";
import PartnershipsPage from "./pages/contact/PartnershipsPage";
import DashboardWorkspace from "./pages/DashboardWorkspace";
import DashboardInsights from "./pages/DashboardInsights";
import { WhoWeServePage, PricingPage } from "./pages/marketing/MarketingPages";
import Homepage from "./pages/marketing/Homepage";
import DocsPage from "./pages/marketing/DocsPage";
import FraudDetectionPage from "./pages/marketing/FraudDetectionPage";
import IdentityScreeningPage from "./pages/marketing/IdentityScreeningPage";
import AuditGovernancePage from "./pages/marketing/AuditGovernancePage";
import RegulatoryReportingPage from "./pages/marketing/RegulatoryReportingPage";
import AiComplianceBrainPage from "./pages/marketing/AiComplianceBrainPage";
import CustomersPage from "./pages/marketing/CustomersPage";
import CareersPage from "./pages/marketing/CareersPage";
import KnowledgeBasePage from "./pages/marketing/KnowledgeBasePage";
import ComplianceGuidesPage from "./pages/marketing/ComplianceGuidesPage";
import DataProcessingPageNew from "./pages/marketing/DataProcessingPage";
import ResponsibleAiPage from "./pages/marketing/ResponsibleAiPage";
import PlatformUpdatesPage from "./pages/marketing/PlatformUpdatesPage";
import NewProductPage from "./pages/marketing/ProductPage";
import NewCompanyPage from "./pages/marketing/CompanyPage";
import AboutPageLegacy from "./pages/marketing/AboutPage";
import ProductAutomatedReturns from "./pages/marketing/ProductAutomatedReturns";
import ProductLiveScreening from "./pages/marketing/ProductLiveScreening";
import ProductTransactionMonitoring from "./pages/marketing/ProductTransactionMonitoring";
import ProductAuditTrail from "./pages/marketing/ProductAuditTrail";
import AdminTemplates from "./pages/AdminTemplates";
import AdminTemplateEditor from "./pages/AdminTemplateEditor";
import EditorialProduct from "./pages/Product";
import ProductPage from "./pages/ProductPage";
import EditorialAboutUs from "./pages/AboutUs";
import WhoWeServeLegacy from "./pages/WhoWeServe";
import WhoWeServeProduct from "./pages/WhoWeServePage";
import AboutUsPage from "./pages/AboutUsPage";

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
            <Route path="/" element={<RegcoHome />} />
            <Route path="/research" element={<Index />} />
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
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/fraud-detection" element={<FraudDetectionPage />} />
            <Route path="/identity-screening" element={<IdentityScreeningPage />} />
            <Route path="/audit-governance" element={<AuditGovernancePage />} />
            <Route path="/regulatory-reporting" element={<RegulatoryReportingPage />} />
            <Route path="/ai-compliance-brain" element={<AiComplianceBrainPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/product-legacy" element={<NewProductPage />} />
            <Route path="/product/automated-returns" element={<ProductAutomatedReturns />} />
            <Route path="/product/live-screening" element={<ProductLiveScreening />} />
            <Route path="/product/transaction-monitoring" element={<ProductTransactionMonitoring />} />
            <Route path="/product/audit-trail" element={<ProductAuditTrail />} />
            <Route path="/about-us" element={<EditorialAboutUs />} />
            <Route path="/who-we-serve" element={<WhoWeServeProduct />} />
            <Route path="/who-we-serve-legacy" element={<WhoWeServeLegacy />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/company" element={<NewCompanyPage />} />
            {/* Blog */}
            <Route path="/blog/updates" element={<BlogUpdates />} />
            <Route path="/blog/updates/:slug" element={<BlogUpdateDetail />} />
            <Route path="/blog/compliance-guide" element={<Navigate to="/compliance-guides" replace />} />
            <Route path="/blog/cbn-circulars" element={<CBNCirculars />} />
            {/* Legal */}
            <Route path="/legal/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/legal/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/legal/data-processing" element={<DataProcessingPageNew />} />
            <Route path="/legal/ndpc-compliance" element={<Navigate to="/legal/responsible-ai" replace />} />
            <Route path="/legal/responsible-ai" element={<ResponsibleAiPage />} />
            {/* Marketing footer pages */}
            <Route path="/compliance-guides" element={<ComplianceGuidesPage />} />
            <Route path="/platform-updates" element={<PlatformUpdatesPage />} />
            {/* Contact */}
            <Route path="/contact/book-demo" element={<Navigate to="/book-demo" replace />} />
            <Route path="/contact/support" element={<SupportPage />} />
            <Route path="/contact/partnerships" element={<PartnershipsPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/about-legacy" element={<AboutPageLegacy />} />
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
              <Route path="insights" element={<DashboardInsights />} />
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
              <Route path="cases" element={<FeatureGate feature="auditTracker" requiredTier="State MFB"><CaseManagement /></FeatureGate>} />
              <Route path="aml-rules" element={<AmlRules />} />
              <Route path="audit-log" element={<AuditLog />} />
              <Route path="connectors" element={<FeatureGate feature="transactionMonitor"><CbsConnectors /></FeatureGate>} />
              <Route path="nfiu-reports" element={<NfiuReports />} />
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
