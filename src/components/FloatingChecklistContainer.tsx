import React, { useState, useRef, useEffect, useCallback } from 'react';
// import CallCheckList from './CallCheckList';
import '../styles/FloatingChecklist.css';
import { useSalesCoachContext } from '../context/SalesCoachContext';

export default function FloatingChecklistContainer() {

  // STATES
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null); 
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);
  const [hasEmergenceAnimationCompleted, setHasEmergenceAnimationCompleted] = useState(false);

  // REFS
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  //CONTEXT
  const { isChecklistVisible, signals } = useSalesCoachContext();

  // Handle emergence animation completion
  useEffect(() => {
    if (isChecklistVisible && !hasEmergenceAnimationCompleted) {
      const timer = setTimeout(() => {
        setHasEmergenceAnimationCompleted(true);
      }, 200); // Match the animation duration
      return () => clearTimeout(timer);
    } else if (!isChecklistVisible) {
      setHasEmergenceAnimationCompleted(false);
    }
  }, [isChecklistVisible, hasEmergenceAnimationCompleted]);

  // Reset position when becoming visible again to avoid animation conflicts
  useEffect(() => {
    if (isChecklistVisible && !hasEmergenceAnimationCompleted) {
      setPosition(null);
    }
  }, [isChecklistVisible, hasEmergenceAnimationCompleted]);

  // Helper to get the current position of the container
  const getCurrentPosition = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  };


  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('li')) {
      return;
    }
    setIsDragging(true);
    isDraggingRef.current = true;
    // Lock the height when starting to drag
    if (containerRef.current) {
      setLockedHeight(containerRef.current.offsetHeight);
    }
    // On first drag, set position to current rendered position
    if (position === null) {
      const { x, y } = getCurrentPosition();
      setPosition({ x, y });
      setDragOffset({
        x: e.clientX - x,
        y: e.clientY - y
      });
      dragOffsetRef.current = {
        x: e.clientX - x,
        y: e.clientY - y
      };
    } else {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !dragOffsetRef.current) return;
    setPosition({
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    isDraggingRef.current = false;
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Dynamic style: use CSS for initial, transform for dragged
  const style = position
    ? {
        position: 'fixed',
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)` ,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 9999,
        height: lockedHeight ? `${lockedHeight}px` : undefined
      }
    : undefined;

  return (
    <>
    {/* {
        (isChecklistVisible ) && (
            <CallCheckList
                containerRef={containerRef}
                isDragging={isDragging}
                style={style}
                handleMouseDown={handleMouseDown}
                isVisible={isChecklistVisible}
                hasEmergenceAnimationCompleted={hasEmergenceAnimationCompleted}
                signals={signals}
            />
        )
    } */}
    </>
  );
}