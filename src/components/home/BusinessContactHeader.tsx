
import React from 'react';

interface BusinessContactHeaderProps {
  score: number;
}

const BusinessContactHeader: React.FC<BusinessContactHeaderProps> = ({ score }) => {
  return (
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold mb-2">
        Go<span className="text-gb-green">o</span>d Work!
      </h3>
      <p className="text-gray-600">
        Based on the information you have provided, we think you have a really good idea and invite you to tell us more on the form below and we will get back to you ASAP.
      </p>
      <p className="mt-4 text-green-700 font-semibold">
        Your idea scored {score}/100, which shows great promise!
      </p>
    </div>
  );
};

export default BusinessContactHeader;
