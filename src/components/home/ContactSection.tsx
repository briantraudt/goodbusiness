import React, { useState } from 'react';
import { ArrowRight, Mail, MapPin, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ScrollReveal from '@/components/common/ScrollReveal';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ContactSection = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error('Please fill out all fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Store as a business submission with minimal fields
      const { error } = await supabase.from('business_submissions').insert({
        full_name: name,
        email: email,
        business_idea: message,
        problem_solution: 'Contact form submission',
        profit_type: 'N/A',
        business_stage: 'N/A',
        budget: 'N/A',
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success('Message sent! We\'ll be in touch soon.');
    } catch (err) {
      console.error('Contact form error:', err);
      toast.error('Something went wrong. Please email us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-gb-dark text-white py-16 md:py-24">
      <div className="container-custom">
        <ScrollReveal direction="up">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {/* Left side - messaging */}
              <div>
                <div className="inline-flex items-center gap-2 bg-gb-green/20 text-gb-green px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <MessageCircle className="h-4 w-4" />
                  Free Consultation
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Tell Us What's Not Working
                </h2>
                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                  Share what you're dealing with — bloated SaaS, manual processes, tools that don't fit.
                  We'll show you what's possible.
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

              {/* Right side - form */}
              <div>
                {submitted ? (
                  <div className="bg-white/10 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold mb-3">Thanks for reaching out!</h3>
                    <p className="text-white/70">We'll review your message and get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="What are you working on? What's not working with your current tools?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[140px]"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-6 text-lg group"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Start the Conversation
                          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ContactSection;
