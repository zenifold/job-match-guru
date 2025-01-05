import { MainLayout } from "@/components/layout/MainLayout";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Wand2 } from "lucide-react";
import { useState } from "react";
import { OptimizationWizard } from "@/components/resume/OptimizationWizard";

const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showOptimizationWizard, setShowOptimizationWizard] = useState(false);
  const resumeData = location.state?.resumeData || {};
  const jobData = location.state?.jobData;

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        <div className="container py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Resume Preview</h1>
            <div className="flex gap-2">
              {jobData && (
                <Button 
                  onClick={() => setShowOptimizationWizard(true)}
                  className="flex items-center gap-2"
                >
                  <Wand2 className="h-4 w-4" />
                  Optimize for Job
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
            </div>
          </div>
          
          <ResumeTemplate data={resumeData} />

          {jobData && (
            <OptimizationWizard
              isOpen={showOptimizationWizard}
              onClose={() => setShowOptimizationWizard(false)}
              originalResume={resumeData}
              jobTitle={jobData.title}
              jobId={jobData.id}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Preview;