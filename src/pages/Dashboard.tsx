import { MainLayout } from "@/components/layout/MainLayout"
import { Button } from "@/components/ui/button"
import { FileText, Briefcase } from "lucide-react"
import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to ResumeAI</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Create Resume
              </CardTitle>
              <CardDescription>
                Build a professional resume tailored to your target jobs
              </CardDescription>
              <Button className="mt-4" asChild>
                <Link to="/builder">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Resume
                </Link>
              </Button>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Add Job
              </CardTitle>
              <CardDescription>
                Add a job posting to analyze and tailor your resume
              </CardDescription>
              <Button className="mt-4" asChild>
                <Link to="/jobs/new">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Add Job
                </Link>
              </Button>
            </CardHeader>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard