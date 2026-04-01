import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

import ExplorePage from "./pages/ExplorePage";
import CollectionsPage from "./pages/CollectionsPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";
import FreeSpotsPage from "./pages/FreeSpotsPage";
import NotFound from "./pages/NotFound";

import AdminAnalytics from "./pages/AdminAnalytics";
import SelfGuidedLanding from "./pages/SelfGuidedLanding";
import ExperienceLanding from "./pages/ExperienceLanding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/esplora" element={<ExplorePage />} />
            <Route path="/collezioni" element={<CollectionsPage />} />
            <Route path="/collezioni/:id" element={<CollectionDetailPage />} />
            <Route path="/free-spots" element={<FreeSpotsPage />} />
            
            <Route path="/auth" element={<AuthProvider><Auth /></AuthProvider>} />
            <Route path="/admin" element={<AuthProvider><Admin /></AuthProvider>} />
            <Route path="/admin-analytics" element={<AuthProvider><AdminAnalytics /></AuthProvider>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
