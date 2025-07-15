
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./components/Dashboard";
import Agents from "./pages/Dashboard/Agents";
import DashboardKnowledgeBase from "./pages/Dashboard/KnowledgeBase";
import Actions from "./pages/Dashboard/Actions";
import Profile from "./pages/Dashboard/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard/agents" replace />} />
              <Route path="agents" element={<Agents />} />
              <Route path="knowledge-base" element={<DashboardKnowledgeBase />} />
              <Route path="actions" element={<Actions />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            {/* Legacy routes for backward compatibility */}
            <Route path="/knowledge-base" element={<Navigate to="/dashboard/knowledge-base" replace />} />
            <Route path="/chat" element={<Navigate to="/dashboard/agents" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
