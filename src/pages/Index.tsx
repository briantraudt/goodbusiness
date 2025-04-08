
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import Pillars from '@/components/home/Pillars';
import Focus from '@/components/home/Focus';
import CTA from '@/components/home/CTA';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure all components have time to load properly
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[80vh] bg-gray-900">
          <Skeleton className="w-full h-[80vh] bg-gray-800" />
        </div>
        <div className="container-custom section-padding">
          <Skeleton className="w-full h-72 mb-16 bg-gray-100" />
          <Skeleton className="w-full h-96 bg-gray-100" />
        </div>
      </PageLayout>
    );
  }

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
