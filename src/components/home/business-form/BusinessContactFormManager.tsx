
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import PrivateInvitationHeader from '../PrivateInvitationHeader';
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
  // Check if score meets the minimum threshold to display the form
  const shouldDisplayForm = score !== null && score >= 75;
  
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
    isSubmitting,
    handleSubmit
  } = useBusinessContactForm({
    score,
    setContactSubmitted
  });

  // If the score doesn't meet the minimum threshold, don't render anything
  if (!shouldDisplayForm) {
    return null;
  }

  // If the user has already submitted the contact form, show thank you message
  if (contactSubmitted) {
    return <BusinessContactThankYou />;
  }
  
  return (
    <div className="mt-6 animate-fade-in">
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
        
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="w-1/4 bg-gb-green hover:bg-gb-green/90 text-white font-medium py-6 h-auto text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit My Idea"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BusinessContactFormManager;
