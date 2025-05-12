
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import CTA from '@/components/home/CTA';
import Benefits from '@/components/home/Benefits';
import Intro from '@/components/home/Intro';
import ConsultingProcess from '@/components/consulting/ConsultingProcess';

const Index = () => {
  // Preload critical images when the component mounts
  useEffect(() => {
    // Array of image URLs to preload
    const imagesToPreload = [
      "/lovable-uploads/2ed84956-a4d9-48dc-84b7-855717aba568.png", // Hero background
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
      <Intro />
      <ConsultingProcess />
      <Benefits />
      <CTA />
    </PageLayout>
  );
};

export default Index;
