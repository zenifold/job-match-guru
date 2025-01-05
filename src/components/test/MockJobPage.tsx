import { Card } from "@/components/ui/card";

interface MockJobPageProps {
  platform: 'linkedin' | 'indeed';
}

export function MockJobPage({ platform }: MockJobPageProps) {
  const mockData = {
    linkedin: {
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA (Remote)",
      description: `We're looking for a Senior Frontend Developer to join our growing team.

Requirements:
• 5+ years of experience with React
• Strong TypeScript skills
• Experience with modern frontend tooling
• Experience with state management (Redux, MobX, etc.)
• Experience with testing frameworks
• Strong communication skills

What we offer:
• Competitive salary
• Remote-first culture
• Health, dental, and vision insurance
• 401(k) matching
• Unlimited PTO`,
    },
    indeed: {
      title: "Full Stack Developer",
      company: "Digital Solutions Co.",
      location: "New York, NY (Hybrid)",
      description: `About the role:
We are seeking a Full Stack Developer to help build and maintain our core products.

Key Requirements:
• 3+ years of full stack development experience
• Proficiency in React and Node.js
• Experience with SQL and NoSQL databases
• Understanding of cloud services (AWS/GCP)
• Strong problem-solving skills

Benefits:
• Competitive compensation package
• Flexible work arrangements
• Professional development opportunities
• Health and wellness benefits
• Stock options`,
    },
  };

  const data = mockData[platform];

  return (
    <Card className="p-8 max-w-4xl mx-auto">
      <div className={platform === 'linkedin' ? 'space-y-6' : 'space-y-4'}>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold" data-testid="job-title">
            {data.title}
          </h1>
          <div className="text-lg text-slate-600" data-testid="company-name">
            {data.company}
          </div>
          <div className="text-slate-500">{data.location}</div>
        </div>

        <div className="space-y-4" data-testid="job-description">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: data.description.replace(/\n/g, '<br/>') }}
          />
        </div>

        <div className="pt-4 border-t">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
            Apply now
          </button>
        </div>
      </div>
    </Card>
  );
}