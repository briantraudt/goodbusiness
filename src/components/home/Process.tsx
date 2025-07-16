
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const Process = () => {
  const steps = [
    {
      number: 1,
      title: "Evaluate Your AI Concept",
      description: "Share your AI idea. We'll assess its technical feasibility, market potential, and automation opportunities.",
      cta: {
        text: "Try the Idea Evaluator",
        link: "/evaluator"
      },
      color: "border-gb-green bg-gb-green"
    },
    {
      number: 2,
      title: "Explore Partnership",
      description: "If the idea has promise, we'll discuss partnership options—co-building, funding, or strategic support.",
      color: "border-gb-blue bg-gb-blue"
    },
    {
      number: 3,
      title: "Build AI Solution in 7 Days",
      description: "In just one week, we'll create an intelligent prototype with AI capabilities you can demo and validate.",
      color: "border-gb-purple bg-gb-purple"
    },
    {
      number: 4,
      title: "Scale Your AI Product",
      description: "If validated, we'll build a production-ready AI system that learns, adapts, and grows with your business.",
      color: "border-gb-orange bg-gb-orange"
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-3">Our 4-Step AI Development Process</h2>
          <p className="text-gb-dark/70 text-lg max-w-2xl mx-auto">
            We turn AI concepts into intelligent software solutions—fast.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div 
              key={step.number} 
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
