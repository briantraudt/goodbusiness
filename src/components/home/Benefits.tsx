
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, DollarSign, Users, LineChart } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Speed to Market",
      description: "Launch a working prototype in days—not months.",
      icon: <Timer className="h-12 w-12 text-gb-blue" />
    },
    {
      title: "Smart Spend",
      description: "Validate your idea before making a big investment.",
      icon: <DollarSign className="h-12 w-12 text-gb-green" />
    },
    {
      title: "Real Feedback",
      description: "Test your software with real users and iterate early.",
      icon: <Users className="h-12 w-12 text-gb-purple" />
    },
    {
      title: "Built to Scale",
      description: "Go from MVP to market-ready with a product that grows with you.",
      icon: <LineChart className="h-12 w-12 text-gb-orange" />
    }
  ];

  return (
    <section className="bg-slate-50 py-16 md:py-28">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Why Founders Choose Good Business</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="border border-gray-100 shadow-md hover:shadow-lg transition-all p-6 md:p-8 bg-white"
            >
              <CardHeader className="flex flex-col items-center pb-4 space-y-4 text-center">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {benefit.icon}
                </div>
                <CardTitle className="text-2xl font-semibold text-gb-dark">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gb-dark/70 text-lg">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
