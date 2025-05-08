
import React, { useEffect } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import BusinessEvaluator from '@/components/home/BusinessEvaluator';
import { useBusinessEvaluation } from '@/hooks/useBusinessEvaluation';

const BusinessEvaluatorPage = () => {
  const { score, showContactFormOnly } = useBusinessEvaluation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Only show the business evaluator header if we're not in the private invitation screen
  const showBusinessEvaluatorHeader = !(showContactFormOnly && score !== null && score >= 75);
  
  return (
    <PageLayout>
      {showBusinessEvaluatorHeader && (
        <div className="py-16 bg-gb-dark text-white">
          <div className="container-custom">
            <div className="flex items-center gap-4">
              <div className="bg-gb-green text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0">
                1
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Business Evaluator
                </h1>
                <p className="text-xl text-white/80">
                  See if your idea has the potential to be a Go<span className="text-gb-green">o</span>d Business.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <BusinessEvaluator />
    </PageLayout>
  );
};

export default BusinessEvaluatorPage;
