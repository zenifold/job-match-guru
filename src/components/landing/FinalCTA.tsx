import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const FinalCTA = () => {
  return (
    <div className="py-24">
      <div className="max-w-3xl mx-auto text-center px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Land Your Dream Job?</h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join thousands of job seekers who are getting more interviews with ResumeAI.
        </p>
        <Button size="lg" className="min-w-[200px]" asChild>
          <Link to="/login">Get Started Free</Link>
        </Button>
      </div>
    </div>
  );
};