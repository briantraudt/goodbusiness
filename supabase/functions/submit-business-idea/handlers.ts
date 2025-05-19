
// Request handlers
import { corsHeaders } from "./cors.ts";
import { storeSubmission } from "./db.ts";
import { sendNotificationEmail } from "./email.ts";

export async function handleSubmission(req: Request, requestId: string) {
  try {
    const formData = await req.json();
    
    console.log(`[${requestId}] Received business idea submission for ${formData.fullName} (${formData.email})`);
    console.log(`[${requestId}] Environment check: RESEND_API_KEY exists: ${Boolean(Deno.env.get('RESEND_API_KEY'))}, format valid: ${(Deno.env.get('RESEND_API_KEY') || '').startsWith('re_')}`);
    
    // Step 1: Store the submission in the database
    try {
      const data = await storeSubmission(formData, requestId);
      console.log(`[${requestId}] Database storage completed successfully. Record ID: ${data?.[0]?.id}`);
      
      // Even if email sending fails, we'll return success since the data is stored
      // This ensures the user gets a confirmation message
      let emailSuccess = false;
      let emailError = null;
      
      // Step 2: Send notification email to admin only (don't block submission success on email)
      try {
        // Send notification to admin
        console.log(`[${requestId}] Attempting to send admin notification email`);
        const adminEmailResult = await sendNotificationEmail(formData, requestId);
        console.log(`[${requestId}] Admin email result:`, JSON.stringify(adminEmailResult, null, 2));
        
        emailSuccess = true;
        console.log(`[${requestId}] Admin email sent successfully`);
      } catch (err) {
        emailError = err;
        console.error(`[${requestId}] Email sending error:`, err);
        console.error(`[${requestId}] Error stack:`, err.stack);
        console.error(`[${requestId}] Error details:`, JSON.stringify(err, null, 2));
        // We still consider the submission successful even if emails fail
      }
      
      console.log(`[${requestId}] Request completed successfully. Emails sent: ${emailSuccess}`);
      return new Response(
        JSON.stringify({ 
          success: true, 
          emailSent: emailSuccess,
          message: emailSuccess ? "Form submitted and notification sent" : "Form submitted but notification email failed",
          error: emailError ? String(emailError) : null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (dbError) {
      console.error(`[${requestId}] Database error:`, dbError);
      console.error(`[${requestId}] Error details:`, JSON.stringify(dbError, null, 2));
      return new Response(
        JSON.stringify({ error: `Database error: ${dbError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error(`[${requestId}] Error in submit-business-idea function:`, error);
    console.error(`[${requestId}] Error stack:`, error.stack);
    console.error(`[${requestId}] Error details:`, JSON.stringify(error, null, 2));
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
