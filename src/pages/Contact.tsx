
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-[#1A5392] text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Work With Us
            </h1>
            <p className="text-xl text-white/90">
              Let's build something good together. We're always looking for opportunities to partner with mission-aligned organizations and individuals.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white">
        <div className="container-custom py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gb-dark mb-6">Get in Touch</h2>
              <p className="text-lg text-gb-dark/80 mb-8">
                Fill out the form and we'll get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-medium text-gb-dark mb-2">Strategic Consulting</h3>
                    <p className="text-gb-dark/70">
                      Get expert guidance on your business challenges and growth opportunities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-medium text-gb-dark mb-2">Venture Partnership</h3>
                    <p className="text-gb-dark/70">
                      Explore opportunities to build or invest in purpose-driven ventures.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-medium text-gb-dark mb-2">Speaking & Workshops</h3>
                    <p className="text-gb-dark/70">
                      Book our team for engaging talks and workshops on business with purpose.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gb-dark mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gb-dark mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gb-dark mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gb-dark mb-2">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                  />
                </div>
                
                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gb-dark mb-2">
                    I'm interested in:
                  </label>
                  <select
                    id="interest"
                    name="interest"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                    required
                  >
                    <option value="">Select an option</option>
                    <option value="consulting">Strategic Consulting</option>
                    <option value="venture">Venture Partnership</option>
                    <option value="speaking">Speaking & Workshops</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gb-dark mb-2">
                    How can we help?
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                    required
                  ></textarea>
                </div>
                
                <Button type="submit" className="btn-primary text-lg group">
                  Submit
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
