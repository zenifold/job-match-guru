import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ExperienceCardProps {
  exp: any;
  index: number;
  experiences: any[];
  setExperiences: (experiences: any[]) => void;
  removeExperience: (index: number) => void;
  addResponsibility: (index: number) => void;
  addSkill: (index: number) => void;
}

export const ExperienceCard = ({
  exp,
  index,
  experiences,
  setExperiences,
  removeExperience,
  addResponsibility,
  addSkill,
}: ExperienceCardProps) => {
  const handlePresentToggle = (checked: boolean) => {
    const newExperiences = [...experiences];
    if (checked) {
      newExperiences[index].endDate = "";
      newExperiences[index].isPresent = true;
    } else {
      newExperiences[index].isPresent = false;
    }
    setExperiences(newExperiences);
  };

  return (
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <Label>Location</Label>
            <Input
              value={exp.location}
              onChange={(e) => {
                const newExperiences = [...experiences];
                newExperiences[index].location = e.target.value;
                setExperiences(newExperiences);
              }}
            />
          </div>
          <div>
            <Label>Industry</Label>
            <Input
              value={exp.industry}
              onChange={(e) => {
                const newExperiences = [...experiences];
                newExperiences[index].industry = e.target.value;
                setExperiences(newExperiences);
              }}
            />
          </div>
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
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`present-${index}`}
                  checked={exp.isPresent}
                  onCheckedChange={handlePresentToggle}
                />
                <label
                  htmlFor={`present-${index}`}
                  className="text-sm text-muted-foreground"
                >
                  Present
                </label>
              </div>
              {!exp.isPresent && (
                <Input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => {
                    const newExperiences = [...experiences];
                    newExperiences[index].endDate = e.target.value;
                    setExperiences(newExperiences);
                  }}
                />
              )}
            </div>
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
        <div>
          <Label>Key Responsibilities</Label>
          {exp.keyResponsibilities.map((resp: string, respIndex: number) => (
            <div key={respIndex} className="mt-2">
              <Input
                value={resp}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].keyResponsibilities[respIndex] =
                    e.target.value;
                  setExperiences(newExperiences);
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addResponsibility(index)}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Responsibility
          </Button>
        </div>
        <div>
          <Label>Skills Acquired</Label>
          {exp.skillsAcquired.map((skill: string, skillIndex: number) => (
            <div key={skillIndex} className="mt-2">
              <Input
                value={skill}
                onChange={(e) => {
                  const newExperiences = [...experiences];
                  newExperiences[index].skillsAcquired[skillIndex] =
                    e.target.value;
                  setExperiences(newExperiences);
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSkill(index)}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>
    </Card>
  );
};