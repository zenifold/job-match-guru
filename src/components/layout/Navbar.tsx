import { Button } from "@/components/ui/button";
import { FileText, Home, LogIn, LogOut, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "There was a problem logging out.",
        variant: "destructive",
      });
    }
  };

  const handleThemeChange = (theme: string) => {
    // Store the selected theme in localStorage
    localStorage.setItem('resumeTheme', theme);
    // Show success toast
    toast({
      title: "Theme Updated",
      description: `Resume theme changed to ${theme}`,
    });
  };

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
          {session ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/resumes">
                  <FileText className="h-4 w-4 mr-2" />
                  My Resumes
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Resume Theme</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleThemeChange('modern')}>
                    Modern
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange('classic')}>
                    Classic
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange('minimal')}>
                    Minimal
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange('professional')}>
                    Professional
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};