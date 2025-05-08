
import React from 'react';

interface BusinessContactHeaderProps {
  score: number;
}

const BusinessContactHeader: React.FC<BusinessContactHeaderProps> = ({ score }) => {
  return (
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold mb-2">Share Your Business Idea</h3>
      <p className="text-gray-600">
        At Good Business, we help launch and grow businesses that transform lives. 
        Tell us a bit about your idea and what support you're looking for.
      </p>
      <p className="mt-4 text-green-700 font-semibold">
        Your idea scored {score}/100, which shows great promise!
      </p>
    </div>
  );
};

export default BusinessContactHeader;
