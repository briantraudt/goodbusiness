
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

    // Check if the idea is too short or generic
    if (idea.trim().length < 15 || /^(test|hello|hi|example|asdf|qwerty|trying this out|sample|placeholder)$/i.test(idea.trim())) {
      console.log('Received low-effort submission:', idea);
      
      const lowEffortResponse = `
🧪 Good Idea Score: 0/100

Your submission appears to be too brief or generic. This idea doesn't meet our minimum threshold for being a "Good Business". 

We're looking for detailed business ideas that demonstrate purpose-driven impact, clear problem-solution fit, viability, feasibility, and scalability potential.

Please submit a more developed business concept with sufficient detail for a meaningful evaluation.
      `;
      
      return new Response(
        JSON.stringify({ result: lowEffortResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

IMPORTANT: When evaluating "Purpose & Values Driven Impact":
- If the idea explicitly mentions faith, spiritual elements, or religious components, acknowledge and highlight this positively as a priority, mentioning specifically how faith integration strengthens the concept.
- If the idea doesn't mention faith components, simply evaluate the general purpose and social impact without calling out the absence of faith elements.
- Remember to be strict with low-effort submissions and rate them as 0/100 if they lack sufficient detail.

IMPORTANT FOR LOW SCORES:
- If the total score is below 50/100, replace the detailed evaluation with this simplified response:
"🧪 Good Idea Score: XX/100

This idea doesn't meet our minimum threshold for being a "Good Business". 

We're looking for business ideas that demonstrate purpose-driven impact, clear problem-solution fit, viability, feasibility, and scalability potential.

Please revisit your concept focusing on these areas to create a stronger business proposal."

IMPORTANT FOR SCORES BELOW 85/100:
- For scores between 50/100 and 84/100, make sure the "Verdict" section includes SPECIFIC, actionable improvement suggestions based on the weak areas identified in the evaluation.
- The verdict should explicitly mention what improvements would be needed to potentially receive a higher score, focusing on the weakest areas first.
- Be constructive and encouraging, providing at least 3-4 specific actions the person could take to strengthen their idea.
- Format this section as:
"Verdict: Here's what could make this idea stronger:
1. [Specific improvement suggestion related to weakest area]
2. [Another specific improvement suggestion]
3. [Another specific improvement suggestion]
4. [Final improvement suggestion]

With these improvements, your concept could become a more viable Good Business and potentially receive a higher score in future evaluations."

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
            { role: 'system', content: 'You are a business advisor who evaluates business ideas. Be strict with low-effort submissions and rate them as 0/100. When faith elements are mentioned in the idea, acknowledge and celebrate them positively. For scores below 85/100, always provide specific, actionable improvement suggestions.' },
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
