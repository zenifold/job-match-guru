import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectSectionsStepProps {
  selectedSections: string[];
  onSectionToggle: (section: string) => void;
}

export function SelectSectionsStep({
  selectedSections,
  onSectionToggle,
}: SelectSectionsStepProps) {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">
        Select sections to optimize
      </h3>
      <div className="space-y-4">
        {["summary", "experience", "skills", "education"].map((section) => (
          <div key={section} className="flex items-center space-x-2">
            <Checkbox
              id={section}
              checked={selectedSections.includes(section)}
              onCheckedChange={() => onSectionToggle(section)}
            />
            <label
              htmlFor={section}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </label>
          </div>
        ))}
      </div>
    </Card>
  );
}