import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionProps } from "@/types/workdayForm";

export const LegalNameSection = ({ onChange, value }: SectionProps) => {
  const handleChange = (field: string, newValue: string | boolean) => {
    onChange({
      personalInfo: {
        ...value,
        [field]: newValue
      }
    });
  };

  return (
    <div data-automation-id="legalNameSection" className="space-y-4">
      <h3 className="text-lg font-semibold">Legal Name</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div data-automation-id="formField-legalNameSection_title">
          <Label>Prefix</Label>
          <Select 
            name="prefix" 
            value={value?.prefix || ''}
            onValueChange={(val) => handleChange('prefix', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select prefix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mr">Mr.</SelectItem>
              <SelectItem value="ms">Ms.</SelectItem>
              <SelectItem value="mrs">Mrs.</SelectItem>
              <SelectItem value="dr">Dr.</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div data-automation-id="formField-legalNameSection_firstName">
          <Label className="flex items-center gap-2">
            First Name <span className="text-red-500">*</span>
          </Label>
          <Input
            data-automation-id="legalNameSection_firstName"
            name="firstName"
            value={value?.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
          />
        </div>

        <div data-automation-id="formField-legalNameSection_middleName">
          <Label>Middle Name</Label>
          <Input
            data-automation-id="legalNameSection_middleName"
            name="middleName"
            value={value?.middleName || ''}
            onChange={(e) => handleChange('middleName', e.target.value)}
          />
        </div>

        <div data-automation-id="formField-legalNameSection_lastName">
          <Label className="flex items-center gap-2">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            data-automation-id="legalNameSection_lastName"
            name="lastName"
            value={value?.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
          />
        </div>

        <div data-automation-id="formField-legalNameSection_suffix">
          <Label>Suffix</Label>
          <Select 
            name="suffix"
            value={value?.suffix || ''}
            onValueChange={(val) => handleChange('suffix', val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select suffix" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jr">Jr.</SelectItem>
              <SelectItem value="sr">Sr.</SelectItem>
              <SelectItem value="ii">II</SelectItem>
              <SelectItem value="iii">III</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="preferredName" 
          checked={value?.hasPreferredName || false}
          onCheckedChange={(checked) => handleChange('hasPreferredName', Boolean(checked))}
        />
        <Label htmlFor="preferredName">I have a preferred name</Label>
      </div>
    </div>
  );
};