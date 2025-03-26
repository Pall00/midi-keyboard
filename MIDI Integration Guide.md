# Comprehensive Guide: Using MIDI with react-piano-keyboard

This guide covers how to integrate MIDI functionality with the react-piano-keyboard component, with a focus on recognizing and processing notes from external sources such as music XML files. It includes our latest utilities for note recognition, MusicXML integration, and MIDI recording.

## Table of Contents

1. [MIDI Setup](#midi-setup)
2. [Handling MIDI Events](#handling-midi-events)
3. [Working with MIDI Notes](#working-with-midi-notes)
4. [Recognizing Notes from External Sources](#recognizing-notes-from-external-sources)
5. [New Utilities](#new-utilities)
   - [Note Recognition Module](#note-recognition-module)
   - [MusicXML Integration](#musicxml-integration)
   - [MIDI Recording](#midi-recording)
6. [Advanced Usage](#advanced-usage)
7. [Troubleshooting](#troubleshooting)

## MIDI Setup

### Basic MIDI Integration

The simplest way to enable MIDI in your application is to use the `Piano` component with MIDI enabled:

```jsx
import { Piano } from 'react-piano-keyboard';

function MyPianoApp() {
  // Handle MIDI messages
  const handleMidiMessage = (message) => {
    console.log('MIDI message received:', message);
    // Process message based on type
    if (message.type === 'noteon') {
      console.log(`Note on: ${message.note}, velocity: ${message.velocity}`);
    } else if (message.type === 'noteoff') {
      console.log(`Note off: ${message.note}`);
    }
  };

  return (
    <Piano 
      enableMidi={true}
      onMidiMessage={handleMidiMessage}
      showControls={true}
      keyRange={{ startNote: 'C3', endNote: 'C6' }}
    />
  );
}
```

### Using the MIDI Hooks Directly

For more control, use the `useMidiConnectionManager` hook:

```jsx
import { useState } from 'react';
import { useMidiConnectionManager, CONNECTION_STATUS } from 'react-piano-keyboard';
import { Keyboard } from 'react-piano-keyboard';

function MidiKeyboard() {
  const [activeNotes, setActiveNotes] = useState([]);

  // Handle MIDI messages
  const handleMidiMessage = (message) => {
    if (message.type === 'noteon') {
      // Add note to active notes
      setActiveNotes(prev => [...prev, message.note]);
    } else if (message.type === 'noteoff') {
      // Remove note from active notes
      setActiveNotes(prev => prev.filter(note => note !== message.note));
    }
  };

  // Initialize MIDI connection manager
  const {
    connectionStatus,
    inputs,
    selectedInput,
    errorInfo,
    connectToDevice,
    disconnect,
    refreshDevices
  } = useMidiConnectionManager({
    onMidiMessage: handleMidiMessage,
    autoConnect: true,
    debug: true
  });

  return (
    <div>
      <h2>MIDI Status: {connectionStatus}</h2>
      {/* MIDI device selector */}
      <select onChange={(e) => connectToDevice(e.target.value)}>
        <option value="">Select MIDI device</option>
        {inputs.map(input => (
          <option key={input.id} value={input.id}>
            {input.name}
          </option>
        ))}
      </select>
      <button onClick={refreshDevices}>Refresh</button>
      
      {/* Piano Keyboard showing active notes */}
      <Keyboard
        activeNotes={activeNotes}
        onNoteOn={() => {}}
        onNoteOff={() => {}}
      />
    </div>
  );
}
```

### Using Pre-built MIDI Components

For a complete solution, use the built-in MIDI components:

```jsx
import { Piano, MidiManager, MidiDeviceSelector } from 'react-piano-keyboard';

function CompleteMidiApp() {
  // Track active notes
  const [activeNotes, setActiveNotes] = useState([]);

  // Handle MIDI messages
  const handleMidiMessage = (message) => {
    // Process message based on type
    switch(message.type) {
      case 'noteon':
        setActiveNotes(prev => [...prev, message.note]);
        break;
      case 'noteoff':
        setActiveNotes(prev => prev.filter(note => note !== message.note));
        break;
      // Handle other types as needed
    }
  };

  return (
    <div>
      <MidiManager 
        onMidiMessage={handleMidiMessage}
        onConnectionChange={(status) => console.log('MIDI connection status:', status)}
      />
      
      <Piano
        activeNotes={activeNotes}
        enableMidi={true}
        onMidiMessage={handleMidiMessage}
      />
    </div>
  );
}
```

## Handling MIDI Events

### MIDI Message Structure

The MIDI messages received through the `onMidiMessage` callback have the following structure:

```javascript
// Note On message
{
  type: 'noteon',
  note: 'C4',        // Note name in string format
  velocity: 0.75,    // Normalized velocity (0-1)
  rawNote: {         // Raw WebMIDI note object
    number: 60,      // MIDI note number
    name: 'C',       // Note name
    octave: 4,       // Octave
    // Other properties from WebMIDI
  },
  source: 'MIDI Device Name',
  timestamp: 1678901234567
}

// Note Off message
{
  type: 'noteoff',
  note: 'C4',
  rawNote: { /* WebMIDI note object */ },
  source: 'MIDI Device Name',
  timestamp: 1678901235000
}

// Control Change message (e.g., sustain pedal)
{
  type: 'controlchange',
  controller: 64,    // Controller number (64 = sustain pedal)
  value: 127,        // Raw value (0-127)
  control: 'sustain',
  isOn: true,        // Boolean interpretation
  source: 'MIDI Device Name',
  timestamp: 1678901236000
}
```

### Processing Different Message Types

```javascript
const handleMidiMessage = (message) => {
  switch(message.type) {
    case 'noteon':
      if (message.velocity === 0) {
        // Some devices send note-off as note-on with velocity 0
        handleNoteOff(message.note);
      } else {
        handleNoteOn(message.note, message.velocity);
      }
      break;
      
    case 'noteoff':
      handleNoteOff(message.note);
      break;
      
    case 'controlchange':
      if (message.controller === 64) {
        // Handle sustain pedal
        handleSustain(message.isOn);
      }
      // Handle other controllers as needed
      break;
      
    default:
      // Ignore other message types or log for debugging
      console.log('Unhandled MIDI message type:', message.type);
  }
};
```

## Working with MIDI Notes

### Converting Between Note Formats

The library provides utilities for converting between different note formats:

```javascript
import { 
  midiNoteToNoteName, 
  getMidiNoteNumber,
  parseNote 
} from 'react-piano-keyboard';

// Convert MIDI note number to note name
const noteName = midiNoteToNoteName(60);  // Returns "C4"

// Convert note name to MIDI note number
const noteNumber = getMidiNoteNumber("C4"); // Returns 60

// Parse a note into components
const noteComponents = parseNote("C#4"); 
// Returns { noteName: "C", isSharp: true, octave: 4, fullName: "C#" }
```

### Analyzing and Recognizing Chords

The library now includes chord recognition capabilities:

```javascript
import { recognizeChord } from 'react-piano-keyboard';

// Recognize a C major chord
const chord = recognizeChord(['C4', 'E4', 'G4']); // Returns "C4 major"

// Works with MIDI numbers too
const chord2 = recognizeChord([60, 64, 67]); // Returns "C4 major"
```

### Matching Notes from Different Sources

When working with notes from different sources (e.g., MIDI input and music XML):

```javascript
import { getMidiNoteNumber } from 'react-piano-keyboard';

// Example of matching MIDI input with notes from music XML
function matchMidiWithMusicXML(midiNote, musicXmlNotes) {
  // Convert the MIDI note to a number for comparison
  const midiNoteNum = typeof midiNote === 'string' 
    ? getMidiNoteNumber(midiNote) 
    : midiNote;
    
  // Check if this note is expected in our music XML data
  return musicXmlNotes.some(xmlNote => {
    // Convert music XML note to MIDI note number for comparison
    // This depends on how your XML parser represents notes
    const xmlNoteNum = xmlNoteToPitchClass(xmlNote);
    return xmlNoteNum === midiNoteNum;
  });
}

// This function would convert your XML representation to MIDI numbers
function xmlNoteToPitchClass(xmlNote) {
  // Implementation depends on your XML parser
  // For example with a library like MusicXML.js:
  const step = xmlNote.getPitch().getStep(); // e.g., "C"
  const octave = xmlNote.getPitch().getOctave(); // e.g., 4
  const alter = xmlNote.getPitch().getAlter(); // e.g., 1 for sharp
  
  // Convert to a note name
  let noteName = step;
  if (alter === 1) noteName += '#';
  else if (alter === -1) noteName += 'b';
  noteName += octave;
  
  // Convert to MIDI note number
  return getMidiNoteNumber(noteName);
}
```

## Recognizing Notes from External Sources

### Detecting Correctly Played Notes

```javascript
import { useEffect, useState } from 'react';
import { Piano, getMidiNoteNumber } from 'react-piano-keyboard';

function NoteRecognitionApp({ expectedNotes }) {
  const [activeNotes, setActiveNotes] = useState([]);
  const [correctNotes, setCorrectNotes] = useState([]);
  const [incorrectNotes, setIncorrectNotes] = useState([]);
  
  // Convert expected notes to MIDI note numbers for easier comparison
  const expectedMidiNotes = expectedNotes.map(note => 
    typeof note === 'string' ? getMidiNoteNumber(note) : note
  );
  
  const handleMidiMessage = (message) => {
    if (message.type === 'noteon') {
      // Add to active notes
      setActiveNotes(prev => [...prev, message.note]);
      
      // Check if this is an expected note
      const midiNum = message.rawNote.number;
      if (expectedMidiNotes.includes(midiNum)) {
        setCorrectNotes(prev => [...prev, message.note]);
      } else {
        setIncorrectNotes(prev => [...prev, message.note]);
      }
      
    } else if (message.type === 'noteoff') {
      // Remove from active notes
      setActiveNotes(prev => prev.filter(note => note !== message.note));
      setCorrectNotes(prev => prev.filter(note => note !== message.note));
      setIncorrectNotes(prev => prev.filter(note => note !== message.note));
    }
  };
  
  return (
    <div>
      <Piano
        enableMidi={true}
        onMidiMessage={handleMidiMessage}
        activeNotes={activeNotes}
        // Highlight correctly played notes
        highlightedNotes={correctNotes}
        // Custom themes could be used to show incorrect notes differently
      />
      
      <div>
        <h3>Correct Notes: {correctNotes.join(', ')}</h3>
        <h3>Incorrect Notes: {incorrectNotes.join(', ')}</h3>
      </div>
    </div>
  );
}
```

### Integration with MusicXML Parser

With the new MusicXML utilities, integration is much simpler:

```jsx
import { useState, useEffect } from 'react';
import { 
  Piano, 
  extractNotesFromMusicXML, 
  compareMidiWithExpected,
  musicXmlToNoteName 
} from 'react-piano-keyboard';

function SightReadingExercise({ musicXmlFile }) {
  const [expectedNotes, setExpectedNotes] = useState([]);
  const [currentNotes, setCurrentNotes] = useState([]);
  const [playedNotes, setPlayedNotes] = useState([]);
  const [correctlyPlayed, setCorrectlyPlayed] = useState(0);
  
  // Parse MusicXML file to extract notes
  useEffect(() => {
    if (!musicXmlFile) return;
    
    // Load and parse the MusicXML file
    const reader = new FileReader();
    reader.onload = (e) => {
      const xmlData = e.target.result;
      
      // Use built-in extraction utility
      const notes = extractNotesFromMusicXML(xmlData);
      setExpectedNotes(notes);
      setCurrentNotes(notes.slice(0, 4)); // Start with first 4 notes
    };
    reader.readAsText(musicXmlFile);
  }, [musicXmlFile]);
  
  const handleMidiMessage = (message) => {
    if (message.type === 'noteon') {
      // Compare the played note with expected notes
      const result = compareMidiWithExpected(message, currentNotes);
      setPlayedNotes(prev => [...prev, result.played.midiNumber]);
      
      if (result.match) {
        // Note was correctly played
        setCorrectlyPlayed(prev => prev + 1);
        
        // Remove the played note and add the next note
        const nextNotes = [...currentNotes];
        nextNotes.splice(result.matchedIndex, 1);
        
        const nextNoteIndex = correctlyPlayed + currentNotes.length;
        if (nextNoteIndex < expectedNotes.length) {
          nextNotes.push(expectedNotes[nextNoteIndex]);
        }
        
        setCurrentNotes(nextNotes);
      }
    }
  };
  
  return (
    <div>
      <div className="score-display">
        {/* Display the sheet music here with your preferred notation renderer */}
      </div>
      
      <Piano
        enableMidi={true}
        onMidiMessage={handleMidiMessage}
        // Highlight expected notes 
        highlightedNotes={currentNotes.map(note => note.noteName)}
      />
      
      <div className="stats">
        <p>Notes correctly played: {correctlyPlayed}</p>
        <p>Remaining notes: {expectedNotes.length - correctlyPlayed}</p>
      </div>
    </div>
  );
}
```

## New Utilities

### Note Recognition Module

The library now includes a powerful note recognition module that makes it easy to match notes, recognize chords, and analyze timing:

```javascript
import { 
  notesMatch, 
  noteInExpectedSet, 
  recognizeChord,
  createNoteMatchingListener,
  createTimingAnalyzer
} from 'react-piano-keyboard';

// Compare individual notes
const isMatch = notesMatch('C4', 60); // true

// Check if a note is in an expected set
const isExpected = noteInExpectedSet('E4', ['C4', 'E4', 'G4']); // true

// Create a note matcher with callbacks
const noteMatcher = createNoteMatchingListener(
  (note) => console.log(`Matched: ${note}`),
  (note) => console.log(`Mismatched: ${note}`)
);

// Set the expected notes
noteMatcher.setExpectedNotes(['C4', 'E4', 'G4']);

// Process MIDI messages 
noteMatcher.handleMidiMessage(midiMessage);

// Analyze timing and rhythm
const timingAnalyzer = createTimingAnalyzer();
timingAnalyzer.setTempo(120); // Set tempo to 120 BPM

// Process notes
timingAnalyzer.handleMidiMessage(midiMessage);

// Get timing analysis
const rhythmAnalysis = timingAnalyzer.analyzeRhythm();
console.log(rhythmAnalysis);
```

### MusicXML Integration

The library provides comprehensive utilities for working with MusicXML files:

```javascript
import { 
  extractNotesFromMusicXML,
  extractMeasuresFromMusicXML,
  compareMidiWithExpected,
  musicXmlToNoteName,
  convertXmlTimingToMs
} from 'react-piano-keyboard';

// Extract notes from a MusicXML file
const notes = extractNotesFromMusicXML(xmlData);

// Extract measures (containing notes)
const measures = extractMeasuresFromMusicXML(xmlData);

// Compare a MIDI message with expected notes from MusicXML
const comparisonResult = compareMidiWithExpected(midiMessage, notes);

// Convert MusicXML timing to milliseconds
const durationMs = convertXmlTimingToMs(
  divisions,  // Divisions per quarter note from MusicXML
  duration,   // Duration value from MusicXML
  tempo       // Tempo in BPM
);

// Create a simple MusicXML for testing
const simpleXml = createSimpleMusicXML(['C4', 'D4', 'E4', 'F4']);
```

### MIDI Recording

The library includes a MIDI recorder that can capture, play back, and export performances:

```javascript
import { createMidiRecorder } from 'react-piano-keyboard';

// Create a recorder instance
const recorder = createMidiRecorder();

// Start recording
recorder.startRecording();

// Process MIDI messages during recording
recorder.processMidiMessage(midiMessage);

// Stop recording
recorder.stopRecording();

// Play back the recording
recorder.playRecording(
  // Note on function
  (note, velocity) => pianoRef.current.playNotes([note], 500, velocity),
  // Note off function (handled automatically by playNotes)
  () => {},
  // Completion callback
  () => console.log('Playback complete')
);

// Export recording to JSON
const jsonData = recorder.exportToJSON();

// Export to MIDI file format
const midiFileData = recorder.exportToMIDI();

// Import from previously exported JSON
recorder.importFromJSON(jsonData);
```

## Advanced Usage

### Context API for State Management

For more complex applications, use the piano context:

```jsx
import { useState, useEffect } from 'react';
import { 
  PianoProvider, 
  usePianoContext, 
  Keyboard, 
  MidiManager 
} from 'react-piano-keyboard';

// Piano component with MIDI using context
function PianoWithContext() {
  const { 
    activeNotes, 
    handleNoteOn, 
    handleNoteOff, 
    midiEnabled, 
    midiInputs, 
    connectMidiDevice 
  } = usePianoContext();
  
  return (
    <div>
      <MidiManager />
      
      <Keyboard
        activeNotes={activeNotes}
        onNoteOn={handleNoteOn}
        onNoteOff={handleNoteOff}
      />
      
      <div className="midi-status">
        <h3>MIDI Enabled: {midiEnabled ? 'Yes' : 'No'}</h3>
        <h3>Available Devices: {midiInputs.length}</h3>
      </div>
    </div>
  );
}

// Main app with context provider
function MusicApp() {
  const [musicXmlData, setMusicXmlData] = useState(null);
  
  // Load music XML data
  useEffect(() => {
    fetch('/path/to/score.xml')
      .then(response => response.text())
      .then(data => setMusicXmlData(data));
  }, []);
  
  return (
    <PianoProvider 
      initialSettings={{
        keyRange: { startNote: 'C3', endNote: 'C6' },
        autoConnectMidi: true,
        midiDebug: true
      }}
    >
      <PianoWithContext />
      
      {musicXmlData && (
        <ScoreViewer xmlData={musicXmlData} />
      )}
    </PianoProvider>
  );
}

// Component to display the music score
function ScoreViewer({ xmlData }) {
  const { activeNotes, playNotes } = usePianoContext();
  
  // Function to play notes from score
  const playMeasure = (measure) => {
    // Extract notes from the measure
    const notes = extractNotesFromMeasure(measure, xmlData);
    
    // Play the notes using the context function
    playNotes(notes.map(note => getMidiNoteNumber(note)), 1000);
  };
  
  return (
    <div className="score-viewer">
      {/* Render score and measures with your preferred renderer */}
      <button onClick={() => playMeasure(1)}>Play Measure 1</button>
    </div>
  );
}
```

### Custom MIDI Processing with New Utilities

Using the new utilities simplifies advanced MIDI processing:

```jsx
import { useEffect, useRef } from 'react';
import { 
  Piano, 
  createTimingAnalyzer, 
  createMidiRecorder 
} from 'react-piano-keyboard';

function AdvancedMidiProcessing() {
  // Create refs for our utilities
  const timingAnalyzerRef = useRef(createTimingAnalyzer());
  const midiRecorderRef = useRef(createMidiRecorder());
  
  // Set up on component mount
  useEffect(() => {
    // Configure timing analyzer
    timingAnalyzerRef.current.setTempo(120); // 120 BPM
    
    // Start recording automatically
    midiRecorderRef.current.startRecording();
    
    return () => {
      // Stop recording on unmount
      if (midiRecorderRef.current.isRecording()) {
        midiRecorderRef.current.stopRecording();
      }
    };
  }, []);
  
  // Process MIDI message using our utilities
  const processMidiMessage = (message) => {
    // Process with timing analyzer
    timingAnalyzerRef.current.handleMidiMessage(message);
    
    // Record the message
    midiRecorderRef.current.processMidiMessage(message);
    
    // Analyze timing for note-off events
    if (message.type === 'noteoff' || (message.type === 'noteon' && message.velocity === 0)) {
      const timings = timingAnalyzerRef.current.getNoteTimings();
      const noteNum = message.rawNote.number;
      
      if (timings[noteNum] && timings[noteNum].duration !== null) {
        console.log(`Note ${message.note} played for ${timings[noteNum].duration}ms`);
        
        // Get rhythm analysis
        const rhythmAnalysis = timingAnalyzerRef.current.analyzeRhythm();
        if (rhythmAnalysis[noteNum]) {
          console.log(`Rhythm accuracy: ${rhythmAnalysis[noteNum].accuracy}%`);
        }
      }
    }
  };
  
  // Save recording to JSON
  const saveRecording = () => {
    const jsonData = midiRecorderRef.current.exportToJSON();
    
    // Create downloadable file
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'midi-recording.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <>
      <Piano
        enableMidi={true}
        onMidiMessage={processMidiMessage}
      />
      <button onClick={saveRecording}>Save Recording</button>
    </>
  );
}
```

## Troubleshooting

### Common MIDI Issues

1. **MIDI Devices Not Detected**:
   ```javascript
   // Debug MIDI detection issues
   import { isMidiSupported } from 'react-piano-keyboard';
   
   if (!isMidiSupported()) {
     console.error("Web MIDI API not supported in this browser");
   }
   
   // Use the debug option in useMidiConnectionManager
   const midi = useMidiConnectionManager({
     debug: true,
     onMidiMessage: handleMessage
   });
   
   // Check browser console for detailed logs
   ```

2. **Note Recognition Not Working**:
   ```javascript
   // Debug note recognition
   import { notesMatch, noteInExpectedSet } from 'react-piano-keyboard';
   
   // Test specific note matching
   console.log(notesMatch('C4', 60)); // Should be true
   console.log(noteInExpectedSet('E4', ['C4', 'E4', 'G4'])); // Should be true
   
   // Create a debug note matcher
   const debugMatcher = createNoteMatchingListener(
     (note) => console.log(`✓ Matched: ${note}`),
     (note) => console.log(`✗ Mismatched: ${note}`)
   );
   
   // Log expected notes
   console.log("Expected notes:", expectedNotes);
   
   // Set expected notes and log them
   debugMatcher.setExpectedNotes(expectedNotes);
   
   // Pass this to your MIDI processor
   ```

2. **MIDI Permission Denied**:
   ```javascript
   // Handle permission errors
   const { errorInfo } = useMidiConnectionManager({
     onMidiMessage: handleMessage
   });
   
   useEffect(() => {
     if (errorInfo?.code === 'PERMISSION_DENIED') {
       alert("Please grant permission to access MIDI devices.");
     }
   }, [errorInfo]);
   ```

3. **MusicXML Integration Issues**:
   ```javascript
   // Debug MusicXML parsing
   import { extractNotesFromMusicXML } from 'react-piano-keyboard';
   
   // Load the XML file and log extracted notes
   fetch('your-music-file.xml')
     .then(response => response.text())
     .then(xmlData => {
       const notes = extractNotesFromMusicXML(xmlData);
       console.log('Extracted notes:', notes);
       
       // Check for specific notes
       const cNote = notes.find(note => note.noteName === 'C4');
       console.log('Found C4?', !!cNote);
       
       // Check for properties
       notes.forEach((note, index) => {
         if (!note.noteName || !note.midiNumber) {
           console.warn(`Note at index ${index} is missing properties:`, note);
         }
       });
     })
     .catch(error => console.error('XML parsing error:', error));
   ```

4. **MIDI Recording Issues**:
   ```javascript
   // Debug MIDI recording
   import { createMidiRecorder } from 'react-piano-keyboard';
   
   const recorder = createMidiRecorder();
   
   // Start with debug logging
   console.log('Starting recording...');
   recorder.startRecording();
   
   // Log each message as it's processed
   const processWithLogging = (message) => {
     console.log('Processing message:', message);
     recorder.processMidiMessage(message);
     
     // Log recording status periodically
     if (message.type === 'noteoff') {
       console.log('Current recording length:', recorder.getEventCount());
     }
   };
   
   // Log export attempts
   const debugExport = () => {
     console.log('Exporting recording...');
     const json = recorder.exportToJSON();
     console.log('Export successful, size:', json.length);
     return json;
   };
   ```

### Browser Compatibility

The Web MIDI API is not supported in all browsers. Current support:

* Chrome: Full support
* Edge: Full support
* Opera: Full support
* Firefox: Requires enabling the `dom.webmidi.enabled` flag
* Safari: Limited support in recent versions

To provide better user experience:

```jsx
import { isMidiSupported } from 'react-piano-keyboard';

function MidiAppWithFallback() {
  if (!isMidiSupported()) {
    return (
      <div className="browser-warning">
        <h2>MIDI Not Supported</h2>
        <p>Your browser doesn't support MIDI input. Please use Chrome, Edge, or Opera for MIDI functionality.</p>
        {/* Provide fallback UI here */}
      </div>
    );
  }
  
  return <YourMidiApp />;
}
```