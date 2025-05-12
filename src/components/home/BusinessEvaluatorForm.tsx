
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface BusinessEvaluatorFormProps {
  idea: string;
  setIdea: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  evaluateIdea: () => void;
  isLoading: boolean;
}

const BusinessEvaluatorForm: React.FC<BusinessEvaluatorFormProps> = ({
  idea,
  setIdea,
  name,
  setName,
  email,
  setEmail,
  evaluateIdea,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nameInput">Your Name *</Label>
          <Input
            id="nameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="emailInput">Email Address *</Label>
          <Input
            id="emailInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full"
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ideaInput">Your Business Idea *</Label>
        <Textarea 
          id="ideaInput"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your business or mission idea..."
          className="w-full p-4 min-h-[160px] text-base"
          rows={8}
          required
        />
      </div>
      
      <Button 
        onClick={evaluateIdea}
        disabled={isLoading}
        className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-medium py-6 h-auto text-lg relative"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-6 w-6 animate-spin text-white" />
            <span className="animate-pulse">Evaluating your idea...</span>
          </>
        ) : 'Evaluate My Idea'}
      </Button>
    </div>
  );
};

export default BusinessEvaluatorForm;
