import React, { useState, useEffect } from 'react';
import { Moon, Lightbulb, Clock, Heart } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import clientsBg from '@/assets/clients-bg.jpg';

const ClientsSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = clientsBg;
    img.onload = () => setImageLoaded(true);
  }, []);

  const founderTypes = [
    {
      title: "Nights & Weekends Builders",
      description: "You're building around a day job. Every hour matters. You need someone who respects your time and helps you spend it on what counts.",
      icon: <Moon className="h-10 w-10 text-gb-green" />
    },
    {
      title: "Non-Technical Founders",
      description: "You have strong instincts and domain knowledge. You don't need to learn to code — you need a partner who can translate your vision into product.",
      icon: <Lightbulb className="h-10 w-10 text-gb-blue" />
    },
    {
      title: "Stuck in 'Almost Ready'",
      description: "You've been planning, researching, tweaking. You need someone to help you stop perfecting and start shipping.",
      icon: <Clock className="h-10 w-10 text-gb-purple" />
    },
    {
      title: "Looking for a Partner, Not a Pitch",
      description: "You want honest feedback and real help — not someone trying to upsell you on a bigger engagement.",
      icon: <Heart className="h-10 w-10 text-gb-orange" />
    }
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Image with parallax */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className={`absolute inset-0 w-full h-full bg-cover bg-center bg-fixed transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${clientsBg})` }}
        />
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      <div className="container-custom relative z-10">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-purple font-semibold text-sm uppercase tracking-wider mb-3">
              Who This Is For
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-4">
              Built for Founders, Not Corporations
            </h2>
            <p className="text-lg text-gb-dark/70">
              If you're trying to figure out what to build, who it's for, and how to make it real — 
              you're in the right place.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {founderTypes.map((founder, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100}>
              <div
                className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all h-full flex flex-col"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-50 mb-5">
                  {founder.icon}
                </div>
                <h3 className="text-xl font-bold text-gb-dark mb-3">{founder.title}</h3>
                <p className="text-gb-dark/70">{founder.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={500}>
          <div className="text-center mt-12">
            <p className="text-gb-dark/50 text-sm italic max-w-lg mx-auto">
              This is not for founders looking to outsource their thinking or chase trends. 
              We work with people who are ready to do the work.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ClientsSection;
