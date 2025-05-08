
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const BusinessEvaluator = () => {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        throw new Error(data.error);
      }
      
      if (data?.result) {
        setResult(data.result);
        toast.success('Idea evaluated successfully!');
      } else {
        throw new Error('No result returned from the evaluation.');
      }
    } catch (err) {
      console.error('Error evaluating business idea:', err);
      setError(`Failed to evaluate business idea. ${err instanceof Error ? err.message : 'Please try again later.'}`);
      toast.error('Failed to evaluate idea');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white py-16">
      <div className="container-custom max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Is Your Idea a Good Business?</h2>
          <p className="text-lg text-gray-600">
            Describe your idea in 1–2 paragraphs and get an instant AI-powered evaluation.
          </p>
        </div>

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
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <pre className="whitespace-pre-wrap font-sans text-base">{result}</pre>
          </div>
        )}
      </div>
    </section>
  );
};

export default BusinessEvaluator;
