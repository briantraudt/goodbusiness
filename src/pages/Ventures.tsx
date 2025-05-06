
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import VentureHero from '@/components/ventures/VentureHero';
import VentureList from '@/components/ventures/VentureList';
import VenturePillars from '@/components/ventures/VenturePillars';
import VenturesCTA from '@/components/ventures/VenturesCTA';

const Ventures = () => {
  return (
    <PageLayout>
      <VentureHero />
      <VentureList />
      <VenturePillars />
      <VenturesCTA />
    </PageLayout>
  );
};

export default Ventures;
