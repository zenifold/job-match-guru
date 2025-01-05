import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";

const defaultThemes = [
  {
    id: "simple",
    name: "Modern Simple",
    description: "Clean, left-aligned layout with modern typography",
    settings: {
      layout: {
        type: "simple",
        columns: 1,
        headerStyle: "left-aligned"
      }
    }
  },
  {
    id: "centered",
    name: "Centered Header",
    description: "Centered header with left-aligned content",
    settings: {
      layout: {
        type: "centered",
        columns: 1,
        headerStyle: "centered"
      }
    }
  },
  {
    id: "sidebar",
    name: "Right Sidebar",
    description: "Two-column layout with right sidebar",
    settings: {
      layout: {
        type: "sidebar",
        columns: 2,
        headerStyle: "left-aligned"
      }
    }
  }
];

interface ThemeSelectorProps {
  activeTheme: any;
  onThemeSelect: (theme: any) => void;
}

export function ThemeSelector({ activeTheme, onThemeSelect }: ThemeSelectorProps) {
  const session = useSession();

  const { data: themes } = useQuery({
    queryKey: ["resume-themes"],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      const { data, error } = await supabase
        .from("resume_themes")
        .select("*")
        .eq("user_id", session.user.id);

      if (error) throw error;
      return data || [];
    },
  });

  return (
    <div className="space-y-4">
      <RadioGroup
        value={activeTheme?.id}
        onValueChange={(value) => {
          const selectedTheme = themes?.find((t) => t.id === value) || 
                              defaultThemes.find((t) => t.id === value);
          if (selectedTheme) {
            onThemeSelect(selectedTheme);
          }
        }}
      >
        <div className="grid gap-4">
          {defaultThemes.map((theme) => (
            <Label
              key={theme.id}
              className="cursor-pointer"
              htmlFor={theme.id}
            >
              <Card className={`p-4 ${activeTheme?.id === theme.id ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={theme.id} id={theme.id} />
                  <div className="flex-1">
                    <p className="font-medium">{theme.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {theme.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Label>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}