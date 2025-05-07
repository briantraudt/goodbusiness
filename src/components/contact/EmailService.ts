
import { FormValues } from './ContactFormSchema';
import { createClient } from '@supabase/supabase-js';

// Supabase client initialization
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const sendEmail = async (data: FormValues) => {
  try {
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
    
    // Prepare data for the Resend edge function
    const emailData = {
      fromName: `${data.firstName} ${data.lastName}`,
      fromEmail: data.email,
      company: data.company || "Not provided",
      projectTitle: data.projectTitle,
      problemStatement: data.problemStatement,
      targetMarket: data.targetMarket,
      marketSize: marketSizeMap[data.marketSize],
      timeframe: timeframeMap[data.timeframe],
      budgetRange: budgetMap[data.budgetRange],
      additionalInfo: data.additionalInfo || "Not provided",
    };
    
    // Call the Supabase Edge Function that will use Resend
    const { data: responseData, error } = await supabase.functions.invoke('send-contact-email', {
      body: emailData
    });
    
    if (error) throw new Error(error.message || 'Failed to send email');
    
    return responseData;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
