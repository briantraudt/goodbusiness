import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const IdeaCTA = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gb-dark mb-6 leading-tight">
              Not Sure If Your Idea Has Legs?
            </h2>
            
            <p className="text-lg md:text-xl text-gb-dark/70 mb-10 max-w-2xl mx-auto">
              That's exactly the right time to talk. No pitch. No pressure. 
              Just a thoughtful conversation about what you're building and whether it's worth building.
            </p>
            
            <Button 
              onClick={() => scrollTo('contact')}
              size="lg" 
              className="bg-gb-green hover:bg-gb-green/90 text-white px-8 py-6 text-lg font-semibold group"
            >
              Let's Figure This Out Together
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default IdeaCTA;
