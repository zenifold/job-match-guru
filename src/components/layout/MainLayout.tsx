import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Breadcrumbs } from "./Breadcrumbs";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export const MainLayout = ({ children, hideNav = false }: MainLayoutProps) => {
  const session = useSession();
  const showNav = !hideNav && session;

  return (
    <div className="min-h-screen bg-background">
      {showNav ? (
        <Navbar />
      ) : (
        <div className="absolute top-0 right-0 p-6 z-20">
          <Button 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-colors"
            asChild
          >
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      )}
      <main className={`${showNav ? 'container mx-auto py-6 px-4' : 'w-full'} animate-fadeIn`}>
        {showNav && <Breadcrumbs />}
        <div className={showNav ? "mt-4" : ""}>{children}</div>
      </main>
    </div>
  );
};