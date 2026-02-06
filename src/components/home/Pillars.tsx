import React, { useState, useEffect } from 'react';
import { Compass, Layers, Wrench, CalendarCheck } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import outcomesBg from '@/assets/outcomes-bg.jpg';

const Pillars = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const img = new Image();
    img.src = outcomesBg;
    img.onload = () => setImageLoaded(true);
  }, []);

  const outcomes = [
    {
      title: "Clarity",
      icon: <Compass className="h-8 w-8" />,
      color: "text-gb-green"
    },
    {
      title: "Direction",
      icon: <Layers className="h-8 w-8" />,
      color: "text-gb-blue"
    },
    {
      title: "Execution",
      icon: <Wrench className="h-8 w-8" />,
      color: "text-gb-purple"
    },
    {
      title: "Momentum",
      icon: <CalendarCheck className="h-8 w-8" />,
      color: "text-gb-orange"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image with parallax */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-fixed transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${outcomesBg})` }}
        />
        <div className="absolute inset-0 bg-white/70"></div>
      </div>
      <div className="container-custom relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-purple font-semibold text-sm uppercase tracking-wider mb-3">
              What You Walk Away With
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gb-dark">
              Clarity, Direction & a Real Product
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {outcomes.map((outcome, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 80}>
              <div className="text-center p-6 md:p-8 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-100 hover:shadow-md transition-all h-full flex flex-col items-center justify-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 ${outcome.color} mb-4`}>
                  {outcome.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gb-dark">{outcome.title}</h3>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
