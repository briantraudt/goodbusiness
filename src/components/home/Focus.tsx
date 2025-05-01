
import React from 'react';
import { Rocket, Component, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Focus = () => {
  const isMobile = useIsMobile();
  
  const focusAreas = [
    {
      title: "Rapid Prototyping",
      description: "Turn ideas into interactive prototypes in days, not months. Test concepts quickly and iterate based on real feedback.",
      icon: <Rocket className="h-12 w-12 text-gb-blue" />,
      link: "/consulting",
      linkText: "Learn More"
    },
    {
      title: "MVP Development",
      description: "Build lean, focused products that deliver value immediately. Launch faster and validate your market with minimal investment.",
      icon: <Component className="h-12 w-12 text-gb-purple" />,
      link: "/consulting",
      linkText: "Learn More"
    },
    {
      title: "Scaling Solutions",
      description: "Expand your successful prototype into a full-featured application ready for growth, without sacrificing speed or quality.",
      icon: <Database className="h-12 w-12 text-gb-green" />,
      link: "/consulting",
      linkText: "Learn More"
    },
  ];

  return (
    <section className="bg-[#F1F0FB]/30">
      <div className="container-custom py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Development at Speed</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            Skip the lengthy development cycles and get to market faster
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
          {focusAreas.map((area, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                {area.icon}
                <h3 className="text-2xl md:text-3xl font-bold text-gb-dark">{area.title}</h3>
              </div>
              <p className="text-gb-dark/70 mb-5 text-base md:text-lg flex-grow">{area.description}</p>
              <div className="mt-auto">
                <Button asChild variant="outline" className="border-gb-blue text-gb-blue hover:bg-gb-blue/5 flex items-center justify-center w-full text-base rounded-lg">
                  <Link to={area.link}>
                    {area.linkText}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Focus;
