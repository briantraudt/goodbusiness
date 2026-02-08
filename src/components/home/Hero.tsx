import React, { useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import heroVideo from '@/assets/home-hero-bg.mp4';

const FALLBACK_BG = 'hsl(220, 15%, 8%)';

const Hero = () => {
  const isMobile = useIsMobile();
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative overflow-hidden min-h-[69vh] md:min-h-[75vh] flex items-center"
      style={{ backgroundColor: FALLBACK_BG }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          src={heroVideo}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoReady(true)}
        />

        {/* Gradient overlay for text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: isMobile
              ? 'linear-gradient(to bottom, hsla(0, 0%, 0%, 0.50) 0%, hsla(0, 0%, 0%, 0.30) 50%, hsla(0, 0%, 0%, 0.55) 100%)'
              : 'linear-gradient(to right, hsla(0, 0%, 0%, 0.10) 0%, hsla(0, 0%, 0%, 0.20) 40%, hsla(0, 0%, 0%, 0.50) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="container-custom py-8 md:py-12 flex flex-col items-center md:items-end justify-center h-full relative z-10">
        <div className="text-center md:text-right md:max-w-2xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight">
            Build Something People<br />
            <span style={{ color: 'hsl(210, 55%, 55%)' }}>Actually Use.</span>
          </h1>
          <p className="mt-5 md:mt-7 text-base md:text-lg text-white/80 max-w-2xl leading-relaxed font-light">
            Good Business works alongside founders to clarify ideas, pressure-test assumptions, and build real products that earn users — and revenue.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 md:mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
          <Button
            onClick={() => scrollTo('contact')}
            className="text-white font-semibold py-4 px-6 rounded-md text-lg flex items-center justify-center group"
            style={{ backgroundColor: 'hsl(210, 55%, 55%)' }}
          >
            Talk Through Your Idea
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          {!isMobile && (
            <Button
              onClick={() => scrollTo('how-we-help')}
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:bg-white hover:text-gb-dark hover:border-white font-semibold py-4 px-6 rounded-md text-lg"
            >
              How We Help
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
