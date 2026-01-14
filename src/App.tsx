import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GroupDashboard from "./pages/GroupDashboard";
import BUDashboard from "./pages/BUDashboard";
import ReportReview from "./pages/ReportReview";
import ConsolidatedReportsPage from "./pages/ConsolidatedReportsPage";
import ManagementOverviewPage from "./pages/ManagementOverviewPage";
import NotFound from "./pages/NotFound";

import { ViewModeProvider } from "./contexts/ViewModeContext";
import { ViewModeSelector } from "./components/ViewModeSelector";

const queryClient = new QueryClient();

const App = () => (
  <ViewModeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ViewModeSelector />
          <Routes>
            <Route path="/" element={<GroupDashboard />} />
            <Route path="/bu/:buId" element={<BUDashboard />} />
            <Route path="/bu/:buId/report/:reportId" element={<ReportReview />} />
            <Route path="/consolidated-reports" element={<ConsolidatedReportsPage />} />
            <Route path="/management-overview" element={<ManagementOverviewPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ViewModeProvider>
);

export default App;
