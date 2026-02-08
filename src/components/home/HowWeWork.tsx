import React from 'react';
import { Rocket, Handshake, Compass } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const HowWeWork = () => {
  const pillars = [
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Direction",
      description: "We help founders define what truly matters — clarifying the problem, the user, and the long-term opportunity before a single line of code is written.",
      color: "text-gb-green",
      bg: "bg-gb-green/10",
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Execution",
      description: "We work hands-on to turn conviction into momentum — building systems and products that are designed to ship, scale, and endure.",
      color: "text-gb-blue",
      bg: "bg-gb-blue/10",
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Incubation",
      description: "For ideas with long-term potential, we co-build alongside founders — investing time, experience, and belief to bring future-ready products to life.",
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
              How We Build
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              Three Ways We Help Founders Build for the Future
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We partner with founders at critical moments — helping them think clearly, build deliberately, and bring enduring products into the world.
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
