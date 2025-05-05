
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import ConsultingHero from '@/components/consulting/ConsultingHero';
import ConsultingServices from '@/components/consulting/ConsultingServices';
import ConsultingProcess from '@/components/consulting/ConsultingProcess';
import ConsultingCTA from '@/components/consulting/ConsultingCTA';

const Consulting = () => {
  return (
    <PageLayout>
      <ConsultingHero />
      <ConsultingServices />
      <ConsultingProcess />
      <ConsultingCTA />
    </PageLayout>
  );
};

export default Consulting;
