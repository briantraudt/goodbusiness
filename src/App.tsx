
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Consulting from "./pages/Consulting";
import Ventures from "./pages/Ventures";
import NotFound from "./pages/NotFound";
import BusinessEvaluator from "./pages/BusinessEvaluator";
import Contact from "./pages/Contact";
import ClientLogin from "./pages/ClientLogin";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { ClientAuthProvider } from "./contexts/ClientAuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import ScrollToTop from "./components/common/ScrollToTop";
import { useAdminAuth } from "./contexts/AdminAuthContext";
import React from "react";

const queryClient = new QueryClient();

// Protected route component for admin pages
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { adminLoggedIn, checkingAuth } = useAdminAuth();
  const location = useLocation();
  
  if (checkingAuth) {
    return <div>Loading...</div>;
  }
  
  if (!adminLoggedIn) {
    // Redirect to admin login if not logged in
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <ClientAuthProvider>
          <AdminAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/consulting" element={<Consulting />} />
              <Route path="/projects" element={<Ventures />} />
              <Route path="/ventures" element={<Navigate to="/projects" replace />} />
              <Route path="/evaluator" element={<BusinessEvaluator />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/client" element={<ClientLogin />} />
              <Route path="/client/:slug" element={<ClientDashboard />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/clients" element={
                <ProtectedAdminRoute>
                  <AdminDashboard />
                </ProtectedAdminRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AdminAuthProvider>
        </ClientAuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
