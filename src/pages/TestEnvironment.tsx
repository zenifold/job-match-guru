import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { MockJobPage } from "@/components/test/MockJobPage";
import { ExtensionPopup } from "@/components/test/ExtensionPopup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResume } from "@/contexts/ResumeContext";

export default function TestEnvironment() {
  const [showPopup, setShowPopup] = useState(false);
  const { resumeData } = useResume();

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Test Environment</h1>
        
        <Tabs defaultValue="linkedin" className="w-full">
          <TabsList>
            <TabsTrigger value="linkedin">LinkedIn Mock</TabsTrigger>
            <TabsTrigger value="indeed">Indeed Mock</TabsTrigger>
          </TabsList>

          <div className="mt-4 relative">
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