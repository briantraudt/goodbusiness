// Resend API client configuration
import { corsHeaders } from "./cors.ts";

const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';

if (!resendApiKey) {
  console.error('⚠️ CRITICAL ERROR: Resend API key is not configured. Emails cannot be sent.');
}

// Initialize Resend client with a more compatible approach
export const resend = {
  emails: {
    send: async (options: any) => {
      const url = 'https://api.resend.com/emails';
      
      try {
        console.log('Attempting to send email with options:', {
          from: options.from,
          to: options.to,
          subject: options.subject,
          // Not logging full HTML/text to keep logs manageable
        });
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(options)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          console.error('Resend API error response:', data);
          throw new Error(`Resend API error (${response.status}): ${JSON.stringify(data)}`);
        }
        
        console.log('Resend API success response:', data);
        return data;
      } catch (error) {
        console.error('Error sending email via Resend API:', error);
        throw error;
      }
    }
  }
};
