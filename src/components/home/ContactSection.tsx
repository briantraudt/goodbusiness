import React, { useEffect } from 'react';
import { Mail, MapPin } from 'lucide-react';
import ScrollReveal from '@/components/common/ScrollReveal';

const BRAND_BLUE = 'hsl(210, 55%, 55%)';

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
    <section id="contact" className="relative text-foreground py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Left side - messaging */}
              <div className="flex flex-col justify-center">
                <div
                  className="inline-flex items-center text-white px-4 py-2 rounded-full text-sm font-medium mb-6 w-fit"
                  style={{ backgroundColor: BRAND_BLUE }}
                >
                   FREE 30 Minute Founder Call
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Talk Through Your Idea
                </h2>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  No pitch. No pressure. Just a thoughtful conversation about what you're building 
                  and whether it's worth building. Pick a time that works for you.
                </p>
                <div className="space-y-4">
                  <a href="mailto:hello@goodbusinesshq.com" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                    <Mail className="h-5 w-5" style={{ color: BRAND_BLUE }} />
                    hello@goodbusinesshq.com
                  </a>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5" style={{ color: BRAND_BLUE }} />
                    Austin, TX
                  </div>
                </div>
              </div>

              {/* Right side - Calendly (dark mode) */}
              <div>
                <div
                  className="calendly-inline-widget rounded-xl overflow-hidden"
                  data-url="https://calendly.com/briantraudt/free-intro-meeting?hide_event_type_details=1&hide_gdpr_banner=1&background_color=1a1f2e&text_color=e0e4ed&primary_color=4a90c4"
                  style={{ minWidth: '280px', height: '480px' }}
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
