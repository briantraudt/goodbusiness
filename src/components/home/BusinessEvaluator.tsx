
import React, { useState, useEffect } from 'react';
import { useBusinessEvaluation } from '@/hooks/useBusinessEvaluation';
import PrivateInvitationScreen from './PrivateInvitationScreen';
import EvaluationScreen from './EvaluationScreen';

const BusinessEvaluator = () => {
  const {
    idea,
    setIdea,
    result,
    isLoading,
    error,
    score,
    showContactFormOnly,
    evaluateIdea
  } = useBusinessEvaluation();
  
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Score updated:', score);
    console.log('Should show contact form:', score !== null && score >= 75);
    console.log('Show contact form only:', showContactFormOnly);
  }, [score, showContactFormOnly]);

  // If showing contact form only for high scores
  if (showContactFormOnly && score !== null && score >= 75) {
    return (
      <PrivateInvitationScreen
        score={score}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />
    );
  }

  // Normal view for evaluation or low scores
  return (
    <EvaluationScreen
      idea={idea}
      setIdea={setIdea}
      evaluateIdea={evaluateIdea}
      isLoading={isLoading}
      result={result}
      error={error}
      score={score}
      contactSubmitted={contactSubmitted}
      setContactSubmitted={setContactSubmitted}
    />
  );
};

export default BusinessEvaluator;
