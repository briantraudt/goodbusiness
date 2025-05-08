
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BusinessIdeaSectionProps {
  businessIdea: string;
  setBusinessIdea: (value: string) => void;
  problemSolution: string;
  setProblemSolution: (value: string) => void;
  customers: string;
  setCustomers: (value: string) => void;
  profitType: string;
  setProfitType: (value: string) => void;
  errors: {
    businessIdea?: string;
    problemSolution?: string;
    profitType?: string;
    [key: string]: string | undefined;
  };
}

const BusinessIdeaSection: React.FC<BusinessIdeaSectionProps> = ({
  businessIdea,
  setBusinessIdea,
  problemSolution,
  setProblemSolution,
  customers,
  setCustomers,
  profitType,
  setProfitType,
  errors
}) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Your Idea</h4>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="businessIdea">Describe your business idea in 1–2 sentences <span className="text-red-500">*</span></Label>
          <Textarea 
            id="businessIdea"
            value={businessIdea}
            onChange={(e) => setBusinessIdea(e.target.value)}
            placeholder="Briefly describe your business idea"
            className="min-h-[80px]"
          />
          {errors.businessIdea && <p className="text-sm text-red-500">{errors.businessIdea}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="problemSolution">
            What problem does it solve, and for whom? <span className="text-red-500">*</span>
          </Label>
          <Textarea 
            id="problemSolution"
            value={problemSolution}
            onChange={(e) => setProblemSolution(e.target.value)}
            placeholder="Explain the problem your idea addresses and who will benefit"
            className="min-h-[80px]"
          />
          {errors.problemSolution && <p className="text-sm text-red-500">{errors.problemSolution}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="customers">
            Who are your customers? (optional)
          </Label>
          <Textarea 
            id="customers"
            value={customers}
            onChange={(e) => setCustomers(e.target.value)}
            placeholder="Describe your target customers or audience"
            className="min-h-[80px]"
          />
        </div>
        
        <div className="space-y-2">
          <Label className="mb-2">
            Is this idea for profit, nonprofit, or both? <span className="text-red-500">*</span>
          </Label>
          <RadioGroup value={profitType} onValueChange={setProfitType} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="for-profit" id="for-profit" />
              <Label htmlFor="for-profit">For-profit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nonprofit" id="nonprofit" />
              <Label htmlFor="nonprofit">Nonprofit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="hybrid" />
              <Label htmlFor="hybrid">Hybrid / not sure yet</Label>
            </div>
          </RadioGroup>
          {errors.profitType && <p className="text-sm text-red-500">{errors.profitType}</p>}
        </div>
      </div>
    </div>
  );
};

export default BusinessIdeaSection;
