
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  projectTitle: string;
  problemStatement: string;
  targetMarket: string;
  marketSize: "small" | "medium" | "large";
  timeframe: "immediate" | "3months" | "6months" | "flexible";
  budgetRange: "under10k" | "10to25k" | "25to50k" | "over50k" | "undefined";
  additionalInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    
    // Format the data for the email
    const marketSizeMap = {
      small: "Small (niche market)",
      medium: "Medium (specific industry)",
      large: "Large (broad appeal)"
    };
    
    const timeframeMap = {
      immediate: "Immediate (ASAP)",
      "3months": "Within 3 months",
      "6months": "Within 6 months",
      flexible: "Flexible"
    };
    
    const budgetMap = {
      under10k: "Under $10,000",
      "10to25k": "$10,000 - $25,000",
      "25to50k": "$25,000 - $50,000",
      over50k: "Over $50,000",
      undefined: "Not sure yet"
    };

    // Build email content
    const emailContent = `
      <h2>New Idea Submission from Good Business HQ Website</h2>
      
      <h3>Contact Details</h3>
      <p><strong>Name:</strong> ${formData.firstName} ${formData.lastName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Company:</strong> ${formData.company || "Not provided"}</p>
      
      <h3>Project Details</h3>
      <p><strong>Project Title:</strong> ${formData.projectTitle}</p>
      
      <h4>Problem Statement:</h4>
      <p>${formData.problemStatement}</p>
      
      <h4>Target Market:</h4>
      <p>${formData.targetMarket}</p>
      
      <h4>Project Parameters:</h4>
      <p><strong>Market Size:</strong> ${marketSizeMap[formData.marketSize]}</p>
      <p><strong>Timeframe:</strong> ${timeframeMap[formData.timeframe]}</p>
      <p><strong>Budget Range:</strong> ${budgetMap[formData.budgetRange]}</p>
      
      <h4>Additional Information:</h4>
      <p>${formData.additionalInfo || "Not provided"}</p>
      
      <p><em>Submitted on: ${new Date().toLocaleString()}</em></p>
    `;

    // Prepare confirmation email to sender
    const confirmationHtml = `
      <h2>We've received your idea submission!</h2>
      <p>Hello ${formData.firstName},</p>
      <p>Thank you for submitting your idea to Good Business HQ. We've received your project details for "${formData.projectTitle}" and will review it promptly.</p>
      <p>We'll get back to you within 24 hours with feedback or to schedule a discussion.</p>
      <p>Best regards,<br>Brian @ Good Business HQ</p>
    `;

    // Send email to business owner
    const notificationEmail = await resend.emails.send({
      from: "Good Business HQ <contact@goodbusinesshq.com>",
      to: "brian@goodbusinesshq.com",
      subject: `New Idea Submission: ${formData.projectTitle}`,
      html: emailContent,
      reply_to: formData.email
    });

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email to the submitter
    const confirmationEmail = await resend.emails.send({
      from: "Good Business HQ <contact@goodbusinesshq.com>",
      to: formData.email,
      subject: "We've received your idea submission!",
      html: confirmationHtml
    });

    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(
      JSON.stringify({ success: true, id: notificationEmail.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
