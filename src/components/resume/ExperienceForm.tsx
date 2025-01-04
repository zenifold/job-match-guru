import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ExperienceCard } from "./experience/ExperienceCard";

interface ExperienceFormProps {
  data: any[];
  onSave: (data: any[]) => void;
}

export const ExperienceForm = ({ data, onSave }: ExperienceFormProps) => {
  const [experiences, setExperiences] = useState(
    data.length > 0
      ? data.map(exp => ({
          ...exp,
          isPresent: !exp.endDate
        }))
      : [
          {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
            location: "",
            industry: "",
            keyResponsibilities: [""],
            skillsAcquired: [""],
            isPresent: false,
          },
        ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(experiences.map(exp => ({
      ...exp,
      endDate: exp.isPresent ? "" : exp.endDate
    })));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        location: "",
        industry: "",
        keyResponsibilities: [""],
        skillsAcquired: [""],
        isPresent: false,
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addResponsibility = (expIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].keyResponsibilities.push("");
    setExperiences(newExperiences);
  };

  const addSkill = (expIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].skillsAcquired.push("");
    setExperiences(newExperiences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Work Experience</h2>
      {experiences.map((exp, index) => (
        <ExperienceCard
          key={index}
          exp={exp}
          index={index}
          experiences={experiences}
          setExperiences={setExperiences}
          removeExperience={removeExperience}
          addResponsibility={addResponsibility}
          addSkill={addSkill}
        />
      ))}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={addExperience}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  );
};