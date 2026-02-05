
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle } from 'lucide-react';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';
import ScrollReveal from '@/components/common/ScrollReveal';

const IdeaCTA = () => {
  return (
    <section className="bg-gradient-to-br from-gb-dark via-gb-dark to-slate-900 text-white py-20 md:py-28 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0 bg-repeat"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}
        />
      </div>
      
      <div className="container-custom relative z-10">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gb-green/20 text-gb-green px-4 py-2 rounded-full text-sm font-medium mb-6">
              <MessageCircle className="h-4 w-4" />
              Free Consultation
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to Own Your Software?
            </h2>
            
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto">
              Let's figure out which systems you should build — and which you should buy. No pitch, just a conversation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ScrollToTopLink to="/contact">
                <Button size="lg" className="bg-gb-green hover:bg-gb-green/90 text-white px-8 py-6 text-lg font-semibold group w-full sm:w-auto">
                  Start a Conversation 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </ScrollToTopLink>
              <ScrollToTopLink to="/consulting">
                <Button size="lg" variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white hover:text-gb-dark px-8 py-6 text-lg font-semibold w-full sm:w-auto">
                  Learn More
                </Button>
              </ScrollToTopLink>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default IdeaCTA;
