
import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const ConsultingCTA = () => {
  return (
    <section className="bg-gb-dark text-white">
      <div className="container-custom py-16 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gb-green/20 text-gb-green px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="h-4 w-4" />
            Free Consultation
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your Own Software?
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Tell us what's not working with your current tools. We'll show you what's possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white text-lg font-semibold group px-8 py-6">
              <ScrollToTopLink to="/contact">
                Start a Conversation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </ScrollToTopLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultingCTA;
