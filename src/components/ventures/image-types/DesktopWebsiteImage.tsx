
import React from 'react';

interface DesktopWebsiteImageProps {
  imageSrc: string;
  altText: string;
}

const DesktopWebsiteImage = ({ imageSrc, altText }: DesktopWebsiteImageProps) => {
  return (
    <div className="imac-container">
      {/* iMac frame - now with fixed dimensions */}
      <div className="relative w-[500px]">
        {/* iMac screen bezel */}
        <div className="bg-gray-800 rounded-t-lg p-2 relative">
          {/* Screen content - fixed aspect ratio */}
          <div className="relative bg-white overflow-hidden rounded-sm aspect-[16/10]">
            <img 
              src={imageSrc} 
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
  );
};

export default DesktopWebsiteImage;
