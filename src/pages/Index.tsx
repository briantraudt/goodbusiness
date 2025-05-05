
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import Pillars from '@/components/home/Pillars';
import Focus from '@/components/home/Focus';
import CTA from '@/components/home/CTA';
import Benefits from '@/components/home/Benefits';

const Index = () => {
  // Preload critical assets when the component mounts
  useEffect(() => {
    // Array of assets to preload
    const assetsToPreload = [
      "/lovable-uploads/93e6cb06-ef46-496a-9bc6-57e655a4dc18.png",  // CTA background
      "/video-background.mp4"  // Hero video
    ];
    
    // Create objects to trigger browser caching
    assetsToPreload.forEach(src => {
      if (src.endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = src;
        video.preload = 'auto';
        video.style.display = 'none';
        document.body.appendChild(video);
        // Remove after preload attempt
        setTimeout(() => {
          document.body.removeChild(video);
        }, 5000);
      } else {
        const img = new Image();
        img.src = src;
      }
    });
  }, []);

  return (
    <PageLayout>
      <Hero />
      <Intro />
      <Focus />
      <Benefits />
      <Pillars />
      <CTA />
    </PageLayout>
  );
};

export default Index;
