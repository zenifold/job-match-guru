import { MainLayout } from "@/components/layout/MainLayout";
import { WorkdayProfileForm } from "@/components/workday/WorkdayProfileForm";

const WorkdayProfile = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-6">
        <h1 className="text-3xl font-bold mb-6">Workday Profile</h1>
        <WorkdayProfileForm />
      </div>
    </MainLayout>
  );
};

export default WorkdayProfile;