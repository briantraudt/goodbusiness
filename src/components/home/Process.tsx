import React from 'react';
import { User, Compass, Rocket, RefreshCw } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Understand You",
      subtitle: "Your goals, constraints, and motivations.",
      icon: <User className="h-6 w-6" />,
      color: "bg-gb-green",
    },
    {
      number: "02",
      title: "Clarify the Product",
      subtitle: "What matters. Who it's for. What to cut.",
      icon: <Compass className="h-6 w-6" />,
      color: "bg-gb-blue",
    },
    {
      number: "03",
      title: "Build the First Version",
      subtitle: "Fast, simple, and testable.",
      icon: <Rocket className="h-6 w-6" />,
      color: "bg-gb-purple",
    },
    {
      number: "04",
      title: "Iterate With Feedback",
      subtitle: "Adjust, refocus, and grow intentionally.",
      icon: <RefreshCw className="h-6 w-6" />,
      color: "bg-gb-orange",
    }
  ];

  return (
    <section id="how-it-works" className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-3">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gb-dark">
              Simple. Human. No Fluff.
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} direction="up" delay={index * 100}>
              <div className="text-center flex flex-col items-center">
                <div className={`h-16 w-16 rounded-2xl text-white font-bold text-lg flex items-center justify-center ${step.color} mb-5 shadow-lg`}>
                  {step.icon}
                </div>
                <span className="text-4xl font-extrabold text-gb-dark/10 mb-2">{step.number}</span>
                <h3 className="text-xl font-bold text-gb-dark mb-2">{step.title}</h3>
                <p className="text-gb-dark/60 text-sm">{step.subtitle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
