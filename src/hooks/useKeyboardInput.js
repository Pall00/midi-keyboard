// src/hooks/useKeyboardInput.js
import { useEffect, useCallback } from 'react';

import { defaultKeyboardMapping, getNoteFromKey } from '../utils/keyboardMapping';

/**
 * Hook for handling computer keyboard input for piano playing
 *
 * Maps keyboard keys to piano notes and handles events for
 * activating and deactivating notes.
 *
 * @param {Object} options - Configuration options
 * @returns {Object} Methods and state for keyboard input
 */
const useKeyboardInput = ({
  keyboardMapping = defaultKeyboardMapping,
  onNoteOn,
  onNoteOff,
  enabled = true,
  sustainKey = ' ', // Space bar is the default sustain key
  octaveUpKey = 'ArrowUp',
  octaveDownKey = 'ArrowDown',
  onSustainChange,
  onOctaveChange,
}) => {
  /**
   * Handle key down events
   */
  const handleKeyDown = useCallback(
    event => {
      if (!enabled) return;

      const key = event.key.toLowerCase();

      // Prevent handling repeated keydown events (key held down)
      if (event.repeat) return;

      // Check for sustain pedal
      if (key === sustainKey) {
        event.preventDefault();
        if (typeof onSustainChange === 'function') {
          onSustainChange(true);
        }
        return;
      }

      // Check for octave shifting
      if (key === octaveUpKey.toLowerCase()) {
        event.preventDefault();
        if (typeof onOctaveChange === 'function') {
          onOctaveChange(1); // Move up one octave
        }
        return;
      }

      if (key === octaveDownKey.toLowerCase()) {
        event.preventDefault();
        if (typeof onOctaveChange === 'function') {
          onOctaveChange(-1); // Move down one octave
        }
        return;
      }

      // Handle note keys
      const note = getNoteFromKey(key, keyboardMapping);
      if (note) {
        event.preventDefault();
        onNoteOn(note, 'keyboard');
      }
    },
    [
      enabled,
      keyboardMapping,
      onNoteOn,
      sustainKey,
      octaveUpKey,
      octaveDownKey,
      onSustainChange,
      onOctaveChange,
    ]
  );

  /**
   * Handle key up events
   */
  const handleKeyUp = useCallback(
    event => {
      if (!enabled) return;

      const key = event.key.toLowerCase();

      // Check for sustain pedal
      if (key === sustainKey) {
        event.preventDefault();
        if (typeof onSustainChange === 'function') {
          onSustainChange(false);
        }
        return;
      }

      // Handle note keys
      const note = getNoteFromKey(key, keyboardMapping);
      if (note) {
        event.preventDefault();
        onNoteOff(note, 'keyboard');
      }
    },
    [enabled, keyboardMapping, onNoteOff, sustainKey, onSustainChange]
  );

  // Set up keyboard event listeners
  useEffect(() => {
    if (!enabled) return;

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Clean up event listeners
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [enabled, handleKeyDown, handleKeyUp]);

  /**
   * Change the keyboard mapping
   * @param {Object} _newMapping - New keyboard mapping
   */
  const setKeyboardMapping = useCallback(_newMapping => {
    // This would need to be implemented with a state
    // if this hook managed its own mapping state
    // For now, this is just a placeholder
  }, []);

  return {
    // Methods
    setKeyboardMapping,
  };
};

export default useKeyboardInput;
