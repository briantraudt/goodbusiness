
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, DollarSign, Users, LineChart } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Rapid AI Prototyping",
      description: "Launch intelligent prototypes in days—not months of development cycles.",
      icon: <Timer className="h-10 w-10 md:h-12 md:w-12 text-gb-blue" />
    },
    {
      title: "AI-First Validation",
      description: "Validate your AI concept's feasibility before major AI infrastructure investment.",
      icon: <DollarSign className="h-10 w-10 md:h-12 md:w-12 text-gb-green" />
    },
    {
      title: "Intelligent Testing",
      description: "Test AI behavior with real users and refine algorithms based on actual usage patterns.",
      icon: <Users className="h-10 w-10 md:h-12 md:w-12 text-gb-purple" />
    },
    {
      title: "Scalable AI Architecture",
      description: "Go from AI MVP to enterprise-ready with systems that learn and adapt as you grow.",
      icon: <LineChart className="h-10 w-10 md:h-12 md:w-12 text-gb-orange" />
    }
  ];

  return (
    <section className="bg-slate-50 py-12 md:py-28">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Why Founders Choose Our AI Development</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="border border-gray-100 shadow-md hover:shadow-lg transition-all p-4 md:p-6 lg:p-8 bg-white"
            >
              <CardHeader className="flex flex-col items-center pb-2 md:pb-4 space-y-3 md:space-y-4 text-center">
                <div className="p-2 md:p-3 bg-gray-50 rounded-lg">
                  {benefit.icon}
                </div>
                <CardTitle className="text-xl md:text-2xl font-semibold text-gb-dark">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gb-dark/70 text-sm md:text-lg">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
