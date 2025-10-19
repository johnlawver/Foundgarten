/**
 * Card Component
 * Reusable card container for content
 */

import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  elevated?: boolean;
  interactive?: boolean;
  id?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onClick,
  className = '',
  elevated = false,
  interactive = false,
  id,
}) => {
  const baseStyles = `
    bg-white rounded-3xl border-[3px] border-black
    ${elevated ? 'shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
    ${interactive || onClick ? 'cursor-pointer transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px]' : ''}
    touch-manipulation
  `;

  return (
    <div
      className={`${baseStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      id={id}
    >
      {children}
    </div>
  );
};
