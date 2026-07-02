import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'green' | 'white' | 'dark-outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 cursor-pointer focus:outline-none active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-brand-orange text-white hover:bg-brand-orange-hover shadow-sm',
    secondary: 'bg-[#FF8A00]/10 text-brand-orange hover:bg-[#FF8A00]/20',
    green: 'bg-brand-green text-white hover:bg-brand-green-hover shadow-sm',
    white: 'bg-white text-brand-green hover:bg-neutral-50 shadow-sm border border-neutral-100',
    outline: 'border border-white/30 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm',
    'dark-outline': 'border border-brand-green/20 text-brand-green hover:bg-brand-green/5'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
export default Button;
