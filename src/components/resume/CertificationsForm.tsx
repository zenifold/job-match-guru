import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus, Trash } from "lucide-react";

interface CertificationsFormProps {
  data: any[];
  onSave: (data: any[]) => void;
}

export const CertificationsForm = ({ data, onSave }: CertificationsFormProps) => {
  const [certifications, setCertifications] = useState(
    data.length > 0
      ? data
      : [
          {
            name: "",
            issuer: "",
            issueDate: "",
            expiryDate: "",
            credentialId: "",
            url: "",
          },
        ]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(certifications);
  };

  const addCertification = () => {
    setCertifications([
      ...certifications,
      {
        name: "",
        issuer: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        url: "",
      },
    ]);
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold">Certifications</h2>
      {certifications.map((cert, index) => (
        <Card key={index} className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Certification {index + 1}</h3>
            {certifications.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeCertification(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Certification Name</Label>
              <Input
                value={cert.name}
                onChange={(e) => {
                  const newCertifications = [...certifications];
                  newCertifications[index].name = e.target.value;
                  setCertifications(newCertifications);
                }}
                required
              />
            </div>
            <div>
              <Label>Issuing Organization</Label>
              <Input
                value={cert.issuer}
                onChange={(e) => {
                  const newCertifications = [...certifications];
                  newCertifications[index].issuer = e.target.value;
                  setCertifications(newCertifications);
                }}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Issue Date</Label>
              <Input
                type="date"
                value={cert.issueDate}
                onChange={(e) => {
                  const newCertifications = [...certifications];
                  newCertifications[index].issueDate = e.target.value;
                  setCertifications(newCertifications);
                }}
              />
            </div>
            <div>
              <Label>Expiry Date</Label>
              <Input
                type="date"
                value={cert.expiryDate}
                onChange={(e) => {
                  const newCertifications = [...certifications];
                  newCertifications[index].expiryDate = e.target.value;
                  setCertifications(newCertifications);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Credential ID</Label>
              <Input
                value={cert.credentialId}
                onChange={(e) => {
                  const newCertifications = [...certifications];
                  newCertifications[index].credentialId = e.target.value;
                  setCertifications(newCertifications);
                }}
              />
            </div>
            <div>
              <Label>Credential URL</Label>
              <Input
                type="url"
                value={cert.url}
                onChange={(e) => {
                  const newCertifications = [...certifications];
                  newCertifications[index].url = e.target.value;
                  setCertifications(newCertifications);
                }}
              />
            </div>
          </div>
        </Card>
      ))}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={addCertification}>
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
        <Button type="submit">Save & Continue</Button>
      </div>
    </form>
  );
};