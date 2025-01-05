import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { SectionProps } from "@/types/workdayForm";
import { useState } from "react";

interface Language {
  language: string;
  isNative: boolean;
  readingProficiency: string;
  speakingProficiency: string;
  writingProficiency: string;
  translationProficiency: string;
}

interface LanguagesSectionProps extends SectionProps {
  value?: Language[];
}

export const LanguagesSection = ({ onChange, value = [] }: LanguagesSectionProps) => {
  const [languages, setLanguages] = useState<Language[]>(value);

  const addLanguage = () => {
    setLanguages([
      ...languages,
      {
        language: "",
        isNative: false,
        readingProficiency: "",
        speakingProficiency: "",
        writingProficiency: "",
        translationProficiency: ""
      }
    ]);
  };

  const removeLanguage = (index: number) => {
    const newLanguages = languages.filter((_, i) => i !== index);
    setLanguages(newLanguages);
    onChange?.({ languages: newLanguages });
  };

  const updateLanguage = (index: number, field: keyof Language, value: string | boolean) => {
    const newLanguages = [...languages];
    if (field === 'isNative') {
      newLanguages[index] = {
        ...newLanguages[index],
        [field]: value as boolean
      };
    } else {
      newLanguages[index] = {
        ...newLanguages[index],
        [field]: value as string
      };
    }
    setLanguages(newLanguages);
    onChange?.({ languages: newLanguages });
  };

  return (
    <div data-automation-id="languageSection" className="space-y-6">
      <h3 className="text-lg font-semibold text-[#0071CE]">Languages</h3>
      
      {languages.map((lang, index) => (
        <div key={index} data-automation-id={`language-${index + 1}`} className="space-y-4 border rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Language {index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeLanguage(index)}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>
                Language <span className="text-red-500">*</span>
              </Label>
              <Select
                value={lang.language}
                onValueChange={(value) => updateLanguage(index, 'language', value)}
              >
                <SelectTrigger data-automation-id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id={`nativeLanguage-${index}`} 
                checked={lang.isNative} 
                onCheckedChange={(checked) => updateLanguage(index, 'isNative', Boolean(checked))}
              />
              <Label htmlFor={`nativeLanguage-${index}`}>I am fluent in this language.</Label>
            </div>

            {['Reading', 'Speaking', 'Translation', 'Writing'].map((type, idx) => (
              <div key={type}>
                <Label>
                  {type} Proficiency <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={lang[`${type.toLowerCase()}Proficiency` as keyof Language]}
                  onValueChange={(value) => updateLanguage(index, `${type.toLowerCase()}Proficiency` as keyof Language, value)}
                >
                  <SelectTrigger data-automation-id={`languageProficiency-${index}-${idx}`}>
                    <SelectValue placeholder="Select proficiency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="native">Native</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" className="w-full" onClick={addLanguage}>
        <Plus className="h-4 w-4 mr-2" />
        Add Another Language
      </Button>
    </div>
  );
};