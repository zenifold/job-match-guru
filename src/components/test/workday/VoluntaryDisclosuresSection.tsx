import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionProps } from "@/types/workdayForm";

interface VoluntaryDisclosuresSectionProps extends SectionProps {
  value?: { [key: string]: string | boolean };
}

export const VoluntaryDisclosuresSection = ({ onChange, value = {} }: VoluntaryDisclosuresSectionProps) => {
  return (
    <div data-automation-id="voluntaryDisclosuresPage">
      <h3 className="text-[#0071CE] text-lg font-semibold mb-4">Equal Employment Opportunity</h3>
      
      <Card className="p-6 space-y-6">
        <div data-automation-id="instructionalText" className="prose">
          <h4 className="font-semibold">Accommodation</h4>
          <p>
            Walmart, Inc. offers reasonable accommodation in the employment process for individuals with disabilities. 
            If you need assistance in the application or hiring process to accommodate a disability, you may request 
            an accommodation at any time.
          </p>
          
          <p>
            We do not discriminate against qualified applicants based upon any protected group status, including but 
            not limited to race, color, creed, religion, sex (except where it is a bona fide occupational qualification), 
            national origin, ancestry, age, marital status, military or veteran status, sexual orientation, physical or 
            mental disability or medical condition as defined by applicable equal opportunity laws.
          </p>

          <div className="mt-6">
            <h4 className="font-semibold">Ethnic Group Definitions</h4>
            <p>
              To assist in appropriate identification, please select the group to which you belong, 
              identify with, or are regarded in the community as belonging in accordance with the definitions below:
            </p>
          </div>
        </div>

        <div data-automation-id="usPersonalInfoSection" className="space-y-4">
          <div data-automation-id="formField-ethnicityDropdown">
            <Label>Please select your ethnicity.</Label>
            <Select defaultValue="white">
              <SelectTrigger data-automation-id="ethnicityDropdown" className="w-full max-w-[344px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="white">White/No Hispanic Origin</SelectItem>
                <SelectItem value="black">African American or Black</SelectItem>
                <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="native">Native American Indian or Alaska Native</SelectItem>
                <SelectItem value="pacific">Other Pacific Islander</SelectItem>
                <SelectItem value="two-or-more">Two or more races</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div data-automation-id="formField-gender">
            <Label>Please select your gender.</Label>
            <Select defaultValue="male">
              <SelectTrigger data-automation-id="gender" className="w-full max-w-[344px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="decline">Decline to State</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <h3 className="text-[#0071CE] text-lg font-semibold mt-8 mb-4">Terms and Conditions</h3>
      <Card className="p-6 space-y-6">
        <div data-automation-id="instructionalText" className="prose">
          <p className="font-semibold">Applicants for US Jobs and Positions:</p>
          <p>
            I understand this application will apply only to the position(s) for which I have applied during 
            this session, and will be active until those position(s) are filled or are closed. If I would like 
            to be considered for additional positions with the company, I understand and agree that it is my 
            responsibility to submit an additional application(s) for any such position(s).
          </p>
        </div>

        <div data-automation-id="formField-formField-agreementCheckbox" className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            data-automation-id="agreementCheckbox"
            checked={value.terms || false}
            onCheckedChange={(checked) => onChange?.({ ...value, terms: checked })}
          />
          <Label htmlFor="terms" className="text-sm">
            Yes, I have read and consent to the Terms and Conditions
            <span className="text-red-500 ml-1">*</span>
          </Label>
        </div>
      </Card>
    </div>
  );
};
