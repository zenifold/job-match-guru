import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Create Your Professional Resume
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Build and optimize your resume with AI-powered suggestions. Match your skills with job descriptions and get hired faster.
        </p>
        <Button size="lg" asChild>
          <Link to="/builder">
            <FileText className="mr-2 h-5 w-5" />
            Start Building
          </Link>
        </Button>
      </div>
    </MainLayout>
  );
};

export default Index;