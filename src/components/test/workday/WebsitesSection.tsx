import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { SectionProps } from "@/types/workdayForm";

interface Website {
  url: string;
}

interface WebsitesSectionProps extends SectionProps {
  value?: Website[];
}

export const WebsitesSection = ({ onChange, value = [] }: WebsitesSectionProps) => {
  const addWebsite = () => {
    const newWebsites = [...value, { url: "" }];
    onChange?.({ websites: newWebsites });
  };

  const updateWebsite = (index: number, url: string) => {
    const newWebsites = [...value];
    newWebsites[index] = { url };
    onChange?.({ websites: newWebsites });
  };

  const removeWebsite = (index: number) => {
    const newWebsites = value.filter((_, i) => i !== index);
    onChange?.({ websites: newWebsites });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-[#0071CE]">Websites</h3>
      <p className="text-sm text-gray-500">Add any relevant websites.</p>
      
      {value.map((website, index) => (
        <div key={index} data-automation-id={`websitePanelSet-${index + 1}`} className="mt-4 space-y-4 border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Website {index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeWebsite(index)}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          <div>
            <Label>
              URL <span className="text-red-500">*</span>
            </Label>
            <Input 
              data-automation-id="website"
              type="url"
              value={website.url}
              onChange={(e) => updateWebsite(index, e.target.value)}
              required 
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" className="w-full mt-4" onClick={addWebsite}>
        <Plus className="h-4 w-4 mr-2" />
        Add Another Website
      </Button>
    </div>
  );
};
