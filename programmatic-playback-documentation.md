# Using the Programmatic Note Playback Feature in react-piano-keyboard

## Overview

The react-piano-keyboard component now includes a powerful feature that allows you to programmatically play notes and chords without requiring physical keyboard input or MIDI devices. This document explains how to use this feature in your application that uses react-piano-keyboard as a dependency.

## Installation

Ensure you have the latest version of react-piano-keyboard installed in your project:

```bash
npm install react-piano-keyboard
```

## Two Ways to Use the Feature

There are two ways to programmatically play notes on the piano keyboard:

### 1. Using a ref to the Piano component

```jsx
import React, { useRef } from 'react';
import { Piano } from 'react-piano-keyboard';

function MyPianoApp() {
  // Create a ref for the Piano
  const pianoRef = useRef(null);
  
  // Function to play a C major chord
  const playCMajorChord = () => {
    // Call playNotes with an array of MIDI note numbers
    pianoRef.current.playNotes(['60', '64', '67'], 1000); // Play for 1 second
  };
  
  return (
    <div>
      <Piano
        ref={pianoRef}
        showControls={true}
        enableKeyboard={true}
        keyRange={{ startNote: 'C3', endNote: 'B5' }}
      />
      <button onClick={playCMajorChord}>Play C Major</button>
    </div>
  );
}
```

### 2. Using the PianoContext

```jsx
import React from 'react';
import { Piano, PianoProvider, usePianoContext } from 'react-piano-keyboard';

// Child component that accesses the piano context
function PianoControls() {
  // Get the playNotes function from context
  const { playNotes } = usePianoContext();
  
  // Function to play a G major chord
  const playGMajorChord = () => {
    playNotes(['55', '59', '62', '67'], 1000); // Play for 1 second
  };
  
  return (
    <div>
      <button onClick={playGMajorChord}>Play G Major</button>
    </div>
  );
}

// Parent component that provides the context
function MyPianoApp() {
  return (
    <PianoProvider>
      <Piano 
        showControls={true}
        enableKeyboard={true}
        keyRange={{ startNote: 'C3', endNote: 'B5' }}
      />
      <PianoControls />
    </PianoProvider>
  );
}
```

## playNotes API

The `playNotes` function accepts the following parameters:

```js
playNotes(midiNotes, duration, velocity)
```

- **midiNotes** (required): Array of MIDI note numbers as strings or numbers (e.g., `['60', '64', '67']` or `[60, 64, 67]`)
- **duration** (optional): Duration in milliseconds to hold the notes (default: 500ms)
- **velocity** (optional): Velocity of the note from 0 to 1 (default: 0.7)

## Utility Functions

The library also exports utility functions for working with MIDI notes:

```jsx
import { midiNoteToNoteName } from 'react-piano-keyboard';

// Convert MIDI note number to note name
const noteName = midiNoteToNoteName('60'); // Returns "C4"
```

## Common Chords Reference

Here are some common chord patterns you can use:

```jsx
const chords = {
  'C Major': ['60', '64', '67'],      // C E G
  'G Major': ['55', '59', '62', '67'], // G B D G
  'F Major': ['53', '57', '60', '65'], // F A C F
  'A Minor': ['57', '60', '64'],      // A C E
  'D Minor': ['50', '53', '57', '62'], // D F A D
  'E7': ['52', '56', '59', '64'],     // E G# B D
};
```

## MIDI Note Reference

MIDI note numbers correspond to specific notes on the piano:

- Middle C = 60
- Each semitone = +1 or -1
- Each octave = +12 or -12

## Practical Example: Implementing a Piano Learning App

Here's a more complete example of how you might use this feature in a piano learning app:

```jsx
import React, { useState, useRef } from 'react';
import { Piano } from 'react-piano-keyboard';

function PianoLearningApp() {
  const pianoRef = useRef(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  
  // Sample exercises
  const exercises = {
    beginner: {
      name: 'C Major Scale',
      notes: ['60', '62', '64', '65', '67', '69', '71', '72'],
      noteNames: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    },
    intermediate: {
      name: 'C Major Chord Exercise',
      notes: [
        ['60', '64', '67'], // C major
        ['62', '65', '69'], // D minor
        ['64', '67', '71'], // E minor
        ['65', '69', '72'], // F major
      ],
      noteNames: ['C major', 'D minor', 'E minor', 'F major'],
    }
  };
  
  const startExercise = (level) => {
    setCurrentExercise(exercises[level]);
    
    if (level === 'beginner') {
      // Play notes in sequence for scale exercise
      const playScale = (index = 0) => {
        if (index >= exercises.beginner.notes.length) return;
        
        pianoRef.current.playNotes([exercises.beginner.notes[index]], 500);
        setTimeout(() => playScale(index + 1), 600);
      };
      
      playScale();
    } else if (level === 'intermediate') {
      // Play chords in sequence for chord exercise
      const playChords = (index = 0) => {
        if (index >= exercises.intermediate.notes.length) return;
        
        pianoRef.current.playNotes(exercises.intermediate.notes[index], 1000);
        setTimeout(() => playChords(index + 1), 1200);
      };
      
      playChords();
    }
  };
  
  return (
    <div>
      <h1>Piano Learning App</h1>
      
      <Piano
        ref={pianoRef}
        showControls={true}
        enableKeyboard={true}
        keyRange={{ startNote: 'C3', endNote: 'C6' }}
        width={800}
      />
      
      <div className="exercise-controls">
        <button onClick={() => startExercise('beginner')}>
          Start Beginner Exercise
        </button>
        <button onClick={() => startExercise('intermediate')}>
          Start Intermediate Exercise
        </button>
      </div>
      
      {currentExercise && (
        <div className="current-exercise">
          <h2>Now Playing: {currentExercise.name}</h2>
          <p>Listen to the notes and try to play them back!</p>
        </div>
      )}
    </div>
  );
}
```

## Auto-Starting Audio Context

The piano requires user interaction to start the audio context due to browser restrictions. The `playNotes` function handles this automatically by attempting to start the audio context if it hasn't been started yet. However, it's good practice to have a visible "Start Audio" button for better user experience.

## Performance Considerations

- For sequences of notes or complex melodies, it's better to call `playNotes` with proper timing rather than making many rapid calls
- For long-running applications, clear any note timeouts when components unmount to prevent memory leaks

## Browser Compatibility

This feature relies on the Web Audio API, which is supported in all modern browsers. However, some older browsers may have limited support. The library includes utility functions to check audio support:

```jsx
import { isWebAudioSupported } from 'react-piano-keyboard';

if (!isWebAudioSupported()) {
  // Show fallback UI or warning
}
``` 