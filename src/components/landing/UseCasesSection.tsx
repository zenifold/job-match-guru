import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const UseCasesSection = () => {
  return (
    <div className="py-24 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Perfect For Every Job Seeker</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Career Changers</CardTitle>
            </CardHeader>
            <CardContent>
              Highlight transferable skills and relevant experience for your new industry. Our AI helps you speak the language of your target role.
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Recent Graduates</CardTitle>
            </CardHeader>
            <CardContent>
              Transform academic projects and internships into compelling professional experience that employers are looking for.
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Senior Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              Customize your extensive experience for each role, emphasizing leadership and achievements that matter most.
            </CardContent>
          </Card>
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Tech Industry</CardTitle>
            </CardHeader>
            <CardContent>
              Keep up with rapidly changing technical requirements and ensure your skills match the latest job descriptions.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};