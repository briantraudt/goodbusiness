
// Main entry point for the submit-business-idea edge function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleSubmission } from "./handlers.ts";
import { corsHeaders } from "./cors.ts";

console.log('Function initialized');

serve(async (req) => {
  // Add request tracking for debugging
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] New request received: ${req.method}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, { headers: corsHeaders });
  }

  return await handleSubmission(req, requestId);
});
