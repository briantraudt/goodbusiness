
import React from 'react';
import { Rocket, Zap, Clock } from 'lucide-react';
import { CheckCircle2 } from 'lucide-react';

const ConsultingServices = () => {
  const services = [
    {
      title: "Rapid Prototyping",
      description: "Transform ideas into functional prototypes in as little as 7 days. Get real user feedback before investing in full development.",
      points: [
        "Interactive wireframes and mockups",
        "Working MVP development",
        "User testing and validation",
        "Quick iteration based on feedback"
      ],
      icon: <Rocket className="h-10 w-10 text-gb-blue mb-4" />
    },
    {
      title: "Speed-to-Market",
      description: "Launch your product before your competition with our accelerated development process that cuts months off traditional timelines.",
      points: [
        "Efficient development workflows",
        "Parallel work streams",
        "Progressive feature releases",
        "Continuous deployment"
      ],
      icon: <Zap className="h-10 w-10 text-gb-purple mb-4" />
    },
    {
      title: "Agile Development",
      description: "Our time-boxed sprints deliver tangible results every week, ensuring your product evolves quickly while adapting to new insights.",
      points: [
        "Weekly delivery cycles",
        "Flexible priority adjustment",
        "Transparent progress tracking",
        "Continuous quality assurance"
      ],
      icon: <Clock className="h-10 w-10 text-gb-green mb-4" />
    }
  ];

  return (
    <section className="bg-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gb-dark mb-6">From Idea to Reality, Fast</h2>
          <p className="text-lg text-gb-dark/80">
            We specialize in accelerated development that brings your vision to life in record time.
          </p>
        </div>

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
