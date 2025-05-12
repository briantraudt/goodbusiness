
import React, { useState } from 'react';
import { ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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
  
  // Function to render the appropriate image based on the venture name
  const renderVentureImage = () => {
    if (venture.name === "SideStage") {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <img 
              src="/lovable-uploads/35487980-8600-4a91-a5a8-b226968d1e70.png" 
              alt="SideStage Mobile App" 
              className="h-auto w-auto max-h-[500px] rounded-[2rem] cursor-pointer transition-transform hover:scale-[1.02]" 
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] flex items-center justify-center p-0 overflow-hidden">
            <img 
              src="/lovable-uploads/35487980-8600-4a91-a5a8-b226968d1e70.png" 
              alt="SideStage Mobile App - Enlarged" 
              className="w-auto h-auto max-h-[90vh] max-w-[80vw] object-contain rounded-[2rem]" 
            />
          </DialogContent>
        </Dialog>
      );
    } else if (venture.name === "Pardners") {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <img 
              src="/lovable-uploads/d86fe6aa-3b7b-450a-bdd6-a217b5a55078.png" 
              alt="Pardners Mobile App" 
              className="h-auto w-auto max-h-[500px] rounded-[2rem] cursor-pointer transition-transform hover:scale-[1.02]" 
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] flex items-center justify-center p-0 overflow-hidden">
            <img 
              src="/lovable-uploads/d86fe6aa-3b7b-450a-bdd6-a217b5a55078.png" 
              alt="Pardners Mobile App - Enlarged" 
              className="w-auto h-auto max-h-[90vh] max-w-[80vw] object-contain rounded-[2rem]" 
            />
          </DialogContent>
        </Dialog>
      );
    } else if (venture.name === "Private Pitches") {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="imac-container cursor-pointer transition-transform hover:scale-[1.02]">
              {/* iMac frame */}
              <div className="relative max-w-[500px]">
                {/* iMac screen bezel */}
                <div className="bg-gray-800 rounded-t-lg p-2 relative">
                  {/* Screen content */}
                  <div className="relative bg-white overflow-hidden rounded-sm">
                    <img 
                      src="/lovable-uploads/fb1103d2-bae9-4f06-957a-253ecbed761f.png" 
                      alt="Private Pitches Website" 
                      className="w-full h-auto"
                    />
                  </div>
                  {/* Camera */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gray-900"></div>
                </div>
                {/* iMac stand */}
                <div className="mx-auto w-20 h-6 bg-gray-300 rounded-b-lg"></div>
                <div className="mx-auto w-36 h-1 bg-gray-400 rounded-b"></div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] flex items-center justify-center p-0 overflow-hidden">
            <img 
              src="/lovable-uploads/fb1103d2-bae9-4f06-957a-253ecbed761f.png" 
              alt="Private Pitches Website - Enlarged" 
              className="w-auto h-auto max-h-[90vh] max-w-[80vw] object-contain" 
            />
          </DialogContent>
        </Dialog>
      );
    } else if (venture.name === "Rated JC" && venture.imageUrl) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <div className="imac-container cursor-pointer transition-transform hover:scale-[1.02]">
              {/* iMac frame */}
              <div className="relative max-w-[500px]">
                {/* iMac screen bezel */}
                <div className="bg-gray-800 rounded-t-lg p-2 relative">
                  {/* Screen content */}
                  <div className="relative bg-white overflow-hidden rounded-sm">
                    <img 
                      src={venture.imageUrl} 
                      alt="Rated JC Website" 
                      className="w-full h-auto"
                    />
                  </div>
                  {/* Camera */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-gray-900"></div>
                </div>
                {/* iMac stand */}
                <div className="mx-auto w-20 h-6 bg-gray-300 rounded-b-lg"></div>
                <div className="mx-auto w-36 h-1 bg-gray-400 rounded-b"></div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[80vw] max-h-[90vh] flex items-center justify-center p-0 overflow-hidden">
            <img 
              src={venture.imageUrl}
              alt="Rated JC Website - Enlarged" 
              className="w-auto h-auto max-h-[90vh] max-w-[80vw] object-contain" 
            />
          </DialogContent>
        </Dialog>
      );
    } else {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <div className="w-full h-full flex flex-col items-center justify-center bg-gb-green/10 text-gb-green">
            <Clock size={64} strokeWidth={1.5} className="mb-3" />
            <p className="text-lg font-medium">Coming Soon</p>
          </div>
        </div>
      );
    }
  };

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
          <Button 
            variant="outline" 
            className={cn("mt-auto inline-flex items-center", getHoverColorClass())}
            onClick={() => setIsDetailsOpen(true)}
          >
            Learn More
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        {renderVentureImage()}
      </div>

      {/* Services Dialog - Now only shows pre-populated services */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{venture.name} Services</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="mb-4 text-muted-foreground">{venture.description}</p>
            
            <div className="mt-6">
              <h4 className="text-lg font-medium mb-2">Services Provided:</h4>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {venture.services.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No services have been added yet.</p>
                ) : (
                  venture.services.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
                      <span>{service}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VentureCard;
