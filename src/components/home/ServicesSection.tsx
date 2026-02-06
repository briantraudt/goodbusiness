import React from 'react';
import { CheckCircle2, Compass, Layers, Code, CalendarCheck } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const ServicesSection = () => {
  const services = [
    {
      title: "Idea Clarity & Direction",
      description: "Before you build anything, we make sure you're building the right thing for the right person.",
      points: [
        "Pressure-test your idea against real market signals",
        "Define the actual problem worth solving",
        "Identify your real user — not a fantasy persona",
        "Cut the features you don't need yet"
      ],
      icon: <Compass className="h-10 w-10 text-gb-green" />
    },
    {
      title: "Product Shaping",
      description: "Turn a messy idea into a focused first version that's simple enough to ship and strong enough to learn from.",
      points: [
        "MVP definition — what to build now vs. later",
        "Simple product architecture that won't trap you",
        "Avoid overbuilding before you have users",
        "Clear scope that respects your time and budget"
      ],
      icon: <Layers className="h-10 w-10 text-gb-blue" />
    },
    {
      title: "Build With You",
      description: "Hands-on execution alongside you — not handed off to a team you'll never talk to.",
      points: [
        "Fast iteration with real feedback loops",
        "Practical tools — AI when it's useful, not for show",
        "No unnecessary complexity or tech debt",
        "You stay in the loop on every decision"
      ],
      icon: <Code className="h-10 w-10 text-gb-purple" />
    },
    {
      title: "Weekly Founder Support",
      description: "A standing rhythm to keep you moving — with someone who's paying attention to your progress.",
      points: [
        "Standing check-ins so you don't stall",
        "Decision support when you're stuck",
        "Accountability without micromanagement",
        "A place to think out loud"
      ],
      icon: <CalendarCheck className="h-10 w-10 text-gb-orange" />
    }
  ];

  return (
    <section id="services" className="bg-white py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-3">
              How We Help
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-4">
              Guidance + Execution, Not Just Advice
            </h2>
            <p className="text-lg text-gb-dark/70 max-w-2xl mx-auto">
              We don't hand you a strategy deck and disappear. We work alongside you — 
              from figuring out what to build to getting it in front of real users.
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
