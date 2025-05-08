
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface BusinessContactFormProps {
  score: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
}

const BusinessContactForm: React.FC<BusinessContactFormProps> = ({
  score,
  contactSubmitted,
  setContactSubmitted
}) => {
  // Contact form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const contactFormRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (score && score >= 85 && contactFormRef.current) {
      setTimeout(() => {
        contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [score]);
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate name
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // Here you would typically send this data to your backend
        console.log('Contact form submitted:', { name, email, message });
        
        // If you have a Supabase function to handle this:
        // await supabase.functions.invoke('submit-contact', {
        //   body: { name, email, message, ideaScore: score }
        // });
        
        setContactSubmitted(true);
        toast.success('Thank you for your interest! We will be in touch soon.');
      } catch (err) {
        console.error('Error submitting contact form:', err);
        toast.error('Failed to submit form. Please try again.');
      }
    }
  };
  
  if (score === null || score < 85) return null;
  
  if (contactSubmitted) {
    return (
      <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm text-center animate-fade-in">
        <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
        <p className="text-lg">
          We've received your information and will be in touch shortly to discuss your idea.
        </p>
      </div>
    );
  }
  
  return (
    <div ref={contactFormRef} className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm animate-fade-in">
      <h3 className="text-2xl font-bold mb-4 text-center">Your Idea Has Potential!</h3>
      <p className="mb-6 text-center">
        Congratulations! Your idea scored {score}/100, which shows great promise. We'd love to discuss how we can help you bring it to life.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Fill out the form below and we'll get back to you as soon as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                {nameError && <p className="text-sm text-red-500">{nameError}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea 
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us more about your idea or any questions you have..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-medium"
            >
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessContactForm;
