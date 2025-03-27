// src/components/Keyboard/Keyboard.jsx
import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import { defaultKeyboardMapping } from '../../utils/keyboardMapping';
import { defaultTheme } from '../../styles/theme';
import usePianoNotes from '../../hooks/usePianoNotes';
import useKeyPositions from '../../hooks/useKeyPositions';
import useKeyboardInteractions from '../../hooks/useKeyboardInteractions';

import KeyboardLayout from './components/KeyboardLayout';
import PianoKeys from './components/PianoKeys';
import OctaveMarkers from './components/OctaveMarkers';

/**
 * Piano Keyboard Component
 *
 * Renders a complete piano keyboard with both white and black keys,
 * handles mouse and touch interactions, and can highlight active notes.
 */
const Keyboard = ({
  activeNotes,
  highlightedNotes,
  onNoteOn,
  onNoteOff,
  keyRange,
  showKeyboardShortcuts,
  keyboardMapping,
  sustainEnabled,
  width,
  height,
}) => {
  // Apply the default theme
  const theme = defaultTheme;

  // Debug: Log theme colors
  useEffect(() => {
    console.log('Keyboard using default theme');
  }, []);

  // Use piano notes hook to process the key range
  // Ensure keyRange has default values in case it's undefined
  const safeKeyRange = keyRange || { startNote: 'C4', endNote: 'B5' };
  const { whiteKeys, blackKeys, totalWhiteKeys } = usePianoNotes(safeKeyRange);

  // Constants for keyboard sizing
  const WHITE_KEY_WIDTH = width ? width / totalWhiteKeys : theme.dimensions.whiteKeyWidth;
  const adjustedHeight = height || WHITE_KEY_WIDTH * 4.5; // Default height proportional to width
  const whiteKeyHeight = adjustedHeight;
  const blackKeyHeight = adjustedHeight * 0.6;
  const blackKeyWidth = WHITE_KEY_WIDTH * theme.dimensions.blackKeyWidthRatio;

  // Use key positions hook to calculate positions for all keys
  const keyPositions = useKeyPositions({
    whiteKeys,
    blackKeys,
    whiteKeyWidth: WHITE_KEY_WIDTH,
    whiteKeyHeight,
    blackKeyWidth,
    blackKeyHeight,
  });

  // Use keyboard interactions hook to handle mouse and touch events
  const {
    isTouched,
    handleMouseDown,
    handleMouseUp,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
  } = useKeyboardInteractions({
    sustainEnabled,
    onNoteOn,
    onNoteOff,
  });

  // Check if a note is active (either through props or touch)
  const isNoteActive = useCallback(
    note => {
      return (activeNotes || []).includes(note) || isTouched(note);
    },
    [activeNotes, isTouched]
  );

  // Check if a note is highlighted
  const isNoteHighlighted = useCallback(
    note => {
      return (highlightedNotes || []).includes(note);
    },
    [highlightedNotes]
  );

  return (
    <ThemeProvider theme={theme}>
      <KeyboardLayout
        width={width}
        height={adjustedHeight}
        totalWhiteKeys={totalWhiteKeys}
        whiteKeyWidth={WHITE_KEY_WIDTH}
      >
        <PianoKeys
          whiteKeys={whiteKeys}
          blackKeys={blackKeys}
          keyPositions={keyPositions}
          blackKeyWidth={blackKeyWidth}
          isNoteActive={isNoteActive}
          isNoteHighlighted={isNoteHighlighted}
          showKeyboardShortcuts={showKeyboardShortcuts}
          keyboardMapping={keyboardMapping}
          handleMouseDown={handleMouseDown}
          handleMouseUp={handleMouseUp}
          handleMouseEnter={handleMouseEnter}
          handleMouseLeave={handleMouseLeave}
          handleTouchStart={handleTouchStart}
          handleTouchEnd={handleTouchEnd}
          theme={theme} // Explicitly pass the theme down
        />

        <OctaveMarkers
          whiteKeys={whiteKeys}
          keyPositions={keyPositions}
          whiteKeyWidth={WHITE_KEY_WIDTH}
        />
      </KeyboardLayout>
    </ThemeProvider>
  );
};

Keyboard.propTypes = {
  /** Array of currently active (pressed) notes */
  activeNotes: PropTypes.arrayOf(PropTypes.string),
  /** Array of notes to highlight (e.g., for learning) */
  highlightedNotes: PropTypes.arrayOf(PropTypes.string),
  /** Called when a note is activated */
  onNoteOn: PropTypes.func.isRequired,
  /** Called when a note is deactivated */
  onNoteOff: PropTypes.func.isRequired,
  /** Range of keys to display */
  keyRange: PropTypes.shape({
    startNote: PropTypes.string,
    endNote: PropTypes.string,
  }),
  /** Whether to show computer keyboard shortcuts */
  showKeyboardShortcuts: PropTypes.bool,
  /** Mapping of notes to computer keyboard keys */
  keyboardMapping: PropTypes.object,
  /** Whether sustain is enabled (notes don't stop when released) */
  sustainEnabled: PropTypes.bool,
  /** Explicit width for the keyboard */
  width: PropTypes.number,
  /** Explicit height for the keyboard */
  height: PropTypes.number,
};

Keyboard.defaultProps = {
  activeNotes: [],
  highlightedNotes: [],
  keyRange: { startNote: 'C4', endNote: 'B5' }, // Two octaves by default
  showKeyboardShortcuts: true,
  keyboardMapping: defaultKeyboardMapping || {},
  sustainEnabled: false,
  width: null,
  height: null,
};

export default Keyboard;