import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSelector } from "./ThemeSelector";
import { FontCustomizer } from "./FontCustomizer";
import { ColorSchemeSelector } from "./ColorSchemeSelector";
import { LayoutCustomizer } from "./LayoutCustomizer";
import { SpacingCustomizer } from "./SpacingCustomizer";

interface CustomizerTabsProps {
  activeTheme: any;
  settings: any;
  onThemeSelect: (theme: any) => void;
  onSettingsUpdate: (settings: any) => void;
}

export const CustomizerTabs = ({ 
  activeTheme, 
  settings, 
  onThemeSelect,
  onSettingsUpdate 
}: CustomizerTabsProps) => {
  return (
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
          onThemeSelect={onThemeSelect}
        />
      </TabsContent>
      
      <TabsContent value="fonts">
        <FontCustomizer 
          settings={settings} 
          onUpdate={(fontSettings) => onSettingsUpdate({ 
            ...settings, 
            font: fontSettings 
          })} 
        />
      </TabsContent>
      
      <TabsContent value="colors">
        <ColorSchemeSelector 
          settings={settings} 
          onUpdate={(colorSettings) => onSettingsUpdate({ 
            ...settings, 
            colors: colorSettings 
          })} 
        />
      </TabsContent>
      
      <TabsContent value="layout">
        <LayoutCustomizer 
          settings={settings} 
          onUpdate={(layoutSettings) => onSettingsUpdate({ 
            ...settings, 
            layout: layoutSettings 
          })} 
        />
      </TabsContent>
      
      <TabsContent value="spacing">
        <SpacingCustomizer 
          settings={settings} 
          onUpdate={(spacingSettings) => onSettingsUpdate({ 
            ...settings, 
            spacing: spacingSettings 
          })} 
        />
      </TabsContent>
    </Tabs>
  );
};