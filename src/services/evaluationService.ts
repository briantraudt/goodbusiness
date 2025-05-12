
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Submits a business idea for evaluation to the Supabase function
 */
export const evaluateBusinessIdea = async (idea: string) => {
  try {
    const { data, error: supabaseError } = await supabase.functions.invoke('evaluate-business-idea', {
      body: { idea }
    });

    if (supabaseError) {
      console.error('Supabase function error:', supabaseError);
      throw new Error(supabaseError.message);
    }
    
    if (data?.error) {
      console.error('Function returned error:', data.error);
      
      // Handle billing/quota issues specifically
      if (data.error.includes('quota') || data.error.includes('billing')) {
        toast.error('API quota exceeded');
        return { 
          success: false, 
          error: 'Your OpenAI API key has exceeded its quota. Please check your billing details on the OpenAI platform.',
          result: null,
          score: null
        };
      }
      
      throw new Error(data.error);
    }
    
    if (!data?.result) {
      throw new Error('No result returned from the evaluation.');
    }

    // Extract score from the result with improved parsing
    let extractedScore = null;
    
    // Try to match patterns like "Good Idea Score: 88/100" or "Overall score: 88"
    const scorePatterns = [
      /(?:good idea score|overall score|score):\s*(\d+)(?:\/100)?/i,
      /(\d+)\/100/i
    ];
    
    for (const pattern of scorePatterns) {
      const match = data.result.match(pattern);
      if (match && match[1]) {
        extractedScore = parseInt(match[1], 10);
        console.log(`Extracted score ${extractedScore} using pattern:`, pattern);
        break;
      }
    }

    return {
      success: true,
      error: null,
      result: data.result,
      score: extractedScore
    };
  } catch (err) {
    console.error('Error evaluating business idea:', err);
    return {
      success: false,
      error: `Failed to evaluate business idea. ${err instanceof Error ? err.message : 'Please try again later.'}`,
      result: null,
      score: null
    };
  }
};

/**
 * Stores evaluation data in Supabase database
 */
export const storeEvaluationData = async (
  name: string,
  email: string,
  idea: string,
  score: number | null,
  result: string
) => {
  try {
    const timestamp = new Date().toISOString();
    const { error: storeError } = await supabase
      .from('business_evaluations')
      .insert([
        { 
          name, 
          email, 
          idea, 
          score, 
          result,
          evaluation_date: timestamp
        }
      ]);
    
    if (storeError) {
      console.error('Error storing evaluation:', storeError);
      toast.error('Could not save your evaluation');
      return false;
    }
    
    toast.success('Evaluation saved successfully');
    return true;
  } catch (storeErr) {
    console.error('Failed to store evaluation data:', storeErr);
    return false;
  }
};
