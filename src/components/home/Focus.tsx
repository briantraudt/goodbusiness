
import React from 'react';
import { Users, Building, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Focus = () => {
  const focusAreas = [
    {
      title: "Consulting for leaders and founders",
      description: "We help executives and entrepreneurs solve their toughest challenges, from strategy to execution.",
      icon: <Users className="h-12 w-12 text-gb-blue mb-4" />,
      link: "/consulting",
      linkText: "Learn More"
    },
    {
      title: "Building SideStage, Pardners, and Rated JC",
      description: "We're developing our own ventures that solve meaningful problems in media, community, and faith.",
      icon: <Building className="h-12 w-12 text-gb-green mb-4" />,
      link: "/ventures",
      linkText: "See Our Ventures"
    },
    {
      title: "Investing in meaningful, scalable businesses",
      description: "We partner with mission-aligned founders building businesses that create lasting value.",
      icon: <LineChart className="h-12 w-12 text-gb-purple mb-4" />,
      link: "/contact",
      linkText: "Connect With Us"
    },
  ];

  return (
    <section className="bg-white">
      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Current Focus Areas</h2>
          <p className="mt-4 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            How we're applying our principles to create impact today.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {focusAreas.map((area, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
              {area.icon}
              <h3 className="text-xl font-bold text-gb-dark mb-3">{area.title}</h3>
              <p className="text-gb-dark/70 mb-6">{area.description}</p>
              <div className="mt-auto">
                <Button asChild variant="outline" className="border-gb-blue text-gb-blue hover:bg-gb-blue/5">
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
