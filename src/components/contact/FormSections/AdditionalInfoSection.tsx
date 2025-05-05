
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from '../ContactFormSchema';

interface AdditionalInfoSectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
}

const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({ 
  form, 
  isSubmitting 
}) => {
  return (
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
  );
};

export default AdditionalInfoSection;
