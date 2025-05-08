
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface SupportNeededSectionProps {
  helpTypes: string[];
  handleHelpTypeChange: (type: string) => void;
  otherHelpExplanation: string;
  setOtherHelpExplanation: (value: string) => void;
}

const SupportNeededSection: React.FC<SupportNeededSectionProps> = ({
  helpTypes,
  handleHelpTypeChange,
  otherHelpExplanation,
  setOtherHelpExplanation,
}) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Support Needed</h4>
      
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
  );
};

export default SupportNeededSection;
