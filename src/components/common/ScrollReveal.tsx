import React from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { cn } from '@/lib/utils';

type Direction = 'left' | 'right' | 'up' | 'fade';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

const ScrollReveal = ({ 
  children, 
  direction = 'fade', 
  delay = 0,
  className 
}: ScrollRevealProps) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  const getInitialTransform = () => {
    switch (direction) {
      case 'left':
        return 'translate-x-[-50px]';
      case 'right':
        return 'translate-x-[50px]';
      case 'up':
        return 'translate-y-[30px]';
      case 'fade':
      default:
        return 'translate-y-[20px]';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        !isVisible && `opacity-0 ${getInitialTransform()}`,
        isVisible && 'opacity-100 translate-x-0 translate-y-0',
        className
      )}
      style={{ 
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
