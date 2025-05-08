
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import BusinessEvaluator from '@/components/home/BusinessEvaluator';

const BusinessEvaluatorPage = () => {
  return (
    <PageLayout>
      <div className="py-16 bg-gb-dark text-white">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Business Evaluator
          </h1>
          <p className="text-xl text-white/80">
            See if your idea has the potential to be a Go<span className="text-gb-green">o</span>d Business.
          </p>
        </div>
      </div>
      <BusinessEvaluator />
    </PageLayout>
  );
};

export default BusinessEvaluatorPage;
