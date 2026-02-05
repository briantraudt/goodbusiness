import React from 'react';
import { Target, Map, Wrench, BarChart3 } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const Process = () => {
  const steps = [
    {
      number: 1,
      title: "Define Success",
      description: "Align on what winning actually looks like—financial, operational, or strategic.",
      icon: <Target className="h-5 w-5" />,
      color: "bg-gb-green",
      borderColor: "border-l-gb-green"
    },
    {
      number: 2,
      title: "Design the Path",
      description: "Map the fastest, simplest way to achieve that outcome.",
      icon: <Map className="h-5 w-5" />,
      color: "bg-gb-blue",
      borderColor: "border-l-gb-blue"
    },
    {
      number: 3,
      title: "Build What's Necessary",
      description: "Software, AI, systems, or removal of complexity—only what's required.",
      icon: <Wrench className="h-5 w-5" />,
      color: "bg-gb-purple",
      borderColor: "border-l-gb-purple"
    },
    {
      number: 4,
      title: "Measure & Iterate",
      description: "Work continues until the numbers move.",
      icon: <BarChart3 className="h-5 w-5" />,
      color: "bg-gb-orange",
      borderColor: "border-l-gb-orange"
    }
  ];

  return (
    <section id="how-it-works" className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-3">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">
              How We Work
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <ScrollReveal 
              key={step.number} 
              direction={index % 2 === 0 ? "left" : "right"} 
              delay={index * 100}
            >
              <div 
                className={`flex flex-col bg-slate-50 p-6 md:p-8 rounded-xl border-l-4 ${step.borderColor} hover:shadow-sm transition-shadow h-full`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`h-10 w-10 md:h-12 md:w-12 rounded-full text-white font-bold flex items-center justify-center ${step.color}`}>
                    {step.icon}
                  </div>
                  <div>
                    <span className="text-sm text-gb-dark/50 font-medium">Step {step.number}</span>
                    <h3 className="text-lg md:text-xl font-bold text-gb-dark">{step.title}</h3>
                  </div>
                </div>
                <p className="text-gb-dark/70 text-base md:text-lg flex-grow">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
