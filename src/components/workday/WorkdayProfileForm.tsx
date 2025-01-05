import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/types/database";
import { useSession } from "@supabase/auth-helpers-react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkdayFormData, WorkdayProfile, isWorkdayFormData } from "@/types/workday";

const initialFormData: WorkdayFormData = {
  personalInfo: {
    firstName: "",
    middleName: "",
    lastName: "",
    preferredName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    email: "",
    phoneType: "Mobile",
    phoneNumber: "",
    phoneExtension: "",
    previouslyEmployed: false,
  },
  experience: [],
  education: [],
};

export const WorkdayProfileForm = () => {
  const [formData, setFormData] = useState<WorkdayFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  useEffect(() => {
    const loadSavedData = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await supabase
          .from("workday_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (error) throw error;

        if (data?.content) {
          const parsedContent = data.content;
          if (isWorkdayFormData(parsedContent)) {
            setFormData(parsedContent);
          }
        }
      } catch (error) {
        console.error("Error loading Workday profile:", error);
      }
    };

    loadSavedData();
  }, [session?.user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("workday_profiles")
        .upsert({
          user_id: session.user.id,
          content: formData as unknown as Json,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your Workday profile has been saved.",
      });
    } catch (error) {
      console.error("Error saving Workday profile:", error);
      toast({
        title: "Error",
        description: "Failed to save your Workday profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.personalInfo.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      firstName: e.target.value,
                    },
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.personalInfo.middleName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      middleName: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.personalInfo.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      lastName: e.target.value,
                    },
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="preferredName">Preferred Name</Label>
              <Input
                id="preferredName"
                value={formData.personalInfo.preferredName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      preferredName: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.personalInfo.address}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      address: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.personalInfo.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      city: e.target.value,
                    },
                  })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="state">State *</Label>
              <Select
                value={formData.personalInfo.state}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      state: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GA">Georgia</SelectItem>
                  <SelectItem value="CA">California</SelectItem>
                  {/* Add more states as needed */}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phoneType">Phone Type *</Label>
              <Select
                value={formData.personalInfo.phoneType}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      phoneType: value,
                    },
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                value={formData.personalInfo.phoneNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      phoneNumber: e.target.value,
                    },
                  })
                }
                required
              />
            </div>

            <div className="col-span-2">
              <Label>Previously worked for Workday? *</Label>
              <RadioGroup
                value={formData.personalInfo.previouslyEmployed ? "yes" : "no"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    personalInfo: {
                      ...formData.personalInfo,
                      previouslyEmployed: value === "yes",
                    },
                  })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </TabsContent>

        {/* Experience and Education tabs will be implemented similarly */}
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </div>
    </form>
  );
};
