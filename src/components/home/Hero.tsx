import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import homeHeroBg from '@/assets/home-hero-bg.jpg';

const Hero = () => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Preload the hero image
  useEffect(() => {
    const img = new Image();
    img.src = homeHeroBg;
    img.onload = () => setImageLoaded(true);
  }, []);
  return (
    <section className="relative overflow-hidden min-h-[60vh] md:min-h-[70vh] flex items-center bg-gray-900">
      {/* Background Image with loading state */}
      <div className="absolute inset-0 w-full h-full">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
        <img 
          src={homeHeroBg}
          alt="Software development and AI solutions" 
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => {
            console.error('Image failed to load:', e);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Dark overlay - increased contrast for mobile legibility */}
        <div className="absolute inset-0 bg-black/80 md:bg-black/75"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom py-6 md:py-10 flex flex-col items-center justify-center h-full relative z-10">
        <div className="text-center mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white max-w-5xl mx-auto leading-tight">
            Stop Renting the Software That Runs Your Business.
          </h1>
          <p className="mt-3 md:mt-6 text-base md:text-xl text-white/90 max-w-2xl mx-auto">
            {isMobile 
              ? "Custom, AI-native software built around how your business actually works."
              : "Good Business helps companies replace bloated SaaS stacks with custom, AI-native software built around how they actually work."
            }
          </p>
        </div>
        
        {/* Buttons */}
        <div className="mt-6 md:mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-4 px-6 rounded-md text-lg flex items-center justify-center">
            <Link to="/contact">
              Start a Conversation
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          {!isMobile && (
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-gb-dark hover:border-white font-semibold py-4 px-6 rounded-md text-lg">
              <a href="#how-it-works">
                See How It Works
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
