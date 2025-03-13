// src/themes/NeonSynthwaveTheme.js
import { createTheme } from '../styles/theme';

const NeonSynthwaveTheme = createTheme({
  colors: {
    // Key colors
    whiteKey: '#121212', // Dark base for white keys
    blackKey: '#0A0A0A', // Even darker for black keys
    activeWhiteKey: '#FF00FF', // Hot pink for pressed white keys
    activeBlackKey: '#00FFFF', // Cyan for pressed black keys
    highlightKey: '#9D00FF', // Neon purple for highlights

    // Borders and shadows
    keyBorder: '#1E1E1E', // Subtle border
    blackKeyBorder: '#000000', // True black border
    keyShadow: 'rgba(255, 0, 255, 0.3)', // Pink glow shadow

    // Text colors
    whiteKeyText: '#FF00FF', // Neon pink text on white keys
    blackKeyText: '#00FFFF', // Cyan text on black keys
    keyboardShortcut: '#9D00FF', // Purple for shortcuts
  },

  dimensions: {
    whiteKeyWidth: 36,
    blackKeyWidthRatio: 0.6,
    whiteKeyHeight: 150,
    blackKeyHeight: 90,
    borderRadius: 0, // Sharp edges for digital look
  },

  typography: {
    noteLabelSize: '11px',
    octaveLabelSize: '9px',
    keyboardShortcutSize: '9px',
    fontFamily: '"Orbitron", "Audiowide", sans-serif', // Futuristic font
  },

  animation: {
    keyPressDuration: 0.03, // Fast response for electronic feel
    highlightPulseDuration: 1.0, // Faster pulse for energy
  },
});

export default NeonSynthwaveTheme;
