
import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, User, Mail, Phone, MessageSquare, HelpCircle, Users, Info, Compass, DollarSign, Heart, Check, Bulb } from 'lucide-react';

interface BusinessContactFormProps {
  score: number | null;
  contactSubmitted: boolean;
  setContactSubmitted: (value: boolean) => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  businessIdea?: string;
  problemSolution?: string;
  profitType?: string;
  businessStage?: string;
  budget?: string;
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
  
  const validateForm = () => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Validate required fields
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email Address is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }
    
    // Validate business idea
    if (!businessIdea.trim()) {
      newErrors.businessIdea = 'Business idea description is required';
      isValid = false;
    }
    
    // Validate problem solution
    if (!problemSolution.trim()) {
      newErrors.problemSolution = 'Problem solution is required';
      isValid = false;
    }
    
    // Validate profit type
    if (!profitType) {
      newErrors.profitType = 'Please select an option';
      isValid = false;
    }
    
    // Validate business stage
    if (!businessStage) {
      newErrors.businessStage = 'Please select a business stage';
      isValid = false;
    }
    
    // Validate budget
    if (!budget) {
      newErrors.budget = 'Please select a budget range';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
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
      toast.error('Please fill in all required fields');
    }
  };
  
  if (score === null || score < 85) return null;
  
  if (contactSubmitted) {
    return (
      <div className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm text-center animate-fade-in">
        <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
        <p className="text-lg">
          We've received your information and will be in touch shortly to discuss your idea.
        </p>
      </div>
    );
  }
  
  return (
    <div ref={contactFormRef} className="mt-12 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm animate-fade-in">
      <div className="text-center mb-6">
        <Bulb className="inline-block text-gb-green mb-3 h-8 w-8" />
        <h3 className="text-2xl font-bold mb-2">Share Your Business Idea</h3>
        <p className="text-gray-600">
          At Good Business, we help launch and grow businesses that transform lives. 
          Tell us a bit about your idea and what support you're looking for.
        </p>
        <p className="mt-4 text-green-700 font-semibold">
          Your idea scored {score}/100, which shows great promise!
        </p>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-gb-green" />
                <h4 className="text-lg font-semibold">Contact Info</h4>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
                  <Input 
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <div className="flex">
                    <Mail className="mr-2 h-4 w-4 opacity-50 self-center" />
                    <Input 
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (optional)</Label>
                  <div className="flex">
                    <Phone className="mr-2 h-4 w-4 opacity-50 self-center" />
                    <Input 
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name / Idea Name (optional)</Label>
                  <div className="flex">
                    <Briefcase className="mr-2 h-4 w-4 opacity-50 self-center" />
                    <Input 
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company or idea name"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Your Idea Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-gb-green" />
                <h4 className="text-lg font-semibold">Your Idea</h4>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessIdea">Describe your business idea in 1–2 sentences <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="businessIdea"
                    value={businessIdea}
                    onChange={(e) => setBusinessIdea(e.target.value)}
                    placeholder="Briefly describe your business idea"
                    className="min-h-[80px]"
                  />
                  {errors.businessIdea && <p className="text-sm text-red-500">{errors.businessIdea}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="problemSolution">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      <span>What problem does it solve, and for whom? <span className="text-red-500">*</span></span>
                    </div>
                  </Label>
                  <Textarea 
                    id="problemSolution"
                    value={problemSolution}
                    onChange={(e) => setProblemSolution(e.target.value)}
                    placeholder="Explain the problem your idea addresses and who will benefit"
                    className="min-h-[80px]"
                  />
                  {errors.problemSolution && <p className="text-sm text-red-500">{errors.problemSolution}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customers">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>Who are your customers? (optional)</span>
                    </div>
                  </Label>
                  <Textarea 
                    id="customers"
                    value={customers}
                    onChange={(e) => setCustomers(e.target.value)}
                    placeholder="Describe your target customers or audience"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="mb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4" />
                      <span>Is this idea for profit, nonprofit, or both? <span className="text-red-500">*</span></span>
                    </div>
                  </Label>
                  <RadioGroup value={profitType} onValueChange={setProfitType} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="for-profit" id="for-profit" />
                      <Label htmlFor="for-profit">For-profit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="nonprofit" id="nonprofit" />
                      <Label htmlFor="nonprofit">Nonprofit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="hybrid" id="hybrid" />
                      <Label htmlFor="hybrid">Hybrid / not sure yet</Label>
                    </div>
                  </RadioGroup>
                  {errors.profitType && <p className="text-sm text-red-500">{errors.profitType}</p>}
                </div>
              </div>
            </div>
            
            {/* Readiness & Budget Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-5 w-5 text-gb-green" />
                <h4 className="text-lg font-semibold">Readiness & Budget</h4>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-3">
                  <Label>Where are you in the process? <span className="text-red-500">*</span></Label>
                  <RadioGroup value={businessStage} onValueChange={setBusinessStage} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="idea" id="idea" />
                      <Label htmlFor="idea">Just an idea</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="prototype" id="prototype" />
                      <Label htmlFor="prototype">Prototype or MVP built</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="traction" id="traction" />
                      <Label htmlFor="traction">Some traction or revenue</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="operational" id="operational" />
                      <Label htmlFor="operational">Fully operational business</Label>
                    </div>
                  </RadioGroup>
                  {errors.businessStage && <p className="text-sm text-red-500">{errors.businessStage}</p>}
                </div>
                
                <div className="space-y-3">
                  <Label className="mb-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>Do you have a budget for this project? <span className="text-red-500">*</span></span>
                    </div>
                  </Label>
                  <RadioGroup value={budget} onValueChange={setBudget} className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="0" id="budget0" />
                      <Label htmlFor="budget0">$0 – I'm looking for a co-founder or guidance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1000-5000" id="budget1k" />
                      <Label htmlFor="budget1k">$1,000–$5,000 – I need help validating or prototyping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5000-25000" id="budget5k" />
                      <Label htmlFor="budget5k">$5,000–$25,000 – I'm ready to build and launch</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="25000+" id="budget25k" />
                      <Label htmlFor="budget25k">$25,000+ – I'm ready to grow or scale</Label>
                    </div>
                  </RadioGroup>
                  {errors.budget && <p className="text-sm text-red-500">{errors.budget}</p>}
                </div>
              </div>
            </div>
            
            {/* Support Needed Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-gb-green" />
                <h4 className="text-lg font-semibold">Support Needed</h4>
              </div>
              
              <Label className="mb-3 block">What type of help are you looking for? (select any)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="helpStrategy" 
                    checked={helpTypes.includes('strategy')}
                    onCheckedChange={() => handleHelpTypeChange('strategy')}
                  />
                  <Label htmlFor="helpStrategy">Strategy or validation</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="helpPrototype" 
                    checked={helpTypes.includes('prototype')}
                    onCheckedChange={() => handleHelpTypeChange('prototype')}
                  />
                  <Label htmlFor="helpPrototype">Prototype or MVP development</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="helpBranding" 
                    checked={helpTypes.includes('branding')}
                    onCheckedChange={() => handleHelpTypeChange('branding')}
                  />
                  <Label htmlFor="helpBranding">Branding and design</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="helpLaunch" 
                    checked={helpTypes.includes('launch')}
                    onCheckedChange={() => handleHelpTypeChange('launch')}
                  />
                  <Label htmlFor="helpLaunch">Go-to-market launch</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="helpConsulting" 
                    checked={helpTypes.includes('consulting')}
                    onCheckedChange={() => handleHelpTypeChange('consulting')}
                  />
                  <Label htmlFor="helpConsulting">Ongoing consulting</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="helpFunding" 
                    checked={helpTypes.includes('funding')}
                    onCheckedChange={() => handleHelpTypeChange('funding')}
                  />
                  <Label htmlFor="helpFunding">Funding introductions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="helpOther" 
                    checked={helpTypes.includes('other')}
                    onCheckedChange={() => handleHelpTypeChange('other')}
                  />
                  <Label htmlFor="helpOther">Other</Label>
                </div>
              </div>
              
              {helpTypes.includes('other') && (
                <div className="mt-3 space-y-2">
                  <Label htmlFor="otherHelpExplanation">Please explain:</Label>
                  <Input 
                    id="otherHelpExplanation"
                    value={otherHelpExplanation}
                    onChange={(e) => setOtherHelpExplanation(e.target.value)}
                    placeholder="Explain what other help you need"
                  />
                </div>
              )}
            </div>
            
            {/* Impact & Values Section */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-gb-green" />
                <h4 className="text-lg font-semibold">Impact & Values</h4>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="socialImpact">Do you want your business to have a social or spiritual impact? (optional)</Label>
                <Textarea 
                  id="socialImpact"
                  value={socialImpact}
                  onChange={(e) => setSocialImpact(e.target.value)}
                  placeholder="Describe any social or spiritual impact you envision"
                  className="min-h-[80px]"
                />
              </div>
            </div>
            
            {/* Final Section */}
            <div>
              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Anything else you'd like us to know? (optional)</Label>
                <Textarea 
                  id="additionalInfo"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="Share any additional information"
                  className="min-h-[80px]"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gb-green hover:bg-gb-green/90 text-white font-medium py-6 h-auto text-lg"
            >
              <Check className="h-5 w-5 mr-2" />
              Submit My Idea
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessContactForm;
