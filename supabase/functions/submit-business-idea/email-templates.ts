
// Email templates and content generation

// Generate email content
export function generateEmailContent(formData: any) {
  const scoreText = formData.ideaScore ? `${formData.ideaScore}/100` : 'Not evaluated';
  
  const emailHtml = `
    <h1>New Business Idea Submission</h1>
    <h2>Score: ${scoreText}</h2>
    
    <h3>Contact Information</h3>
    <p><strong>Name:</strong> ${formData.fullName}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
    <p><strong>Company:</strong> ${formData.companyName || 'Not provided'}</p>
    
    <h3>Business Idea</h3>
    <p><strong>Description:</strong> ${formData.businessIdea}</p>
    <p><strong>Problem & Solution:</strong> ${formData.problemSolution}</p>
    <p><strong>Target Customers:</strong> ${formData.customers || 'Not provided'}</p>
    <p><strong>Profit Type:</strong> ${formData.profitType}</p>
    
    <h3>Business Stage & Budget</h3>
    <p><strong>Stage:</strong> ${formData.businessStage}</p>
    <p><strong>Budget:</strong> ${formData.budget}</p>
    
    <h3>Support Needed</h3>
    <p><strong>Help Types:</strong> ${formData.helpTypes?.join(', ') || 'None selected'}</p>
    ${formData.otherHelpExplanation ? `<p><strong>Other Help Explanation:</strong> ${formData.otherHelpExplanation}</p>` : ''}
    
    <h3>Impact & Additional Information</h3>
    <p><strong>Social Impact:</strong> ${formData.socialImpact || 'Not provided'}</p>
    <p><strong>Additional Info:</strong> ${formData.additionalInfo || 'Not provided'}</p>
  `;
  
  const plainText = `
New Business Idea Submission
Score: ${scoreText}

CONTACT INFORMATION
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Company: ${formData.companyName || 'Not provided'}

BUSINESS IDEA
Description: ${formData.businessIdea}
Problem & Solution: ${formData.problemSolution}
Target Customers: ${formData.customers || 'Not provided'}
Profit Type: ${formData.profitType}

BUSINESS STAGE & BUDGET
Stage: ${formData.businessStage}
Budget: ${formData.budget}

SUPPORT NEEDED
Help Types: ${formData.helpTypes?.join(', ') || 'None selected'}
${formData.otherHelpExplanation ? `Other Help Explanation: ${formData.otherHelpExplanation}` : ''}

IMPACT & ADDITIONAL INFORMATION
Social Impact: ${formData.socialImpact || 'Not provided'}
Additional Info: ${formData.additionalInfo || 'Not provided'}
`;

  return { html: emailHtml, text: plainText, scoreText };
}
