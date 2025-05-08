
// Email functionality
import { Resend } from "https://esm.sh/resend@1.0.0";
import { corsHeaders } from "./cors.ts";

const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

if (!resendApiKey) {
  console.error('⚠️ CRITICAL ERROR: Resend API key is not configured. Emails cannot be sent.');
}

export const resend = new Resend(resendApiKey);

// Configuration for email sending attempts
export const fromAddresses = [
  'Good Business HQ <notifications@goodbusinesshq.com>',
  'Good Business HQ <noreply@goodbusinesshq.com>',
  'Good Business HQ <hello@goodbusinesshq.com>',
  'Good Business HQ via Resend <onboarding@resend.dev>'
];

export const toRecipients = ['brian@goodbusinesshq.com'];
export const ccRecipients: string[] = []; 
// Removed BCC recipients

// Generate email content
export function generateEmailContent(formData: any) {
  const scoreText = formData.ideaScore ? `${formData.ideaScore}/100` : 'Not evaluated';
  
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

  return { html: emailHtml, text: plainText, scoreText };
}

// Send notification email to admin
export async function sendNotificationEmail(formData: any, requestId: string) {
  const { html, text, scoreText } = generateEmailContent(formData);
  
  let primaryEmailSent = false;
  let emailResponse;
  let lastError;
  
  console.log(`[${requestId}] Will attempt email sending with ${fromAddresses.length} different from addresses`);
  
  for (const fromAddress of fromAddresses) {
    try {
      console.log(`[${requestId}] Attempting to send admin notification with "${fromAddress}" as sender`);
      
      emailResponse = await resend.emails.send({
        from: fromAddress,
        to: toRecipients,
        cc: ccRecipients,
        // Removed BCC
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
      throw new Error(`Failed to send notification email: ${finalErr.message}`);
    }
  }
  
  return emailResponse;
}

// Send confirmation email to submitter
export async function sendConfirmationEmail(formData: any, requestId: string) {
  const { scoreText } = generateEmailContent(formData);
  
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
    return confirmationResponse;
  } catch (confirmationError) {
    console.error(`[${requestId}] Error sending confirmation email:`, confirmationError);
    console.error(`[${requestId}] Error details:`, JSON.stringify(confirmationError));
    // Don't fail the whole submission if just the confirmation email fails
    return null;
  }
}
