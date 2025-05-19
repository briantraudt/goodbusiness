
// Email functionality
import { resend } from "./resend-client.ts";
import { generateEmailContent } from "./email-templates.ts";
import { fromAddresses, toRecipients, ccRecipients } from "./email-config.ts";

// Send notification email to admin
export async function sendNotificationEmail(formData: any, requestId: string) {
  const { html, text, scoreText } = generateEmailContent(formData);
  
  let primaryEmailSent = false;
  let emailResponse;
  let lastError;
  
  console.log(`[${requestId}] Will attempt email sending with ${fromAddresses.length} different from addresses`);
  console.log(`[${requestId}] Email recipients: ${toRecipients.join(', ')}`);
  
  // First attempt - try with all configured from addresses
  for (const fromAddress of fromAddresses) {
    try {
      console.log(`[${requestId}] Attempting to send admin notification with "${fromAddress}" as sender to ${toRecipients.join(', ')}`);
      
      // Add detailed logging for API key check
      console.log(`[${requestId}] Using Resend API key starting with: ${(Deno.env.get('RESEND_API_KEY') || '').substring(0, 3)}...`);
      
      emailResponse = await resend.emails.send({
        from: fromAddress,
        to: toRecipients,
        cc: ccRecipients,
        reply_to: formData.email,
        subject: `[URGENT] New Business Idea: ${formData.fullName} (Score: ${scoreText})`,
        html,
        text,
      });
      
      console.log(`[${requestId}] Admin notification sent successfully with ${fromAddress}:`, emailResponse);
      primaryEmailSent = true;
      break;
    } catch (err) {
      console.error(`[${requestId}] Failed to send with ${fromAddress}:`, err);
      console.error(`[${requestId}] Error details:`, JSON.stringify(err, null, 2));
      lastError = err;
    }
  }
  
  if (!primaryEmailSent) {
    console.error(`[${requestId}] ⚠️ CRITICAL: Failed to send primary notification email with all configurations`);
    console.error(`[${requestId}] Last error:`, JSON.stringify(lastError, null, 2));
    
    // Try a last-resort email with minimal configuration
    try {
      console.log(`[${requestId}] Attempting last-resort email delivery with simplified configuration`);
      
      // Use the Resend default onboarding sender as a last resort
      const lastResortResponse = await resend.emails.send({
        from: 'Resend <onboarding@resend.dev>',
        to: 'brian@goodbusinesshq.com',
        subject: 'URGENT: Business Idea Submission (Simplified Email)',
        text: `New business idea submission from ${formData.fullName} (${formData.email}). Score: ${scoreText}.\n\nPlease check your Supabase database for full details.`,
      });
      
      console.log(`[${requestId}] Last resort email sent:`, lastResortResponse);
      return lastResortResponse;
    } catch (finalErr) {
      console.error(`[${requestId}] Even last resort email failed:`, finalErr);
      console.error(`[${requestId}] Final error details:`, JSON.stringify(finalErr, null, 2));
      throw new Error(`Failed to send notification email: ${finalErr.message}`);
    }
  }
  
  return emailResponse;
}
