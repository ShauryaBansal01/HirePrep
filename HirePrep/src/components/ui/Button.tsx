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
  const baseStyles = "px-4 py-2.5 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20",
    secondary: "bg-surface text-white hover:bg-border",
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
