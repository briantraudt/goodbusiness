
import React, { useState, useEffect } from 'react';
import { ArrowRight, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

const Hero = () => {
  const isMobile = useIsMobile();
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-gray-900">
      {/* Video Background with loading state */}
      <div className="absolute inset-0 w-full h-full">
        {!videoLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse"></div>
        )}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedData={() => setVideoLoaded(true)}
          onError={(e) => {
            console.error('Video failed to load:', e);
            const target = e.target as HTMLVideoElement;
            target.style.display = 'none';
          }}
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-light-trails-on-a-highway-at-night-10661-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Dark overlay - increased opacity from 60% to 75% */}
        <div className="absolute inset-0 bg-black/75"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom section-padding flex flex-col h-[80vh] relative z-10">
        {/* Adjusted div to push content down more */}
        <div className="flex-grow-0 pt-32"></div>
        
        <div className="text-center mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white max-w-6xl mx-auto">
            Idea to APP in 7 Days
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
            Rapid prototyping and development services that turn your vision into reality 
            without the long wait.
            <br />
            <br />
            <span className="text-xl md:text-2xl font-bold text-white">Build better software, faster.</span>
            <br />
          </p>
        </div>
        
        <div className="mb-16 mt-auto flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-6 px-8 rounded-md text-xl flex items-center justify-center">
            <Link to="/contact">
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
