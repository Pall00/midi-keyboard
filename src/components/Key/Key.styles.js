// src/components/Key/Key.styles.js
import styled from 'styled-components';

/**
 * Main container for piano key with direct color application
 */
export const KeyContainer = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  user-select: none;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0 0 ${props => props.theme.dimensions.borderRadius}px
    ${props => props.theme.dimensions.borderRadius}px;
  touch-action: none; /* Prevent browser handling of touch events */

  /* Use direct color prop if provided (for debugging) */
  background-color: ${props =>
    props.$keyColor || // Use direct color prop if provided
    (props.$isActive
      ? props.$isBlack
        ? props.theme.colors.activeBlackKey
        : props.theme.colors.activeWhiteKey
      : props.$isBlack
        ? props.theme.colors.blackKey
        : props.theme.colors.whiteKey)};

  height: ${props =>
    props.$isBlack
      ? props.theme.dimensions.blackKeyHeight
      : props.theme.dimensions.whiteKeyHeight}px;
  z-index: ${props => (props.$isBlack ? 2 : 1)};
  border: 1px solid
    ${props => (props.$isBlack ? props.theme.colors.blackKeyBorder : props.theme.colors.keyBorder)};

  /* Add box-shadow */
  box-shadow: ${props =>
    props.$isActive
      ? `0 1px 2px ${props.theme.colors.keyShadow}`
      : props.$isBlack
        ? `0 1px 2px ${props.theme.colors.keyShadow}`
        : `0 1px 3px ${props.theme.colors.keyShadow}`};

  /* Add transition for smooth changes */
  transition:
    background-color 0.1s ease,
    box-shadow 0.1s ease,
    transform 0.1s ease;

  /* Add transform for active state */
  transform: translateY(${props => (props.$isActive ? '1px' : '0')});
`;

/**
 * Inner content container to help with positioning
 */
export const InnerKeyContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
`;

/**
 * Container for the note label (letter + octave)
 */
export const NoteLabel = styled.div`
  position: absolute;
  bottom: 4px;
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
  margin-top: 0;
  color: ${props =>
    props.$isBlack ? props.theme.colors.blackKeyText : props.theme.colors.whiteKeyText};
`;

/**
 * Keyboard shortcut display
 */
export const KeyboardShortcut = styled.span`
  position: absolute;
  bottom: 22px;
  font-size: ${props => props.theme.typography.keyboardShortcutSize};
  color: ${props => props.theme.colors.keyboardShortcut};
  font-family: ${props => props.theme.typography.fontFamily};
`;

/**
 * Visual indicator for highlighted keys
 */
export const KeyIndicator = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.highlightKey};
  top: ${props => (props.$isBlack ? '12px' : '25px')};
  left: 50%; /* Perfect center */
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.8);
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
