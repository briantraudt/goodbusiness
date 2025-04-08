
import React from 'react';
import { Target, Users, DollarSign, Package } from 'lucide-react';
import { Card } from "@/components/ui/card";

const Pillars = () => {
  const pillars = [
    {
      title: "Purpose",
      description: "We believe the most enduring companies are built on purpose. The "why" is more important than the "how".",
      icon: <Target className="h-14 w-14 text-gb-green" />,
    },
    {
      title: "People",
      description: "Great businesses are built by great teams. We focus on building healthy cultures where people can thrive and do their best work.",
      icon: <Users className="h-14 w-14 text-gb-blue" />,
    },
    {
      title: "Product",
      description: "Great products solve real problems elegantly. We build solutions that are intuitive, effective, and create lasting value for users.",
      icon: <Package className="h-14 w-14 text-gb-purple" />,
    },
    {
      title: "Profit",
      description: "Sustainable impact requires sustainable economics. We create business models that generate healthy margins and responsible growth.",
      icon: <DollarSign className="h-14 w-14 text-gb-yellow" />,
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="container-custom section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Pillars of a Good Business</h2>
          <p className="mt-4 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            These core principles guide everything we do, from consulting to building our own ventures.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <Card key={index} className="p-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6">{pillar.icon}</div>
                <h3 className="text-2xl font-bold text-gb-dark mb-3">{pillar.title}</h3>
                <p className="text-gb-dark/70 text-base md:text-lg">{pillar.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
