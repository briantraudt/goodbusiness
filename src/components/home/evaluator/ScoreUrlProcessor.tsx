
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ScoreUrlProcessorResult {
  initialScore: number | null;
}

/**
 * A hook for processing score parameters from the URL
 */
export const useScoreUrlProcessor = (): ScoreUrlProcessorResult => {
  const [searchParams] = useSearchParams();
  const [initialScore, setInitialScore] = useState<number | null>(null);
  
  useEffect(() => {
    // Get any score from URL parameters
    const scoreParam = searchParams.get('score');
    const parsedScore = scoreParam ? parseInt(scoreParam, 10) : null;
    setInitialScore(parsedScore);
    
    // Force scroll to top when the page loads or URL parameters change
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [searchParams]);
  
  return { initialScore };
};
