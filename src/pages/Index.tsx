import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout hideNav>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-60 right-0 w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              ResumeAI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Create tailored resumes that match your dream jobs using the power of AI. Stand out from the crowd and land your next opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="min-w-[200px]" asChild>
                <Link to="/login">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
            <div className="p-6 rounded-lg bg-card border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-muted-foreground">Automatically match your skills and experience with job requirements.</p>
            </div>
            <div className="p-6 rounded-lg bg-card border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Smart Templates</h3>
              <p className="text-muted-foreground">Professional resume templates optimized for ATS systems.</p>
            </div>
            <div className="p-6 rounded-lg bg-card border shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Job Tracking</h3>
              <p className="text-muted-foreground">Keep track of your job applications and optimize your approach.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;