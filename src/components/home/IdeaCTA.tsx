
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const IdeaCTA = () => {
  return (
    <section className="bg-gb-dark py-16 md:py-20">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">💡 Got a Great Idea?</h2>
        
        <div className="max-w-xl mx-auto mb-8">
          <p className="text-white/80 text-xl mb-2">Most people never act on theirs.</p>
          <p className="text-white text-2xl font-bold">You will.</p>
          <p className="text-white/80 text-xl mt-2">Let's turn it into something real.</p>
        </div>
        
        <Button asChild size="lg" className="bg-gb-green hover:bg-gb-green/90 text-white rounded-lg text-lg px-8 py-6 h-auto">
          <ScrollToTopLink to="/contact">
            Start Building
            <ArrowRight className="ml-2 h-5 w-5" />
          </ScrollToTopLink>
        </Button>
      </div>
    </section>
  );
};

export default IdeaCTA;
