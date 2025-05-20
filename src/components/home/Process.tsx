
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
      title: "Evaluate Your Idea",
      description: "Share your idea. We'll assess its potential for impact, scalability, and monetization.",
      cta: {
        text: "Try the Idea Evaluator",
        link: "/evaluator"
      }
    },
    {
      number: 2,
      title: "Explore Partnership",
      description: "If the idea has promise, we'll discuss partnership options—co-building, funding, or strategic support."
    },
    {
      number: 3,
      title: "Build in 7 Days",
      description: "In just one week, we'll bring your concept to life with a working prototype you can see, test, and share."
    },
    {
      number: 4,
      title: "Launch with Confidence",
      description: "If it's viable, we'll develop a scalable product ready for real users and long-term growth."
    }
  ];

  return (
    <section className="bg-white py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-3">Our 4-Step Process</h2>
          <p className="text-gb-dark/70 text-lg max-w-2xl mx-auto">
            We turn good ideas into real software—fast.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-3">
                <Badge variant="outline" className="h-8 w-8 rounded-full border-2 border-gb-green text-gb-green font-bold flex items-center justify-center p-0">
                  {step.number}
                </Badge>
                <h3 className="text-xl font-bold text-gb-dark">{step.title}</h3>
              </div>
              <p className="text-gb-dark/70 mb-4">{step.description}</p>
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
