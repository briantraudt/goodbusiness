
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

1. Kingdom Impact – Does it align with Christian values or mission?
2. Problem-Solution Fit – Does it solve a real need clearly and effectively?
3. Revenue Potential – Can it generate sustainable income?
4. Feasibility – Can it be launched quickly with limited resources?
5. Scalability – Can it grow or be replicated in other communities or countries?

Format your response like this:

🧪 Good Idea Score: XX/100

✅ Kingdom Impact: 
✅ Problem-Solution Fit: 
✅ Revenue Potential: 
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
          model: 'gpt-4o-mini',  // Changed from gpt-4o to gpt-4o-mini (cheaper model)
          messages: [
            { role: 'system', content: 'You are a business advisor who evaluates business ideas.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
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
