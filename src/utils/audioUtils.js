// src/utils/audioUtils.js

/**
 * Frequency mapping for all piano notes
 * Maps note names to their frequencies in Hz according to A4 = 440Hz tuning
 */
export const noteFrequencies = {
  C0: 16.35,
  'C#0': 17.32,
  D0: 18.35,
  'D#0': 19.45,
  E0: 20.6,
  F0: 21.83,
  'F#0': 23.12,
  G0: 24.5,
  'G#0': 25.96,
  A0: 27.5,
  'A#0': 29.14,
  B0: 30.87,
  C1: 32.7,
  'C#1': 34.65,
  D1: 36.71,
  'D#1': 38.89,
  E1: 41.2,
  F1: 43.65,
  'F#1': 46.25,
  G1: 49.0,
  'G#1': 51.91,
  A1: 55.0,
  'A#1': 58.27,
  B1: 61.74,
  C2: 65.41,
  'C#2': 69.3,
  D2: 73.42,
  'D#2': 77.78,
  E2: 82.41,
  F2: 87.31,
  'F#2': 92.5,
  G2: 98.0,
  'G#2': 103.83,
  A2: 110.0,
  'A#2': 116.54,
  B2: 123.47,
  C3: 130.81,
  'C#3': 138.59,
  D3: 146.83,
  'D#3': 155.56,
  E3: 164.81,
  F3: 174.61,
  'F#3': 185.0,
  G3: 196.0,
  'G#3': 207.65,
  A3: 220.0,
  'A#3': 233.08,
  B3: 246.94,
  C4: 261.63, // Middle C
  'C#4': 277.18,
  D4: 293.66,
  'D#4': 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.0,
  'G#4': 415.3,
  A4: 440.0, // Concert pitch A
  'A#4': 466.16,
  B4: 493.88,
  C5: 523.25,
  'C#5': 554.37,
  D5: 587.33,
  'D#5': 622.25,
  E5: 659.25,
  F5: 698.46,
  'F#5': 739.99,
  G5: 783.99,
  'G#5': 830.61,
  A5: 880.0,
  'A#5': 932.33,
  B5: 987.77,
  C6: 1046.5,
  'C#6': 1108.73,
  D6: 1174.66,
  'D#6': 1244.51,
  E6: 1318.51,
  F6: 1396.91,
  'F#6': 1479.98,
  G6: 1567.98,
  'G#6': 1661.22,
  A6: 1760.0,
  'A#6': 1864.66,
  B6: 1975.53,
  C7: 2093.0,
  'C#7': 2217.46,
  D7: 2349.32,
  'D#7': 2489.02,
  E7: 2637.02,
  F7: 2793.83,
  'F#7': 2959.96,
  G7: 3135.96,
  'G#7': 3322.44,
  A7: 3520.0,
  'A#7': 3729.31,
  B7: 3951.07,
  C8: 4186.01,
};

/**
 * Get the frequency of a note
 * @param {string} note - The note name (e.g., "C4")
 * @returns {number} Frequency in Hz
 */
export const getNoteFrequency = note => {
  return noteFrequencies[note] || 0;
};

/**
 * Convert a MIDI note number to frequency
 * @param {number} midiNumber - MIDI note number (0-127)
 * @returns {number} Frequency in Hz
 */
export const midiToFrequency = midiNumber => {
  return 440 * Math.pow(2, (midiNumber - 69) / 12);
};

/**
 * Convert a frequency to the closest MIDI note number
 * @param {number} frequency - Frequency in Hz
 * @returns {number} Closest MIDI note number
 */
export const frequencyToMidi = frequency => {
  return Math.round(12 * Math.log2(frequency / 440) + 69);
};

/**
 * Check if Web Audio API is supported in the current browser
 * @returns {boolean} Whether Web Audio is supported
 */
export const isWebAudioSupported = () => {
  return typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined';
};

/**
 * Calculate decibels from a linear amplitude value
 * @param {number} amplitude - Linear amplitude (0-1)
 * @returns {number} Decibel value
 */
export const amplitudeToDb = amplitude => {
  return 20 * Math.log10(amplitude);
};

/**
 * Calculate linear amplitude from decibels
 * @param {number} db - Decibel value
 * @returns {number} Linear amplitude (0-1)
 */
export const dbToAmplitude = db => {
  return Math.pow(10, db / 20);
};

/**
 * Convert cents to frequency ratio
 * @param {number} cents - Number of cents
 * @returns {number} Frequency ratio
 */
export const centsToRatio = cents => {
  return Math.pow(2, cents / 1200);
};

/**
 * Check if browser supports the Web MIDI API
 * @returns {boolean} Whether Web MIDI is supported
 */
export const isMidiSupported = () => {
  return navigator.requestMIDIAccess !== undefined;
};
