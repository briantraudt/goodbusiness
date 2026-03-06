
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientLogin from "./pages/ClientLogin";
import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AIBusinessIdeas from "./pages/AIBusinessIdeas";
import AIBusinessIdeasIndex from "./pages/AIBusinessIdeasIndex";
import { ClientAuthProvider } from "./contexts/ClientAuthContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
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
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ClientAuthProvider>
            <AdminAuthProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                {/* Redirect old routes to homepage */}
                <Route path="/consulting" element={<Navigate to="/" replace />} />
                <Route path="/contact" element={<Navigate to="/" replace />} />
                <Route path="/training" element={<Navigate to="/" replace />} />
                <Route path="/evaluator" element={<Navigate to="/" replace />} />
                {/* AI Business Ideas - Programmatic SEO */}
                <Route path="/ai-business-ideas" element={<AIBusinessIdeasIndex />} />
                <Route path="/ai-business-ideas-for/:slug" element={<AIBusinessIdeas />} />
                {/* Client portal */}
                <Route path="/clients" element={<ClientLogin />} />
                <Route path="/clients/:slug" element={<ClientDashboard />} />
                <Route path="/client" element={<Navigate to="/clients" replace />} />
                <Route path="/client/:slug" element={<Navigate to="/clients/:slug" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/clients" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AdminAuthProvider>
          </ClientAuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
