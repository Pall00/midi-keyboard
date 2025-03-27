// src/context/PianoContext.jsx
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import useAudioEngine from '../hooks/useAudioEngine';
import usePianoNotes from '../hooks/usePianoNotes';
import useMidiConnectionManager from '../hooks/useMidiConnectionManager';
import { defaultTheme } from '../styles/theme';
import { midiNoteToNoteName, createPlayNotesFunction } from '../utils/midiNotePlayer';

// Create context
const PianoContext = createContext();

/**
 * Custom hook to access the piano context
 * @returns {Object} Piano context values and methods
 */
export const usePianoContext = () => {
  const context = useContext(PianoContext);
  if (!context) {
    throw new Error('usePianoContext must be used within a PianoProvider');
  }
  return context;
};

/**
 * PianoProvider Component
 *
 * Centralizes piano state management by combining multiple hooks
 * and providing their values and methods through context.
 */
export const PianoProvider = ({ children, initialSettings = {} }) => {
  // Track whether audio context has been started
  const [audioStarted, setAudioStarted] = useState(false);

  // Ref to track note timeouts
  const noteTimeoutsRef = useRef({});

  // Settings state for the piano
  const [settings, setSettings] = useState({
    showKeyLabels: true,
    showKeyboardShortcuts: true,
    keyRange: { startNote: 'C3', endNote: 'B5' },
    ...initialSettings,
  });

  // Use fixed theme
  const theme = defaultTheme;

  // Use piano notes hook for state management
  const pianoNotes = usePianoNotes();

  // Use audio engine hook for sound synthesis
  const audioEngine = useAudioEngine({
    initialVolume: initialSettings.volume || -10,
    initialReverb: initialSettings.reverb || 0.2,
  });

  // Handle MIDI message events
  const handleMidiMessage = useCallback(
    event => {
      if (!audioStarted) return;

      if (event.type === 'noteon') {
        pianoNotes.activateNote(event.note, 'midi');
        audioEngine.playNote(event.note, event.velocity);
      } else if (event.type === 'noteoff') {
        pianoNotes.deactivateNote(event.note, 'midi');
        if (!audioEngine.isSustainActive) {
          audioEngine.stopNote(event.note);
        }
      } else if (event.type === 'controlchange' && event.control === 'sustain') {
        audioEngine.setSustain(event.isOn);
      }
    },
    [audioStarted, pianoNotes, audioEngine]
  );

  // Use MIDI connection manager hook (updated from old useMidiConnection)
  const midiConnection = useMidiConnectionManager({
    onMidiMessage: handleMidiMessage,
    autoConnect: initialSettings.autoConnectMidi || true,
    debug: initialSettings.midiDebug || false,
  });

  // Handle note activation from any source
  const handleNoteOn = useCallback(
    (note, source = 'user') => {
      if (!audioStarted) return;

      pianoNotes.activateNote(note, source);
      audioEngine.playNote(note);
    },
    [audioStarted, pianoNotes, audioEngine]
  );

  // Handle note deactivation from any source
  const handleNoteOff = useCallback(
    (note, source = 'user') => {
      if (!audioStarted) return;

      pianoNotes.deactivateNote(note, source);

      if (!audioEngine.isSustainActive) {
        audioEngine.stopNote(note);
      }
    },
    [audioStarted, pianoNotes, audioEngine]
  );

  // Start the audio context (must be called after user interaction)
  const startAudio = useCallback(async () => {
    const success = await audioEngine.startAudio();
    if (success) {
      setAudioStarted(true);
    }
    return success;
  }, [audioEngine]);

  // Update a setting
  const updateSetting = useCallback((key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple settings at once
  const updateSettings = useCallback(newSettings => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Create the playNotes function using our utility
  const playNotes = useCallback(
    createPlayNotesFunction({
      startAudio,
      handleNoteOn,
      handleNoteOff,
      audioStarted,
      noteTimeoutsRef,
    }), 
    [startAudio, handleNoteOn, handleNoteOff, audioStarted]
  );

  // Combined context value
  const contextValue = {
    // State
    audioStarted,
    settings,
    theme,

    // From pianoNotes hook
    activeNotes: pianoNotes.activeNotes,
    highlightedNotes: pianoNotes.highlightedNotes,

    // From audioEngine hook
    isAudioLoaded: audioEngine.isLoaded,
    volume: audioEngine.volume,
    reverb: audioEngine.reverb,
    isSustainActive: audioEngine.isSustainActive,

    // From midiConnection hook
    midiEnabled: midiConnection.connectionStatus !== 'unavailable',
    midiInputs: midiConnection.inputs,
    selectedMidiInput: midiConnection.selectedInput,
    midiConnectionStatus: midiConnection.connectionStatus,
    midiError: midiConnection.errorInfo,
    midiDebugInfo: midiConnection.debugInfo,

    // Methods
    startAudio,
    handleNoteOn,
    handleNoteOff,
    highlightNote: pianoNotes.highlightNote,
    unhighlightNote: pianoNotes.unhighlightNote,
    clearHighlights: pianoNotes.clearHighlights,
    setSustain: audioEngine.setSustain,
    changeVolume: audioEngine.changeVolume,
    changeReverb: audioEngine.changeReverb,
    
    // New programmatic note playing method
    playNotes,
    midiNoteToNoteName,

    // MIDI methods (updated property names to match new hook)
    connectMidiDevice: midiConnection.connectToDevice,
    disconnectMidiDevice: midiConnection.disconnect,
    refreshMidiDevices: midiConnection.refreshDevices,
    retryMidiConnection: midiConnection.retryConnection,
    clearMidiDebug: midiConnection.clearDebugInfo,

    updateSetting,
    updateSettings,
  };

  return <PianoContext.Provider value={contextValue}>{children}</PianoContext.Provider>;
};

PianoProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialSettings: PropTypes.object,
};

export default PianoContext;