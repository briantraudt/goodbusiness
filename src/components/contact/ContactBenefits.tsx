
import React from 'react';
import { CheckCircle } from 'lucide-react';

const ContactBenefits = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start">
        <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-xl font-medium text-gb-dark mb-2">MVP Development</h4>
          <p className="text-gb-dark/70">
            Get a working minimum viable product in days to validate your concept with real users.
          </p>
        </div>
      </div>
      
      <div className="flex items-start">
        <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-xl font-medium text-gb-dark mb-2">Rapid Iteration</h4>
          <p className="text-gb-dark/70">
            Quickly test, refine, and improve your software based on real feedback and data.
          </p>
        </div>
      </div>
      
      <div className="flex items-start">
        <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-xl font-medium text-gb-dark mb-2">Concept to Launch</h4>
          <p className="text-gb-dark/70">
            Transform your idea into a market-ready product with our end-to-end development process.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactBenefits;
