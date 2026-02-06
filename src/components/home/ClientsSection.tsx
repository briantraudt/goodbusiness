import React from 'react';
import { Building, Users, TrendingUp } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const ClientsSection = () => {
  const clientTypes = [
    {
      title: "Operators Drowning in SaaS",
      description: "Business leaders paying for 10+ tools that don't talk to each other and don't fit how their teams actually work.",
      icon: <Building className="h-10 w-10 text-gb-green" />
    },
    {
      title: "Growing Teams Hitting Limits",
      description: "Companies that have outgrown their current tools and need custom solutions that scale with their operations.",
      icon: <TrendingUp className="h-10 w-10 text-gb-blue" />
    },
    {
      title: "Founders Building Differentiation",
      description: "Leaders who see custom software as a competitive advantage — not just an expense.",
      icon: <Users className="h-10 w-10 text-gb-purple" />
    }
  ];

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <span className="inline-block text-gb-purple font-semibold text-sm uppercase tracking-wider mb-3">
              Who We Work With
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark mb-4">
              Built for Operators, Not Developers
            </h2>
            <p className="text-lg text-gb-dark/70">
              We partner with business leaders who are ready to stop renting and start owning
              the software that powers their operations.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {clientTypes.map((client, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 100}>
              <div
                className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all h-full flex flex-col text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-5 mx-auto">
                  {client.icon}
                </div>
                <h3 className="text-xl font-bold text-gb-dark mb-3">{client.title}</h3>
                <p className="text-gb-dark/70">{client.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsSection;
