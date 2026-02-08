import { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import HowWeWork from '@/components/home/HowWeWork';
import ContactSection from '@/components/home/ContactSection';
import heroVideo from '@/assets/home-hero-bg.mp4';

const Index = () => {
  const [videoReady, setVideoReady] = useState(false);

  return (
    <PageLayout>
      {/* Fixed video background — covers entire page, fades out in lower half */}
      <div className="fixed inset-0 z-0" style={{ backgroundColor: 'hsl(220, 15%, 8%)' }}>
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            videoReady ? 'opacity-[0.15]' : 'opacity-0'
          }`}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
        />
        {/* Fade video out toward bottom half */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, transparent 35%, hsl(220, 15%, 8%) 65%)',
          }}
        />
      </div>

      {/* Page content sits above the fixed video */}
      <div className="relative z-10">
        <Hero />
        <HowWeWork />
        <ContactSection />
      </div>
    </PageLayout>
  );
};

export default Index;
