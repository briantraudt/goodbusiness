
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
  // Only show the score and intro text if score is high enough
  const shouldDisplayForm = score !== null && score >= 75;
  
  if (!shouldDisplayForm) {
    return null;
  }
  
  return (
    <div id="contact-form-section">
      {/* Score display outside and above everything */}
      <div className="text-center mb-8">
        <p className="text-white text-4xl font-bold mb-6">
          Good Idea Score: {score}/100
        </p>
        
        <PrivateInvitationHeader score={score} />
        
        {/* Descriptive text below score and above the form */}
        <p className="text-white/80 text-lg mb-8 max-w-3xl mx-auto">
          Based on the information you have provided, we think you have a really good idea and invite you to tell us more on the form below and we will get back to you ASAP.
        </p>
      </div>
      
      {/* Contact form manager to handle the form display */}
      <BusinessContactFormManager
        score={score}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />
    </div>
  );
};

// Add the missing import
import PrivateInvitationHeader from './PrivateInvitationHeader';

export default BusinessContactForm;
