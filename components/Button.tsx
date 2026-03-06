import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  size = 'md',
  icon,
  className = '',
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-1 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-lg shadow-primary-500/30 focus:ring-primary-500 border border-transparent",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm focus:ring-gray-200",
    danger: "bg-white text-red-600 border border-red-100 hover:bg-red-50 hover:border-red-200 focus:ring-red-500 shadow-sm",
    success: "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/30 focus:ring-emerald-500 border border-transparent",
    ghost: "bg-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/80 focus:ring-gray-200",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-xl gap-2",
    lg: "px-8 py-3.5 text-base rounded-2xl gap-2.5",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};