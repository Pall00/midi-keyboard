// src/hooks/useKeyboardInteractions.js
import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook to manage keyboard interactions (mouse and touch)
 *
 * @param {boolean} sustainEnabled - Whether sustain pedal is enabled
 * @param {Function} onNoteOn - Callback when note is activated
 * @param {Function} onNoteOff - Callback when note is deactivated
 * @returns {Object} Interaction state and handlers
 */
const useKeyboardInteractions = ({ sustainEnabled, onNoteOn, onNoteOff }) => {
  // Track mouse/touch state
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [touchedNotes, setTouchedNotes] = useState(new Set());

  // Check if a note is active via touch
  const isTouched = useCallback(
    note => {
      return touchedNotes.has(note);
    },
    [touchedNotes]
  );

  // Event handlers for mouse interaction
  const handleMouseDown = useCallback(
    note => {
      setMouseIsDown(true);
      onNoteOn(note);
    },
    [onNoteOn]
  );

  const handleMouseUp = useCallback(
    note => {
      setMouseIsDown(false);
      if (!sustainEnabled) {
        onNoteOff(note);
      }
    },
    [sustainEnabled, onNoteOff]
  );

  const handleMouseEnter = useCallback(
    note => {
      if (mouseIsDown) {
        onNoteOn(note);
      }
    },
    [mouseIsDown, onNoteOn]
  );

  const handleMouseLeave = useCallback(
    note => {
      if (mouseIsDown && !sustainEnabled) {
        onNoteOff(note);
      }
    },
    [mouseIsDown, sustainEnabled, onNoteOff]
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    note => {
      setTouchedNotes(prev => {
        const newSet = new Set(prev);
        newSet.add(note);
        return newSet;
      });
      onNoteOn(note);
    },
    [onNoteOn]
  );

  const handleTouchEnd = useCallback(
    note => {
      setTouchedNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(note);
        return newSet;
      });
      if (!sustainEnabled) {
        onNoteOff(note);
      }
    },
    [sustainEnabled, onNoteOff]
  );

  // Reset mouse state when mouse is released outside the keyboard
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setMouseIsDown(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  return {
    mouseIsDown,
    touchedNotes,
    isTouched,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  };
};

export default useKeyboardInteractions;
