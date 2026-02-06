import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import homeHeroBg from '@/assets/home-hero-bg.jpg';

const Hero = () => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = homeHeroBg;
    img.onload = () => setImageLoaded(true);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center bg-gray-900">
      {/* Background Image with parallax */}
      <div className="absolute inset-0 w-full h-full">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-fixed transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${homeHeroBg})` }}
        />
        <div className="absolute inset-0 bg-black/80 md:bg-black/75"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom py-8 md:py-12 flex flex-col items-center justify-center h-full relative z-10">
        <div className="text-center mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gb-green/20 text-gb-green px-4 py-1.5 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-gb-green/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gb-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gb-green"></span>
            </span>
            A Thinking Partner for Founders
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white max-w-5xl mx-auto leading-tight">
            Build Something People<br />
            <span className="text-gb-green">Actually Want.</span>
          </h1>
          <p className="mt-4 md:mt-6 text-base md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed">
            {isMobile 
              ? "We help solo founders clarify ideas, pressure-test assumptions, and build real products that earn users and revenue."
              : "Good Business works alongside solo founders to clarify ideas, pressure-test assumptions, and build real products that earn users and revenue."
            }
          </p>
        </div>
        
        {/* Buttons */}
        <div className="mt-8 md:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => scrollTo('contact')}
            className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-4 px-6 rounded-md text-lg flex items-center justify-center group"
          >
            Talk Through Your Idea
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          {!isMobile && (
            <Button 
              onClick={() => scrollTo('how-it-works')}
              variant="outline" 
              className="border-white/30 bg-transparent text-white hover:bg-white hover:text-gb-dark hover:border-white font-semibold py-4 px-6 rounded-md text-lg"
            >
              How It Works
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
