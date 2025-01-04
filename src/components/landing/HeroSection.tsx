import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 pb-32">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 animate-gradient-x" />
        <div className="absolute inset-0 opacity-50">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-blue-100 to-purple-100 animate-gradient-y" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
          ResumeAI
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Stop spending hours tailoring resumes. Let AI match your experience to job requirements instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="min-w-[200px]" asChild>
            <Link to="/login">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};