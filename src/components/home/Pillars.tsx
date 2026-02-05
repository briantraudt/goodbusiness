
import React from 'react';
import { Building2, Cpu, Replace, BarChart3, ArrowRight } from 'lucide-react';
import { Card } from "@/components/ui/card";
import ScrollReveal from '@/components/common/ScrollReveal';
import ScrollToTopLink from '@/components/common/ScrollToTopLink';

const Pillars = () => {
  const services = [
    {
      title: "Internal Business Software",
      description: "Custom tools designed around how your team actually operates — CRMs, dashboards, workflow tools, and more.",
      icon: <Building2 className="h-8 w-8" />,
      color: "bg-gb-green/10 text-gb-green border-gb-green/20",
      hoverColor: "group-hover:bg-gb-green group-hover:text-white"
    },
    {
      title: "AI-Native Workflows",
      description: "Automation and intelligence built directly into your systems — not bolted on as an afterthought.",
      icon: <Cpu className="h-8 w-8" />,
      color: "bg-gb-blue/10 text-gb-blue border-gb-blue/20",
      hoverColor: "group-hover:bg-gb-blue group-hover:text-white"
    },
    {
      title: "SaaS Replacement Tools",
      description: "Purpose-built software that replaces multiple expensive licenses with one owned solution.",
      icon: <Replace className="h-8 w-8" />,
      color: "bg-gb-purple/10 text-gb-purple border-gb-purple/20",
      hoverColor: "group-hover:bg-gb-purple group-hover:text-white"
    },
    {
      title: "Data & Decision Systems",
      description: "Dashboards, analytics, and insights designed for real decisions — not vanity metrics.",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "bg-gb-orange/10 text-gb-orange border-gb-orange/20",
      hoverColor: "group-hover:bg-gb-orange group-hover:text-white"
    },
  ];

  return (
    <section className="bg-white">
      <div className="container-custom py-16 md:py-24">
        <ScrollReveal direction="up">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-purple font-semibold text-sm uppercase tracking-wider mb-3">
              What We Build
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-4">
              Software That Replaces Your SaaS Stack
            </h2>
            <p className="text-lg text-gb-dark/60 max-w-2xl mx-auto">
              We help you own the tools that run your business
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100} className="h-full">
              <Card className="group p-6 md:p-8 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-xl border border-slate-100 h-full">
                <div className="flex flex-col h-full">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 border transition-colors duration-300 ${service.color} ${service.hoverColor}`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gb-dark mb-3">{service.title}</h3>
                  <p className="text-gb-dark/70 text-base md:text-lg flex-grow">{service.description}</p>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal direction="up" delay={400}>
          <div className="text-center mt-12">
            <ScrollToTopLink 
              to="/consulting" 
              className="inline-flex items-center text-gb-green font-semibold hover:text-gb-green/80 transition-colors group text-lg"
            >
              See all our services 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </ScrollToTopLink>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default Pillars;
