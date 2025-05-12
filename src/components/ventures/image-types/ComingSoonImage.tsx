
import React from 'react';
import { Clock } from 'lucide-react';

const ComingSoonImage = () => {
  return (
    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center bg-gb-green/10 text-gb-green">
        <Clock size={64} strokeWidth={1.5} className="mb-3" />
        <p className="text-lg font-medium">Coming Soon</p>
      </div>
    </div>
  );
};

export default ComingSoonImage;
