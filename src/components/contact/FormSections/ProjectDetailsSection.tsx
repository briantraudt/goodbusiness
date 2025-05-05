
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from '../ContactFormSchema';

interface ProjectDetailsSectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  handleFieldBlur: (fieldName: keyof FormValues) => void;
}

const ProjectDetailsSection: React.FC<ProjectDetailsSectionProps> = ({ 
  form, 
  isSubmitting,
  handleFieldBlur 
}) => {
  return (
    <>
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
    </>
  );
};

export default ProjectDetailsSection;
