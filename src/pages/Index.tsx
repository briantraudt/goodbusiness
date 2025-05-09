
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Focus from '@/components/home/Focus';
import CTA from '@/components/home/CTA';
import Benefits from '@/components/home/Benefits';
import Intro from '@/components/home/Intro';
import { Helmet } from 'react-helmet';

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
      <Helmet>
        <title>Business Launchpad | App & Software Development for Austin Startups & Entrepreneurs</title>
        <meta name="description" content="Austin-based Business Launchpad helps entrepreneurs and startup founders take tech ideas to market through rapid prototyping, MVP development, and expert guidance for scaling your software venture." />
        <link rel="canonical" href="https://businesslaunchpad.com/" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Business Launchpad",
              "description": "App and software development for entrepreneurs and startup founders in Austin, Texas.",
              "url": "https://businesslaunchpad.com",
              "sameAs": [
                "https://twitter.com/businesslaunchpad",
                "https://linkedin.com/company/businesslaunchpad"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Austin",
                "addressRegion": "TX",
                "addressCountry": "US"
              },
              "service": {
                "@type": "Service",
                "name": "App Development and MVP Creation",
                "description": "Turning business ideas into market-ready applications in 7 days"
              }
            }
          `}
        </script>
      </Helmet>
      <Hero />
      <Intro />
      <Focus />
      <Benefits />
      <CTA />
    </PageLayout>
  );
};

export default Index;
