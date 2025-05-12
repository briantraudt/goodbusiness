
// Main function to send notifications about business idea evaluations
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get environment variables
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get request body
    const { idea, name, email, score, result, sendUserConfirmation = false } = await req.json();
    
    // Validate required parameters
    if (!idea || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing notification for ${email} with score ${score}`);

    // Check if Resend API key is available
    if (!resendApiKey) {
      console.warn('Resend API key not configured. Email notifications will not be sent.');
      
      // Still return success but note that emails were not sent
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: 'Email notifications not sent due to missing API key' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Resend client with simple fetch-based wrapper
    const resend = {
      emails: {
        send: async (options: any) => {
          const url = 'https://api.resend.com/emails';
          
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(options)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(`Resend API error: ${JSON.stringify(data)}`);
            }
            
            return data;
          } catch (error) {
            console.error('Error sending email via Resend API:', error);
            throw error;
          }
        }
      }
    };

    // Format the idea summary for email
    const ideaSummary = idea.length > 100 ? `${idea.substring(0, 100)}...` : idea;
    const scoreText = score ? `${score}/100` : 'Not available';

    // Send admin notification email
    const adminEmailHtml = `
      <h1>New Business Idea Evaluation</h1>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email || 'Not provided'}</p>
      <p><strong>Score:</strong> ${scoreText}</p>
      <h2>Business Idea</h2>
      <p>${idea}</p>
      <h2>Evaluation Results</h2>
      <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${result || 'No results available'}</pre>
    `;

    try {
      // Create a Supabase client for storing notification attempts
      const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
      
      // Track email delivery attempts
      let adminEmailSent = false;
      let userEmailSent = false;
      
      try {
        // Send notification to admin
        await resend.emails.send({
          from: 'Good Business HQ <onboarding@resend.dev>',
          to: ['brian@goodbusinesshq.com'],
          subject: `Business Idea Evaluation: ${name || 'Anonymous'} - Score: ${scoreText}`,
          html: adminEmailHtml,
        });
        
        adminEmailSent = true;
        console.log('Admin notification sent successfully');
      } catch (adminEmailError) {
        console.error('Error sending admin notification email:', adminEmailError);
        
        // Log the email sending error to Supabase
        try {
          await supabaseClient
            .from('email_delivery_logs')
            .insert([{
              recipient_type: 'admin',
              recipient_email: 'brian@goodbusinesshq.com',
              subject: `Business Idea Evaluation: ${name || 'Anonymous'} - Score: ${scoreText}`,
              error_message: adminEmailError.message,
              idea_submitted: ideaSummary,
              submitter_email: email
            }]);
        } catch (logError) {
          console.error('Error logging admin email failure:', logError);
        }
      }
      
      // Send confirmation email to the user if requested
      if (sendUserConfirmation) {
        const userEmailHtml = `
          <h1>Thank You for Your Business Idea Submission!</h1>
          <p>Dear ${name || 'Valued Client'},</p>
          <p>We've received and evaluated your business idea. Your idea received a score of <strong>${scoreText}</strong>.</p>
          <h2>Your Business Idea</h2>
          <p>${idea}</p>
          <h2>Evaluation Summary</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            ${result || 'Your idea is being reviewed by our team.'}
          </div>
          <p>We appreciate your submission and interest in Good Business HQ.</p>
          <p>If you have any questions, please feel free to contact us.</p>
          <p>Best regards,<br>The Good Business HQ Team</p>
        `;
        
        try {
          await resend.emails.send({
            from: 'Good Business HQ <onboarding@resend.dev>',
            to: [email],
            subject: `Your Business Idea Evaluation Results`,
            html: userEmailHtml,
          });
          
          userEmailSent = true;
          console.log('User confirmation email sent successfully');
        } catch (userEmailError) {
          console.error('Error sending user confirmation email:', userEmailError);
          
          // Log the email sending error to Supabase
          try {
            await supabaseClient
              .from('email_delivery_logs')
              .insert([{
                recipient_type: 'user',
                recipient_email: email,
                subject: 'Your Business Idea Evaluation Results',
                error_message: userEmailError.message,
                idea_submitted: ideaSummary
              }]);
          } catch (logError) {
            console.error('Error logging user email failure:', logError);
          }
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true,
          adminEmailSent,
          userEmailSent,
          emailsConfigured: !!resendApiKey
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (error) {
      console.error('Error in notification process:', error);
      throw error;
    }

  } catch (error) {
    console.error('Error in notify-business-evaluation function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
