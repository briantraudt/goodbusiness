
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

// Define a scoring result type
interface EvaluationResult {
  score: number;
  details: string;
}

const ContactEvaluator: React.FC<{ onEvaluationComplete: (result: EvaluationResult | null) => void }> = ({ onEvaluationComplete }) => {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast: uiToast } = useToast();
  const resultRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to results when they appear
  useEffect(() => {
    if (result && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);

  // Function to extract score from evaluation result
  const extractScore = (evaluationText: string): number => {
    const scoreMatch = evaluationText.match(/Good Idea Score: (\d+)/);
    return scoreMatch ? parseInt(scoreMatch[1], 10) : 0;
  };

  const evaluateIdea = async () => {
    if (!idea.trim()) {
      setError('Please enter your business idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('evaluate-business-idea', {
        body: { idea }
      });

      if (supabaseError) {
        console.error('Supabase function error:', supabaseError);
        throw new Error(supabaseError.message);
      }
      
      if (data?.error) {
        console.error('Function returned error:', data.error);
        
        // Handle billing/quota issues specifically
        if (data.error.includes('quota') || data.error.includes('billing')) {
          setError('Your OpenAI API key has exceeded its quota. Please check your billing details on the OpenAI platform.');
          toast.error('API quota exceeded');
          onEvaluationComplete(null);
          return;
        }
        
        throw new Error(data.error);
      }
      
      if (data?.result) {
        setResult(data.result);
        toast.success('Idea evaluated successfully!');
        
        // Extract score and pass complete result to parent
        const scoreValue = extractScore(data.result);
        onEvaluationComplete({ score: scoreValue, details: data.result });

        // Show appropriate toast based on score
        if (scoreValue >= 85) {
          uiToast({
            title: "Great Idea!",
            description: "Your idea scored 85 or higher! We'd love to hear more about it.",
          });
        } else {
          uiToast({
            title: "Thanks for sharing your idea",
            description: "Keep refining your concept. We encourage you to iterate and try again.",
          });
        }
      } else {
        throw new Error('No result returned from the evaluation.');
      }
    } catch (err) {
      console.error('Error evaluating business idea:', err);
      setError(`Failed to evaluate business idea. ${err instanceof Error ? err.message : 'Please try again later.'}`);
      toast.error('Failed to evaluate idea');
      onEvaluationComplete(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-gb-light to-white py-16 evaluator-section">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Evaluate Your Idea First</h2>
          <p className="text-lg text-gray-600 mb-6">
            Before submitting your idea, let's run it through our AI-powered business evaluator.
            Great ideas (85+ score) will be invited to connect with our team directly.
          </p>
        </div>

        <Card className="border border-gray-200 shadow-md bg-white rounded-xl overflow-hidden">
          <div className="p-6 space-y-4">
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
              className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-medium py-6 h-auto text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Evaluating...
                </>
              ) : 'Evaluate My Idea'}
            </Button>
          </div>

          {error && (
            <div className="px-6 pb-6">
              <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                {error}
              </div>
            </div>
          )}

          {result && (
            <div className="px-6 pb-6" ref={resultRef}>
              <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <pre className="whitespace-pre-wrap font-sans text-base">{result}</pre>
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default ContactEvaluator;
