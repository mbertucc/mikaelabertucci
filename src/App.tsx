import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import VenturesHub from "./pages/VenturesHub";
import UserManagement from "./pages/UserManagement";
import SiteAnalytics from "./pages/SiteAnalytics";
import NotFound from "./pages/NotFound";
import Delpheus from "./pages/Delpheus";
import { AnalyticsWrapper } from "./components/AnalyticsWrapper";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnalyticsWrapper />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<AuthGuard requireAdmin={true}><Admin /></AuthGuard>} />
            <Route path="/ventures" element={<VenturesHub />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/users" element={<AuthGuard requireAdmin={true}><UserManagement /></AuthGuard>} />
            <Route path="/admin/analytics" element={<AuthGuard requireAdmin={true}><SiteAnalytics /></AuthGuard>} />
            <Route path="/delpheus" element={<Delpheus />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
