
import { useState } from 'react';
import { toast } from 'sonner';
import { validateBusinessForm, FormErrors } from '@/components/home/business-form-validation';

interface UseBusinessContactFormProps {
  score: number | null;
  setContactSubmitted: (value: boolean) => void;
}

export const useBusinessContactForm = ({ score, setContactSubmitted }: UseBusinessContactFormProps) => {
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

  return {
    // Contact form fields
    fullName,
    setFullName,
    email,
    setEmail,
    phone,
    setPhone,
    companyName,
    setCompanyName,
    
    // Idea fields
    businessIdea,
    setBusinessIdea,
    problemSolution,
    setProblemSolution,
    customers,
    setCustomers,
    profitType,
    setProfitType,
    
    // Readiness & Budget
    businessStage,
    setBusinessStage,
    budget,
    setBudget,
    
    // Support Needed
    helpTypes,
    handleHelpTypeChange,
    otherHelpExplanation,
    setOtherHelpExplanation,
    
    // Impact & Final
    socialImpact,
    setSocialImpact,
    additionalInfo,
    setAdditionalInfo,
    
    // Form validation and submission
    errors,
    handleSubmit
  };
};
