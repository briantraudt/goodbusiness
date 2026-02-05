import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';
import consultingHeroBg from '@/assets/consulting-hero-bg.jpg';

const ConsultingHero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = consultingHeroBg;
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[50vh] md:min-h-[60vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gb-dark animate-pulse"></div>
        )}
        <img 
          src={consultingHeroBg}
          alt="Enterprise software development" 
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/75"></div>
      </div>
      
      <div className="container-custom py-16 md:py-24 relative z-10">
        <div className="max-w-3xl text-white">
          <span className="inline-block text-gb-green font-semibold text-sm uppercase tracking-wider mb-4">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            From Idea to Owned Software in Weeks
          </h1>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            We don't just consult — we build. Our team helps you design, develop, and deploy 
            custom software that replaces expensive SaaS and fits how your business actually works.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-6 px-8 text-lg">
              <ScrollToTopLink to="/contact">
                Start a Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </ScrollToTopLink>
            </Button>
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-gb-dark font-semibold py-6 px-8 text-lg">
              <a href="#services">
                View Services
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingHero;
