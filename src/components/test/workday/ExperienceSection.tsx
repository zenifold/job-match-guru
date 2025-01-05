import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { useResume } from "@/contexts/ResumeContext";
import { useEffect, useState } from "react";
import { SectionProps } from "@/types/workdayForm";

interface WorkExperience {
  jobTitle: string;
  company: string;
  location: string;
  currentlyWorkHere: boolean;
  startDate: string;
  endDate: string;
  description: string;
}

interface ExperienceSectionProps extends SectionProps {
  value?: WorkExperience[];
}

export const ExperienceSection = ({ onChange, value = [] }: ExperienceSectionProps) => {
  const { resumeData } = useResume();
  const [experiences, setExperiences] = useState<WorkExperience[]>(value);

  useEffect(() => {
    if (resumeData?.experience) {
      const formattedExperiences = resumeData.experience.map(exp => ({
        jobTitle: exp.position,
        company: exp.company,
        location: exp.location || "",
        currentlyWorkHere: !exp.endDate,
        startDate: exp.startDate,
        endDate: exp.endDate || "",
        description: exp.description
      }));
      setExperiences(formattedExperiences);
    }
  }, [resumeData]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        jobTitle: "",
        company: "",
        location: "",
        currentlyWorkHere: false,
        startDate: "",
        endDate: "",
        description: ""
      }
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | boolean) => {
    const newExperiences = [...experiences];
    newExperiences[index] = {
      ...newExperiences[index],
      [field]: value
    };
    setExperiences(newExperiences);
    onChange?.({ experience: newExperiences });
  };

  return (
    <div data-automation-id="workExperienceSection" className="space-y-6">
      <h3 className="text-lg font-semibold text-[#0071CE]">Work Experience</h3>
      
      {experiences.map((exp, index) => (
        <div key={index} data-automation-id={`workExperience-${index + 1}`} className="space-y-4 border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Work Experience {index + 1}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeExperience(index)}
              data-automation-id="panel-set-delete-button"
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>
                Job Title <span className="text-red-500">*</span>
              </Label>
              <Input 
                data-automation-id="jobTitle"
                value={exp.jobTitle}
                onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                required 
              />
            </div>

            <div>
              <Label>
                Company <span className="text-red-500">*</span>
              </Label>
              <Input 
                data-automation-id="company"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                required 
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input 
                data-automation-id="location"
                value={exp.location}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`currentlyWorkHere-${index}`}
                data-automation-id="currentlyWorkHere"
                checked={exp.currentlyWorkHere}
                onCheckedChange={(checked) => updateExperience(index, 'currentlyWorkHere', Boolean(checked))}
              />
              <Label htmlFor={`currentlyWorkHere-${index}`}>I currently work here</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>
                  From <span className="text-red-500">*</span>
                </Label>
                <Input 
                  type="month"
                  data-automation-id="startDate"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                  required 
                />
              </div>
              {!exp.currentlyWorkHere && (
                <div>
                  <Label>
                    To <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    type="month"
                    data-automation-id="endDate"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                    required 
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Role Description</Label>
              <Textarea 
                data-automation-id="description"
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      ))}

      <Button 
        type="button" 
        variant="outline" 
        className="w-full"
        onClick={addExperience}
        data-automation-id="Add Another"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Work Experience
      </Button>
    </div>
  );
};
