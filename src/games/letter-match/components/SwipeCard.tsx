/**
 * SwipeCard Component
 * Large letter card with swipe gesture support
 */

import { useState, useRef, useEffect } from 'react';
import type { Letter, SwipeDirection } from '@/types/letter-match';

interface SwipeCardProps {
  letter: Letter;
  onSwipe: (direction: SwipeDirection) => void;
  disabled?: boolean;
}

const SWIPE_THRESHOLD = 100; // Minimum distance to trigger swipe
const ROTATION_FACTOR = 0.1; // Rotation based on drag

export function SwipeCard({ letter, onSwipe, disabled = false }: SwipeCardProps) {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  // Reset card when letter changes
  useEffect(() => {
    setDragOffset({ x: 0, y: 0 });
    setIsDragging(false);
    setIsExiting(false);
  }, [letter.character]);

  const handleDragStart = (clientX: number, clientY: number) => {
    if (disabled || isExiting) return;

    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging || disabled) return;

    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;

    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging || disabled) return;

    setIsDragging(false);

    // Check if swipe threshold is met
    if (Math.abs(dragOffset.x) > SWIPE_THRESHOLD) {
      const direction: SwipeDirection = dragOffset.x > 0 ? 'right' : 'left';

      // Trigger exit animation
      setIsExiting(true);

      // Complete swipe immediately (don't wait for animation)
      // The parent will update and this component will unmount/remount
      onSwipe(direction);
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleDragMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Calculate transform for card
  const rotation = dragOffset.x * ROTATION_FACTOR;
  const scale = isExiting ? 0.8 : 1;

  let transform = `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`;

  if (isExiting) {
    const exitDistance = dragOffset.x > 0 ? 400 : -400;
    transform = `translate(${exitDistance}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`;
  }

  // Calculate feedback overlay opacity
  const feedbackOpacity = Math.min(Math.abs(dragOffset.x) / SWIPE_THRESHOLD, 1);
  const showLeftFeedback = dragOffset.x < -20;
  const showRightFeedback = dragOffset.x > 20;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-8" id="letter-match-card-container">
      {/* Swipe instruction header */}
      <div className="text-center" id="letter-match-swipe-instruction">
        <p className="text-lg font-bold text-gray-700">
          ⬅️ Swipe to answer ➡️
        </p>
      </div>

      {/* Card area wrapper */}
      <div className="relative flex items-center justify-center flex-1 w-full">
      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-[280px] h-[380px] bg-white rounded-[32px] border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-grab active:cursor-grabbing select-none touch-none"
        id="letter-match-swipe-card"
        data-letter={letter.character}
        data-case={letter.caseType}
        style={{
          transform,
          transition: isDragging || isExiting
            ? 'none'
            : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          willChange: 'transform',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Left feedback overlay (incorrect) */}
        <div
          className="absolute inset-0 bg-coral-400 rounded-[32px] flex items-center justify-center pointer-events-none"
          id="letter-match-incorrect-feedback"
          style={{
            opacity: showLeftFeedback ? feedbackOpacity * 0.4 : 0,
            transition: 'opacity 0.1s',
          }}
        >
          <div className="text-black text-9xl font-black">✗</div>
        </div>

        {/* Right feedback overlay (correct) */}
        <div
          className="absolute inset-0 bg-teal-400 rounded-[32px] flex items-center justify-center pointer-events-none"
          id="letter-match-correct-feedback"
          style={{
            opacity: showRightFeedback ? feedbackOpacity * 0.4 : 0,
            transition: 'opacity 0.1s',
          }}
        >
          <div className="text-black text-9xl font-black">✓</div>
        </div>

        {/* Letter display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[180px] font-black text-black leading-none">
            {letter.character}
          </div>
        </div>
      </div>

        {/* Swipe hint indicators - elliptical backgrounds from viewport edges */}
        {!isDragging && !isExiting && (
          <>
            {/* Left swipe hint - half ellipse from left edge of viewport */}
            <div
              className="fixed left-0 top-1/2 -translate-y-1/2 w-24 h-96 !bg-[#ffb8b8] opacity-30 pointer-events-none"
              style={{ borderRadius: '0 100% 100% 0 / 0 50% 50% 0' }}
              id="letter-match-swipe-left-hint"
            />
            {/* Right swipe hint - half ellipse from right edge of viewport */}
            <div
              className="fixed right-0 top-1/2 -translate-y-1/2 w-24 h-96 !bg-[#80dddd] opacity-30 pointer-events-none"
              style={{ borderRadius: '100% 0 0 100% / 50% 0 0 50%' }}
              id="letter-match-swipe-right-hint"
            />
          </>
        )}
      </div>
    </div>
  );
}
