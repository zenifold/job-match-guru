import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Index = () => {
  return (
    <MainLayout hideNav>
      <div className="min-h-screen flex flex-col relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-60 right-0 w-[400px] h-[400px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 relative z-10 pt-20">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              ResumeAI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Stop spending hours tailoring resumes. Let AI match your experience to job requirements instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="min-w-[200px]" asChild>
                <Link to="/login">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Pain Points Section */}
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

        {/* Pricing Section */}
        <div className="py-24">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Simple, Transparent Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>Perfect for getting started</CardDescription>
                  <div className="text-3xl font-bold">$5/month</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {["5 AI-optimized resumes/month", "Basic ATS optimization", "PDF exports"].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to="/login">Get Started</Link>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-primary relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                  <CardDescription>For serious job seekers</CardDescription>
                  <div className="text-3xl font-bold">$10/month</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Unlimited AI-optimized resumes",
                      "Advanced ATS optimization",
                      "Multiple resume formats",
                      "Job application tracking",
                      "Priority support"
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to="/login">Try Pro</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>For teams and organizations</CardDescription>
                  <div className="text-3xl font-bold">$15/month</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {[
                      "Everything in Pro",
                      "Team collaboration",
                      "Custom branding",
                      "API access",
                      "Dedicated support",
                      "Analytics dashboard"
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to="/login">Contact Sales</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        {/* Use Cases Section */}
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

        {/* Final CTA */}
        <div className="py-24">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to Land Your Dream Job?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of job seekers who are getting more interviews with ResumeAI.
            </p>
            <Button size="lg" className="min-w-[200px]" asChild>
              <Link to="/login">Get Started Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;