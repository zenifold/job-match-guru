import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Model {
  id: string;
  name: string;
  description: string;
}

interface ModelSelectorFormValues {
  model: string;
}

const DEFAULT_MODEL = "google/gemini-2.0-flash-exp:free";
const FALLBACK_MODEL = "meta-llama/llama-3.2-3b-instruct:free";

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const form = useForm<ModelSelectorFormValues>({
    defaultValues: {
      model: localStorage.getItem('selectedModel') || DEFAULT_MODEL,
    },
  });

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data: { data: secretData }, error: secretError } = await supabase
          .functions.invoke('get-secret', {
            body: { secretName: 'OPENROUTER_API_KEY' }
          });

        if (secretError) throw secretError;

        const response = await fetch("https://openrouter.ai/api/v1/models", {
          headers: {
            "Authorization": `Bearer ${secretData.value}`,
            "HTTP-Referer": window.location.origin,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }

        const data = await response.json();
        console.log("Fetched models:", data);
        
        const availableModels = data.data.map((model: any) => ({
          id: model.id,
          name: model.name,
          description: model.description || 'No description available'
        }));

        // Check if default or fallback models are available
        const hasDefaultModel = availableModels.some(model => model.id === DEFAULT_MODEL);
        const hasFallbackModel = availableModels.some(model => model.id === FALLBACK_MODEL);

        if (!hasDefaultModel && !hasFallbackModel) {
          toast({
            title: "Warning",
            description: "Preferred models not available. Using first available model.",
            variant: "destructive",
          });
        }

        setModels(availableModels);

        // Set initial model if none selected
        const currentModel = localStorage.getItem('selectedModel');
        if (!currentModel) {
          const modelToUse = hasDefaultModel ? DEFAULT_MODEL : 
                           hasFallbackModel ? FALLBACK_MODEL : 
                           availableModels[0]?.id;
          
          if (modelToUse) {
            localStorage.setItem('selectedModel', modelToUse);
            form.setValue('model', modelToUse);
          }
        }
      } catch (error) {
        console.error("Error fetching models:", error);
        toast({
          title: "Error",
          description: "Failed to fetch available models",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchModels();
  }, [toast, form]);

  const onSubmit = async (data: ModelSelectorFormValues) => {
    try {
      localStorage.setItem('selectedModel', data.model);
      toast({
        title: "Success",
        description: "Model preference saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save model preference",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Model</FormLabel>
              <Select
                disabled={isLoading}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose the AI model for resume optimization
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          Save Preference
        </Button>
      </form>
    </Form>
  );
}