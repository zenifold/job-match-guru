import { Button } from "@/components/ui/button";
import { Briefcase, FileText, LayoutDashboard, LogIn, LogOut, Menu, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const session = useSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

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

  const NavLinks = () => (
    <>
      <Button variant="ghost" asChild>
        <Link to="/dashboard" onClick={() => setIsOpen(false)}>
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Dashboard
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/resumes" onClick={() => setIsOpen(false)}>
          <FileText className="h-4 w-4 mr-2" />
          Resumes
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/jobs" onClick={() => setIsOpen(false)}>
          <Briefcase className="h-4 w-4 mr-2" />
          Jobs
        </Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/settings" onClick={() => setIsOpen(false)}>
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Link>
      </Button>
      <Button 
        variant="ghost" 
        onClick={() => {
          handleLogout();
          setIsOpen(false);
        }}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </>
  );

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span className="font-semibold text-lg">ResumeAI</span>
        </Link>
        
        {session ? (
          <>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLinks />
            </div>

            {/* Mobile Navigation */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </div>
              </SheetContent>
            </Sheet>
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
    </nav>
  );
};