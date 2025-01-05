import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SectionProps } from "@/types/workdayForm";

export const SourceSection = ({ onChange, value }: SectionProps) => {
  const handleSourceChange = (val: string) => {
    onChange({ source: { ...value, prompt: val } });
  };

  const handleCountryChange = (val: string) => {
    onChange({ source: { ...value, country: val } });
  };

  return (
    <div data-automation-id="sourceSection" className="space-y-4">
      <div data-automation-id="formField-sourcePrompt">
        <Label className="flex items-center gap-2">
          How Did You Hear About Us? <span className="text-red-500">*</span>
        </Label>
        <Select 
          name="sourcePrompt" 
          defaultValue="recruiter"
          onValueChange={handleSourceChange}
          value={value?.prompt}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recruiter">Recruiter Contacted Me</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="website">Company Website</SelectItem>
            <SelectItem value="referral">Employee Referral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div data-automation-id="formField-countryDropdown">
        <Label className="flex items-center gap-2">
          Country <span className="text-red-500">*</span>
        </Label>
        <Select 
          name="country" 
          defaultValue="usa"
          onValueChange={handleCountryChange}
          value={value?.country}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usa">United States of America</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};