
import React from 'react';
import { Rocket, Briefcase, Layers } from 'lucide-react';

const ConsultingClients = () => {
  const clientTypes = [
    {
      title: "Startups racing to market",
      description: "Launch your startup faster with an MVP that gets you in front of customers and investors before your funding runs out.",
      icon: <Rocket className="h-10 w-10 text-gb-blue mb-4" />
    },
    {
      title: "Businesses validating new ideas",
      description: "Test new product concepts with minimal investment before committing to full-scale development and market launch.",
      icon: <Briefcase className="h-10 w-10 text-gb-purple mb-4" />
    },
    {
      title: "Enterprises needing innovation",
      description: "Break through corporate bureaucracy with rapid prototyping that demonstrates value before lengthy approval processes.",
      icon: <Layers className="h-10 w-10 text-gb-green mb-4" />
    }
  ];

  return (
    <section className="bg-[#F1F0FB]/30">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gb-dark mb-6">Who We Help Accelerate</h2>
          <p className="text-lg text-gb-dark/80">
            We work with organizations that understand the competitive advantage of moving quickly in today's market.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clientTypes.map((client, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all h-full flex flex-col items-center text-center">
              {client.icon}
              <h3 className="text-xl font-bold text-gb-dark mb-3">{client.title}</h3>
              <p className="text-gb-dark/70">{client.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultingClients;
