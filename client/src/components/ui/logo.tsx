import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  let sizeClass = '';
  
  switch (size) {
    case 'sm':
      sizeClass = 'h-16 w-auto'; // was h-12
      break;
    case 'md':
      sizeClass = 'h-24 w-auto'; // was h-20
      break;
    case 'lg':
      sizeClass = 'h-32 w-auto'; // was h-24
      break;
    case 'xl':
      sizeClass = 'h-48 w-auto'; // was h-40
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
