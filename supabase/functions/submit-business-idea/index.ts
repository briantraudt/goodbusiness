
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { Resend } from "https://esm.sh/resend@1.0.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

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

    // Send email notification
    try {
      const scoreText = formData.ideaScore ? `${formData.ideaScore}/100` : 'Not evaluated';
      
      await resend.emails.send({
        from: 'Good Business HQ <onboarding@resend.dev>',
        to: 'brian@goodbusinesshq.com',
        subject: `New Business Idea Submission: ${formData.fullName}`,
        html: `
          <h1>New Business Idea Submission</h1>
          <h2>Score: ${scoreText}</h2>
          
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${formData.fullName}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
          <p><strong>Company:</strong> ${formData.companyName || 'Not provided'}</p>
          
          <h3>Business Idea</h3>
          <p><strong>Description:</strong> ${formData.businessIdea}</p>
          <p><strong>Problem & Solution:</strong> ${formData.problemSolution}</p>
          <p><strong>Target Customers:</strong> ${formData.customers || 'Not provided'}</p>
          <p><strong>Profit Type:</strong> ${formData.profitType}</p>
          
          <h3>Business Stage & Budget</h3>
          <p><strong>Stage:</strong> ${formData.businessStage}</p>
          <p><strong>Budget:</strong> ${formData.budget}</p>
          
          <h3>Support Needed</h3>
          <p><strong>Help Types:</strong> ${formData.helpTypes?.join(', ') || 'None selected'}</p>
          ${formData.otherHelpExplanation ? `<p><strong>Other Help Explanation:</strong> ${formData.otherHelpExplanation}</p>` : ''}
          
          <h3>Impact & Additional Information</h3>
          <p><strong>Social Impact:</strong> ${formData.socialImpact || 'Not provided'}</p>
          <p><strong>Additional Info:</strong> ${formData.additionalInfo || 'Not provided'}</p>
        `
      });

      console.log('Notification email sent successfully');
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // We don't want to fail the submission if just the email fails
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
