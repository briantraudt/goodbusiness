
import React from 'react';

interface PrivateInvitationHeaderProps {
  score: number;
}

const PrivateInvitationHeader: React.FC<PrivateInvitationHeaderProps> = ({ score }) => {
  return (
    <div className="text-center mb-6">
      {/* Empty component now that all content has been moved */}
    </div>
  );
};

export default PrivateInvitationHeader;
