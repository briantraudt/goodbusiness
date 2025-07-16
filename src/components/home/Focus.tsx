
import React from 'react';
import { Rocket, Component, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';
import { useIsMobile } from '@/hooks/use-mobile';

const Focus = () => {
  const isMobile = useIsMobile();
  
  const focusAreas = [
    {
      title: "Validate AI Concept",
      description: "Turn your AI vision into an interactive prototype in days. Test intelligent features and get real user feedback before major investment.",
      icon: <Rocket className="h-12 w-12 text-gb-blue" />
    },
    {
      title: "Build AI MVP",
      description: "Transform your validated concept into a working AI-powered product. Focus on core intelligent features that automate and optimize user workflows.",
      icon: <Component className="h-12 w-12 text-gb-purple" />
    },
    {
      title: "Scale AI System",
      description: "Ready to grow? We'll help evolve your successful AI MVP into a fully-featured intelligent system with advanced ML capabilities.",
      icon: <Database className="h-12 w-12 text-gb-green" />
    },
  ];

  return (
    <section className="bg-[#F1F0FB]/30">
      <div className="container-custom py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">From AI Concept to Smart Business</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            We turn your AI ideas into intelligent solutions that automate and optimize your operations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
          {focusAreas.map((area, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4 md:mb-5 min-h-[4rem]">
                {area.icon}
                <h3 className="text-2xl md:text-2xl lg:text-3xl font-bold text-gb-dark whitespace-nowrap">{area.title}</h3>
              </div>
              <p className="text-gb-dark/70 text-base md:text-lg">{area.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center">
          <Button asChild size="lg" className="bg-gb-blue hover:bg-gb-blue/90 text-white rounded-lg text-lg px-8 py-3 h-auto">
            <ScrollToTopLink to="/evaluator">
              Free AI Concept Evaluator
            </ScrollToTopLink>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Focus;
