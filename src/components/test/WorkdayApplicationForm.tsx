import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { SourceSection } from "./workday/SourceSection";
import { LegalNameSection } from "./workday/LegalNameSection";
import { AddressSection } from "./workday/AddressSection";
import { ContactSection } from "./workday/ContactSection";

export function WorkdayApplicationForm() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Workday Application</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4" />
            <span>Step 1 of 3: My Information</span>
          </div>
        </div>

        <form className="space-y-8">
          <SourceSection />
          <div className="border-t pt-6">
            <LegalNameSection />
          </div>
          <div className="border-t pt-6">
            <AddressSection />
          </div>
          <div className="border-t pt-6">
            <ContactSection />
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" type="button">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button type="button">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}