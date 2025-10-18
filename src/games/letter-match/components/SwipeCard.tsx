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

      // Complete swipe after animation
      setTimeout(() => {
        onSwipe(direction);
      }, 250);
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
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Card */}
      <div
        ref={cardRef}
        className="relative w-[280px] h-[380px] bg-white rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing select-none touch-none"
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
          className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-center pointer-events-none"
          style={{
            opacity: showLeftFeedback ? feedbackOpacity * 0.3 : 0,
            transition: 'opacity 0.1s',
          }}
        >
          <div className="text-white text-8xl font-bold">✗</div>
        </div>

        {/* Right feedback overlay (correct) */}
        <div
          className="absolute inset-0 bg-green-500 rounded-3xl flex items-center justify-center pointer-events-none"
          style={{
            opacity: showRightFeedback ? feedbackOpacity * 0.3 : 0,
            transition: 'opacity 0.1s',
          }}
        >
          <div className="text-white text-8xl font-bold">✓</div>
        </div>

        {/* Letter display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[180px] font-bold text-gray-800 leading-none">
            {letter.character}
          </div>
        </div>
      </div>

      {/* Swipe hint indicators */}
      {!isDragging && !isExiting && (
        <>
          <div className="absolute left-8 top-1/2 -translate-y-1/2 text-red-400 text-4xl opacity-30">
            ⬅
          </div>
          <div className="absolute right-8 top-1/2 -translate-y-1/2 text-green-400 text-4xl opacity-30">
            ➡
          </div>
        </>
      )}
    </div>
  );
}
