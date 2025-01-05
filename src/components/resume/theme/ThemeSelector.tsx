import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ThemeSelectorProps {
  activeTheme: any;
  onThemeSelect: (theme: any) => void;
}

export function ThemeSelector({ activeTheme, onThemeSelect }: ThemeSelectorProps) {
  const session = useSession();
  const { toast } = useToast();

  const { data: themes } = useQuery({
    queryKey: ["resume-themes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("resume_themes")
        .select("*")
        .eq("user_id", session?.user?.id);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user,
  });

  const createNewTheme = async () => {
    try {
      const { data, error } = await supabase
        .from("resume_themes")
        .insert({
          user_id: session?.user?.id,
          name: `Theme ${(themes?.length || 0) + 1}`,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Theme created",
        description: "New theme has been created successfully.",
      });

      onThemeSelect(data);
    } catch (error) {
      console.error('Error creating theme:', error);
      toast({
        title: "Error",
        description: "Failed to create new theme. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Themes</h3>
        <Button variant="outline" size="sm" onClick={createNewTheme}>
          <Plus className="h-4 w-4 mr-2" />
          New Theme
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {themes?.map((theme) => (
          <Card
            key={theme.id}
            className={`p-4 cursor-pointer transition-all ${
              activeTheme?.id === theme.id
                ? "ring-2 ring-primary"
                : "hover:bg-accent"
            }`}
            onClick={() => onThemeSelect(theme)}
          >
            <h4 className="font-medium">{theme.name}</h4>
            {theme.is_default && (
              <span className="text-sm text-muted-foreground">Default</span>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}