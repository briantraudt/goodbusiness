
import React from 'react';
import { Globe, Smartphone, Bot, Database } from 'lucide-react';
import { Card } from "@/components/ui/card";
import ScrollReveal from '@/components/common/ScrollReveal';

const Pillars = () => {
  const services = [
    {
      title: "Web Apps",
      description: "Modern, responsive web applications.",
      icon: <Globe className="h-14 w-14 text-gb-green" />,
    },
    {
      title: "Mobile Apps",
      description: "Native iOS and Android experiences.",
      icon: <Smartphone className="h-14 w-14 text-gb-blue" />,
    },
    {
      title: "AI & Automation",
      description: "Intelligent workflows and assistants.",
      icon: <Bot className="h-14 w-14 text-gb-purple" />,
    },
    {
      title: "Data & Analytics",
      description: "Insights that drive decisions.",
      icon: <Database className="h-14 w-14 text-gb-orange" />,
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="container-custom py-10 md:py-16">
        <ScrollReveal direction="up">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">What We Build</h2>
            <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
              End-to-end software solutions.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {services.map((service, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100} className="h-full">
              <Card className="p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg h-full">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gb-dark mb-2 md:mb-3">{service.title}</h3>
                  <p className="text-gb-dark/70 text-lg">{service.description}</p>
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
