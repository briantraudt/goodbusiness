import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';

import HowWeWork from '@/components/home/HowWeWork';
import ContactSection from '@/components/home/ContactSection';

const Index = () => {
  return (
    <PageLayout>
      <Hero />
      
      <HowWeWork />
      <ContactSection />
    </PageLayout>
  );
};

export default Index;
