
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ContactHero from '@/components/contact/ContactHero';
import ContactContent from '@/components/contact/ContactContent';

const Contact = () => {
  return (
    <PageLayout>
      <ContactHero />
      <ContactContent />
    </PageLayout>
  );
};

export default Contact;
