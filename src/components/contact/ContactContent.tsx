
import React from 'react';
import ContactBenefits from './ContactBenefits';
import ContactForm from './ContactForm';

const ContactContent = () => {
  return (
    <section id="contact" className="bg-white">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold text-gb-dark mb-6">Submit Your Idea</h3>
            <p className="text-lg text-gb-dark/80 mb-8">
              Tell us about your software idea, and we'll get back to you within 24 hours with a rapid prototyping plan.
            </p>
            
            <ContactBenefits />
          </div>
          
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactContent;
