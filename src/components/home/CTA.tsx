
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTA = () => {
  return (
    <section className="relative text-white bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/lovable-uploads/33b66504-e667-4aa8-93ec-58dfdce579da.png')",
            backgroundColor: "#172B4D" // Fallback color if image fails to load
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      <div className="container-custom section-padding relative z-10">
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
