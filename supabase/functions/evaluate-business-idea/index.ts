
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Log that the function is being called and check for API key
    console.log('Evaluate business idea function called');
    
    if (!openAIApiKey) {
      console.error('OpenAI API key is not set in environment variables');
      throw new Error('OpenAI API key is not configured');
    }

    const { idea } = await req.json();

    if (!idea) {
      return new Response(
        JSON.stringify({ error: 'No idea provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
You are an AI business advisor trained by Good Business. Evaluate the following idea based on its alignment with faith-based impact, business viability, and scalability. Score the idea from 0 to 100, and explain your reasoning across 5 key areas:

1. Purpose & Values Driven Impact – Does your idea aim to make a meaningful difference in the lives of others or the communities it touches?
2. Problem-Solution Fit – Is it solving a real, specific problem for a real audience?
3. Viability – Can it generate income sustainably?
4. Feasibility – Can it be built quickly and realistically within your set budget?
5. Scalability – Can it grow beyond your local area to create greater impact?

Format your response like this:

🧪 Good Idea Score: XX/100

✅ Purpose & Values Driven Impact: 
✅ Problem-Solution Fit: 
✅ Viability: 
✅ Feasibility: 
✅ Scalability: 

Verdict: [your opinion]

Business Idea:
"""${idea}"""
    `;

    console.log('Sending request to OpenAI API');
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',  // Using gpt-4o-mini for efficiency
          messages: [
            { role: 'system', content: 'You are a business advisor who evaluates business ideas.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.5,  // Reduced from 0.7 for more consistent evaluations
          max_tokens: 1000,  // Added max_tokens parameter for response length control
          top_p: 0.9,        // Added top_p parameter for response diversity control
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('OpenAI API error:', errorData);
        
        // Check if it's a quota error
        if (errorData.error?.type === 'insufficient_quota') {
          return new Response(
            JSON.stringify({ 
              error: 'Your OpenAI account has exceeded its quota. Please check your billing details at platform.openai.com.' 
            }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(errorData.error?.message || 'Failed to evaluate idea');
      }

      const data = await response.json();
      console.log('Received response from OpenAI API');
      
      const result = data.choices[0].message.content;

      return new Response(
        JSON.stringify({ result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (openaiError) {
      console.error('Error when calling OpenAI:', openaiError);
      return new Response(
        JSON.stringify({ 
          error: `OpenAI API error: ${openaiError.message}. Please check your API key and billing status.` 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in evaluate-business-idea function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
