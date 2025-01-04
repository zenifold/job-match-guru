import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Breadcrumbs } from "./Breadcrumbs";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4 animate-fadeIn">
        <Breadcrumbs />
        <div className="mt-4">{children}</div>
      </main>
    </div>
  );
};