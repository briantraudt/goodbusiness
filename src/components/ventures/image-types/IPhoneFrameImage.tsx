
import React from 'react';

interface IPhoneFrameImageProps {
  imageSrc: string;
  altText: string;
}

const IPhoneFrameImage = ({ imageSrc, altText }: IPhoneFrameImageProps) => {
  return (
    <div className="relative inline-block">
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
  );
};

export default IPhoneFrameImage;
