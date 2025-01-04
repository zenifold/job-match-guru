import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";

interface EducationFormProps {
  data: any[];
  onSave: (data: any[]) => void;
}

export const EducationForm = ({ data, onSave }: EducationFormProps) => {
  const [education, setEducation] = useState(
    data.length > 0
      ? data
      : [
          {
            school: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
          },
        ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(education);
  };

  const addEducation = () => {
    setEducation([
      ...education,
      {
        school: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Education</h2>
      {education.map((edu, index) => (
        <Card key={index} className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Education {index + 1}</h3>
            {education.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeEducation(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Label>School</Label>
              <Input
                value={edu.school}
                onChange={(e) => {
                  const newEducation = [...education];
                  newEducation[index].school = e.target.value;
                  setEducation(newEducation);
                }}
                required
              />
            </div>
            <div>
              <Label>Degree</Label>
              <Input
                value={edu.degree}
                onChange={(e) => {
                  const newEducation = [...education];
                  newEducation[index].degree = e.target.value;
                  setEducation(newEducation);
                }}
                required
              />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input
                value={edu.field}
                onChange={(e) => {
                  const newEducation = [...education];
                  newEducation[index].field = e.target.value;
                  setEducation(newEducation);
                }}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={edu.startDate}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].startDate = e.target.value;
                    setEducation(newEducation);
                  }}
                  required
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={edu.endDate}
                  onChange={(e) => {
                    const newEducation = [...education];
                    newEducation[index].endDate = e.target.value;
                    setEducation(newEducation);
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      ))}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={addEducation}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  );
};