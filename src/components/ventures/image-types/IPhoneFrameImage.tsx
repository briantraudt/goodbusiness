
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface IPhoneFrameImageProps {
  imageSrc: string;
  altText: string;
}

const IPhoneFrameImage = ({ imageSrc, altText }: IPhoneFrameImageProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative inline-block cursor-pointer transition-transform hover:scale-[1.02]">
          {/* iPhone Frame */}
          <div className="relative w-[270px] h-[550px] bg-black rounded-[45px] p-3 shadow-xl">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[130px] h-[30px] bg-black rounded-b-[14px] z-10"></div>
            
            {/* Screen */}
            <div className="relative w-full h-full bg-white overflow-hidden rounded-[35px]">
              {/* App Image */}
              <img 
                src={imageSrc} 
                alt={altText} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
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

export default IPhoneFrameImage;
