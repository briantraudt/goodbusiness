import { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import SolutionSection from '@/components/home/SolutionSection';
import Pillars from '@/components/home/Pillars';
import ServicesSection from '@/components/home/ServicesSection';
import ClientsSection from '@/components/home/ClientsSection';
import Process from '@/components/home/Process';
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
      <SolutionSection />
      <Pillars />
      <ServicesSection />
      <ClientsSection />
      <Process />
      <ContactSection />
    </PageLayout>
  );
};

export default Index;
