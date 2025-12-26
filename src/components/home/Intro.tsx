
import React from 'react';
import { Code, Brain, Rocket, Zap } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const Intro = () => {
  const pillars = [
    {
      icon: <Code className="w-7 h-7 text-gb-green" />,
      title: "Custom Development",
      description: "Built to your exact needs",
      bgColor: "bg-gb-green/10"
    },
    {
      icon: <Brain className="w-7 h-7 text-gb-blue" />,
      title: "AI Integration",
      description: "Intelligent features that add value",
      bgColor: "bg-gb-blue/10"
    },
    {
      icon: <Rocket className="w-7 h-7 text-gb-purple" />,
      title: "Rapid Delivery",
      description: "Weeks, not months",
      bgColor: "bg-gb-purple/10"
    },
    {
      icon: <Zap className="w-7 h-7 text-gb-orange" />,
      title: "Scalable Solutions",
      description: "Grows with your business",
      bgColor: "bg-gb-orange/10"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Technology That Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Custom software and AI solutions designed to solve real business problems.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <ScrollReveal key={index} direction="left" delay={index * 100}>
              <div className="text-center p-6">
                <div className={`w-14 h-14 ${pillar.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  {pillar.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Intro;
