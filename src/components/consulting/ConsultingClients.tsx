
import React from 'react';
import { Briefcase, Users, Compass } from 'lucide-react';

const ConsultingClients = () => {
  const clientTypes = [
    {
      title: "Small to mid-sized business owners",
      description: "Established businesses looking to break through growth plateaus or prepare for the next stage of expansion.",
      icon: <Briefcase className="h-10 w-10 text-gb-blue mb-4" />
    },
    {
      title: "Faith-driven entrepreneurs",
      description: "Founders who want to build businesses that honor their faith while creating exceptional value for customers and stakeholders.",
      icon: <Users className="h-10 w-10 text-gb-purple mb-4" />
    },
    {
      title: "Struggling teams or plateaued companies",
      description: "Organizations facing dysfunction, misalignment, or stalled growth that need help getting back on track.",
      icon: <Compass className="h-10 w-10 text-gb-green mb-4" />
    }
  ];

  return (
    <section className="bg-[#F1F0FB]/30">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gb-dark mb-6">Who We Work With</h2>
          <p className="text-lg text-gb-dark/80">
            We work best with leaders who are committed to building businesses with purpose and are ready to execute on their vision.
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
