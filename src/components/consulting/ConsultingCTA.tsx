
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const ConsultingCTA = () => {
  return (
    <section className="bg-gb-dark text-white">
      <div className="container-custom py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to start building a Go<span className="text-gb-green">o</span>d Business?
          </h2>
          <p className="text-lg text-white/80 mb-6">
            Let's discuss how we can help you achieve your business goals and create lasting impact.
          </p>
          <Button asChild className="btn-primary text-lg group">
            <ScrollToTopLink to="/evaluator">
              Let's Go!
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </ScrollToTopLink>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ConsultingCTA;
