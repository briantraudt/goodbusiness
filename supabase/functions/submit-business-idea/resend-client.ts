
// Resend API client configuration
import { Resend } from "npm:resend@1.0.0";

const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

// Enhanced logging for API key diagnosis
console.log('Resend API key check:');
console.log('- Key present: ', Boolean(resendApiKey));
console.log('- Key length: ', resendApiKey.length);
console.log('- Key format correct: ', resendApiKey.startsWith('re_'));
console.log('- Key prefix: ', resendApiKey.substring(0, 5) + '...');

// Validate the API key format
if (!resendApiKey) {
  console.error('⚠️ CRITICAL ERROR: Resend API key is missing. Email functionality will not work.');
} else if (!resendApiKey.startsWith('re_')) {
  console.error('⚠️ WARNING: Resend API key does not start with "re_" which is the expected format.');
} else {
  console.log('✓ Resend API key appears to be in the correct format.');
}

// Initialize Resend client with the official SDK
const resend = new Resend(resendApiKey);

export { resend };
