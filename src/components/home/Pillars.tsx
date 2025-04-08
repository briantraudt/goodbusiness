
import React from 'react';
import { Goal, Users, DollarSign, Package } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';

const Pillars = () => {
  const isMobile = useIsMobile();
  
  const pillars = [
    {
      title: "Purpose",
      description: 'The most enduring companies are built on purpose where the "why" is more important than the "how".',
      icon: <Goal className="h-10 w-10 text-gb-green" />,
    },
    {
      title: "People",
      description: "Great businesses are built by great teams who focus on building healthy cultures where people can thrive and do their best work.",
      icon: <Users className="h-10 w-10 text-gb-blue" />,
    },
    {
      title: "Product",
      description: "The best products solve real problems in a way that is intuitive, effective and create value for their users.",
      icon: <Package className="h-10 w-10 text-gb-purple" />,
    },
    {
      title: "Profit",
      description: "Sustainable impact is built on strong, profitable business models that support long-term growth.",
      icon: <DollarSign className="h-10 w-10 text-gb-yellow" />,
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="container-custom py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Pillars of a Good Business</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            These core principles guide everything we do, from consulting to building our own ventures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {pillars.map((pillar, index) => (
            <Card key={index} className="p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 md:mb-3">{pillar.icon}</div>
                <h3 className="text-2xl font-bold text-gb-dark mb-1 md:mb-2">{pillar.title}</h3>
                <p className="text-gb-dark/70 text-base">{pillar.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
