// src/utils/pianoUtils.js

/**
 * Parse a note string into its components
 * @param {string} note - The note string (e.g., "C#4")
 * @returns {Object} Object with note name, whether it's sharp, and octave
 */
export const parseNote = note => {
  const match = note.match(/^([A-G])([#]?)(\d+)$/);
  if (!match) {
    console.error(`Invalid note format: ${note}`);
    return null;
  }

  return {
    noteName: match[1],
    isSharp: match[2] === '#',
    octave: parseInt(match[3], 10),
    fullName: match[1] + (match[2] || ''), // C or C#
  };
};

/**
 * Create a full piano keyboard layout
 * @param {Object} options - Options for key range
 * @returns {Array} Array of key objects with note and isBlack properties
 */
export const createPianoKeys = ({ startNote = 'A0', endNote = 'C8' } = {}) => {
  // Parse start and end notes
  const startParsed = parseNote(startNote);
  const endParsed = parseNote(endNote);

  if (!startParsed || !endParsed) {
    console.error('Invalid start or end note format');
    return [];
  }

  // Define all possible notes in order
  const allNotes = [
    { note: 'C', isBlack: false },
    { note: 'C#', isBlack: true },
    { note: 'D', isBlack: false },
    { note: 'D#', isBlack: true },
    { note: 'E', isBlack: false },
    { note: 'F', isBlack: false },
    { note: 'F#', isBlack: true },
    { note: 'G', isBlack: false },
    { note: 'G#', isBlack: true },
    { note: 'A', isBlack: false },
    { note: 'A#', isBlack: true },
    { note: 'B', isBlack: false },
  ];

  // Create array to hold all keys
  const keys = [];

  // Generate all keys in range
  for (let octave = startParsed.octave; octave <= endParsed.octave; octave++) {
    // Find the starting index within the octave
    const startIdx =
      octave === startParsed.octave ? allNotes.findIndex(n => n.note === startParsed.fullName) : 0;

    // Find the ending index within the octave
    const endIdx =
      octave === endParsed.octave
        ? allNotes.findIndex(n => n.note === endParsed.fullName)
        : allNotes.length - 1;

    // Add all notes in this octave within range
    for (let i = startIdx; i <= (octave === endParsed.octave ? endIdx : allNotes.length - 1); i++) {
      keys.push({
        note: `${allNotes[i].note}${octave}`,
        isBlack: allNotes[i].isBlack,
      });
    }
  }

  return keys;
};

// Standard mapping for note positions in an octave
// The piano keyboard has 7 white keys and 5 black keys per octave
export const NOTE_POSITIONS = {
  C: { type: 'white', index: 0 },
  'C#': { type: 'black', index: 0 }, // Between C and D
  D: { type: 'white', index: 1 },
  'D#': { type: 'black', index: 1 }, // Between D and E
  E: { type: 'white', index: 2 },
  F: { type: 'white', index: 3 },
  'F#': { type: 'black', index: 2 }, // Between F and G
  G: { type: 'white', index: 4 },
  'G#': { type: 'black', index: 3 }, // Between G and A
  A: { type: 'white', index: 5 },
  'A#': { type: 'black', index: 4 }, // Between A and B
  B: { type: 'white', index: 6 },
};

// Determine number of white keys in an octave
export const WHITE_KEYS_PER_OCTAVE = Object.values(NOTE_POSITIONS).filter(
  pos => pos.type === 'white'
).length;
