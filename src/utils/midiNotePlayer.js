/**
 * Import the note conversion function from midiUtils
 */
import { midiNoteToNoteName } from './midiUtils';

/**
 * Creates a function to play multiple notes programmatically
 * 
 * @param {Object} dependencies - Required dependencies
 * @param {Function} dependencies.startAudio - Function to start audio context
 * @param {Function} dependencies.handleNoteOn - Function to activate a note
 * @param {Function} dependencies.handleNoteOff - Function to deactivate a note
 * @param {boolean} dependencies.audioStarted - Whether audio is already started
 * @param {Object} dependencies.noteTimeoutsRef - Ref object to store timeouts
 * @returns {Function} The playNotes function
 */
export const createPlayNotesFunction = ({
  startAudio,
  handleNoteOn,
  handleNoteOff,
  audioStarted,
  noteTimeoutsRef,
}) => {
  /**
   * Plays multiple notes programmatically
   * @param {Array} midiNotes - Array of MIDI note numbers to play
   * @param {number} duration - Duration in milliseconds to hold the notes (default: 500ms)
   * @param {number} velocity - Velocity of the note (0-1, default: 0.7)
   */
  return async (midiNotes, duration = 500, velocity = 0.7) => {
    // Helper function to play the notes
    const playTheNotes = () => {
      // Clear any existing timeouts for these notes
      midiNotes.forEach(midiNote => {
        if (noteTimeoutsRef.current[midiNote]) {
          clearTimeout(noteTimeoutsRef.current[midiNote]);
        }
      });
  
      // Play each note
      midiNotes.forEach(midiNote => {
        const noteName = midiNoteToNoteName(midiNote);
        if (noteName) {
          // Activate note - using 'api' as source to distinguish from user interaction
          handleNoteOn(noteName, 'api');
          
          // Set timeout to deactivate the note after duration
          noteTimeoutsRef.current[midiNote] = setTimeout(() => {
            handleNoteOff(noteName, 'api');
            delete noteTimeoutsRef.current[midiNote];
          }, duration);
        }
      });
    };

    if (!audioStarted) {
      // Start audio context if not started
      const success = await startAudio();
      if (success) {
        // Delay slightly to ensure audio context is ready
        setTimeout(playTheNotes, 50);
      } else {
        console.error('Failed to start audio context');
      }
    } else {
      playTheNotes();
    }
  };
}; 

// Export the midiNoteToNoteName function for backward compatibility
export { midiNoteToNoteName };