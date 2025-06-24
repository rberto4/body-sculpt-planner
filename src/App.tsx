
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Routines from "./pages/Routines";
import Exercises from "./pages/Exercises";
import Calendar from "./pages/Calendar";
import Training from "./pages/Training";
import Progress from "./pages/Progress";
import RoutineDetail from "./pages/RoutineDetail";
import CreateRoutine from "./pages/CreateRoutine";
import NotFound from "./pages/NotFound";
import { Navigation } from "./components/Navigation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="min-h-screen bg-gray-900">
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/routines" element={<Routines />} />
                    <Route path="/routines/create" element={<CreateRoutine />} />
                    <Route path="/routines/:id" element={<RoutineDetail />} />
                    <Route path="/exercises" element={<Exercises />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
