
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessEvaluation = () => {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);

  // Send notification about the evaluation
  const sendEvaluationNotification = async (idea: string, score: number | null, result: string | null) => {
    try {
      console.log('Sending evaluation notification...');
      
      const { data, error: notifyError } = await supabase.functions.invoke('notify-business-evaluation', {
        body: { idea, score, result }
      });
      
      if (notifyError) {
        console.error('Notification error:', notifyError);
        return false;
      }
      
      console.log('Notification sent successfully:', data);
      return true;
    } catch (err) {
      console.error('Error sending notification:', err);
      return false;
    }
  };

  const evaluateIdea = async () => {
    if (!idea.trim()) {
      setError('Please enter your business idea.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setScore(null);
    setNotificationSent(false);

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
        // Extract score from the result with improved parsing
        let extractedScore = null;
        
        // Try to match patterns like "Good Idea Score: 88/100" or "Overall score: 88"
        const scorePatterns = [
          /(?:good idea score|overall score|score):\s*(\d+)(?:\/100)?/i,
          /(\d+)\/100/i
        ];
        
        for (const pattern of scorePatterns) {
          const match = data.result.match(pattern);
          if (match && match[1]) {
            extractedScore = parseInt(match[1], 10);
            console.log(`Extracted score ${extractedScore} using pattern:`, pattern);
            break;
          }
        }
        
        // Update state with results - always show the result regardless of score
        setResult(data.result);
        setScore(extractedScore);
        
        // Send notification email about the evaluation
        const notificationSuccess = await sendEvaluationNotification(idea, extractedScore, data.result);
        setNotificationSent(notificationSuccess);
        
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

  return {
    idea,
    setIdea,
    result,
    isLoading,
    error,
    score,
    notificationSent,
    evaluateIdea
  };
};
