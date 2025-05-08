
import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Rocket, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const BusinessEvaluator = () => {
  const [idea, setIdea] = useState('');
  const [evaluation, setEvaluation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  );

  const evaluateIdea = async () => {
    if (idea.trim().length < 20) {
      toast({
        title: "Input too short",
        description: "Please provide a more detailed description of your idea (at least 20 characters).",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setEvaluation('');

    try {
      const { data, error } = await supabase.functions.invoke('evaluate-business-idea', {
        body: { idea }
      });

      if (error) throw error;
      
      setEvaluation(data.result);
    } catch (error) {
      console.error('Error evaluating idea:', error);
      toast({
        title: "Evaluation failed",
        description: "We couldn't evaluate your idea right now. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-[#F1F0FB] py-14 md:py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gb-dark">Is Your Idea a Good Business?</h2>
            <p className="mt-3 text-lg text-gb-dark/70">
              Describe your idea in 1–2 paragraphs and get an instant AI-powered evaluation.
            </p>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm">
            <Textarea
              id="ideaInput"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Describe your business or mission idea..."
              className="min-h-[160px] text-base resize-y mb-4"
            />
            
            <Button 
              onClick={evaluateIdea}
              disabled={isLoading || idea.trim().length < 5}
              className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-semibold py-6 text-lg flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-5 w-5" />
                  Evaluate My Idea
                </>
              )}
            </Button>

            {evaluation && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <pre className="whitespace-pre-wrap font-sans text-base">{evaluation}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessEvaluator;
