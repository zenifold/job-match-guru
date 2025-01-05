import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectionProps } from "@/types/workdayForm";

export const ContactSection = ({ onChange, value }: SectionProps) => {
  const handleChange = (field: string, newValue: string) => {
    onChange({
      contact: {
        ...value,
        [field]: newValue
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Email Address</h3>
        <div data-automation-id="formField-email">
          <Input
            data-automation-id="email"
            type="email"
            name="email"
            value={value?.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            readOnly
          />
        </div>
      </div>

      <div data-automation-id="phonePanelSet" className="space-y-4">
        <h3 className="text-lg font-semibold">Phone</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div data-automation-id="formField-phone-device-type">
            <Label className="flex items-center gap-2">
              Phone Device Type <span className="text-red-500">*</span>
            </Label>
            <Select 
              name="phoneType" 
              value={value?.phoneType || 'mobile'}
              onValueChange={(val) => handleChange('phoneType', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select phone type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="home">Home</SelectItem>
                <SelectItem value="work">Work</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div data-automation-id="formField-country-phone-code">
            <Label className="flex items-center gap-2">
              Country Phone Code <span className="text-red-500">*</span>
            </Label>
            <Select 
              name="countryCode" 
              value={value?.countryCode || '1'}
              onValueChange={(val) => handleChange('countryCode', val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country code" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">United States of America (+1)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div data-automation-id="formField-phone-number">
            <Label className="flex items-center gap-2">
              Phone Number <span className="text-red-500">*</span>
            </Label>
            <Input
              data-automation-id="phone-number"
              type="tel"
              name="phoneNumber"
              value={value?.phoneNumber || ''}
              onChange={(e) => handleChange('phoneNumber', e.target.value)}
              required
            />
          </div>

          <div data-automation-id="formField-phone-extension">
            <Label>Phone Extension</Label>
            <Input
              data-automation-id="phone-extension"
              name="phoneExtension"
              value={value?.phoneExtension || ''}
              onChange={(e) => handleChange('phoneExtension', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};