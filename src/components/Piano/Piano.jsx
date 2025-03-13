// src/components/Piano/Piano.jsx
import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';

import Keyboard from '../Keyboard';
import MidiManager from '../MidiManager';
import KeyboardSizeSelector from '../KeyboardSizeSelector';
import ThemeSelector from '../ThemeSelector';
import { defaultTheme, createTheme } from '../../styles/theme';
import { defaultKeyboardMapping } from '../../utils/keyboardMapping';
import {
  defaultLayoutId,
  getKeyboardLayout,
  keyRangeToLayoutId,
} from '../../utils/keyboardLayouts';
import useAudioEngine from '../../hooks/useAudioEngine';
import useKeyboardInput from '../../hooks/useKeyboardInput';
import usePianoNotes from '../../hooks/usePianoNotes';
import { CONNECTION_STATUS } from '../../hooks/useMidiConnectionManager';
import { pianoThemes } from '../../themes';

import {
  PianoContainer,
  ControlsContainer,
  ControlGroup,
  ControlLabel,
  ControlButton,
  SustainPedal,
  VolumeSlider,
  InstructionsText,
  MidiSection,
  AdvancedControlsContainer,
  AdvancedControlsToggle,
  AdvancedControlsContent,
} from './Piano.styles';

/**
 * Piano Component
 *
 * Main component that integrates the keyboard, audio engine, and input handlers.
 * Now includes MIDI support, keyboard size selection, and theme selection.
 */
const Piano = ({
  keyRange,
  onNoteOn,
  onNoteOff,
  onMidiMessage,
  showControls,
  enableMidi,
  enableKeyboard,
  showInstructions,
  customTheme,
  width,
  height,
  onKeyboardSizeChange,
  initialKeyboardLayout,
  showKeyboardSizeSelector = true,
  initialTheme = 'default',
  onThemeChange,
}) => {
  // Track whether audio has been started
  const [audioStarted, setAudioStarted] = useState(false);

  // State for theme
  const [currentTheme, setCurrentTheme] = useState(
    customTheme || (initialTheme && pianoThemes[initialTheme]?.theme) || defaultTheme
  );

  // Debug: Log the initial theme
  useEffect(() => {
    console.log('Piano initial theme:', initialTheme);
    console.log('Piano component theme state set to:', {
      themeId: initialTheme,
      themeColors: currentTheme.colors,
    });
  }, [initialTheme, currentTheme]);

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

  // State for advanced controls visibility
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

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

  // Setup keyboard input if enabled
  useKeyboardInput({
    onNoteOn: enableKeyboard ? handleNoteOn : null,
    onNoteOff: enableKeyboard ? handleNoteOff : null,
    enabled: enableKeyboard && audioStarted,
    onSustainChange: setSustain,
  });

  // Handle audio starter button click
  const handleStartAudio = async () => {
    const success = await startAudio();
    if (success) {
      setAudioStarted(true);
    }
  };

  // Toggle sustain pedal
  const toggleSustain = () => {
    setSustain(!isSustainActive);
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

  // Handle theme change
  const handleThemeChange = useCallback(
    (newTheme, themeId) => {
      console.log('Theme changed to:', themeId);
      if (newTheme && newTheme.colors) {
        console.log('Theme colors:', {
          whiteKey: newTheme.colors.whiteKey,
          blackKey: newTheme.colors.blackKey,
          activeWhiteKey: newTheme.colors.activeWhiteKey,
          activeBlackKey: newTheme.colors.activeBlackKey,
        });
      } else {
        console.warn('Invalid theme object received:', newTheme);
      }

      setCurrentTheme(newTheme);

      // Call external handler if provided
      if (onThemeChange) {
        onThemeChange(newTheme, themeId);
      }
    },
    [onThemeChange]
  );

  return (
    <ThemeProvider theme={currentTheme}>
      <PianoContainer>
        {!audioStarted ? (
          <ControlsContainer>
            <ControlButton onClick={handleStartAudio}>Start Audio</ControlButton>
          </ControlsContainer>
        ) : (
          <>
            {showControls && (
              <ControlsContainer>
                <ControlGroup>
                  <ControlLabel>Volume</ControlLabel>
                  <VolumeSlider
                    min="-40"
                    max="0"
                    step="1"
                    value={volume}
                    onChange={e => changeVolume(parseFloat(e.target.value))}
                  />
                </ControlGroup>

                <ControlGroup>
                  <ControlLabel>Sustain</ControlLabel>
                  <SustainPedal $active={isSustainActive} onClick={toggleSustain}>
                    {isSustainActive ? 'On' : 'Off'}
                  </SustainPedal>
                </ControlGroup>

                {/* Keyboard Size Selector */}
                {showKeyboardSizeSelector && (
                  <ControlGroup>
                    <KeyboardSizeSelector
                      selectedLayout={keyboardLayoutId}
                      onChange={handleKeyboardSizeChange}
                      displayMode="dropdown"
                      showInfo={false}
                    />
                  </ControlGroup>
                )}

                {/* Theme Selector */}
                <ControlGroup>
                  <ThemeSelector
                    onThemeChange={handleThemeChange}
                    initialTheme={initialTheme}
                    displayMode="dropdown"
                  />
                </ControlGroup>

                <AdvancedControlsToggle
                  onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                >
                  {showAdvancedControls ? 'Hide Advanced Options' : 'Show Advanced Options'}
                </AdvancedControlsToggle>
              </ControlsContainer>
            )}

            {showControls && showAdvancedControls && (
              <AdvancedControlsContainer $expanded={showAdvancedControls}>
                <AdvancedControlsContent>
                  {showKeyboardSizeSelector && (
                    <KeyboardSizeSelector
                      selectedLayout={keyboardLayoutId}
                      onChange={handleKeyboardSizeChange}
                      displayMode="buttons"
                      showInfo={true}
                    />
                  )}

                  {/* Theme selector grid in advanced controls */}
                  <ThemeSelector
                    onThemeChange={handleThemeChange}
                    initialTheme={initialTheme}
                    displayMode="grid"
                  />
                </AdvancedControlsContent>
              </AdvancedControlsContainer>
            )}

            {/* MIDI Manager Section */}
            {enableMidi && (
              <MidiSection>
                <MidiManager
                  onMidiMessage={handleMidiMessage}
                  onConnectionChange={handleMidiConnectionChange}
                  compact={true}
                  autoConnect={false}
                  initialExpanded={true}
                />
              </MidiSection>
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
              customTheme={currentTheme} // Pass the current theme here
              width={width}
              height={height}
            />

            {showInstructions && (
              <InstructionsText>
                {enableKeyboard &&
                  'Use your computer keyboard to play. A-L keys for white notes, W-P keys for black notes. Press SPACE to toggle sustain pedal.'}
                {enableMidi && enableKeyboard && <br />}
                {enableMidi && 'Connect a MIDI device using the MIDI Device controls above.'}
              </InstructionsText>
            )}
          </>
        )}
      </PianoContainer>
    </ThemeProvider>
  );
};

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
  /** Custom theme overrides */
  customTheme: PropTypes.object,
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
  /** Initial theme ID */
  initialTheme: PropTypes.string,
  /** Called when theme changes */
  onThemeChange: PropTypes.func,
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
  customTheme: null,
  width: null,
  height: null,
  onKeyboardSizeChange: null,
  initialKeyboardLayout: null,
  showKeyboardSizeSelector: true,
  initialTheme: 'default',
  onThemeChange: null,
};

export default Piano;
