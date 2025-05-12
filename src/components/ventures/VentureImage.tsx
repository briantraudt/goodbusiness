
import React from 'react';
import MobileAppImage from './image-types/MobileAppImage';
import DesktopWebsiteImage from './image-types/DesktopWebsiteImage';
import ComingSoonImage from './image-types/ComingSoonImage';

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
      <MobileAppImage 
        imageSrc="/lovable-uploads/35487980-8600-4a91-a5a8-b226968d1e70.png"
        altText="SideStage Mobile App"
      />
    );
  } else if (venture.name === "Pardners") {
    return (
      <MobileAppImage 
        imageSrc="/lovable-uploads/70caa22f-e0b9-4fbc-b9b6-5ae5af3de7e5.png"
        altText="Pardners Mobile App"
      />
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
      <DesktopWebsiteImage 
        imageSrc={imageSource}
        altText={altText}
      />
    );
  } else {
    return <ComingSoonImage />;
  }
};

export default VentureImage;
