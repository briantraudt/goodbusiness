
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from '../ContactFormSchema';

interface MarketSizeSectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
}

const MarketSizeSection: React.FC<MarketSizeSectionProps> = ({ 
  form, 
  isSubmitting 
}) => {
  return (
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
  );
};

export default MarketSizeSection;
