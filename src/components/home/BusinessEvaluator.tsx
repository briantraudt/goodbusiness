
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Schema for contact form validation
const contactFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }).optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const BusinessEvaluator = () => {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // Create a ref for the result section
  const resultRef = useRef<HTMLDivElement>(null);
  const contactFormRef = useRef<HTMLDivElement>(null);

  // Initialize the form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

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
  
  const onSubmitContact = async (data: ContactFormValues) => {
    try {
      // Here you would typically send this data to your backend
      // For now we'll just log it and show a success message
      console.log('Contact form submitted:', data);
      
      // If you have a Supabase function to handle this:
      // await supabase.functions.invoke('submit-contact', {
      //   body: { ...data, ideaScore: score }
      // });
      
      setContactSubmitted(true);
      toast.success('Thank you for your interest! We will be in touch soon.');
    } catch (err) {
      console.error('Error submitting contact form:', err);
      toast.error('Failed to submit form. Please try again.');
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitContact)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your idea or any questions you have..."
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-medium py-4 h-auto"
                >
                  Get in Touch
                </Button>
              </form>
            </Form>
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
