
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export interface VentureCardProps {
  venture: {
    name: string;
    tagline: string;
    description: string;
    color: string;
    status: string;
    link: string;
  };
  index: number;
}

const VentureCard = ({ venture, index }: VentureCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div>
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
          <Button asChild variant="outline" className="mt-auto inline-flex items-center">
            <a href={venture.link} target="_blank" rel="noopener noreferrer">
              Learn More
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        {index === 0 ? (
          <Dialog>
            <DialogTrigger asChild>
              <img 
                src="/lovable-uploads/35487980-8600-4a91-a5a8-b226968d1e70.png" 
                alt="SideStage Mobile App" 
                className="h-auto w-auto max-h-[500px] rounded-3xl cursor-pointer transition-transform hover:scale-[1.02]" 
              />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[80vw] max-h-[90vh] flex items-center justify-center p-0 overflow-hidden">
              <img 
                src="/lovable-uploads/35487980-8600-4a91-a5a8-b226968d1e70.png" 
                alt="SideStage Mobile App - Enlarged" 
                className="w-auto h-auto max-h-[90vh] max-w-[80vw] object-contain rounded-3xl" 
              />
            </DialogContent>
          </Dialog>
        ) : (
          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gb-blue/10 text-gb-blue">
              {venture.name} Preview
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VentureCard;
