import { MainLayout } from "@/components/layout/MainLayout";
import { WorkdayProfileForm } from "@/components/workday/WorkdayProfileForm";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const WorkdayProfile = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Workday Application Profile</h1>
        <WorkdayProfileForm />
      </div>
    </MainLayout>
  );
};

export default WorkdayProfile;