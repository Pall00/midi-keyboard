// src/components/Key/Key.jsx
import PropTypes from 'prop-types';

import { 
  KeyContainer, 
  NoteLabel, 
  NoteName, 
  OctaveNumber, 
  KeyboardShortcut,
  KeyIndicator 
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
  // Split the note into note name and octave number
  const noteMatch = note.match(/^([A-G][#]?)(\d+)$/);

  if (!noteMatch) {
    console.error(`Invalid note format: ${note}`);
    return null;
  }

  const noteName = noteMatch[1];
  const octaveNumber = noteMatch[2];

  // Define static styles separate from animated styles
  const keyStyles = {
    height: isBlack ? '90px' : '150px',
    zIndex: isBlack ? 2 : 1,
    ...style,
  };

  // Animation properties for Framer Motion
  const animationProps = {
    animate: {
      backgroundColor: isActive 
        ? (isBlack ? '#555555' : '#E0E8FF') 
        : (isBlack ? '#333333' : '#FFFFFF'),
      y: isActive ? 2 : 0,
      boxShadow: isActive
        ? '0 1px 2px rgba(0, 0, 0, 0.2)'
        : isBlack
          ? '0 2px 3px rgba(0, 0, 0, 0.3)'
          : '0 2px 5px rgba(0, 0, 0, 0.15)',
    },
    transition: { duration: 0.05 },
  };

  return (
    <KeyContainer
      style={keyStyles}
      $isBlack={isBlack}
      {...animationProps}
      role="button"
      aria-pressed={isActive}
      tabIndex={0}
      aria-label={`${noteName} ${octaveNumber} piano key`}
      onMouseDown={e => {
        e.stopPropagation();
        onMouseDown(note);
      }}
      onMouseUp={e => {
        e.stopPropagation();
        onMouseUp(note);
      }}
      onMouseEnter={e => {
        e.stopPropagation();
        if (onMouseEnter) onMouseEnter(note);
      }}
      onMouseLeave={e => {
        e.stopPropagation();
        if (onMouseLeave) onMouseLeave(note);
      }}
      onTouchStart={e => {
        e.preventDefault(); // Prevent default touch behavior
        e.stopPropagation();
        onTouchStart(note);
      }}
      onTouchEnd={e => {
        e.preventDefault();
        e.stopPropagation();
        onTouchEnd(note);
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onMouseDown(note);
        }
      }}
      onKeyUp={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onMouseUp(note);
        }
      }}
      {...restProps}
    >
      <NoteLabel>
        <NoteName $isBlack={isBlack}>{noteName}</NoteName>
        <OctaveNumber $isBlack={isBlack}>{octaveNumber}</OctaveNumber>
      </NoteLabel>

      {keyboardShortcut && (
        <KeyboardShortcut>{keyboardShortcut}</KeyboardShortcut>
      )}

      {/* Add green dot indicator for highlighted notes */}
      {isHighlighted && <KeyIndicator $isBlack={isBlack} />}
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