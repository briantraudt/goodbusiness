
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import Pillars from '@/components/home/Pillars';
import Focus from '@/components/home/Focus';
import CTA from '@/components/home/CTA';

const Index = () => {
  useEffect(() => {
    // Check if the image exists
    const img = new Image();
    img.src = '/lovable-uploads/33b66504-e667-4aa8-93ec-58dfdce579da.png';
    img.onload = () => console.log('Image loaded successfully');
    img.onerror = () => console.error('Image failed to load');
  }, []);

  return (
    <PageLayout>
      <Hero />
      <Intro />
      <Pillars />
      <Focus />
      <CTA />
    </PageLayout>
  );
};

export default Index;
