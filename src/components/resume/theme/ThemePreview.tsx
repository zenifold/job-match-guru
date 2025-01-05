import { ResumeTemplate } from "../ResumeTemplate";

interface ThemePreviewProps {
  settings: any;
}

export function ThemePreview({ settings }: ThemePreviewProps) {
  // Sample resume data for preview
  const previewData = {
    personalInfo: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "(555) 123-4567",
      location: "New York, NY",
    },
    experience: [
      {
        company: "Example Corp",
        position: "Senior Developer",
        startDate: "2020",
        endDate: "Present",
        description: "Led development of key features",
      },
    ],
    education: [
      {
        school: "University of Example",
        degree: "Bachelor's",
        field: "Computer Science",
        startDate: "2016",
        endDate: "2020",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="bg-white shadow rounded-lg">
        <ResumeTemplate data={previewData} themeSettings={settings} />
      </div>
    </div>
  );
}