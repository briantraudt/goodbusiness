
import React from 'react';
import { useBusinessEvaluation } from '@/hooks/useBusinessEvaluation';
import { useScoreUrlProcessor } from './evaluator/ScoreUrlProcessor';
import ScoreBasedRouter from './evaluator/ScoreBasedRouter';

/**
 * Main BusinessEvaluator component that coordinates the evaluation process
 */
const BusinessEvaluator = () => {
  // Get score from URL parameter
  const { initialScore } = useScoreUrlProcessor();
  
  // State for managing the contact form submission
  const [contactSubmitted, setContactSubmitted] = React.useState(false);
  
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
    emailStatus,
    evaluateIdea
  } = useBusinessEvaluation();
  
  // Effect to pre-fill form if score provided in URL
  React.useEffect(() => {
    // Force pre-fill if score is provided in URL
    if (initialScore && initialScore >= 75 && !result) {
      setIdea('This idea was pre-approved with a score of ' + initialScore);
    }
  }, [initialScore, result]);
  
  return (
    <ScoreBasedRouter
      initialScore={initialScore}
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
      evaluationScore={evaluationScore}
      contactSubmitted={contactSubmitted}
      setContactSubmitted={setContactSubmitted}
      emailStatus={emailStatus}
    />
  );
};

export default BusinessEvaluator;
