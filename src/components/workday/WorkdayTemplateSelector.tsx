import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

interface WorkdayTemplateSelector {
  onLoadTemplate: (template: any) => void;
  currentFormData: any;
}

export const WorkdayTemplateSelector = ({
  onLoadTemplate,
  currentFormData,
}: WorkdayTemplateSelector) => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const session = useSession();

  const loadTemplates = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from("workday_profiles")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
      toast({
        title: "Error",
        description: "Failed to load templates",
        variant: "destructive",
      });
    }
  };

  const saveAsTemplate = async () => {
    if (!session?.user?.id || !newTemplateName.trim()) return;

    setIsSaving(true);
    try {
      const { error } = await supabase.from("workday_profiles").insert({
        user_id: session.user.id,
        content: currentFormData,
        name: newTemplateName.trim(),
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Template saved successfully",
      });
      
      setNewTemplateName("");
      loadTemplates();
    } catch (error) {
      console.error("Error saving template:", error);
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const loadTemplate = async (templateId: string) => {
    if (!templateId) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("workday_profiles")
        .select("*")
        .eq("id", templateId)
        .single();

      if (error) throw error;
      if (data) {
        onLoadTemplate(data.content);
        toast({
          title: "Success",
          description: "Template loaded successfully",
        });
      }
    } catch (error) {
      console.error("Error loading template:", error);
      toast({
        title: "Error",
        description: "Failed to load template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Application Templates</h3>
      
      <div className="flex gap-4">
        <Input
          placeholder="Template name"
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
        />
        <Button 
          onClick={saveAsTemplate} 
          disabled={isSaving || !newTemplateName.trim()}
        >
          {isSaving ? "Saving..." : "Save as Template"}
        </Button>
      </div>

      <div className="flex gap-4">
        <Select
          value={selectedTemplate}
          onValueChange={(value) => {
            setSelectedTemplate(value);
            loadTemplate(value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Load template..." />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};