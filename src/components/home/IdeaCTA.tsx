
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const IdeaCTA = () => {
  return (
    <section className="bg-gb-dark text-white py-16 md:py-20 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('/lovable-uploads/93e6cb06-ef46-496a-9bc6-57e655a4dc18.png')" }}
      />
      
      <div className="container-custom relative z-10 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Got an AI Vision?
          </h2>
          
          <div className="space-y-3 mb-8">
            <p className="text-lg md:text-xl text-gray-300">
              Most people never bring their AI concepts to life.
            </p>
            
            <p className="text-xl md:text-2xl font-semibold">
              You will.
            </p>
            
            <p className="text-lg text-gray-300">
              Let's turn it into intelligent software.
            </p>
          </div>
          
          <div className="flex justify-center">
            <ScrollToTopLink to="/evaluator">
              <Button size="lg" className="bg-gb-green hover:bg-gb-green/90 px-6 py-6 text-base">
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
