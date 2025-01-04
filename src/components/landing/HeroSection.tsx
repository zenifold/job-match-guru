import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden bg-gray-950">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-8 max-w-3xl mx-auto px-4 pb-32 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
          ResumeAI
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto">
          Stop spending hours tailoring resumes. Let AI match your experience to job requirements instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="min-w-[200px] bg-white text-gray-900 hover:bg-gray-100" asChild>
            <Link to="/login">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};