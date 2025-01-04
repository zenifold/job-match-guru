import { MainLayout } from "@/components/layout/MainLayout";
import { ResumeTemplate } from "@/components/resume/ResumeTemplate";
import { useLocation } from "react-router-dom";

const Preview = () => {
  const location = useLocation();
  const resumeData = location.state?.resumeData || {};

  return (
    <div className="min-h-screen bg-white">
      <ResumeTemplate data={resumeData} />
    </div>
  );
};

export default Preview;