
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import Pillars from '@/components/home/Pillars';
import Focus from '@/components/home/Focus';
import CTA from '@/components/home/CTA';

const Index = () => {
  return (
    <PageLayout 
      title="Good Business | Building Businesses That Transform Lives"
      description="Good Business is a venture studio and consulting firm helping leaders scale, fix what's broken, and build companies that last."
      canonicalUrl="https://goodbusiness.com"
    >
      <Hero />
      <Intro />
      <Pillars />
      <Focus />
      <CTA />
    </PageLayout>
  );
};

export default Index;
