
import { useState } from 'react';
import { sendEvaluationNotification } from '@/utils/evaluationNotifications';
import { validateEvaluationForm } from '@/utils/evaluationValidation';
import { evaluateBusinessIdea, storeEvaluationData } from '@/services/evaluationService';
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
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const evaluateIdea = async () => {
    // Reset states
    setEmailStatus(null);
    
    // Validate form inputs
    const { isValid, errorMessage } = validateEvaluationForm(idea, name, email);
    if (!isValid) {
      setError(errorMessage);
      return;
    }

    // Start evaluation process
    setIsLoading(true);
    setError(null);
    setResult(null);
    setScore(null);
    setNotificationSent(false);

    try {
      // Call the evaluation service
      const evaluationResult = await evaluateBusinessIdea(idea);
      
      if (!evaluationResult.success) {
        setError(evaluationResult.error);
        return;
      }
      
      // Update state with results
      setResult(evaluationResult.result);
      setScore(evaluationResult.score);
      
      // Store the evaluation data
      await storeEvaluationData(name, email, idea, evaluationResult.score, evaluationResult.result!);
      
      // Send notification email
      console.log('About to send notification email...');
      const { success, status } = await sendEvaluationNotification(
        idea, 
        name, 
        email, 
        evaluationResult.score, 
        evaluationResult.result
      );
      
      setNotificationSent(success);
      setEmailStatus(status);
      
      toast.success('Idea evaluated successfully!');
    } catch (err) {
      console.error('Error in evaluation process:', err);
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
    emailStatus,
    evaluateIdea
  };
};
