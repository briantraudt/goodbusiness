
import React from 'react';

const ConsultingClients = () => {
  const clientTypes = [
    {
      title: "Small to mid-sized business owners",
      description: "Established businesses looking to break through growth plateaus or prepare for the next stage of expansion."
    },
    {
      title: "Faith-driven entrepreneurs",
      description: "Founders who want to build businesses that honor their faith while creating exceptional value for customers and stakeholders."
    },
    {
      title: "Struggling teams or plateaued companies",
      description: "Organizations facing dysfunction, misalignment, or stalled growth that need help getting back on track."
    }
  ];

  return (
    <section className="bg-gray-50">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gb-dark mb-6">Who We Help</h2>
          <p className="text-lg text-gb-dark/80">
            We work best with leaders who are committed to building businesses with purpose and are ready to execute on their vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {clientTypes.map((client, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all h-full">
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
