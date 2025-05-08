
import React from 'react';
import BusinessContactFormManager from './business-form/BusinessContactFormManager';

interface BusinessContactFormProps {
  score: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
}

const BusinessContactForm: React.FC<BusinessContactFormProps> = ({
  score,
  contactSubmitted,
  setContactSubmitted
}) => {
  // Debug logging to help track props
  console.log('BusinessContactForm props:', { 
    score, 
    shouldDisplay: score !== null && score >= 85,
    contactSubmitted
  });
  
  // Now we delegate all the form management to BusinessContactFormManager
  return (
    <BusinessContactFormManager
      score={score}
      contactSubmitted={contactSubmitted}
      setContactSubmitted={setContactSubmitted}
    />
  );
};

export default BusinessContactForm;
