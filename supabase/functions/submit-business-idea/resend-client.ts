
// Resend API client configuration
import { Resend } from "npm:resend@1.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

// Validate API key format - should be re_* for Resend
if (!resendApiKey || !resendApiKey.startsWith('re_')) {
  console.error('⚠️ CRITICAL ERROR: Resend API key is invalid or not configured correctly. Emails cannot be sent.');
  console.error('The API key should start with "re_". Please check your Supabase secrets configuration.');
}

// Initialize Resend client with the official SDK
const resend = new Resend(resendApiKey);

export { resend };
