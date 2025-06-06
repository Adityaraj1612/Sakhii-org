
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  let sizeClass = '';
  
  switch (size) {
    case 'sm':
      sizeClass = 'h-12 w-auto';
      break;
    case 'md':
      sizeClass = 'h-20 w-auto';
      break;
    case 'lg':
      sizeClass = 'h-24 w-auto';
      break;
    case 'xl':
      sizeClass = 'h-40 w-auto';
      break;
  }
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="https://i.ibb.co/Hff4hT0z/Untitled-design-4-1.png" 
        alt="Sakhi Logo" 
        className={`${sizeClass}`} 
      />
    </div>
  );
};

export default Logo;
