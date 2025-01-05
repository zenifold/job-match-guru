import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSelector } from "./ThemeSelector";
import { FontCustomizer } from "./FontCustomizer";
import { ColorSchemeSelector } from "./ColorSchemeSelector";
import { LayoutCustomizer } from "./LayoutCustomizer";
import { SpacingCustomizer } from "./SpacingCustomizer";
import { ThemePreview } from "./ThemePreview";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface ThemeCustomizerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThemeCustomizerDialog({ open, onOpenChange }: ThemeCustomizerDialogProps) {
  const session = useSession();
  const { toast } = useToast();
  const [activeTheme, setActiveTheme] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);

  // Load initial theme settings
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

  const handleThemeSelect = (theme: any) => {
    console.log("Selected theme:", theme);
    setActiveTheme(theme);
    setSettings(theme.settings);
  };

  const handleSave = async () => {
    try {
      if (!activeTheme?.id || !session?.user?.id) return;

      const { error } = await supabase
        .from('resume_themes')
        .update({ settings })
        .eq('id', activeTheme.id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Theme saved",
        description: "Your theme settings have been updated successfully.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error",
        description: "Failed to save theme settings. Please try again.",
        variant: "destructive",
      });
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
            <Tabs defaultValue="theme" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="theme">Theme</TabsTrigger>
                <TabsTrigger value="fonts">Fonts</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="layout">Layout</TabsTrigger>
                <TabsTrigger value="spacing">Spacing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="theme">
                <ThemeSelector 
                  activeTheme={activeTheme} 
                  onThemeSelect={handleThemeSelect}
                />
              </TabsContent>
              
              <TabsContent value="fonts">
                <FontCustomizer 
                  settings={settings} 
                  onUpdate={(fontSettings) => setSettings({ 
                    ...settings, 
                    font: fontSettings 
                  })} 
                />
              </TabsContent>
              
              <TabsContent value="colors">
                <ColorSchemeSelector 
                  settings={settings} 
                  onUpdate={(colorSettings) => setSettings({ 
                    ...settings, 
                    colors: colorSettings 
                  })} 
                />
              </TabsContent>
              
              <TabsContent value="layout">
                <LayoutCustomizer 
                  settings={settings} 
                  onUpdate={(layoutSettings) => setSettings({ 
                    ...settings, 
                    layout: layoutSettings 
                  })} 
                />
              </TabsContent>
              
              <TabsContent value="spacing">
                <SpacingCustomizer 
                  settings={settings} 
                  onUpdate={(spacingSettings) => setSettings({ 
                    ...settings, 
                    spacing: spacingSettings 
                  })} 
                />
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
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