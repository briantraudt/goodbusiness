
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import BusinessContactForm from '@/components/home/BusinessContactForm';

const Contact = () => {
  // Using the same state pattern as in the BusinessEvaluator component
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // Pass a default high score of 80 to trigger form display
  const defaultScore = 80;

  return (
    <PageLayout>
      <div className="bg-gb-dark text-white py-16">
        <div className="container-custom">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Contact Us
              </h1>
              <p className="text-xl text-white/80">
                Tell us about your Go<span className="text-gb-green">o</span>d Business idea.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container-custom max-w-3xl mx-auto py-16">
        <BusinessContactForm 
          score={defaultScore}
          contactSubmitted={contactSubmitted}
          setContactSubmitted={setContactSubmitted}
          showScoreHeader={false}
        />
      </div>
    </PageLayout>
  );
};

export default Contact;
