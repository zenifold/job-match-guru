import { MainLayout } from "@/components/layout/MainLayout"
import { CreateJobForm } from "@/components/job/CreateJobForm"

const CreateJob = () => {
  return (
    <MainLayout>
      <div className="container max-w-2xl py-6">
        <h1 className="text-3xl font-bold mb-6">Create New Job</h1>
        <CreateJobForm />
      </div>
    </MainLayout>
  )
}

export default CreateJob