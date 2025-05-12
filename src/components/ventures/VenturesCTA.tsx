
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const VenturesCTA = () => {
  return (
    <section className="bg-gb-dark text-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Building or investing in a venture?</h2>
          <p className="text-xl text-white/80 mb-8">
            We're always interested in connecting with mission-aligned founders and investors.
          </p>
          <Button asChild className="btn-primary text-lg group">
            <ScrollToTopLink to="/evaluator">
              Start a Conversation
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </ScrollToTopLink>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VenturesCTA;
