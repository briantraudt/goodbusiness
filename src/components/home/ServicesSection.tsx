import React from 'react';
import { CheckCircle2, Search, Lightbulb, Code, Rocket } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const ServicesSection = () => {
  const services = [
    {
      title: "Discovery & Strategy",
      description: "We dig deep into your workflows, pain points, and goals to identify exactly what custom software will move the needle.",
      points: [
        "Workflow and process mapping",
        "SaaS audit and consolidation planning",
        "Technical requirements definition",
        "Build vs. buy analysis"
      ],
      icon: <Search className="h-10 w-10 text-gb-green" />
    },
    {
      title: "Rapid Prototyping",
      description: "See your idea come to life in days. We build interactive prototypes you can test, share, and iterate on quickly.",
      points: [
        "7-day functional prototypes",
        "User testing and validation",
        "Stakeholder feedback loops",
        "Scope refinement"
      ],
      icon: <Lightbulb className="h-10 w-10 text-gb-blue" />
    },
    {
      title: "AI-Native Development",
      description: "We build software with AI baked in from day one — not bolted on as an afterthought.",
      points: [
        "Custom AI workflows and automation",
        "Intelligent data processing",
        "Natural language interfaces",
        "Predictive analytics and insights"
      ],
      icon: <Code className="h-10 w-10 text-gb-purple" />
    },
    {
      title: "Launch & Evolve",
      description: "Go live with confidence. We handle deployment, training, and ongoing refinement as your business grows.",
      points: [
        "Cloud deployment and hosting",
        "Team training and documentation",
        "Ongoing support and iteration",
        "Performance optimization"
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
              End-to-End Services
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-4">
              Everything You Need to Build & Own
            </h2>
            <p className="text-lg text-gb-dark/70 max-w-2xl mx-auto">
              From first conversation to production deployment, we handle the entire journey of building
              custom software that replaces your bloated SaaS stack.
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
