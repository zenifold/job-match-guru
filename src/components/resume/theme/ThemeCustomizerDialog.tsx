import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CustomizerTabs } from "./CustomizerTabs";
import { ThemePreview } from "./ThemePreview";

interface ThemeCustomizerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeCustomizerDialog({ open, onOpenChange }: ThemeCustomizerDialogProps) {
  const session = useSession();
  const { toast } = useToast();
  const [activeTheme, setActiveTheme] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && session?.user?.id) {
      const loadDefaultTheme = async () => {
        const { data, error } = await supabase
          .from('resume_themes')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_default', true)
          .single();

        if (!error && data) {
          setActiveTheme(data);
          setSettings(data.settings);
        }
      };

      loadDefaultTheme();
    }
  }, [open, session?.user?.id]);

  const handleSave = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to save theme settings.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (activeTheme?.id) {
        // Update existing theme
        const { error } = await supabase
          .from('resume_themes')
          .update({ settings })
          .eq('id', activeTheme.id)
          .eq('user_id', session.user.id);

        if (error) throw error;
      } else {
        // Create new theme
        const { error } = await supabase
          .from('resume_themes')
          .insert({
            user_id: session.user.id,
            name: 'Custom Theme',
            settings,
            is_default: false,
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Theme settings saved successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error",
        description: "Failed to save theme settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Customize Resume Template</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 h-full overflow-hidden">
          <div className="space-y-6 overflow-y-auto pr-4">
            <CustomizerTabs 
              activeTheme={activeTheme} 
              settings={settings}
              onThemeSelect={(theme) => {
                setActiveTheme(theme);
                setSettings(theme.settings);
              }}
              onSettingsUpdate={setSettings}
            />

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          <div className="border-l pl-6">
            <ThemePreview settings={settings} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}