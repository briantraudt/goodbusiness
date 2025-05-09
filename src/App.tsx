
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Consulting from "./pages/Consulting";
import Ventures from "./pages/Ventures";
import NotFound from "./pages/NotFound";
import BusinessEvaluator from "./pages/BusinessEvaluator";
import React from 'react';

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Use functional component syntax for App
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/projects" element={<Ventures />} />
            <Route path="/ventures" element={<Navigate to="/projects" replace />} />
            <Route path="/contact" element={<Navigate to="/evaluator" replace />} />
            <Route path="/evaluator" element={<BusinessEvaluator />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
