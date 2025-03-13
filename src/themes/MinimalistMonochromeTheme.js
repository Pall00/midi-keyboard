// src/themes/MinimalistMonochromeTheme.js
import { createTheme } from '../styles/theme';

const MinimalistMonochromeTheme = createTheme({
  colors: {
    // Key colors
    whiteKey: '#FFFFFF', // Pure white
    blackKey: '#333333', // Dark gray, not pure black
    activeWhiteKey: '#F0F0F0', // Very light gray when active
    activeBlackKey: '#4A4A4A', // Medium gray when active
    highlightKey: '#888888', // Medium gray highlight without color

    // Borders and shadows
    keyBorder: '#EEEEEE', // Very subtle border
    blackKeyBorder: '#2A2A2A', // Slightly darker than the black key
    keyShadow: 'rgba(0, 0, 0, 0.08)', // Very subtle shadow

    // Text colors
    whiteKeyText: '#888888', // Medium gray text
    blackKeyText: '#CCCCCC', // Light gray text
    keyboardShortcut: '#AAAAAA', // Gray for shortcuts
  },

  dimensions: {
    whiteKeyWidth: 36,
    blackKeyWidthRatio: 0.62, // Slightly wider black keys
    whiteKeyHeight: 145, // Slightly shorter keys
    blackKeyHeight: 85,
    borderRadius: 2, // Minimal rounding
  },

  typography: {
    noteLabelSize: '10px',
    octaveLabelSize: '8px',
    keyboardShortcutSize: '8px',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', // Clean sans-serif
  },

  animation: {
    keyPressDuration: 0.04, // Quick, subtle response
    highlightPulseDuration: 2.0, // Slow, subtle pulse
  },
});

export default MinimalistMonochromeTheme;
