
import React from 'react';
import { Building2, Cpu, Replace, BarChart3 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import ScrollReveal from '@/components/common/ScrollReveal';

const Pillars = () => {
  const services = [
    {
      title: "Internal Business Software",
      description: "Custom tools designed around how your team actually operates.",
      icon: <Building2 className="h-12 w-12 text-gb-green" />,
    },
    {
      title: "AI-Native Workflows",
      description: "Automation and intelligence built directly into your systems — not bolted on.",
      icon: <Cpu className="h-12 w-12 text-gb-blue" />,
    },
    {
      title: "SaaS Replacement Tools",
      description: "Purpose-built software that replaces multiple licenses with one owned solution.",
      icon: <Replace className="h-12 w-12 text-gb-purple" />,
    },
    {
      title: "Data & Decision Systems",
      description: "Dashboards, analytics, and insights designed for real decisions, not vanity metrics.",
      icon: <BarChart3 className="h-12 w-12 text-gb-orange" />,
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="container-custom py-16 md:py-24">
        <ScrollReveal direction="up">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">What We Help You Build</h2>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100} className="h-full">
              <Card className="p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg h-full">
                <div className="flex flex-col h-full">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl md:text-2xl font-bold text-gb-dark mb-3">{service.title}</h3>
                  <p className="text-gb-dark/70 text-base md:text-lg">{service.description}</p>
                </div>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
