import { MainLayout } from "@/components/layout/MainLayout";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { useLocation } from "react-router-dom";

const Preview = () => {
  const location = useLocation();
  const resumeData = location.state?.resumeData || {};

  return (
    <MainLayout>
      <div className="min-h-screen bg-white">
        <div className="container py-4">
          <ResumeTemplate data={resumeData} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Preview;