
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-32809-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gb-dark/70"></div>
      </div>
      
      {/* Content */}
      <div className="container-custom section-padding flex flex-col items-center text-center relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl animate-fade-in">
          We Build Businesses That Transform Lives
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mt-6 max-w-2xl animate-fade-in">
          Good Business is a venture studio and consulting firm helping leaders scale, fix what's broken, and build companies that last.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in">
          <Button asChild className="btn-primary text-lg group">
            <Link to="/contact">
              Work With Us
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="text-lg border-white text-white hover:bg-white/10">
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
