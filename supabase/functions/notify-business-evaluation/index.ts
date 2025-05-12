
// Main function to send notifications about business idea evaluations
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Generate a unique request ID for tracking
  const requestId = crypto.randomUUID();
  
  console.log(`[${requestId}] Notification request received`);
  
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
      console.error(`[${requestId}] Missing Supabase environment variables`);
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get request body
    const { idea, name, email, score, result, sendUserConfirmation = false, timestamp } = await req.json();
    
    // Validate required parameters
    if (!idea || !email) {
      console.error(`[${requestId}] Missing required parameters`);
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[${requestId}] Processing notification for ${email} with score ${score}`);

    // Create a Supabase client for logging
    const supabaseClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify Resend API Key validity
    if (!resendApiKey) {
      console.warn(`[${requestId}] CRITICAL: Resend API key not configured. Email notifications will not be sent.`);
      
      // Log the missing API key error
      try {
        await supabaseClient
          .from('email_delivery_logs')
          .insert([{
            recipient_type: 'system',
            error_message: 'RESEND_API_KEY is not configured in Supabase secrets',
            idea_submitted: idea.substring(0, 100),
            submitter_email: email,
            created_at: new Date().toISOString()
          }]);
      } catch (logError) {
        console.error(`[${requestId}] Error logging missing API key:`, logError);
      }
      
      // Return with clear indication that emails were not sent
      return new Response(
        JSON.stringify({ 
          success: false, 
          emailsConfigured: false,
          warning: 'Email service not configured. Please add RESEND_API_KEY to Supabase secrets.' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify API key pattern (simple validation to catch obviously malformed keys)
    // Resend API keys typically start with "re_" followed by a string of alphanumeric characters
    const validResendKeyPattern = /^re_[a-zA-Z0-9]{30,}/;
    const isKeyValidFormat = validResendKeyPattern.test(resendApiKey);
    
    if (!isKeyValidFormat) {
      console.error(`[${requestId}] CRITICAL: Resend API key appears to be in an invalid format`);
      
      // Log the invalid key format error
      try {
        await supabaseClient
          .from('email_delivery_logs')
          .insert([{
            recipient_type: 'system',
            error_message: 'RESEND_API_KEY is in an invalid format (should start with re_)',
            idea_submitted: idea.substring(0, 100),
            submitter_email: email,
            created_at: new Date().toISOString()
          }]);
      } catch (logError) {
        console.error(`[${requestId}] Error logging invalid key format:`, logError);
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          emailsConfigured: false,
          warning: 'Email service API key appears to be in an incorrect format. API keys should start with "re_".' 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Resend client with robust error handling
    const resend = {
      emails: {
        send: async (options: any) => {
          const url = 'https://api.resend.com/emails';
          
          try {
            console.log(`[${requestId}] Sending email to ${options.to.join(', ')} from ${options.from}`);
            
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
              console.error(`[${requestId}] Resend API error: Status ${response.status}`, data);
              
              // Log more details about the API key issue
              if (response.status === 401 || response.status === 403 || 
                  (data?.message && data.message.toLowerCase().includes('key'))) {
                console.error(`[${requestId}] API key authentication issue. Key might be revoked, expired, or invalid.`);
                
                // Log the API key authentication issue to Supabase
                try {
                  await supabaseClient
                    .from('email_delivery_logs')
                    .insert([{
                      recipient_type: 'system',
                      error_message: `API key authentication failed: ${data.message || 'Unknown reason'}`,
                      created_at: new Date().toISOString()
                    }]);
                } catch (logError) {
                  console.error(`[${requestId}] Error logging API key issue:`, logError);
                }
                
                throw new Error(`API key authentication error: ${JSON.stringify(data)}`);
              }
              
              throw new Error(`Resend API error: ${JSON.stringify(data)}`);
            }
            
            console.log(`[${requestId}] Email sent successfully:`, data);
            return data;
          } catch (error) {
            console.error(`[${requestId}] Error sending email via Resend API:`, error);
            throw error;
          }
        }
      }
    };

    // Format the idea summary for email
    const ideaSummary = idea.length > 100 ? `${idea.substring(0, 100)}...` : idea;
    const scoreText = score ? `${score}/100` : 'Not available';

    // Detailed admin email with HTML formatting
    const adminEmailHtml = `
      <h1>New Business Idea Evaluation</h1>
      <p><strong>Name:</strong> ${name || 'Not provided'}</p>
      <p><strong>Email:</strong> ${email || 'Not provided'}</p>
      <p><strong>Score:</strong> ${scoreText}</p>
      <p><strong>Timestamp:</strong> ${timestamp || new Date().toISOString()}</p>
      <h2>Business Idea</h2>
      <p>${idea}</p>
      <h2>Evaluation Results</h2>
      <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${result || 'No results available'}</pre>
    `;

    try {
      // Track email delivery attempts
      let adminEmailSent = false;
      let userEmailSent = false;
      
      try {
        // Try multiple email configurations if the first one fails
        const fromAddresses = [
          'Good Business HQ <onboarding@resend.dev>',
          'Good Business HQ <notifications@goodbusinesshq.com>',
          'Resend <onboarding@resend.dev>',
          'Notifications <hello@goodbusinesshq.com>'
        ];
        
        let adminEmailError = null;
        
        // Try each from address until one works
        for (const fromAddress of fromAddresses) {
          try {
            console.log(`[${requestId}] Attempting to send admin email using: ${fromAddress}`);
            
            // Send notification to admin
            await resend.emails.send({
              from: fromAddress,
              to: ['brian@goodbusinesshq.com'],
              subject: `Business Idea Evaluation: ${name || 'Anonymous'} - Score: ${scoreText}`,
              html: adminEmailHtml,
            });
            
            adminEmailSent = true;
            console.log(`[${requestId}] Admin notification sent successfully using ${fromAddress}`);
            break; // Exit the loop if successful
          } catch (err) {
            console.error(`[${requestId}] Failed to send admin email with ${fromAddress}:`, err);
            adminEmailError = err;
          }
        }
        
        // If all attempts failed, log the error
        if (!adminEmailSent) {
          console.error(`[${requestId}] All attempts to send admin email failed`);
          
          // Log the email sending error to Supabase
          try {
            await supabaseClient
              .from('email_delivery_logs')
              .insert([{
                recipient_type: 'admin',
                recipient_email: 'brian@goodbusinesshq.com',
                subject: `Business Idea Evaluation: ${name || 'Anonymous'} - Score: ${scoreText}`,
                error_message: adminEmailError ? adminEmailError.message : 'All sending attempts failed',
                idea_submitted: ideaSummary,
                submitter_email: email,
                created_at: new Date().toISOString()
              }]);
          } catch (logError) {
            console.error(`[${requestId}] Error logging admin email failure:`, logError);
          }
        }
      } catch (adminEmailError) {
        console.error(`[${requestId}] Error sending admin notification email:`, adminEmailError);
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
          // Try multiple from addresses for user email too
          const userFromAddresses = [
            'Good Business HQ <onboarding@resend.dev>', 
            'Good Business HQ <notifications@goodbusinesshq.com>',
            'Good Business HQ <hello@goodbusinesshq.com>',
            'Resend <onboarding@resend.dev>'
          ];
          
          let userEmailError = null;
          
          for (const fromAddress of userFromAddresses) {
            try {
              console.log(`[${requestId}] Attempting to send user confirmation email using: ${fromAddress}`);
              
              await resend.emails.send({
                from: fromAddress,
                to: [email],
                subject: `Your Business Idea Evaluation Results`,
                html: userEmailHtml,
              });
              
              userEmailSent = true;
              console.log(`[${requestId}] User confirmation email sent successfully using ${fromAddress}`);
              break;
            } catch (err) {
              console.error(`[${requestId}] Failed to send user email with ${fromAddress}:`, err);
              userEmailError = err;
            }
          }
          
          if (!userEmailSent) {
            console.error(`[${requestId}] All attempts to send user email failed`);
            
            // Log the email sending error to Supabase
            try {
              await supabaseClient
                .from('email_delivery_logs')
                .insert([{
                  recipient_type: 'user',
                  recipient_email: email,
                  subject: 'Your Business Idea Evaluation Results',
                  error_message: userEmailError ? userEmailError.message : 'All sending attempts failed',
                  idea_submitted: ideaSummary,
                  created_at: new Date().toISOString()
                }]);
            } catch (logError) {
              console.error(`[${requestId}] Error logging user email failure:`, logError);
            }
          }
        } catch (userEmailError) {
          console.error(`[${requestId}] Error sending user confirmation email:`, userEmailError);
        }
      }

      // Determine if we should suggest checking the Resend API key
      const allAttemptsFailed = !adminEmailSent && !userEmailSent;
      let warningMessage = null;
      
      if (allAttemptsFailed) {
        warningMessage = 'All email sending attempts failed. Please verify your Resend API key is valid and correctly configured.';
      } else if (!userEmailSent && sendUserConfirmation) {
        warningMessage = 'Could not send confirmation email to your address. Please check your email later.';
      }
      
      return new Response(
        JSON.stringify({ 
          success: true,
          adminEmailSent,
          userEmailSent,
          emailsConfigured: true,
          warning: warningMessage
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (error) {
      console.error(`[${requestId}] Error in notification process:`, error);
      throw error;
    }

  } catch (error) {
    console.error(`[${requestId}] Error in notify-business-evaluation function:`, error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
