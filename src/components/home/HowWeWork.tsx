import React, { useState, useEffect } from 'react';
import { Rocket, Handshake, Compass } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import clientsBg from '@/assets/clients-bg.jpg';

const HowWeWork = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = clientsBg;
    img.onload = () => setImageLoaded(true);
  }, []);

  const pillars = [
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Direction",
      description: "We help founders slow down long enough to get the right things right — defining the problem, the customer, and what not to build.",
      color: "text-gb-green",
      bg: "bg-gb-green/10",
      border: "border-gb-green/20"
    },
    {
      icon: <Handshake className="h-8 w-8" />,
      title: "Execution",
      description: "We work hands-on with founders and teams to turn strategy into execution — shaping products, systems, and momentum that actually ship.",
      color: "text-gb-blue",
      bg: "bg-gb-blue/10",
      border: "border-gb-blue/20"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Incubation",
      description: "We co-build and launch products alongside founders — investing time, experience, and conviction to bring real ideas into the world.",
      color: "text-gb-purple",
      bg: "bg-gb-purple/10",
      border: "border-gb-purple/20"
    }
  ];

  return (
    <section id="how-we-help" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image with parallax */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-fixed transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${clientsBg})` }}
        />
        <div className="absolute inset-0 bg-white/80"></div>
      </div>

      <div className="container-custom relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-3">
              What We Do
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gb-dark mb-4">
              Three Ways We Work With Founders
            </h2>
            <p className="text-lg text-gb-dark/60 max-w-2xl mx-auto">
              We build products, partner with founders, and support teams at every stage — from first idea to real-world execution.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {pillars.map((pillar, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 120}>
              <div className={`bg-white/90 backdrop-blur-sm rounded-2xl p-8 md:p-10 border ${pillar.border} hover:shadow-lg transition-all h-full flex flex-col items-center text-center`}>
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${pillar.bg} ${pillar.color} mb-6`}>
                  {pillar.icon}
                </div>
                <h3 className="text-2xl font-bold text-gb-dark mb-3">{pillar.title}</h3>
                <p className="text-gb-dark/60 leading-relaxed">{pillar.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowWeWork;
