
import React, { useState, useEffect } from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

const Hero = () => {
  const isMobile = useIsMobile();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Preload the hero image
  useEffect(() => {
    const img = new Image();
    img.src = "https://images.unsplash.com/photo-1498050108023-c5249f4df085";
    img.onload = () => setImageLoaded(true);
  }, []);
  
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-gray-900">
      {/* Background Image with loading state */}
      <div className="absolute inset-0 w-full h-full">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
          alt="Developer working on code with laptop" 
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => {
            console.error('Image failed to load:', e);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Dark overlay - increased opacity from 60% to 75% */}
        <div className="absolute inset-0 bg-black/75"></div>
      </div>
      
      {/* Content - Modified to center content vertically */}
      <div className="container-custom section-padding flex flex-col items-center justify-center h-full relative z-10">
        <div className="text-center mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white max-w-6xl mx-auto">
            Idea to APP in 7 Days
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            Rapid prototyping and development that turns your vision into reality.
          </p>
          {/* Second tagline removed, spacing maintained */}
          <div className="mt-4"></div>
        </div>
        
        {/* Buttons - Added conditional margin top for mobile */}
        <div className={`${isMobile ? 'mt-24' : 'mt-10'} flex flex-col sm:flex-row gap-4 justify-center`}>
          <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-6 px-8 rounded-md text-xl flex items-center justify-center">
            <Link to="/evaluator">
              Start Your Project
              <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white py-6 px-8 text-xl font-semibold bg-black/40 flex items-center justify-center">
            <Link to="/ventures">
              See Our Work
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
