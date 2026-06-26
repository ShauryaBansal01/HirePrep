import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-[#d0bcff] text-[#3c0091] hover:shadow-[0_0_20px_rgba(208,188,255,0.4)]",
    secondary: "bg-[rgba(218,226,253,0.05)] text-[#dae2fd] border border-[rgba(255,255,255,0.1)] backdrop-blur-md hover:bg-[rgba(218,226,253,0.1)]",
    outline: "border border-border text-gray-300 hover:bg-surface"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
