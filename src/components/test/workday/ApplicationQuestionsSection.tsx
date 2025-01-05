import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionProps } from "@/types/workdayForm";

interface ApplicationQuestionsSectionProps extends SectionProps {
  employer?: string;
  value?: { [key: string]: string };
}

export const ApplicationQuestionsSection = ({ 
  employer = "Walmart",
  onChange,
  value = {}
}: ApplicationQuestionsSectionProps) => {
  // Default questions that are common across employers
  const commonQuestions = [
    {
      id: "qualifications",
      question: "Do you certify you meet all minimum qualifications for this job as outlined in the job posting?",
      required: true,
      options: ["Yes", "No"],
      automationId: "6053fc57425a101d610d2b3da5e40001"
    },
    {
      id: "legalWork",
      question: "Are you legally able to work in the country where this job is located?",
      required: true,
      options: ["Yes", "No"],
      automationId: "6053fc57425a101d610d2bd793200001"
    },
    {
      id: "ageCategory",
      question: "Please select your age category:",
      required: true,
      options: ["18 years of age and Over", "Under 18 years of age"],
      automationId: "6053fc57425a101d610d2bd793200004"
    }
  ];

  // Walmart-specific questions
  const walmartQuestions = [
    {
      id: "textUpdates",
      question: "Would you like to receive mobile text message updates from Walmart regarding the recruiting process?",
      required: true,
      options: ["Opt-In to receive text messages", "Opt-Out from receiving text messages"],
      automationId: "6053fc57425a101d610d2b3da5e40004"
    },
    {
      id: "associateStatus",
      question: "Please select your Walmart Associate Status/Affiliation:",
      required: true,
      options: [
        "Have never been an employee of Walmart Inc or any of its subsidiaries",
        "Current Walmart Associate",
        "Former Walmart Associate"
      ],
      automationId: "6053fc57425a101d610d2bd793200008"
    },
    {
      id: "workAuth",
      question: "Are you able to provide work authorization within 3 days of your hire?",
      required: false,
      options: ["Yes", "No"],
      automationId: "6053fc57425a101d610d2c71804f0006"
    },
    {
      id: "sponsorship",
      question: 'Will you now or in the future require "sponsorship for an immigration-related employment benefit"?',
      required: true,
      options: ["Yes", "No"],
      automationId: "6053fc57425a101d610d2c71804f0009"
    },
    {
      id: "militaryService",
      question: "Do you have Active Duty or Guard/Reserve experience in the Uniformed Services of the United States?",
      required: true,
      options: ["Yes", "No", "Prefer not to answer"],
      automationId: "6053fc57425a101d610d2da55acd0003"
    },
    {
      id: "militarySpouse",
      question: "Are you the Spouse/Partner of someone in the Uniformed Services of the United States?",
      required: false,
      options: ["Yes", "No", "Prefer not to answer"],
      automationId: "6053fc57425a101d610d2ed909ba0003"
    },
    {
      id: "familyMember",
      question: "Do you have a direct family member who currently works for Walmart or Sam's Club?",
      required: true,
      options: ["Yes", "No"],
      automationId: "6053fc57425a101d610d2ed909ba0009"
    }
  ];

  const questions = employer === "Walmart" ? [...commonQuestions, ...walmartQuestions] : commonQuestions;

  return (
    <div data-automation-id="primaryQuestionnairePage">
      <h2 tabIndex={-1} className="text-xl font-semibold mb-4">Application Questions</h2>
      <div className="text-sm mb-4">
        <span className="text-red-500">*</span> Indicates a required field
      </div>
      
      <Card className="p-6 space-y-6">
        {questions.map((q) => (
          <div
            key={q.id}
            data-automation-id={`formField-${q.automationId}`}
            className="space-y-2"
          >
            <Label htmlFor={q.id} className="font-medium block">
              {q.question}
              {q.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select defaultValue={value[q.id] || q.options[0]} onValueChange={(val) => onChange?.({ [q.id]: val })}>
              <SelectTrigger
                id={q.id}
                data-automation-id={q.automationId}
                className="w-full max-w-[344px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {q.options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </Card>
    </div>
  );
};
