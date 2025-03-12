// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

/**
 * Global styles for the piano keyboard components
 *
 * These styles ensure consistent rendering and proper
 * reset of browser styles that might interfere with
 * the piano keyboard.
 */
const GlobalStyles = createGlobalStyle`
  /* Style resets for specific piano components */
  .piano-keyboard-container * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }
  
  /* Ensure proper touch handling */
  .piano-keyboard-container {
    touch-action: manipulation;
    user-select: none;
  }
  
  /* Make sure button resets properly */
  .piano-keyboard-container button {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: none;
  }
  
  /* Custom scrollbar styling */
  .piano-keyboard-container ::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }

  .piano-keyboard-container ::-webkit-scrollbar-track {
    background: #222;
    border-radius: 4px;
  }

  .piano-keyboard-container ::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 4px;
  }
  
  /* Ensure proper focus visibility for accessibility */
  .piano-keyboard-container :focus-visible {
    outline: 2px solid #4568dc;
    outline-offset: 2px;
  }
  
  /* Hide focus outline for mouse users but show for keyboard users */
  .piano-keyboard-container :focus:not(:focus-visible) {
    outline: none;
  }
`;

export default GlobalStyles;
