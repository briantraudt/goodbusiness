
import React from 'react';
import { Check, Workflow, Brain, Zap, Layers, Shield } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const Benefits = () => {
  const benefits = [
    {
      icon: <Workflow className="h-6 w-6" />,
      title: "Built for your workflows",
      description: "Not a vendor roadmap"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-first by default",
      description: "Intelligence baked in, not bolted on"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Faster than traditional dev",
      description: "Weeks to launch, not months"
    },
    {
      icon: <Layers className="h-6 w-6" />,
      title: "Simpler than 10 SaaS tools",
      description: "One system, built for you"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Software you own",
      description: "Control, evolve, and keep forever"
    }
  ];

  return (
    <section className="bg-gb-dark py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <span className="inline-block text-gb-green font-semibold text-sm uppercase tracking-wider mb-3">
              The Good Business Advantage
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Companies Work With Us
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 80}>
              <div className="group text-center p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gb-green/30 transition-all h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gb-green/20 text-gb-green mb-4 group-hover:bg-gb-green group-hover:text-white transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-white/60 text-sm">{benefit.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
