
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
    img.src = "/lovable-uploads/2ed84956-a4d9-48dc-84b7-855717aba568.png";
    img.onload = () => setImageLoaded(true);
  }, []);
  
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center bg-gray-900">
      {/* Background Image with loading state */}
      <div className="absolute inset-0 w-full h-full">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
        <img 
          src="/lovable-uploads/2ed84956-a4d9-48dc-84b7-855717aba568.png"
          alt="Person writing on whiteboard with sticky notes" 
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
      <div className="container-custom py-8 md:py-10 flex flex-col items-center justify-center h-full relative z-10">
        <div className="text-center mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-6xl mx-auto">
            Idea to Job in 7 Days
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-white/80 max-w-3xl mx-auto">
            Rapid prototyping and software development that turns your vision into a reality.
          </p>
        </div>
        
        {/* Button - removed the second button */}
        <div className={`${isMobile ? 'mt-6' : 'mt-4'} flex justify-center`}>
          <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-4 px-6 rounded-md text-lg flex items-center justify-center">
            <Link to="/contact">
              Let's Build Something
              <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
