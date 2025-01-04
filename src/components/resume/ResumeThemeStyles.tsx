import { useResumeTheme } from "@/contexts/ThemeContext";

export const getThemeStyles = (theme: string) => {
  const themes = {
    modern: {
      container: "max-w-4xl mx-auto p-8 bg-white shadow-lg",
      header: "border-b-2 border-primary pb-6",
      heading: "text-4xl font-bold tracking-tight mb-4 text-primary",
      sectionHeading: "text-2xl font-semibold tracking-tight text-primary mb-4",
      contactInfo: "flex flex-wrap gap-4 text-muted-foreground",
      experienceItem: "space-y-2 hover:bg-gray-50 p-4 rounded-lg transition-colors",
      skillTag: "px-3 py-1 bg-primary/10 text-primary rounded-md text-sm",
    },
    classic: {
      container: "max-w-4xl mx-auto p-8 bg-white border-2",
      header: "border-b-2 border-gray-800 pb-6",
      heading: "text-3xl font-serif mb-4 text-gray-800",
      sectionHeading: "text-2xl font-serif text-gray-800 mb-4 border-b",
      contactInfo: "flex flex-wrap gap-4 text-gray-600",
      experienceItem: "space-y-2 mb-4",
      skillTag: "px-3 py-1 bg-gray-100 text-gray-800 rounded-sm text-sm",
    },
    minimal: {
      container: "max-w-4xl mx-auto p-8 bg-white",
      header: "pb-6",
      heading: "text-2xl font-light mb-4",
      sectionHeading: "text-xl font-light mb-4",
      contactInfo: "flex flex-wrap gap-4 text-gray-500",
      experienceItem: "space-y-2 mb-4",
      skillTag: "px-2 py-0.5 bg-gray-50 text-gray-600 text-sm",
    },
    professional: {
      container: "max-w-4xl mx-auto p-8 bg-white shadow-md",
      header: "border-b-2 border-blue-600 pb-6",
      heading: "text-3xl font-bold mb-4 text-blue-600",
      sectionHeading: "text-2xl font-semibold text-blue-600 mb-4",
      contactInfo: "flex flex-wrap gap-4 text-gray-700",
      experienceItem: "space-y-2 p-4 border-l-2 border-blue-100 mb-4",
      skillTag: "px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-sm",
    },
  };

  return themes[theme as keyof typeof themes] || themes.modern;
};

export const ResumeThemeStyles = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useResumeTheme();
  const styles = getThemeStyles(theme);

  return (
    <div className={styles.container}>
      {children}
    </div>
  );
};