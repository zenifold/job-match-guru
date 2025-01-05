import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface MockJobPageProps {
  platform: "linkedin" | "indeed";
  resumeData: any;
}

export function MockJobPage({ platform, resumeData }: MockJobPageProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const jobDetails = {
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    description: `We are seeking a Senior Frontend Developer to join our team.

Requirements:
- 5+ years of experience with React
- Strong TypeScript skills
- Experience with state management (Redux, MobX, etc.)
- Experience with testing frameworks
- Experience with CI/CD pipelines

Responsibilities:
- Develop new features for our web applications
- Mentor junior developers
- Participate in code reviews
- Write technical documentation`,
  };

  return (
    <div className="max-w-4xl mx-auto">
      {!showApplicationForm ? (
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{jobDetails.title}</h1>
            <p className="text-muted-foreground">{jobDetails.company} • {jobDetails.location}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">About the role</h2>
            <p className="whitespace-pre-wrap">{jobDetails.description}</p>
          </div>

          <Button onClick={() => setShowApplicationForm(true)} className="w-full">
            Apply Now
          </Button>
        </Card>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Application Form</h2>
              <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
                Back to Job Details
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" placeholder="John" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input id="linkedin" name="linkedin" type="url" placeholder="https://linkedin.com/in/johndoe" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Professional Information</h3>
                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea 
                    id="experience" 
                    name="experience"
                    placeholder="Enter your professional experience" 
                    className="h-32" 
                  />
                </div>
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Textarea 
                    id="education" 
                    name="education"
                    placeholder="Enter your education history" 
                    className="h-32" 
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea 
                    id="skills" 
                    name="skills"
                    placeholder="Enter your skills" 
                    className="h-32" 
                  />
                </div>
              </div>

              <Button className="w-full">Submit Application</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}