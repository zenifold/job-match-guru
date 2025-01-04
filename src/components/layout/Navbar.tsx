import { Button } from "@/components/ui/button";
import { FileText, Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span className="font-semibold text-lg">ResumeAI</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/builder">
              <FileText className="h-4 w-4 mr-2" />
              Resume Builder
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};