
import React from 'react';
import PrivateInvitationScreen from '../PrivateInvitationScreen';
import BusinessContactFormManager from '../business-form/BusinessContactFormManager';

interface PrivateInvitationViewProps {
  score: number;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
}

/**
 * View component for high-scoring private invitations
 */
const PrivateInvitationView: React.FC<PrivateInvitationViewProps> = ({
  score,
  contactSubmitted,
  setContactSubmitted
}) => {
  return (
    <>
      <PrivateInvitationScreen 
        score={score}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />
      <BusinessContactFormManager 
        score={score}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />
    </>
  );
};

export default PrivateInvitationView;
