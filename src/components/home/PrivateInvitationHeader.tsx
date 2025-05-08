
import React from 'react';

interface PrivateInvitationHeaderProps {
  score: number;
}

const PrivateInvitationHeader: React.FC<PrivateInvitationHeaderProps> = ({ score }) => {
  return (
    <div className="text-center mb-6">
      <div className="inline-block bg-gb-blue text-white text-sm font-bold px-3 py-1 rounded-full mb-2">
        Private Invitation
      </div>
      <h3 className="text-2xl font-bold mb-2 text-white">
        Go<span className="text-gb-green">o</span>d Work!
      </h3>
      <p className="text-white/80">
        Based on the information you have provided, we think you have a really good idea and invite you to tell us more on the form below and we will get back to you ASAP.
      </p>
    </div>
  );
};

export default PrivateInvitationHeader;
