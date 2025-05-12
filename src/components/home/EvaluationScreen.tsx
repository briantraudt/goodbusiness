
import React from 'react';
import BusinessEvaluatorIntro from './BusinessEvaluatorIntro';
import BusinessEvaluatorForm from './BusinessEvaluatorForm';
import BusinessEvaluationResult from './BusinessEvaluationResult';

interface EvaluationScreenProps {
  idea: string;
  setIdea: (value: string) => void;
  evaluateIdea: () => void;
  isLoading: boolean;
  result: string | null;
  error: string | null;
  score: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
}

const EvaluationScreen: React.FC<EvaluationScreenProps> = ({
  idea,
  setIdea,
  evaluateIdea,
  isLoading,
  result,
  error,
  score
}) => {
  return (
    <section className="bg-white py-16">
      <div className="container-custom max-w-3xl mx-auto">
        <BusinessEvaluatorIntro />
        <BusinessEvaluatorForm 
          idea={idea}
          setIdea={setIdea}
          evaluateIdea={evaluateIdea}
          isLoading={isLoading}
        />
        <BusinessEvaluationResult 
          result={result}
          error={error}
          score={score}
        />
      </div>
    </section>
  );
};

export default EvaluationScreen;
