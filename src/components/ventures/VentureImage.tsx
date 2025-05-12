
import React from 'react';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface VentureImageProps {
  venture: {
    name: string;
    imageUrl?: string;
  };
}

const VentureImage = ({ venture }: VentureImageProps) => {
  // Function to render the appropriate image based on the venture name
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
          <DialogHeader>
            <DialogTitle className="sr-only">SideStage Mobile App</DialogTitle>
          </DialogHeader>
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
            src="/lovable-uploads/50f65942-3bd6-4cdc-b1a2-298d75e67917.png" 
            alt="Pardners Mobile App" 
            className="h-auto w-auto max-h-[500px] rounded-[2rem] cursor-pointer transition-transform hover:scale-[1.02]" 
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[80vw] max-h-[90vh] flex items-center justify-center p-0 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="sr-only">Pardners Mobile App</DialogTitle>
          </DialogHeader>
          <img 
            src="/lovable-uploads/50f65942-3bd6-4cdc-b1a2-298d75e67917.png" 
            alt="Pardners Mobile App - Enlarged" 
            className="w-auto h-auto max-h-[90vh] max-w-[80vw] object-contain" 
          />
        </DialogContent>
      </Dialog>
    );
  } else if (venture.name === "Private Pitches" || (venture.name === "Rated JC" && venture.imageUrl)) {
    // Using the same iMac container for both Private Pitches and Rated JC
    const imageSource = venture.name === "Private Pitches" 
      ? "/lovable-uploads/fb1103d2-bae9-4f06-957a-253ecbed761f.png"
      : venture.imageUrl;
    
    const altText = venture.name === "Private Pitches" 
      ? "Private Pitches Website" 
      : "Rated JC Website";

    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="imac-container cursor-pointer transition-transform hover:scale-[1.02]">
            {/* iMac frame - now with fixed dimensions */}
            <div className="relative w-[500px]">
              {/* iMac screen bezel */}
              <div className="bg-gray-800 rounded-t-lg p-2 relative">
                {/* Screen content - fixed aspect ratio */}
                <div className="relative bg-white overflow-hidden rounded-sm aspect-[16/10]">
                  <img 
                    src={imageSource} 
                    alt={altText}
                    className="w-full h-full object-cover" 
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
          <DialogHeader>
            <DialogTitle className="sr-only">{altText}</DialogTitle>
          </DialogHeader>
          <img 
            src={imageSource}
            alt={`${altText} - Enlarged`} 
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

export default VentureImage;
