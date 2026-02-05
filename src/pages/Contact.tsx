
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import BusinessContactForm from '@/components/home/BusinessContactForm';

const Contact = () => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const defaultScore = 80;

  return (
    <PageLayout>
      <div className="bg-gb-dark text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gb-green/10 to-transparent" />
        
        <div className="container-custom py-16 md:py-20 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-gb-green font-semibold text-sm uppercase tracking-wider mb-4">
              Let's Talk
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tell Us What's Not Working
            </h1>
            <p className="text-xl text-white/80">
              Share what you're dealing with — bloated SaaS, manual processes, tools that don't fit. 
              We'll show you what's possible.
            </p>
          </div>
        </div>
      </div>
      <div className="container-custom mx-auto py-12 md:py-16">
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
