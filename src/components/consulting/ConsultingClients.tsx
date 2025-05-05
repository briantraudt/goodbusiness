
import React from 'react';
import { Lightbulb, Users, Code } from 'lucide-react';

const ConsultingClients = () => {
  const clientTypes = [
    {
      title: "Individuals with Software Ideas",
      description: "Entrepreneurs and visionaries with ideas that need technical expertise to bring their software concepts to life and reach their target market.",
      icon: <Lightbulb className="h-10 w-10 text-gb-blue mb-4" />
    },
    {
      title: "Teams Needing Execution Support",
      description: "Product teams that need additional technical expertise to accelerate development, overcome challenges, or introduce new technologies.",
      icon: <Users className="h-10 w-10 text-gb-purple mb-4" />
    },
    {
      title: "Companies Scaling Products",
      description: "Organizations looking to improve existing products, build new digital offerings, or transform legacy systems into modern applications.",
      icon: <Code className="h-10 w-10 text-gb-green mb-4" />
    }
  ];

  return (
    <section className="bg-[#F1F0FB]/30">
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-gb-dark mb-6">Who We Work With</h2>
          <p className="text-lg text-gb-dark/80">
            We partner with innovators at every stage to transform software ideas into reality, providing the technical expertise to build, launch, and scale digital products.
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
