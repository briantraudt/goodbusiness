import { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import SolutionSection from '@/components/home/SolutionSection';
import Pillars from '@/components/home/Pillars';
import Process from '@/components/home/Process';
import IdeaCTA from '@/components/home/IdeaCTA';
import homeHeroBg from '@/assets/home-hero-bg.jpg';

const Index = () => {
  // Preload critical images when the component mounts
  useEffect(() => {
    // Array of image URLs to preload
    const imagesToPreload = [
      homeHeroBg, // Hero background
      "/lovable-uploads/93e6cb06-ef46-496a-9bc6-57e655a4dc18.png"  // CTA background
    ];
    
    // Create image objects to trigger browser caching
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
      <Process />
      <IdeaCTA />
    </PageLayout>
  );
};

export default Index;
