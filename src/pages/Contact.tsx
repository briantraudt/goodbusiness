
import React, { useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Define form validation schema
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  company: z.string().optional(),
  projectTitle: z.string().min(1, { message: "Project title is required" }),
  problemStatement: z.string().min(10, { message: "Please describe the problem your idea solves" }),
  targetMarket: z.string().min(1, { message: "Target market is required" }),
  marketSize: z.enum(["small", "medium", "large"], {
    message: "Please select an estimated market size",
  }),
  timeframe: z.enum(["immediate", "3months", "6months", "flexible"], {
    message: "Please select a timeframe",
  }),
  budgetRange: z.enum(["under10k", "10to25k", "25to50k", "over50k", "undefined"], {
    message: "Please select a budget range",
  }),
  additionalInfo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      projectTitle: "",
      problemStatement: "",
      targetMarket: "",
      marketSize: undefined,
      timeframe: undefined,
      budgetRange: undefined,
      additionalInfo: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast({
      title: "Idea submitted successfully!",
      description: "We'll get back to you within 24 hours.",
    });
    form.reset();
    
    // Redirect to the homepage after a short delay to allow the toast to be seen
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="bg-gb-dark text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rapid Software Prototyping
            </h1>
            <p className="text-xl text-white/80">
              Turn your ideas into working software in days, not months. Our rapid prototyping service helps you validate concepts quickly and accelerate your development timeline.
            </p>
          </div>
        </div>
      </section>

      {/* Idea Submission Form Section */}
      <section id="contact" className="bg-white">
        <div className="container-custom py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold text-gb-dark mb-6">Submit Your Idea</h3>
              <p className="text-lg text-gb-dark/80 mb-8">
                Tell us about your software idea, and we'll get back to you within 24 hours with a rapid prototyping plan.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-medium text-gb-dark mb-2">MVP Development</h4>
                    <p className="text-gb-dark/70">
                      Get a working minimum viable product in days to validate your concept with real users.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-medium text-gb-dark mb-2">Rapid Iteration</h4>
                    <p className="text-gb-dark/70">
                      Quickly test, refine, and improve your software based on real feedback and data.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CheckCircle className="text-gb-green h-6 w-6 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-xl font-medium text-gb-dark mb-2">Concept to Launch</h4>
                    <p className="text-gb-dark/70">
                      Transform your idea into a market-ready product with our end-to-end development process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your first name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company / Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="Your company (optional)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Title</FormLabel>
                        <FormControl>
                          <Input placeholder="A brief title for your software idea" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="problemStatement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Statement</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What problem does your idea solve? Why is it needed?"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="targetMarket"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Market</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Who will use this software? Be as specific as possible."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="marketSize"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Estimated Market Size</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="small" id="market-small" />
                              <Label htmlFor="market-small">Small (niche market)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="medium" id="market-medium" />
                              <Label htmlFor="market-medium">Medium (specific industry)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="large" id="market-large" />
                              <Label htmlFor="market-large">Large (broad appeal)</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="timeframe"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Development Timeframe</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="immediate" id="time-immediate" />
                              <Label htmlFor="time-immediate">Immediate (ASAP)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="3months" id="time-3months" />
                              <Label htmlFor="time-3months">Within 3 months</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="6months" id="time-6months" />
                              <Label htmlFor="time-6months">Within 6 months</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="flexible" id="time-flexible" />
                              <Label htmlFor="time-flexible">Flexible</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Budget Range</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="under10k" id="budget-under10k" />
                              <Label htmlFor="budget-under10k">Under $10,000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="10to25k" id="budget-10to25k" />
                              <Label htmlFor="budget-10to25k">$10,000 - $25,000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="25to50k" id="budget-25to50k" />
                              <Label htmlFor="budget-25to50k">$25,000 - $50,000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="over50k" id="budget-over50k" />
                              <Label htmlFor="budget-over50k">Over $50,000</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="undefined" id="budget-undefined" />
                              <Label htmlFor="budget-undefined">Not sure yet</Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any other details about your idea that would help us understand it better?"
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="bg-gb-green hover:bg-gb-green/90 text-white text-lg flex items-center justify-center w-full sm:w-auto">
                    Submit Idea
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
