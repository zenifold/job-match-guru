import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Save, FileJson, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadButton } from "./actions/DownloadButton";

export const BuilderActions = ({ 
  step, 
  setStep,
  isLastStep 
}: { 
  step: number;
  setStep: (step: number) => void;
  isLastStep: boolean;
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();
  const { resumeData } = useResume();
  const [resumeName, setResumeName] = useState("My Resume");
  const [careerFocus, setCareerFocus] = useState("");
  const [isMaster, setIsMaster] = useState(false);

  const handlePreview = () => {
    navigate("/preview", { state: { resumeData } });
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resumeName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Resume Exported",
      description: "Your resume data has been exported as JSON.",
    });
  };

  const handleSave = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please sign in to save your resume.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Saving resume data:", resumeData);
      const { error } = await supabase
        .from("profiles")
        .upsert({
          user_id: session.user.id,
          name: resumeName,
          content: resumeData,
          created_at: new Date().toISOString(),
          career_focus: careerFocus || null,
          is_master: isMaster,
        });

      if (error) {
        console.error("Error saving resume:", error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Your resume has been saved successfully.",
      });
      
      navigate("/resumes");
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast({
        title: "Error",
        description: "Failed to save your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <Label htmlFor="resumeName">Resume Name</Label>
          <Input
            id="resumeName"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            placeholder="Enter resume name"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="careerFocus">Career Focus (Optional)</Label>
          <Input
            id="careerFocus"
            value={careerFocus}
            onChange={(e) => setCareerFocus(e.target.value)}
            placeholder="e.g., Product Management, Data Analysis"
            className="mt-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="master">Master Resume</Label>
            <div className="text-sm text-muted-foreground">
              Mark this as a master resume for this career focus
            </div>
          </div>
          <Switch
            id="master"
            checked={isMaster}
            onCheckedChange={setIsMaster}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        <Button onClick={handlePreview} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <DownloadButton 
          resume={{ name: resumeName, content: resumeData }} 
          variant="outline" 
          size="default" 
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExportJSON}>
              <FileJson className="h-4 w-4 mr-2" />
              Export JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isLastStep && (
        <div className="mt-6">
          <Button onClick={handleSave} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Resume
          </Button>
        </div>
      )}
    </>
  );
};