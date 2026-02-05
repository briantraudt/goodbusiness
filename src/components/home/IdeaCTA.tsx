import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';
import ScrollReveal from '@/components/common/ScrollReveal';

const IdeaCTA = () => {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gb-dark mb-6 leading-tight">
              Ready to Build Outcomes That Matter?
            </h2>
            
            <p className="text-lg md:text-xl text-gb-dark/70 mb-10 max-w-2xl mx-auto">
              Let's start with what success looks like for your business.
            </p>
            
            <ScrollToTopLink to="/contact">
              <Button size="lg" className="bg-gb-green hover:bg-gb-green/90 text-white px-8 py-6 text-lg font-semibold group">
                Start With the Outcome
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </ScrollToTopLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default IdeaCTA;
