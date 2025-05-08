
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface BusinessEvaluatorFormProps {
  idea: string;
  setIdea: (value: string) => void;
  evaluateIdea: () => void;
  isLoading: boolean;
}

const BusinessEvaluatorForm: React.FC<BusinessEvaluatorFormProps> = ({
  idea,
  setIdea,
  evaluateIdea,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <Textarea 
        id="ideaInput"
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder="Describe your business or mission idea..."
        className="w-full p-4 min-h-[160px] text-base"
        rows={8}
      />
      
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
