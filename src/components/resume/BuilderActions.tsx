import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Save, FileJson, MoreVertical, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useResume } from "@/contexts/ResumeContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-content');
    if (!element) {
      toast({
        title: "Error",
        description: "Could not find resume content to generate PDF.",
        variant: "destructive",
      });
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeName}.pdf`);

      toast({
        title: "Success",
        description: "Your resume has been downloaded as PDF.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
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
      <div className="mb-6">
        <Label htmlFor="resumeName">Resume Name</Label>
        <Input
          id="resumeName"
          value={resumeName}
          onChange={(e) => setResumeName(e.target.value)}
          placeholder="Enter resume name"
          className="mt-1"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handlePreview} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Preview
        </Button>
        <Button onClick={handleDownloadPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
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
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep(step - 1)}
          disabled={step === 1}
        >
          Previous
        </Button>
        {isLastStep ? (
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Resume
          </Button>
        ) : (
          <Button
            onClick={() => setStep(step + 1)}
            disabled={step === 6}
          >
            Next
          </Button>
        )}
      </div>
    </>
  );
};