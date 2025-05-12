
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BusinessEvaluationResultProps {
  result: string | null;
  error: string | null;
  score: number | null;
}

const BusinessEvaluationResult: React.FC<BusinessEvaluationResultProps> = ({
  result,
  error,
  score
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
  
  // If no result or error, don't render anything
  if (!result && !error) return null;
  
  // For error messages, always show them
  if (error) {
    return (
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
        {error}
      </div>
    );
  }
  
  // Always show the full evaluation result, regardless of score
  return (
    <div ref={resultRef} className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <pre className="whitespace-pre-wrap font-sans text-base">{result}</pre>
      
      <div className="mt-8 text-center">
        <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white rounded-lg px-6 py-3 h-auto">
          <Link to="/contact">
            Want to Build Something?
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BusinessEvaluationResult;
