import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const ContactSection = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Email Address</h3>
        <div data-automation-id="formField-email">
          <Input
            data-automation-id="email"
            type="email"
            name="email"
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
            <Select name="phoneType" defaultValue="mobile">
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
            <Select name="countryCode" defaultValue="1">
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
              required
            />
          </div>

          <div data-automation-id="formField-phone-extension">
            <Label>Phone Extension</Label>
            <Input
              data-automation-id="phone-extension"
              name="phoneExtension"
            />
          </div>
        </div>
      </div>
    </div>
  );
};