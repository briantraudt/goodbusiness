import React, { useEffect } from 'react';
import { Mail, MapPin, MessageCircle } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const ContactSection = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="contact" className="bg-gb-dark text-white py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Left side - messaging */}
              <div className="flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-gb-green text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit">
                  <MessageCircle className="h-4 w-4" />
                  FREE 30 Minute Founder Clarity Call
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Talk Through Your Idea
                </h2>
                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                  No pitch. No pressure. Just a thoughtful conversation about what you're building 
                  and whether it's worth building. Pick a time that works for you.
                </p>
                <div className="space-y-4">
                  <a href="mailto:hello@goodbusinesshq.com" className="flex items-center gap-3 text-white/80 hover:text-gb-green transition-colors">
                    <Mail className="h-5 w-5 text-gb-green" />
                    hello@goodbusinesshq.com
                  </a>
                  <div className="flex items-center gap-3 text-white/80">
                    <MapPin className="h-5 w-5 text-gb-green" />
                    Austin, TX
                  </div>
                </div>
              </div>

              {/* Right side - Calendly */}
              <div>
                <div
                  className="calendly-inline-widget"
                  data-url="https://calendly.com/briantraudt/free-intro-meeting?hide_event_type_details=1&hide_gdpr_banner=1"
                  style={{ minWidth: '320px', height: '700px' }}
                />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ContactSection;
