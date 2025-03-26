// src/utils/MusicXMLUtils.js
import { getMidiNoteNumber, getMidiNoteName } from './midiUtils';

/**
 * Music XML Utilities
 * 
 * Utility functions for working with MusicXML files and integrating with MIDI input.
 * These functions help with parsing notes from MusicXML, matching MIDI input to expected notes,
 * and other common operations when working with music notation.
 */

/**
 * Convert step, octave, and alter from MusicXML to note name
 * @param {string} step - Note step (C, D, E, F, G, A, B)
 * @param {number} octave - Note octave
 * @param {number} alter - Alteration (-1 for flat, 0 for natural, 1 for sharp)
 * @returns {string} Note name in the format "C4", "C#4", etc.
 */
export const musicXmlToNoteName = (step, octave, alter = 0) => {
  let noteName = step;
  
  if (alter === 1) noteName += '#';
  else if (alter === -1) noteName += 'b';
  
  return noteName + octave;
};

/**
 * Convert MusicXML note to MIDI note number
 * @param {Object} xmlNote - MusicXML note object (structure depends on your parser)
 * @param {Object} parserInfo - Information about how the parser structures notes
 * @returns {number} MIDI note number
 */
export const musicXmlToMidiNote = (xmlNote, parserInfo = {}) => {
  // Default paths to find note information in common XML parsers
  const {
    stepPath = 'pitch.step',
    octavePath = 'pitch.octave',
    alterPath = 'pitch.alter',
    isRestPath = 'rest'
  } = parserInfo;
  
  // Helper to get nested property value
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
  };
  
  // Check if the note is a rest
  const isRest = getNestedValue(xmlNote, isRestPath) !== undefined;
  if (isRest) return null;
  
  // Extract note information
  const step = getNestedValue(xmlNote, stepPath);
  const octave = getNestedValue(xmlNote, octavePath);
  const alter = getNestedValue(xmlNote, alterPath) || 0;
  
  if (!step || octave === undefined) {
    console.error('Invalid MusicXML note structure:', xmlNote);
    return null;
  }
  
  // Convert to note name
  const noteName = musicXmlToNoteName(step, octave, alter);
  
  // Convert to MIDI note number
  return getMidiNoteNumber(noteName);
};

/**
 * Extract notes from MusicXML data
 * @param {string|Document} xmlData - MusicXML content as string or parsed Document
 * @returns {Array} Array of extracted notes as { step, octave, alter, duration, isRest }
 */
export const extractNotesFromMusicXML = (xmlData) => {
  // Parse XML if it's a string
  const xmlDoc = typeof xmlData === 'string' 
    ? new DOMParser().parseFromString(xmlData, 'text/xml')
    : xmlData;
  
  const notes = [];
  
  // Get all note elements
  const noteElements = xmlDoc.getElementsByTagName('note');
  
  // Process each note
  for (let i = 0; i < noteElements.length; i++) {
    const noteElement = noteElements[i];
    
    // Check if it's a rest
    const isRest = noteElement.getElementsByTagName('rest').length > 0;
    
    // Get duration
    const durationElement = noteElement.getElementsByTagName('duration')[0];
    const duration = durationElement ? parseInt(durationElement.textContent, 10) : null;
    
    if (!isRest) {
      // Get pitch information
      const pitchElement = noteElement.getElementsByTagName('pitch')[0];
      
      if (pitchElement) {
        const stepElement = pitchElement.getElementsByTagName('step')[0];
        const octaveElement = pitchElement.getElementsByTagName('octave')[0];
        const alterElement = pitchElement.getElementsByTagName('alter')[0];
        
        const step = stepElement ? stepElement.textContent : null;
        const octave = octaveElement ? parseInt(octaveElement.textContent, 10) : null;
        const alter = alterElement ? parseInt(alterElement.textContent, 10) : 0;
        
        if (step && octave !== null) {
          notes.push({
            step,
            octave,
            alter,
            duration,
            isRest: false,
            // Convert to note name and MIDI number for convenience
            noteName: musicXmlToNoteName(step, octave, alter),
            midiNumber: getMidiNoteNumber(musicXmlToNoteName(step, octave, alter))
          });
        }
      }
    } else {
      // It's a rest
      notes.push({
        duration,
        isRest: true
      });
    }
  }
  
  return notes;
};

/**
 * Extract measures from MusicXML data
 * @param {string|Document} xmlData - MusicXML content as string or parsed Document
 * @returns {Array} Array of measures, each containing an array of notes
 */
export const extractMeasuresFromMusicXML = (xmlData) => {
  // Parse XML if it's a string
  const xmlDoc = typeof xmlData === 'string' 
    ? new DOMParser().parseFromString(xmlData, 'text/xml')
    : xmlData;
  
  const measures = [];
  
  // Get all measure elements
  const measureElements = xmlDoc.getElementsByTagName('measure');
  
  // Process each measure
  for (let i = 0; i < measureElements.length; i++) {
    const measureElement = measureElements[i];
    const measureNumber = measureElement.getAttribute('number');
    const notes = [];
    
    // Get notes in this measure
    const noteElements = measureElement.getElementsByTagName('note');
    
    // Process each note in this measure
    for (let j = 0; j < noteElements.length; j++) {
      const noteElement = noteElements[j];
      
      // Check if it's a rest
      const isRest = noteElement.getElementsByTagName('rest').length > 0;
      
      // Get duration
      const durationElement = noteElement.getElementsByTagName('duration')[0];
      const duration = durationElement ? parseInt(durationElement.textContent, 10) : null;
      
      if (!isRest) {
        // Get pitch information
        const pitchElement = noteElement.getElementsByTagName('pitch')[0];
        
        if (pitchElement) {
          const stepElement = pitchElement.getElementsByTagName('step')[0];
          const octaveElement = pitchElement.getElementsByTagName('octave')[0];
          const alterElement = pitchElement.getElementsByTagName('alter')[0];
          
          const step = stepElement ? stepElement.textContent : null;
          const octave = octaveElement ? parseInt(octaveElement.textContent, 10) : null;
          const alter = alterElement ? parseInt(alterElement.textContent, 10) : 0;
          
          if (step && octave !== null) {
            notes.push({
              step,
              octave,
              alter,
              duration,
              isRest: false,
              noteName: musicXmlToNoteName(step, octave, alter),
              midiNumber: getMidiNoteNumber(musicXmlToNoteName(step, octave, alter))
            });
          }
        }
      } else {
        // It's a rest
        notes.push({
          duration,
          isRest: true
        });
      }
    }
    
    measures.push({
      number: measureNumber,
      notes
    });
  }
  
  return measures;
};

/**
 * Converts MusicXML timing to milliseconds
 * @param {number} divisions - Divisions per quarter note from MusicXML
 * @param {number} duration - Duration value from MusicXML
 * @param {number} tempo - Tempo in BPM
 * @returns {number} Duration in milliseconds
 */
export const convertXmlTimingToMs = (divisions, duration, tempo) => {
  const quarterNoteDuration = 60000 / tempo; // ms
  return (duration / divisions) * quarterNoteDuration;
};

/**
 * Compare MIDI input with expected notes from MusicXML
 * @param {Object} midiMessage - MIDI message object
 * @param {Array} expectedNotes - Array of expected notes from MusicXML
 * @returns {Object} Comparison result with match, expected, and played properties
 */
export const compareMidiWithExpected = (midiMessage, expectedNotes) => {
  if (midiMessage.type !== 'noteon' || midiMessage.velocity === 0) {
    return { match: false, reason: 'Not a note-on message' };
  }
  
  const playedNote = midiMessage.rawNote.number;
  const expectedMidiNotes = expectedNotes
    .filter(note => !note.isRest)
    .map(note => note.midiNumber);
  
  const matchedIndex = expectedMidiNotes.indexOf(playedNote);
  const isMatch = matchedIndex !== -1;
  
  return {
    match: isMatch,
    played: {
      midiNumber: playedNote,
      noteName: getMidiNoteName(playedNote)
    },
    expected: expectedMidiNotes.map(midiNum => ({
      midiNumber: midiNum,
      noteName: getMidiNoteName(midiNum)
    })),
    matchedIndex: isMatch ? matchedIndex : -1
  };
};

/**
 * Create a simplified MusicXML structure for testing
 * @param {Array} noteSequence - Array of note names (e.g., ["C4", "D4", "E4"])
 * @returns {string} Simple MusicXML string
 */
export const createSimpleMusicXML = (noteSequence) => {
  let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>Music</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
`;

  // Add each note to the measure
  noteSequence.forEach(noteName => {
    // Parse the note
    const match = noteName.match(/^([A-G])([#b]?)(\d+)$/);
    if (!match) {
      console.error(`Invalid note format: ${noteName}`);
      return;
    }
    
    const step = match[1];
    const accidental = match[2];
    const octave = match[3];
    
    let alter = 0;
    if (accidental === '#') alter = 1;
    if (accidental === 'b') alter = -1;
    
    xmlContent += `      <note>
        <pitch>
          <step>${step}</step>
          <octave>${octave}</octave>
${alter !== 0 ? `          <alter>${alter}</alter>` : ''}
        </pitch>
        <duration>4</duration>
        <type>quarter</type>
      </note>
`;
  });
  
  // Close the XML structure
  xmlContent += `    </measure>
  </part>
</score-partwise>`;

  return xmlContent;
};

export default {
  musicXmlToNoteName,
  musicXmlToMidiNote,
  extractNotesFromMusicXML,
  extractMeasuresFromMusicXML,
  convertXmlTimingToMs,
  compareMidiWithExpected,
  createSimpleMusicXML
};