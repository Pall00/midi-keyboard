// src/themes/ChildFriendlyTheme.js
import { createTheme } from '../styles/theme';

// Helper to generate octave-based colors
const getOctaveColor = octave => {
  const colors = {
    0: '#FF9AA2', // Red (lowest octave)
    1: '#FFB347', // Orange
    2: '#FDFD96', // Yellow
    3: '#A8E6CE', // Green
    4: '#B2DFDB', // Teal (middle octave)
    5: '#B5C7ED', // Blue
    6: '#C5B0E5', // Purple
    7: '#FFCCF9', // Pink (highest octave)
  };
  return colors[octave] || colors[4]; // Default to middle octave if unknown
};

const ChildFriendlyTheme = createTheme({
  colors: {
    // Key colors - base colors (will be modified by code at runtime)
    whiteKey: '#FFFFFF', // Pure white (will be tinted by octave)
    blackKey: '#555555', // Softer black
    activeWhiteKey: '#E3F2FD', // Light blue when pressed
    activeBlackKey: '#7986CB', // Purple-blue when pressed
    highlightKey: '#4FC3F7', // Bright blue highlight

    // Borders and shadows
    keyBorder: '#DDDDDD', // Light border
    blackKeyBorder: '#444444', // Softer border for black keys
    keyShadow: 'rgba(0, 0, 0, 0.1)', // Very soft shadow

    // Text colors
    whiteKeyText: '#5C6BC0', // Indigo text on white keys
    blackKeyText: '#FFFFFF', // White text on black keys
    keyboardShortcut: '#FF7043', // Orange for shortcuts

    // Additional theme colors
    octaveColors: {
      // Will be used by custom rendering code
      0: '#FF9AA2', // Red (lowest octave)
      1: '#FFB347', // Orange
      2: '#FDFD96', // Yellow
      3: '#A8E6CE', // Green
      4: '#B2DFDB', // Teal (middle octave)
      5: '#B5C7ED', // Blue
      6: '#C5B0E5', // Purple
      7: '#FFCCF9', // Pink (highest octave)
    },
  },

  dimensions: {
    whiteKeyWidth: 40, // Wider keys for children
    blackKeyWidthRatio: 0.65, // Wider black keys
    whiteKeyHeight: 140,
    blackKeyHeight: 85,
    borderRadius: 8, // Very rounded corners
  },

  typography: {
    noteLabelSize: '14px', // Larger text
    octaveLabelSize: '11px', // Larger text
    keyboardShortcutSize: '12px', // Larger text
    fontFamily: '"Comic Sans MS", "Marker Felt", sans-serif', // Playful font
  },

  animation: {
    keyPressDuration: 0.1, // Slower for better visual feedback
    highlightPulseDuration: 1.0, // Faster pulse for engagement
  },
});

export default ChildFriendlyTheme;
