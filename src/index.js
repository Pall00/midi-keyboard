// src/index.js - Main exports for the react-piano-keyboard library

// Components
export { default as Piano } from './components/Piano';
export { default as Keyboard } from './components/Keyboard';
export { default as Key } from './components/Key';
export { default as KeyboardControls } from './components/KeyboardControls';
export { default as KeyboardSizeSelector } from './components/KeyboardSizeSelector';

// MIDI Components 
// ---- UPDATED ----
// Now exporting the new integrated MidiPanel instead of separate components
export { default as MidiPanel } from './components/MidiPanel';


// Context
export { default as PianoContext, PianoProvider, usePianoContext } from './context/PianoContext';

// Hooks
export { default as useAudioEngine } from './hooks/useAudioEngine';
export { default as useKeyboardInput } from './hooks/useKeyboardInput';
export { default as usePianoNotes } from './hooks/usePianoNotes';
export {
  default as useMidiConnectionManager,
  CONNECTION_STATUS,
} from './hooks/useMidiConnectionManager';

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

// MIDI Note Player Utilities
export {
  midiNoteToNoteName,
  createPlayNotesFunction,
} from './utils/midiNotePlayer';

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

// Basic styles - only export the default theme and global styles
export { default as defaultTheme } from './styles/theme';
export { default as GlobalStyles } from './styles/GlobalStyles';

// Music Recognition Utilities
export {
  notesMatch,
  noteInExpectedSet,
  recognizeChord,
  createNoteMatchingListener,
  createTimingAnalyzer
} from './utils/NoteRecognitionModule';

// MusicXML Utilities
export {
  musicXmlToNoteName,
  musicXmlToMidiNote,
  extractNotesFromMusicXML,
  extractMeasuresFromMusicXML,
  convertXmlTimingToMs,
  compareMidiWithExpected,
  createSimpleMusicXML
} from './utils/MusicXMLUtils';

// MIDI Recorder Utility
export { createMidiRecorder } from './utils/MidiRecorder';