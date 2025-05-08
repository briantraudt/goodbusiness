
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
  const params = new URLSearchParams(location.search);
  const scoreParam = params.get('score');
  
  // If there's a score parameter in the URL, we should show the Private Invitation screen
  const shouldShowPrivateInvitation = scoreParam && parseInt(scoreParam, 10) >= 75;
  const scoreValue = scoreParam ? parseInt(scoreParam, 10) : score;

  // If showing private invitation based on URL parameter
  if (shouldShowPrivateInvitation) {
    return (
      <PrivateInvitationScreen
        score={scoreValue}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />
    );
  }

  // If showing contact form only for high scores (this handles the case during the initial evaluation)
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
