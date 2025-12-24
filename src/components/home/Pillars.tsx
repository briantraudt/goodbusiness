
import React from 'react';
import { Globe, Smartphone, Bot, Database } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';

const Pillars = () => {
  const isMobile = useIsMobile();
  
  const services = [
    {
      title: "Web Applications",
      description: "Full-stack web applications built with modern frameworks like React, Next.js, and cloud-native backends.",
      icon: <Globe className="h-10 w-10 text-gb-green" />,
    },
    {
      title: "Mobile Apps",
      description: "Cross-platform mobile applications for iOS and Android using React Native and Flutter.",
      icon: <Smartphone className="h-10 w-10 text-gb-blue" />,
    },
    {
      title: "AI & Automation",
      description: "Custom AI solutions including chatbots, document processing, and intelligent workflow automation.",
      icon: <Bot className="h-10 w-10 text-gb-purple" />,
    },
    {
      title: "Data & Analytics",
      description: "Data pipelines, dashboards, and analytics platforms that turn your data into actionable insights.",
      icon: <Database className="h-10 w-10 text-gb-orange" />,
    },
  ];

  return (
    <section className="bg-gray-50">
      <div className="container-custom py-10 md:py-16">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">What We Build</h2>
          <p className="mt-3 text-lg text-gb-dark/70 max-w-2xl mx-auto">
            From web and mobile applications to AI-powered systems, we deliver end-to-end software solutions
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {services.map((service, index) => (
            <Card key={index} className="p-4 md:p-5 shadow-md hover:shadow-lg transition-shadow duration-300 bg-white rounded-lg">
              <div className="flex flex-col items-center text-center">
                <div className="mb-2 md:mb-3">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gb-dark mb-1 md:mb-2">{service.title}</h3>
                <p className="text-gb-dark/70 text-base">{service.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pillars;
