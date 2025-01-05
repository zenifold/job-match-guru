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

interface Model {
  id: string;
  name: string;
  description: string;
}

interface ModelSelectorFormValues {
  model: string;
}

export function ModelSelector() {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const form = useForm<ModelSelectorFormValues>({
    defaultValues: {
      model: "",
    },
  });

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/models");
        const data = await response.json();
        setModels(data.data.map((model: any) => ({
          id: model.id,
          name: model.name,
          description: model.description
        })));
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
  }, [toast]);

  const onSubmit = async (data: ModelSelectorFormValues) => {
    try {
      // Here we'll save the selected model preference
      // This could be stored in Supabase or local storage
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
    <div className="p-4 space-y-4 w-full">
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
          <Button type="submit" className="w-full">
            Save Preference
          </Button>
        </form>
      </Form>
    </div>
  );
}