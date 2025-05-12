
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface MobileAppImageProps {
  imageSrc: string;
  altText: string;
}

const MobileAppImage = ({ imageSrc, altText }: MobileAppImageProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <img 
          src={imageSrc} 
          alt={altText} 
          className="h-auto w-auto max-h-[500px] rounded-[2rem] cursor-pointer transition-transform hover:scale-[1.02]" 
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] max-h-[90vh] flex items-center justify-center p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">{altText}</DialogTitle>
        </DialogHeader>
        <img 
          src={imageSrc} 
          alt={`${altText} - Enlarged`} 
          className="w-auto h-auto max-h-[90vh] max-w-[80vw] object-contain rounded-[2rem]" 
        />
      </DialogContent>
    </Dialog>
  );
};

export default MobileAppImage;
