
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {/* Using the newly uploaded image */}
        <img 
          src="/lovable-uploads/b0ce17ae-914d-4c0a-807f-5fb035cd1a72.png"
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            console.error('Image failed to load:', e);
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom section-padding flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl animate-fade-in">
          We Build Things That Transform Lives
        </h1>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-6 px-8 rounded-md text-lg group">
            <Link to="/contact">
              Work With Us
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 hover:text-white py-6 px-8 text-lg font-semibold bg-black/40">
            <Link to="/ventures">
              Our Ventures
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
