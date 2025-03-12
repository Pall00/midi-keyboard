// src/utils/keyboardMapping.js
/**
 * Default mapping of computer keyboard keys to piano notes
 *
 * This provides a two-octave range for standard QWERTY keyboards:
 * - Lower row (A-L keys): White keys for C4-C5
 * - Upper row (W-P keys): Black keys for C#4-D#5
 */
export const defaultKeyboardMapping = {
  // Lower octave (C4-B4) - Uses A-K keys
  a: 'C4',
  w: 'C#4',
  s: 'D4',
  e: 'D#4',
  d: 'E4',
  f: 'F4',
  t: 'F#4',
  g: 'G4',
  y: 'G#4',
  h: 'A4',
  u: 'A#4',
  j: 'B4',

  // Upper octave (C5-E5) - Uses K-; keys
  k: 'C5',
  o: 'C#5',
  l: 'D5',
  p: 'D#5',
  ';': 'E5',
};

/**
 * Create a custom keyboard mapping
 * @param {Object} customMapping - Custom key-to-note mapping
 * @param {boolean} override - If true, completely replace the default mapping
 * @returns {Object} - The resulting keyboard mapping
 */
export const createKeyboardMapping = (customMapping = {}, override = false) => {
  if (override) {
    return { ...customMapping };
  }
  return { ...defaultKeyboardMapping, ...customMapping };
};

/**
 * Get the piano note associated with a keyboard key
 * @param {string} key - The keyboard key (lowercase)
 * @param {Object} mapping - The keyboard mapping to use
 * @returns {string|null} - The piano note, or null if not mapped
 */
export const getNoteFromKey = (key, mapping = defaultKeyboardMapping) => {
  return mapping[key.toLowerCase()] || null;
};

/**
 * Get keyboard key associated with a piano note (reverse lookup)
 * @param {string} note - The piano note (e.g., "C4")
 * @param {Object} mapping - The keyboard mapping to use
 * @returns {string|null} - The keyboard key, or null if not mapped
 */
export const getKeyFromNote = (note, mapping = defaultKeyboardMapping) => {
  const entries = Object.entries(mapping);
  const found = entries.find(([_, mappedNote]) => mappedNote === note);
  return found ? found[0] : null;
};

export default defaultKeyboardMapping;
