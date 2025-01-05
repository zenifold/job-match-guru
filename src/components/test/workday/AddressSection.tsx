import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AddressSection = () => {
  return (
    <div data-automation-id="addressSection" className="space-y-4">
      <h3 className="text-lg font-semibold">Address</h3>
      
      <div className="space-y-4">
        <div data-automation-id="formField-addressSection_addressLine1">
          <Label className="flex items-center gap-2">
            Address Line 1 <span className="text-red-500">*</span>
          </Label>
          <Input
            data-automation-id="addressSection_addressLine1"
            name="addressLine1"
            required
          />
        </div>

        <div data-automation-id="formField-addressSection_addressLine2">
          <Label>Address Line 2</Label>
          <Input
            data-automation-id="addressSection_addressLine2"
            name="addressLine2"
          />
        </div>

        <div data-automation-id="formField-addressSection_city">
          <Label className="flex items-center gap-2">
            City <span className="text-red-500">*</span>
          </Label>
          <Input
            data-automation-id="addressSection_city"
            name="city"
            required
          />
        </div>

        <div data-automation-id="formField-addressSection_countryRegion">
          <Label className="flex items-center gap-2">
            State <span className="text-red-500">*</span>
          </Label>
          <Select name="state">
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {/* All US states */}
              <SelectItem value="AL">Alabama</SelectItem>
              <SelectItem value="AK">Alaska</SelectItem>
              <SelectItem value="AZ">Arizona</SelectItem>
              <SelectItem value="AR">Arkansas</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              {/* ... Add all other states */}
            </SelectContent>
          </Select>
        </div>

        <div data-automation-id="formField-addressSection_postalCode">
          <Label className="flex items-center gap-2">
            Postal Code <span className="text-red-500">*</span>
          </Label>
          <Input
            data-automation-id="addressSection_postalCode"
            name="postalCode"
            required
          />
        </div>
      </div>
    </div>
  );
};