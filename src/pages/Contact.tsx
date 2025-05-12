
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
      <div className="bg-gb-dark text-white">
        <div className="container-custom py-15">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Work With Us
            </h1>
            <p className="text-xl text-white/80">
              Tell us about your Go<span className="text-gb-green">o</span>d Business idea.
            </p>
          </div>
        </div>
      </div>
      <div className="container-custom mx-auto py-16">
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
