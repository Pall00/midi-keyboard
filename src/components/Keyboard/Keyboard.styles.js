// src/components/Keyboard/Keyboard.styles.js
import styled from 'styled-components';

/**
 * Main container for the piano keyboard
 * Handles scrolling and overall layout
 */
export const KeyboardContainer = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  background-color: #222;
  padding: 4px 0 0;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #666 #222;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #222;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 4px;
  }
`;

/**
 * Wrapper that contains all the piano keys
 * Establishes the positioning context for keys
 */
export const KeyboardWrapper = styled.div`
  position: relative;
  display: flex;
  margin: 0 auto;
  min-width: min-content;
  padding-bottom: 8px;
`;

/**
 * Container for the keys with position relative
 * This acts as the positioning context for absolute positioned keys
 */
export const KeysContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 160px;
`;

/**
 * Octave marker element
 * Shows labels for octaves (C4, C5, etc.)
 */
export const OctaveMarker = styled.div`
  position: absolute;
  bottom: 0px;
  left: ${props => props.$position}px;
  transform: translateX(-50%);
  font-size: 10px;
  color: #aaa;
  font-family: ${props => props.theme.typography.fontFamily};
  opacity: 0.7;
`;

/**
 * Container for additional controls
 * (octave switcher, zoom, etc.)
 */
export const KeyboardControlsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.25rem;
  background-color: #2a2a2a;
  border-bottom: 1px solid #333;
`;

/**
 * Control button style
 */
export const ControlButton = styled.button`
  background-color: ${props => (props.$active ? '#4568dc' : '#444')};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => (props.$active ? '#3a57c4' : '#555')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/**
 * Wrapper for keyboard instructions or help text
 */
export const KeyboardInstructions = styled.div`
  text-align: center;
  padding: 0.25rem;
  font-size: 0.8rem;
  color: #aaa;
  background-color: #2a2a2a;
`;
