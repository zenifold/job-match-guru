import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Breadcrumbs } from "./Breadcrumbs";
import { useSession } from "@supabase/auth-helpers-react";

interface MainLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export const MainLayout = ({ children, hideNav = false }: MainLayoutProps) => {
  const session = useSession();
  const showNav = !hideNav && session;

  return (
    <div className="min-h-screen bg-background">
      {showNav && <Navbar />}
      <main className={`${showNav ? 'container mx-auto py-6 px-4' : 'w-full'} animate-fadeIn`}>
        {showNav && <Breadcrumbs />}
        <div className={showNav ? "mt-4" : ""}>{children}</div>
      </main>
    </div>
  );
};