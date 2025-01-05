import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MockJobPage } from "@/components/test/MockJobPage";
import { ExtensionPopup } from "@/components/test/ExtensionPopup";
import { WorkdayApplicationForm } from "@/components/test/WorkdayApplicationForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResume } from "@/contexts/ResumeContext";
import { useToast } from "@/hooks/use-toast";

export default function TestEnvironment() {
  const [showPopup, setShowPopup] = useState(false);
  const { resumeData } = useResume();
  const { toast } = useToast();

  // Function to show the current resume data being used
  const showResumeData = () => {
    console.log("Current resume data:", resumeData);
    toast({
      title: "Resume Data Logged",
      description: "Check the browser console to see the current resume data",
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Test Environment</h1>
        
        <div className="mb-4 space-x-2">
          <Button 
            variant="outline" 
            onClick={showResumeData}
            className="mb-4"
          >
            Show Current Resume Data
          </Button>
        </div>
        
        <Tabs defaultValue="workday" className="w-full">
          <TabsList>
            <TabsTrigger value="workday">Workday Mock</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn Mock</TabsTrigger>
            <TabsTrigger value="indeed">Indeed Mock</TabsTrigger>
          </TabsList>

          <div className="mt-4 relative">
            <TabsContent value="workday">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Testing Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Click "Show Extension" in the top right</li>
                  <li>Use the "Auto-fill Application" button in the extension</li>
                  <li>Verify that the form fields are populated correctly</li>
                  <li>Check console logs for detailed debugging information</li>
                </ol>
              </div>
              <WorkdayApplicationForm />
            </TabsContent>
            
            <TabsContent value="linkedin">
              <MockJobPage platform="linkedin" resumeData={resumeData} />
            </TabsContent>
            
            <TabsContent value="indeed">
              <MockJobPage platform="indeed" resumeData={resumeData} />
            </TabsContent>

            <Card className="fixed top-4 right-4 p-4 shadow-lg">
              <h3 className="font-medium mb-2">Extension Controls</h3>
              <Button 
                onClick={() => setShowPopup(!showPopup)}
                className="w-full"
              >
                {showPopup ? "Hide Extension" : "Show Extension"}
              </Button>
              
              {showPopup && (
                <div className="absolute top-full right-0 mt-2">
                  <ExtensionPopup resumeData={resumeData} />
                </div>
              )}
            </Card>
          </div>
        </Tabs>
      </div>
    </MainLayout>
  );
}