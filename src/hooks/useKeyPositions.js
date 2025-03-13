// src/hooks/useKeyPositions.js
import { useMemo } from 'react';

import { parseNote } from '../utils/pianoUtils';

/**
 * Custom hook to calculate positions for all piano keys
 *
 * @param {Array} whiteKeys - Array of white key objects
 * @param {Array} blackKeys - Array of black key objects
 * @param {number} whiteKeyWidth - Width of a white key
 * @param {number} whiteKeyHeight - Height of a white key
 * @param {number} blackKeyWidth - Width of a black key
 * @param {number} blackKeyHeight - Height of a black key
 * @returns {Object} Object mapping note names to their positions
 */
const useKeyPositions = ({
  whiteKeys,
  blackKeys,
  whiteKeyWidth,
  whiteKeyHeight,
  blackKeyWidth,
  blackKeyHeight,
}) => {
  // Precalculate positions for all keys
  const keyPositions = useMemo(() => {
    const positions = {};
    let whiteKeyCount = 0;

    // Process each white key first to establish positions
    whiteKeys.forEach(key => {
      positions[key.note] = {
        left: whiteKeyCount * whiteKeyWidth,
        top: 0,
        width: whiteKeyWidth,
        height: whiteKeyHeight,
        zIndex: 1,
      };
      whiteKeyCount++;
    });

    // Now process black keys, positioning them between white keys
    blackKeys.forEach(key => {
      const parsedNote = parseNote(key.note);
      if (!parsedNote) return;

      const { fullName, octave } = parsedNote;

      // Calculate position based on the white keys
      let left;

      // Position black keys relative to their adjacent white keys
      if (fullName === 'C#') {
        // C# is positioned after C
        const cKey = `C${octave}`;
        if (positions[cKey]) {
          left = positions[cKey].left + whiteKeyWidth * 0.7;
        }
      } else if (fullName === 'D#') {
        // D# is positioned after D
        const dKey = `D${octave}`;
        if (positions[dKey]) {
          left = positions[dKey].left + whiteKeyWidth * 0.7;
        }
      } else if (fullName === 'F#') {
        // F# is positioned after F
        const fKey = `F${octave}`;
        if (positions[fKey]) {
          left = positions[fKey].left + whiteKeyWidth * 0.7;
        }
      } else if (fullName === 'G#') {
        // G# is positioned after G
        const gKey = `G${octave}`;
        if (positions[gKey]) {
          left = positions[gKey].left + whiteKeyWidth * 0.7;
        }
      } else if (fullName === 'A#') {
        // A# is positioned after A
        const aKey = `A${octave}`;
        if (positions[aKey]) {
          left = positions[aKey].left + whiteKeyWidth * 0.7;
        }
      }

      if (left !== undefined) {
        positions[key.note] = {
          left: left,
          top: 0,
          width: blackKeyWidth,
          height: blackKeyHeight,
          zIndex: 2,
        };
      }
    });

    return positions;
  }, [whiteKeys, blackKeys, whiteKeyWidth, whiteKeyHeight, blackKeyWidth, blackKeyHeight]);

  return keyPositions;
};

export default useKeyPositions;
