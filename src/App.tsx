import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Routines from "./pages/Routines";
import Exercises from "./pages/Exercises";
import Calendar from "./pages/Calendar";
import Training from "./pages/Training";
import Progress from "./pages/Progress";
import Profile from "./pages/Profile";
import CreateRoutine from "./pages/CreateRoutine";
import RoutineDetail from "./pages/RoutineDetail";
import NotFound from "./pages/NotFound";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import Clients from "./pages/Clients";
import Chat from "./pages/Chat";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-mobile-nav">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/*" 
                element={
                  <ProtectedRoute>
                    <Navigation />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/clients" element={<Clients />} />
                      <Route path="/routines" element={<Routines />} />
                      <Route path="/routines/create" element={<CreateRoutine />} />
                      <Route path="/routines/create/:id" element={<CreateRoutine />} />
                      <Route path="/routines/:id" element={<RoutineDetail />} />
                      <Route path="/exercises" element={<Exercises />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/training" element={<Training />} />
                      <Route path="/progress" element={<Progress />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/chat/:userId" element={<Chat />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <FloatingActionButton />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
