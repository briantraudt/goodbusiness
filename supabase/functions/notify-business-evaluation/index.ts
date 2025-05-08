
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Use the provided API key directly
const resendApiKey = 're_7qs3S2sn_6MjZBEDUSqoqyGzw94xaCRdZ';
const resend = new Resend(resendApiKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Configuration for email sending attempts
const fromAddresses = [
  'Good Business HQ <notifications@goodbusinesshq.com>',
  'Good Business HQ <noreply@goodbusinesshq.com>',
  'Good Business HQ <hello@goodbusinesshq.com>',
  'Good Business HQ via Resend <onboarding@resend.dev>'
];

const toRecipients = ['brian@goodbusinesshq.com'];
// Removed BCC recipients

serve(async (req) => {
  // Add request tracking for debugging
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] New notify-business-evaluation request received: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!resendApiKey) {
      console.error(`[${requestId}] ⚠️ CRITICAL ERROR: Resend API key is not configured. Emails cannot be sent.`);
      throw new Error('Resend API key is not configured');
    }

    const { idea, score, result } = await req.json();
    
    if (!idea) {
      console.error(`[${requestId}] Missing required field: idea`);
      return new Response(
        JSON.stringify({ error: 'Business idea is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[${requestId}] Processing evaluation notification for idea with score: ${score}`);
    
    // Generate email content
    const emailHtml = `
      <h1>New Business Idea Evaluation</h1>
      <h2>Score: ${score !== null ? `${score}/100` : 'Not available'}</h2>
      
      <h3>Business Idea</h3>
      <p>${idea}</p>
      
      <h3>Evaluation Result</h3>
      <pre>${result || 'No evaluation result available'}</pre>
    `;
    
    const plainText = `
New Business Idea Evaluation
Score: ${score !== null ? `${score}/100` : 'Not available'}

BUSINESS IDEA
${idea}

EVALUATION RESULT
${result || 'No evaluation result available'}
`;

    // Log the exact configuration being used
    console.log(`[${requestId}] Using Resend API key: ${resendApiKey ? 'API key is set' : 'API key is missing'}`);
    console.log(`[${requestId}] Sending to: ${toRecipients.join(', ')}`);
    
    // Try to send email with multiple from addresses if needed
    let emailSent = false;
    let lastError;
    let emailResponse;
    
    for (const fromAddress of fromAddresses) {
      try {
        console.log(`[${requestId}] Attempting to send evaluation notification with "${fromAddress}" as sender`);
        
        emailResponse = await resend.emails.send({
          from: fromAddress,
          to: toRecipients,
          // Removed BCC
          subject: `[NEW EVALUATION] Business Idea (Score: ${score !== null ? score : 'N/A'})`,
          html: emailHtml,
          text: plainText,
        });
        
        console.log(`[${requestId}] Evaluation notification sent successfully with ${fromAddress}:`, emailResponse);
        emailSent = true;
        break;
      } catch (err) {
        console.error(`[${requestId}] Failed to send with ${fromAddress}:`, err);
        lastError = err;
        
        // Log more detailed error information
        if (err.response) {
          console.error(`[${requestId}] Error response data:`, err.response.data);
        }
      }
    }
    
    if (!emailSent) {
      console.error(`[${requestId}] ⚠️ CRITICAL: Failed to send evaluation notification email with all configurations`);
      console.error(`[${requestId}] Last error:`, lastError);
      
      // Try a last-resort email with minimal configuration
      try {
        console.log(`[${requestId}] Attempting last-resort email delivery with simplified configuration`);
        
        emailResponse = await resend.emails.send({
          from: 'Resend <onboarding@resend.dev>',
          to: 'brian@goodbusinesshq.com',
          subject: 'URGENT: Business Idea Evaluation (Simplified Email)',
          text: `New business idea evaluation. Score: ${score !== null ? score : 'N/A'}.\n\nIdea: ${idea.substring(0, 100)}...`,
        });
        
        console.log(`[${requestId}] Last resort email sent:`, emailResponse);
        emailSent = true;
      } catch (finalErr) {
        console.error(`[${requestId}] Even last resort email failed:`, finalErr);
        throw new Error(`Failed to send notification email: ${finalErr.message}`);
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Evaluation notification sent' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error(`[${requestId}] Error in notify-business-evaluation function:`, error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
