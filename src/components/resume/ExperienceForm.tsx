import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";

interface ExperienceFormProps {
  data: any[];
  onSave: (data: any[]) => void;
}

export const ExperienceForm = ({ data, onSave }: ExperienceFormProps) => {
  const [experiences, setExperiences] = useState(
    data.length > 0
      ? data
      : [
          {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(experiences);
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
      },
    ]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Work Experience</h2>
      {experiences.map((exp, index) => (
        <Card key={index} className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
            {experiences.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeExperience(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Label>Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].company = e.target.value;
                  setExperiences(newExperiences);
                }}
                required
              />
            </div>
            <div>
              <Label>Position</Label>
              <Input
                value={exp.position}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].position = e.target.value;
                  setExperiences(newExperiences);
                }}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => {
                    const newExperiences = [...experiences];
                    newExperiences[index].startDate = e.target.value;
                    setExperiences(newExperiences);
                  }}
                  required
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExperiences = [...experiences];
                    newExperiences[index].endDate = e.target.value;
                    setExperiences(newExperiences);
                  }}
                />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={exp.description}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].description = e.target.value;
                  setExperiences(newExperiences);
                }}
                required
              />
            </div>
          </div>
        </Card>
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