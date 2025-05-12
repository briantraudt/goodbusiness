
import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

// Extend the Link props to create our custom component
const ScrollToTopLink: React.FC<LinkProps> = ({ children, ...props }) => {
  // Function to scroll to top when clicking the link
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default ScrollToTopLink;
