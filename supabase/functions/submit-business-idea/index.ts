
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0";
import { Resend } from "https://esm.sh/resend@1.0.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

console.log('Function initialized with:');
console.log('- Supabase URL available:', !!supabaseUrl);
console.log('- Supabase Service Key available:', !!supabaseServiceKey);
console.log('- Resend API Key available:', !!resendApiKey);

if (!resendApiKey) {
  console.error('⚠️ CRITICAL ERROR: Resend API key is not configured. Emails cannot be sent.');
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Add request tracking for debugging
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] New request received: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.json();
    
    console.log(`[${requestId}] Received business idea submission:`, formData);
    
    // Insert the submission into the database
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
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`[${requestId}] Database storage successful. Row ID:`, data?.[0]?.id);

    // Debug information for email setup
    if (!resendApiKey) {
      console.error(`[${requestId}] ⚠️ CRITICAL: Cannot send emails - Resend API key is missing`);
    }

    // Prepare email content
    try {
      const scoreText = formData.ideaScore ? `${formData.ideaScore}/100` : 'Not evaluated';
      
      console.log(`[${requestId}] Preparing email notification content with score: ${scoreText}`);
      
      const emailHtml = `
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
      `;
      
      const plainText = `
New Business Idea Submission
Score: ${scoreText}

CONTACT INFORMATION
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.companyName || 'Not provided'}

BUSINESS IDEA
Description: ${formData.businessIdea}
Problem & Solution: ${formData.problemSolution}
Target Customers: ${formData.customers || 'Not provided'}
Profit Type: ${formData.profitType}

BUSINESS STAGE & BUDGET
Stage: ${formData.businessStage}
Budget: ${formData.budget}

SUPPORT NEEDED
Help Types: ${formData.helpTypes?.join(', ') || 'None selected'}
${formData.otherHelpExplanation ? `Other Help Explanation: ${formData.otherHelpExplanation}` : ''}

IMPACT & ADDITIONAL INFORMATION
Social Impact: ${formData.socialImpact || 'Not provided'}
Additional Info: ${formData.additionalInfo || 'Not provided'}
      `;
      
      // Testing multiple configurations to improve email delivery
      // 1. Try multiple from addresses
      const fromAddresses = [
        'Good Business HQ <notifications@goodbusinesshq.com>',
        'Good Business HQ <noreply@goodbusinesshq.com>',
        'Good Business HQ <hello@goodbusinesshq.com>',
        'Good Business HQ via Resend <onboarding@resend.dev>'
      ];
      
      // 2. Try multiple recipients configurations
      const toRecipients = ['brian@goodbusinesshq.com'];
      const ccRecipients = []; 
      const bccRecipients = ['hq@goodbusinesshq.com'];
      
      // Try each from address until one works
      let primaryEmailSent = false;
      let emailResponse;
      let lastError;
      
      console.log(`[${requestId}] Will attempt email sending with ${fromAddresses.length} different from addresses`);
      
      for (const fromAddress of fromAddresses) {
        try {
          console.log(`[${requestId}] Attempting to send email with "${fromAddress}" as the sender`);
          
          // Debug logging for Resend API key
          console.log(`[${requestId}] Resend API key present:`, !!resendApiKey);
          if (resendApiKey) {
            console.log(`[${requestId}] Resend API key starts with:`, resendApiKey.substring(0, 3) + '[REDACTED]');
          }
          
          // Attempt to send with this configuration
          emailResponse = await resend.emails.send({
            from: fromAddress,
            to: toRecipients,
            cc: ccRecipients,
            bcc: bccRecipients,
            reply_to: formData.email,
            subject: `[URGENT] New Business Idea: ${formData.fullName} (Score: ${scoreText})`,
            html: emailHtml,
            text: plainText,
          });
          
          console.log(`[${requestId}] Email notification sent successfully with ${fromAddress}:`, emailResponse);
          primaryEmailSent = true;
          break;
        } catch (err) {
          console.error(`[${requestId}] Failed to send with ${fromAddress}:`, err);
          console.error(`[${requestId}] Error details:`, JSON.stringify(err));
          lastError = err;
        }
      }
      
      if (!primaryEmailSent) {
        console.error(`[${requestId}] ⚠️ CRITICAL: Failed to send primary notification email with all configurations`);
        console.error(`[${requestId}] Last error:`, lastError);
        
        // Try a last-resort email with minimal configuration
        try {
          console.log(`[${requestId}] Attempting last-resort email delivery with simplified configuration`);
          
          const lastResortResponse = await resend.emails.send({
            from: 'Resend <onboarding@resend.dev>',
            to: 'brian@goodbusinesshq.com',
            subject: 'URGENT: Business Idea Submission (Simplified Email)',
            text: `New business idea submission from ${formData.fullName} (${formData.email}). Score: ${scoreText}.\n\nPlease check your Supabase database for full details.`,
          });
          
          console.log(`[${requestId}] Last resort email sent:`, lastResortResponse);
        } catch (finalErr) {
          console.error(`[${requestId}] Even last resort email failed:`, finalErr);
        }
      }
      
      // Always try to send a confirmation to the submitter
      try {
        console.log(`[${requestId}] Sending confirmation email to submitter: ${formData.email}`);
        
        const confirmationResponse = await resend.emails.send({
          from: 'Good Business HQ <onboarding@resend.dev>',
          to: formData.email,
          subject: `Thank you for your business idea submission to Good Business HQ`,
          html: `
            <h1>Thank You for Your Submission</h1>
            <p>Dear ${formData.fullName},</p>
            <p>We have received your business idea submission and will review it shortly. Your idea scored ${scoreText}.</p>
            <p>Someone from our team will be in touch soon.</p>
            <p>Best regards,<br>Good Business HQ Team</p>
          `,
          text: `Thank you for your business idea submission to Good Business HQ. We have received your submission and will be in touch soon. Your idea scored ${scoreText}.`,
        });
        
        console.log(`[${requestId}] Confirmation email sent successfully:`, confirmationResponse);
      } catch (confirmationError) {
        console.error(`[${requestId}] Error sending confirmation email:`, confirmationError);
        console.error(`[${requestId}] Error details:`, JSON.stringify(confirmationError));
      }
    } catch (emailSetupError) {
      console.error(`[${requestId}] Error preparing or sending emails:`, emailSetupError);
      console.error(`[${requestId}] Error stack:`, emailSetupError.stack);
      // Don't fail the submission if just the email fails
    }
    
    console.log(`[${requestId}] Request completed successfully`);
    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error(`[${requestId}] Error in submit-business-idea function:`, error);
    console.error(`[${requestId}] Error stack:`, error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
