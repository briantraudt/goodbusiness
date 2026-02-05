
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';
import ScrollReveal from '@/components/common/ScrollReveal';

const IdeaCTA = () => {
  return (
    <section className="bg-gb-dark text-white py-16 md:py-24 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('/lovable-uploads/93e6cb06-ef46-496a-9bc6-57e655a4dc18.png')" }}
      />
      
      <div className="container-custom relative z-10 text-center">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Own Your Software?
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-8">
            Let's figure out which systems you should build — and which you should buy.
          </p>
            
            <ScrollToTopLink to="/contact">
              <Button size="lg" className="bg-gb-green hover:bg-gb-green/90 px-8 py-6 text-base">
                Start a Conversation <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </ScrollToTopLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default IdeaCTA;
