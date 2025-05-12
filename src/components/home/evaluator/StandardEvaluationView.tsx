
import React from 'react';
import EvaluationScreen from '../EvaluationScreen';
import BusinessContactFormManager from '../business-form/BusinessContactFormManager';

interface StandardEvaluationViewProps {
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
  score: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
  emailStatus: string | null;
}

/**
 * Standard evaluation view with form and results
 */
const StandardEvaluationView: React.FC<StandardEvaluationViewProps> = ({
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
  score,
  contactSubmitted,
  setContactSubmitted,
  emailStatus
}) => {
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
        score={score}
        contactSubmitted={contactSubmitted}
        setContactSubmitted={setContactSubmitted}
        emailStatus={emailStatus}
      />
      
      {/* Only show contact form for high scores */}
      {score !== null && score >= 75 && (
        <BusinessContactFormManager 
          score={score}
          contactSubmitted={contactSubmitted}
          setContactSubmitted={setContactSubmitted} 
        />
      )}
    </>
  );
};

export default StandardEvaluationView;
