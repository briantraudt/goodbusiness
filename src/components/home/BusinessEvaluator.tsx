
import React, { useState } from 'react';
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
