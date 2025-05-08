
import React from 'react';

interface PrivateInvitationHeaderProps {
  score: number;
}

const PrivateInvitationHeader: React.FC<PrivateInvitationHeaderProps> = ({ score }) => {
  return (
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold mb-2 text-white">
        Go<span className="text-gb-green">o</span>d Work!
      </h3>
    </div>
  );
};

export default PrivateInvitationHeader;
