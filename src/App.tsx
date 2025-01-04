import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ResumeProvider } from "@/contexts/ResumeContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Routes from "./Routes";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ResumeProvider>
          <Router>
            <Routes />
            <Toaster />
          </Router>
        </ResumeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;