import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

export const WebsitesSection = () => {
  return (
    <div className="space-y-6">
      <div data-automation-id="websiteSection">
        <h3 className="text-lg font-semibold text-[#0071CE]">Websites</h3>
        <p className="text-sm text-gray-500">Add any relevant websites.</p>
        
        <div data-automation-id="websitePanelSet-1" className="mt-4 space-y-4 border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Websites 1</h4>
            <Button variant="ghost" size="sm">
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          <div>
            <Label>
              URL <span className="text-red-500">*</span>
            </Label>
            <Input data-automation-id="website" type="url" required />
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full mt-4" onClick={() => {}}>
          <Plus className="h-4 w-4 mr-2" />
          Add Another Website
        </Button>
      </div>

      <div data-automation-id="socialNetworkSection">
        <h3 className="text-lg font-semibold text-[#0071CE]">Social Network URLs</h3>
        <div className="mt-4">
          <Label>LinkedIn</Label>
          <Input data-automation-id="linkedinQuestion" type="url" />
        </div>
      </div>
    </div>
  );
};