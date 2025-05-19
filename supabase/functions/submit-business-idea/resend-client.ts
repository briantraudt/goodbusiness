
// Resend API client configuration
import { Resend } from "npm:resend@1.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

// Log key presence and format (but not the actual key value)
if (!resendApiKey) {
  console.error('⚠️ CRITICAL ERROR: Resend API key is missing. Email functionality will not work.');
} else {
  console.log('Resend API key is present. Length:', resendApiKey.length);
  console.log('Resend API key prefix:', resendApiKey.substring(0, 3) + '...');
  
  if (!resendApiKey.startsWith('re_')) {
    console.error('⚠️ WARNING: Resend API key does not start with "re_" which is the expected format.');
  } else {
    console.log('Resend API key appears to be in the correct format.');
  }
}

// Initialize Resend client with the official SDK
const resend = new Resend(resendApiKey);

export { resend };
