
import React from 'react';

interface MobileAppImageProps {
  imageSrc: string;
  altText: string;
}

const MobileAppImage = ({ imageSrc, altText }: MobileAppImageProps) => {
  return (
    <img 
      src={imageSrc} 
      alt={altText} 
      className="h-auto w-auto max-h-[500px] rounded-[2rem]" 
    />
  );
};

export default MobileAppImage;
