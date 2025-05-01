
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export const ContactInfo = () => {
  return (
    <section className="bg-gb-dark text-white">
      <div className="container-custom py-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-white/80 mb-12">
            Ready to build something great? Let's talk about your project.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="flex flex-col items-center md:items-start">
              <Mail className="h-10 w-10 text-gb-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <a href="mailto:brian@goodbusinesshq.com" className="text-white/80 hover:text-gb-green transition-colors">
                brian@goodbusinesshq.com
              </a>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <Phone className="h-10 w-10 text-gb-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <a href="tel:+15127745010" className="text-white/80 hover:text-gb-green transition-colors">
                (512) 774-5010
              </a>
            </div>
            
            <div className="flex flex-col items-center md:items-start">
              <MapPin className="h-10 w-10 text-gb-green mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p className="text-white/80">
                Austin, TX
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ContactForm = () => {
  return (
    <section className="bg-white">
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gb-dark mb-8 text-center">Get In Touch</h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gb-dark mb-1">Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gb-dark mb-1">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                  placeholder="Your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gb-dark mb-1">Subject</label>
              <input 
                type="text" 
                id="subject" 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                placeholder="Subject"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gb-dark mb-1">Message</label>
              <textarea 
                id="message" 
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gb-green"
                placeholder="Your message"
                required
              ></textarea>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full bg-gb-green text-white font-semibold py-3 px-6 rounded-md hover:bg-gb-green/90 transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <div>
      <ContactInfo />
      <ContactForm />
    </div>
  );
};

export default Contact;
