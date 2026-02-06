import React from 'react';
import { Compass, Layers, Rocket, RefreshCw } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const HowWeWork = () => {
  const steps = [
    {
      number: "01",
      title: "Clarify",
      subtitle: "Pressure-test your idea. Define what to build — and what to skip.",
      icon: <Compass className="h-7 w-7" />,
      color: "text-gb-green",
      bg: "bg-gb-green/10"
    },
    {
      number: "02",
      title: "Shape",
      subtitle: "Turn a messy idea into a focused, shippable first version.",
      icon: <Layers className="h-7 w-7" />,
      color: "text-gb-blue",
      bg: "bg-gb-blue/10"
    },
    {
      number: "03",
      title: "Build",
      subtitle: "Hands-on execution alongside you. Fast, simple, and testable.",
      icon: <Rocket className="h-7 w-7" />,
      color: "text-gb-purple",
      bg: "bg-gb-purple/10"
    },
    {
      number: "04",
      title: "Iterate",
      subtitle: "Adjust based on real feedback. Grow intentionally.",
      icon: <RefreshCw className="h-7 w-7" />,
      color: "text-gb-orange",
      bg: "bg-gb-orange/10"
    }
  ];

  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-3">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gb-dark">
              Clarity → Product → Growth
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} direction="up" delay={index * 100}>
              <div className="text-center flex flex-col items-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.bg} ${step.color} mb-4`}>
                  {step.icon}
                </div>
                <span className="text-3xl font-extrabold text-gb-dark/10 mb-1">{step.number}</span>
                <h3 className="text-2xl font-bold text-gb-dark mb-2">{step.title}</h3>
                <p className="text-gb-dark/60 text-sm leading-relaxed">{step.subtitle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
