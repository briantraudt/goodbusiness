
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    interest: 'consulting'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message sent successfully!",
        description: "We'll be in touch with you soon.",
        variant: "default",
      });
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        interest: 'consulting'
      });
    }, 1500);
  };

  return (
    <PageLayout>
      {/* Hero Section with darker blue background */}
      <section className="bg-[#1A5392]">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Work With Us
            </h1>
            <p className="text-xl text-white/90">
              Let's build something that lasts.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white">
        <div className="container-custom py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold text-gb-dark mb-6">Get in Touch</h2>
              <p className="text-lg text-gb-dark/80 mb-8">
                Whether you're looking for consulting support, interested in our ventures, or want to explore a potential partnership, we're here to help.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gb-dark mb-1">
                    Name
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gb-dark mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gb-dark mb-1">
                    Company
                  </label>
                  <input 
                    type="text" 
                    id="company" 
                    name="company" 
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="interest" className="block text-sm font-medium text-gb-dark mb-1">
                    I'm interested in
                  </label>
                  <select 
                    id="interest" 
                    name="interest" 
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green focus:border-transparent"
                  >
                    <option value="consulting">Consulting Services</option>
                    <option value="ventures">Learning About Ventures</option>
                    <option value="partnership">Exploring a Partnership</option>
                    <option value="other">Something Else</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gb-dark mb-1">
                    Message
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green focus:border-transparent"
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  className="btn-primary text-lg group w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Send Message
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            <div>
              <div className="bg-gray-50 p-8 rounded-lg h-full">
                <h3 className="text-2xl font-bold text-gb-dark mb-6">What Happens Next?</h3>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gb-green flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gb-dark mb-1">Initial Response</h4>
                      <p className="text-gb-dark/70">
                        We'll respond to your inquiry within 1-2 business days.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gb-blue flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gb-dark mb-1">Discovery Call</h4>
                      <p className="text-gb-dark/70">
                        We'll schedule a 30-minute call to learn more about your needs and how we might help.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gb-purple flex items-center justify-center">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gb-dark mb-1">Proposal & Next Steps</h4>
                      <p className="text-gb-dark/70">
                        If there's a good fit, we'll provide a tailored proposal outlining how we can work together.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-bold text-gb-dark mb-4">Prefer to schedule directly?</h4>
                  <p className="text-gb-dark/70 mb-6">
                    You can also book a call directly on our calendar.
                  </p>
                  <Button className="bg-gb-blue hover:bg-gb-blue/90 text-white font-semibold w-full">
                    Schedule a Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50">
        <div className="container-custom py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gb-dark mb-10 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gb-dark mb-2">
                  What types of businesses do you work with?
                </h3>
                <p className="text-gb-dark/80">
                  We primarily work with small to mid-sized businesses, startups, and faith-driven entrepreneurs who are committed to building purpose-driven companies that create positive impact.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gb-dark mb-2">
                  What are your consulting rates?
                </h3>
                <p className="text-gb-dark/80">
                  Our engagements are customized based on the scope and needs of each client. Typically, we work on project-based fees or retainer arrangements. We're happy to discuss pricing during our initial consultation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gb-dark mb-2">
                  How long does a typical engagement last?
                </h3>
                <p className="text-gb-dark/80">
                  Most of our consulting engagements run for 3-6 months, though we have both shorter and longer-term relationships depending on the client's needs. Our venture partnerships are typically multi-year commitments.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gb-dark mb-2">
                  Do you only work with faith-based businesses?
                </h3>
                <p className="text-gb-dark/80">
                  While our values are informed by our faith, we work with clients from diverse backgrounds who share our commitment to purpose-driven business and creating positive impact. We welcome conversations with anyone interested in building good businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
