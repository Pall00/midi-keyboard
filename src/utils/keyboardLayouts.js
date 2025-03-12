// src/utils/keyboardLayouts.js
/**
 * Predefined keyboard layouts with note ranges
 * Each layout defines the start and end notes for different keyboard sizes
 */

export const keyboardLayouts = {
  full88: {
    id: 'full88',
    name: 'Full Piano (88 keys)',
    description: 'Standard full-size piano with 88 keys',
    startNote: 'A0',
    endNote: 'C8',
    keyCount: 88,
  },
  keys76: {
    id: 'keys76',
    name: '76-Key Keyboard',
    description: 'Common 76-key digital piano layout',
    startNote: 'E1',
    endNote: 'G7',
    keyCount: 76,
  },
  keys61: {
    id: 'keys61',
    name: '61-Key Keyboard',
    description: 'Standard 61-key MIDI controller/keyboard',
    startNote: 'C2',
    endNote: 'C7',
    keyCount: 61,
  },
  keys49: {
    id: 'keys49',
    name: '49-Key Keyboard',
    description: 'Compact 49-key MIDI controller',
    startNote: 'C3',
    endNote: 'C7',
    keyCount: 49,
  },
  keys37: {
    id: 'keys37',
    name: '37-Key Keyboard',
    description: 'Mini 37-key MIDI controller',
    startNote: 'C3',
    endNote: 'C6',
    keyCount: 37,
  },
  keys25: {
    id: 'keys25',
    name: '25-Key Keyboard',
    description: 'Ultra-compact 25-key MIDI controller (2 octaves)',
    startNote: 'C3',
    endNote: 'C5',
    keyCount: 25,
  },
  keys13: {
    id: 'keys13',
    name: 'Single Octave',
    description: 'Single octave (C4-C5) containing middle C',
    startNote: 'C4',
    endNote: 'C5',
    keyCount: 13,
  },
};

/**
 * Default keyboard layout ID
 * Set to 37 keys as a reasonable default for web applications
 */
export const defaultLayoutId = 'keys37';

/**
 * Get a keyboard layout by ID
 * @param {string} layoutId - The layout ID to retrieve
 * @returns {Object} The layout configuration, or the default layout if not found
 */
export const getKeyboardLayout = (layoutId) => {
  return keyboardLayouts[layoutId] || keyboardLayouts[defaultLayoutId];
};

/**
 * Get all keyboard layouts as an array, sorted by key count
 * @returns {Array} Sorted array of keyboard layouts
 */
export const getKeyboardLayoutsArray = () => {
  return Object.values(keyboardLayouts).sort((a, b) => a.keyCount - b.keyCount);
};

/**
 * Convert a keyRange object to a layout ID if it matches a predefined layout
 * @param {Object} keyRange - The key range object with startNote and endNote
 * @returns {string|null} Layout ID if a match is found, null otherwise
 */
export const keyRangeToLayoutId = (keyRange) => {
  if (!keyRange || !keyRange.startNote || !keyRange.endNote) return null;
  
  const match = Object.values(keyboardLayouts).find(
    layout => layout.startNote === keyRange.startNote && layout.endNote === keyRange.endNote
  );
  
  return match ? match.id : null;
};

export default keyboardLayouts;