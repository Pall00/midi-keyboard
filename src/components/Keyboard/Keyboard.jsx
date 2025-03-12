// src/components/Keyboard/Keyboard.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import Key from '../Key';
import { defaultKeyboardMapping } from '../../utils/keyboardMapping';
import { defaultTheme, createTheme } from '../../styles/theme';

import {
  KeyboardContainer,
  KeyboardWrapper,
  OctaveMarker,
  KeysContainer
} from './Keyboard.styles';

// Standard mapping for note positions in an octave
// The piano keyboard has 7 white keys and 5 black keys per octave
const NOTE_POSITIONS = {
  'C': { type: 'white', index: 0 },
  'C#': { type: 'black', index: 0 },  // Between C and D
  'D': { type: 'white', index: 1 },
  'D#': { type: 'black', index: 1 },  // Between D and E
  'E': { type: 'white', index: 2 },
  'F': { type: 'white', index: 3 },
  'F#': { type: 'black', index: 2 },  // Between F and G
  'G': { type: 'white', index: 4 },
  'G#': { type: 'black', index: 3 },  // Between G and A
  'A': { type: 'white', index: 5 },
  'A#': { type: 'black', index: 4 },  // Between A and B
  'B': { type: 'white', index: 6 }
};

// Determine number of white keys in an octave
const WHITE_KEYS_PER_OCTAVE = Object.values(NOTE_POSITIONS)
  .filter(pos => pos.type === 'white').length;

/**
 * Parse a note string into its components
 * @param {string} note - The note string (e.g., "C#4")
 * @returns {Object} Object with note name, whether it's sharp, and octave
 */
const parseNote = (note) => {
  const match = note.match(/^([A-G])([#]?)(\d+)$/);
  if (!match) {
    console.error(`Invalid note format: ${note}`);
    return null;
  }
  
  return {
    noteName: match[1],
    isSharp: match[2] === '#',
    octave: parseInt(match[3], 10),
    fullName: match[1] + (match[2] || '') // C or C#
  };
};

/**
 * Create a full piano keyboard layout
 * @param {Object} options - Options for key range
 * @returns {Array} Array of key objects with note and isBlack properties
 */
const createPianoKeys = ({ 
  startNote = 'A0', 
  endNote = 'C8' 
} = {}) => {
  // Parse start and end notes
  const startParsed = parseNote(startNote);
  const endParsed = parseNote(endNote);
  
  if (!startParsed || !endParsed) {
    console.error('Invalid start or end note format');
    return [];
  }
  
  // Define all possible notes in order
  const allNotes = [
    { note: 'C', isBlack: false },
    { note: 'C#', isBlack: true },
    { note: 'D', isBlack: false },
    { note: 'D#', isBlack: true },
    { note: 'E', isBlack: false },
    { note: 'F', isBlack: false },
    { note: 'F#', isBlack: true },
    { note: 'G', isBlack: false },
    { note: 'G#', isBlack: true },
    { note: 'A', isBlack: false },
    { note: 'A#', isBlack: true },
    { note: 'B', isBlack: false },
  ];
  
  // Create array to hold all keys
  const keys = [];
  
  // Generate all keys in range
  for (let octave = startParsed.octave; octave <= endParsed.octave; octave++) {
    // Find the starting index within the octave
    const startIdx = octave === startParsed.octave 
      ? allNotes.findIndex(n => n.note === startParsed.fullName)
      : 0;
      
    // Find the ending index within the octave
    const endIdx = octave === endParsed.octave 
      ? allNotes.findIndex(n => n.note === endParsed.fullName)
      : allNotes.length - 1;
    
    // Add all notes in this octave within range
    for (let i = startIdx; i <= (octave === endParsed.octave ? endIdx : allNotes.length - 1); i++) {
      keys.push({
        note: `${allNotes[i].note}${octave}`,
        isBlack: allNotes[i].isBlack,
      });
    }
  }
  
  return keys;
};

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
  customTheme,
  width,
  height,
}) => {
  // Apply custom theme if provided
  const theme = customTheme ? createTheme(customTheme) : defaultTheme;
  
  // Generate all piano keys based on key range
  const allKeys = createPianoKeys(keyRange);
  
  // Separate into white and black keys for rendering
  const whiteKeys = allKeys.filter(key => !key.isBlack);
  const blackKeys = allKeys.filter(key => key.isBlack);

  // Track mouse/touch state
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [touchedNotes, setTouchedNotes] = useState(new Set());
  
  // Calculate the total number of white keys for sizing
  const totalWhiteKeys = whiteKeys.length;
  
  // Constants for keyboard sizing
  const WHITE_KEY_WIDTH = width ? width / totalWhiteKeys : theme.dimensions.whiteKeyWidth;
  const adjustedHeight = height || (WHITE_KEY_WIDTH * 4.5); // Default height proportional to width
  const whiteKeyHeight = adjustedHeight;
  const blackKeyHeight = adjustedHeight * 0.6;
  const blackKeyWidth = WHITE_KEY_WIDTH * theme.dimensions.blackKeyWidthRatio;

  // Check if a note is active (either through props or touch)
  const isNoteActive = useCallback((note) => {
    return (activeNotes.includes(note) || touchedNotes.has(note));
  }, [activeNotes, touchedNotes]);
  
  // Check if a note is highlighted (for learning/highlighting features)
  const isNoteHighlighted = useCallback((note) => {
    return highlightedNotes.includes(note);
  }, [highlightedNotes]);

  // Precalculate positions for all keys
  const keyPositions = useMemo(() => {
    const positions = {};
    let whiteKeyCount = 0;
    
    // Process each key
    allKeys.forEach(key => {
      const parsedNote = parseNote(key.note);
      if (!parsedNote) return;
      
      const { noteName, isSharp, octave, fullName } = parsedNote;
      
      // Handle white keys - they're positioned sequentially
      if (!key.isBlack) {
        positions[key.note] = {
          left: whiteKeyCount * WHITE_KEY_WIDTH,
          top: 0,
          width: WHITE_KEY_WIDTH,
          height: whiteKeyHeight,
          zIndex: 1
        };
        whiteKeyCount++;
      } else {
        // For black keys, we need to find their relative position
        const notePosition = NOTE_POSITIONS[fullName];
        if (!notePosition) return;
        
        // Find the white note positions
        const octaveStartX = positions[`C${octave}`] ? 
          positions[`C${octave}`].left : 
          whiteKeyCount - (NOTE_POSITIONS[noteName].index); // fallback if C isn't present
        
        // Calculate position based on which black key it is
        const blackKeyIndex = notePosition.index;
        
        // Standard offsets for each black key position
        const blackKeyOffsets = [
          1.5, // C# (1.5 white keys from octave start)
          3.5, // D# (3.5 white keys from octave start)
          6.5, // F# (6.5 white keys from octave start)
          8.5, // G# (8.5 white keys from octave start)
          10.5 // A# (10.5 white keys from octave start)
        ];
        
        // Calculate position - converting from "octave unit" to actual pixels
        let left;
        
        // Map note name to its white key index
        const whiteKeyIndex = {
          'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
        };
        
        // Determine offset based on note
        if (fullName === 'C#') {
          left = positions[`C${octave}`] ? 
            positions[`C${octave}`].left + (WHITE_KEY_WIDTH * 0.7) : 
            whiteKeyCount - 1 + (WHITE_KEY_WIDTH * 0.7);
        } else if (fullName === 'D#') {
          left = positions[`D${octave}`] ? 
            positions[`D${octave}`].left + (WHITE_KEY_WIDTH * 0.7) : 
            positions[`D${octave-1}`] ? 
              positions[`D${octave-1}`].left + (WHITE_KEY_WIDTH * 0.7) + (7 * WHITE_KEY_WIDTH) : 
              whiteKeyCount - 1 + (WHITE_KEY_WIDTH * 0.7);
        } else if (fullName === 'F#') {
          left = positions[`F${octave}`] ? 
            positions[`F${octave}`].left + (WHITE_KEY_WIDTH * 0.7) : 
            whiteKeyCount - 1 + (WHITE_KEY_WIDTH * 0.7);
        } else if (fullName === 'G#') {
          left = positions[`G${octave}`] ? 
            positions[`G${octave}`].left + (WHITE_KEY_WIDTH * 0.7) : 
            whiteKeyCount - 1 + (WHITE_KEY_WIDTH * 0.7);
        } else if (fullName === 'A#') {
          left = positions[`A${octave}`] ? 
            positions[`A${octave}`].left + (WHITE_KEY_WIDTH * 0.7) : 
            whiteKeyCount - 1 + (WHITE_KEY_WIDTH * 0.7);
        }
        
        positions[key.note] = {
          left: left,
          top: 0,
          width: blackKeyWidth,
          height: blackKeyHeight,
          zIndex: 2
        };
      }
    });
    
    return positions;
  }, [allKeys, WHITE_KEY_WIDTH, whiteKeyHeight, blackKeyHeight, blackKeyWidth]);

  // Event handlers for mouse interaction
  const handleMouseDown = useCallback((note) => {
    setMouseIsDown(true);
    onNoteOn(note);
  }, [onNoteOn]);

  const handleMouseUp = useCallback((note) => {
    setMouseIsDown(false);
    if (!sustainEnabled) {
      onNoteOff(note);
    }
  }, [sustainEnabled, onNoteOff]);

  const handleMouseEnter = useCallback((note) => {
    if (mouseIsDown) {
      onNoteOn(note);
    }
  }, [mouseIsDown, onNoteOn]);

  const handleMouseLeave = useCallback((note) => {
    if (mouseIsDown && !sustainEnabled) {
      onNoteOff(note);
    }
  }, [mouseIsDown, sustainEnabled, onNoteOff]);

  // Touch handlers
  const handleTouchStart = useCallback((note) => {
    setTouchedNotes(prev => {
      const newSet = new Set(prev);
      newSet.add(note);
      return newSet;
    });
    onNoteOn(note);
  }, [onNoteOn]);

  const handleTouchEnd = useCallback((note) => {
    setTouchedNotes(prev => {
      const newSet = new Set(prev);
      newSet.delete(note);
      return newSet;
    });
    if (!sustainEnabled) {
      onNoteOff(note);
    }
  }, [sustainEnabled, onNoteOff]);

  // Reset mouse state when mouse is released outside the keyboard
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setMouseIsDown(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Create octave markers for visual reference
  const octaveMarkers = useMemo(() => {
    const markers = [];
    let previousOctave = null;
    
    // Find the position of each C note for octave markers
    whiteKeys.forEach(key => {
      const match = key.note.match(/^C(\d+)$/);
      if (match) {
        const octave = match[1];
        if (octave !== previousOctave && keyPositions[key.note]) {
          markers.push({
            label: key.note,
            position: keyPositions[key.note].left + (WHITE_KEY_WIDTH / 2),
          });
          previousOctave = octave;
        }
      }
    });
    
    return markers;
  }, [whiteKeys, keyPositions, WHITE_KEY_WIDTH]);

  return (
    <ThemeProvider theme={theme}>
      <KeyboardContainer>
        <KeyboardWrapper>
          {/* Render all keys, with white keys first (lower z-index) */}
          <KeysContainer style={{ height: `${adjustedHeight}px` }}>
            {/* Render white keys first (they'll have a lower z-index) */}
            {whiteKeys.map(key => (
              keyPositions[key.note] ? (
                <Key
                  key={key.note}
                  note={key.note}
                  isBlack={false}
                  keyboardShortcut={showKeyboardShortcuts ? keyboardMapping[key.note] : null}
                  isActive={isNoteActive(key.note)}
                  isHighlighted={isNoteHighlighted(key.note)}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    position: 'absolute',
                    left: `${keyPositions[key.note].left}px`,
                    top: `${keyPositions[key.note].top}px`,
                    width: `${keyPositions[key.note].width}px`,
                    height: `${keyPositions[key.note].height}px`,
                    zIndex: keyPositions[key.note].zIndex,
                  }}
                />
              ) : null
            ))}
            
            {/* Then render black keys (they'll have a higher z-index) */}
            {blackKeys.map(key => (
              keyPositions[key.note] ? (
                <Key
                  key={key.note}
                  note={key.note}
                  isBlack={true}
                  keyboardShortcut={showKeyboardShortcuts ? keyboardMapping[key.note] : null}
                  isActive={isNoteActive(key.note)}
                  isHighlighted={isNoteHighlighted(key.note)}
                  onMouseDown={handleMouseDown}
                  onMouseUp={handleMouseUp}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    position: 'absolute',
                    left: `${keyPositions[key.note].left - (keyPositions[key.note].width * 0.2)}px`,
                    top: `${keyPositions[key.note].top}px`,
                    width: `${keyPositions[key.note].width}px`,
                    height: `${keyPositions[key.note].height}px`,
                    zIndex: keyPositions[key.note].zIndex,
                  }}
                />
              ) : null
            ))}
          </KeysContainer>

          {/* Render octave markers */}
          {octaveMarkers.map(marker => (
            <OctaveMarker
              key={marker.label}
              $position={marker.position}
            >
              {marker.label}
            </OctaveMarker>
          ))}
        </KeyboardWrapper>
      </KeyboardContainer>
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
  /** Custom theme overrides */
  customTheme: PropTypes.object,
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
  keyboardMapping: defaultKeyboardMapping,
  sustainEnabled: false,
  customTheme: null,
  width: null,
  height: null,
};

export default Keyboard;