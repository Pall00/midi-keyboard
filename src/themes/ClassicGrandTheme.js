// src/themes/ClassicGrandTheme.js
import { createTheme } from '../styles/theme';

const ClassicGrandTheme = createTheme({
  colors: {
    // Key colors
    whiteKey: '#FFF9F0', // Ivory white with slight warmth
    blackKey: '#141414', // Rich deep black
    activeWhiteKey: '#F5E8D6', // Warm ivory when pressed
    activeBlackKey: '#2C2C2C', // Slightly lighter black when pressed
    highlightKey: '#D4AF37', // Gold highlight

    // Borders and shadows
    keyBorder: '#E5DDD0', // Subtle ivory border
    blackKeyBorder: '#000000', // True black border
    keyShadow: 'rgba(0, 0, 0, 0.25)', // Deeper shadow for classic look

    // Text colors
    whiteKeyText: '#4A4A4A', // Darker text for better contrast on ivory
    blackKeyText: '#CCCCCC', // Light gray text on black keys
    keyboardShortcut: '#8B7D6B', // Warm gray for shortcuts
  },

  dimensions: {
    whiteKeyWidth: 38, // Slightly wider keys
    blackKeyWidthRatio: 0.55, // Slightly narrower black keys (ratio to white)
    whiteKeyHeight: 160, // Taller keys
    blackKeyHeight: 100, // Taller black keys
    borderRadius: 2, // Less rounded for classic look
  },

  typography: {
    noteLabelSize: '12px',
    octaveLabelSize: '9px',
    keyboardShortcutSize: '9px',
    fontFamily: 'Georgia, serif', // Elegant serif font
  },

  animation: {
    keyPressDuration: 0.08, // Slightly slower for weighted key feel
    highlightPulseDuration: 1.8, // Slower pulse for elegance
  },
});

export default ClassicGrandTheme;
