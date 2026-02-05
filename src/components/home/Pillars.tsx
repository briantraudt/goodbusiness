import React, { useState, useEffect } from 'react';
import { TrendingUp, Settings, Brain, Rocket, Building2 } from 'lucide-react';
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
      title: "Revenue Growth",
      description: "Through smarter workflows and automation",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-gb-green"
    },
    {
      title: "Operational Efficiency",
      description: "By removing friction and manual work",
      icon: <Settings className="h-6 w-6" />,
      color: "text-gb-blue"
    },
    {
      title: "Clear Decision-Making",
      description: "Powered by actionable data and AI",
      icon: <Brain className="h-6 w-6" />,
      color: "text-gb-purple"
    },
    {
      title: "Faster Execution",
      description: "From idea to impact",
      icon: <Rocket className="h-6 w-6" />,
      color: "text-gb-orange"
    },
    {
      title: "Scalable Foundations",
      description: "That grow with the business",
      icon: <Building2 className="h-6 w-6" />,
      color: "text-gb-green"
    }
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={outcomesBg}
          alt="" 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
        {/* Light overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/70"></div>
      </div>
      <div className="container-custom relative z-10">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-purple font-semibold text-sm uppercase tracking-wider mb-3">
              Results That Matter
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-4">
              The Impact We Create
            </h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-10">
          {outcomes.map((outcome, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 80}>
              <div className="text-center p-6 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all h-full">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 ${outcome.color} mb-4`}>
                  {outcome.icon}
                </div>
                <h3 className="text-gb-dark font-semibold mb-2">{outcome.title}</h3>
                <p className="text-gb-dark/60 text-sm">{outcome.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={400}>
          <div className="text-center">
            <p className="text-lg text-gb-dark/70 font-medium">
              If it doesn't move the needle, <span className="text-gb-green font-semibold">we don't build it.</span>
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Pillars;
