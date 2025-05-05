
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from '../ContactFormSchema';

interface BudgetSectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({ 
  form, 
  isSubmitting 
}) => {
  return (
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
  );
};

export default BudgetSection;
