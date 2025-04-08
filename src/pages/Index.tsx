
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import Pillars from '@/components/home/Pillars';
import Focus from '@/components/home/Focus';
import CTA from '@/components/home/CTA';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [isLoading, setIsLoading] = useState(false); // Changed to false for immediate content display

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
