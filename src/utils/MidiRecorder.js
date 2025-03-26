// src/utils/MidiRecorder.js
import { getMidiNoteName, getMidiNoteNumber } from './midiUtils';

/**
 * MIDI Recorder Utility
 * 
 * Provides functionality to record, play back, and export MIDI events.
 * This is useful for creating practice tools, recording user performances,
 * and comparing played notes with reference material.
 */

/**
 * Creates a MIDI recorder instance
 * @returns {Object} MIDI recorder with methods for recording, playback, and export
 */
export const createMidiRecorder = () => {
  // State
  let events = [];
  let isRecording = false;
  let startTime = null;
  let stopTime = null;
  
  /**
   * Start recording MIDI events
   */
  const startRecording = () => {
    events = [];
    isRecording = true;
    startTime = Date.now();
    stopTime = null;
  };
  
  /**
   * Stop recording MIDI events
   */
  const stopRecording = () => {
    isRecording = false;
    stopTime = Date.now();
  };
  
  /**
   * Process a MIDI message and add it to the recording if recording is active
   * @param {Object} message - MIDI message object
   */
  const processMidiMessage = (message) => {
    if (!isRecording) return;
    
    // Calculate relative time from recording start
    const relativeTime = Date.now() - startTime;
    
    // Store the event with relative timing
    events.push({
      ...message,
      recordTime: relativeTime
    });
  };
  
  /**
   * Get the recorded events
   * @returns {Array} Array of recorded MIDI events
   */
  const getRecording = () => {
    return [...events];
  };
  
  /**
   * Play back the recording using the provided note player functions
   * @param {Function} noteOnFunction - Function to call for note-on events
   * @param {Function} noteOffFunction - Function to call for note-off events
   * @param {Function} onFinish - Callback when playback is complete
   * @returns {Object} Control object with stop method
   */
  const playRecording = (noteOnFunction, noteOffFunction, onFinish = null) => {
    if (events.length === 0) {
      if (onFinish) onFinish();
      return { stop: () => {} };
    }
    
    const timeouts = [];
    let isStopped = false;
    
    // Schedule each event with setTimeout
    events.forEach(event => {
      if (event.type === 'noteon' && event.velocity > 0) {
        const timeout = setTimeout(() => {
          if (!isStopped && noteOnFunction) {
            noteOnFunction(event.note, event.velocity);
          }
        }, event.recordTime);
        timeouts.push(timeout);
      } 
      else if (event.type === 'noteoff' || (event.type === 'noteon' && event.velocity === 0)) {
        const timeout = setTimeout(() => {
          if (!isStopped && noteOffFunction) {
            noteOffFunction(event.note);
          }
        }, event.recordTime);
        timeouts.push(timeout);
      }
    });
    
    // Set timeout for completion
    const endTime = events.length > 0 
      ? Math.max(...events.map(event => event.recordTime))
      : 0;
      
    const completionTimeout = setTimeout(() => {
      if (!isStopped && onFinish) {
        onFinish();
      }
    }, endTime + 100); // Add a small buffer
    
    timeouts.push(completionTimeout);
    
    // Return control object
    return {
      stop: () => {
        isStopped = true;
        timeouts.forEach(timeout => clearTimeout(timeout));
      }
    };
  };
  
  /**
   * Export the recording to MIDI file format data
   * @returns {Uint8Array} MIDI file data
   */
  const exportToMIDI = () => {
    // This is a simplified MIDI file creation
    // For a complete implementation, consider using a library like midi-writer-js
    
    // Create a simple MIDI file with one track
    const headerChunk = new Uint8Array([
      0x4D, 0x54, 0x68, 0x64, // MThd
      0x00, 0x00, 0x00, 0x06, // Chunk size (always 6)
      0x00, 0x01, // Format type (1 = multiple tracks)
      0x00, 0x02, // Number of tracks (2 - one for tempo, one for notes)
      0x01, 0xE0  // Division (480 ticks per quarter note)
    ]);
    
    // Track 1 - Tempo track
    const track1Events = new Uint8Array([
      // Track header
      0x4D, 0x54, 0x72, 0x6B, // MTrk
      0x00, 0x00, 0x00, 0x14, // Chunk size (20 bytes)
      
      // Set tempo (120 BPM = 500,000 microseconds per quarter note)
      0x00, 0xFF, 0x51, 0x03, // Delta time, meta event, tempo, length
      0x07, 0xA1, 0x20,       // Tempo value
      
      // End of track
      0x00, 0xFF, 0x2F, 0x00  // Delta time, meta event, end of track, length
    ]);
    
    // Create track 2 events (note events)
    let track2EventArray = [];
    
    // Convert our events to MIDI file events
    if (events.length > 0) {
      // Sort events by time
      const sortedEvents = [...events].sort((a, b) => a.recordTime - b.recordTime);
      
      // Previous event time for delta calculation
      let prevTime = 0;
      
      sortedEvents.forEach(event => {
        // Calculate delta time (in MIDI ticks)
        const eventTimeInTicks = Math.round(event.recordTime * 480 / 500); // Convert ms to ticks
        const delta = eventTimeInTicks - prevTime;
        prevTime = eventTimeInTicks;
        
        // Variable-length encoding for delta time
        const deltaBytes = encodeVariableLength(delta);
        track2EventArray.push(...deltaBytes);
        
        if (event.type === 'noteon' && event.velocity > 0) {
          // Note On event
          const noteNum = getMidiNoteNumber(event.note);
          track2EventArray.push(
            0x90, // Note On, channel 1
            noteNum, // Note number
            Math.round(event.velocity * 127) // Velocity (0-127)
          );
        } 
        else if (event.type === 'noteoff' || (event.type === 'noteon' && event.velocity === 0)) {
          // Note Off event
          const noteNum = getMidiNoteNumber(event.note);
          track2EventArray.push(
            0x80, // Note Off, channel 1
            noteNum, // Note number
            0x40  // Release velocity (default 64)
          );
        }
      });
    }
    
    // Add End of Track event
    track2EventArray.push(0x00, 0xFF, 0x2F, 0x00);
    
    // Create track 2 with proper header
    const track2Events = new Uint8Array([
      // Track header
      0x4D, 0x54, 0x72, 0x6B, // MTrk
      // Chunk size (4 bytes)
      ...(encodeInt32(track2EventArray.length)),
      // Track events
      ...track2EventArray
    ]);
    
    // Combine all chunks
    const midiFile = new Uint8Array([
      ...headerChunk,
      ...track1Events,
      ...track2Events
    ]);
    
    return midiFile;
  };
  
  /**
   * Export the recording to a JSON format
   * @returns {string} JSON string of the recording
   */
  const exportToJSON = () => {
    const recordingData = {
      startTime,
      stopTime,
      duration: stopTime ? stopTime - startTime : null,
      events: events.map(event => ({
        type: event.type,
        note: event.note,
        velocity: event.velocity,
        time: event.recordTime
      }))
    };
    
    return JSON.stringify(recordingData, null, 2);
  };
  
  /**
   * Import recording from a JSON string
   * @param {string} jsonString - JSON string from exportToJSON
   * @returns {boolean} Success indicator
   */
  const importFromJSON = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      
      if (!data.events || !Array.isArray(data.events)) {
        return false;
      }
      
      startTime = data.startTime || Date.now();
      stopTime = data.stopTime || null;
      events = data.events.map(event => ({
        type: event.type,
        note: event.note,
        velocity: event.velocity,
        recordTime: event.time,
        // Reconstruct raw notes
        rawNote: {
          number: getMidiNoteNumber(event.note)
        },
        timestamp: startTime + event.time
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to import recording:', error);
      return false;
    }
  };
  
  /**
   * Get duration of the recording in milliseconds
   * @returns {number} Duration in ms
   */
  const getDuration = () => {
    if (events.length === 0) return 0;
    
    const lastEventTime = Math.max(...events.map(event => event.recordTime));
    return lastEventTime;
  };
  
  /**
   * Clear the recording
   */
  const clearRecording = () => {
    events = [];
    startTime = null;
    stopTime = null;
  };
  
  return {
    startRecording,
    stopRecording,
    processMidiMessage,
    getRecording,
    playRecording,
    exportToMIDI,
    exportToJSON,
    importFromJSON,
    getDuration,
    clearRecording,
    // Expose state getters
    isRecording: () => isRecording,
    getStartTime: () => startTime,
    getStopTime: () => stopTime,
    getEventCount: () => events.length
  };
};

/**
 * Encode an integer to a variable-length quantity for MIDI
 * @param {number} value - Integer value to encode
 * @returns {Array} Bytes of the encoded value
 */
function encodeVariableLength(value) {
  if (value < 0) {
    throw new Error('Cannot encode negative value');
  }
  
  if (value < 128) {
    return [value];
  }
  
  const bytes = [];
  let remaining = value;
  
  while (remaining > 0) {
    let byte = remaining & 0x7F; // Get 7 least significant bits
    remaining >>= 7;
    
    if (bytes.length > 0) {
      byte |= 0x80; // Set highest bit for continuation
    }
    
    bytes.unshift(byte); // Add to beginning
  }
  
  // Set highest bit for all except the last byte
  for (let i = 0; i < bytes.length - 1; i++) {
    bytes[i] |= 0x80;
  }
  
  return bytes;
}

/**
 * Encode a 32-bit integer to 4 bytes
 * @param {number} value - Integer value to encode
 * @returns {Array} 4 bytes of the encoded value
 */
function encodeInt32(value) {
  return [
    (value >> 24) & 0xFF,
    (value >> 16) & 0xFF,
    (value >> 8) & 0xFF,
    value & 0xFF
  ];
}

export default createMidiRecorder;