
import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const CTA = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = "/lovable-uploads/93e6cb06-ef46-496a-9bc6-57e655a4dc18.png";
    img.onload = () => setImageLoaded(true);
    
    return () => {
      img.onload = null;
    };
  }, []);
  
  return (
    <section className="relative text-white bg-gray-900 mt-32">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {!imageLoaded && (
          <Skeleton className="w-full h-full bg-gray-800" />
        )}
        {/* Using the preloaded image */}
        <img 
          src="/lovable-uploads/93e6cb06-ef46-496a-9bc6-57e655a4dc18.png"
          alt="Background" 
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ease-in-out ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onError={(e) => {
            console.error('Image failed to load:', e);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Dark overlay with reduced opacity */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="container-custom py-28 md:py-36 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to build something meaningful?</h2>
          <p className="text-xl text-white/80 mb-8">
            Whether you're looking to scale your business, fix what's broken, or launch something new, we're here to help.
          </p>
          <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-6 px-8 rounded-md text-lg group">
            <Link to="/contact">
              Start the Conversation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
