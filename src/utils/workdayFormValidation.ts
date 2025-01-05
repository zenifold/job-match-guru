export interface ValidationError {
  field: string;
  message: string;
}

export function validateWorkdayForm(formData: any, currentStep: number): ValidationError[] {
  const errors: ValidationError[] = [];

  switch (currentStep) {
    case 1: // My Information
      if (!formData.source?.prompt) {
        errors.push({ field: 'source', message: 'Please select how you heard about us' });
      }
      if (!formData.personalInfo?.firstName) {
        errors.push({ field: 'firstName', message: 'First name is required' });
      }
      if (!formData.personalInfo?.lastName) {
        errors.push({ field: 'lastName', message: 'Last name is required' });
      }
      if (!formData.address?.addressLine1) {
        errors.push({ field: 'addressLine1', message: 'Address is required' });
      }
      if (!formData.address?.city) {
        errors.push({ field: 'city', message: 'City is required' });
      }
      if (!formData.address?.state) {
        errors.push({ field: 'state', message: 'State is required' });
      }
      if (!formData.address?.postalCode) {
        errors.push({ field: 'postalCode', message: 'Postal code is required' });
      }
      break;

    case 2: // My Experience
      if (!formData.experience || formData.experience.length === 0) {
        errors.push({ field: 'experience', message: 'At least one work experience entry is required' });
      }
      break;

    case 3: // Application Questions
      // Add validation for required application questions
      break;

    case 4: // Voluntary Disclosures
      if (!formData.voluntaryDisclosures?.termsAccepted) {
        errors.push({ field: 'termsAccepted', message: 'You must accept the terms and conditions' });
      }
      break;
  }

  return errors;
}