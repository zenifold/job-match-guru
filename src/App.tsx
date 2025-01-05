import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  return (
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
    </Router>
  );
}

export default App;