
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from '../ContactFormSchema';

interface PersonalInfoSectionProps {
  form: UseFormReturn<FormValues>;
  isSubmitting: boolean;
  handleFieldBlur: (fieldName: keyof FormValues) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ 
  form, 
  isSubmitting,
  handleFieldBlur 
}) => {
  return (
    <>
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
    </>
  );
};

export default PersonalInfoSection;
