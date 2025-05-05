
import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { formSchema, FormValues, defaultValues } from './ContactFormSchema';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

const ContactForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur', // Validate on blur for better user experience
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Send the form data to our Supabase Edge Function
      const { data: responseData, error } = await supabase.functions.invoke('send-contact-email', {
        body: data
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (responseData && responseData.success) {
        // Show success message
        toast({
          title: "Idea submitted successfully!",
          description: "We'll get back to you within 24 hours.",
        });
        
        // Reset the form
        form.reset();
        
        // Redirect to the homepage after a short delay to allow the toast to be seen
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        throw new Error("Failed to submit idea. Please try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      
      setFormError("There was an error submitting your idea. Please try again or contact us directly.");
      
      toast({
        title: "Submission error",
        description: "There was an error submitting your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form validation trigger on focus change
  const handleFieldBlur = (fieldName: keyof FormValues) => {
    form.trigger(fieldName);
  };

  if (!form) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {formError && (
          <Alert variant="destructive">
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your first name" 
                    {...field} 
                    onBlur={() => handleFieldBlur('firstName')}
                    disabled={isSubmitting}
                  />
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
                  <Input 
                    placeholder="Your last name" 
                    {...field} 
                    onBlur={() => handleFieldBlur('lastName')}
                    disabled={isSubmitting}
                  />
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
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  {...field} 
                  onBlur={() => handleFieldBlur('email')}
                  disabled={isSubmitting}
                />
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
                <Input 
                  placeholder="Your company (optional)" 
                  {...field} 
                  disabled={isSubmitting}
                />
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
                <Input 
                  placeholder="A brief title for your software idea" 
                  {...field} 
                  onBlur={() => handleFieldBlur('projectTitle')}
                  disabled={isSubmitting}
                />
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
                  onBlur={() => handleFieldBlur('problemStatement')}
                  disabled={isSubmitting}
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
                  onBlur={() => handleFieldBlur('targetMarket')}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="market-small" disabled={isSubmitting} />
                    <Label htmlFor="market-small">Small (niche market)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="market-medium" disabled={isSubmitting} />
                    <Label htmlFor="market-medium">Medium (specific industry)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="market-large" disabled={isSubmitting} />
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
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="time-immediate" disabled={isSubmitting} />
                    <Label htmlFor="time-immediate">Immediate (ASAP)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3months" id="time-3months" disabled={isSubmitting} />
                    <Label htmlFor="time-3months">Within 3 months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="6months" id="time-6months" disabled={isSubmitting} />
                    <Label htmlFor="time-6months">Within 6 months</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="flexible" id="time-flexible" disabled={isSubmitting} />
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
                  disabled={isSubmitting}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="under10k" id="budget-under10k" disabled={isSubmitting} />
                    <Label htmlFor="budget-under10k">Under $10,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10to25k" id="budget-10to25k" disabled={isSubmitting} />
                    <Label htmlFor="budget-10to25k">$10,000 - $25,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="25to50k" id="budget-25to50k" disabled={isSubmitting} />
                    <Label htmlFor="budget-25to50k">$25,000 - $50,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="over50k" id="budget-over50k" disabled={isSubmitting} />
                    <Label htmlFor="budget-over50k">Over $50,000</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="undefined" id="budget-undefined" disabled={isSubmitting} />
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
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="bg-gb-green hover:bg-gb-green/90 text-white text-lg flex items-center justify-center w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              Submit Idea
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
