import React from 'react';
import { Rocket, Handshake, Compass } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const HowWeWork = () => {
  const pillars = [
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Direction",
      description: "We help founders slow down long enough to get the right things right — defining the problem, the customer, and what not to build.",
      color: "text-gb-green",
      bg: "bg-gb-green/10",
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Execution",
      description: "We work hands-on with founders and teams to turn strategy into execution — shaping products, systems, and momentum that actually ship.",
      color: "text-gb-blue",
      bg: "bg-gb-blue/10",
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Incubation",
      description: "We co-build and launch products alongside founders — investing time, experience, and conviction to bring real ideas into the world.",
      color: "text-gb-purple",
      bg: "bg-gb-purple/10",
    }
  ];

  return (
    <section id="how-we-help" className="relative py-14 md:py-20">
      <div className="container-custom relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-block text-secondary font-semibold text-xl md:text-3xl uppercase tracking-wider mb-3">
              What We Do
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Three Ways We Work With Founders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We build products, partner with founders, and support teams at every stage — from first idea to real-world execution.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 120}>
              <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-border hover:border-muted-foreground/30 transition-all h-full flex flex-col items-center text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${pillar.bg} ${pillar.color} mb-6`}>
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
