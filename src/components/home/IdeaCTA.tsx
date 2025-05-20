
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const IdeaCTA = () => {
  return (
    <section className="bg-gb-dark text-white py-12 md:py-16 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('/lovable-uploads/93e6cb06-ef46-496a-9bc6-57e655a4dc18.png')" }}
      />
      
      <div className="container-custom relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
            Got a Great Idea?
          </h2>
          
          <p className="text-lg md:text-xl mb-1 text-gray-300">
            Most people never act on theirs.
          </p>
          
          <p className="text-xl md:text-2xl font-semibold mb-3">
            You will.
          </p>
          
          <p className="text-lg mb-6 md:mb-8 text-gray-300">
            Let's turn it into something real.
          </p>
          
          <div className="flex justify-center">
            <ScrollToTopLink to="/evaluator">
              <Button size="lg" className="bg-gb-green hover:bg-gb-green/90">
                Start Building <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </ScrollToTopLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdeaCTA;
