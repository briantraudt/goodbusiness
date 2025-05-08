
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ImpactValuesSectionProps {
  socialImpact: string;
  setSocialImpact: (value: string) => void;
  additionalInfo: string;
  setAdditionalInfo: (value: string) => void;
}

const ImpactValuesSection: React.FC<ImpactValuesSectionProps> = ({
  socialImpact,
  setSocialImpact,
  additionalInfo,
  setAdditionalInfo
}) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Impact & Values</h4>
      
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
      
      <div className="mt-6 space-y-2">
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
  );
};

export default ImpactValuesSection;
