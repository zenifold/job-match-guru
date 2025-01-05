import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface FontCustomizerProps {
  settings: any;
  onUpdate: (fontSettings: any) => void;
}

export function FontCustomizer({ settings, onUpdate }: FontCustomizerProps) {
  const fontFamilies = [
    "Inter",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
  ];

  const handleFontSizeChange = (key: string, value: number) => {
    onUpdate({
      ...settings?.font,
      size: {
        ...settings?.font?.size,
        [key]: `${value}px`,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Font Family</Label>
        <Select
          value={settings?.font?.family}
          onValueChange={(value) =>
            onUpdate({
              ...settings?.font,
              family: value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font family" />
          </SelectTrigger>
          <SelectContent>
            {fontFamilies.map((font) => (
              <SelectItem key={font} value={font}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <Label>Font Sizes</Label>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Heading</Label>
              <span className="text-sm text-muted-foreground">
                {settings?.font?.size?.heading}
              </span>
            </div>
            <Slider
              min={16}
              max={48}
              step={1}
              value={[parseInt(settings?.font?.size?.heading)]}
              onValueChange={([value]) => handleFontSizeChange("heading", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Subheading</Label>
              <span className="text-sm text-muted-foreground">
                {settings?.font?.size?.subheading}
              </span>
            </div>
            <Slider
              min={14}
              max={24}
              step={1}
              value={[parseInt(settings?.font?.size?.subheading)]}
              onValueChange={([value]) => handleFontSizeChange("subheading", value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Body</Label>
              <span className="text-sm text-muted-foreground">
                {settings?.font?.size?.body}
              </span>
            </div>
            <Slider
              min={12}
              max={20}
              step={1}
              value={[parseInt(settings?.font?.size?.body)]}
              onValueChange={([value]) => handleFontSizeChange("body", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}