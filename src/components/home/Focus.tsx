
import React from 'react';
import { Rocket, Target, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Focus = () => {
  const isMobile = useIsMobile();
  
  const focusAreas = [
    {
      title: "Business Launchpad",
      description: "We help executives and entrepreneurs solve their toughest challenges, from strategy to execution.",
      icon: <Rocket className="h-14 w-14 text-gb-blue" />,
      link: "/consulting",
      linkText: "Learn More"
    },
    {
      title: "MVP Development",
      description: "We partner with mission-aligned founders building businesses that create lasting value.",
      icon: <LineChart className="h-14 w-14 text-gb-purple" />,
      link: "/contact",
      linkText: "Connect With Us"
    },
    {
      title: "GTM Strategy",
      description: "We're developing our own ventures that solve meaningful problems in media, community, and faith.",
      icon: <Target className="h-14 w-14 text-gb-green" />,
      link: "/ventures",
      linkText: "See Our Ventures"
    },
  ];

  return (
    <section className="bg-[#D3E4FD]">
      <div className="container-custom py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Current Focus Areas</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            How we're applying our principles to create impact today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-5xl mx-auto">
          {focusAreas.map((area, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                {area.icon}
                <h3 className="text-2xl md:text-3xl font-bold text-gb-dark">{area.title}</h3>
              </div>
              <p className="text-gb-dark/70 mb-5 text-base md:text-lg flex-grow">{area.description}</p>
              <div className="mt-auto">
                <Button asChild variant="outline" className="border-gb-blue text-gb-blue hover:bg-gb-blue/5 flex items-center justify-center w-full text-base">
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
