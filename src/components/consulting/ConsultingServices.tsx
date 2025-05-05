
import React from 'react';
import { CheckCircle2, Code, Palette, Rocket, Type } from 'lucide-react';

const ConsultingServices = () => {
  const services = [
    {
      title: "Naming/Branding",
      description: "We develop memorable brand identities that resonate with your audience and stand out in the market.",
      points: [
        "Brand strategy and positioning",
        "Name generation",
        "Visual identity development",
        "Brand guidelines and assets"
      ],
      icon: <Type className="h-10 w-10 text-gb-purple mb-4" />
    },
    {
      title: "UI/UX Design",
      description: "We create intuitive, beautiful interfaces that elevate your product and delight your users.",
      points: [
        "User research and journey mapping",
        "Wireframing and prototyping",
        "Visual design and brand integration",
        "Usability testing and refinement"
      ],
      icon: <Palette className="h-10 w-10 text-gb-blue mb-4" />
    },
    {
      title: "Rapid Prototyping",
      description: "Turn ideas into interactive products in days, not months, and validate concepts with real users quickly.",
      points: [
        "Concept validation workshops",
        "MVP development and iteration",
        "User testing and feedback collection",
        "Scalable architecture planning"
      ],
      icon: <Rocket className="h-10 w-10 text-gb-green mb-4" />
    },
    {
      title: "Build & Launch",
      description: "Our engineers build scalable, maintainable solutions using modern technologies and best practices.",
      points: [
        "Full-stack web development",
        "Mobile app development",
        "API design and integration",
        "Cloud architecture and deployment"
      ],
      icon: <Code className="h-10 w-10 text-gb-orange mb-4" />
    }
  ];

  return (
    <section className="bg-white">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full"
            >
              <div className="flex flex-col items-center text-center mb-3">
                {service.icon}
                <h3 className="text-xl font-bold text-gb-dark mb-2">{service.title}</h3>
                <p className="text-gb-dark/70">{service.description}</p>
              </div>
              
              <ul className="space-y-2 text-left w-full mt-2">
                {service.points.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-gb-green mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gb-dark/80">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultingServices;
