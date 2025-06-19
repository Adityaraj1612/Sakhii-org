import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '' }) => {
  let sizeClass = '';
  
  switch (size) {
    case 'sm':
      sizeClass = 'h-[72px] w-auto'; // ~18px more than h-12 (48px)
      break;
    case 'md':
      sizeClass = 'h-[96px] w-auto'; // ~24px more than h-20 (80px)
      break;
    case 'lg':
      sizeClass = 'h-[120px] w-auto'; // ~24px more than h-24 (96px)
      break;
    case 'xl':
      sizeClass = 'h-[160px] w-auto'; // ~20px more than h-40 (140px)
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
