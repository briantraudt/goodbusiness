
import React from 'react';
import { Target, Users, TrendingUp, DollarSign, Heart } from 'lucide-react';

const Pillars = () => {
  const pillars = [
    {
      title: "Purpose-Driven",
      description: "Companies built to solve real problems stand the test of time. We help leaders clarify their purpose and align their business model accordingly.",
      icon: <Target className="h-10 w-10 text-gb-green" />,
    },
    {
      title: "People-Centered",
      description: "Great businesses are built by great teams. We focus on building healthy cultures where people can thrive and do their best work.",
      icon: <Users className="h-10 w-10 text-gb-blue" />,
    },
    {
      title: "Built to Scale",
      description: "Growth requires solid systems and processes. We design businesses with scalability in mind from day one.",
      icon: <TrendingUp className="h-10 w-10 text-gb-purple" />,
    },
    {
      title: "Profit-Smart",
      description: "Sustainable impact requires sustainable economics. We create business models that generate healthy margins and responsible growth.",
      icon: <DollarSign className="h-10 w-10 text-gb-yellow" />,
    },
    {
      title: "Kingdom-Impact",
      description: "We believe business can be a force for good in the world. We build ventures that honor God and serve others with excellence.",
      icon: <Heart className="h-10 w-10 text-gb-red" />,
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div key={index} className="pillar-card">
              <div className="mb-6">{pillar.icon}</div>
              <h3 className="text-xl font-bold text-gb-dark mb-3">{pillar.title}</h3>
              <p className="text-gb-dark/70">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
