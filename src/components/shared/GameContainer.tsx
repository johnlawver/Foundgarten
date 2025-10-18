/**
 * GameContainer Component
 * Common layout wrapper for game screens
 */

import React from 'react';

export interface GameContainerProps {
  children: React.ReactNode;
  title?: string;
  onBack?: () => void;
  onSettings?: () => void;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  children,
  title,
  onBack,
  onSettings,
  headerContent,
  footerContent,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7f7f7]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white border-b-[3px] border-black">
        {/* Left: Back button */}
        <div className="w-14">
          {onBack && (
            <button
              onClick={onBack}
              className="w-12 h-12 rounded-2xl bg-coral-400 border-[3px] border-black flex items-center justify-center hover:bg-coral-500 active:bg-coral-600 transition-colors touch-manipulation shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              aria-label="Go back"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Center: Title or custom content */}
        <div className="flex-1 text-center">
          {headerContent || (title && <h1 className="text-xl font-black text-black">{title}</h1>)}
        </div>

        {/* Right: Settings button */}
        <div className="w-14">
          {onSettings && (
            <button
              onClick={onSettings}
              className="w-12 h-12 rounded-2xl bg-yellow-400 border-[3px] border-black flex items-center justify-center hover:bg-yellow-500 active:bg-yellow-600 transition-colors touch-manipulation shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              aria-label="Settings"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {children}
      </main>

      {/* Footer */}
      {footerContent && (
        <footer className="p-4 bg-white border-t-[3px] border-black">
          {footerContent}
        </footer>
      )}
    </div>
  );
};
