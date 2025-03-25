// src/components/Key/Key.jsx
import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';

// Import internal styled elements
import {
  KeyContainer,
  InnerKeyContent,
  NoteLabel,
  NoteName,
  OctaveNumber,
  KeyboardShortcut,
  KeyIndicator,
} from './Key.styles';

/**
 * Piano Key Component
 *
 * Renders an individual piano key (white or black) with appropriate styling
 * and handlers for mouse/touch interactions.
 */
const Key = ({
  note,
  isBlack,
  isActive,
  isHighlighted,
  keyboardShortcut,
  onMouseDown,
  onMouseUp,
  onMouseEnter,
  onMouseLeave,
  onTouchStart,
  onTouchEnd,
  style,
  ...restProps
}) => {
  // Get theme from styled-components context
  const theme = useContext(ThemeContext);

  // Debug: Log the theme received by this component - REMOVED FOR PRODUCTION
  // useEffect(() => {
  //   if (theme) {
  //     console.log(`Key ${note} theme:`, {
  //       color: isBlack
  //         ? isActive
  //           ? theme.colors.activeBlackKey
  //           : theme.colors.blackKey
  //         : isActive
  //           ? theme.colors.activeWhiteKey
  //           : theme.colors.whiteKey,
  //     });
  //   }
  // }, [note, isBlack, isActive, theme]);

  // Split the note into note name and octave number
  const noteMatch = note.match(/^([A-G][#]?)(\d+)$/);

  if (!noteMatch) {
    console.error(`Invalid note format: ${note}`);
    return null;
  }

  const noteName = noteMatch[1];
  const octaveNumber = noteMatch[2];

  // Event handlers
  const handleKeyMouseDown = e => {
    e.stopPropagation();
    onMouseDown(note);
  };

  const handleKeyMouseUp = e => {
    e.stopPropagation();
    onMouseUp(note);
  };

  const handleKeyMouseEnter = e => {
    e.stopPropagation();
    if (onMouseEnter) onMouseEnter(note);
  };

  const handleKeyMouseLeave = e => {
    e.stopPropagation();
    if (onMouseLeave) onMouseLeave(note);
  };

  const handleKeyTouchStart = e => {
    e.preventDefault();
    e.stopPropagation();
    onTouchStart(note);
  };

  const handleKeyTouchEnd = e => {
    e.preventDefault();
    e.stopPropagation();
    onTouchEnd(note);
  };

  // Debug: Console log the calculated colors - REMOVED FOR PRODUCTION
  const keyColor = isBlack
    ? isActive
      ? theme?.colors?.activeBlackKey
      : theme?.colors?.blackKey
    : isActive
      ? theme?.colors?.activeWhiteKey
      : theme?.colors?.whiteKey;

  // console.log(`Key ${note} render:`, {
  //   isBlack,
  //   isActive,
  //   calculatedColor: keyColor,
  //   themeAvailable: !!theme,
  // });

  return (
    <KeyContainer
      style={style}
      $isBlack={isBlack}
      $isActive={isActive}
      role="button"
      aria-pressed={isActive}
      tabIndex={0}
      aria-label={`${noteName} ${octaveNumber} piano key`}
      onMouseDown={handleKeyMouseDown}
      onMouseUp={handleKeyMouseUp}
      onMouseEnter={handleKeyMouseEnter}
      onMouseLeave={handleKeyMouseLeave}
      onTouchStart={handleKeyTouchStart}
      onTouchEnd={handleKeyTouchEnd}
      // Manual color prop to force the issue - not ideal but good for debugging
      $keyColor={keyColor}
      {...restProps}
    >
      <InnerKeyContent>
        <NoteLabel>
          <NoteName $isBlack={isBlack}>{noteName}</NoteName>
          <OctaveNumber $isBlack={isBlack}>{octaveNumber}</OctaveNumber>
        </NoteLabel>

        {keyboardShortcut && <KeyboardShortcut>{keyboardShortcut}</KeyboardShortcut>}

        {isHighlighted && <KeyIndicator $isBlack={isBlack} />}
      </InnerKeyContent>
    </KeyContainer>
  );
};

Key.propTypes = {
  /** Note identifier (e.g., "C4", "F#5") */
  note: PropTypes.string.isRequired,
  /** Whether this is a black key */
  isBlack: PropTypes.bool,
  /** Whether the key is currently active (pressed) */
  isActive: PropTypes.bool,
  /** Whether the key should be highlighted (e.g., for training) */
  isHighlighted: PropTypes.bool,
  /** Keyboard key that triggers this piano key (optional) */
  keyboardShortcut: PropTypes.string,
  /** Handler for when key is pressed */
  onMouseDown: PropTypes.func.isRequired,
  /** Handler for when key is released */
  onMouseUp: PropTypes.func.isRequired,
  /** Handler for when mouse enters key while pressed */
  onMouseEnter: PropTypes.func,
  /** Handler for when mouse leaves key while pressed */
  onMouseLeave: PropTypes.func,
  /** Handler for touch start event */
  onTouchStart: PropTypes.func.isRequired,
  /** Handler for touch end event */
  onTouchEnd: PropTypes.func.isRequired,
  /** Additional custom styles */
  style: PropTypes.object,
};

Key.defaultProps = {
  isBlack: false,
  isActive: false,
  isHighlighted: false,
  keyboardShortcut: null,
  onMouseEnter: null,
  onMouseLeave: null,
  style: {},
};

export default Key;
