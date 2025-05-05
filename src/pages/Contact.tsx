
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ContactHero from '@/components/contact/ContactHero';
import ContactContent from '@/components/contact/ContactContent';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <ContactHero />
      <ContactContent />
    </PageLayout>
  );
};

export default Contact;
