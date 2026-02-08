import { useState, useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import Hero from '@/components/home/Hero';
import HowWeWork from '@/components/home/HowWeWork';
import ContactSection from '@/components/home/ContactSection';
import heroVideo from '@/assets/home-hero-bg.mp4';

const Index = () => {
  const [videoReady, setVideoReady] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.65;
      setPastHero(window.scrollY > threshold);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <PageLayout>
      {/* Fixed video background — covers entire page */}
      <div className="fixed inset-0 z-0" style={{ backgroundColor: 'hsl(220, 15%, 8%)' }}>
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out`}
          style={{ opacity: videoReady ? (pastHero ? 0.04 : 0.15) : 0 }}
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

        {/* Breathing room + subtle gradient divider */}
        <div className="py-6 md:py-8 flex justify-center">
          <div
            className="h-px w-full max-w-xl"
            style={{
              background: 'linear-gradient(to right, transparent, hsl(210 55% 55% / 0.25), transparent)',
            }}
          />
        </div>

        <HowWeWork />
        <ContactSection />
      </div>
    </PageLayout>
  );
};

export default Index;
