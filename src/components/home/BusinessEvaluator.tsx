import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PrivateInvitationScreen from './PrivateInvitationScreen';
import EvaluationScreen from './EvaluationScreen';
import BusinessContactFormManager from './business-form/BusinessContactFormManager';
import { useBusinessEvaluation } from '@/hooks/useBusinessEvaluation';

const BusinessEvaluator = () => {
  // Get any score from URL parameters
  const [searchParams] = useSearchParams();
  const scoreParam = searchParams.get('score');
  const initialScore = scoreParam ? parseInt(scoreParam, 10) : null;
  
  // State for managing the contact form submission
  const [contactSubmitted, setContactSubmitted] = useState(false);
  
  // Get business evaluation hook
  const {
    idea,
    setIdea,
    name, 
    setName,
    email,
    setEmail,
    result,
    isLoading,
    error,
    score: evaluationScore,
    notificationSent,
    evaluateIdea
  } = useBusinessEvaluation();
  
  // Combine score from URL and evaluation
  const displayScore = evaluationScore !== null ? evaluationScore : initialScore;
  
  // Effects
  useEffect(() => {
    // Force pre-fill if score is provided in URL
    if (initialScore && initialScore >= 75 && !result) {
      setIdea('This idea was pre-approved with a score of ' + initialScore);
    }
  }, [initialScore, result]);
  
  // Render private invitation screen for high scores in URL
  if (initialScore && initialScore >= 75) {
    return (
      <>
        <PrivateInvitationScreen score={initialScore} />
        <BusinessContactFormManager 
          score={initialScore}
          contactSubmitted={contactSubmitted}
          setContactSubmitted={setContactSubmitted}
        />
      </>
    );
  }
  
  // Otherwise show the standard evaluation screen
  return (
    <>
      <EvaluationScreen 
        idea={idea}
        setIdea={setIdea}
        name={name} 
        setName={setName}
        email={email}
        setEmail={setEmail}
        evaluateIdea={evaluateIdea}
        isLoading={isLoading}
        result={result}
        error={error}
        score={displayScore}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />
      {displayScore !== null && displayScore >= 75 && (
        <BusinessContactFormManager 
          score={displayScore}
          contactSubmitted={contactSubmitted}
          setContactSubmitted={setContactSubmitted} 
        />
      )}
    </>
  );
};

export default BusinessEvaluator;
