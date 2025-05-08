
import React, { useState, useEffect } from 'react';
import { useBusinessEvaluation } from '@/hooks/useBusinessEvaluation';
import PrivateInvitationScreen from './PrivateInvitationScreen';
import EvaluationScreen from './EvaluationScreen';
import { useLocation } from 'react-router-dom';

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
  const location = useLocation();
  
  // Check if URL has score parameter (could be passed during refresh)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scoreParam = params.get('score');
    
    // If there's a score in URL and it's high enough, we know we're showing the invitation screen
    if (scoreParam && parseInt(scoreParam, 10) >= 75) {
      // We'll handle the display logic in the return statement
    }
  }, [location]);

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
