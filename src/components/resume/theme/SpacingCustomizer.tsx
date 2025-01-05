import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface SpacingCustomizerProps {
  settings: any;
  onUpdate: (spacingSettings: any) => void;
}

export function SpacingCustomizer({ settings, onUpdate }: SpacingCustomizerProps) {
  const handleSpacingChange = (key: string, value: number) => {
    onUpdate({
      ...settings?.spacing,
      [key]: `${value}rem`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Page Margins</Label>
            <span className="text-sm text-muted-foreground">
              {settings?.spacing?.margins}
            </span>
          </div>
          <Slider
            min={1}
            max={4}
            step={0.25}
            value={[parseFloat(settings?.spacing?.margins)]}
            onValueChange={([value]) => handleSpacingChange("margins", value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Section Gap</Label>
            <span className="text-sm text-muted-foreground">
              {settings?.spacing?.sectionGap}
            </span>
          </div>
          <Slider
            min={0.5}
            max={3}
            step={0.25}
            value={[parseFloat(settings?.spacing?.sectionGap)]}
            onValueChange={([value]) => handleSpacingChange("sectionGap", value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Line Height</Label>
            <span className="text-sm text-muted-foreground">
              {settings?.spacing?.lineHeight}
            </span>
          </div>
          <Slider
            min={1}
            max={2}
            step={0.1}
            value={[parseFloat(settings?.spacing?.lineHeight)]}
            onValueChange={([value]) => handleSpacingChange("lineHeight", value)}
          />
        </div>
      </div>
    </div>
  );
}