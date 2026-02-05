
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';
import ScrollReveal from '@/components/common/ScrollReveal';

const Process = () => {
  const steps = [
    {
      number: 1,
      title: "Understand the Business",
      description: "We map real workflows, constraints, and costs — not just feature requests.",
      color: "border-gb-green bg-gb-green"
    },
    {
      number: 2,
      title: "Design the Right System",
      description: "We prototype the simplest software that solves the actual problem.",
      color: "border-gb-blue bg-gb-blue"
    },
    {
      number: 3,
      title: "Build Fast, With AI",
      description: "Modern tools and AI let us move in weeks, not months.",
      color: "border-gb-purple bg-gb-purple"
    },
    {
      number: 4,
      title: "Launch, Iterate, Own",
      description: "You own the software. We refine it as the business evolves.",
      cta: { text: "Get Started", link: "/contact" },
      color: "border-gb-orange bg-gb-orange"
    }
  ];

  return (
    <section id="how-it-works" className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-3">A Simple, Operator-Focused Process</h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <ScrollReveal 
              key={step.number} 
              direction={index % 2 === 0 ? "left" : "right"} 
              delay={index * 100}
            >
              <div 
                className="flex flex-col bg-white p-4 md:p-6 rounded-lg shadow-sm border-l-4 border-gray-100"
                style={{ borderLeftColor: `var(--${step.color.split('-')[1]}-${step.color.split('-')[2]})` }}
              >
                <div className="flex items-center gap-3 md:gap-4 mb-2 md:mb-3">
                  <Badge 
                    variant="outline" 
                    className={`h-8 w-8 md:h-10 md:w-10 rounded-full text-white font-bold flex items-center justify-center p-0 ${step.color}`}
                  >
                    {step.number}
                  </Badge>
                  <h3 className="text-lg md:text-xl font-bold text-gb-dark">{step.title}</h3>
                </div>
                <p className="text-gb-dark/70 text-sm md:text-base mb-3 md:mb-4">{step.description}</p>
                {step.cta && (
                  <div className="mt-auto">
                    <ScrollToTopLink to={step.cta.link} className="inline-flex items-center text-gb-green font-medium hover:text-gb-green/80 transition-colors">
                      {step.cta.text} <ArrowRight className="ml-1 h-4 w-4" />
                    </ScrollToTopLink>
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
