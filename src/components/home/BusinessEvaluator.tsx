
import React, { useState, useEffect } from 'react';
import { useBusinessEvaluation } from '@/hooks/useBusinessEvaluation';
import EvaluationScreen from './EvaluationScreen';
import { useSearchParams } from 'react-router-dom';

const BusinessEvaluator = () => {
  const {
    idea,
    setIdea,
    result,
    isLoading,
    error,
    score,
    evaluateIdea
  } = useBusinessEvaluation();
  
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [searchParams] = useSearchParams();
  
  // Effect to scroll to top when the component mounts or URL parameters change
  useEffect(() => {
    // Scroll to top immediately when component mounts or URL changes
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [searchParams]);

  // Normal view for evaluation regardless of score
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
