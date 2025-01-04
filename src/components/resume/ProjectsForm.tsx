import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";

interface ProjectsFormProps {
  data: any[];
  onSave: (data: any[]) => void;
}

export const ProjectsForm = ({ data, onSave }: ProjectsFormProps) => {
  const [projects, setProjects] = useState(
    data.length > 0
      ? data
      : [
          {
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            url: "",
            technologies: [""],
          },
        ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(projects);
  };

  const addProject = () => {
    setProjects([
      ...projects,
      {
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        url: "",
        technologies: [""],
      },
    ]);
  };

  const removeProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addTechnology = (projectIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].technologies.push("");
    setProjects(newProjects);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Projects</h2>
      {projects.map((project, index) => (
        <Card key={index} className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Project {index + 1}</h3>
            {projects.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeProject(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Project Name</Label>
              <Input
                value={project.name}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index].name = e.target.value;
                  setProjects(newProjects);
                }}
                required
              />
            </div>
            <div>
              <Label>Project URL</Label>
              <Input
                type="url"
                value={project.url}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index].url = e.target.value;
                  setProjects(newProjects);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={project.startDate}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index].startDate = e.target.value;
                  setProjects(newProjects);
                }}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={project.endDate}
                onChange={(e) => {
                  const newProjects = [...projects];
                  newProjects[index].endDate = e.target.value;
                  setProjects(newProjects);
                }}
              />
            </div>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={project.description}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index].description = e.target.value;
                setProjects(newProjects);
              }}
              required
            />
          </div>
          <div>
            <Label>Technologies Used</Label>
            {project.technologies.map((tech: string, techIndex: number) => (
              <div key={techIndex} className="mt-2">
                <Input
                  value={tech}
                  onChange={(e) => {
                    const newProjects = [...projects];
                    newProjects[index].technologies[techIndex] = e.target.value;
                    setProjects(newProjects);
                  }}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => addTechnology(index)}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Technology
            </Button>
          </div>
        </Card>
      ))}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={addProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  );
};