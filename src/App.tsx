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

import NotFound from "./pages/NotFound";

import SelfGuidedLanding from "./pages/SelfGuidedLanding";
import ExperienceLanding from "./pages/ExperienceLanding";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import MapPage from "./pages/MapPage";

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
            <Route path="/self-guided" element={<SelfGuidedLanding />} />
            <Route path="/experience" element={<ExperienceLanding />} />
            <Route path="/esplora" element={<ExplorePage />} />
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="/mappa" element={<MapPage />} />
            <Route path="/contatti" element={<ContactsPage />} />

            <Route path="/auth" element={<AuthProvider><Auth /></AuthProvider>} />
            <Route path="/admin" element={<AuthProvider><Admin /></AuthProvider>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
