import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LayoutCustomizerProps {
  settings: any;
  onUpdate: (layoutSettings: any) => void;
}

export function LayoutCustomizer({ settings, onUpdate }: LayoutCustomizerProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Layout Columns</Label>
        <Select
          value={settings?.layout?.columns?.toString()}
          onValueChange={(value) =>
            onUpdate({
              ...settings?.layout,
              columns: parseInt(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select number of columns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Single Column</SelectItem>
            <SelectItem value="2">Two Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Header Style</Label>
        <RadioGroup
          value={settings?.layout?.headerStyle}
          onValueChange={(value) =>
            onUpdate({
              ...settings?.layout,
              headerStyle: value,
            })
          }
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="centered" id="centered" />
            <Label htmlFor="centered">Centered</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left-aligned" id="left-aligned" />
            <Label htmlFor="left-aligned">Left Aligned</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="minimal" id="minimal" />
            <Label htmlFor="minimal">Minimal</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}