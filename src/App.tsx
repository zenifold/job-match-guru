import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createClient } from "@supabase/supabase-js";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { ResumeProvider } from "@/contexts/ResumeContext";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Jobs from "@/pages/Jobs";
import CreateJob from "@/pages/CreateJob";
import Builder from "@/pages/Builder";
import Resumes from "@/pages/Resumes";
import Preview from "@/pages/Preview";
import Settings from "@/pages/Settings";
import TestEnvironment from "@/pages/TestEnvironment";
import WorkdayProfile from "@/pages/WorkdayProfile";
import ExtensionAuth from "@/pages/ExtensionAuth";

// Initialize Supabase client
const supabaseUrl = "https://qqbulzzezbcwstrhfbco.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxYnVsenplemJjd3N0cmhmYmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5MjA0MzcsImV4cCI6MjA1MTQ5NjQzN30.vUmslRzwtXxNEjOQXFbRnMHd-ZoghRFmBbqJn2l2g8c";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Initialize Query Client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <ResumeProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/new" element={<CreateJob />} />
                <Route path="/builder" element={<Builder />} />
                <Route path="/resumes" element={<Resumes />} />
                <Route path="/preview" element={<Preview />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/test" element={<TestEnvironment />} />
                <Route path="/workday-profile" element={<WorkdayProfile />} />
                <Route path="/extension-auth" element={<ExtensionAuth />} />
              </Routes>
              <Toaster />
            </Router>
          </ResumeProvider>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

export default App;