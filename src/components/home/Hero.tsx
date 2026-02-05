
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Hero = () => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Preload the hero image
  useEffect(() => {
    const img = new Image();
    img.src = "/lovable-uploads/2ed84956-a4d9-48dc-84b7-855717aba568.png";
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
          src="/lovable-uploads/2ed84956-a4d9-48dc-84b7-855717aba568.png"
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
            Build the Software You Actually Need.
          </h1>
          <p className="mt-3 md:mt-6 text-base md:text-xl text-white/90 max-w-3xl mx-auto">
            Stop adapting your business to someone else's product roadmap. We build AI-native software tailored to how you work—and you own it forever.
          </p>
        </div>
        
        {/* Buttons */}
        <div className="mt-6 md:mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-4 px-6 rounded-md text-lg flex items-center justify-center">
            <Link to="/contact">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          {!isMobile && (
            <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white hover:text-gb-dark hover:border-white font-semibold py-4 px-6 rounded-md text-lg">
              <a href="#how-it-works">
                See What's Possible
              </a>
            </Button>
          )}
        </div>
        
        {/* Micro-copy */}
        <p className="mt-4 text-sm text-white/60">
          From idea to deployment in weeks, not years.
        </p>
      </div>
    </section>
  );
};

export default Hero;
