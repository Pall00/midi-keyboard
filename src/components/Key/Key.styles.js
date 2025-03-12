// src/components/Key/Key.styles.js
import styled from 'styled-components';
import { motion } from 'framer-motion';

/**
 * Main container for piano key
 */
export const KeyContainer = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0 0 ${props => props.theme.dimensions.borderRadius}px
    ${props => props.theme.dimensions.borderRadius}px;
  touch-action: none; /* Prevent browser handling of touch events */

  /* Dynamic styling based on key type (white or black) */
  height: ${props =>
    props.$isBlack
      ? props.theme.dimensions.blackKeyHeight
      : props.theme.dimensions.whiteKeyHeight}px;
  z-index: ${props => (props.$isBlack ? 2 : 1)};
  border: 1px solid
    ${props => (props.$isBlack ? props.theme.colors.blackKeyBorder : props.theme.colors.keyBorder)};
`;

/**
 * Container for the note label (letter + octave)
 */
export const NoteLabel = styled.div`
  position: absolute;
  bottom: 8px;
  font-size: ${props => props.theme.typography.noteLabelSize};
  line-height: 1;
  font-weight: 500;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: ${props => props.theme.typography.fontFamily};
`;

/**
 * Note name part of the label (e.g., "C")
 */
export const NoteName = styled.span`
  font-size: ${props => props.theme.typography.noteLabelSize};
  color: ${props =>
    props.$isBlack ? props.theme.colors.blackKeyText : props.theme.colors.whiteKeyText};
`;

/**
 * Octave number part of the label (e.g., "4")
 */
export const OctaveNumber = styled.span`
  font-size: ${props => props.theme.typography.octaveLabelSize};
  opacity: 0.8;
  margin-top: 1px;
  color: ${props =>
    props.$isBlack ? props.theme.colors.blackKeyText : props.theme.colors.whiteKeyText};
`;

/**
 * Keyboard shortcut display
 */
export const KeyboardShortcut = styled.span`
  position: absolute;
  bottom: 30px;
  font-size: ${props => props.theme.typography.keyboardShortcutSize};
  color: ${props => props.theme.colors.keyboardShortcut};
  font-family: ${props => props.theme.typography.fontFamily};
`;

/**
 * Visual indicator for highlighted keys
 */
export const KeyIndicator = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.highlightKey};
  top: ${props => (props.$isBlack ? '15px' : '30px')};
  left: 50%; /* Perfect center */
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.8);
  animation: pulse ${props => props.theme.animation.highlightPulseDuration}s infinite;
  z-index: 3;

  @keyframes pulse {
    0% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateX(-50%) scale(1.2);
      opacity: 0.8;
    }
    100% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
  }
`;