import React from 'react';
import { Compass, Layers, Code, CalendarCheck } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const ServicesSection = () => {
  const services = [
    {
      title: "Idea Clarity",
      subtitle: "Know what to build — and what to skip.",
      icon: <Compass className="h-12 w-12" />,
      color: "text-gb-green",
      bg: "bg-gb-green/10"
    },
    {
      title: "Product Shaping",
      subtitle: "Turn a messy idea into a focused MVP.",
      icon: <Layers className="h-12 w-12" />,
      color: "text-gb-blue",
      bg: "bg-gb-blue/10"
    },
    {
      title: "Build With You",
      subtitle: "Hands-on execution, not hand-offs.",
      icon: <Code className="h-12 w-12" />,
      color: "text-gb-purple",
      bg: "bg-gb-purple/10"
    },
    {
      title: "Weekly Support",
      subtitle: "Accountability that keeps you moving.",
      icon: <CalendarCheck className="h-12 w-12" />,
      color: "text-gb-orange",
      bg: "bg-gb-orange/10"
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
            <h2 className="text-4xl md:text-5xl font-bold text-gb-dark">
              Guidance + Execution
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 80}>
              <div className="text-center p-8 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all h-full flex flex-col items-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${service.bg} ${service.color} mb-6`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gb-dark mb-2">{service.title}</h3>
                <p className="text-gb-dark/60 text-sm">{service.subtitle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
