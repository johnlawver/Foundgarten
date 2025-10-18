/**
 * Button Component
 * Touch-optimized button for mobile interactions
 */

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    touch-manipulation
    active:scale-95
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    ${fullWidth ? 'w-full' : ''}
  `;

  const variantStyles = {
    primary: `
      bg-yellow-400 text-black
      hover:bg-yellow-500
      active:bg-yellow-600
      border-[3px] border-black
      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
      hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
      active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
      active:translate-x-[2px] active:translate-y-[2px]
      font-bold
    `,
    secondary: `
      bg-teal-400 text-black
      hover:bg-teal-500
      active:bg-teal-600
      border-[3px] border-black
      shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
      hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
      active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
      active:translate-x-[2px] active:translate-y-[2px]
      font-bold
    `,
    ghost: `
      bg-white text-black
      hover:bg-gray-50
      active:bg-gray-100
      border-[3px] border-black border-dashed
      font-bold
    `,
  };

  const sizeStyles = {
    small: 'px-4 py-2 text-sm min-h-[48px]',
    medium: 'px-6 py-3 text-base min-h-[56px]',
    large: 'px-8 py-4 text-lg min-h-[64px]',
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
