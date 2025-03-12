// src/utils/midiUtils.js

/**
 * Mapping of MIDI note numbers to note names with sharps
 * Covers the full piano range from A0 (MIDI note 21) to C8 (MIDI note 108)
 */
export const midiNoteNumberToName = {
  21: 'A0',
  22: 'A#0',
  23: 'B0',
  24: 'C1',
  25: 'C#1',
  26: 'D1',
  27: 'D#1',
  28: 'E1',
  29: 'F1',
  30: 'F#1',
  31: 'G1',
  32: 'G#1',
  33: 'A1',
  34: 'A#1',
  35: 'B1',
  36: 'C2',
  37: 'C#2',
  38: 'D2',
  39: 'D#2',
  40: 'E2',
  41: 'F2',
  42: 'F#2',
  43: 'G2',
  44: 'G#2',
  45: 'A2',
  46: 'A#2',
  47: 'B2',
  48: 'C3',
  49: 'C#3',
  50: 'D3',
  51: 'D#3',
  52: 'E3',
  53: 'F3',
  54: 'F#3',
  55: 'G3',
  56: 'G#3',
  57: 'A3',
  58: 'A#3',
  59: 'B3',
  60: 'C4', // Middle C
  61: 'C#4',
  62: 'D4',
  63: 'D#4',
  64: 'E4',
  65: 'F4',
  66: 'F#4',
  67: 'G4',
  68: 'G#4',
  69: 'A4', // A440
  70: 'A#4',
  71: 'B4',
  72: 'C5',
  73: 'C#5',
  74: 'D5',
  75: 'D#5',
  76: 'E5',
  77: 'F5',
  78: 'F#5',
  79: 'G5',
  80: 'G#5',
  81: 'A5',
  82: 'A#5',
  83: 'B5',
  84: 'C6',
  85: 'C#6',
  86: 'D6',
  87: 'D#6',
  88: 'E6',
  89: 'F6',
  90: 'F#6',
  91: 'G6',
  92: 'G#6',
  93: 'A6',
  94: 'A#6',
  95: 'B6',
  96: 'C7',
  97: 'C#7',
  98: 'D7',
  99: 'D#7',
  100: 'E7',
  101: 'F7',
  102: 'F#7',
  103: 'G7',
  104: 'G#7',
  105: 'A7',
  106: 'A#7',
  107: 'B7',
  108: 'C8',
};

/**
 * Convert a MIDI note number to note name
 * @param {number} midiNumber - The MIDI note number (0-127)
 * @returns {string} Note name with octave (e.g., "C4")
 */
export const getMidiNoteName = midiNumber => {
  return midiNoteNumberToName[midiNumber] || `Unknown (${midiNumber})`;
};

/**
 * Convert note name to MIDI note number
 * @param {string} noteName - Note name with octave (e.g., "C4")
 * @returns {number|null} MIDI note number, or null if not found
 */
export const getMidiNoteNumber = noteName => {
  const entries = Object.entries(midiNoteNumberToName);
  const found = entries.find(([_, name]) => name === noteName);
  return found ? parseInt(found[0]) : null;
};

/**
 * Format a WebMidi note object into standardized format
 * @param {Object} note - WebMidi note object
 * @returns {string} Formatted note name (e.g., "C#4")
 */
export const formatMidiNote = note => {
  // If the input is already a string, return it
  if (typeof note === 'string') return note;

  // If we have a MIDI number property, use our mapping
  if (note.number !== undefined) {
    return getMidiNoteName(note.number);
  }

  // Otherwise try to extract name and octave from WebMidi format
  try {
    // Get the raw note properties
    const noteName = note.name; // e.g., "C", "D"
    const octave = note.octave; // e.g., 4, 5
    const accidental = note.accidental || ''; // e.g., "#", "b", ""

    // Handle flats by converting to sharps
    if (accidental === 'b') {
      const flatToSharpMap = {
        Cb: 'B',
        Db: 'C#',
        Eb: 'D#',
        Fb: 'E',
        Gb: 'F#',
        Ab: 'G#',
        Bb: 'A#',
      };

      const noteWithoutOctave = `${noteName}b`;
      if (flatToSharpMap[noteWithoutOctave]) {
        // Need to adjust octave for Cb (which becomes B of the previous octave)
        if (noteWithoutOctave === 'Cb') {
          return `${flatToSharpMap[noteWithoutOctave]}${octave - 1}`;
        }
        return `${flatToSharpMap[noteWithoutOctave]}${octave}`;
      }
    }

    // Standard format with sharp
    return `${noteName}${accidental}${octave}`;
  } catch (error) {
    console.error('Error formatting MIDI note:', error);
    return 'Unknown';
  }
};

/**
 * Extract note name without octave
 * @param {string|Object} note - Note as string or WebMidi object
 * @returns {string} Note name without octave
 */
export const getNoteNameWithoutOctave = note => {
  if (!note) return '';

  // Handle string format (e.g., "C4", "C#4")
  if (typeof note === 'string') {
    const match = note.match(/^([A-G][#b]?)\d+$/i);
    return match ? match[1].toUpperCase() : '';
  }

  // Handle object format (from WebMidi)
  if (typeof note === 'object') {
    let noteName = note.name ? note.name.toUpperCase() : '';

    // Add accidental if present
    if (note.accidental) {
      noteName += note.accidental;
    }

    return noteName;
  }

  return '';
};

/**
 * Format a note for display
 * @param {string} note - Note in standard format
 * @returns {string} Human-readable format
 */
export const formatNoteForDisplay = note => {
  if (!note) return '';

  // Extract note name and octave
  const match = note.match(/^([A-G])([#b]?)(\d)$/i);
  if (!match) return note;

  const noteName = match[1];
  const accidental = match[2] || '';
  const octave = match[3];

  // Format accidental for better readability
  const formattedAccidental = accidental === '#' ? '♯' : accidental === 'b' ? '♭' : '';

  return `${noteName}${formattedAccidental} (Octave ${octave})`;
};

/**
 * Categorize MIDI error messages
 * @param {Error} error - Error object
 * @returns {string} Error code
 */
export const getMIDIErrorCode = error => {
  const msg = error.message.toLowerCase();
  if (msg.includes('permission')) return 'PERMISSION_DENIED';
  if (msg.includes('not supported')) return 'NOT_SUPPORTED';
  if (msg.includes('not found')) return 'DEVICE_NOT_FOUND';
  if (msg.includes('connection')) return 'CONNECTION_FAILED';
  return 'UNKNOWN_ERROR';
};
