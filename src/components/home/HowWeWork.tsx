import React, { useState, useEffect } from 'react';
import { Compass, Layers, Rocket, RefreshCw, Moon, Lightbulb, Clock, Heart } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import clientsBg from '@/assets/clients-bg.jpg';

const HowWeWork = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = clientsBg;
    img.onload = () => setImageLoaded(true);
  }, []);

  const steps = [
    {
      number: "01",
      title: "Clarify",
      subtitle: "Define what to build — and what to skip.",
      icon: <Compass className="h-7 w-7" />,
      color: "text-gb-green",
      bg: "bg-gb-green/10"
    },
    {
      number: "02",
      title: "Shape",
      subtitle: "Turn a messy idea into a shippable first version.",
      icon: <Layers className="h-7 w-7" />,
      color: "text-gb-blue",
      bg: "bg-gb-blue/10"
    },
    {
      number: "03",
      title: "Build",
      subtitle: "Hands-on execution. Fast, simple, testable.",
      icon: <Rocket className="h-7 w-7" />,
      color: "text-gb-purple",
      bg: "bg-gb-purple/10"
    },
    {
      number: "04",
      title: "Iterate",
      subtitle: "Adjust based on real feedback. Grow intentionally.",
      icon: <RefreshCw className="h-7 w-7" />,
      color: "text-gb-orange",
      bg: "bg-gb-orange/10"
    }
  ];

  const founderTypes = [
    { title: "Nights & Weekends", icon: <Moon className="h-6 w-6 text-gb-green" /> },
    { title: "Non-Technical", icon: <Lightbulb className="h-6 w-6 text-gb-blue" /> },
    { title: "Almost Ready", icon: <Clock className="h-6 w-6 text-gb-purple" /> },
    { title: "Need a Partner", icon: <Heart className="h-6 w-6 text-gb-orange" /> },
  ];

  return (
    <section id="services" className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image with parallax */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-fixed transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${clientsBg})` }}
        />
        <div className="absolute inset-0 bg-white/75"></div>
      </div>

      <div className="container-custom relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-14 md:mb-20">
            <span className="inline-block text-gb-blue font-semibold text-sm uppercase tracking-wider mb-3">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gb-dark">
              Clarity → Product → Growth
            </h2>
          </div>
        </ScrollReveal>

        {/* Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <ScrollReveal key={step.number} direction="up" delay={index * 100}>
              <div className="text-center flex flex-col items-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.bg} ${step.color} mb-4`}>
                  {step.icon}
                </div>
                <span className="text-3xl font-extrabold text-gb-dark/10 mb-1">{step.number}</span>
                <h3 className="text-2xl font-bold text-gb-dark mb-2">{step.title}</h3>
                <p className="text-gb-dark/60 text-sm leading-relaxed">{step.subtitle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Founder Types — compact strip */}
        <ScrollReveal direction="up" delay={200}>
          <div className="mt-16 md:mt-20 pt-12 border-t border-slate-200/60">
            <p className="text-center text-sm font-semibold uppercase tracking-wider text-gb-purple mb-8">
              Built for Founders Like You
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 max-w-3xl mx-auto">
              {founderTypes.map((founder, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2.5 bg-white/90 backdrop-blur-sm px-5 py-3 rounded-full border border-slate-100 shadow-sm"
                >
                  {founder.icon}
                  <span className="text-sm font-semibold text-gb-dark">{founder.title}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default HowWeWork;
