
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const ConsultingServices = () => {
  const services = [
    {
      title: "Strategy & Execution",
      description: "We help leaders align vision with action and implement the right systems and processes to achieve their goals.",
      points: [
        "Strategic planning and roadmapping",
        "Business model refinement",
        "Execution frameworks and accountability",
        "KPI development and performance tracking"
      ]
    },
    {
      title: "Leadership & Team Development",
      description: "We work with executives and teams to build healthy cultures, improve communication, and resolve dysfunction.",
      points: [
        "Leadership coaching and development",
        "Team alignment workshops",
        "Culture building and reinforcement",
        "Conflict resolution and communication improvement"
      ]
    },
    {
      title: "Startup Growth & Turnaround",
      description: "We help entrepreneurs launch new ventures, navigate pivots, or fix underperforming businesses.",
      points: [
        "Market validation and positioning",
        "Growth strategy and scaling plans",
        "Financial modeling and fundraising support",
        "Turnaround and restructuring"
      ]
    }
  ];

  return (
    <section className="bg-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gb-dark mb-6">Services We Offer</h2>
          <p className="text-lg text-gb-dark/80">
            Our consulting approach is hands-on and results-focused.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col h-full">
              <h3 className="text-xl font-bold text-gb-dark mb-3">{service.title}</h3>
              <p className="text-gb-dark/70 mb-6">{service.description}</p>
              <ul className="space-y-3 mb-6">
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
