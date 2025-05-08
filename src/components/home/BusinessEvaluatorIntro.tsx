
import React from 'react';

const BusinessEvaluatorIntro: React.FC = () => {
  return (
    <div className="mb-8">
      <p className="text-lg text-gray-600 mb-6">
        Have an idea and wondering if it's worth pursuing? Our Business Evaluator will give you instant feedback based on the following five key criteria that we think are most important:
      </p>
      
      <ol className="list-decimal pl-6 space-y-3 mb-6 text-gray-700">
        <li><strong>Purpose & Values Driven Impact</strong> – Does your idea aim to make a meaningful difference in the lives of others or the communities it touches?</li>
        <li><strong>Problem-Solution Fit</strong> – Is it solving a real, specific problem for a real audience?</li>
        <li><strong>Viability</strong> – Can it generate income sustainably?</li>
        <li><strong>Feasibility</strong> – Can it be built quickly and realistically within your set budget?</li>
        <li><strong>Scalability</strong> – Can it grow beyond your local area to create greater impact?</li>
      </ol>
      
      <p className="text-lg text-gray-600">
        Type your idea in 1–2 paragraphs below, and we'll give you a personalized score and feedback in seconds.
      </p>
    </div>
  );
};

export default BusinessEvaluatorIntro;
