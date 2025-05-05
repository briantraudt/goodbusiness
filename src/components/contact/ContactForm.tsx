
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Form } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { formSchema, FormValues, defaultValues } from './ContactFormSchema';
import { sendEmail } from './EmailService';

// Import Form Section Components
import PersonalInfoSection from './FormSections/PersonalInfoSection';
import ProjectDetailsSection from './FormSections/ProjectDetailsSection';
import MarketSizeSection from './FormSections/MarketSizeSection';
import TimeframeSection from './FormSections/TimeframeSection';
import BudgetSection from './FormSections/BudgetSection';
import AdditionalInfoSection from './FormSections/AdditionalInfoSection';
import SubmitButton from './FormSections/SubmitButton';
import ErrorAlert from './FormSections/ErrorAlert';

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
      const response = await sendEmail(data);
      
      if (response.status === 200) {
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
        <ErrorAlert error={formError} />
        
        <PersonalInfoSection 
          form={form} 
          isSubmitting={isSubmitting} 
          handleFieldBlur={handleFieldBlur} 
        />
        
        <ProjectDetailsSection 
          form={form} 
          isSubmitting={isSubmitting} 
          handleFieldBlur={handleFieldBlur} 
        />
        
        <MarketSizeSection form={form} isSubmitting={isSubmitting} />
        
        <TimeframeSection form={form} isSubmitting={isSubmitting} />
        
        <BudgetSection form={form} isSubmitting={isSubmitting} />
        
        <AdditionalInfoSection form={form} isSubmitting={isSubmitting} />
        
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};

export default ContactForm;
