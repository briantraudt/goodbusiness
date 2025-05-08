
import React from 'react';
import BusinessContactForm from './BusinessContactForm';

interface PrivateInvitationScreenProps {
  score: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
}

const PrivateInvitationScreen: React.FC<PrivateInvitationScreenProps> = ({
  score,
  contactSubmitted,
  setContactSubmitted
}) => {
  return (
    <>
      <div className="bg-gb-dark text-white py-16">
        <div className="container-custom">
          <div className="flex items-center gap-4">
            <div className="bg-gb-blue text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
              2
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Private Invitation
              </h1>
              <p className="text-xl text-white/80">
                Tell us more about your Go<span className="text-gb-green">o</span>d Business idea.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container-custom max-w-3xl mx-auto py-16">
        <BusinessContactForm 
          score={score}
          contactSubmitted={contactSubmitted}
          setContactSubmitted={setContactSubmitted}
        />
      </div>
    </>
  );
};

export default PrivateInvitationScreen;
