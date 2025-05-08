
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import BusinessContactHeader from './BusinessContactHeader';
import ContactInfoSection from './form-sections/ContactInfoSection';
import BusinessIdeaSection from './form-sections/BusinessIdeaSection';
import ReadinessBudgetSection from './form-sections/ReadinessBudgetSection';
import SupportNeededSection from './form-sections/SupportNeededSection';
import ImpactValuesSection from './form-sections/ImpactValuesSection';
import BusinessContactThankYou from './BusinessContactThankYou';
import { validateBusinessForm, FormErrors } from './business-form-validation';

interface BusinessContactFormProps {
  score: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
}

const BusinessContactForm: React.FC<BusinessContactFormProps> = ({
  score,
  contactSubmitted,
  setContactSubmitted
}) => {
  // Contact form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  
  // Idea fields
  const [businessIdea, setBusinessIdea] = useState('');
  const [problemSolution, setProblemSolution] = useState('');
  const [customers, setCustomers] = useState('');
  const [profitType, setProfitType] = useState('');
  
  // Readiness & Budget
  const [businessStage, setBusinessStage] = useState('');
  const [budget, setBudget] = useState('');
  
  // Support Needed
  const [helpTypes, setHelpTypes] = useState<string[]>([]);
  const [otherHelpExplanation, setOtherHelpExplanation] = useState('');
  
  // Impact & Final
  const [socialImpact, setSocialImpact] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Form validation
  const [errors, setErrors] = useState<FormErrors>({});
  
  const contactFormRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (score && score >= 85 && contactFormRef.current) {
      setTimeout(() => {
        contactFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [score]);
  
  const handleHelpTypeChange = (type: string) => {
    if (helpTypes.includes(type)) {
      setHelpTypes(helpTypes.filter(item => item !== type));
    } else {
      setHelpTypes([...helpTypes, type]);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateBusinessForm(
      fullName,
      email,
      businessIdea,
      problemSolution,
      profitType,
      businessStage,
      budget
    );
    
    if (validation.isValid) {
      try {
        // Prepare form data
        const formData = {
          fullName,
          email,
          phone,
          companyName,
          businessIdea,
          problemSolution,
          customers,
          profitType,
          businessStage,
          budget,
          helpTypes,
          otherHelpExplanation,
          socialImpact,
          additionalInfo,
          ideaScore: score
        };
        
        console.log('Contact form submitted:', formData);
        
        // Here you would typically send this data to your backend
        // await supabase.functions.invoke('submit-contact', {
        //   body: formData
        // });
        
        setContactSubmitted(true);
        toast.success('Thank you for your interest! We will be in touch soon.');
      } catch (err) {
        console.error('Error submitting contact form:', err);
        toast.error('Failed to submit form. Please try again.');
      }
    } else {
      setErrors(validation.errors);
      toast.error('Please fill in all required fields');
    }
  };
  
  if (score === null || score < 85) return null;
  
  if (contactSubmitted) {
    return <BusinessContactThankYou />;
  }
  
  return (
    <div ref={contactFormRef} className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm animate-fade-in">
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

export default BusinessContactForm;
