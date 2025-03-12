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
 * Creates a custom theme by merging user options with the default theme
 * @param {Object} options - Custom theme options
 * @returns {Object} - Merged theme
 */
export const createTheme = (options = {}) => {
  return {
    colors: { ...defaultTheme.colors, ...(options.colors || {}) },
    dimensions: { ...defaultTheme.dimensions, ...(options.dimensions || {}) },
    typography: { ...defaultTheme.typography, ...(options.typography || {}) },
    animation: { ...defaultTheme.animation, ...(options.animation || {}) },
    breakpoints: { ...defaultTheme.breakpoints, ...(options.breakpoints || {}) },
  };
};

export default defaultTheme;
