
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface BusinessEvaluationResultProps {
  result: string | null;
  error: string | null;
  score: number | null;
  emailStatus?: string | null;
}

const BusinessEvaluationResult: React.FC<BusinessEvaluationResultProps> = ({
  result,
  error,
  score,
  emailStatus
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
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }
  
  // Always show the full evaluation result, regardless of score
  return (
    <div ref={resultRef} className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      {emailStatus && (
        <div className={`mb-4 p-4 rounded-md ${
          emailStatus.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-amber-50 border border-amber-200 text-amber-700'
        }`}>
          <div className="flex items-start">
            {emailStatus.includes('successfully') 
              ? <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
              : <AlertTriangle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            }
            <span>{emailStatus}</span>
          </div>
        </div>
      )}
      
      <pre className="whitespace-pre-wrap font-sans text-base">{result}</pre>
      
      <div className="mt-8 text-center">
        <Button asChild className="bg-gb-green hover:bg-gb-green/90 text-white rounded-lg px-6 py-3 h-auto">
          <Link to="/contact">
            Let's Build It!
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default BusinessEvaluationResult;
