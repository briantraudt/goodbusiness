
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
        <p className="text-gb-dark text-4xl font-bold mb-6">
          Good Idea Score: {score}/100
        </p>
        
        <PrivateInvitationHeader score={score} />
        
        {/* Descriptive text below score and above the form */}
        <p className="text-gb-dark text-lg mb-8 max-w-3xl mx-auto font-medium">
          Great news! Based on what you've shared, this looks like a strong idea. We'd love to learn more—please fill out the form below, and someone from our team will be in touch shortly.
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
