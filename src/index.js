// src/index.js - Main exports for the react-piano-keyboard library

// Components
export { default as Piano } from './components/Piano';
export { default as Keyboard } from './components/Keyboard';
export { default as Key } from './components/Key';
export { default as KeyboardControls } from './components/KeyboardControls';
export { default as KeyboardSizeSelector } from './components/KeyboardSizeSelector';

// New MIDI Components
export { default as MidiManager } from './components/MidiManager';
export { default as MidiDeviceSelector } from './components/MidiDeviceSelector';
export { default as MidiConnectionStatus } from './components/MidiConnectionStatus';

// Context
export { default as PianoContext, PianoProvider, usePianoContext } from './context/PianoContext';

// Hooks
export { default as useAudioEngine } from './hooks/useAudioEngine';
export { default as useKeyboardInput } from './hooks/useKeyboardInput';
export { default as usePianoNotes } from './hooks/usePianoNotes';
export { default as useMidiConnectionManager, CONNECTION_STATUS } from './hooks/useMidiConnectionManager';

// Utilities
export {
  defaultKeyboardMapping,
  createKeyboardMapping,
  getNoteFromKey,
  getKeyFromNote,
} from './utils/keyboardMapping';

export {
  formatMidiNote,
  getNoteNameWithoutOctave,
  formatNoteForDisplay,
  getMidiNoteNumber,
  getMidiNoteName,
  getMIDIErrorCode,
} from './utils/midiUtils';

export {
  getNoteFrequency,
  midiToFrequency,
  frequencyToMidi,
  isWebAudioSupported,
  isMidiSupported,
  amplitudeToDb,
  dbToAmplitude,
} from './utils/audioUtils';

// MIDI Storage Utilities
export {
  saveMidiDevicePreference,
  getLastMidiDevice,
  saveMidiConnectionHistory,
  getMidiConnectionHistory,
  saveMidiPreferences,
  getMidiPreferences,
  clearMidiStorage,
} from './utils/midiStorageManager';

// Styles
export { defaultTheme, createTheme } from './styles/theme';
export { default as GlobalStyles } from './styles/GlobalStyles';