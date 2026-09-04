import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'compact' | 'square';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
    xl: 'h-16',
  };

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <div className="flex items-center justify-center bg-[#ED1C24] text-white font-display font-black rounded-xl px-2.5 py-1 text-sm shadow-md border border-red-500">
          <span className="tracking-tight">FG</span>
        </div>
      </div>
    );
  }

  if (variant === 'square') {
    const squareSizes = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-14 h-14',
      xl: 'w-20 h-20',
    };
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src="/logo-square.svg"
          alt="FRYGUY®"
          className={`${squareSizes[size]} object-contain rounded-xl shadow-md`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src="/logo.svg"
        alt="FRYGUY®"
        className={`${heightClasses[size]} w-auto object-contain transition-transform hover:scale-[1.02]`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
