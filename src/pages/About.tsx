
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gb-dark text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About Good Business
            </h1>
            <p className="text-xl text-white/80">
              We're on a mission to build businesses that transform lives and create lasting value.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Bio */}
      <section className="bg-white">
        <div className="container-custom py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/498e129d-9256-4a33-8c97-44d8418ea502.png" 
                alt="Founder of Good Business" 
                className="rounded-lg shadow-md w-full max-w-md h-auto"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gb-dark mb-6">Our Founder</h2>
              <p className="text-lg text-gb-dark/80 mb-4">
                Good Business was founded by a leader with over 15 years of experience building and scaling purpose-driven companies.
              </p>
              <p className="text-lg text-gb-dark/80 mb-4">
                After founding and successfully exiting multiple technology startups, they realized that the most fulfilling work came from building businesses that genuinely improved people's lives while delivering strong financial results.
              </p>
              <p className="text-lg text-gb-dark/80 mb-4">
                This realization led to the creation of Good Business—a venture studio and consulting firm designed to help other leaders build companies with purpose, excellent execution, and lasting impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50">
        <div className="container-custom py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gb-dark mb-6">What Drives Us</h2>
              <p className="text-lg text-gb-dark/80 mb-4">
                We believe that business is one of the most powerful forces for positive change in the world when led with purpose and integrity.
              </p>
              <p className="text-lg text-gb-dark/80 mb-4">
                Our faith informs our commitment to excellence, honesty, and service. We believe in honoring God through our work and treating all stakeholders—customers, employees, partners, and communities—with dignity and respect.
              </p>
              <p className="text-lg text-gb-dark/80">
                At Good Business, we're passionate about using our experience, expertise, and resources to help build companies that create meaningful impact while achieving sustainable growth and profitability.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gb-dark mb-6">Our Experience</h2>
              <ul className="space-y-4">
                <li className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gb-dark mb-2">
                    Startup Leadership
                  </h3>
                  <p className="text-gb-dark/80">
                    Founded and scaled multiple seven-figure businesses from concept to exit.
                  </p>
                </li>
                <li className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gb-dark mb-2">
                    Executive Coaching
                  </h3>
                  <p className="text-gb-dark/80">
                    Guided dozens of leaders through critical business inflection points and personal growth.
                  </p>
                </li>
                <li className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold text-gb-dark mb-2">
                    Team Building
                  </h3>
                  <p className="text-gb-dark/80">
                    Built high-performing teams across industries, with a focus on culture and alignment.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Vision for Good Business */}
      <section className="bg-gb-dark text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Vision</h2>
            <p className="text-xl text-white/80 mb-8">
              We envision a world where business is a force for good—where companies measure success not just by profits, but by the positive impact they create for all stakeholders.
            </p>
            <p className="text-xl text-white/80 mb-8">
              Good Business exists to accelerate this future by building, advising, and investing in purpose-driven companies that deliver extraordinary value while solving meaningful problems.
            </p>
            <Button asChild className="btn-primary text-lg group">
              <Link to="/contact">
                Join Our Mission
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default About;
