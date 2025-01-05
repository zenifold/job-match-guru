import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
        ]
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
    } finally {
      setIsAutofilling(false);
    }
  };

  return (
    <Card className="w-[320px] p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Resume Optimizer</h2>
        
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

        <Button
          onClick={handleAutofill}
          disabled={isAutofilling || !analysisResult}
          variant="outline"
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
    </Card>
  );
}