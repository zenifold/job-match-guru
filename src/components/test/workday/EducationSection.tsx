import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

export const EducationSection = () => {
  return (
    <div data-automation-id="educationSection" className="space-y-6">
      <h3 className="text-lg font-semibold text-[#0071CE]">Education</h3>
      
      <div data-automation-id="education-1" className="space-y-4 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Education 1</h4>
          <Button variant="ghost" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>
              School or University <span className="text-red-500">*</span>
            </Label>
            <Input data-automation-id="school" required />
          </div>

          <div>
            <Label>
              Degree <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger data-automation-id="degree">
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                <SelectItem value="masters">Master's Degree</SelectItem>
                <SelectItem value="phd">Ph.D.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Field of Study</Label>
            <Input data-automation-id="field-of-study" />
          </div>

          <div>
            <Label>Overall Result (GPA)</Label>
            <Input data-automation-id="gpa" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>From</Label>
              <Input type="number" data-automation-id="startDate" placeholder="YYYY" min="1900" max="2099" />
            </div>
            <div>
              <Label>To (Actual or Expected)</Label>
              <Input type="number" data-automation-id="endDate" placeholder="YYYY" min="1900" max="2099" />
            </div>
          </div>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={() => {}}>
        <Plus className="h-4 w-4 mr-2" />
        Add Another Education
      </Button>
    </div>
  );
};