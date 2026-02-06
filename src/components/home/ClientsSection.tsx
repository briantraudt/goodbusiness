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
      subtitle: "Every hour counts. We respect that.",
      icon: <Moon className="h-10 w-10 text-gb-green" />
    },
    {
      title: "Non-Technical Founders",
      subtitle: "Vision meets execution.",
      icon: <Lightbulb className="h-10 w-10 text-gb-blue" />
    },
    {
      title: "Stuck in 'Almost Ready'",
      subtitle: "Stop perfecting. Start shipping.",
      icon: <Clock className="h-10 w-10 text-gb-purple" />
    },
    {
      title: "Looking for a Partner",
      subtitle: "Honest feedback. Real help.",
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
            <h2 className="text-4xl md:text-5xl font-bold text-gb-dark">
              Built for Founders
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {founderTypes.map((founder, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 80}>
              <div className="bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all h-full flex flex-col items-center text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                  {founder.icon}
                </div>
                <h3 className="text-lg font-bold text-gb-dark mb-1">{founder.title}</h3>
                <p className="text-gb-dark/60 text-sm">{founder.subtitle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
