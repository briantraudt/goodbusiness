
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import Pillars from '@/components/home/Pillars';
import Focus from '@/components/home/Focus';
import CTA from '@/components/home/CTA';
import Benefits from '@/components/home/Benefits';

// Import content from About page
import { AboutHero, AboutMission, AboutValues, AboutTeam } from '@/pages/About';

// Import content from Consulting page
import ConsultingHero from '@/components/consulting/ConsultingHero';
import ConsultingServices from '@/components/consulting/ConsultingServices';
import ConsultingProcess from '@/components/consulting/ConsultingProcess';
import ConsultingClients from '@/components/consulting/ConsultingClients';
import ConsultingCTA from '@/components/consulting/ConsultingCTA';

// Import content from Ventures page
import VentureHero from '@/components/ventures/VentureHero';
import VentureList from '@/components/ventures/VentureList';
import InvestmentPhilosophy from '@/components/ventures/InvestmentPhilosophy';
import VenturesCTA from '@/components/ventures/VenturesCTA';

// Import Contact page content
import { ContactForm, ContactInfo } from '@/pages/Contact';

const Index = () => {
  // Preload critical images when the component mounts
  useEffect(() => {
    // Array of image URLs to preload
    const imagesToPreload = [
      "/lovable-uploads/b0ce17ae-914d-4c0a-807f-5fb035cd1a72.png", // Hero background
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
      {/* Home Section */}
      <section id="home">
        <Hero />
        <Intro />
        <Focus />
        <Benefits />
      </section>

      {/* About Section */}
      <section id="about" className="scroll-mt-20">
        <AboutHero />
        <AboutMission />
        <AboutValues />
        <AboutTeam />
        <Pillars />
      </section>

      {/* Services Section */}
      <section id="services" className="scroll-mt-20">
        <ConsultingHero />
        <ConsultingServices />
        <ConsultingProcess />
        <ConsultingClients />
        <ConsultingCTA />
      </section>

      {/* Projects Section */}
      <section id="projects" className="scroll-mt-20">
        <VentureHero />
        <VentureList />
        <InvestmentPhilosophy />
        <VenturesCTA />
      </section>

      {/* Contact Section */}
      <section id="contact" className="scroll-mt-20">
        <ContactInfo />
        <ContactForm />
      </section>

      {/* Final CTA */}
      <CTA />
    </PageLayout>
  );
};

export default Index;
