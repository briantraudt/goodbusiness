
import React from 'react';
import { Users, Building, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Focus = () => {
  const isMobile = useIsMobile();
  
  const focusAreas = [
    {
      title: "Consulting for leaders and founders",
      description: "We help executives and entrepreneurs solve their toughest challenges, from strategy to execution.",
      icon: <Users className="h-10 w-10 text-gb-blue" />,
      link: "/consulting",
      linkText: "Learn More"
    },
    {
      title: "Building SideStage, Pardners, and Rated JC",
      description: "We're developing our own ventures that solve meaningful problems in media, community, and faith.",
      icon: <Building className="h-10 w-10 text-gb-green" />,
      link: "/ventures",
      linkText: "See Our Ventures"
    },
    {
      title: "Investing in meaningful, scalable businesses",
      description: "We partner with mission-aligned founders building businesses that create lasting value.",
      icon: <LineChart className="h-10 w-10 text-gb-purple" />,
      link: "/contact",
      linkText: "Connect With Us"
    },
  ];

  return (
    <section className="bg-white">
      <div className="container-custom py-12 md:py-24">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Current Focus Areas</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            How we're applying our principles to create impact today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
          {focusAreas.map((area, index) => (
            <div key={index} className="bg-white p-4 md:p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="mb-2 md:mb-3">{area.icon}</div>
              <h3 className="text-xl md:text-lg font-bold text-gb-dark mb-2">{area.title}</h3>
              <p className="text-gb-dark/70 mb-4 text-base flex-grow">{area.description}</p>
              <div className="mt-auto">
                <Button asChild variant="outline" className="border-gb-blue text-gb-blue hover:bg-gb-blue/5 flex items-center justify-center w-full">
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
