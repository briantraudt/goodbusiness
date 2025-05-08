
import React, { useRef, useEffect } from 'react';

interface BusinessEvaluationResultProps {
  result: string | null;
  error: string | null;
}

const BusinessEvaluationResult: React.FC<BusinessEvaluationResultProps> = ({
  result,
  error
}) => {
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (result && resultRef.current) {
      // Wait a tiny bit for the DOM to update
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result]);
  
  if (!result && !error) return null;
  
  return (
    <>
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div ref={resultRef} className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
          <pre className="whitespace-pre-wrap font-sans text-base">{result}</pre>
        </div>
      )}
    </>
  );
};

export default BusinessEvaluationResult;
