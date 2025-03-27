// src/components/Piano/Piano.jsx
import { useState, useCallback, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import Keyboard from '../Keyboard';
import PianoSettings from '../PianoSettings'; // Import the new consolidated component
import { defaultTheme } from '../../styles/theme';
import { defaultKeyboardMapping } from '../../utils/keyboardMapping';
import {
  defaultLayoutId,
  getKeyboardLayout,
  keyRangeToLayoutId,
} from '../../utils/keyboardLayouts';
import { midiNoteToNoteName, createPlayNotesFunction } from '../../utils/midiNotePlayer';
import useAudioEngine from '../../hooks/useAudioEngine';
import useKeyboardInput from '../../hooks/useKeyboardInput';
import usePianoNotes from '../../hooks/usePianoNotes';
import { CONNECTION_STATUS } from '../../hooks/useMidiConnectionManager';

import {
  PianoContainer,
  ControlsContainer,
  ControlButton,
  MiniStatusDisplay,
  SettingsButton,
} from './Piano.styles';

/**
 * Piano Component
 *
 * Main component that integrates the keyboard, audio engine, and input handlers.
 * Uses a fixed theme for consistent appearance.
 */
const Piano = forwardRef(({
  keyRange,
  onNoteOn,
  onNoteOff,
  onMidiMessage,
  showControls,
  enableMidi,
  enableKeyboard,
  showInstructions,
  width,
  height,
  onKeyboardSizeChange,
  initialKeyboardLayout,
  showKeyboardSizeSelector = true,
}, ref) => {
  // Track whether audio has been started
  const [audioStarted, setAudioStarted] = useState(false);
  
  // Track settings panel visibility
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);

  // Refs for note timeouts
  const noteTimeoutsRef = useRef({});

  // Determine initial keyboard layout
  const initialLayoutId = initialKeyboardLayout || keyRangeToLayoutId(keyRange) || defaultLayoutId;

  // State for keyboard layout
  const [keyboardLayoutId, setKeyboardLayoutId] = useState(initialLayoutId);

  // State for the current key range based on the selected layout
  const [currentKeyRange, setCurrentKeyRange] = useState(() => {
    // If a direct keyRange prop is provided, use it as the initial value
    if (keyRange && keyRange.startNote && keyRange.endNote) {
      return keyRange;
    }
    // Otherwise use the layout's range
    const layout = getKeyboardLayout(initialLayoutId);
    return {
      startNote: layout.startNote,
      endNote: layout.endNote,
    };
  });

  // Track MIDI connection status
  const [midiStatus, setMidiStatus] = useState({
    connected: false,
    deviceName: null,
  });

  // Use our custom hooks
  const { activeNotes, highlightedNotes, activateNote, deactivateNote } = usePianoNotes();

  const {
    isLoaded,
    volume,
    isSustainActive,
    playNote,
    stopNote,
    startAudio,
    changeVolume,
    setSustain,
  } = useAudioEngine();

  // Handle note activation
  const handleNoteOn = useCallback(
    (note, source = 'program') => {
      activateNote(note, source);
      playNote(note);

      // Call external handler if provided
      if (onNoteOn) {
        onNoteOn(note, source);
      }
    },
    [activateNote, playNote, onNoteOn]
  );

  // Handle note deactivation
  const handleNoteOff = useCallback(
    (note, source = 'program') => {
      deactivateNote(note, source);

      // Only stop the sound if sustain is not active
      if (!isSustainActive) {
        stopNote(note);
      }

      // Call external handler if provided
      if (onNoteOff) {
        onNoteOff(note, source);
      }
    },
    [deactivateNote, stopNote, isSustainActive, onNoteOff]
  );

  // Handle audio starter button click
  const handleStartAudio = async () => {
    const success = await startAudio();
    if (success) {
      setAudioStarted(true);
    }
    return success;
  };

  /**
   * Plays multiple notes programmatically
   * @param {Array} midiNotes - Array of MIDI note numbers to play
   * @param {number} duration - Duration in milliseconds to hold the notes (default: 500ms)
   * @param {number} velocity - Velocity of the note (0-1, default: 0.7)
   */
  const playNotes = useCallback(
    createPlayNotesFunction({
      startAudio: handleStartAudio,
      handleNoteOn,
      handleNoteOff,
      audioStarted,
      noteTimeoutsRef,
    }),
    [handleNoteOn, handleNoteOff, audioStarted, handleStartAudio]
  );

  // Expose the playNotes method to parent components via ref
  useImperativeHandle(ref, () => ({
    playNotes,
    // Add any other methods you want to expose
  }), [playNotes]);

  // Setup keyboard input if enabled
  useKeyboardInput({
    onNoteOn: enableKeyboard ? handleNoteOn : null,
    onNoteOff: enableKeyboard ? handleNoteOff : null,
    enabled: enableKeyboard && audioStarted,
    onSustainChange: setSustain,
  });

  // Toggle sustain pedal
  const toggleSustain = () => {
    setSustain(!isSustainActive);
  };

  // Toggle settings panel
  const toggleSettingsPanel = () => {
    setShowSettingsPanel(prev => !prev);
  };

  // Handler for MIDI messages
  const handleMidiMessage = useCallback(
    message => {
      if (!audioStarted) return;

      // Handle different MIDI message types
      switch (message.type) {
        case 'noteon':
          // If velocity is 0, it's actually a note-off message
          if (message.velocity === 0) {
            handleNoteOff(message.note, 'midi');
          } else {
            handleNoteOn(message.note, 'midi');
          }
          break;

        case 'noteoff':
          handleNoteOff(message.note, 'midi');
          break;

        case 'controlchange':
          // Handle sustain pedal (CC #64)
          if (message.controller === 64) {
            setSustain(message.isOn);
          }
          break;

        default:
          // Ignore other message types
          break;
      }

      // Forward the MIDI message to parent if handler is provided
      if (onMidiMessage) {
        onMidiMessage(message);
      }
    },
    [audioStarted, handleNoteOn, handleNoteOff, setSustain, onMidiMessage]
  );

  // Handler for MIDI connection changes
  const handleMidiConnectionChange = useCallback(connection => {
    setMidiStatus({
      connected: connection.status === CONNECTION_STATUS.CONNECTED,
      deviceName: connection.device?.name || null,
    });
  }, []);

  // Handle keyboard layout/size change
  const handleKeyboardSizeChange = useCallback(
    layoutId => {
      const layout = getKeyboardLayout(layoutId);
      setKeyboardLayoutId(layoutId);

      // Update the key range based on the new layout
      const newKeyRange = {
        startNote: layout.startNote,
        endNote: layout.endNote,
      };

      setCurrentKeyRange(newKeyRange);

      // Notify parent component if callback is provided
      if (onKeyboardSizeChange) {
        onKeyboardSizeChange(layoutId, newKeyRange);
      }
    },
    [onKeyboardSizeChange]
  );

  return (
    <ThemeProvider theme={defaultTheme}>
      <PianoContainer>
        {!audioStarted ? (
          <ControlsContainer>
            <ControlButton onClick={handleStartAudio}>Start Audio</ControlButton>
          </ControlsContainer>
        ) : (
          <>
            {/* Mini status bar - always visible */}
            {showControls && (
              <MiniStatusDisplay>
                {isSustainActive && <span>Sustain: On</span>}
                {midiStatus.connected && <span>MIDI: {midiStatus.deviceName || 'Connected'}</span>}
                <SettingsButton onClick={toggleSettingsPanel}>
                  {showSettingsPanel ? 'Hide Settings' : 'Settings'}
                </SettingsButton>
              </MiniStatusDisplay>
            )}

            {/* Consolidated settings panel */}
            {showControls && showSettingsPanel && (
              <PianoSettings
                volume={volume}
                onVolumeChange={changeVolume}
                isSustainActive={isSustainActive}
                onSustainToggle={toggleSustain}
                keyboardLayoutId={keyboardLayoutId}
                onKeyboardSizeChange={handleKeyboardSizeChange}
                showKeyboardSizeSelector={showKeyboardSizeSelector}
                enableMidi={enableMidi}
                onMidiMessage={handleMidiMessage}
                onMidiConnectionChange={handleMidiConnectionChange}
                showInstructions={showInstructions}
              />
            )}

            <Keyboard
              activeNotes={activeNotes}
              highlightedNotes={highlightedNotes}
              onNoteOn={note => handleNoteOn(note, 'mouse')}
              onNoteOff={note => handleNoteOff(note, 'mouse')}
              keyRange={currentKeyRange}
              showKeyboardShortcuts={enableKeyboard}
              keyboardMapping={defaultKeyboardMapping}
              sustainEnabled={isSustainActive}
              width={width}
              height={height}
            />
          </>
        )}
      </PianoContainer>
    </ThemeProvider>
  );
});

Piano.propTypes = {
  /** Range of keys to display */
  keyRange: PropTypes.shape({
    startNote: PropTypes.string,
    endNote: PropTypes.string,
  }),
  /** Called when a note is activated */
  onNoteOn: PropTypes.func,
  /** Called when a note is deactivated */
  onNoteOff: PropTypes.func,
  /** Called when a MIDI message is received */
  onMidiMessage: PropTypes.func,
  /** Whether to show piano controls */
  showControls: PropTypes.bool,
  /** Whether to enable MIDI input */
  enableMidi: PropTypes.bool,
  /** Whether to enable computer keyboard input */
  enableKeyboard: PropTypes.bool,
  /** Whether to show instructions */
  showInstructions: PropTypes.bool,
  /** Explicit width for the piano */
  width: PropTypes.number,
  /** Explicit height for the piano */
  height: PropTypes.number,
  /** Called when keyboard size/layout changes */
  onKeyboardSizeChange: PropTypes.func,
  /** Initial keyboard layout ID */
  initialKeyboardLayout: PropTypes.string,
  /** Whether to show the keyboard size selector */
  showKeyboardSizeSelector: PropTypes.bool,
};

Piano.defaultProps = {
  keyRange: { startNote: 'C3', endNote: 'B5' }, // Three octaves by default
  onNoteOn: null,
  onNoteOff: null,
  onMidiMessage: null,
  showControls: true,
  enableMidi: false,
  enableKeyboard: true,
  showInstructions: true,
  width: null,
  height: null,
  onKeyboardSizeChange: null,
  initialKeyboardLayout: null,
  showKeyboardSizeSelector: true,
};

export default Piano;