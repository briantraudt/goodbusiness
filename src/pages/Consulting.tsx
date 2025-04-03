
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Consulting = () => {
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
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gb-light to-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gb-dark mb-6">
              Consulting Services
            </h1>
            <p className="text-xl text-gb-dark/80">
              We don't just consult—we build. We come alongside leaders and help them execute.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gb-dark mb-6">Services We Offer</h2>
            <p className="text-lg text-gb-dark/80">
              Our consulting approach is hands-on and results-focused. We work closely with leaders to solve real problems and create lasting change.
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

      {/* Who We Help */}
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

      {/* Process */}
      <section className="bg-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gb-dark mb-6 text-center">Our Process</h2>
            
            <div className="space-y-12 mt-12">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                  <div className="bg-gb-green text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">1</div>
                  <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gb-dark mb-2">Discovery & Diagnosis</h3>
                  <p className="text-gb-dark/80 mb-4">
                    We start by understanding your business, challenges, and goals through in-depth conversations and analysis.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                  <div className="bg-gb-blue text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">2</div>
                  <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gb-dark mb-2">Strategy Development</h3>
                  <p className="text-gb-dark/80 mb-4">
                    We collaborate with you to create a tailored plan that addresses your specific needs and opportunities.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                  <div className="bg-gb-purple text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">3</div>
                  <div className="hidden md:block w-px h-full bg-gray-200 mx-auto mt-2"></div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gb-dark mb-2">Implementation Support</h3>
                  <p className="text-gb-dark/80 mb-4">
                    Unlike traditional consultants, we roll up our sleeves and help you execute the plan, making adjustments as needed.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-16 flex-shrink-0 flex md:flex-col items-center md:items-start">
                  <div className="bg-gb-yellow text-white h-10 w-10 rounded-full flex items-center justify-center font-bold text-lg">4</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gb-dark mb-2">Ongoing Partnership</h3>
                  <p className="text-gb-dark/80 mb-4">
                    We provide regular check-ins, accountability, and guidance to ensure lasting results and continued growth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gb-dark text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to start building a better business?</h2>
            <p className="text-xl text-white/80 mb-8">
              Let's discuss how we can help you achieve your business goals and create lasting impact.
            </p>
            <Button asChild className="btn-primary text-lg group">
              <Link to="/contact">
                Book a Call
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Consulting;
