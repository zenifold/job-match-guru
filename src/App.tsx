import { BrowserRouter } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { TooltipProvider } from "@/components/ui/tooltip"

import { supabase } from "./integrations/supabase/client"
import Index from "./pages/Index"
import Login from "./pages/Login"
import Jobs from "./pages/Jobs"
import CreateJob from "./pages/CreateJob"
import Builder from "./pages/Builder"
import Preview from "./pages/Preview"
import Resumes from "./pages/Resumes"
import Dashboard from "./pages/Dashboard"
import Settings from "./pages/Settings"

import "./App.css"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/new" element={<CreateJob />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/resumes" element={<Resumes />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  )
}

export default App