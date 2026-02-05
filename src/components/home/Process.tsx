
import React from 'react';
import { ArrowRight, MessageSquare, Lightbulb, Rocket, CheckCircle } from 'lucide-react';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';
import ScrollReveal from '@/components/common/ScrollReveal';

const Process = () => {
  const steps = [
    {
      number: 1,
      title: "Understand the Business",
      description: "We map real workflows, constraints, and costs — not just feature requests.",
      icon: <MessageSquare className="h-5 w-5" />,
      color: "bg-gb-green",
      borderColor: "border-l-gb-green"
    },
    {
      number: 2,
      title: "Design the Right System",
      description: "We prototype the simplest software that solves the actual problem.",
      icon: <Lightbulb className="h-5 w-5" />,
      color: "bg-gb-blue",
      borderColor: "border-l-gb-blue"
    },
    {
      number: 3,
      title: "Build Fast, With AI",
      description: "Modern tools and AI let us move in weeks, not months.",
      icon: <Rocket className="h-5 w-5" />,
      color: "bg-gb-purple",
      borderColor: "border-l-gb-purple"
    },
    {
      number: 4,
      title: "Launch, Iterate, Own",
      description: "You own the software. We refine it as the business evolves.",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "bg-gb-orange",
      borderColor: "border-l-gb-orange",
      cta: { text: "Get Started", link: "/contact" }
    }
  ];

  return (
    <section id="how-it-works" className="bg-slate-50 py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-3">
              How We Work
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">
              A Simple, Operator-Focused Process
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
                className={`flex flex-col bg-white p-6 md:p-8 rounded-xl shadow-sm border-l-4 ${step.borderColor} hover:shadow-md transition-shadow h-full`}
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
                <p className="text-gb-dark/70 text-base md:text-lg mb-4 flex-grow">{step.description}</p>
                {step.cta && (
                  <div className="mt-auto pt-2">
                    <ScrollToTopLink 
                      to={step.cta.link} 
                      className="inline-flex items-center text-gb-green font-semibold hover:text-gb-green/80 transition-colors group"
                    >
                      {step.cta.text} 
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
