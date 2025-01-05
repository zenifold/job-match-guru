import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, FormInput } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ExtensionPopup() {
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
        ],
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          phone: "+1 (555) 000-0000"
        },
        professionalInfo: {
          yearsOfExperience: "5-10",
          visaStatus: "citizen",
          willingToRelocate: true
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutofill = async () => {
    setIsAutofilling(true);
    try {
      // Simulate autofill delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In a real extension, this would interact with the page
      console.log("Autofilling form with data:", analysisResult);
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <Card className="w-[320px] p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Resume Optimizer</h2>
        
        <Tabs defaultValue="analyze">
          <TabsList className="w-full">
            <TabsTrigger value="analyze" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Analyze
            </TabsTrigger>
            <TabsTrigger value="autofill" className="flex-1">
              <FormInput className="w-4 h-4 mr-2" />
              Autofill
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze">
            <div className="space-y-4">
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

              {analysisResult && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-3">
                  <div>
                    <div className="text-sm text-slate-600">Match Score</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysisResult.matchScore}%
                    </div>
                  </div>

                  {analysisResult.matches.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Matching Skills:</div>
                      <ul className="text-sm space-y-1">
                        {analysisResult.matches.map((match: string, idx: number) => (
                          <li key={idx} className="flex items-center text-green-600">
                            <span className="mr-1">✓</span> {match}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.suggestions.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-1">Suggestions:</div>
                      <ul className="text-sm space-y-1">
                        {analysisResult.suggestions.map((suggestion: string, idx: number) => (
                          <li key={idx} className="text-slate-600">• {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="autofill">
            <div className="space-y-4">
              <Button
                onClick={handleAutofill}
                disabled={isAutofilling || !analysisResult}
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

              {!analysisResult && (
                <p className="text-sm text-muted-foreground text-center">
                  Please analyze the job first to enable auto-fill
                </p>
              )}

              {analysisResult && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="text-sm">
                    <div className="font-medium mb-2">Data ready to auto-fill:</div>
                    <ul className="space-y-1 text-slate-600">
                      <li>• Personal Information</li>
                      <li>• Professional Experience</li>
                      <li>• Education History</li>
                      <li>• Skills & Qualifications</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}