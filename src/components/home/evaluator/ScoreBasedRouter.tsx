import React from 'react';
import PrivateInvitationView from './PrivateInvitationView';
import StandardEvaluationView from './StandardEvaluationView';

interface ScoreBasedRouterProps {
  initialScore: number | null;
  idea: string;
  setIdea: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  evaluateIdea: () => void;
  isLoading: boolean;
  result: string | null;
  error: string | null;
  evaluationScore: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
  emailStatus: string | null;
}

/**
 * Routes to different views based on the score
 */
const ScoreBasedRouter: React.FC<ScoreBasedRouterProps> = ({
  initialScore,
  idea,
  setIdea,
  name,
  setName,
  email,
  setEmail,
  evaluateIdea,
  isLoading,
  result,
  error,
  evaluationScore,
  contactSubmitted,
  setContactSubmitted,
  emailStatus
}) => {
  // Combine score from URL and evaluation
  const displayScore = evaluationScore !== null ? evaluationScore : initialScore;
  
  // Render private invitation screen for high scores in URL
  if (initialScore && initialScore >= 75) {
    return (
      <PrivateInvitationView 
        score={initialScore}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
      />
    );
  }
  
  // Otherwise show the standard evaluation screen
  return (
    <StandardEvaluationView
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
      emailStatus={emailStatus}
    />
  );
};

export default ScoreBasedRouter;
