import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorSchemeSelectorProps {
  settings: any;
  onUpdate: (colorSettings: any) => void;
}

export function ColorSchemeSelector({ settings, onUpdate }: ColorSchemeSelectorProps) {
  const handleColorChange = (key: string, value: string) => {
    onUpdate({
      ...settings?.colors,
      [key]: value,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Primary Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings?.colors?.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={settings?.colors?.primary}
              onChange={(e) => handleColorChange("primary", e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Secondary Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings?.colors?.secondary}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={settings?.colors?.secondary}
              onChange={(e) => handleColorChange("secondary", e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Accent Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings?.colors?.accent}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={settings?.colors?.accent}
              onChange={(e) => handleColorChange("accent", e.target.value)}
              className="font-mono"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={settings?.colors?.background}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="w-12 h-12 p-1"
            />
            <Input
              type="text"
              value={settings?.colors?.background}
              onChange={(e) => handleColorChange("background", e.target.value)}
              className="font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
}