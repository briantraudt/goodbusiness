
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
    } catch (dbError) {
      console.error(`[${requestId}] Database error:`, dbError);
      return new Response(
        JSON.stringify({ error: `Database error: ${dbError.message}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Step 2: Send notification emails
    try {
      // Send notification to admin
      await sendNotificationEmail(formData, requestId);
      
      // Send confirmation to the submitter
      await sendConfirmationEmail(formData, requestId);
    } catch (emailError) {
      console.error(`[${requestId}] Email sending error:`, emailError);
      // We don't fail the entire submission if email fails
      // Just log the error and continue
    }
    
    console.log(`[${requestId}] Request completed successfully`);
    return new Response(
      JSON.stringify({ success: true }),
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
}
