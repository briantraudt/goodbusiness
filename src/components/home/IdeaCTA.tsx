
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';
import ScrollReveal from '@/components/common/ScrollReveal';

const IdeaCTA = () => {
  return (
    <section className="bg-gb-dark text-white py-16 md:py-20 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{ backgroundImage: "url('/lovable-uploads/93e6cb06-ef46-496a-9bc6-57e655a4dc18.png')" }}
      />
      
      <div className="container-custom relative z-10 text-center">
        <ScrollReveal direction="up">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4">
              Let's Build Together
            </h2>
            
            <p className="text-lg text-gray-300 mb-8">
              Ready to bring your vision to life?
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
