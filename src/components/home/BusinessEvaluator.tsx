
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const BusinessEvaluator = () => {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // Contact form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Create a ref for the result section
  const resultRef = useRef<HTMLDivElement>(null);
  const contactFormRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      // Wait a tiny bit for the DOM to update
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  // Effect to scroll to contact form when high score is achieved
  useEffect(() => {
    if (score && score >= 85 && contactFormRef.current) {
      setTimeout(() => {
        contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [score]);

  const evaluateIdea = async () => {
    if (!idea.trim()) {
      setError('Please enter your business idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setScore(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('evaluate-business-idea', {
        body: { idea }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }
      
      if (data?.error) {
        console.error('Function returned error:', data.error);
        
        // Handle billing/quota issues specifically
        if (data.error.includes('quota') || data.error.includes('billing')) {
          setError('Your OpenAI API key has exceeded its quota. Please check your billing details on the OpenAI platform.');
          toast.error('API quota exceeded');
          return;
        }
        
        throw new Error(data.error);
      }
      
      if (data?.result) {
        setResult(data.result);
        
        // Extract score from the result if available
        const scoreRegex = /Overall score:\s*(\d+)/i;
        const match = data.result.match(scoreRegex);
        if (match && match[1]) {
          const parsedScore = parseInt(match[1], 10);
          setScore(parsedScore);
        }
        
        toast.success('Idea evaluated successfully!');
      } else {
        throw new Error('No result returned from the evaluation.');
      }
    } catch (err) {
      console.error('Error evaluating business idea:', err);
      setError(`Failed to evaluate business idea. ${err instanceof Error ? err.message : 'Please try again later.'}`);
      toast.error('Failed to evaluate idea');
    } finally {
      setIsLoading(false);
    }
  };
  
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

  return (
    <section className="bg-white py-16">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Is Your Idea a Good Business?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Have an idea and wondering if it's worth pursuing? Our Business Evaluator will give you instant feedback based on the following five key criteria that we think are most important:
          </p>
          
          <ol className="list-decimal pl-6 space-y-3 mb-6 text-gray-700">
            <li><strong>Purpose & Values Driven Impact</strong> – Does your idea aim to make a meaningful difference in the lives of others or the communities it touches?</li>
            <li><strong>Problem-Solution Fit</strong> – Is it solving a real, specific problem for a real audience?</li>
            <li><strong>Viability</strong> – Can it generate income sustainably?</li>
            <li><strong>Feasibility</strong> – Can it be built quickly and realistically within your set budget?</li>
            <li><strong>Scalability</strong> – Can it grow beyond your local area to create greater impact?</li>
          </ol>
          
          <p className="text-lg text-gray-600">
            Type your idea in 1–2 paragraphs below, and we'll give you a personalized score and feedback in seconds.
          </p>
        </div>

        <div className="space-y-4">
          <Textarea 
            id="ideaInput"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your business or mission idea..."
            className="w-full p-4 min-h-[160px] text-base"
            rows={8}
          />
          
          <Button 
            onClick={evaluateIdea}
            disabled={isLoading}
            className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-medium py-6 h-auto text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Evaluating...
              </>
            ) : 'Evaluate My Idea'}
          </Button>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {result && (
          <div ref={resultRef} className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <pre className="whitespace-pre-wrap font-sans text-base">{result}</pre>
          </div>
        )}
        
        {score !== null && score >= 85 && !contactSubmitted && (
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
        )}
        
        {score !== null && score >= 85 && contactSubmitted && (
          <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm text-center animate-fade-in">
            <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
            <p className="text-lg">
              We've received your information and will be in touch shortly to discuss your idea.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessEvaluator;
