
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import VentureCardContent from './VentureCardContent';
import VentureImage from './VentureImage';
import VentureServicesDialog from './VentureServicesDialog';

export interface VentureCardProps {
  venture: {
    name: string;
    tagline: string;
    description: string;
    color: string;
    status: string;
    link: string;
    services: string[];
    imageUrl?: string;
  };
  index: number;
}

const VentureCard = ({ venture, index }: VentureCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  // Map color border classes to their hover background counterparts
  const getHoverColorClass = () => {
    switch (venture.color) {
      case 'border-gb-blue':
        return 'hover:bg-gb-blue hover:text-white';
      case 'border-gb-green':
        return 'hover:bg-gb-green hover:text-white';
      case 'border-gb-purple':
        return 'hover:bg-gb-purple hover:text-white';
      case 'border-gb-yellow':
        return 'hover:bg-gb-yellow hover:text-white';
      case 'border-gb-red':
        return 'hover:bg-gb-red hover:text-white';
      case 'border-gb-orange':
        return 'hover:bg-gb-orange hover:text-white';
      default:
        return 'hover:bg-accent hover:text-accent-foreground';
    }
  };

  const handleLearnMore = () => {
    setIsDetailsOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div>
        <VentureCardContent 
          venture={venture} 
          onLearnMore={handleLearnMore} 
          getHoverColorClass={getHoverColorClass} 
        />
      </div>
      <div className="flex justify-center">
        <VentureImage venture={venture} />
      </div>

      <VentureServicesDialog 
        isOpen={isDetailsOpen} 
        setIsOpen={setIsDetailsOpen} 
        venture={venture}
      />
    </div>
  );
};

export default VentureCard;
