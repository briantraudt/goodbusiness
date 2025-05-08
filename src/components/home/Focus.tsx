
import React from 'react';
import { Rocket, Component, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Focus = () => {
  const isMobile = useIsMobile();
  
  const focusAreas = [
    {
      title: "Validate Idea",
      description: "Turn your app concept into an interactive prototype in days. Test your idea quickly and get real user feedback before major investment.",
      icon: <Rocket className="h-12 w-12 text-gb-blue" />,
      link: "/evaluator",
      linkText: "Get Started"
    },
    {
      title: "Build MVP",
      description: "Transform your validated idea into a working minimum viable product. Focus on core features that solve your users' problems effectively.",
      icon: <Component className="h-12 w-12 text-gb-purple" />,
      link: "/evaluator",
      linkText: "Learn More"
    },
    {
      title: "Scale Product",
      description: "Ready to grow? We'll help evolve your successful MVP into a fully-featured application while maintaining the speed and quality that got you here.",
      icon: <Database className="h-12 w-12 text-gb-green" />,
      link: "/evaluator",
      linkText: "Scale Now"
    },
  ];

  return (
    <section className="bg-[#F1F0FB]/30">
      <div className="container-custom py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">From Idea to Business</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            We turn your ideas into working products to help you monetize quickly.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
          {focusAreas.map((area, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4 md:mb-5 min-h-[4rem]">
                {area.icon}
                <h3 className="text-2xl font-bold text-gb-dark whitespace-nowrap">{area.title}</h3>
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
