import React from 'react';
import { CheckCircle2, Search, Lightbulb, Code, Rocket } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const ServicesSection = () => {
  const services = [
    {
      title: "AI Strategy & Discovery",
      description: "We audit your operations, identify the highest-ROI opportunities for AI, and build a roadmap that turns hype into growth.",
      points: [
        "AI opportunity assessment across your workflows",
        "Build vs. buy analysis for AI tools",
        "ROI modeling and prioritization",
        "Technology stack recommendations"
      ],
      icon: <Search className="h-10 w-10 text-gb-green" />
    },
    {
      title: "Rapid AI Prototyping",
      description: "See your AI solution working in days, not months. We build fast, test with your team, and iterate until it fits perfectly.",
      points: [
        "Working prototypes in 7 days",
        "Real-world testing with your data",
        "Stakeholder feedback and refinement",
        "Validated scope before full build"
      ],
      icon: <Lightbulb className="h-10 w-10 text-gb-blue" />
    },
    {
      title: "Custom AI Development",
      description: "Purpose-built AI solutions that integrate directly into your business — not another SaaS subscription you'll outgrow.",
      points: [
        "Custom AI agents and automations",
        "Intelligent data processing pipelines",
        "Natural language interfaces for your team",
        "Predictive analytics and forecasting"
      ],
      icon: <Code className="h-10 w-10 text-gb-purple" />
    },
    {
      title: "Launch, Train & Evolve",
      description: "We don't disappear after launch. Your team learns to use AI confidently, and your systems get smarter over time.",
      points: [
        "Hands-on team training and workshops",
        "Ongoing optimization and iteration",
        "Performance monitoring and tuning",
        "New capability rollouts as AI evolves"
      ],
      icon: <Rocket className="h-10 w-10 text-gb-orange" />
    }
  ];

  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-3">
              What We Do
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-4">
              AI Solutions, End to End
            </h2>
            <p className="text-lg text-gb-dark/70 max-w-2xl mx-auto">
              From identifying where AI will have the biggest impact to building and deploying custom solutions — 
              we handle the full journey so you can focus on running your business.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100}>
              <div
                className="bg-slate-50 p-8 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col h-full"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gb-dark">{service.title}</h3>
                  </div>
                </div>
                <p className="text-gb-dark/70 mb-6">{service.description}</p>

                <ul className="space-y-3 mt-auto">
                  {service.points.map((point, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-gb-green mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gb-dark/80">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
