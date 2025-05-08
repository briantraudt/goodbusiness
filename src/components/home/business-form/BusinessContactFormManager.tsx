
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BusinessContactHeader from '../BusinessContactHeader';
import BusinessContactThankYou from '../BusinessContactThankYou';
import { useBusinessContactForm } from '@/hooks/useBusinessContactForm';

// Form section components
import ContactInfoSection from '../form-sections/ContactInfoSection';
import BusinessIdeaSection from '../form-sections/BusinessIdeaSection';
import ReadinessBudgetSection from '../form-sections/ReadinessBudgetSection';
import SupportNeededSection from '../form-sections/SupportNeededSection';
import ImpactValuesSection from '../form-sections/ImpactValuesSection';

interface BusinessContactFormManagerProps {
  score: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
}

const BusinessContactFormManager: React.FC<BusinessContactFormManagerProps> = ({
  score,
  contactSubmitted,
  setContactSubmitted
}) => {
  const contactFormRef = useRef<HTMLDivElement>(null);
  
  // Check if score meets the minimum threshold to display the form
  const shouldDisplayForm = score !== null && score >= 85;
  
  // Use our custom hook to manage all form state
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    companyName,
    setCompanyName,
    businessIdea,
    setBusinessIdea,
    problemSolution,
    setProblemSolution,
    customers,
    setCustomers,
    profitType,
    setProfitType,
    businessStage,
    setBusinessStage,
    budget,
    setBudget,
    helpTypes,
    handleHelpTypeChange,
    otherHelpExplanation,
    setOtherHelpExplanation,
    socialImpact,
    setSocialImpact,
    additionalInfo,
    setAdditionalInfo,
    errors,
    handleSubmit
  } = useBusinessContactForm({
    score,
    setContactSubmitted
  });
  
  useEffect(() => {
    // Making sure it triggers only for score >= 85
    if (shouldDisplayForm && contactFormRef.current) {
      console.log('Scrolling to contact form, score:', score);
      setTimeout(() => {
        contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [score, shouldDisplayForm]);

  // If the score doesn't meet the minimum threshold, don't render anything
  if (!shouldDisplayForm) {
    return null;
  }

  // If the user has already submitted the contact form, show thank you message
  if (contactSubmitted) {
    return <BusinessContactThankYou />;
  }
  
  return (
    <div ref={contactFormRef} className="mt-12 p-6 bg-gb-dark text-white rounded-lg shadow-sm animate-fade-in">
      <BusinessContactHeader score={score} />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <ContactInfoSection
              fullName={fullName}
              setFullName={setFullName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              companyName={companyName}
              setCompanyName={setCompanyName}
              errors={errors}
            />
            
            <BusinessIdeaSection
              businessIdea={businessIdea}
              setBusinessIdea={setBusinessIdea}
              problemSolution={problemSolution}
              setProblemSolution={setProblemSolution}
              customers={customers}
              setCustomers={setCustomers}
              profitType={profitType}
              setProfitType={setProfitType}
              errors={errors}
            />
            
            <ReadinessBudgetSection
              businessStage={businessStage}
              setBusinessStage={setBusinessStage}
              budget={budget}
              setBudget={setBudget}
              errors={errors}
            />
            
            <SupportNeededSection
              helpTypes={helpTypes}
              handleHelpTypeChange={handleHelpTypeChange}
              otherHelpExplanation={otherHelpExplanation}
              setOtherHelpExplanation={setOtherHelpExplanation}
            />
            
            <ImpactValuesSection
              socialImpact={socialImpact}
              setSocialImpact={setSocialImpact}
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-medium py-6 h-auto text-lg"
            >
              Submit My Idea
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessContactFormManager;
