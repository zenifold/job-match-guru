import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

export const LanguagesSection = () => {
  return (
    <div data-automation-id="languageSection" className="space-y-6">
      <h3 className="text-lg font-semibold text-[#0071CE]">Languages</h3>
      
      <div data-automation-id="language-1" className="space-y-4 border rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h4 className="font-medium">Languages 1</h4>
          <Button variant="ghost" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label>
              Language <span className="text-red-500">*</span>
            </Label>
            <Select>
              <SelectTrigger data-automation-id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="nativeLanguage" data-automation-id="nativeLanguage" />
            <Label htmlFor="nativeLanguage">I am fluent in this language.</Label>
          </div>

          {['Reading', 'Speaking', 'Translation', 'Writing'].map((type, index) => (
            <div key={type}>
              <Label>
                {type} Proficiency <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger data-automation-id={`languageProficiency-${index}`}>
                  <SelectValue placeholder="Select proficiency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="native">Native</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={() => {}}>
        <Plus className="h-4 w-4 mr-2" />
        Add Another Language
      </Button>
    </div>
  );
};