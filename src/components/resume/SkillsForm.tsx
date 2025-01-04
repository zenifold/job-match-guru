import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { X } from "lucide-react";

interface SkillsFormProps {
  data: string[];
  onSave: (data: string[]) => void;
}

export const SkillsForm = ({ data, onSave }: SkillsFormProps) => {
  const [skills, setSkills] = useState<string[]>(data || []);
  const [newSkill, setNewSkill] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim()) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setNewSkill("");
      onSave(updatedSkills);
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    onSave(updatedSkills);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Skills</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="skill">Add Skill</Label>
          <div className="flex space-x-2">
            <Input
              id="skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Enter a skill"
            />
            <Button type="submit">Add</Button>
          </div>
        </div>
      </form>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="text-sm">
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};