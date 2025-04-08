
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import VentureHero from '@/components/ventures/VentureHero';
import VentureList from '@/components/ventures/VentureList';
import InvestmentPhilosophy from '@/components/ventures/InvestmentPhilosophy';
import VenturesCTA from '@/components/ventures/VenturesCTA';

const Ventures = () => {
  return (
    <PageLayout>
      <VentureHero />
      <VentureList />
      <InvestmentPhilosophy />
      <VenturesCTA />
    </PageLayout>
  );
};

export default Ventures;
