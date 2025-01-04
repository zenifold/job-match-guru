import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PainPointsSection = () => {
  return (
    <div className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Job Seekers Love ResumeAI</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>ATS-Optimized</CardTitle>
              <CardDescription>Never get filtered out by ATS systems again</CardDescription>
            </CardHeader>
            <CardContent>
              Our AI ensures your resume contains the right keywords and formatting to pass through Applicant Tracking Systems every time.
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Save Hours</CardTitle>
              <CardDescription>Customize resumes in seconds, not hours</CardDescription>
            </CardHeader>
            <CardContent>
              Stop manually editing your resume for each application. Our AI tailors your experience to match job requirements instantly.
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Higher Response Rate</CardTitle>
              <CardDescription>Stand out in every application</CardDescription>
            </CardHeader>
            <CardContent>
              Get more interviews by submitting perfectly matched resumes that highlight your most relevant skills and experiences.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};