
// Request handlers
import { corsHeaders } from "./cors.ts";
import { storeSubmission } from "./db.ts";
import { sendNotificationEmail, sendConfirmationEmail } from "./email.ts";

export async function handleSubmission(req: Request, requestId: string) {
  try {
    const formData = await req.json();
    
    console.log(`[${requestId}] Received business idea submission:`, formData);
    
    // Step 1: Store the submission in the database
    try {
      const data = await storeSubmission(formData, requestId);
      console.log(`[${requestId}] Database storage completed successfully`);
      
      // Even if email sending fails, we'll return success since the data is stored
      // This ensures the user gets a confirmation message
      let emailSuccess = false;
      
      // Step 2: Send notification emails (don't block submission success on email)
      try {
        // Send notification to admin
        await sendNotificationEmail(formData, requestId);
        
        // Send confirmation to the submitter
        await sendConfirmationEmail(formData, requestId);
        
        emailSuccess = true;
      } catch (emailError) {
        console.error(`[${requestId}] Email sending error:`, emailError);
        console.error(`[${requestId}] Error stack:`, emailError.stack);
        // We still consider the submission successful even if emails fail
      }
      
      console.log(`[${requestId}] Request completed successfully. Emails sent: ${emailSuccess}`);
      return new Response(
        JSON.stringify({ success: true, emailSent: emailSuccess }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      
    } catch (dbError) {
      console.error(`[${requestId}] Database error:`, dbError);
      return new Response(
        JSON.stringify({ error: `Database error: ${dbError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
  } catch (error) {
    console.error(`[${requestId}] Error in submit-business-idea function:`, error);
    console.error(`[${requestId}] Error stack:`, error.stack);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
