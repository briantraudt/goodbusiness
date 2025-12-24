
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Clock, Shield, TrendingUp } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      title: "AI-Powered Solutions",
      description: "Leverage machine learning, natural language processing, and computer vision to create intelligent applications.",
      icon: <Cpu className="h-10 w-10 md:h-12 md:w-12 text-gb-blue" />
    },
    {
      title: "Rapid Development",
      description: "Modern development practices and AI tools accelerate delivery without compromising quality.",
      icon: <Clock className="h-10 w-10 md:h-12 md:w-12 text-gb-green" />
    },
    {
      title: "Enterprise Security",
      description: "Security-first development with best practices baked into every layer of your application.",
      icon: <Shield className="h-10 w-10 md:h-12 md:w-12 text-gb-purple" />
    },
    {
      title: "Scalable Architecture",
      description: "Cloud-native solutions built to handle growth from day one to millions of users.",
      icon: <TrendingUp className="h-10 w-10 md:h-12 md:w-12 text-gb-orange" />
    }
  ];

  return (
    <section className="bg-slate-50 py-12 md:py-28">
      <div className="container-custom">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Why Choose Our Development Team</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            We combine technical expertise with a deep understanding of what it takes to build successful software products
          </p>
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
