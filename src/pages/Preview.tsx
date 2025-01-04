import { MainLayout } from "@/components/layout/MainLayout";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Preview = () => {
  const location = useLocation();
  const resumeData = location.state?.resumeData || {};

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-4">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/resumes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resumes
          </Link>
        </Button>
        <ResumeTemplate data={resumeData} />
      </div>
    </div>
  );
};

export default Preview;