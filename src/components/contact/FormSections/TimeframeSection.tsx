
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from '../ContactFormSchema';

interface TimeframeSectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
}

const TimeframeSection: React.FC<TimeframeSectionProps> = ({ 
  form, 
  isSubmitting 
}) => {
  return (
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
  );
};

export default TimeframeSection;
