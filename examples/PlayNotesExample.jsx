// examples/PlayNotesExample.jsx
import React, { useRef, useState } from 'react';
import { Piano, usePianoContext } from '../src';

/**
 * Example demonstrating how to programmatically play notes on the Piano
 */
const PlayNotesExample = () => {
  const pianoRef = useRef(null);
  const { playNotes } = usePianoContext();
  const [duration, setDuration] = useState(1000);
  
  // Example chord collections
  const chords = {
    'C Major': ['60', '64', '67'], // C E G
    'G Major': ['55', '59', '62', '67'], // G B D G
    'F Major': ['53', '57', '60', '65'], // F A C F
    'A Minor': ['57', '60', '64'], // A C E
    'D Minor': ['50', '53', '57', '62'], // D F A D
    'E7': ['52', '56', '59', '64'], // E G# B D
  };

  // Function to play a chord using the Piano ref method
  const playChordWithRef = (chordName) => {
    if (pianoRef.current) {
      pianoRef.current.playNotes(chords[chordName], duration);
      console.log(`Playing ${chordName} chord using ref: ${chords[chordName]}`);
    }
  };

  // Function to play a chord using the context hook
  const playChordWithContext = (chordName) => {
    playNotes(chords[chordName], duration);
    console.log(`Playing ${chordName} chord using context: ${chords[chordName]}`);
  };

  return (
    <div className="play-notes-example">
      <h2>Piano Programmatic Note Player Example</h2>
      
      <div className="piano-container">
        <Piano
          ref={pianoRef}
          showControls={true}
          enableKeyboard={true}
          enableMidi={true}
          width={800}
          keyRange={{ startNote: 'C3', endNote: 'B5' }}
        />
      </div>
      
      <div className="controls">
        <h3>Play Chords</h3>
        <div className="duration-control">
          <label>
            Note Duration (ms):
            <input
              type="range"
              min="100"
              max="3000"
              step="100"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
            />
            {duration}ms
          </label>
        </div>
        
        <div className="chord-buttons">
          <h4>Using Piano Ref:</h4>
          {Object.keys(chords).map((chordName) => (
            <button key={`ref-${chordName}`} onClick={() => playChordWithRef(chordName)}>
              Play {chordName}
            </button>
          ))}
        </div>
        
        <div className="chord-buttons">
          <h4>Using Piano Context:</h4>
          {Object.keys(chords).map((chordName) => (
            <button key={`context-${chordName}`} onClick={() => playChordWithContext(chordName)}>
              Play {chordName}
            </button>
          ))}
        </div>
      </div>
      
      <div className="usage-docs">
        <h3>How to Use</h3>
        <p>There are two ways to programmatically play notes on the keyboard:</p>
        
        <h4>1. Using a ref to the Piano component:</h4>
        <pre>
{`
// Create a ref for the Piano
const pianoRef = useRef(null);

// Play notes
pianoRef.current.playNotes(['60', '64', '67'], 1000); // Play C Major chord for 1 second
`}
        </pre>
        
        <h4>2. Using the usePianoContext hook:</h4>
        <pre>
{`
// Get the playNotes function from context
const { playNotes } = usePianoContext();

// Play notes
playNotes(['60', '64', '67'], 1000); // Play C Major chord for 1 second
`}
        </pre>
        
        <p>Each note is specified as a MIDI note number:</p>
        <ul>
          <li>Middle C = 60</li>
          <li>Each semitone = +1 or -1</li>
          <li>Each octave = +12 or -12</li>
        </ul>
      </div>
      
      <style jsx>{`
        .play-notes-example {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .piano-container {
          margin: 20px 0;
        }
        
        .controls {
          margin: 20px 0;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        
        .chord-buttons {
          margin: 20px 0;
        }
        
        .chord-buttons button {
          margin: 5px;
          padding: 8px 16px;
          background: #4285f4;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .chord-buttons button:hover {
          background: #3367d6;
        }
        
        .duration-control {
          margin: 20px 0;
        }
        
        .usage-docs {
          margin-top: 30px;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }
        
        pre {
          background: #eee;
          padding: 10px;
          border-radius: 4px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
};

export default PlayNotesExample; 