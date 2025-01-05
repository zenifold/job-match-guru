import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

export const ExperienceSection = () => {
  return (
    <div data-automation-id="workExperienceSection" className="space-y-6">
      <h3 className="text-lg font-semibold text-[#0071CE]">Work Experience</h3>
      
      <div data-automation-id="workExperience-1" className="space-y-4 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Work Experience 1</h4>
          <Button variant="ghost" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>
              Job Title <span className="text-red-500">*</span>
            </Label>
            <Input data-automation-id="jobTitle" required />
          </div>

          <div>
            <Label>
              Company <span className="text-red-500">*</span>
            </Label>
            <Input data-automation-id="company" required />
          </div>

          <div>
            <Label>Location</Label>
            <Input data-automation-id="location" />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="currentlyWorkHere" data-automation-id="currentlyWorkHere" />
            <Label htmlFor="currentlyWorkHere">I currently work here</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>
                From <span className="text-red-500">*</span>
              </Label>
              <Input type="month" data-automation-id="startDate" required />
            </div>
            <div>
              <Label>
                To <span className="text-red-500">*</span>
              </Label>
              <Input type="month" data-automation-id="endDate" required />
            </div>
          </div>

          <div>
            <Label>Role Description</Label>
            <Textarea data-automation-id="description" className="min-h-[100px]" />
          </div>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={() => {}}>
        <Plus className="h-4 w-4 mr-2" />
        Add Another Work Experience
      </Button>
    </div>
  );
};