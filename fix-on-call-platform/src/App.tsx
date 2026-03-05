import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import FloatingCallButton from "@/components/layout/FloatingCallButton";
import FloatingLiveChatButton from "@/components/layout/FloatingLiveChatButton";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ContactInfo from "./pages/ContactInfo";
import VendorApplication from "./pages/VendorApplication";
import Services from "./pages/Services";
import HowItWorksPage from "./pages/HowItWorksPage";
import Plans from "./pages/Plans";
import PaymentCheckout from "./pages/PaymentCheckout";
import ServiceRequestForm from "./pages/ServiceRequestForm";
import DriverDashboard from "./pages/driver/Dashboard";
import MechanicDashboard from "./pages/mechanic/Dashboard";
import AdminExternalRedirect from "./pages/AdminExternalRedirect";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FloatingCallButton />
      <FloatingLiveChatButton />
      <FloatingWhatsApp />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogArticle />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/plans" element={<Plans />} />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentCheckout />
              </ProtectedRoute>
            }
          />
          <Route path="/service-request" element={<ServiceRequestForm />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact-info" element={<ContactInfo />} />
          <Route
            path="/vendor-application"
            element={
              <ProtectedRoute>
                <VendorApplication />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/driver"
            element={
              <ProtectedRoute allowedRoles={["driver"]}>
                <DriverDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mechanic"
            element={
              <ProtectedRoute allowedRoles={["mechanic"]}>
                <MechanicDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin", "super_admin", "support_agent", "finance", "dispatch", "partner_manager"]}>
                <AdminExternalRedirect />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
