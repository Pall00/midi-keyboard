// src/themes/NatureInspiredTheme.js
import { createTheme } from '../styles/theme';

const NatureInspiredTheme = createTheme({
  colors: {
    // Key colors
    whiteKey: '#F5F1E6', // Soft cream/paper color
    blackKey: '#4B7F52', // Forest green
    activeWhiteKey: '#E0DBCA', // Pressed cream color
    activeBlackKey: '#3A6245', // Darker green when pressed
    highlightKey: '#8E6E53', // Earthy brown highlight

    // Borders and shadows
    keyBorder: '#E5E0D5', // Soft cream border
    blackKeyBorder: '#3A6245', // Darker green border
    keyShadow: 'rgba(90, 70, 50, 0.15)', // Natural shadow

    // Text colors
    whiteKeyText: '#5F7161', // Sage green text on white keys
    blackKeyText: '#DADED4', // Light sage on green keys
    keyboardShortcut: '#A06235', // Wood brown for shortcuts
  },

  dimensions: {
    whiteKeyWidth: 38,
    blackKeyWidthRatio: 0.6,
    whiteKeyHeight: 145,
    blackKeyHeight: 90,
    borderRadius: 7, // More rounded for organic feel
  },

  typography: {
    noteLabelSize: '11px',
    octaveLabelSize: '9px',
    keyboardShortcutSize: '9px',
    fontFamily: '"Palatino Linotype", "Book Antiqua", Georgia, serif', // Natural, organic font
  },

  animation: {
    keyPressDuration: 0.08, // Slightly slower for natural feel
    highlightPulseDuration: 2.0, // Slow, gentle pulse
  },
});

export default NatureInspiredTheme;
