
import React from 'react';
import { Check } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const Benefits = () => {
  const benefits = [
    "Built for your workflows — not a vendor roadmap",
    "AI-first by default",
    "Faster than traditional dev shops",
    "Simpler than managing 10 SaaS tools",
    "Software you own, control, and evolve"
  ];

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-10">
              Why Companies Work With Good Business
            </h2>
            
            <ul className="space-y-5">
              {benefits.map((benefit, index) => (
                <ScrollReveal key={index} direction="right" delay={index * 100}>
                  <li className="flex items-start">
                    <div className="w-6 h-6 bg-gb-green rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg md:text-xl text-gb-dark">{benefit}</span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Benefits;
