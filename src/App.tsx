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

// Initialize Supabase client
const supabaseUrl = "https://qqbulzzezbcwstrhfbco.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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