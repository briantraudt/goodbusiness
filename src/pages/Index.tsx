
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import Intro from '@/components/home/Intro';
import Process from '@/components/home/Process';
import Benefits from '@/components/home/Benefits';
import IdeaCTA from '@/components/home/IdeaCTA';
import { Link } from 'react-router-dom';

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
      <Hero />
      <Intro />
      <Process />
      <Benefits />
      <div className="bg-gray-50 py-10 text-center">
        <h2 className="text-2xl font-bold text-gb-dark mb-4">Client Portal Access</h2>
        <p className="text-gray-600 mb-4">Existing clients can access their project dashboards.</p>
        <Link 
          to="/client"
          className="inline-block bg-gb-blue hover:bg-gb-blue/90 text-white rounded-lg px-6 py-3 font-medium"
        >
          Client Login
        </Link>
      </div>
      <IdeaCTA />
    </PageLayout>
  );
};

export default Index;
