
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Clock, Shield, TrendingUp } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const Benefits = () => {
  const benefits = [
    {
      title: "AI-Powered",
      description: "Intelligent features that automate and enhance.",
      icon: <Cpu className="h-10 w-10 md:h-12 md:w-12 text-gb-blue" />
    },
    {
      title: "Fast Delivery",
      description: "Launch quickly without sacrificing quality.",
      icon: <Clock className="h-10 w-10 md:h-12 md:w-12 text-gb-green" />
    },
    {
      title: "Secure",
      description: "Built with security at every layer.",
      icon: <Shield className="h-10 w-10 md:h-12 md:w-12 text-gb-purple" />
    },
    {
      title: "Scalable",
      description: "Ready to grow with your business.",
      icon: <TrendingUp className="h-10 w-10 md:h-12 md:w-12 text-gb-orange" />
    }
  ];

  return (
    <section className="bg-slate-50 py-12 md:py-28">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Why Work With Us</h2>
            <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
              We build software that works.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} direction="right" delay={index * 100}>
              <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-all p-4 md:p-6 lg:p-8 bg-white">
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
