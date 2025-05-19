
// Resend API client configuration
import { corsHeaders } from "./cors.ts";

// Use npm package for more reliable integration
import { Resend } from "npm:resend@1.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

if (!resendApiKey) {
  console.error('⚠️ CRITICAL ERROR: Resend API key is not configured. Emails cannot be sent.');
}

// Initialize Resend client with the official SDK
const resend = new Resend(resendApiKey);

export { resend };
