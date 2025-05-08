
import React from 'react';
import BusinessContactFormManager from './business-form/BusinessContactFormManager';
import PrivateInvitationHeader from './PrivateInvitationHeader';

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
        {/* Private Invitation pill button at the top */}
        <div className="inline-block bg-gb-blue text-white font-bold px-8 py-3 rounded-full mb-6 text-xl">
          Private Invitation
        </div>
        
        <p className="text-gb-dark text-4xl font-bold mb-6">
          Good Idea Score: {score}/100
        </p>
        
        <PrivateInvitationHeader score={score} />
        
        {/* Descriptive text below score and above the form */}
        <p className="text-gb-dark text-lg mb-8 max-w-3xl mx-auto font-medium">
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

export default BusinessContactForm;
