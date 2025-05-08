
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BusinessEvaluatorIntro from './BusinessEvaluatorIntro';
import BusinessEvaluatorForm from './BusinessEvaluatorForm';
import BusinessEvaluationResult from './BusinessEvaluationResult';
import BusinessContactForm from './BusinessContactForm';

const BusinessEvaluator = () => {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const evaluateIdea = async () => {
    if (!idea.trim()) {
      setError('Please enter your business idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setScore(null);

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
          return;
        }
        
        throw new Error(data.error);
      }
      
      if (data?.result) {
        setResult(data.result);
        
        // Extract score from the result if available
        const scoreRegex = /Overall score:\s*(\d+)/i;
        const match = data.result.match(scoreRegex);
        if (match && match[1]) {
          const parsedScore = parseInt(match[1], 10);
          setScore(parsedScore);
        }
        
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
        <BusinessEvaluatorIntro />
        <BusinessEvaluatorForm 
          idea={idea}
          setIdea={setIdea}
          evaluateIdea={evaluateIdea}
          isLoading={isLoading}
        />
        <BusinessEvaluationResult 
          result={result}
          error={error}
        />
        <BusinessContactForm 
          score={score}
          contactSubmitted={contactSubmitted}
          setContactSubmitted={setContactSubmitted}
        />
      </div>
    </section>
  );
};

export default BusinessEvaluator;
