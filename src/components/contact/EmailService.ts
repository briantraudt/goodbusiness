
import emailjs from '@emailjs/browser';
import { FormValues } from './ContactFormSchema';

// EmailJS configuration (replace these with your actual values from EmailJS)
const EMAILJS_SERVICE_ID = 'service_id'; // Replace with your EmailJS service ID
const EMAILJS_TEMPLATE_ID = 'template_id'; // Replace with your EmailJS template ID
const EMAILJS_PUBLIC_KEY = 'public_key'; // Replace with your EmailJS public key

export const sendEmail = async (data: FormValues) => {
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
  
  // Prepare template parameters for EmailJS
  const templateParams = {
    from_name: `${data.firstName} ${data.lastName}`,
    from_email: data.email,
    company: data.company || "Not provided",
    project_title: data.projectTitle,
    problem_statement: data.problemStatement,
    target_market: data.targetMarket,
    market_size: marketSizeMap[data.marketSize],
    timeframe: timeframeMap[data.timeframe],
    budget_range: budgetMap[data.budgetRange],
    additional_info: data.additionalInfo || "Not provided",
    to_name: "Brian",  // Recipient's name
    message: `New idea submission: ${data.projectTitle}`,
    reply_to: data.email
  };
  
  // Send email using EmailJS
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams,
    EMAILJS_PUBLIC_KEY
  );
};
