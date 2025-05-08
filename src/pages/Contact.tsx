
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ContactContent from '@/components/contact/ContactContent';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <ContactContent />
    </PageLayout>
  );
};

export default Contact;
