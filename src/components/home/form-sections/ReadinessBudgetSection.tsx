
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ReadinessBudgetSectionProps {
  businessStage: string;
  setBusinessStage: (value: string) => void;
  budget: string;
  setBudget: (value: string) => void;
  errors: {
    businessStage?: string;
    budget?: string;
    [key: string]: string | undefined;
  };
}

const ReadinessBudgetSection: React.FC<ReadinessBudgetSectionProps> = ({
  businessStage,
  setBusinessStage,
  budget,
  setBudget,
  errors
}) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Readiness & Budget</h4>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <Label>Where are you in the process? <span className="text-red-500">*</span></Label>
          <RadioGroup value={businessStage} onValueChange={setBusinessStage} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="idea" id="idea" />
              <Label htmlFor="idea">Just an idea</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="prototype" id="prototype" />
              <Label htmlFor="prototype">Prototype or MVP built</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="traction" id="traction" />
              <Label htmlFor="traction">Some traction or revenue</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="operational" id="operational" />
              <Label htmlFor="operational">Fully operational business</Label>
            </div>
          </RadioGroup>
          {errors.businessStage && <p className="text-sm text-red-500">{errors.businessStage}</p>}
        </div>
        
        <div className="space-y-3">
          <Label className="mb-2">
            Do you have a budget for this project? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={budget} onValueChange={setBudget} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="budget0" />
              <Label htmlFor="budget0">$0 – I'm looking for a co-founder or guidance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1000-5000" id="budget1k" />
              <Label htmlFor="budget1k">$1,000–$5,000 – I need help validating or prototyping</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5000-25000" id="budget5k" />
              <Label htmlFor="budget5k">$5,000–$25,000 – I'm ready to build and launch</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="25000+" id="budget25k" />
              <Label htmlFor="budget25k">$25,000+ – I'm ready to grow or scale</Label>
            </div>
          </RadioGroup>
          {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
        </div>
      </div>
    </div>
  );
};

export default ReadinessBudgetSection;
