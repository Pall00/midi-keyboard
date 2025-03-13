// src/styles/theme.js
/**
 * Default theme for the piano keyboard
 * Contains colors, dimensions, and animation settings
 */

export const defaultTheme = {
  colors: {
    // Key colors
    whiteKey: '#FFFFFF',
    blackKey: '#333333',
    activeWhiteKey: '#E0E8FF',
    activeBlackKey: '#555555',
    highlightKey: '#4CAF50', // For highlighting specific keys (e.g., training)

    // Borders and shadows
    keyBorder: '#DDDDDD',
    blackKeyBorder: '#222222',
    keyShadow: 'rgba(0, 0, 0, 0.15)',

    // Text colors
    whiteKeyText: '#555555',
    blackKeyText: '#AAAAAA',
    keyboardShortcut: '#999999',
  },

  dimensions: {
    whiteKeyWidth: 36,
    blackKeyWidthRatio: 0.6, // Ratio of white key width
    whiteKeyHeight: 150,
    blackKeyHeight: 90,
    borderRadius: 4,
  },

  typography: {
    noteLabelSize: '11px',
    octaveLabelSize: '9px',
    keyboardShortcutSize: '9px',
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
  },

  animation: {
    keyPressDuration: 0.05,
    highlightPulseDuration: 1.5,
  },

  // Responsive breakpoints
  breakpoints: {
    small: '576px',
    medium: '768px',
    large: '992px',
  },
};

/**
 * Creates a custom theme by deeply merging user options with the default theme
 * @param {Object} options - Custom theme options
 * @returns {Object} - Merged theme
 */
export const createTheme = (options = {}) => {
  // Helper for deep merge
  const deepMerge = (target, source) => {
    const output = { ...target };

    // For each property in source
    Object.keys(source).forEach(key => {
      // If the property is an object and exists in both
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        target[key] &&
        typeof target[key] === 'object' &&
        target[key] !== null
      ) {
        // Recursively merge objects
        output[key] = deepMerge(target[key], source[key]);
      } else {
        // Otherwise just copy the source value
        output[key] = source[key];
      }
    });

    return output;
  };

  // Debug: log what we're merging
  console.log('Creating theme, custom options:', options);

  // Deep merge with default theme
  const merged = deepMerge(defaultTheme, options);

  // Debug: log result
  console.log('Merged theme result:', merged);

  return merged;
};

export default defaultTheme;
