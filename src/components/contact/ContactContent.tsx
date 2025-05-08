
import React, { useState } from 'react';
import ContactBenefits from './ContactBenefits';
import ContactForm from './ContactForm';
import ContactEvaluator from './ContactEvaluator';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

// Define the evaluation result interface
interface EvaluationResult {
  score: number;
  details: string;
}

const ContactContent = () => {
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  
  // Handler for when evaluation is complete
  const handleEvaluationComplete = (result: EvaluationResult | null) => {
    setEvaluationResult(result);
    
    // If the score is 85 or higher, scroll to the contact form
    if (result && result.score >= 85) {
      setTimeout(() => {
        const contactFormElement = document.getElementById('contact-form-section');
        if (contactFormElement) {
          contactFormElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 800);
    }
  };

  return (
    <>
      {/* Business Evaluator Section */}
      <ContactEvaluator onEvaluationComplete={handleEvaluationComplete} />
      
      {/* Contact Form Section - Hidden initially, shown if score is 85+ */}
      {evaluationResult && evaluationResult.score >= 85 && (
        <section id="contact-form-section" className="bg-white">
          <div className="container-custom py-20">
            <div className="text-center mb-12 animate-fadeIn">
              <div className="inline-block p-3 bg-green-50 rounded-full mb-4">
                <ArrowDown className="h-8 w-8 text-gb-green" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gb-dark mb-4">
                Great Idea! We'd Love to Hear More
              </h3>
              <p className="text-lg text-gb-dark/80 max-w-2xl mx-auto">
                Your idea scored {evaluationResult.score} out of 100! Please share more details with us using the form below, and we'll get back to you within 24 hours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h3 className="text-2xl font-bold text-gb-dark mb-6">Submit Your Idea</h3>
                <p className="text-lg text-gb-dark/80 mb-8">
                  Tell us about your software idea, and we'll get back to you within 24 hours with a rapid prototyping plan.
                </p>
                
                <ContactBenefits />
              </div>
              
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Message for ideas that didn't score high enough */}
      {evaluationResult && evaluationResult.score < 85 && (
        <section className="bg-white border-t border-gray-100">
          <div className="container-custom py-20 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gb-dark mb-6">
              Thanks for Sharing Your Idea
            </h3>
            <p className="text-lg text-gb-dark/80 max-w-2xl mx-auto mb-8">
              Your idea scored {evaluationResult.score} out of 100. We encourage you to refine your concept based on the feedback and try again when you're ready.
            </p>
            <Button 
              onClick={() => setEvaluationResult(null)}
              className="bg-gb-green hover:bg-gb-green/90 text-white"
            >
              Refine & Evaluate Again
            </Button>
          </div>
        </section>
      )}
    </>
  );
};

export default ContactContent;
