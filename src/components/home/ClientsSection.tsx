import React, { useState, useEffect } from 'react';
import { Building, Users, TrendingUp } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';
import clientsBg from '@/assets/clients-bg.jpg';

const ClientsSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = clientsBg;
    img.onload = () => setImageLoaded(true);
  }, []);

  const clientTypes = [
    {
      title: "Leaders Ready for AI",
      description: "Business owners who know AI is an opportunity — they just need the right partner to make it real and practical.",
      icon: <Building className="h-10 w-10 text-gb-green" />
    },
    {
      title: "Growing Teams Hitting Ceilings",
      description: "Companies scaling fast but drowning in manual processes that AI could handle in seconds.",
      icon: <TrendingUp className="h-10 w-10 text-gb-blue" />
    },
    {
      title: "Founders Building an Edge",
      description: "Visionaries who see AI as a competitive moat — not a cost center — and want to embed it into their DNA.",
      icon: <Users className="h-10 w-10 text-gb-purple" />
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
              Who We Work With
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-4">
              Built for Business Leaders, Not Engineers
            </h2>
            <p className="text-lg text-gb-dark/70">
              You don't need to understand neural networks. You need a partner who translates 
              AI's potential into measurable business growth.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {clientTypes.map((client, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100}>
              <div
                className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all h-full flex flex-col text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-5 mx-auto">
                  {client.icon}
                </div>
                <h3 className="text-xl font-bold text-gb-dark mb-3">{client.title}</h3>
                <p className="text-gb-dark/70">{client.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
