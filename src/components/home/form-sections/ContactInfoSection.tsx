
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactInfoSectionProps {
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  phone: string;
  setPhone: (value: string) => void;
  companyName: string;
  setCompanyName: (value: string) => void;
  errors: {
    fullName?: string;
    email?: string;
    [key: string]: string | undefined;
  };
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  companyName,
  setCompanyName,
  errors
}) => {
  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-xl md:text-2xl font-medium text-gb-dark">We promise to respond within 24 hours</p>
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
          <Input 
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number (optional)</Label>
          <Input 
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(123) 456-7890"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name / Idea Name (optional)</Label>
          <Input 
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Your company or idea name"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSection;
