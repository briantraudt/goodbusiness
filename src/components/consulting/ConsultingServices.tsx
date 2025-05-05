
import React from 'react';
import { CheckCircle2, Code, Palette, Rocket } from 'lucide-react';

const ConsultingServices = () => {
  const services = [
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
      title: "Software Development",
      description: "Our engineers build scalable, maintainable solutions using modern technologies and best practices.",
      points: [
        "Full-stack web development",
        "Mobile app development",
        "API design and integration",
        "Cloud architecture and deployment"
      ],
      icon: <Code className="h-10 w-10 text-gb-purple mb-4" />
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
    }
  ];

  return (
    <section className="bg-white">
      <div className="container-custom py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full items-center text-center">
              {service.icon}
              <h3 className="text-xl font-bold text-gb-dark mb-3">{service.title}</h3>
              <p className="text-gb-dark/70 mb-6">{service.description}</p>
              <ul className="space-y-3 mb-6 text-left w-full">
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
