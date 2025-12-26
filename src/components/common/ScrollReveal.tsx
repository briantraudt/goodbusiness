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

  const getAnimationClass = () => {
    switch (direction) {
      case 'left':
        return 'animate-slide-in-left';
      case 'right':
        return 'animate-slide-in-right';
      case 'up':
        return 'animate-slide-up';
      case 'fade':
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        'opacity-0',
        isVisible && getAnimationClass(),
        className
      )}
      style={{ 
        animationDelay: isVisible ? `${delay}ms` : '0ms',
        animationFillMode: 'forwards'
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
