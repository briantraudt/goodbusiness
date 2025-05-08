
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
    </div>
  );
};

export default PrivateInvitationHeader;
