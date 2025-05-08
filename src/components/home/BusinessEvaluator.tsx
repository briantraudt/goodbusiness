
import React, { useState, useEffect } from 'react';
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
  const [notificationSent, setNotificationSent] = useState(false);
  const [showContactFormOnly, setShowContactFormOnly] = useState(false);

  // Send notification about the evaluation
  const sendEvaluationNotification = async (idea: string, score: number | null, result: string | null) => {
    try {
      console.log('Sending evaluation notification...');
      
      const { data, error: notifyError } = await supabase.functions.invoke('notify-business-evaluation', {
        body: { idea, score, result }
      });
      
      if (notifyError) {
        console.error('Notification error:', notifyError);
        // Don't show an error toast to the user, just log it
        return false;
      }
      
      console.log('Notification sent successfully:', data);
      return true;
    } catch (err) {
      console.error('Error sending notification:', err);
      // Don't show an error toast to the user, just log it
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
    setShowContactFormOnly(false);

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
        
        if (extractedScore !== null) {
          console.log('Setting score to:', extractedScore);
          setScore(extractedScore);
          
          // Send notification email about the evaluation
          const notificationSuccess = await sendEvaluationNotification(idea, extractedScore, data.result);
          setNotificationSent(notificationSuccess);
          
          // If score is 75 or higher, show only the contact form after a short delay
          if (extractedScore >= 75) {
            setTimeout(() => {
              setShowContactFormOnly(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
          }
        } else {
          console.warn('Could not extract score from result', data.result);
          // If we can't extract a score but have a result, default to showing form
          // This ensures users can still access the contact form
          console.log('Setting default score of 85 to show form');
          setScore(85);
          
          // Send notification email about the evaluation even with default score
          const notificationSuccess = await sendEvaluationNotification(idea, 85, data.result);
          setNotificationSent(notificationSuccess);
          
          // Show only the contact form after a short delay for default score as well
          setTimeout(() => {
            setShowContactFormOnly(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 1500);
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

  // Debug logging
  useEffect(() => {
    console.log('Score updated:', score);
    console.log('Should show contact form:', score !== null && score >= 75);
    console.log('Show contact form only:', showContactFormOnly);
    console.log('Notification sent:', notificationSent);
  }, [score, notificationSent, showContactFormOnly]);

  // If showing contact form only for high scores
  if (showContactFormOnly && score !== null && score >= 75) {
    return (
      <section className="bg-white">
        <div className="bg-gb-dark text-white py-16">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <div className="bg-gb-green text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                2
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Private Invitation
                </h1>
                <p className="text-xl text-white/80">
                  Tell us more about your Go<span className="text-gb-green">o</span>d Business idea.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container-custom max-w-3xl mx-auto py-16">
          <BusinessContactForm 
            score={score}
            contactSubmitted={contactSubmitted}
            setContactSubmitted={setContactSubmitted}
          />
        </div>
      </section>
    );
  }

  // Normal view for evaluation or low scores
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
          score={score}
        />
        {score !== null && score >= 75 && !showContactFormOnly && (
          <BusinessContactForm 
            score={score}
            contactSubmitted={contactSubmitted}
            setContactSubmitted={setContactSubmitted}
          />
        )}
      </div>
    </section>
  );
};

export default BusinessEvaluator;
