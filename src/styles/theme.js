// src/styles/theme.js
/**
 * Fixed theme for the piano keyboard
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
    whiteKeyWidth: 32,
    blackKeyWidthRatio: 0.6, // Ratio of white key width
    whiteKeyHeight: 130,
    blackKeyHeight: 80,
    borderRadius: 3,
  },

  typography: {
    noteLabelSize: '10px',
    octaveLabelSize: '8px',
    keyboardShortcutSize: '8px',
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

export default defaultTheme;