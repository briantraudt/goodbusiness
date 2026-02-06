import { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';

import HowWeWork from '@/components/home/HowWeWork';
import ContactSection from '@/components/home/ContactSection';
import homeHeroBg from '@/assets/home-hero-bg.jpg';

const Index = () => {
  useEffect(() => {
    const imagesToPreload = [
      homeHeroBg,
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <PageLayout>
      <Hero />
      
      <HowWeWork />
      <ContactSection />
    </PageLayout>
  );
};

export default Index;
