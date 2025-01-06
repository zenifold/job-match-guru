import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, FormInput } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExtensionPopupProps {
  resumeData: any;
}

// Separate component for the analysis result display
const AnalysisResult = ({ result }: { result: any }) => {
  if (!result) return null;
  
  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-3">
      <div>
        <div className="text-sm text-slate-600">Match Score</div>
        <div className="text-2xl font-bold text-blue-600">
          {result.matchScore}%
        </div>
      </div>

      {result.matches.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-1">Matching Skills:</div>
          <ul className="text-sm space-y-1">
            {result.matches.map((match: string, idx: number) => (
              <li key={idx} className="flex items-center text-green-600">
                <span className="mr-1">✓</span> {match}
              </li>
            ))}
          </ul>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div>
          <div className="text-sm font-medium mb-1">Suggestions:</div>
          <ul className="text-sm space-y-1">
            {result.suggestions.map((suggestion: string, idx: number) => (
              <li key={idx} className="text-slate-600">• {suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Separate component for the autofill status display
const AutofillStatus = ({ isAutofilling }: { isAutofilling: boolean }) => {
  if (!isAutofilling) {
    return (
      <div className="text-sm">
        <div className="font-medium mb-2">Data ready to auto-fill:</div>
        <ul className="space-y-1 text-slate-600">
          <li>• Personal Information</li>
          <li>• Professional Experience</li>
          <li>• Education History</li>
          <li>• Skills & Qualifications</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <p className="text-sm text-blue-600">Filling form fields...</p>
      </div>
    </div>
  );
};

export function ExtensionPopup({ resumeData }: ExtensionPopupProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setAnalysisResult({
        matchScore: 85,
        matches: [
          "React experience",
          "TypeScript skills",
          "Testing experience"
        ],
        suggestions: [
          "Add more details about state management experience",
          "Highlight any remote work experience"
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutofill = async () => {
    setIsAutofilling(true);
    try {
      // Get all form inputs
      const inputs = document.querySelectorAll('input, textarea');
      
      // Map resume data to form fields
      inputs.forEach((input: HTMLInputElement | HTMLTextAreaElement) => {
        const name = input.name?.toLowerCase();
        if (!name) return;

        let value = '';
        
        if (name.includes('firstname')) {
          value = resumeData.personalInfo?.fullName?.split(' ')[0] || '';
        } else if (name.includes('lastname')) {
          value = resumeData.personalInfo?.fullName?.split(' ').slice(1).join(' ') || '';
        } else if (name === 'email') {
          value = resumeData.personalInfo?.email || '';
        } else if (name === 'phone') {
          value = resumeData.personalInfo?.phone || '';
        } else if (name === 'linkedin') {
          value = resumeData.personalInfo?.linkedin || '';
        } else if (name === 'experience') {
          value = resumeData.experience?.map((exp: any) => 
            `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})\n${exp.description}`
          ).join('\n\n') || '';
        } else if (name === 'education') {
          value = resumeData.education?.map((edu: any) =>
            `${edu.degree} in ${edu.field} from ${edu.school} (${edu.startDate} - ${edu.endDate || 'Present'})`
          ).join('\n\n') || '';
        } else if (name === 'skills') {
          value = resumeData.skills?.join(', ') || '';
        }

        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <Card className="w-[320px] p-4 bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Resume Optimizer</h2>
        
        <Tabs defaultValue="analyze" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="analyze" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="autofill" className="flex items-center gap-2">
              <FormInput className="w-4 h-4" />
              Autofill
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-4">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Job & Optimize Resume"
              )}
            </Button>
            <AnalysisResult result={analysisResult} />
          </TabsContent>

          <TabsContent value="autofill" className="space-y-4">
            <Button
              onClick={handleAutofill}
              disabled={isAutofilling}
              className="w-full"
            >
              {isAutofilling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Auto-filling...
                </>
              ) : (
                "Auto-fill Application"
              )}
            </Button>

            <div className="mt-4 p-4 bg-slate-50 rounded-lg">
              <AutofillStatus isAutofilling={isAutofilling} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}