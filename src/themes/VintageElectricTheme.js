// src/themes/VintageElectricTheme.js
import { createTheme } from '../styles/theme';

const VintageElectricTheme = createTheme({
  colors: {
    // Key colors
    whiteKey: '#E8D4B7', // Warm beige
    blackKey: '#402E32', // Dark brown
    activeWhiteKey: '#D4BF9A', // Darker beige when pressed
    activeBlackKey: '#5A3D40', // Richer brown when pressed
    highlightKey: '#B5A798', // Metallic accent color

    // Borders and shadows
    keyBorder: '#CBBBAA', // Softer beige border
    blackKeyBorder: '#2A1E1F', // Darker border for black keys
    keyShadow: 'rgba(80, 60, 40, 0.2)', // Warm shadow

    // Text colors
    whiteKeyText: '#6D5C4E', // Brown text on white keys
    blackKeyText: '#D1BDA7', // Light beige on black keys
    keyboardShortcut: '#8D7B6C', // Muted brown for shortcuts
  },

  dimensions: {
    whiteKeyWidth: 38,
    blackKeyWidthRatio: 0.58,
    whiteKeyHeight: 140, // Slightly shorter keys
    blackKeyHeight: 85,
    borderRadius: 6, // More rounded for vintage look
  },

  typography: {
    noteLabelSize: '11px',
    octaveLabelSize: '9px',
    keyboardShortcutSize: '9px',
    fontFamily: '"Courier New", monospace', // Typewriter-like font
  },

  animation: {
    keyPressDuration: 0.07, // Slightly slower for mechanical feel
    highlightPulseDuration: 1.5,
  },
});

export default VintageElectricTheme;
