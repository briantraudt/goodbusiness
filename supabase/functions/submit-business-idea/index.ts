
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    const formData = await req.json();
    
    console.log('Received business idea submission:', formData);
    
    // Insert the submission into the database
    const { data, error } = await supabase
      .from('business_submissions')
      .insert([
        {
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          company_name: formData.companyName || null,
          business_idea: formData.businessIdea,
          problem_solution: formData.problemSolution,
          customers: formData.customers || null,
          profit_type: formData.profitType,
          business_stage: formData.businessStage,
          budget: formData.budget,
          help_types: formData.helpTypes || [],
          other_help_explanation: formData.otherHelpExplanation || null,
          social_impact: formData.socialImpact || null,
          additional_info: formData.additionalInfo || null,
          idea_score: formData.ideaScore || null
        }
      ])
      .select();
    
    if (error) {
      console.error('Error storing submission:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in submit-business-idea function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
