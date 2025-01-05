import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const LegalNameSection = () => {
  return (
    <div data-automation-id="legalNameSection" className="space-y-4">
      <h3 className="text-lg font-semibold">Legal Name</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div data-automation-id="formField-legalNameSection_title">
          <Label>Prefix</Label>
          <Select name="prefix">
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
            required
          />
        </div>

        <div data-automation-id="formField-legalNameSection_middleName">
          <Label>Middle Name</Label>
          <Input
            data-automation-id="legalNameSection_middleName"
            name="middleName"
          />
        </div>

        <div data-automation-id="formField-legalNameSection_lastName">
          <Label className="flex items-center gap-2">
            Last Name <span className="text-red-500">*</span>
          </Label>
          <Input
            data-automation-id="legalNameSection_lastName"
            name="lastName"
            required
          />
        </div>

        <div data-automation-id="formField-legalNameSection_suffix">
          <Label>Suffix</Label>
          <Select name="suffix">
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
        <Checkbox id="preferredName" />
        <Label htmlFor="preferredName">I have a preferred name</Label>
      </div>
    </div>
  );
};