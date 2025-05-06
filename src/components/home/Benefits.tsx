
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer, DollarSign, ShieldCheck, Users } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "Faster Time to Market",
      description: "Launch your product in weeks instead of months or years. Get to market before your competition.",
      icon: <Timer className="h-6 w-6 text-gb-blue" />
    },
    {
      title: "Lower Development Costs",
      description: "Rapid development means less time spent, resulting in lower overall project costs.",
      icon: <DollarSign className="h-6 w-6 text-gb-green" />
    },
    {
      title: "Reduced Risk",
      description: "Test ideas quickly with minimal investment before committing to full-scale development.",
      icon: <ShieldCheck className="h-6 w-6 text-gb-purple" />
    },
    {
      title: "Real User Feedback",
      description: "Get your product in front of users early to gather valuable insights and iterate quickly.",
      icon: <Users className="h-6 w-6 text-gb-orange" />
    }
  ];

  return (
    <section className="bg-white py-12 md:py-24">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Why Build Fast?</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            The advantages of rapid development in today's competitive market
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="flex flex-row items-center gap-3">
                {benefit.icon}
                <CardTitle className="text-xl font-semibold text-gb-dark">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gb-dark/70">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
