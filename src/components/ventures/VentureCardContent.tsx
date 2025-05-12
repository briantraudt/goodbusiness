
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VentureCardContentProps {
  venture: {
    name: string;
    tagline: string;
    description: string;
    color: string;
    status: string;
  };
  onLearnMore: () => void;
  getHoverColorClass: () => string;
}

const VentureCardContent = ({ 
  venture, 
  onLearnMore, 
  getHoverColorClass 
}: VentureCardContentProps) => {
  return (
    <div className={`venture-card ${venture.color}`}>
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
        {venture.status}
      </span>
      <h3 className="text-2xl font-bold text-gb-dark mb-2">{venture.name}</h3>
      <p className="text-lg font-medium text-gb-dark/80 mb-4 italic">
        {venture.tagline}
      </p>
      <p className="text-gb-dark/70 mb-6">
        {venture.description}
      </p>
      <Button 
        variant="outline" 
        className={cn("mt-auto inline-flex items-center", getHoverColorClass())}
        onClick={onLearnMore}
      >
        Learn More
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default VentureCardContent;
