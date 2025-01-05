import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ResumeProvider } from "@/contexts/ResumeContext";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Builder from "@/pages/Builder";
import Preview from "@/pages/Preview";
import Jobs from "@/pages/Jobs";
import CreateJob from "@/pages/CreateJob";
import Settings from "@/pages/Settings";
import Resumes from "@/pages/Resumes";
import WorkdayProfile from "@/pages/WorkdayProfile";
import TestEnvironment from "@/pages/TestEnvironment";

const queryClient = new QueryClient();
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <BrowserRouter>
            <ResumeProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/builder" element={<Builder />} />
                <Route path="/preview/:id" element={<Preview />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/create-job" element={<CreateJob />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/resumes" element={<Resumes />} />
                <Route path="/workday-profile" element={<WorkdayProfile />} />
                <Route path="/test-environment" element={<TestEnvironment />} />
              </Routes>
            </ResumeProvider>
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;