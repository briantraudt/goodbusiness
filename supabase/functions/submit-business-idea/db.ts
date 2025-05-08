
// Database operations
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { corsHeaders } from "./cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('⚠️ Supabase credentials are not configured correctly.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function storeSubmission(formData: any, requestId: string) {
  console.log(`[${requestId}] Storing submission in database...`);
  
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
    console.error(`[${requestId}] Error storing submission:`, error);
    throw new Error(`Database error: ${error.message}`);
  }
  
  console.log(`[${requestId}] Database storage successful. Row ID:`, data?.[0]?.id);
  return data;
}
