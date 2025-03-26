// src/utils/NoteRecognitionModule.js
import { getMidiNoteNumber, getMidiNoteName } from './midiUtils';

/**
 * Note Recognition Module
 * 
 * A standalone module for handling note recognition logic independent of UI components.
 * This makes it easier to use just the recognition part in another application.
 */

/**
 * Compares a played note with an expected note
 * @param {string|number} playedNote - The note that was played (MIDI number or note name)
 * @param {string|number} expectedNote - The note that was expected (MIDI number or note name)
 * @returns {boolean} True if the notes match
 */
export const notesMatch = (playedNote, expectedNote) => {
  const playedNoteNum = typeof playedNote === 'string' 
    ? getMidiNoteNumber(playedNote) 
    : playedNote;
    
  const expectedNoteNum = typeof expectedNote === 'string'
    ? getMidiNoteNumber(expectedNote)
    : expectedNote;
    
  return playedNoteNum === expectedNoteNum;
};

/**
 * Checks if a note is part of an array of expected notes
 * @param {string|number} playedNote - The note that was played
 * @param {Array<string|number>} expectedNotes - Array of expected notes
 * @returns {boolean} True if the played note is in the expected notes array
 */
export const noteInExpectedSet = (playedNote, expectedNotes) => {
  const playedNoteNum = typeof playedNote === 'string' 
    ? getMidiNoteNumber(playedNote) 
    : playedNote;
    
  const expectedNoteNums = expectedNotes.map(note => 
    typeof note === 'string' ? getMidiNoteNumber(note) : note
  );
  
  return expectedNoteNums.includes(playedNoteNum);
};

/**
 * Recognizes a chord from an array of notes
 * @param {Array<string|number>} notes - Array of notes (can be MIDI numbers or note names)
 * @returns {string|null} Recognized chord name or null if not recognized
 */
export const recognizeChord = (notes) => {
  // Convert all notes to MIDI numbers for easier comparison
  const midiNotes = notes.map(note => 
    typeof note === 'string' ? getMidiNoteNumber(note) : note
  ).sort((a, b) => a - b);
  
  if (midiNotes.length < 2) return null;
  
  // Extract the root note (lowest note)
  const rootNote = getMidiNoteName(midiNotes[0]);
  
  // Calculate intervals from the root
  const intervals = midiNotes.slice(1).map(note => note - midiNotes[0]);
  
  // Common chord patterns (intervals from root)
  const chordPatterns = {
    // Major chords
    '4,7': 'major',
    '4,7,12': 'major',
    
    // Minor chords
    '3,7': 'minor',
    '3,7,12': 'minor',
    
    // Diminished chords
    '3,6': 'diminished',
    '3,6,9': 'diminished',
    
    // Augmented chords
    '4,8': 'augmented',
    
    // Seventh chords
    '4,7,10': 'dominant 7th',
    '4,7,11': 'major 7th',
    '3,7,10': 'minor 7th',
    '3,6,10': 'half-diminished 7th',
    '3,6,9': 'diminished 7th',
    
    // Suspended chords
    '5,7': 'sus4',
    '2,7': 'sus2'
  };
  
  const intervalStr = intervals.join(',');
  const chordType = chordPatterns[intervalStr];
  
  return chordType ? `${rootNote} ${chordType}` : null;
};

/**
 * Creates a note matching listener that will call a callback when played notes match expected notes
 * @param {Function} onMatch - Callback function called when notes match
 * @param {Function} onMismatch - Callback function called when notes don't match
 * @returns {Function} A function that can be used as a MIDI message handler
 */
export const createNoteMatchingListener = (onMatch, onMismatch) => {
  let currentExpectedNotes = [];
  
  // Set the expected notes
  const setExpectedNotes = (notes) => {
    currentExpectedNotes = notes.map(note => 
      typeof note === 'string' ? getMidiNoteNumber(note) : note
    );
  };
  
  // The MIDI message handler
  const handleMidiMessage = (message) => {
    if (message.type === 'noteon' && message.velocity > 0) {
      const noteNum = message.rawNote.number;
      
      if (noteInExpectedSet(noteNum, currentExpectedNotes)) {
        if (onMatch) onMatch(message.note, noteNum);
      } else {
        if (onMismatch) onMismatch(message.note, noteNum);
      }
    }
  };
  
  return {
    handleMidiMessage,
    setExpectedNotes
  };
};

/**
 * Track timing information for played notes
 * @returns {Object} Object with methods for timing analysis
 */
export const createTimingAnalyzer = () => {
  const noteTimings = {};
  let metronomeTempo = 60; // BPM
  let beatDuration = 60000 / metronomeTempo; // ms per beat
  
  const setTempo = (bpm) => {
    metronomeTempo = bpm;
    beatDuration = 60000 / bpm;
  };
  
  const handleMidiMessage = (message) => {
    const { type, note, timestamp } = message;
    const noteNum = typeof note === 'string' ? getMidiNoteNumber(note) : note;
    
    if (type === 'noteon' && message.velocity > 0) {
      // Note started
      noteTimings[noteNum] = {
        startTime: timestamp,
        endTime: null,
        duration: null
      };
    } 
    else if ((type === 'noteoff' || (type === 'noteon' && message.velocity === 0)) 
              && noteTimings[noteNum]?.startTime) {
      // Note ended
      noteTimings[noteNum].endTime = timestamp;
      noteTimings[noteNum].duration = timestamp - noteTimings[noteNum].startTime;
    }
  };
  
  const getNoteTimings = () => {
    return { ...noteTimings };
  };
  
  const analyzeTiming = (expectedDuration) => {
    const results = {};
    
    Object.keys(noteTimings).forEach(noteNum => {
      const timing = noteTimings[noteNum];
      if (timing.duration === null) return;
      
      // Calculate how close the duration is to the expected duration
      const durationRatio = timing.duration / expectedDuration;
      const accuracy = 1 - Math.min(Math.abs(1 - durationRatio), 1);
      
      results[noteNum] = {
        expected: expectedDuration,
        actual: timing.duration,
        accuracy: Math.round(accuracy * 100),
        isTooLong: durationRatio > 1.2,
        isTooShort: durationRatio < 0.8
      };
    });
    
    return results;
  };
  
  const analyzeRhythm = () => {
    // Analyze based on current tempo
    return analyzeTiming(beatDuration);
  };
  
  const clear = () => {
    Object.keys(noteTimings).forEach(key => {
      delete noteTimings[key];
    });
  };
  
  return {
    handleMidiMessage,
    getNoteTimings,
    setTempo,
    analyzeTiming,
    analyzeRhythm,
    clear
  };
};

export default {
  notesMatch,
  noteInExpectedSet,
  recognizeChord,
  createNoteMatchingListener,
  createTimingAnalyzer
};