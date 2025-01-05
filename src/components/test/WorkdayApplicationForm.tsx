import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export function WorkdayApplicationForm() {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Workday Application</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4" />
            <span>Step 1 of 3: My Information</span>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="personal" className="flex-1">Personal Information</TabsTrigger>
            <TabsTrigger value="experience" className="flex-1">Work Experience</TabsTrigger>
            <TabsTrigger value="education" className="flex-1">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Enter your first name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Enter your last name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Enter your street address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Select name="state">
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
                    {/* Add more states as needed */}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="Enter ZIP code"
                  required
                />
              </div>

              <div className="col-span-2">
                <Label>Have you previously worked for this company? *</Label>
                <RadioGroup defaultValue="no" name="previouslyEmployed">
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label htmlFor="yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label htmlFor="no">No</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="company">Most Recent Company</Label>
                <Input
                  id="company"
                  name="company"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  name="jobTitle"
                  placeholder="Enter job title"
                />
              </div>
              {/* Add more experience fields as needed */}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="school">School/University</Label>
                <Input
                  id="school"
                  name="school"
                  placeholder="Enter school name"
                />
              </div>
              <div>
                <Label htmlFor="degree">Degree</Label>
                <Input
                  id="degree"
                  name="degree"
                  placeholder="Enter degree"
                />
              </div>
              {/* Add more education fields as needed */}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" type="button">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button type="button">
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}