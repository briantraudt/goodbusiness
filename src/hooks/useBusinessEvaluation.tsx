
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessEvaluation = () => {
  const [idea, setIdea] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);

  // Send notification about the evaluation
  const sendEvaluationNotification = async (idea: string, name: string, email: string, score: number | null, result: string | null) => {
    try {
      console.log('Sending evaluation notification...');
      
      const { data, error: notifyError } = await supabase.functions.invoke('notify-business-evaluation', {
        body: { idea, name, email, score, result, sendUserConfirmation: true }
      });
      
      if (notifyError) {
        console.error('Notification error:', notifyError);
        toast.error('Could not send email notifications');
        return false;
      }
      
      if (data.warning) {
        console.warn('Notification warning:', data.warning);
        toast.warning('Email notifications may not have been sent');
      }
      
      console.log('Notification response:', data);
      
      // Consider it a success if at least the admin or user email was sent
      // or if emails aren't configured (which isn't an error condition)
      const emailSuccess = data.adminEmailSent || data.userEmailSent || !data.emailsConfigured;
      return emailSuccess;
    } catch (err) {
      console.error('Error sending notification:', err);
      toast.error('Could not send email notifications');
      return false;
    }
  };

  const evaluateIdea = async () => {
    // Validate required fields
    if (!idea.trim()) {
      setError('Please enter your business idea.');
      toast.error('Please enter your business idea');
      return;
    }

    if (!name.trim()) {
      setError('Please enter your name.');
      toast.error('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      toast.error('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      toast.error('Please enter a valid email address');
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
        
        // Store the evaluation data in Supabase
        const timestamp = new Date().toISOString();
        try {
          const { error: storeError } = await supabase
            .from('business_evaluations')
            .insert([
              { 
                name, 
                email, 
                idea, 
                score: extractedScore, 
                result: data.result,
                evaluation_date: timestamp
              }
            ]);
          
          if (storeError) {
            console.error('Error storing evaluation:', storeError);
            toast.error('Could not save your evaluation');
          } else {
            // Toast for successful database save
            toast.success('Evaluation saved to database');
          }
        } catch (storeErr) {
          console.error('Failed to store evaluation data:', storeErr);
        }
        
        // Send notification email about the evaluation
        const notificationSuccess = await sendEvaluationNotification(idea, name, email, extractedScore, data.result);
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
    name,
    setName,
    email,
    setEmail,
    result,
    isLoading,
    error,
    score,
    notificationSent,
    evaluateIdea
  };
};
